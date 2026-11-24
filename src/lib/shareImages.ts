/**
 * Share-image (Open Graph / Twitter) lists for page metadata.
 * An image is used only when the page's own SEO fields provide one - there is no default/fallback picture.
 */
export const ogImageList = (url?: string | null) => (url ? [{ url }] : undefined);
export const twImageList = (url?: string | null) => (url ? [url] : undefined);
