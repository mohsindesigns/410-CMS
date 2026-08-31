export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

import HomeTemplate from "@/components/templates/HomeTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Page from "@/models/Page";
import { getHomepageSchemas } from "@/lib/schema-generator";
import { TemplateWrapper } from "@/components/templates/TemplateRegistry";
import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";
import { BASE_URL } from "@/lib/constants";
import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, homePageDoc] = await Promise.all([
    SiteContent.findOne({ key: "complete_data" }).lean() as any,
    Page.findOne({
      $or: [{ slug: "/" }, { slug: "home" }, { title: /^home$/i }],
      status: "published",
      isTrashed: { $ne: true },
    }).lean() as any
  ]);

  const settings = content?.data?.settings;
  const homepageId = settings?.homepageId;
  const pageUrl = `${BASE_URL}/`;

  let metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      url: pageUrl,
      siteName: "410 Muscle Therapy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy",
    }
  };

  if (homepageId) {
    // Check if it's a page
    const page = await Page.findById(homepageId).lean() as any;
    if (page) {
      const seo = page.seo || {};
      const metaDescription = seo.metaDescription || page.content?.hero?.description || settings?.siteDescription || "";
      return {
        ...metadata,
        title: { absolute: seo.metaTitle || page.title },
        description: metaDescription,
        alternates: {
          canonical: seo.canonicalUrl || pageUrl,
        },
        openGraph: {
          ...metadata.openGraph,
          title: seo.ogTitle || seo.metaTitle || page.title,
          description: seo.ogDescription || seo.metaDescription || metaDescription,
          images: seo.featuredImage ? [{ url: seo.featuredImage }] : [`${BASE_URL}/logo.png`],
        },
        twitter: {
          ...metadata.twitter,
          title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || page.title,
          description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || metaDescription,
          images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/logo.png`].filter(Boolean) as string[],
        },
        robots: getRobotsMetadata(settings, seo)
      };
    }

    // Check if it's a service
    const service = content?.data?.services?.services?.find((s: any) => s._id === homepageId || s.slug === homepageId);
    if (service) {
      const seo = service.seo || {};
      const metaDescription = seo.metaDescription || service.description || "";
      return {
        ...metadata,
        title: { absolute: seo.metaTitle || service.title },
        description: metaDescription,
        alternates: {
          canonical: seo.canonicalUrl || pageUrl,
        },
        openGraph: {
          ...metadata.openGraph,
          title: seo.ogTitle || seo.metaTitle || service.title,
          description: seo.ogDescription || seo.metaDescription || metaDescription,
          images: seo.featuredImage ? [{ url: seo.featuredImage }] : [`${BASE_URL}/logo.png`],
        },
        twitter: {
          ...metadata.twitter,
          title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || service.title,
          description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || metaDescription,
          images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/logo.png`].filter(Boolean) as string[],
        },
        robots: getRobotsMetadata(settings, seo)
      };
    }
  }

  // Check homePageDoc from Page collection or homeData from SiteContent
  const homeData = content?.data?.home;
  const seo = homePageDoc?.seo || homeData?.seo || {};
  const metaTitle =
    seo.metaTitle ||
    homePageDoc?.title ||
    homeData?.seo?.metaTitle ||
    settings?.siteTitle ||
    "Massage Therapy in Timonium Maryland | 410 Muscle Therapy";

  const metaDescription =
    seo.metaDescription ||
    homePageDoc?.content?.hero?.description ||
    homeData?.seo?.metaDescription ||
    homeData?.hero?.description ||
    homeData?.hero?.subheadline ||
    settings?.siteDescription ||
    "Get real pain relief with massage therapy Timonium Maryland. 410 Muscle Therapy melts deep knots, eases stiffness and gets you moving. Book your session now.";

  return {
    ...metadata,
    title: {
      absolute: metaTitle,
    },
    description: metaDescription,
    robots: getRobotsMetadata(settings, seo),
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || metaTitle,
      description: seo.ogDescription || metaDescription,
      url: pageUrl,
      type: "website",
      siteName: "410 Muscle Therapy",
      images: [
        {
          url: seo.ogImage || seo.featuredImage || settings?.favicon || `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: "410 Muscle Therapy – Performance Recovery & Clinical Bodywork Maryland",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || metaTitle,
      description: seo.twitterDescription || seo.ogDescription || metaDescription,
      images: [seo.twitterImage || seo.ogImage || seo.featuredImage || settings?.favicon || `${BASE_URL}/logo.png`],
      creator: "@410MuscleTherapy",
      site: "@410MuscleTherapy",
    },
  };
}

export default async function HomePage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: 'complete_data' });
  const settings = content?.data?.settings || {};
  const homepageId = settings.homepageId;

  const servicesList = (content?.data?.services?.services || content?.data?.services?.items || []).map((s: any) => ({
    name: s.title || s.name
  }));

  const rawFaqs = content?.data?.faq?.items || [];
  const faqs = rawFaqs.filter((item: any) => 
    !item.visibility ||
    item.visibility === 'global' || 
    (item.visibility === 'specific' && item.targetPages?.includes('home'))
  );

  const { yoastGraph, serviceSchema, localBusinessSchema, faqSchema } = getHomepageSchemas(servicesList, faqs);

  const schemaScripts = (
    <>
      <script
        id="yoast-schema-graph"
        type="application/ld+json"
        className="yoast-schema-graph"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(yoastGraph) }}
      />
      <script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        id="localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {faqSchema && (
        <script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );

  if (homepageId) {
    const pageDoc = await Page.findOne({ 
      _id: homepageId, 
      status: 'published', 
      isTrashed: { $ne: true } 
    }).lean();
    if (pageDoc) {
      const page = JSON.parse(JSON.stringify(pageDoc));
      return (
        <>
          {schemaScripts}
          <TemplateWrapper 
            templateName={page.template} 
            pageData={{
              ...page,
              content: {
                ...(content?.data || {}),
                ...(page.content || {})
              }
            }} 
            params={Promise.resolve({ slug: ['/'] })} 
          />
        </>
      );
    }

    const serviceDoc = content?.data?.services?.services?.find((s: any) => 
      (s._id === homepageId || s.slug === homepageId) && s.status !== 'draft'
    );
    if (serviceDoc) {
      return (
        <>
          {schemaScripts}
          <ServiceDetailTemplate params={Promise.resolve({ slug: serviceDoc.slug })} />
        </>
      );
    }
  }

  // Default Home Template — try to find a home page document
  const homePageDoc = await Page.findOne({
    $or: [{ slug: "/" }, { slug: "home" }, { title: /^home$/i }],
    status: "published",
    isTrashed: { $ne: true },
  }).lean();
  const homePage = homePageDoc ? JSON.parse(JSON.stringify(homePageDoc)) : null;

  return (
    <>
      {schemaScripts}
      <HomeTemplate pageData={{ ...(homePage || {}), content: { ...(content?.data || {}), ...(homePage?.content || {}) } }} />
    </>
  );
}
