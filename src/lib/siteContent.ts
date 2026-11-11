import { cache } from "react";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { localizeDeep } from "@/lib/imageUrl";
import { sanitizePublicContent } from "@/lib/publicContent";

/**
 * The global content document (site_contents / complete_data, ~320 KB) is needed by the root layout, the page,
 * and both generateMetadata functions of every route. React's cache() makes all of them share ONE database read per request
 * instead of four (each read crosses the network to the database and transfers the whole document).
 * Treat the result as read-only.
 */
export const getSiteContent = cache(async (): Promise<any> => {
  await connectToDatabase();
  // Public pages show images from our own domain (/cdn-images/...); stored data keeps the original URLs.
  // drafts / trashed / hidden items never reach visitors; images are served from our own domain
  return localizeDeep(sanitizePublicContent((await SiteContent.findOne({ key: "complete_data" }).lean()) as any));
});
