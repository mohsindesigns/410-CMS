/**
 * Small helpers shared by the public form endpoints (/api/contact, /api/send):
 * HTML escaping, input clamping, email validation, and a per-IP in-memory rate limiter.
 *
 * The rate limiter is per Node process (state lives in module memory). That is fine for the
 * single PM2 process this site runs under; it is a spam brake, not a security boundary.
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape a value for safe interpolation into HTML text or a quoted attribute. */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/** Trim a string and cut it to `max` characters. Non-strings become ''. */
export function clamp(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/** Collapse CR/LF and other control characters (for email subjects / headers). */
export function singleLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
}

const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]{2,}$/;

/** Basic structural email check (max 254 chars, no whitespace/header-injection characters). */
export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 254 && EMAIL_RE.test(value);
}

/**
 * Best-effort client IP. Prefers X-Real-IP (set by the reverse proxy); otherwise the right-most
 * X-Forwarded-For entry (the one appended by the nearest proxy, not client-controlled).
 */
export function getClientIp(req: Request): string {
  const real = req.headers.get('x-real-ip');
  if (real && real.trim()) return real.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return 'unknown';
}

const hits = new Map<string, number[]>();
let lastSweep = 0;

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, stamps] of hits) {
    const fresh = stamps.filter((t) => now - t < windowMs);
    if (fresh.length === 0) hits.delete(key);
    else hits.set(key, fresh);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the oldest hit in the window expires (only meaningful when !ok). */
  retryAfter: number;
}

/**
 * Record a hit for `key` and report whether it is within `limit` hits per `windowMs`.
 * Defaults: 5 requests per 10 minutes.
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  sweep(now, windowMs);
  const stamps = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (stamps.length >= limit) {
    hits.set(key, stamps);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((stamps[0] + windowMs - now) / 1000)) };
  }
  stamps.push(now);
  hits.set(key, stamps);
  return { ok: true, retryAfter: 0 };
}
