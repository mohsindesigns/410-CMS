
import { BASE_URL } from "./constants";

interface SchemaOptions {
  /** Clean entity name (e.g. the service name) - used for the Service name/serviceType and the breadcrumb. */
  title: string;
  /** Title of the page itself (the SEO title). Defaults to `title`. */
  pageTitle?: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service" | "Article" | "BlogPosting";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
  servicesList?: Array<{ name: string; description?: string }>;
  /** Only emitted when real dates are known - nothing is fabricated. */
  datePublished?: string;
  dateModified?: string;
  /** Rating shown in search results; managed in Admin > Reviews. Omitted entirely when not provided. */
  aggregateRating?: AggregateRatingInput;
}

export type AggregateRatingInput = { ratingValue: number; reviewCount: number } | null | undefined;

const BUSINESS_ID = `${BASE_URL}/#business`;

const HOMEPAGE_SERVICES: Array<{ name: string; slug: string }> = [
  { name: "Deep Tissue Massage", slug: "deep-tissue-massage-maryland" },
  { name: "Sports Massage", slug: "maryland-sports-massage-therapist" },
  { name: "Infrared Therapy", slug: "infrared-therapy-in-maryland" },
  { name: "Cupping Therapy", slug: "cupping-therapy-maryland" },
  { name: "Myofascial Release Therapy", slug: "myofascial-release-maryland" },
  { name: "Acupressure", slug: "acupressure-maryland" },
  { name: "Hot Towel Massage", slug: "hot-towel-massage-maryland" },
  { name: "Hot Stone Massage", slug: "hot-stone-massage-maryland" },
  { name: "Stretch Therapy", slug: "maryland-stretch-therapy" },
  { name: "Corrective Movement Therapy", slug: "corrective-movement-maryland" }
];

/**
 * ONE business entity used on every page (same @id, same name/address/phone/hours everywhere), so search engines
 * see a single consistent business instead of an Organization + LocalBusiness on inner pages and a different
 * LocalBusiness on the homepage. Values per the confirmed business details.
 */
function buildBusinessEntity(opts: { aggregateRating?: AggregateRatingInput; withOfferCatalog?: boolean } = {}) {
  const { aggregateRating, withOfferCatalog } = opts;
  return {
    "@type": ["LocalBusiness", "MassageTherapist"],
    "@id": BUSINESS_ID,
    "name": "410 Muscle Therapy",
    "url": `${BASE_URL}/`,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/icons/icon-512.png`,
      "width": 512,
      "height": 512
    },
    "image": `${BASE_URL}/og-default.png`,
    "telephone": "+1-443-473-2322",
    "email": "antoine.lyles@yahoo.com",
    "sameAs": [
      "https://www.instagram.com/410muscletherapy/",
      "https://www.tiktok.com/@410muscletherapy",
      "https://www.youtube.com/@Twon410"
    ],
    "description": "410 Muscle Therapy provides personalized massage therapy, sports massage, performance recovery, mobility restoration, and specialized muscle therapy services in Timonium, Maryland.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1301 York Rd, 8th Floor, Suite 48",
      "addressLocality": "Timonium",
      "addressRegion": "MD",
      "postalCode": "21093",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 39.4376,
      "longitude": -76.6197
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "07:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    ...(aggregateRating && aggregateRating.reviewCount > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(aggregateRating.ratingValue),
        "reviewCount": String(aggregateRating.reviewCount)
      }
    } : {}),
    "areaServed": [
      { "@type": "City", "name": "Timonium" },
      { "@type": "City", "name": "Lutherville" },
      { "@type": "City", "name": "Cockeysville" },
      { "@type": "City", "name": "Towson" },
      { "@type": "City", "name": "Hunt Valley" },
      { "@type": "AdministrativeArea", "name": "Baltimore County" }
    ],
    "priceRange": "$$",
    "knowsAbout": [
      "Deep Tissue Massage",
      "Sports Massage",
      "Infrared Therapy",
      "Cupping Therapy",
      "Myofascial Release Therapy",
      "Acupressure",
      "Hot Towel Massage",
      "Hot Stone Massage",
      "Stretch Therapy",
      "Corrective Movement Therapy",
      "Performance Recovery Specialist"
    ],
    ...(withOfferCatalog ? {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Massage Therapy and Performance Recovery Services",
        "itemListElement": HOMEPAGE_SERVICES.map(s => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": s.name,
            "url": `${BASE_URL}/${s.slug}/`
          }
        }))
      }
    } : {})
  };
}

const cleanText = (v: any) => String(v || "").replace(/<[^>]*>/g, "").trim();

function buildFaqEntities(faqs: Array<{ question?: string; answer?: string; q?: string; a?: string }> | undefined) {
  return (faqs || [])
    .filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a))
    .map(f => ({
      "@type": "Question",
      "name": cleanText(f.question || (f as any).q),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": cleanText(f.answer || (f as any).a)
      }
    }));
}

export function getHomepageSchemas(
  servicesList?: Array<{ name: string }>,
  faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string }>,
  aggregateRating?: AggregateRatingInput
) {
  void servicesList; // kept for call-site compatibility; the homepage offer catalog is fixed

  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": "410 Muscle Therapy",
    "publisher": {
      "@id": BUSINESS_ID
    }
  };

  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    "url": `${BASE_URL}/`,
    "name": "Performance Recovery Specialist Timonium | 410 Muscle Therapy",
    "isPartOf": {
      "@id": `${BASE_URL}/#website`
    },
    "about": {
      "@id": BUSINESS_ID
    },
    "mainEntity": {
      "@id": BUSINESS_ID
    }
  };

  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      buildBusinessEntity({ aggregateRating, withOfferCatalog: true }),
      websiteSchema,
      webpageSchema
    ]
  };

  let faqSchema: any = null;
  const entities = buildFaqEntities(faqs);
  if (entities.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      "mainEntity": entities
    };
  }

  return {
    homepageSchema,
    faqSchema
  };
}

export function generateSchema(options: SchemaOptions) {
  const {
    title,
    pageTitle,
    description,
    slug = "",
    type = "WebPage",
    faqs,
    breadcrumbTitle,
    isService,
    image,
    servicesList,
    datePublished,
    dateModified,
    aggregateRating
  } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const isRoot = normalizedSlug === '/' || normalizedSlug === '';

  if (isRoot) {
    return getHomepageSchemas(servicesList, faqs, aggregateRating);
  }

  const pageUrl = `${BASE_URL}${normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`}`;
  const webPageName = pageTitle || title;

  // 1. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": "410 Muscle Therapy",
    "publisher": { "@id": BUSINESS_ID }
  };

  // 2. BreadcrumbList Schema
  const pathSegments = (isService ? [safeSlug.replace(/^services\//, '').replace(/^\/+|\/+$/g, '')] : safeSlug.split('/')).filter(Boolean);
  const breadcrumbList = pathSegments.length > 0 ? {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`
      },
      ...(isService
        ? [
            { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/services/` },
            { "@type": "ListItem", "position": 3, "name": breadcrumbTitle || title, "item": pageUrl }
          ]
        : pathSegments.map((segment, index) => {
            const url = `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}/`;
            return {
              "@type": "ListItem",
              "position": index + 2,
              "name": index === pathSegments.length - 1 ? (breadcrumbTitle || title) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
              "item": url
            };
          }))
    ]
  } : null;

  const dates = {
    ...(datePublished ? { "datePublished": datePublished } : {}),
    ...(dateModified ? { "dateModified": dateModified } : {}),
  };

  // 3. Page entity. For service pages the page itself is a WebPage about the Service (below).
  const mainEntitySchema: any = isService
    ? {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        "url": pageUrl,
        "name": title,
        "serviceType": title,
        "description": description,
        "provider": { "@id": BUSINESS_ID },
        "areaServed": { "@type": "AdministrativeArea", "name": "Baltimore County, Maryland" },
        ...(image ? { "image": image } : {}),
      }
    : {
        "@type": type,
        "@id": `${pageUrl}#${type.toLowerCase()}`,
        "url": pageUrl,
        "name": webPageName,
        "description": description,
        ...dates,
        "inLanguage": "en",
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "about": { "@id": BUSINESS_ID },
        ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {}),
        ...(image ? {
          "image": {
            "@type": "ImageObject",
            "url": image
          },
          "primaryImageOfPage": {
            "@id": `${pageUrl}#primaryimage`
          }
        } : {})
      };

  // Service pages: a WebPage (named after the page's SEO title, nothing appended) that is about the Service.
  const servicePageSchema: any = isService ? {
    "@type": "WebPage",
    "@id": `${pageUrl}`,
    "url": pageUrl,
    "name": webPageName,
    "description": description,
    ...dates,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": { "@id": `${pageUrl}#service` },
    "mainEntity": { "@id": `${pageUrl}#service` },
    ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {}),
    ...(image ? { "primaryImageOfPage": { "@id": `${pageUrl}#primaryimage` } } : {})
  } : null;

  const graph: any[] = [
    buildBusinessEntity({ aggregateRating }),
    websiteSchema
  ];

  if (breadcrumbList) {
    graph.push(breadcrumbList);
  }

  if (servicePageSchema) {
    graph.push(servicePageSchema);
  }

  graph.push(mainEntitySchema);

  if (image) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${pageUrl}#primaryimage`,
      "url": image,
      "contentUrl": image
    });
  }

  const faqEntities = buildFaqEntities(faqs);
  if (faqEntities.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      "mainEntity": faqEntities
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
