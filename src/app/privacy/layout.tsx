import connectToDatabase from "@/lib/mongodb";
import { localizeImageUrl } from "@/lib/imageUrl";
import { getSiteContent } from "@/lib/siteContent";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";
import { Metadata } from "next";

import { getRobotsMetadata } from "@/lib/seo";
import { generateSchema } from "@/lib/schema-generator";
import { resolveSameAs } from "@/lib/businessInfo";
import { getPageDates } from "@/lib/pageDates";
import { servicePageText } from "@/lib/servicePageText";
import { PRIVACY_UPDATED } from "@/lib/legalDates";
import { ogImageList, twImageList } from "@/lib/shareImages";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await getSiteContent();
  const settings = content?.data?.settings;
  const privacyData = content?.data?.privacyPage || {};
  const seo = privacyData.seo || {};
  const pageUrl = `${BASE_URL}/privacy/`;

  return {
    title: { absolute: seo.metaTitle || "Privacy Policy | 410 Muscle Therapy" },
    description: seo.metaDescription || "Learn how 410 Muscle Therapy collects, uses, stores, and protects your personal information, including form enquiries, cookies and analytics, email communications, and SMS privacy.",
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
      images: ogImageList(localizeImageUrl(seo.ogImage)),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || "Privacy Policy | 410 Muscle Therapy",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: twImageList(localizeImageUrl(seo.twitterImage) || localizeImageUrl(seo.ogImage)),
      site: "@410MuscleTherapy",
    },
    robots: getRobotsMetadata(settings, seo),
  };
}

export default async function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, dates] = await Promise.all([getSiteContent(), getPageDates("privacy")]);
  const schema = generateSchema({
    title: "Privacy Policy",
    description: "How 410 Muscle Therapy collects, uses and protects personal information collected through this website.",
    slug: "/privacy",
    type: "WebPage",
    breadcrumbTitle: servicePageText(null, content?.data?.serviceDetailPage, 'breadcrumbPrivacy'),
    sameAs: resolveSameAs(content?.data?.footer?.social),
    datePublished: dates.datePublished,
    // the "Last updated" date of the policy text (Admin > Settings > Privacy Policy; fallback lib/legalDates.ts)
    dateModified: content?.data?.privacyPage?.updatedIso || PRIVACY_UPDATED.iso,
  });
  return (
    <>
      <script id="json-ld-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
