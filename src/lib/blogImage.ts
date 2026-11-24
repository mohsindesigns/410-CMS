import { localizeImageUrl } from './imageUrl';

/**
 * Normalizes a blog image URL (Cloudinary links are served from our own domain).
 * Returns an empty string when the post has no image - there is no default/fallback picture.
 */
export function normalizeBlogImage(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.includes('cloudinary.com')) return localizeImageUrl(trimmed);
  return trimmed;
}
