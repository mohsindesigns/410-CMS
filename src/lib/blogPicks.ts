import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Page from '@/models/Page';
import { localizeDeep } from '@/lib/imageUrl';
import { getSiteContent } from '@/lib/siteContent';

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
export async function getPostsByIds(ids: unknown, limit = 24, fields: string = CARD_FIELDS): Promise<any[]> {
  const wanted = Array.from(
    new Set((Array.isArray(ids) ? ids : []).map(String).filter((id) => mongoose.isValidObjectId(id)))
  );
  if (wanted.length === 0) return [];
  await connectToDatabase();
  let query: any = Post.find({ ...PUBLISHED, _id: { $in: wanted } }).select(fields);
  if (fields === CARD_FIELDS) query = query.populate('categories', 'name').populate('author', 'name');
  const docs: any[] = await query.lean();
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

// ── Blog topic groups ────────────────────────────────────────────────────────────────────────────
// Edited in Admin > Pages > Services > "Reviews & Blog" > "Blog topics". Each group is a titled list of
// articles (optionally tied to a service). Used for the grouped article list on /services and for the
// "related articles" at the bottom of every blog post.

export interface BlogGroup {
  title?: string;
  serviceSlug?: string;
  postIds?: string[];
}

function cleanGroups(groups: unknown): BlogGroup[] {
  return (Array.isArray(groups) ? groups : []).filter((g: any) => g && Array.isArray(g.postIds));
}

/** The saved blog topic groups (services page record first, then the global content as a fallback). */
export async function getBlogGroups(): Promise<BlogGroup[]> {
  try {
    await connectToDatabase();
    const page: any = await Page.findOne({ slug: 'services', status: 'published', isTrashed: { $ne: true } })
      .select('content.servicesPageSections.blogGroups')
      .lean();
    const fromPage = cleanGroups(page?.content?.servicesPageSections?.blogGroups);
    if (fromPage.length > 0) return fromPage;
    const content = await getSiteContent();
    return cleanGroups(content?.data?.servicesPageSections?.blogGroups);
  } catch (e) {
    console.error('Failed to load blog groups', e);
    return [];
  }
}

/** Groups with their live posts (title + slug only), in the saved order. Empty groups are dropped. */
export async function getGroupedPosts(groups: unknown): Promise<{ title: string; serviceSlug?: string; posts: { _id: string; title: string; slug: string }[] }[]> {
  const list = cleanGroups(groups);
  if (list.length === 0) return [];
  const posts = await getPostsByIds(list.flatMap((g) => (g.postIds || []).map(String)), 2000, 'title slug');
  const byId = new Map(posts.map((p: any) => [String(p._id), p]));
  return list
    .map((g) => ({
      title: String(g.title || '').trim(),
      serviceSlug: g.serviceSlug ? String(g.serviceSlug) : undefined,
      posts: Array.from(new Set((g.postIds || []).map(String))).map((id) => byId.get(id)).filter(Boolean) as any[],
    }))
    .filter((g) => g.posts.length > 0);
}

/** The ids after `id` in the list, wrapping around (so each article in a group suggests different neighbours). */
function rotateAfter(ids: string[], id: string): string[] {
  const i = ids.indexOf(id);
  if (i < 0) return [];
  return [...ids.slice(i + 1), ...ids.slice(0, i)];
}

/**
 * Related article ids for a blog post, most relevant first: the other articles in its blog topic group(s),
 * then the other articles picked for the same service page(s).
 */
export async function getRelatedPostIds(postId: string): Promise<string[]> {
  const id = String(postId);
  const out: string[] = [];
  const add = (ids: string[]) => ids.forEach((x) => { if (x !== id && !out.includes(x)) out.push(x); });
  const groups = await getBlogGroups();
  groups.forEach((g) => add(rotateAfter((g.postIds || []).map(String), id)));
  try {
    const content = await getSiteContent();
    (content?.data?.services?.services || []).forEach((s: any) => {
      if (s?.status !== 'draft' && Array.isArray(s?.blogPostIds)) add(rotateAfter(s.blogPostIds.map(String), id));
    });
  } catch {
    // services are optional here
  }
  return out.filter((x) => mongoose.isValidObjectId(x));
}
