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
