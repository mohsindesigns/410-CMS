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
  const pageUrl = `${BASE_URL}/terms`;

  return {
    title: seo.metaTitle || "Terms & Conditions | 410 Muscle Therapy",
    description: seo.metaDescription || "Read the Terms & Conditions for 410 Muscle Therapy, including therapy appointments, payments, cancellations, merchandise, shipping SMS terms and legal policies.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
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
