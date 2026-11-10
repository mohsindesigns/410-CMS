import connectToDatabase from "@/lib/mongodb";
import Page from "@/models/Page";

/** ISO string for a Date / string / number, or undefined when it is missing or not a real date (nothing is invented). */
export const isoDate = (v: unknown): string | undefined => {
  if (!v) return undefined;
  const d = new Date(v as any);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

/**
 * Publish / modified dates of a CMS page record (Admin > Pages), used for the schema.org WebPage node of pages that
 * are not rendered by the generic [...slug] route (home, services, privacy, terms).
 */
export async function getPageDates(slug: string): Promise<{ datePublished?: string; dateModified?: string }> {
  try {
    await connectToDatabase();
    const p: any = await Page.findOne({ slug, status: "published", isTrashed: { $ne: true } })
      .select("publishedAt createdAt updatedAt")
      .lean();
    if (!p) return {};
    return {
      datePublished: isoDate(p.publishedAt || p.createdAt),
      dateModified: isoDate(p.updatedAt || p.publishedAt || p.createdAt),
    };
  } catch {
    return {};
  }
}
