import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";
import { Metadata } from "next";

import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const settings = content?.data?.settings;
  const privacyData = content?.data?.privacyPage || {};
  const seo = privacyData.seo || {};
  const pageUrl = `${BASE_URL}/privacy`;

  return {
    title: seo.metaTitle || "Privacy Policy | 410 Muscle Therapy",
    description: seo.metaDescription || "Learn how 410 Muscle Therapy collects, uses, stores, and protects your personal information, including cookies, orders, email communications, and SMS privacy.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
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
