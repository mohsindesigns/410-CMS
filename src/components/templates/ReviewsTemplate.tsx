"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { stripHtml } from "../../lib/utils";
import CtaBanner from "@/components/CtaBanner";
import { resolveReviewSelection, toPositiveNumber } from "@/lib/reviews";

// Defaults only - every text and link below can be changed in Admin > Pages > Reviews page.
const GOOGLE_MAPS_REVIEW_URL = "https://maps.app.goo.gl/PbvRBs4tJsDAJVMy6";
const DEFAULT_SUMMARY = "Based on {count} verified Google reviews from clients across Timonium, Towson, Lutherville and Cockeysville.";
const DEFAULT_BOOKING_URL = "https://www.styleseat.com/m/v/410muscletherapy";

/** "Oct 2026" - UTC so the server and the browser always print the same month. */
const formatMonth = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
};

const Stars = ({ count = 5, size = 14 }: { count?: number; size?: number }) => (
    <div className="flex gap-0.5 text-gold" aria-label={`${count} out of 5 stars`} role="img">
        {Array.from({ length: Math.max(0, Math.min(5, count)) }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" stroke="none" />
        ))}
    </div>
);

const ReviewCard = ({ review, index }: { review: any; index: number }) => {
    const reduceMotion = useReducedMotion();
    const text = stripHtml(review.text || review.quote);
    const name = stripHtml(review.name);
    const rating = Number(review.rating || review.stars || 5);
    const month = formatMonth(review.date);
    const byline = [stripHtml(review.position || review.role), stripHtml(review.company)].filter(Boolean).join(" · ");

    return (
        <motion.article
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: Math.min(index % 3, 2) * 0.08 }}
            className="group relative mb-5 break-inside-avoid overflow-hidden rounded-xl border border-border-dark bg-[rgba(26,26,26,0.75)] p-6 sm:p-8 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-[rgba(243,227,140,0.45)] hover:shadow-[0_24px_50px_-28px_rgba(243,227,140,0.35)]"
        >
            {/* gold rule draws in on hover */}
            <span aria-hidden className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-dark to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
            <span aria-hidden className="pointer-events-none absolute right-5 top-1 select-none font-serif text-[84px] leading-none text-[rgba(243,227,140,0.12)] transition-colors duration-500 group-hover:text-[rgba(243,227,140,0.22)]">
                &ldquo;
            </span>

            <div className="relative flex items-center justify-between gap-3 mb-5">
                <Stars count={rating} />
                {month && <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{month}</span>}
            </div>

            <p className="relative font-display text-[15px] md:text-[16px] italic leading-[1.8] text-white/80">
                {text}
            </p>

            <div className="relative mt-6 flex items-center gap-3 border-t border-border-dark pt-5">
                <span aria-hidden className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(243,227,140,0.35)] bg-[rgba(243,227,140,0.08)] font-display text-[15px] font-bold text-gold">
                    {name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                    <h3 className="truncate text-[13.5px] font-semibold tracking-wide text-gold">{name}</h3>
                    {byline && <p className="truncate text-[11px] uppercase tracking-[0.14em] text-white/45">{byline}</p>}
                </div>
            </div>
        </motion.article>
    );
};

export default function ReviewsTemplate({ pageData, params }: { pageData?: any, params?: any }) {
    const { testimonials: data, globalMetadata } = useContent();
    const { section, testimonials = [], selected, stats, googleRating, googleReviewCount } = (data || {}) as any;
    const reduceMotion = useReducedMotion();

    // Master list (Admin > Reviews), narrowed by the page's saved selection; no selection = show everything.
    const reviews: any[] = resolveReviewSelection(testimonials, selected).filter((r: any) => r && (r.text || r.quote));
    const bookingUrl = globalMetadata?.bookingUrl || DEFAULT_BOOKING_URL;

    // Rating box: CMS values (Admin > Reviews > Summary), else the Google-import figures, else computed from the list.
    const computedAvg = reviews.length
        ? reviews.reduce((sum, r) => sum + Number(r.rating || r.stars || 5), 0) / reviews.length
        : 5;
    const rating = toPositiveNumber(stats?.rating) ?? toPositiveNumber(googleRating) ?? computedAvg;
    const total = Math.round(toPositiveNumber(stats?.count) ?? toPositiveNumber(googleReviewCount) ?? reviews.length);
    const showSummary = section?.showSummary !== false;
    const ratingLabel = stripHtml(stats?.label) || "Google rating";
    const summaryText = (stripHtml(section?.summaryText) || DEFAULT_SUMMARY).replace(/{rating}/g, rating.toFixed(1));
    const summaryParts = summaryText.split("{count}");

    const primaryText = stripHtml(section?.ctaPrimaryText) || "Leave a Google Review";
    const primaryUrl = (section?.ctaPrimaryUrl || "").trim() || GOOGLE_MAPS_REVIEW_URL;
    const secondaryText = stripHtml(section?.ctaSecondaryText) || "Book Appointment";
    const secondaryUrl = (section?.ctaSecondaryUrl || "").trim() || bookingUrl;
    const emptyText = stripHtml(section?.emptyText) || "Reviews are coming soon.";

    const label = (stripHtml(section?.badge) || "").toUpperCase() === "REVIEWS" || !section?.badge ? "CLIENT REVIEWS" : stripHtml(section?.badge);
    const headline = stripHtml(section?.headline) || "What Our Clients Say";
    const words = headline.split(" ");
    const lead = words.length > 1 ? words.slice(0, -1).join(" ") : "";
    const accent = words.length > 1 ? words[words.length - 1] : headline;
    const description = stripHtml(section?.description);

    const rise = (delay = 0) => ({
        initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    });

    return (
        <main className="relative bg-dark">
            {/* ═════════ HERO ═════════ */}
            <section className="relative overflow-hidden border-b border-border-dark pt-[140px] pb-16 md:pb-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-dots-gold opacity-[0.04]" />
                <div aria-hidden className="pointer-events-none absolute -top-40 left-1/4 h-[460px] w-[460px] rounded-full bg-[rgba(243,227,140,0.10)] blur-[150px]" />
                <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 h-[380px] w-[380px] rounded-full bg-[rgba(135,100,4,0.18)] blur-[150px]" />

                <div className="site-container relative">
                    <div className={`grid grid-cols-1 items-end gap-10 ${showSummary ? "lg:grid-cols-[1.55fr_1fr] lg:gap-14" : ""}`}>
                        <div>
                            <motion.div {...rise(0)} className="mb-5 flex items-center gap-3">
                                <span className="h-px w-10 bg-gold" />
                                <p className="section-label">{label}</p>
                            </motion.div>

                            <motion.h1 {...rise(0.08)} className="display-heading text-[38px] min-[400px]:text-[46px] md:text-[54px] lg:text-[58px] leading-[1.05] tracking-tight text-white">
                                {lead} <span className="italic font-light text-gold">{accent}</span>
                            </motion.h1>

                            {description && (
                                <motion.p {...rise(0.16)} className="mt-6 max-w-[560px] border-l-2 border-[rgba(243,227,140,0.4)] pl-5 text-[15px] md:text-[17px] font-light leading-[1.85] text-white/70">
                                    {description}
                                </motion.p>
                            )}

                            <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                                {primaryText && (
                                    <a href={primaryUrl} target={/^https?:/i.test(primaryUrl) ? "_blank" : undefined} rel="noopener noreferrer" className="btn-gold w-full justify-center text-center sm:w-auto">
                                        {primaryText} <ArrowRight size={14} className="ml-1" />
                                    </a>
                                )}
                                {secondaryText && (
                                    <a href={secondaryUrl} target={/^https?:/i.test(secondaryUrl) ? "_blank" : undefined} rel="noopener noreferrer" className="btn-outline-white w-full justify-center text-center sm:w-auto">
                                        {secondaryText} <ArrowRight size={14} className="ml-1" />
                                    </a>
                                )}
                            </motion.div>
                        </div>

                        {/* Rating summary */}
                        {showSummary && (
                        <motion.div {...rise(0.2)} className="rounded-xl border border-border-dark bg-[rgba(26,26,26,0.75)] p-7 sm:p-9 backdrop-blur-sm">
                            <div className="flex items-end gap-4">
                                <span className="font-display text-[72px] md:text-[88px] font-bold leading-[0.9] text-gold">{rating.toFixed(1)}</span>
                                <div className="pb-2">
                                    <Stars count={Math.round(rating)} size={18} />
                                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">{ratingLabel}</p>
                                </div>
                            </div>
                            <div className="my-6 h-px w-full bg-border-dark" />
                            <p className="text-[14px] font-light leading-relaxed text-white/70">
                                {summaryParts.map((part, i) => (
                                    <span key={i}>
                                        {part}
                                        {i < summaryParts.length - 1 && <strong className="font-semibold text-white">{total}</strong>}
                                    </span>
                                ))}
                            </p>
                        </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═════════ REVIEWS ═════════ */}
            <section className="relative py-16 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-dots-gold opacity-[0.03]" />
                <div className="site-container relative">
                    {reviews.length > 0 ? (
                        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
                            {reviews.map((review, i) => (
                                <ReviewCard key={review.id || `${review.name}-${i}`} review={review} index={i} />
                            ))}
                        </div>
                    ) : (
                        <p className="py-20 text-center text-white/60">{emptyText}</p>
                    )}
                </div>
            </section>

            {/* ═════════ CTA ═════════ */}
            <CtaBanner />
        </main>
    );
}
