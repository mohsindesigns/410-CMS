import type { Metadata } from 'next';
import { BASE_URL } from './constants';

/**
 * Returns a page's title exactly as given, with no brand name appended.
 * Kept as a passthrough (rather than inlining `{ absolute: rawTitle }` at
 * every call site) so all page titles still route through one place.
 */
export function buildPageTitle(rawTitle: string | undefined | null): Metadata['title'] {
  const title = (rawTitle || "").trim();
  if (!title) return undefined;
  return { absolute: title };
}

/**
 * Returns robots metadata based on global setting and page-wise SEO settings.
 * If global `noIndexNoFollow` is enabled in settings, forces { index: false, follow: false }.
 * Otherwise, evaluates page-wise SEO settings.
 */
export function getRobotsMetadata(settings: any, pageSeo?: any): Metadata['robots'] {
  if (settings?.noIndexNoFollow || settings?.globalNoIndex) {
    return {
      index: false,
      follow: false,
    };
  }

  const seo = pageSeo || {};
  const isIndex = seo.metaRobotsIndex !== 'noindex';
  const isFollow = seo.metaRobotsFollow !== 'nofollow';

  return {
    index: isIndex,
    follow: isFollow,
    ...(isIndex && {
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }),
  };
}

/**
 * Canonical URL for a blog post.
 *
 * A custom canonical saved in the post's SEO tab is honoured only when it is a valid blog URL on this site
 * (/blogs/<slug>/). Anything else - a root-level URL that redirects straight back to the post (a canonical loop),
 * another host, a legacy /blog/ path - falls back to the post's own URL, because pointing a canonical at a URL
 * that redirects or does not exist makes Google ignore the tag and pick its own.
 */
export function resolvePostCanonical(post: any): { url: string; isSelf: boolean } {
  const self = `${BASE_URL}/blogs/${post?.slug}/`;
  const raw = String(post?.seo?.canonicalUrl || '').trim();
  if (!raw) return { url: self, isSelf: true };
  let u: URL;
  try {
    u = new URL(raw, BASE_URL);
  } catch {
    return { url: self, isSelf: true };
  }
  const bare = (h: string) => h.toLowerCase().replace(/^www\./, '');
  if (bare(u.host) !== bare(new URL(BASE_URL).host)) return { url: self, isSelf: true };
  let path = u.pathname.replace(/^\/blog\//, '/blogs/');
  if (!path.endsWith('/')) path += '/';
  if (!/^\/blogs\/[^/]+\/$/.test(path)) return { url: self, isSelf: true };
  const url = `${BASE_URL}${path}`;
  return { url, isSelf: url === self };
}

/**
 * Plain-text description cut at a sentence (or word) boundary instead of mid-word.
 * Strips tags, collapses whitespace/newlines and the "In This Blog, We Will Learn" boilerplate.
 */
export function smartDescription(input: any, max = 155): string {
  let t = String(input || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/^\s*in this blog,?\s*we will learn:?\s*/i, '')
    .trim();
  if (!t) return '';
  if (t.length > 0) t = t.charAt(0).toUpperCase() + t.slice(1);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (sentenceEnd >= Math.floor(max * 0.55)) return cut.slice(0, sentenceEnd + 1).trim();
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:\-–—]+$/, '') + '…';
}

/**
 * Clean a saved meta description for output: normalises whitespace/newlines, drops the "In This Blog, We Will Learn"
 * boilerplate, and if it was saved cut off mid-sentence (a raw slice of the article) trims it back to the last full
 * sentence - or the last whole word - instead of ending mid-word.
 */
export function tidyDescription(input: any, max = 160): string {
  const t = smartDescription(input, 100000);
  if (!t) return '';
  // judge 'was cut off' on the original length (the boilerplate removed above would otherwise hide a 160-char slice)
  const rawLength = String(input || '').replace(/<[^>]*>/g, ' ').replace(/s+/g, ' ').trim().length;
  const endsCleanly = /[.!?…)"”']$/.test(t);
  if (rawLength >= 140 && !endsCleanly) return smartDescription(t, t.length - 1);
  return t.length > max ? smartDescription(t, max) : t;
}
