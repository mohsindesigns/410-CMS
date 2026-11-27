import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { localizeDeep } from '@/lib/imageUrl';

// Server-only helpers that load blog cards for a page. Pages fetch their own posts here instead of
// resolving ids against the layout's short global post list (which only holds a few dozen posts).

const CARD_FIELDS = 'title slug featuredImage excerpt publishedAt createdAt author authorName categories';
const PUBLISHED = { status: 'published', isTrashed: { $ne: true } };

function toPlain(docs: any[]): any[] {
  return localizeDeep(JSON.parse(JSON.stringify(docs)));
}

function postTime(p: any): number {
  const t = new Date(p?.publishedAt || p?.createdAt || 0).getTime();
  return Number.isFinite(t) ? t : 0;
}

/** Newest first (publishedAt, then createdAt). Returns a new array. */
export function sortNewestFirst<T>(posts: T[]): T[] {
  return [...posts].sort((a: any, b: any) => postTime(b) - postTime(a));
}

/** Published, non-trashed posts for the given ids, in the given order. Unknown/draft/trashed ids are skipped. */
export async function getPostsByIds(ids: unknown, limit = 24): Promise<any[]> {
  const wanted = Array.from(
    new Set((Array.isArray(ids) ? ids : []).map(String).filter((id) => mongoose.isValidObjectId(id)))
  );
  if (wanted.length === 0) return [];
  await connectToDatabase();
  const docs: any[] = await Post.find({ ...PUBLISHED, _id: { $in: wanted } })
    .select(CARD_FIELDS)
    .populate('categories', 'name')
    .populate('author', 'name')
    .lean();
  docs.sort((a, b) => wanted.indexOf(String(a._id)) - wanted.indexOf(String(b._id)));
  return toPlain(docs.slice(0, limit));
}

/** The newest published posts. */
export async function getLatestPosts(count: number): Promise<any[]> {
  await connectToDatabase();
  const docs: any[] = await Post.find(PUBLISHED)
    .select(CARD_FIELDS)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(Math.max(1, count))
    .populate('categories', 'name')
    .populate('author', 'name')
    .lean();
  return toPlain(docs);
}

export const HOME_BLOG_DEFAULT_COUNT = 9;
export const HOME_BLOG_MAX_COUNT = 24;

/**
 * Home page blog cards, always newest first.
 * - postsMode 'picked': the articles picked in Admin > Home > Blog (falls back to newest if none are live).
 * - anything else (default): the newest `latestCount` published articles, so new posts show up automatically.
 */
export async function getHomeBlogPosts(blogSection: any): Promise<any[]> {
  try {
    if (blogSection?.postsMode === 'picked') {
      const picked = await getPostsByIds(blogSection?.selectedPosts, 100);
      if (picked.length > 0) return sortNewestFirst(picked);
    }
    const count = Math.max(1, Math.min(HOME_BLOG_MAX_COUNT, Number(blogSection?.latestCount) || HOME_BLOG_DEFAULT_COUNT));
    return await getLatestPosts(count);
  } catch (e) {
    console.error('Failed to load home blog posts', e);
    return [];
  }
}
