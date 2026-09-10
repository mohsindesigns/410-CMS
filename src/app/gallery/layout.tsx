import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Page from "@/models/Page";
import { BASE_URL } from "@/lib/constants";
import { Metadata } from "next";
import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    SiteContent.findOne({ key: "complete_data" }).lean() as any,
    Page.findOne({ slug: "gallery", status: "published", isTrashed: { $ne: true } }).lean() as any,
  ]);
  const galleryData = content?.data?.galleryPage || content?.data?.gallery || {};
  const seo = pageDoc?.seo || galleryData.seo || {};
  const settings = content?.data?.settings;
  const pageUrl = `${BASE_URL}/gallery/`;
  const ogImage = seo.ogImage || seo.featuredImage || `${BASE_URL}/logo.png`;

  return {
    title: seo.metaTitle || "Project Gallery",
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || "Project Gallery",
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || "Project Gallery",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [seo.twitterImage || ogImage],
    },
    robots: getRobotsMetadata(settings, seo),
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
