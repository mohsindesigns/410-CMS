import { notFound, permanentRedirect } from 'next/navigation';

export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import Post from '@/models/Post';
import SiteContent from '@/models/Content';
import { getTemplate } from '@/components/templates/TemplateRegistry';
import ServiceDetailTemplate from '@/components/templates/ServiceDetailTemplate';
import { Metadata } from 'next';
import { generateSchema } from '@/lib/schema-generator';
import { BASE_URL } from '@/lib/constants';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();
  const [page, content] = await Promise.all([
    Page.findOne({ slug, status: 'published' }).lean(),
    SiteContent.findOne({ key: 'complete_data' }).lean() as any
  ]);

  const settings = content?.data?.settings;

  if (!page) {
    // Check if matching service exists
    const services = content?.data?.services?.services || [];
    const serviceItems = content?.data?.services?.items || [];
    const service = services.find((s: any) => s.slug === slug) || serviceItems.find((s: any) => s.slug === slug);
    if (!service) return {};

    const seo = service.seo || {};
    const title = seo.metaTitle || service.title;
    const description = seo.metaDescription || service.description || "";
    const pageUrl = `${BASE_URL}/${slug}/`;
    const featuredImage = getAbsoluteUrl(seo.featuredImage || seo.ogImage || seo.twitterImage || service.image || service.heroImage);

    return {
      title: { absolute: title },
      description,
      alternates: {
        canonical: seo.canonicalUrl || pageUrl,
      },
      robots: getRobotsMetadata(settings, seo),
      openGraph: {
        title: seo.ogTitle || seo.metaTitle || title,
        description: seo.ogDescription || seo.metaDescription || description,
        url: pageUrl,
        siteName: "410 Muscle Therapy",
        type: "website",
        images: [
          {
            url: featuredImage || `${BASE_URL}/logo.png`,
            width: 1200,
            height: 630,
            alt: title,
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || title,
        description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || description,
        images: [featuredImage || `${BASE_URL}/logo.png`],
        site: "@410MuscleTherapy",
        creator: "@410MuscleTherapy",
      },
    };
  }

  const seo = page.seo || {};
  const pageUrl = `${BASE_URL}/${slug}/`;

  return {
    title: {
      absolute: seo.metaTitle || page.title
    },
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    robots: getRobotsMetadata(settings, seo),
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || page.title,
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      type: "website",
      images: [
        {
          url: getAbsoluteUrl(seo.featuredImage || seo.ogImage) || `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: page.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || page.title,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [getAbsoluteUrl(seo.featuredImage || seo.twitterImage || seo.ogImage) || `${BASE_URL}/logo.png`],
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy",
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();

  // 1. Find page in MongoDB Page collection
  const pageDoc = await Page.findOne({
    slug: slug,
    status: 'published'
  }).lean();

  const globalContent = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
  const globalData = globalContent?.data || {};
  const settings = globalData.settings || {};

  // If no Page found, check if a Service matches this slug!
  if (!pageDoc) {
    const services = globalData.services?.services || [];
    const serviceItems = globalData.services?.items || [];
    const serviceDoc =
      services.find((s: any) => s.slug === slug && s.status !== 'draft') ||
      serviceItems.find((s: any) => s.slug === slug);

    if (serviceDoc) {
      if (settings.homepageId && (String(serviceDoc._id) === String(settings.homepageId) || serviceDoc.slug === settings.homepageId)) {
        permanentRedirect("/");
      }

      const service = JSON.parse(JSON.stringify(serviceDoc));
      const allFaqs = globalData.faq?.items || [];

      const faqs = allFaqs.filter((item: any) =>
        item.visibility === 'global' ||
        (item.visibility === 'specific' && (
          item.targetPages?.includes(slug) ||
          item.targetPages?.includes(`services/${slug}`) ||
          item.targetPages?.includes(String(serviceDoc._id)) ||
          item.targetPages?.includes(serviceDoc.slug)
        ))
      );

      // service.faq (singular) = items selected via ServiceDetailEditor ContentSelector
      // service.faqs (plural) = previously merged/global fallback
      const serviceFaqItems = Array.isArray(service.faq) && service.faq.length > 0
        ? service.faq
        : (Array.isArray(service.faqs) && service.faqs.length > 0 ? service.faqs : faqs);
      service.faqs = serviceFaqItems;

      const featuredImage = getAbsoluteUrl(service?.seo?.featuredImage || service?.seo?.ogImage || service?.seo?.twitterImage || service?.image);

      const schema = generateSchema({
        title: service?.seo?.metaTitle || service?.title || "",
        description: service?.seo?.metaDescription || service?.description || "",
        slug: slug,
        type: "Service",
        faqs: serviceFaqItems,
        breadcrumbTitle: service?.seo?.breadcrumbTitle,
        isService: true,
        image: featuredImage
      });

      return (
        <main>
          <script
            id="json-ld-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
          <ServiceDetailTemplate pageData={service} params={Promise.resolve({ slug })} />
        </main>
      );
    }

    const lastSlug = slug.includes('/') ? slug.split('/').pop() : slug;
    const postDoc = await Post.findOne({
      $or: [{ slug: slug }, { slug: lastSlug }],
      status: 'published'
    }).lean();

    if (postDoc) {
      permanentRedirect(`/blog/${postDoc.slug}/`);
    }

    notFound();
  }

  // Convert to plain object to avoid Mongoose serialization issues in Client Components
  const page = JSON.parse(JSON.stringify(pageDoc));

  // If this page is set as the homepage, redirect slug to root /
  if (settings.homepageId && String(pageDoc._id) === String(settings.homepageId)) {
    permanentRedirect("/");
  }

  // Detect FAQs for service-detail or faq templates
  let pageFaqs: any[] = [];
  if (page.template === 'service-detail') {
    const services = globalData.services?.services || [];
    const serviceItems = globalData.services?.items || [];
    const matchingService =
      services.find((s: any) => s.slug === slug || String(s.id) === String(page._id) || String(s._id) === String(page._id)) ||
      serviceItems.find((s: any) => s.slug === slug);

    const rawFaqs = 
      matchingService?.faq || 
      matchingService?.faqs || 
      page.data?.faq || 
      page.data?.faqs || 
      page.content?.faq || 
      page.content?.faqs || 
      page.faq || 
      page.faqs || 
      [];

    if (Array.isArray(rawFaqs) && rawFaqs.length > 0) {
      pageFaqs = rawFaqs;
      page.faq = rawFaqs;
      page.faqs = rawFaqs;
    }
  } else if (page.template === 'faq') {
    const pageSpecificFaqs = page.content?.faqs || page.data?.faqs || page.faqs || [];
    if (Array.isArray(pageSpecificFaqs) && pageSpecificFaqs.length > 0) {
      pageFaqs = pageSpecificFaqs;
      page.faqs = pageSpecificFaqs;
    } else {
      const allFaqs = globalData.faq?.items || [];
      pageFaqs = allFaqs.filter((item: any) =>
        item.visibility === 'global' ||
        (item.visibility === 'specific' && item.targetPages?.includes(slug))
      );
      page.faqs = pageFaqs;
    }
  }

  // Determine page type for schema
  let pageType: any = "WebPage";
  if (page.template === 'service-detail') pageType = "Service";
  if (page.template === 'about') pageType = "AboutPage";
  if (page.template === 'contact') pageType = "ContactPage";
  if (page.template === 'gallery') pageType = "CollectionPage";

  // Determine featured image for schema (Manual SEO Featured Image > OG Image > Hero Image)
  const featuredImage = getAbsoluteUrl(page.seo?.featuredImage || page.seo?.ogImage || page.seo?.twitterImage || page.content?.hero?.image || page.data?.image);

  const schema = generateSchema({
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.data?.description || "",
    slug: page.slug,
    type: pageType,
    faqs: pageFaqs.length > 0 ? pageFaqs : undefined,
    breadcrumbTitle: page.seo?.breadcrumbTitle,
    isService: page.template === 'service-detail',
    image: featuredImage
  });

  // Use TemplateWrapper to handle local content context overrides
  const { TemplateWrapper } = await import('@/components/templates/TemplateRegistry');

  const mergedPageData = {
    ...(page.data || {}),
    ...page,
    content: {
      ...globalData,
      ...(page.data || {}),
      ...(page.content || {})
    }
  };

  return (
    <main>
      <script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TemplateWrapper
        templateName={page.template}
        pageData={mergedPageData}
        params={resolvedParams}
      />
    </main>
  );
}

