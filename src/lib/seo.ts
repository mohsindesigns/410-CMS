import type { Metadata } from 'next';

const BRAND_NAME = "410 Muscle Therapy";

/**
 * Builds a Metadata `title` value that lets the root layout's title template
 * ("%s | 410 Muscle Therapy") append the brand name automatically. If the
 * given title already contains the brand name (admin typed it manually, or
 * it's a hardcoded fallback that already has it), it's returned as
 * `{ absolute: ... }` instead so the template doesn't double it up.
 */
export function buildPageTitle(rawTitle: string | undefined | null): Metadata['title'] {
  const title = (rawTitle || "").trim();
  if (!title) return undefined;
  if (title.toLowerCase().includes(BRAND_NAME.toLowerCase())) {
    return { absolute: title };
  }
  return title;
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
