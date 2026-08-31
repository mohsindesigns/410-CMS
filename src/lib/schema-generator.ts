
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
  servicesList?: Array<{ name: string; description?: string }>;
}

export function getHomepageSchemas(servicesList?: Array<{ name: string }>) {
  const defaultServices = [
    { name: "Deep Tissue Massage" },
    { name: "Sports Massage" },
    { name: "Myofascial Release" },
    { name: "Cupping Therapy" },
    { name: "Stretch Therapy" },
    { name: "Hot Stone Massage" }
  ];

  const serviceOffers = (servicesList && servicesList.length > 0 ? servicesList : defaultServices).map(s => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": s.name
    }
  }));

  const yoastGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/`,
        "url": `${BASE_URL}/`,
        "name": "Massage Therapy in Timonium Maryland | 410 Muscle Therapy",
        "isPartOf": {
          "@id": `${BASE_URL}/#website`
        },
        "about": {
          "@id": `${BASE_URL}/#organization`
        },
        "datePublished": "2025-02-07T15:28:30+00:00",
        "dateModified": "2026-07-24T16:08:21+00:00",
        "description": "Get real pain relief with massage therapy Timonium Maryland. 410 Muscle Therapy melts deep knots, eases stiffness and gets you moving. Book your session now.",
        "breadcrumb": {
          "@id": `${BASE_URL}/#breadcrumb`
        },
        "inLanguage": "en",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              `${BASE_URL}/`
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": `${BASE_URL}/`,
        "name": "410 Muscle Therapy",
        "description": "Heal. Perform. Thrive. – Your Path to Pain-Free Living",
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${BASE_URL}/?s={search_term_string}`
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          }
        ],
        "inLanguage": "en"
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "410 Muscle Therapy",
        "url": `${BASE_URL}/`,
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en",
          "@id": `${BASE_URL}/#/schema/logo/image/`,
          "url": "",
          "contentUrl": "",
          "caption": "410 Muscle Therapy"
        },
        "image": {
          "@id": `${BASE_URL}/#/schema/logo/image/`
        },
        "sameAs": [
          "https://www.instagram.com/Twonlyles_muscletherapy/",
          "https://www.youtube.com/@Twon410"
        ]
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Massage Therapy Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": "410 Muscle Therapy",
      "image": "https://410-muscletherapy.com/wp-content/uploads/2024/10/410-muscle-therapy-logo.png",
      "url": `${BASE_URL}/`,
      "telephone": "(410) 555-1234",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1301 York Rd., 8th Floor, Ste 48",
        "addressLocality": "Timonium",
        "addressRegion": "MD",
        "postalCode": "21093",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "Place",
      "name": "Timonium, Maryland"
    },
    "description": "410 Muscle Therapy provides expert massage therapy services in Maryland, including Deep Tissue Massage, Sports Massage, Myofascial Release, and Cupping Therapy designed to relieve pain, enhance mobility, and restore body balance.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Massage Therapy Services",
      "itemListElement": serviceOffers
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "410 Muscle Therapy",
    "image": "https://410-muscletherapy.com/wp-content/uploads/2024/10/410-muscle-therapy-logo.png",
    "@id": `${BASE_URL}/`,
    "url": `${BASE_URL}/`,
    "telephone": "(410) 555-1234",
    "priceRange": "$$",
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
      "latitude": 39.421,
      "longitude": -76.615
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/410muscletherapy",
      "https://www.instagram.com/410muscletherapy"
    ],
    "description": "410 Muscle Therapy in Timonium, Maryland specializes in professional massage therapy services including deep tissue massage, sports massage, myofascial release, cupping therapy, and stretch therapy to help relieve pain and improve mobility."
  };

  return {
    yoastGraph,
    serviceSchema,
    localBusinessSchema
  };
}

export function generateSchema(options: SchemaOptions) {
  const { title, description, slug = "", type = "WebPage", faqs, breadcrumbTitle, isService, image, servicesList } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const isRoot = normalizedSlug === '/' || normalizedSlug === '';

  if (isRoot) {
    return getHomepageSchemas(servicesList);
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
      "https://www.instagram.com/Twonlyles_muscletherapy/",
      "https://www.youtube.com/@Twon410",
      "https://www.facebook.com/410muscletherapy",
      "https://www.instagram.com/410muscletherapy"
    ]
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "410 Muscle Therapy",
    "image": `${BASE_URL}/logo.png`,
    "telephone": "(410) 555-1234",
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
      "latitude": 39.421,
      "longitude": -76.615
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
