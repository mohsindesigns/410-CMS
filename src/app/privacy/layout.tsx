import connectToDatabase from "@/lib/mongodb";
import { getSiteContent } from "@/lib/siteContent";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";
import { Metadata } from "next";

import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await getSiteContent();
  const settings = content?.data?.settings;
  const privacyData = content?.data?.privacyPage || {};
  const seo = privacyData.seo || {};
  const pageUrl = `${BASE_URL}/privacy/`;

  return {
    title: { absolute: seo.metaTitle || "Privacy Policy | 410 Muscle Therapy" },
    description: seo.metaDescription || "Learn how 410 Muscle Therapy collects, uses, stores, and protects your personal information, including cookies, orders, email communications, and SMS privacy.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || "Privacy Policy | 410 Muscle Therapy",
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      type: "website",
      locale: "en_US",
      images: [{ url: seo.ogImage || `${BASE_URL}/og-default.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || "Privacy Policy | 410 Muscle Therapy",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [seo.twitterImage || seo.ogImage || `${BASE_URL}/og-default.png`],
      site: "@410MuscleTherapy",
    },
    robots: getRobotsMetadata(settings, seo),
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
