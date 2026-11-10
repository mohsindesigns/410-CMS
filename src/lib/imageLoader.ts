/**
 * Image loader for next/image (configured in next.config.ts).
 *
 * Why: the default loader produces long "/_next/image/?url=...&w=...&q=..." links. We want clean links on our own
 * domain instead, so images stored on Cloudinary are requested as
 *
 *     /cdn-images/c_limit,w_<width>/<path>        e.g. /cdn-images/c_limit,w_640/v1788188234/infrared_1788188234520.jpg
 *
 * /cdn-images is served by src/app/cdn-images/[...path]/route.ts, which fetches the same file from Cloudinary
 * (automatic format + quality, and the requested width, never upscaled) and returns it with a public cache header so
 * Cloudflare keeps it. Anything that is not a Cloudinary image (files in /public, /uploads, other hosts) is used as-is.
 */
const CLOUDINARY_PREFIX = /^https?:\/\/res\.cloudinary\.com\/dytytwyp6\/image\/upload\//;
const LOCAL_PREFIX = "/cdn-images/";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const local = src.replace(CLOUDINARY_PREFIX, LOCAL_PREFIX);
  if (local.startsWith(LOCAL_PREFIX)) {
    // Already-resized URLs (a width transformation in the path) are left alone.
    const rest = local.slice(LOCAL_PREFIX.length);
    if (/^[a-z]_[^/]*\//i.test(rest) && /(^|,)w_\d+/.test(rest.split("/")[0])) return local;
    return `${LOCAL_PREFIX}c_limit,w_${width}/${rest}`;
  }
  return src;
}
