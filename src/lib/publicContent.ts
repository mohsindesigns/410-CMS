/**
 * What visitors may receive. The public pages ship the whole site-content blob to the browser (every page's HTML
 * contains it), so anything that is a draft, trashed or hidden in the admin must be removed here - otherwise its full
 * text would be readable in the page source even though no page shows it. Only used for PUBLIC reads; the admin
 * editors read the unfiltered content from /api/content and are not affected.
 */
const isHiddenItem = (x: any): boolean =>
  !!x && typeof x === "object" && (
    x.isTrashed === true ||
    x.status === "draft" || x.status === "trash" || x.status === "trashed" || x.status === "unpublished" ||
    x.published === false || x.hidden === true || x.visible === false || x.visibility === "hidden"
  );

const dropHidden = <T,>(list: T): T => (Array.isArray(list) ? (list.filter((x) => !isHiddenItem(x)) as any) : list);

export function sanitizePublicContent<T>(doc: T): T {
  const d: any = doc;
  if (!d || typeof d !== "object" || !d.data || typeof d.data !== "object") return doc;
  const data = { ...d.data };

  if (data.services && typeof data.services === "object") {
    data.services = { ...data.services };
    if (Array.isArray(data.services.services)) data.services.services = dropHidden(data.services.services);
    if (Array.isArray(data.services.items)) data.services.items = dropHidden(data.services.items);
  }
  if (data.faq && typeof data.faq === "object" && Array.isArray(data.faq.items)) {
    data.faq = { ...data.faq, items: dropHidden(data.faq.items) };
  }
  if (data.testimonials && typeof data.testimonials === "object") {
    data.testimonials = { ...data.testimonials };
    if (Array.isArray(data.testimonials.testimonials)) data.testimonials.testimonials = dropHidden(data.testimonials.testimonials);
    if (Array.isArray(data.testimonials.items)) data.testimonials.items = dropHidden(data.testimonials.items);
  }
  return { ...d, data };
}
