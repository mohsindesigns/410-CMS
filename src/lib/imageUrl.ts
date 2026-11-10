/**
 * Serve images from our own domain.
 *
 * Images are stored on Cloudinary and the CMS keeps the full https://res.cloudinary.com/... URL (that is what the
 * admin shows and saves). On the public site we rewrite those URLs to /cdn-images/..., which next.config.ts proxies to
 * the same Cloudinary file (with automatic format + quality). Visitors, crawlers and Search Console then only ever see
 * 410-muscletherapy.com image URLs. Only applied when content is READ for rendering - stored data is never changed.
 */
const CLOUDINARY_IMAGE_PREFIX = /https?:\/\/res\.cloudinary\.com\/dytytwyp6\/image\/upload\//g;
const LOCAL_PREFIX = "/cdn-images/";

/** Fields that hold JSON-LD / raw markup: they need absolute URLs, so they are left untouched. */
const SKIP_KEYS = new Set(["schemaData", "faqSchemaMarkup"]);

export function localizeImageUrl<T>(value: T): T {
  return (typeof value === "string" ? value.replace(CLOUDINARY_IMAGE_PREFIX, LOCAL_PREFIX) : value) as T;
}

const isPlainObject = (v: unknown): v is Record<string, unknown> => {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

/** Returns a copy of `input` with every Cloudinary image URL string pointed at /cdn-images/. Non-plain objects (ObjectId, Date) are kept. */
export function localizeDeep<T>(input: T): T {
  if (typeof input === "string") return localizeImageUrl(input) as unknown as T;
  if (Array.isArray(input)) return input.map((v) => localizeDeep(v)) as unknown as T;
  if (isPlainObject(input)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) out[k] = SKIP_KEYS.has(k) ? v : localizeDeep(v);
    return out as T;
  }
  return input;
}
