/**
 * Normalizes blog image URLs.
 * Handles legacy WordPress wp-content paths, Cloudinary URLs, and local uploads.
 */
export function normalizeBlogImage(url?: string | null): string {
  if (!url || typeof url !== 'string') {
    return '/images/service-massage.webp';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '/images/service-massage.webp';
  }

  // Already a Cloudinary URL
  if (trimmed.includes('cloudinary.com')) {
    return trimmed;
  }

  // Legacy WordPress wp-content path: convert to /uploads/blog/<filename>
  if (trimmed.includes('wp-content/uploads')) {
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://410-muscletherapy.com${trimmed.startsWith('/') ? '' : '/'}${trimmed}`);
      const pathname = parsed.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      if (filename) {
        // Normalize any special unicode dashes
        const cleanFilename = filename.replace(/[–—]/g, '_');
        return `/uploads/blog/${cleanFilename}`;
      }
    } catch {
      const parts = trimmed.split('/');
      const filename = parts[parts.length - 1];
      if (filename) {
        return `/uploads/blog/${filename.replace(/[–—]/g, '_')}`;
      }
    }
  }

  return trimmed;
}
