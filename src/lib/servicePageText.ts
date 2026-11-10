/**
 * Shared wording of the service pages and the services listing page. Managed in Admin > Settings > Service Pages
 * (stored in complete_data.serviceDetailPage). Each service can override the section texts in Admin > Services >
 * "Page Sections". The values below are only the last-resort fallback when nothing has been saved yet.
 */
export const SERVICE_PAGE_DEFAULTS = {
  breadcrumbAria: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbServices: "Services",
  lastUpdatedLabel: "Last updated",
  recommendedLabel: "Keep Exploring",
  recommendedTitle1: "Recommended",
  recommendedTitle2: "Services.",
  recommendedDescription: "",
  recommendedCtaText: "Explore Service",
  // The three below fall back to the home page's own section text (Admin > Pages > Home) when left empty.
  reviewsLabel: "",
  reviewsTitle1: "",
  reviewsTitle2: "",
  reviewsDescription: "",
  blogLabel: "",
  blogTitle: "",
  blogCtaAll: "",
  blogCtaReadMore: "",
} as const;

export type ServicePageTextKey = keyof typeof SERVICE_PAGE_DEFAULTS;

const clean = (v: unknown) => (typeof v === "string" ? v.replace(/<[^>]*>/g, "").trim() : "");

/** per-service value, else the shared value from Settings > Service Pages, else the built-in fallback */
export function servicePageText(service: any, shared: any, key: ServicePageTextKey): string {
  return clean(service?.[key]) || clean(shared?.[key]) || SERVICE_PAGE_DEFAULTS[key];
}
