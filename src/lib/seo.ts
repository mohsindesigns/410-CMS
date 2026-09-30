import type { Metadata } from 'next';

const BRAND_NAME = "410 Muscle Therapy";

/**
 * Builds a Metadata `title` value with the brand name appended, unless it's
 * already present (admin typed it manually, or a hardcoded fallback already
 * has it) — in which case it's left as-is to avoid a duplicate.
 *
 * NOTE: this builds the final string directly instead of relying on Next.js's
 * `title.template` (root layout `title: { template: "%s | ..." }`). Verified
 * by build-time debug logging that the template value and page title were
 * both correct going into Next's metadata resolution, but the template still
 * wasn't applied to the rendered `<title>` in production builds (Next.js
 * 16.2.1 with Turbopack) — so it can't be trusted here.
 */
export function buildPageTitle(rawTitle: string | undefined | null): Metadata['title'] {
  const title = (rawTitle || "").trim();
  if (!title) return { absolute: BRAND_NAME };
  if (title.toLowerCase().includes(BRAND_NAME.toLowerCase())) {
    return { absolute: title };
  }
  return { absolute: `${title} | ${BRAND_NAME}` };
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
