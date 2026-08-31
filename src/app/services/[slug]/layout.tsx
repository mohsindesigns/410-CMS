import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";
import { getRobotsMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const settings = content?.data?.settings;
  const services = content?.data?.services?.services || [];
  const service = services.find((s: any) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const seo = service.seo || {};
  const title = seo.metaTitle || seo.title || service.title || "Service | 410 Muscle Therapy";
  const description = seo.metaDescription || seo.description || service.description || "Specialized performance bodywork and mobility restoration in Maryland.";

  return {
    title,
    description,
    robots: getRobotsMetadata(settings, seo),
    alternates: {
      canonical: `${BASE_URL}/${slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${slug}/`,
      type: "website",
      images: [
        {
          url: seo.featuredImage || seo.ogImage || `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/logo.png`],
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy",
    },
  };
}

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
