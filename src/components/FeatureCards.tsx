"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";
import { DEFAULT_FEATURE_CARDS, type FeatureCardItem } from "../lib/featureCards";
import { FEATURE_ICONS } from "../lib/featureCardIcons";

/** Pointer-follow spotlight: writes the cursor position into CSS vars read by the card's glow layer. */
function trackPointer(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function CardLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = /^https?:\/\//i.test(href);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function FeatureCards() {
  const { featureCards } = useContent() as any;
  const reduceMotion = useReducedMotion();

  // Not saved yet -> starter content. Saved -> exactly what the dashboard holds
  // (so clearing a field or deleting every card really does clear / hide it).
  const fc = featureCards && typeof featureCards === "object" && Object.keys(featureCards).length > 0
    ? featureCards
    : DEFAULT_FEATURE_CARDS;

  if (fc.enabled === false) return null;

  const items: FeatureCardItem[] = Array.isArray(fc.items) ? fc.items.filter((c: FeatureCardItem) => c && (c.title || c.description)) : [];
  if (items.length === 0) return null;

  const title1 = stripHtml(fc.titleLine1);
  const title2 = stripHtml(fc.titleLine2);
  const italic = stripHtml(fc.titleItalicWord);
  const ctaText = stripHtml(fc.ctaText);
  const ctaUrl = (fc.ctaUrl || "").trim();

  const cols =
    items.length === 4 || items.length <= 2
      ? "lg:grid-cols-2"
      : "lg:grid-cols-3";

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09 } },
  } as const;
  const rise = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section
      id="why-us"
      aria-labelledby="feature-cards-heading"
      className="relative overflow-hidden bg-warm-white py-24 md:py-32 border-y border-border-light"
    >
      {/* ── Atmosphere: dot grid, warm glow, hairline frame ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-dots-gold opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-[rgba(243,227,140,0.25)] blur-[150px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 h-[460px] w-[460px] rounded-full bg-[rgba(135,100,4,0.10)] blur-[150px]" />

      <div className="site-container relative">
        {/* ── Header ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 md:mb-20 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-14 items-end"
        >
          <div>
            {fc.label && (
              <motion.div variants={rise} className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-gold-dark" />
                <p className="section-label text-gold-dark">{stripHtml(fc.label)}</p>
              </motion.div>
            )}
            <motion.h2
              id="feature-cards-heading"
              variants={rise}
              className="display-heading text-[34px] min-[400px]:text-[42px] md:text-[48px] lg:text-[50px] text-dark leading-[1.06] tracking-tight [text-wrap:balance]"
            >
              {title1}
              {title1 && title2 && <br className="hidden sm:block" />} {title2}{" "}
              {italic && <span className="text-gold-dark italic font-light">{italic}</span>}
            </motion.h2>
          </div>

          <motion.div variants={rise} className="lg:pb-2">
            {fc.description && (
              <p className="text-[15px] md:text-[17px] leading-[1.85] font-light text-[rgba(10,10,10,0.68)] max-w-[520px] border-l-2 border-[rgba(135,100,4,0.45)] pl-5">
                {stripHtml(fc.description)}
              </p>
            )}
            {ctaText && ctaUrl && (
              <CardLink
                href={ctaUrl}
                className="btn-gold mt-7 inline-flex w-full sm:w-auto justify-center text-center cursor-pointer"
              >
                {ctaText} <ArrowRight size={14} className="ml-1" />
              </CardLink>
            )}
          </motion.div>
        </motion.div>

        {/* ── Cards ── */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-4 md:gap-6 list-none p-0 m-0`}
        >
          {items.map((card, i) => {
            const Icon = FEATURE_ICONS[card.icon] || FEATURE_ICONS.Sparkles;
            const hasLink = !!(card.linkUrl && card.linkText);
            const number = String(i + 1).padStart(2, "0");

            return (
              <motion.li key={`${card.title}-${i}`} variants={rise} className="h-full">
                <article
                  onMouseMove={reduceMotion ? undefined : trackPointer}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border-light bg-white p-7 md:p-9 shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_40px_-24px_rgba(20,15,0,0.18)] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-[rgba(135,100,4,0.5)] hover:shadow-[0_30px_60px_-28px_rgba(135,100,4,0.45)] focus-within:border-[rgba(135,100,4,0.6)]"
                  style={{ ["--mx" as any]: "50%", ["--my" as any]: "0%" }}
                >
                  {/* pointer spotlight */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(380px circle at var(--mx) var(--my), rgba(216,198,110,0.28), transparent 65%)" }}
                  />
                  {/* gold top rule draws in on hover */}
                  <span aria-hidden className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold-dark via-gold to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
                  {/* oversized index numeral */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-7 right-3 select-none font-display text-[120px] font-bold leading-none tracking-tighter text-[rgba(10,10,10,0.045)] transition-colors duration-500 group-hover:text-[rgba(135,100,4,0.14)]"
                  >
                    {number}
                  </span>

                  <div className="relative flex items-start justify-between gap-4 mb-8">
                    <div className="relative">
                      <div aria-hidden className="absolute inset-0 rounded-2xl bg-[rgba(243,227,140,0.6)] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
                      <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-dark text-gold ring-1 ring-[rgba(243,227,140,0.3)] transition-all duration-500 group-hover:rotate-[-6deg] group-hover:scale-105 group-hover:bg-gold-dark group-hover:text-white group-hover:ring-[rgba(243,227,140,0.6)]">
                        <Icon size={26} strokeWidth={1.6} />
                      </div>
                    </div>
                    {card.tag && (
                      <span className="mt-1 rounded-full border border-[rgba(135,100,4,0.25)] bg-[rgba(135,100,4,0.06)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-gold-dark">
                        {stripHtml(card.tag)}
                      </span>
                    )}
                  </div>

                  <h3 className="relative font-display text-[21px] md:text-[23px] font-semibold leading-snug text-dark transition-colors duration-300 group-hover:text-gold-dark">
                    {stripHtml(card.title)}
                  </h3>
                  <p className="relative mt-3 text-[14.5px] leading-[1.8] font-light text-[rgba(10,10,10,0.68)]">
                    {stripHtml(card.description)}
                  </p>

                  {hasLink ? (
                    <CardLink
                      href={card.linkUrl as string}
                      className="relative mt-auto pt-7 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-dark transition-colors hover:text-gold-dark focus-visible:outline-none focus-visible:text-gold-dark"
                    >
                      <span className="border-b border-[rgba(135,100,4,0.45)] pb-0.5">{stripHtml(card.linkText)}</span>
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </CardLink>
                  ) : (
                    <span aria-hidden className="relative mt-auto pt-7 flex items-center gap-3">
                      <span className="h-px flex-1 bg-border-light transition-colors duration-500 group-hover:bg-[rgba(135,100,4,0.4)]" />
                      <span className="h-1.5 w-1.5 rotate-45 bg-[rgba(135,100,4,0.5)] transition-all duration-500 group-hover:scale-150 group-hover:bg-gold-dark" />
                    </span>
                  )}
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
