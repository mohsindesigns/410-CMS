import { notFound, permanentRedirect, redirect } from 'next/navigation';

export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

// Dynamic segment + no generateStaticParams = Next renders EVERY request from scratch (TTFB 6-20s, no CDN caching).
// Exporting generateStaticParams (empty: nothing is pre-built) switches this route to on-demand ISR: the first request
// renders and caches the page, later requests are served from cache (revalidated every 60s and on every admin save).
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import Post from '@/models/Post';
import Redirect from '@/models/Redirect';
import SiteContent from '@/models/Content';
import { getTemplate } from '@/components/templates/TemplateRegistry';
import ServiceDetailTemplate from '@/components/templates/ServiceDetailTemplate';
import { Metadata } from 'next';
import { generateSchema } from '@/lib/schema-generator';
import { BASE_URL } from '@/lib/constants';
import { computeAggregateRating } from '@/lib/reviews';
import { stripHtml } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

import { getRobotsMetadata, buildPageTitle } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();
  const [page, content] = await Promise.all([
    Page.findOne({ slug, status: 'published', isTrashed: { $ne: true } }).lean(),
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
    const description = seo.metaDescription || stripHtml(service.description) || "";
    const pageUrl = `${BASE_URL}/${slug}/`;
    const ogImage = getAbsoluteUrl(seo.ogImage || seo.featuredImage || service.image || service.heroImage);
    const twitterImage = getAbsoluteUrl(seo.twitterImage || seo.ogImage || seo.featuredImage || service.image || service.heroImage);

    return {
      title: buildPageTitle(title),
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
            url: ogImage || `${BASE_URL}/logo.png`,
            alt: seo.featuredImageAlt || title,
          }
        ],
      },
      twitter: {
        card: seo.twitterCard === "summary" ? "summary" : "summary_large_image",
        title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || title,
        description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || description,
        images: [twitterImage || `${BASE_URL}/logo.png`],
        site: "@410MuscleTherapy",
        creator: "@410MuscleTherapy",
      },
    };
  }

  const seo = page.seo || {};
  const pageUrl = `${BASE_URL}/${slug}/`;
  // no meta description saved -> fall back to the page's own intro text (never the site-wide default)
  const pageDescription = seo.metaDescription || stripHtml((page as any).data?.description || (page as any).content?.hero?.description) || undefined;

  return {
    title: buildPageTitle(seo.metaTitle || page.title),
    description: pageDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    robots: getRobotsMetadata(settings, seo),
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || page.title,
      description: seo.ogDescription || pageDescription,
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      type: "website",
      images: [
        {
          url: getAbsoluteUrl(seo.ogImage || seo.featuredImage) || `${BASE_URL}/logo.png`,
          alt: seo.featuredImageAlt || page.title,
        }
      ],
    },
    twitter: {
      card: seo.twitterCard === "summary" ? "summary" : "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || page.title,
      description: seo.twitterDescription || seo.ogDescription || pageDescription,
      images: [getAbsoluteUrl(seo.twitterImage || seo.ogImage || seo.featuredImage) || `${BASE_URL}/og-default.png`],
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
    status: 'published',
    isTrashed: { $ne: true }
  }).lean();

  const globalContent = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
  const globalData = globalContent?.data || {};
  const settings = globalData.settings || {};

  // Rating used in search-result markup: managed in Admin > Reviews (stats), else the figures saved by the
  // Google import, else computed from the review list. Omitted when there are no reviews at all.
  const aggregateRating = computeAggregateRating(globalData.testimonials);

  // If no Page found, check if a Service matches this slug!
  if (!pageDoc) {
    const services = globalData.services?.services || [];
    const serviceItems = globalData.services?.items || [];
    const serviceDoc =
      services.find((s: any) => s.slug === slug && s.status !== 'draft' && !s.isTrashed) ||
      serviceItems.find((s: any) => s.slug === slug && s.status !== 'draft' && !s.isTrashed);

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

      // Custom bulk FAQ JSON-LD saved in the services editor ("FAQ Schema Markup"). Previously saved
      // but never rendered. When valid it replaces the auto-generated FAQPage to avoid duplicates.
      let customFaqSchema: string | null = null;
      const rawFaqMarkup = typeof service.faqSchemaMarkup === 'string' ? service.faqSchemaMarkup.trim() : '';
      if (rawFaqMarkup) {
        let cleaned = rawFaqMarkup;
        if (cleaned.startsWith('<script')) {
          const close = cleaned.indexOf('>');
          if (close !== -1) cleaned = cleaned.substring(close + 1);
        }
        if (cleaned.endsWith('</script>')) cleaned = cleaned.substring(0, cleaned.length - 9);
        try {
          customFaqSchema = JSON.stringify(JSON.parse(cleaned.trim())).replace(/</g, '\\u003c');
        } catch {
          customFaqSchema = null;
        }
      }

      const schema = generateSchema({
        title: service?.title || service?.seo?.metaTitle || "",
        pageTitle: service?.seo?.metaTitle || service?.title || "",
        description: service?.seo?.metaDescription || stripHtml(service?.description) || "",
        slug: slug,
        type: "Service",
        faqs: customFaqSchema ? undefined : serviceFaqItems,
        aggregateRating,
        breadcrumbTitle: service?.seo?.breadcrumbTitle,
        isService: true,
        image: featuredImage,
        datePublished: (service.publishedAt || service.createdAt) ? new Date(service.publishedAt || service.createdAt).toISOString() : undefined,
        dateModified: (service.updatedAt || service.publishedAt || service.createdAt) ? new Date(service.updatedAt || service.publishedAt || service.createdAt).toISOString() : undefined
      });

      return (
        <main>
          <script
            id="json-ld-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
          {customFaqSchema && (
            <script
              id="json-ld-faq-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: customFaqSchema }}
            />
          )}
          <ServiceDetailTemplate pageData={service} params={Promise.resolve({ slug })} />
        </main>
      );
    }

    const lastSlug = slug.includes('/') ? slug.split('/').pop() : slug;
    const postDoc = await Post.findOne({
      $or: [{ slug: slug }, { slug: lastSlug }],
      status: 'published',
      isTrashed: { $ne: true }
    }).lean();

    if (postDoc) {
      permanentRedirect(`/blogs/${postDoc.slug}/`);
    }

    // Direct database fallback for configured custom redirects
    const currentPath = `/${slug}`;
    const activeRedirects = await Redirect.find({ status: 'active' }).lean();
    for (const r of activeRedirects) {
      let rPath = '';
      try {
        rPath = new URL(r.sourceUrl, 'http://localhost').pathname;
      } catch {
        rPath = r.sourceUrl;
      }
      if (!rPath.startsWith('/')) rPath = '/' + rPath;

      const normR = rPath.length > 1 && rPath.endsWith('/') ? rPath.slice(0, -1) : rPath;
      const normCur = currentPath.length > 1 && currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

      if (normR.toLowerCase() === normCur.toLowerCase()) {
        Redirect.findByIdAndUpdate(r._id, {
          $inc: { hits: 1 },
          $set: { lastAccessed: new Date() }
        }).catch(() => {});

        let target = r.targetUrl;
        if (target.startsWith('/')) {
          target = `${BASE_URL}${target}`;
        }
        if (r.statusCode === 302 || r.statusCode === 307) {
          redirect(target);
        } else {
          permanentRedirect(target);
        }
      }
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
    aggregateRating,
    image: featuredImage,
    datePublished: (page.publishedAt || page.createdAt) ? new Date(page.publishedAt || page.createdAt).toISOString() : undefined,
    dateModified: (page.updatedAt || page.publishedAt || page.createdAt) ? new Date(page.updatedAt || page.publishedAt || page.createdAt).toISOString() : undefined
  });

  // Use TemplateWrapper to handle local content context overrides
  const { TemplateWrapper } = await import('@/components/templates/TemplateRegistry');

  const mergedPageData: any = {
    ...(page.data || {}),
    ...page,
    content: {
      ...globalData,
      ...(page.data || {}),
      ...(page.content || {})
    }
  };

  // Reviews page: the review LIST always comes from the master inventory (Admin > Reviews), so edits there show up
  // here immediately. The page itself only stores presentation (heading, buttons, which reviews to show).
  if (page.template === 'reviews') {
    const g = globalData.testimonials || {};
    const own = page.content?.testimonials || {};
    const masterList = Array.isArray(g.testimonials) && g.testimonials.length ? g.testimonials : (Array.isArray(own.testimonials) ? own.testimonials : []);
    mergedPageData.content.testimonials = {
      ...g,
      ...own,
      testimonials: masterList,
      section: { ...(g.section || {}), ...(own.section || {}) },
      // the page's own badge wins over the home-page "Client Experiences" label
      label: String(own.section?.badge || own.label || '').trim() || 'CLIENT REVIEWS',
      // rating / total are global (one source for this page and the search-result markup)
      stats: g.stats || own.stats || {},
      googleRating: g.googleRating ?? own.googleRating,
      googleReviewCount: g.googleReviewCount ?? own.googleReviewCount,
    };
  }

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

