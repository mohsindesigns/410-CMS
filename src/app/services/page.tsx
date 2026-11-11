import connectToDatabase from '@/lib/mongodb';
import { getSiteContent } from "@/lib/siteContent";
import { localizeDeep, localizeImageUrl } from "@/lib/imageUrl";
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import Post from '@/models/Post';
import mongoose from 'mongoose';
import { sanitizePublicContent } from '@/lib/publicContent';
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
import Testimonials from '@/components/Testimonials';
import BlogSection from '@/components/sections/BlogSection';

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
  const pageContent = pageDoc?.content ? localizeDeep(sanitizePublicContent({ data: JSON.parse(JSON.stringify(pageDoc.content)) } as any).data) : {};
  const mergedData = {
    ...globalData,
    ...pageContent,
    whyChooseUs: {
      ...(globalData.whyChooseUs || {}),
      ...(pageContent.whyChooseUs || {})
    }
  };

  // Reviews & Blog sections (managed in Admin > Pages > Services > Reviews & Blog)
  const sec: any = (mergedData as any).servicesPageSections || {};
  const shared: any = (mergedData as any).serviceDetailPage;
  const showReviews = sec.showReviews !== false;
  const showBlog = sec.showBlogSection !== false;
  let blogPosts: any[] = [];
  if (showBlog) {
    const base = { status: 'published', isTrashed: { $ne: true } };
    const fields = 'title slug featuredImage excerpt date publishedAt author authorName categories';
    const picked: string[] = (Array.isArray(sec.blogPostIds) ? sec.blogPostIds : []).map(String).filter((id: string) => mongoose.isValidObjectId(id)).slice(0, 12);
    let found: any[] = [];
    if (picked.length > 0) {
      found = await Post.find({ ...base, _id: { $in: picked } }).select(fields).populate('categories', 'name').populate('author', 'name').lean();
      found.sort((a: any, b: any) => picked.indexOf(String(a._id)) - picked.indexOf(String(b._id)));
    }
    if (found.length === 0) {
      const count = Math.max(1, Math.min(12, Number(sec.blogCount) || 3));
      found = await Post.find(base).select(fields).sort({ publishedAt: -1, createdAt: -1 }).limit(count).populate('categories', 'name').populate('author', 'name').lean();
    }
    blogPosts = localizeDeep(JSON.parse(JSON.stringify(found)));
  }
  const blogSectionDefaults: any = (mergedData as any).blogSection || {};

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
        {showReviews && (
          <Testimonials
            label={servicePageText(sec, shared, 'reviewsLabel')}
            title1={servicePageText(sec, shared, 'reviewsTitle1')}
            title2={servicePageText(sec, shared, 'reviewsTitle2')}
            description={servicePageText(sec, shared, 'reviewsDescription')}
            reviewKeys={Array.isArray(sec.reviewKeys) ? sec.reviewKeys : undefined}
          />
        )}
        {showBlog && blogPosts.length > 0 && (
          <BlogSection
            title={servicePageText(sec, shared, 'blogTitle') || blogSectionDefaults.title}
            subtitle={servicePageText(sec, shared, 'blogLabel') || blogSectionDefaults.subtitle}
            ctaAll={servicePageText(sec, shared, 'blogCtaAll') || blogSectionDefaults.ctaAll}
            ctaReadMore={servicePageText(sec, shared, 'blogCtaReadMore') || blogSectionDefaults.ctaReadMore}
            posts={blogPosts}
          />
        )}
        <CtaBanner />
        <ContactFaqSection />
      </div>
    </ContentProvider>
  );
}
