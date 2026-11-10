import connectToDatabase from '@/lib/mongodb';
import { getSiteContent } from "@/lib/siteContent";
import { localizeDeep, localizeImageUrl } from "@/lib/imageUrl";
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';
import { generateSchema } from '@/lib/schema-generator';
import { resolveSameAs } from '@/lib/businessInfo';
import { getPageDates } from '@/lib/pageDates';
import { servicePageText } from '@/lib/servicePageText';

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
      images: [localizeImageUrl(seo.ogImage) || localizeImageUrl(seo.featuredImage) || `${BASE_URL}/og-default.png`],
    },
    twitter: {
      card: seo.twitterCard === 'summary' ? 'summary' : 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Services",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || servicesData?.description,
      images: [localizeImageUrl(seo.twitterImage) || localizeImageUrl(seo.ogImage) || localizeImageUrl(seo.featuredImage) || `${BASE_URL}/og-default.png`],
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

  const globalData = content?.data ? localizeDeep(JSON.parse(JSON.stringify(content.data))) : {};
  const pageContent = pageDoc?.content ? localizeDeep(JSON.parse(JSON.stringify(pageDoc.content))) : {};
  const mergedData = {
    ...globalData,
    ...pageContent,
    whyChooseUs: {
      ...(globalData.whyChooseUs || {}),
      ...(pageContent.whyChooseUs || {})
    }
  };

  const dates = await getPageDates('services');
  const schema = generateSchema({
    title: servicePageText(null, globalData?.serviceDetailPage, 'breadcrumbServices'),
    pageTitle: pageContent?.seo?.metaTitle || globalData?.services?.seo?.metaTitle || "Services | 410 Muscle Therapy",
    description: pageContent?.seo?.metaDescription || globalData?.services?.seo?.metaDescription || globalData?.services?.description || "Massage and performance-recovery services at 410 Muscle Therapy in Timonium, Maryland.",
    slug: "/services",
    type: "CollectionPage",
    breadcrumbTitle: servicePageText(null, globalData?.serviceDetailPage, 'breadcrumbServices'),
    sameAs: resolveSameAs(globalData?.footer?.social),
    ...dates,
  });

  return (
    <ContentProvider initialData={mergedData}>
      <script id="json-ld-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div>
        <ServicesHeroSection />
        <WhyChooseUsSection />
        <StickyServicesSection />
        <CtaBanner />
        <ContactFaqSection />
      </div>
    </ContentProvider>
  );
}
