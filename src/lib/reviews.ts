/**
 * Shared review helpers (client + server safe).
 *
 * Reviews live in ONE master list (`testimonials.testimonials`, managed at Admin > Reviews). Pages never
 * keep their own copies; they only store which reviews to show, as an array of keys.
 */

/** Key format used before reviews had ids: "name::first 30 chars of the text". */
export const legacyReviewKey = (item: any) =>
  item ? `${item.name || ""}::${(item.text || item.quote || "").slice(0, 30)}` : "";

/** Preferred key: the review's permanent id, falling back to the legacy key. */
export const getReviewKey = (item: any) => (item?.id ? String(item.id) : legacyReviewKey(item));

/** True when a saved key refers to this review (by id, by the legacy key frozen with the id, or by the current legacy key). */
export const reviewMatchesKey = (item: any, key: any) =>
  !!item && (String(item.id || "") === String(key) || item.legacyKey === key || legacyReviewKey(item) === key);

/**
 * Turn a saved selection into the reviews to display. No selection (undefined / empty) means "show all",
 * so new reviews added in the CMS appear automatically.
 */
export function resolveReviewSelection(master: any[], selected: any): any[] {
  const list = Array.isArray(master) ? master : [];
  if (!Array.isArray(selected) || selected.length === 0) return list;
  return selected
    .map((key: any) => list.find((r) => reviewMatchesKey(r, key)))
    .filter(Boolean);
}

/**
 * Rating used in search-result markup + the home/reviews pages. One source of truth:
 * Admin > Reviews > Summary (stats), else the Google-import figures, else computed from the list.
 * Returns null when there are no reviews at all, so no rating markup is emitted.
 */
export function computeAggregateRating(testimonials: any): { ratingValue: number; reviewCount: number } | null {
  const t = testimonials || {};
  const list: any[] = Array.isArray(t.testimonials) ? t.testimonials : [];
  const rating = toPositiveNumber(t.stats?.rating) ?? toPositiveNumber(t.googleRating)
    ?? (list.length ? list.reduce((a: number, r: any) => a + Number(r.rating || 5), 0) / list.length : null);
  const count = toPositiveNumber(t.stats?.count) ?? toPositiveNumber(t.googleReviewCount) ?? (list.length || null);
  return rating && count ? { ratingValue: Math.round(rating * 10) / 10, reviewCount: Math.round(count) } : null;
}

/** Make a fresh permanent id for a review created in the dashboard. */
export const newReviewId = () => `rv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** Parse an editable number ("5", "5.0", "29") -> number or null. */
export const toPositiveNumber = (v: any): number | null => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};
