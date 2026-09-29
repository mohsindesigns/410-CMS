
import { BASE_URL } from "./constants";

interface SchemaOptions {
  title: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service" | "Article" | "BlogPosting";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
  servicesList?: Array<{ name: string; description?: string }>;
  datePublished?: string;
  dateModified?: string;
}

export function getHomepageSchemas(servicesList?: Array<{ name: string }>, faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string }>) {
  void servicesList; // kept for call-site compatibility; homepage graph below matches the fixed reference schema exactly

  const businessSchema = {
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    "@id": `${BASE_URL}/#business`,
    "name": "410 Muscle Therapy",
    "url": `${BASE_URL}/`,
    "telephone": "+1-443-473-2322",
    "email": "antoine.lyles@yahoo.com",
    "description": "410 Muscle Therapy in Timonium, Maryland provides specialized massage therapy services including deep tissue massage, sports massage, cupping therapy, myofascial release, stretch therapy, and corrective movement therapy to improve mobility and support recovery.",
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
      "latitude": "39.4376",
      "longitude": "-76.6197"
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
    "priceRange": "$$",
    "image": "https://410-muscletherapy.com/wp-content/uploads/2024/10/410-muscle-therapy-logo.png",
    "sameAs": [
      "https://www.instagram.com/410muscletherapy/",
      "https://www.tiktok.com/@410muscletherapy",
      "https://www.youtube.com/@Twon410"
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Timonium, Maryland"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "28"
    }
  };

  const organizationSchema = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "410 Muscle Therapy",
    "url": `${BASE_URL}/`,
    "logo": {
      "@type": "ImageObject",
      "url": "https://410-muscletherapy.com/wp-content/uploads/2024/10/410-muscle-therapy-logo.png"
    }
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": "410 Muscle Therapy",
    "publisher": {
      "@id": `${BASE_URL}/#organization`
    }
  };

  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    "url": `${BASE_URL}/`,
    "name": "410 Muscle Therapy | Performance Recovery Specialist Timonium",
    "isPartOf": {
      "@id": `${BASE_URL}/#website`
    },
    "about": {
      "@id": `${BASE_URL}/#business`
    }
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}/#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`
      }
    ]
  };

  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      businessSchema,
      organizationSchema,
      websiteSchema,
      webpageSchema,
      breadcrumbSchema
    ]
  };

  let faqSchema: any = null;
  const validFaqs = (faqs || []).filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a));
  if (validFaqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      "mainEntity": validFaqs.map(f => ({
        "@type": "Question",
        "name": (f.question || (f as any).q || "").replace(/<[^>]*>/g, "").trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": (f.answer || (f as any).a || "").replace(/<[^>]*>/g, "").trim()
        }
      }))
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
    description,
    slug = "",
    type = "WebPage",
    faqs,
    breadcrumbTitle,
    isService,
    image,
    servicesList,
    datePublished = "2025-02-07T15:28:30+00:00",
    dateModified = "2026-07-24T16:08:21+00:00"
  } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const isRoot = normalizedSlug === '/' || normalizedSlug === '';

  if (isRoot) {
    return getHomepageSchemas(servicesList, faqs);
  }

  const pageUrl = `${BASE_URL}${normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`}`;

  // 1. Organization Schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "410 Muscle Therapy",
    "url": `${BASE_URL}/`,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo.png`,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://www.instagram.com/410muscletherapy/",
      "https://www.tiktok.com/@410muscletherapy",
      "https://www.youtube.com/@Twon410"
    ]
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "410 Muscle Therapy",
    "image": `${BASE_URL}/logo.png`,
    "telephone": "+1-443-473-2322",
    "email": "antoine.lyles@yahoo.com",
    "url": `${BASE_URL}/`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1301 York Rd., 8th Floor, Ste 48",
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
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "28"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Maryland" },
      { "@type": "AdministrativeArea", "name": "Baltimore County" },
      { "@type": "AdministrativeArea", "name": "Timonium" },
      { "@type": "AdministrativeArea", "name": "Towson" },
      { "@type": "AdministrativeArea", "name": "Lutherville" },
      { "@type": "AdministrativeArea", "name": "Cockeysville" }
    ],
    "priceRange": "$$"
  };

  // 3. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": "410 Muscle Therapy",
    "publisher": { "@id": `${BASE_URL}/#organization` }
  };

  // 4. BreadcrumbList Schema
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
      ...pathSegments.map((segment, index) => {
        const url = `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}/`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": index === pathSegments.length - 1 ? (breadcrumbTitle || title) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": url
        };
      })
    ]
  } : null;

  // 5. WebPage / Service Schema
  const mainEntitySchema: any = {
    "@type": isService ? "Service" : type,
    "@id": `${pageUrl}#${(isService ? "service" : type).toLowerCase()}`,
    "url": pageUrl,
    "name": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
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

  if (isService) {
    mainEntitySchema["provider"] = { "@id": `${BASE_URL}/#organization` };
    mainEntitySchema["serviceType"] = title;
  }

  // Companion WebPage schema for Service pages so both Service & WebPage have dates & relations
  const companionWebPageSchema: any = isService ? {
    "@type": "WebPage",
    "@id": `${pageUrl}`,
    "url": pageUrl,
    "name": `${title} in Timonium Maryland | 410 Muscle Therapy`,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": { "@id": `${pageUrl}#service` },
    ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {})
  } : null;

  const graph: any[] = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema
  ];

  if (breadcrumbList) {
    graph.push(breadcrumbList);
  }

  if (companionWebPageSchema) {
    graph.push(companionWebPageSchema);
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

  if (faqs && Array.isArray(faqs) && faqs.length > 0) {
    const validFaqs = faqs.filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a));
    if (validFaqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": validFaqs.map(f => ({
          "@type": "Question",
          "name": (f.question || (f as any).q || "").replace(/<[^>]*>/g, "").trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": (f.answer || (f as any).a || "").replace(/<[^>]*>/g, "").trim()
          }
        }))
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
