
import { BASE_URL } from "./constants";

interface SchemaOptions {
  title: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
}

export function generateSchema(options: SchemaOptions) {
  const { title, description, slug = "", type = "WebPage", faqs, breadcrumbTitle, isService, image } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const pageUrl = (normalizedSlug === '/' || normalizedSlug === '') ? `${BASE_URL}/` : `${BASE_URL}${normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`}`;
  const isRoot = pageUrl === `${BASE_URL}/` || normalizedSlug === '/' || normalizedSlug === '';

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
      "https://www.facebook.com/410muscletherapy",
      "https://www.instagram.com/410muscletherapy",
      "https://www.linkedin.com/company/410muscletherapy"
    ]
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "410 Muscle Therapy",
    "image": `${BASE_URL}/logo.png`,
    "telephone": "410-555-0199",
    "email": "antoine.lyles@yahoo.com",
    "url": `${BASE_URL}/`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Heaver Plaza",
      "addressLocality": "Timonium",
      "addressRegion": "MD",
      "postalCode": "21093",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 39.4357,
      "longitude": -76.6264
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

  // 4. BreadcrumbList Schema (Only for subpages, not root homepage)
  const pathSegments = safeSlug.split('/').filter(Boolean);
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

  const graph: any[] = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema
  ];

  if (breadcrumbList) {
    graph.push(breadcrumbList);
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
