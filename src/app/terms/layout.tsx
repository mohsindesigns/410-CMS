import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";
import { Metadata } from "next";

import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const settings = content?.data?.settings;
  const termsData = content?.data?.termsPage || {};
  const seo = termsData.seo || {};
  const pageUrl = `${BASE_URL}/terms/`;

  return {
    title: { absolute: seo.metaTitle || "Terms & Conditions | 410 Muscle Therapy" },
    description: seo.metaDescription || "Read the Terms & Conditions for 410 Muscle Therapy, including therapy appointments, payments, cancellations, merchandise, shipping SMS terms and legal policies.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || "Terms & Conditions | 410 Muscle Therapy",
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      type: "website",
      locale: "en_US",
      images: [{ url: seo.ogImage || `${BASE_URL}/og-default.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || "Terms & Conditions | 410 Muscle Therapy",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [seo.twitterImage || seo.ogImage || `${BASE_URL}/og-default.png`],
      site: "@410MuscleTherapy",
    },
    robots: getRobotsMetadata(settings, seo),
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
