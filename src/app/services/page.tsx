import connectToDatabase from '@/lib/mongodb';
import { getSiteContent } from "@/lib/siteContent";
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import StickyServicesSection from '@/components/sections/StickyServicesSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import ContactFaqSection from '@/components/sections/ContactFaqSection';
import CtaBanner from '@/components/sections/CtaBanner';

export const revalidate = 3600; // cached for an hour; admin saves refresh pages immediately via revalidatePath

import { getRobotsMetadata, buildPageTitle } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    getSiteContent(),
    Page.findOne({ slug: 'services', status: 'published', isTrashed: { $ne: true } }).lean() as any
  ]);
  
  const settings = content?.data?.settings;
  const servicesData = content?.data?.services || {};
  const seo = {
    ...(servicesData?.seo || {}),
    ...(pageDoc?.seo || {})
  };
  const pageUrl = `${BASE_URL}/services/`;

  return {
    title: buildPageTitle(seo.metaTitle || pageDoc?.title || "Our Services"),
    description: seo.metaDescription || servicesData?.description || "Discover our range of premium recovery and performance muscle therapies.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Services",
      description: seo.ogDescription || seo.metaDescription || servicesData?.description,
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      locale: "en_US",
      type: 'website',
      images: [seo.ogImage || seo.featuredImage || `${BASE_URL}/og-default.png`],
    },
    twitter: {
      card: seo.twitterCard === 'summary' ? 'summary' : 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Services",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || servicesData?.description,
      images: [seo.twitterImage || seo.ogImage || seo.featuredImage || `${BASE_URL}/og-default.png`],
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
    getSiteContent(),
    Page.findOne({ slug: 'services', status: 'published', isTrashed: { $ne: true } }).lean() as any
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

  return (
    <ContentProvider initialData={mergedData}>
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
