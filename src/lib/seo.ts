import type { Metadata } from 'next';

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
  const isIndex = seo.metaRobotsIndex !== 'no-index';
  const isFollow = seo.metaRobotsFollow !== 'no-follow';

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
