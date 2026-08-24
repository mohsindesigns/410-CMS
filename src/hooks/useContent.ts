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

    const footerCompany = getSafe(footer, 'company', { name: "410 Muscle Therapy", tagline: "Veteran Owned & Operated", description: "", logo: "" });
    const footerBottom = getSafe(footer, 'bottom', { copyright: "© 2026 410 Muscle Therapy", rights: "All Rights Reserved", tagline: "", links: [] });
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
            const h = getSafe(completeData, 'hero', { description: "" });
            
            const label = h.label || h.badge || "Performance Recovery Specialist • Est. 2020";
            
            const headlines = h.headlines || [];
            const title1 = h.title1 || headlines[0]?.text || "Recover Faster.";
            const title2 = h.title2 || headlines[1]?.text || "Perform Higher.";
            
            const buttons = h.buttons || [];
            const ctaBook = h.ctaBook || buttons[0]?.text || "BOOK RECOVERY SESSION";
            const ctaServices = h.ctaServices || buttons[1]?.text || "EXPLORE SERVICES";
            
            const stats = h.stats || [];
            const socialProofText = h.socialProofText || (stats.length > 0 ? `${stats[0].value} ${stats[0].label}` : "Trusted by 500+ athletes & active adults");
                
            const image = h.image || h.images?.[0] || "/images/hero-bg.webp";
            const imageAlt = h.imageAlt || h.bgImageAlt || "Expert muscle therapy session";
            
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
                headlines: [
                    { text: title1, highlight: false },
                    { text: title2, highlight: true }
                ],
                buttons: [
                    { text: ctaBook, href: h.bookingUrl || "/#contact", primary: true, icon: "ArrowRight" },
                    { text: ctaServices, href: "/#services", primary: false, icon: "ArrowRight" }
                ],
                stats: stats.length > 0 ? stats : [{ value: "500+", label: "Athletes Treated", icon: "Star" }],
                images: [image],
                bgImageAlt: imageAlt
            };
        })(),
        about: getSafe(completeData, 'about'),
        stats: (() => {
            const s = getSafe(completeData, 'stats', {});
            const defaultItems = [
                { value: "8+", label: "Years of Experience" },
                { value: "5,000+", label: "Clients Treated" },
                { value: "15,000+", label: "Sessions Completed" },
                { value: "100%", label: "Satisfaction Rate" }
            ];
            const items = Array.isArray(s.items) && s.items.length > 0 ? s.items : defaultItems;
            return {
                ...s,
                label: s.label || "Our Achievements",
                titleLine1: s.titleLine1 || "Proven Results.",
                titleLine2: s.titleLine2 || "Professional",
                titleItalicWord: s.titleItalicWord || "Standards.",
                description: s.description || "At 410 Muscle Therapy, we believe that true recovery is built on specialized bodywork and precision movement science.",
                image: s.image || "/images/blog-3.webp",
                imageAlt: s.imageAlt || "Clinical sports massage session",
                items
            };
        })(),
        services: (() => {
            const s = getSafe(completeData, 'services', { services: [] });
            const allServices = Array.isArray(s.services) && s.services.length > 0 
                ? s.services 
                : (Array.isArray(s.items) ? s.items : []);

            const formatService = (item: any, i: number) => {
                const title = item.title || item.name || `Service ${i + 1}`;
                const name = item.name || item.title || `Service ${i + 1}`;
                const slug = item.slug || item.id || title.toLowerCase().replace(/\s+/g, '-');
                const description = item.description || item.heroDescription || "";
                const image = item.image || item.featuredImage || "/images/service-massage.webp";
                const rawBenefits = item.benefits || item.focusCards || [];
                const benefits = Array.isArray(rawBenefits) && rawBenefits.length > 0 
                    ? rawBenefits 
                    : ["Targeted Recovery", "Pain Relief", "Mobility Restoration", "Certified Specialists"];
                return {
                    ...item,
                    id: item.id || String(i + 1).padStart(2, '0'),
                    title,
                    name,
                    slug,
                    description,
                    image,
                    benefits
                };
            };

            const formattedServices = allServices.map((svc: any, i: number) => formatService(svc, i));
            const rawItems = Array.isArray(s.items) && s.items.length > 0 ? s.items : formattedServices.slice(0, 6);
            const formattedItems = rawItems.map((svc: any, i: number) => formatService(svc, i));

            const label = s.label || s.badge || "Our Services";
            const titleLine1 = s.titleLine1 || s.headline?.prefix || "Therapies";
            const titleLine2 = s.titleLine2 || s.headline?.highlight || "Designed";
            const titleLine3 = s.titleLine3 || s.headline?.suffix || "Around";
            const titleItalicWord = s.titleItalicWord || "You";
            
            const ctaAll = s.ctaAll || "VIEW ALL SERVICES";
            const ctaLearnMore = s.ctaLearnMore || "LEARN MORE";

            return {
                ...s,
                label,
                badge: label,
                titleLine1,
                titleLine2,
                titleLine3,
                titleItalicWord,
                ctaAll,
                ctaLearnMore,
                services: formattedServices,
                items: formattedItems,
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

            const label = l.label || section.badge || "The Specialist";
            const title = l.title || section.headline || "Meet Antoine Lyles";
            const tagline = l.tagline || (typeof ceo.quotes?.[0] === 'string' ? ceo.quotes[0].replace(/<[^>]*>/g, '').trim() : "Performance Recovery Specialist");
            const image = l.image || ceo.image?.src || "/images/theraphist.jpeg";
            const imageAlt = l.imageAlt || ceo.image?.alt || "Antoine Lyles";

            const desc1 = l.desc1 || (ceo.description ? ceo.description.split("</p>")[0] + "</p>" : "<p>Antoine Lyles is a certified massage therapist specializing in clinical sports massage, myofascial release, and neuromuscular therapy.</p>");
            const desc2 = l.desc2 || (ceo.description && ceo.description.includes("</p>") ? ceo.description.split("</p>").slice(1).join("</p>") : "<p>With years of experience working with competitive athletes and active individuals, he delivers targeted protocols designed to restore functional movement.</p>");

            const photoBadge = l.photoBadge || ceo.badges?.top || "PERFORMANCE RECOVERY SPECIALIST";
            const signatureName = l.signatureName || ceo.name || "Antoine Lyles";
            const signatureTitle = l.signatureTitle || ceo.title || "Performance Recovery Specialist";
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
                    description: `${desc1}${desc2}`
                },
                ceo: {
                    ...ceo,
                    name: signatureName,
                    title: signatureTitle,
                    quotes: [tagline],
                    description: `${desc1}${desc2}`,
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
        testimonials: (() => {
            const t = getSafe(completeData, 'testimonials', { items: [], results: [] });
            
            const label = t.label || t.section?.badge || "Reviews";
            const title1 = t.title1 || t.section?.headlinePrefix || "Real People.";
            const title2 = t.title2 || t.section?.headlineHighlight || "Real Results.";
            const quoteIcon = t.quoteIcon || "\"";
            const dash = t.dash || "—";
            
            // Map selected reviews to items
            const selectedReviews = t.testimonials || [];
            const mappedReviews = selectedReviews.map((r: any) => ({
                quote: r.text || r.quote || "",
                name: r.name || "",
                stars: r.rating || r.stars || 5
            }));
            const items = mappedReviews.length > 0 ? mappedReviews : (t.items || []);
            const results = t.results || [];

            return {
                ...t,
                label,
                badge: label,
                title1,
                title2,
                quoteIcon,
                dash,
                items,
                results,
                // Back-compat for editor
                section: {
                    badge: label,
                    headlinePrefix: title1,
                    headlineHighlight: title2,
                    headlineSuffix: "",
                    featured: t.section?.featured || "Google Review"
                }
            };
        })(),
        whyChooseUs: getSafe(completeData, 'whyChooseUs', {
            section: { badge: "", headline: "", description: "" },
            features: [],
            stats: [],
            cta: { badge: "", title: "", description: "", trustBadges: [], buttons: [] }
        }),
        faq: (() => {
            const globalFaq = getSafe(completeData, 'faq', {
                section: { badge: "", headline: "", title: "", description: "" },
                categories: [],
                items: []
            });
            if (Array.isArray(completeData.faqs) && completeData.faqs.length > 0) {
                return {
                    ...globalFaq,
                    section: {
                        ...globalFaq.section,
                        badge: completeData.faqBadge || globalFaq.section?.badge || "",
                        headline: completeData.faqTitle || globalFaq.section?.headline || globalFaq.section?.title || "",
                        title: completeData.faqTitle || globalFaq.section?.title || "",
                        description: completeData.faqDescription || globalFaq.section?.description || ""
                    },
                    items: completeData.faqs.map((f: any) => ({
                        question: f.question,
                        answer: f.answer
                    }))
                };
            }
            return globalFaq;
        })(),
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
        contactFaq: (() => {
            const faqObj = getSafe(completeData, 'faq', { section: { badge: "", headline: "", description: "" }, items: [] });
            const quoteObj = getSafe(completeData, 'quote', { section: { badge: "", headline: "", description: "" }, services: [] });
            
            const faqLabel = faqObj.section?.badge || faqObj.badge || "FAQ";
            const faqTitle = faqObj.section?.headline || faqObj.title || faqObj.section?.title || "Frequently Asked Questions";
            const faqDescription = faqObj.section?.description || faqObj.description || "";

            const rawFaqItems = Array.isArray(faqObj.items) && faqObj.items.length > 0
              ? faqObj.items
              : (Array.isArray(completeData?.faqs) ? completeData.faqs : []);

            const formattedFaqs = rawFaqItems.map((f: any) => ({
              q: f.q || f.question || "",
              a: f.a || f.answer || "",
              question: f.question || f.q || "",
              answer: f.answer || f.a || ""
            }));
            
            const formLabel = quoteObj.section?.badge || quoteObj.badge || "GET IN TOUCH";
            const formTitle = quoteObj.section?.headline || quoteObj.title || "Have Questions? Let's Connect.";
            
            const formClinicPortal = quoteObj.formClinicPortal || "INSTANT ONLINE BOOKING";
            const formClinicPortalSub = quoteObj.formClinicPortalSub || "Book directly on StyleSeat portal";
            const formStyleSeatBtn = quoteObj.formStyleSeatBtn || "BOOK ON STYLESEAT";
            
            const formNameLabel = quoteObj.formNameLabel || "YOUR FULL NAME";
            const formNamePlaceholder = quoteObj.formNamePlaceholder || "Antoine Lyles";
            const formEmailLabel = quoteObj.formEmailLabel || "EMAIL ADDRESS";
            const formEmailPlaceholder = quoteObj.formEmailPlaceholder || "antoine@example.com";
            const formPhoneLabel = quoteObj.formPhoneLabel || "PHONE NUMBER";
            const formPhonePlaceholder = quoteObj.formPhonePlaceholder || "(410) 555-0199";
            const formServiceLabel = quoteObj.formServiceLabel || "DESIRED SERVICE CATEGORY";
            const formServicePlaceholder = quoteObj.formServicePlaceholder || "Select a service category";
            const formMessageLabel = quoteObj.formMessageLabel || "YOUR MESSAGE / INJURY DETAILS";
            const formMessagePlaceholder = quoteObj.formMessagePlaceholder || "Please describe any pain, stiffness, or injuries...";
            
            const formBtnSubmit = quoteObj.formBtnSubmit || "SEND MESSAGE";
            const formBtnSuccess = quoteObj.formBtnSuccess || "MESSAGE SENT!";
            const formSuccessToast = quoteObj.formSuccessToast || "Thank you! Your inquiry has been sent. We will reply within 24 hours.";
            
            const trustHipa = quoteObj.trustHipa || "HIPAA Compliant & Secure";
            const trustResponse = quoteObj.trustResponse || "Avg Response: 2 Hours";
            
            // Map quote.services to options format { label, value }
            const formServicesOptions = Array.isArray(quoteObj.services) && quoteObj.services.length > 0 
              ? quoteObj.services.map((s: any) => typeof s === 'string' ? { label: s, value: s } : { label: s.label || s.name || "", value: s.value || s.id || "" })
              : [
                  { label: "Performance Sports Massage", value: "sports-massage" },
                  { label: "PNF Stretch & Mobility Session", value: "pnf-stretch" },
                  { label: "Myofascial Trigger Point Therapy", value: "trigger-point" },
                  { label: "Therapeutic Muscle Scraping", value: "scraping" }
                ];
                
            return {
                label: formLabel,
                title: formTitle,
                description: "",
                faqLabel,
                faqTitle,
                faqDescription,
                formLabel,
                formTitle,
                formClinicPortal,
                formClinicPortalSub,
                formStyleSeatBtn,
                formNameLabel,
                formNamePlaceholder,
                formEmailLabel,
                formEmailPlaceholder,
                formPhoneLabel,
                formPhonePlaceholder,
                formServiceLabel,
                formServicePlaceholder,
                formMessageLabel,
                formMessagePlaceholder,
                formBtnSubmit,
                formBtnSuccess,
                formSuccessToast,
                trustHipa,
                trustResponse,
                formServicesOptions,
                faqs: formattedFaqs
            };
        })(),
        ctaBanner: (() => {
            const cb = getSafe(completeData, 'ctaBanner', {});
            return {
                ...cb,
                tagline: cb.tagline || "Take the First Step",
                title: cb.title || "Ready to Feel Your Best?",
                description: cb.description || "Book your appointment today and start your journey to a pain-free, stronger you.",
                button: cb.button || "BOOK APPOINTMENT",
                buttonUrl: cb.buttonUrl || cb.btnUrl || "https://www.styleseat.com/m/v/410muscletherapy"
            };
        })(),
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
        loader: getSafe(completeData, 'loader', { company: { name: "410 Muscle Therapy", tagline: "Veteran Owned" }, phases: { simpleDark: 200, roofDraw: 300, logoText: 400, ready: 100 } }),
        quickQuote: getSafe(completeData, 'quickQuote', {
            title: "",
            description: "",
            buttonText: ""
        }),
        hours: getSafe(completeData, 'hours'),
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
        settings: completeData?.settings || { siteTitle: "410 Muscle Therapy", siteTemplate: "%s | 410 Muscle Therapy", favicon: "/eagle-logo.png" },
        globalSite: getSafe(completeData, 'globalSite', {}),
        globalMetadata: getSafe(completeData, 'globalMetadata', {}),
        faqPage: getSafe(completeData, 'faqPage'),
        blogSection: getSafe(completeData, 'blogSection', {
            title: "Latest from the Blog",
            subtitle: "Insights & News",
            description: "Stay updated with the latest trends, tips, and news from the roofing and construction industry.",
            ctaAll: "View All Articles",
            ctaReadMore: "Read Article",
            selectedPosts: []
        }),
        allBlogs: Array.isArray(completeData?.allBlogs) ? completeData.allBlogs : [],
    };
};
