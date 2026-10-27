import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import Post from '@/models/Post';
import { BASE_URL } from '@/lib/constants';
import { resolvePostCanonical } from '@/lib/seo';
export const revalidate = 600; // rebuilt at most every 10 minutes

type Entry = MetadataRoute.Sitemap[number];

/** ISO date string, or undefined when the date is missing/invalid (so lastmod is omitted instead of faked). */
const iso = (v: any): string | undefined => {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};
const newest = (...dates: Array<string | undefined>) => dates.filter(Boolean).sort().pop();
const isNoindex = (seo: any) => seo?.metaRobotsIndex === 'noindex';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let settings: any = {};
  let contentUpdated: string | undefined;
  let services: any[] = [];
  let pages: any[] = [];
  let posts: any[] = [];

  try {
    await connectToDatabase();

    const content = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
    settings = content?.data?.settings || {};
    contentUpdated = iso(content?.lastUpdated);
    const sData = content?.data?.services;
    services = Array.isArray(sData) ? sData : (sData?.services || []);

    pages = await Page.find({ status: 'published', isTrashed: { $ne: true } }).lean();
    posts = await Post.find({ status: 'published', isTrashed: { $ne: true } }).lean();
  } catch (e) {
    console.error("Sitemap: Failed to fetch dynamic data", e);
  }

  const homepageId = String(settings?.homepageId || '');

  // Site-wide noindex (robots.txt already disallows everything): nothing should be listed.
  if (settings?.noIndexNoFollow || settings?.globalNoIndex) return [];

  // One entry per URL; the first one wins (static > services > blog > custom pages).
  const entries = new Map<string, Entry>();
  const add = (path: string, entry: Omit<Entry, 'url'>) => {
    const url = `${BASE_URL}${path}`;
    if (!entries.has(url)) entries.set(url, { url, ...entry });
  };
  const clean = (slug: any) => String(slug || '').replace(/^\/+/, '').replace(/\/+$/, '').replace(/^services\//, '');

  // Blog posts that are listed: published, indexable, and whose canonical is the post itself
  // (a post canonicalised to another post must not be submitted - the sitemap would contradict the tag).
  const listedPosts = posts.filter((p: any) => p.slug && !isNoindex(p.seo) && resolvePostCanonical(p).isSelf);
  const newestPost = newest(...posts.map((p: any) => newest(iso(p.updatedAt), iso(p.publishedAt))));

  // ── Static pages. lastmod only where it is actually known; never "now". ──
  add('/', { lastModified: contentUpdated, changeFrequency: 'weekly', priority: 1.0 });
  add('/services/', { lastModified: contentUpdated, changeFrequency: 'weekly', priority: 0.8 });
  add('/blogs/', { lastModified: newestPost, changeFrequency: 'daily', priority: 0.7 });
  add('/privacy/', { changeFrequency: 'yearly', priority: 0.3 });
  add('/terms/', { changeFrequency: 'yearly', priority: 0.3 });

  // ── Services: only live ones (a draft / trashed service answers 404, so it must not be listed). ──
  for (const s of services) {
    const slug = clean(s?.slug);
    if (!slug || s.status === 'draft' || s.isTrashed === true || isNoindex(s.seo)) continue;
    if (homepageId && (String(s._id) === homepageId || s.slug === homepageId)) continue; // served at "/"
    add(`/${slug}/`, {
      lastModified: newest(iso(s.updatedAt), iso(s.publishedAt), iso(s.createdAt)),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // ── Blog posts ──
  for (const p of listedPosts) {
    const slug = clean(p.slug);
    add(`/blogs/${slug}/`, {
      lastModified: newest(iso(p.updatedAt), iso(p.publishedAt), iso(p.createdAt)),
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  }

  // ── Custom CMS pages ──
  for (const pg of pages) {
    const slug = clean(pg.slug);
    if (!slug || slug === 'home' || pg.template === 'home' || isNoindex(pg.seo)) continue;
    if (homepageId && String(pg._id) === homepageId) continue; // served at "/"
    add(`/${slug}/`, {
      lastModified: newest(iso(pg.updatedAt), iso(pg.createdAt)),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return Array.from(entries.values());
}
