import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import StickyServicesSection from '@/components/sections/StickyServicesSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ContactFaqSection from '@/components/sections/ContactFaqSection';
import CtaBanner from '@/components/sections/CtaBanner';

export const revalidate = 60; // Cache for 1 minute

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    SiteContent.findOne({ key: 'complete_data' }).lean() as any,
    Page.findOne({ slug: 'services' }).lean() as any
  ]);
  
  const servicesData = content?.data?.services || {};
  const seo = {
    ...(servicesData?.seo || {}),
    ...(pageDoc?.seo || {})
  };
  const pageUrl = `${BASE_URL}/services`;

  return {
    title: {
      absolute: seo.metaTitle || pageDoc?.title || "Our Services"
    },
    description: seo.metaDescription || servicesData?.description || "Discover our range of premium recovery and performance muscle therapies.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Services",
      description: seo.ogDescription || seo.metaDescription || servicesData?.description,
      url: pageUrl,
      type: 'website',
      images: seo.featuredImage ? [{ url: seo.featuredImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage].filter(Boolean) as string[],
    },
    robots: {
      index: seo.metaRobotsIndex !== 'noindex',
      follow: seo.metaRobotsFollow !== 'nofollow',
      ...(seo.metaRobotsIndex !== 'noindex' && {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      })
    }
  };
}

import { ContentProvider } from '@/context/ContentContext';

export default async function ServicesPage() {
  await connectToDatabase();
  const pageDoc = await Page.findOne({ slug: 'services' }).lean() as any;
  const pageContent = pageDoc?.content ? JSON.parse(JSON.stringify(pageDoc.content)) : {};

  return (
    <ContentProvider initialData={pageContent}>
      <main>
        <ServicesHeroSection />
        <WhyChooseUsSection />
        <StickyServicesSection />
        <CtaBanner />
        <HowItWorksSection />
        <ContactFaqSection />
      </main>
    </ContentProvider>
  );
}
