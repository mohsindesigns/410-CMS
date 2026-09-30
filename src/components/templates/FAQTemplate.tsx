"use client";

import Link from "next/link";
import { useContent } from "../../hooks/useContent";
import PageInlineFaqs from "@/components/PageInlineFaqs";
import RichTextRenderer from "../ui/RichTextRenderer";

export default function FAQTemplate({ pageData, params }: { pageData?: any, params?: any }) {
    const { faq: globalFaq, faqPage } = useContent() as any;

    // Use page-specific FAQs if provided (e.g. from dynamic pages), otherwise fallback to global
    const pageFaqs = pageData?.faqs || pageData?.content?.faqs || pageData?.content?.faq?.items;
    const faq = pageFaqs ? { ...globalFaq, items: pageFaqs } : globalFaq;
    const { section, items = [] } = faq || {};
    // Precedence: per-page overrides (set via Admin > Pages > [page] > SEO/content) win,
    // then the dedicated "FAQ Page Layout" editor (Admin > Pages > FAQ Page), then global FAQ section defaults.
    const bulkSchema = pageData?.content?.faqSchemaMarkup || pageData?.faqSchemaMarkup || faqPage?.faqSchemaMarkup;
    const title = pageData?.content?.faqTitle || pageData?.faqTitle || faqPage?.title || section?.headline;
    const subtitle = pageData?.content?.faqDescription || pageData?.faqDescription || faqPage?.description || section?.description;
    const badge = pageData?.content?.faqBadge || pageData?.faqBadge || faqPage?.badge || section?.badge;

    const hasCta = faqPage?.ctaTitle || faqPage?.ctaDescription;

    return (
        <main>
            <PageInlineFaqs
                faqs={items}
                faqSchemaMarkup={bulkSchema}
                title={title}
                subtitle={subtitle}
                badge={badge}
                showFilters={false}
            />
            {hasCta && (
                <section className="py-16 md:py-20 bg-gray-50 dark:bg-background">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        {faqPage.ctaTitle && (
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{faqPage.ctaTitle}</h2>
                        )}
                        {faqPage.ctaDescription && (
                            <div className="text-gray-600 dark:text-foreground/70 mb-8">
                                <RichTextRenderer content={faqPage.ctaDescription} stripParagraphs={true} />
                            </div>
                        )}
                        {faqPage.ctaPrimaryText && faqPage.ctaPrimaryLink && (
                            <Link
                                href={faqPage.ctaPrimaryLink}
                                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                            >
                                {faqPage.ctaPrimaryText}
                            </Link>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}
