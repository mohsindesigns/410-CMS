import { useContentContext } from "../context/ContentContext";
import { cleanMojibake } from "../lib/utils";

function sanitizeEncoding(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return cleanMojibake(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeEncoding(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = sanitizeEncoding(obj[key]);
    }
    return res;
  }
  return obj;
}

function proxyAllUrls(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.includes("https://res.cloudinary.com/dytytwyp6/image/upload/")) {
      return obj.replace(/https:\/\/res\.cloudinary\.com\/dytytwyp6\/image\/upload\//g, "/cdn-images/");
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => proxyAllUrls(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = proxyAllUrls(obj[key]);
    }
    return res;
  }
  return obj;
}

export const useContent = () => {
    const rawData = useContentContext();
    const completeData = sanitizeEncoding(proxyAllUrls(rawData));

    // Deep fallback helper to prevent undefined.property crashes
    const getSafe = (data: any, key: string, fallback: any = {}) => {
        return data?.[key] || fallback;
    };

    const contactPage = getSafe(completeData, 'contactPage', { info: {} });
    const info = contactPage?.info || {};

    const footer = getSafe(completeData, 'footer');
    const footerServices = getSafe(footer, 'services', { title: "Our Services", materials: { title: "Premium Materials", items: [] } });
    const footerContact = getSafe(footer, 'contact', { title: "Contact Us", email: "", phone: "", address: "", emergency: "", areas: "" });
    
    footerContact.email = footerContact.email || info.email || footer?.email || "";
    footerContact.phone = footerContact.phone || info.phone || footer?.phone || "";
    footerContact.address = footerContact.address || info.address || footer?.address || "";
    footerContact.hours = footerContact.hours || info.hours || footer?.hours || "";

    const footerCompany = getSafe(footer, 'company', { name: "Eagle Revolution", tagline: "Veteran Owned & Operated", description: "", logo: "" });
    const footerBottom = getSafe(footer, 'bottom', { copyright: "© 2026 Eagle Revolution", rights: "All Rights Reserved", tagline: "", links: [] });
    const footerMarquee = getSafe(footer, 'marquee', { texts: [], speed: 30, repeats: 8 });
    const footerCertifications = getSafe(footer, 'certifications', []);

    return {
        navbar: (() => {
            const nav = getSafe(completeData, 'navbar', { menu: [], logo: "", cta: { text: "Get Quote", href: "/contact-us" } });
            if (nav) {
                const linksList = (nav.companyLinks || nav.links || nav.menu || []).map((link: any) => {
                    if (link && (link.label === "Services" || link.href === "/services") && link.useMegaMenu === undefined) {
                        return { ...link, useMegaMenu: true };
                    }
                    return link;
                });
                nav.companyLinks = linksList;
                nav.links = linksList;
                nav.menu = linksList;
            }
            return nav;
        })(),
        hero: (() => {
            const h = getSafe(completeData, 'hero', { headlines: [], description: "", buttons: [], stats: [], images: [] });
            
            const label = h.badge || h.label || "Performance Recovery Specialist • Est. 2020";
            
            const headlines = h.headlines || [];
            const title1 = headlines[0]?.text || h.title1 || "Recover Faster.";
            const title2 = headlines[1]?.text || h.title2 || "Perform Higher.";
            
            const buttons = h.buttons || [];
            const ctaBook = buttons[0]?.text || h.ctaBook || "BOOK RECOVERY SESSION";
            const ctaServices = buttons[1]?.text || h.ctaServices || "EXPLORE SERVICES";
            
            const stats = h.stats || [];
            const socialProofText = stats.length > 0
                ? `${stats[0].value} ${stats[0].label}`
                : (h.socialProofText || "Trusted by 500+ athletes & active adults");
                
            const image = h.images?.[0] || h.image || "/images/hero-bg.webp";
            const imageAlt = h.bgImageAlt || h.imageAlt || "Expert muscle therapy session";
            
            const mappedHeadlines = headlines.length > 0 ? headlines : [
                { text: title1, highlight: false },
                { text: title2, highlight: true }
            ];
            
            const mappedButtons = buttons.length > 0 ? buttons : [
                { text: ctaBook, href: h.bookingUrl || "/#contact", primary: true, icon: "ArrowRight" },
                { text: ctaServices, href: "/#services", primary: false, icon: "ArrowRight" }
            ];
            
            const mappedStats = stats.length > 0 ? stats : [
                { value: "500+", label: "Athletes Treated", icon: "Star" }
            ];
            
            const mappedImages = h.images && h.images.length > 0 ? h.images : [image];

            return {
                ...h,
                label,
                title1,
                title2,
                ctaBook,
                ctaServices,
                socialProofText,
                image,
                imageAlt,
                
                // Back-compat for admin editor
                badge: label,
                headlines: mappedHeadlines,
                buttons: mappedButtons,
                stats: mappedStats,
                images: mappedImages,
                bgImageAlt: imageAlt
            };
        })(),
        about: getSafe(completeData, 'about'),
        services: (() => {
            const s = getSafe(completeData, 'services', { services: [] });
            let list = s;
            if (s && s.items && !s.services) {
                list = { ...s, services: s.items };
            } else if (s && s.services && !s.items) {
                list = { ...s, items: s.services };
            } else if (Array.isArray(s)) {
                list = { services: s, items: s };
            }

            const label = list.badge || list.label || "Our Services";
            const titleLine1 = list.titleLine1 || list.headline?.prefix || "Therapies";
            const titleLine2 = list.titleLine2 || list.headline?.highlight || "Designed";
            const titleLine3 = list.titleLine3 || list.headline?.suffix || "Around";
            const titleItalicWord = list.titleItalicWord || "You";
            
            const ctaAll = list.ctaAll || "VIEW ALL SERVICES";
            const ctaLearnMore = list.ctaLearnMore || "LEARN MORE";

            if (list && Array.isArray(list.services)) {
                list.services = list.services.map((item: any) => {
                    const title = item.title || item.name || "";
                    const name = item.name || item.title || "";
                    return { ...item, title, name };
                });
            }
            if (list && Array.isArray(list.items)) {
                list.items = list.items.map((item: any) => {
                    const title = item.title || item.name || "";
                    const name = item.name || item.title || "";
                    return { ...item, title, name };
                });
            }
            return {
                ...list,
                label,
                badge: label,
                titleLine1,
                titleLine2,
                titleLine3,
                titleItalicWord,
                ctaAll,
                ctaLearnMore,
                headline: {
                    prefix: titleLine1,
                    highlight: titleLine2,
                    suffix: titleLine3
                }
            };
        })(),
        leadership: (() => {
            const l = getSafe(completeData, 'leadership', {});
            const ceo = l.ceo || {};
            const section = l.section || {};

            const label = section.badge || "The Specialist";
            const title = section.headline || "Meet Antoine Lyles";
            const tagline = ceo.quotes?.[0] || ceo.title || "Performance Recovery Specialist";
            const image = ceo.image?.src || "/images/theraphist.jpeg";
            const imageAlt = ceo.image?.alt || ceo.alt || "Antoine Lyles — Performance Recovery Specialist";

            const descRaw = ceo.description || "";
            const paragraphs = descRaw.split(/<\/p>\s*<p>|\n\n|<br\s*\/?>/);
            const desc1 = paragraphs[0] ? paragraphs[0].replace(/<[^>]*>/g, '') : "";
            const desc2 = paragraphs[1] ? paragraphs[1].replace(/<[^>]*>/g, '') : "";

            const photoBadge = ceo.badges?.top || "PERFORMANCE RECOVERY SPECIALIST";
            const signatureName = ceo.name || "Antoine Lyles";
            const signatureTitle = ceo.title || "Performance Recovery Specialist";
            const ctaMore = l.ctaMore || "LEARN MORE ABOUT ANTOINE";
            const ctaLink = l.ctaLink || "";

            return {
                ...l,
                label,
                title,
                tagline,
                desc1,
                desc2,
                photoBadge,
                signatureName,
                signatureTitle,
                image,
                imageAlt,
                ctaMore,
                ctaLink,

                // Back-compat for admin editor
                section: {
                    badge: label,
                    headline: title,
                    description: descRaw
                },
                ceo: {
                    ...ceo,
                    name: signatureName,
                    title: signatureTitle,
                    quotes: [tagline],
                    description: descRaw,
                    badges: {
                        top: photoBadge,
                        bottom: ceo.badges?.bottom || ""
                    },
                    image: {
                        src: image,
                        alt: imageAlt
                    }
                }
            };
        })(),
        portfolio: (() => {
            const p = getSafe(completeData, 'portfolio', {});
            const selectedProjects = Array.isArray(p.projects) ? p.projects : [];

            // If no projects specifically selected for home, use from galleryPage
            if (selectedProjects.length === 0) {
                const galleryProjects = completeData?.galleryPage?.projects || [];
                if (Array.isArray(galleryProjects) && galleryProjects.length > 0) {
                    return {
                        ...p,
                        projects: galleryProjects.slice(0, 8) // Show up to 8 featured
                    };
                }
            }

            return {
                ...p,
                projects: selectedProjects
            };
        })(),
        testimonials: getSafe(completeData, 'testimonials', {
            section: { badge: "", headline: "", description: "" },
            items: []
        }),
        whyChooseUs: getSafe(completeData, 'whyChooseUs', {
            section: { badge: "", headline: "", description: "" },
            features: [],
            stats: [],
            cta: { badge: "", title: "", description: "", trustBadges: [], buttons: [] }
        }),
        faq: getSafe(completeData, 'faq', {
            section: { badge: "", headline: "", title: "", description: "" },
            categories: [],
            items: []
        }),
        process: getSafe(completeData, 'process', {
            label: "THE CLINICAL PROCESS",
            title: "Your Recovery Journey.",
            description: "",
            phaseLabel: "PHASE",
            items: []
        }),
        quote: getSafe(completeData, 'quote', {
            section: { badge: "", headline: "", description: "" },
            services: [],
            projectTypes: [],
            timelines: [],
            success: { title: "", message: "", response: "", buttonText: "" }
        }),
        footer: {
            ...footer,
            services: footerServices,
            contact: footerContact,
            company: footerCompany,
            bottom: footerBottom,
            marquee: footerMarquee,
            certifications: footerCertifications,
            newsletter: getSafe(footer, 'newsletter', { placeholder: "Enter your email", buttonText: "Subscribe" })
        },
        team: getSafe(completeData, 'team', {
            section: { badge: "", headline: "", description: "" },
            members: []
        }),
        careers: getSafe(completeData, 'careers', {
            section: { badge: "", headline: "", description: "" },
            roles: [],
            success: { title: "", description: "" },
            labels: { name: "", email: "", role: "", summary: "" }
        }),
        aboutPage: {
            ...(completeData?.aboutPage || {}),
            // Root-level overrides for dynamic pages
            ...(completeData?.hero ? { hero: completeData.hero } : {}),
            ...(completeData?.mission ? { mission: completeData.mission } : {}),
            ...(completeData?.story ? { story: completeData.story } : {}),
            ...(completeData?.values ? { values: completeData.values } : {}),
            ...(completeData?.capabilities ? { capabilities: completeData.capabilities } : {}),
            ...(completeData?.stats ? { stats: completeData.stats } : {}),
            ...(completeData?.ctaBanner ? { ctaBanner: completeData.ctaBanner } : {}),
            ...(completeData?.recognition ? { recognition: completeData.recognition } : {}),
        },
        images: getSafe(completeData, 'images', {}),
        loader: getSafe(completeData, 'loader', { company: { name: "Eagle Revolution", tagline: "Veteran Owned" }, phases: { simpleDark: 200, roofDraw: 300, logoText: 400, ready: 100 } }),
        quickQuote: getSafe(completeData, 'quickQuote', {
            title: "",
            description: "",
            buttonText: ""
        }),
        hours: getSafe(completeData, 'hours'),
        stats: getSafe(completeData, 'stats', {
            label: "",
            titleLine1: "",
            titleLine2: "",
            titleItalicWord: "",
            description: "",
            image: "",
            imageAlt: "",
            items: []
        }),
        contactPage: getSafe(completeData, 'contactPage', {
            header: { badge: "", headline: "", description: "" },
            formFields: [],
            info: {},
            social: {}
        }),
        galleryPage: getSafe(completeData, 'galleryPage', {
            header: { badge: "", title: "", description: "" }
        }),
        brandStore: getSafe(completeData, 'brandStore', {
            section: { badge: "", headline: "", description: "" },
            items: []
        }),
        serviceDetailPage: getSafe(completeData, 'serviceDetailPage'),
        settings: completeData?.settings || { siteTitle: "Eagle Revolution", siteTemplate: "%s | Eagle Revolution", favicon: "/eagle-logo.png" },
        globalSite: getSafe(completeData, 'globalSite', {}),
        globalMetadata: getSafe(completeData, 'globalMetadata', {}),
        faqPage: getSafe(completeData, 'faqPage'),
        blogSection: getSafe(completeData, 'blogSection', {
            title: "Latest from the Blog",
            subtitle: "Insights & News",
            description: "Stay updated with the latest trends, tips, and news from the roofing and construction industry.",
            selectedPosts: []
        }),
        allBlogs: Array.isArray(completeData?.allBlogs) ? completeData.allBlogs : [],
    };
};
