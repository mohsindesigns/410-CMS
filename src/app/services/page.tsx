import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import StickyServicesSection from '@/components/sections/StickyServicesSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import ContactFaqSection from '@/components/sections/ContactFaqSection';
import CtaBanner from '@/components/sections/CtaBanner';

export const revalidate = 60; // Cache for 1 minute

import { getRobotsMetadata, buildPageTitle, getAbsoluteUrl } from "@/lib/seo";
import { generateSchema } from '@/lib/schema-generator';

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    SiteContent.findOne({ key: 'complete_data' }).lean() as any,
    Page.findOne({ slug: 'services' }).lean() as any
  ]);

  const settings = content?.data?.settings;
  const servicesData = content?.data?.services || {};
  const seo = {
    ...(servicesData?.seo || {}),
    ...(pageDoc?.seo || {})
  };
  const pageUrl = `${BASE_URL}/services/`;
  const title = seo.metaTitle || pageDoc?.title || "Our Services";
  const ogImage = getAbsoluteUrl(seo.ogImage || seo.featuredImage) || `${BASE_URL}/logo.png`;
  const twitterImage = getAbsoluteUrl(seo.twitterImage || seo.ogImage || seo.featuredImage) || `${BASE_URL}/logo.png`;

  return {
    title: buildPageTitle(title),
    description: seo.metaDescription || servicesData?.description || "Discover our range of premium recovery and performance muscle therapies.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Services",
      description: seo.ogDescription || seo.metaDescription || servicesData?.description,
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || title,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || servicesData?.description,
      images: [twitterImage],
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy",
    },
    robots: getRobotsMetadata(settings, seo)
  };
}

import { ContentProvider } from '@/context/ContentContext';

export default async function ServicesPage() {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    SiteContent.findOne({ key: 'complete_data' }).lean() as any,
    Page.findOne({ slug: 'services' }).lean() as any
  ]);

  const globalData = content?.data ? JSON.parse(JSON.stringify(content.data)) : {};
  const pageContent = pageDoc?.content ? JSON.parse(JSON.stringify(pageDoc.content)) : {};
  const mergedData = {
    ...globalData,
    ...pageContent,
    whyChooseUs: {
      ...(globalData.whyChooseUs || {}),
      ...(pageContent.whyChooseUs || {})
    }
  };

  const seo = { ...(globalData?.services?.seo || {}), ...(pageDoc?.seo || {}) };
  const schema = generateSchema({
    title: seo.metaTitle || pageDoc?.title || "Our Services",
    description: seo.metaDescription || globalData?.services?.description || "Discover our range of premium recovery and performance muscle therapies.",
    slug: "/services",
    type: "CollectionPage"
  });

  return (
    <ContentProvider initialData={mergedData}>
      <script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main>
        <ServicesHeroSection />
        <WhyChooseUsSection />
        <StickyServicesSection />
        <CtaBanner />
        <ContactFaqSection />
      </main>
    </ContentProvider>
  );
}
