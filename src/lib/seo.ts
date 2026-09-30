import type { Metadata } from 'next';
import { BASE_URL } from './constants';

/**
 * Converts a possibly-relative CMS image/URL path into an absolute URL, so
 * social-preview crawlers (which can't resolve relative paths) always get a
 * working image.
 */
export function getAbsoluteUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

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
