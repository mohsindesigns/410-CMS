"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { services } = useContent();

  const { label, titleLine1, titleLine2, titleLine3, titleItalicWord, description, ctaAll, ctaLearnMore, items = [] } = services || {};
  
  const active = items[activeIdx] || {
    id: "01",
    name: "Deep Tissue Therapy",
    description: "Targets chronic muscle tension and knots to relieve pain and restore natural movement.",
    image: "/images/service-massage.webp",
    benefits: ["Relieves tightness & knots", "Improves mobility", "Enhances blood flow", "Reduces pain & stiffness"],
    slug: "deep-tissue-therapy"
  };

  return (
    <section id="services" className="bg-dark py-20 md:py-28 overflow-hidden">
      <div className="site-container">
        
        {/* Flexible Minimum Height Grid - Zero Text Clipping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 items-stretch h-auto lg:min-h-[580px]">

          {/* ── Col 1: Intro / Section Title ── */}
          <div className="w-full lg:pr-8 lg:border-r border-border-dark flex flex-col justify-between py-2 h-full">
            <div>
              <p className="section-label mb-4">{stripHtml(label)}</p>
              <h2 className="display-heading text-[32px] min-[400px]:text-[36px] md:text-[40px] text-white leading-[1.12] mb-5">
                {stripHtml(titleLine1)}<br className="hidden lg:block" /> {stripHtml(titleLine2)}<br className="hidden lg:block" /> {stripHtml(titleLine3)}{' '}
                <em className="text-gold not-italic italic">{stripHtml(titleItalicWord)}</em>
              </h2>
              <p className="text-white/45 text-[13.5px] leading-[1.8] font-light">
                {stripHtml(description)}
              </p>
            </div>
            
            <div className="pt-6 border-t border-border-dark/60 mt-auto">
              <Link href="/services/" className="btn-outline-white text-[11px] w-full justify-center text-center">
                {ctaAll} <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </div>
          </div>

          {/* ── Col 2: Service List Navigation ── */}
          <div className="w-full lg:px-8 lg:border-r border-border-dark overflow-hidden flex flex-col justify-between py-2 h-full">
            <div className="flex flex-col gap-1 my-auto">
              {items.map((svc: any, i: number) => (
                <button
                  key={svc.id}
                  onClick={() => setActiveIdx(i)}
                  className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-lg border-b border-border-dark/60 transition-all duration-200 group relative
                    ${i === activeIdx ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                >
                  {i === activeIdx && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold rounded-l"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className={`text-[10px] font-bold tracking-widest w-6 flex-shrink-0 transition-colors ${i === activeIdx ? 'text-gold' : 'text-white/20 group-hover:text-white/40'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-[13.5px] font-medium transition-colors truncate ${i === activeIdx ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white/80'}`}>
                    {svc.name}
                  </span>
                  {i === activeIdx && (
                    <ArrowRight size={14} className="ml-auto text-gold flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Col 3: Active Detail Showcase (Fixed Height, Strictly 4 Benefits) ── */}
          <div className="w-full lg:pl-8 flex flex-col h-full justify-between py-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex flex-col justify-between h-full w-full"
              >
                {/* Upper block */}
                <div>
                  {/* Service image preview */}
                  <div className="img-service-preview relative h-[170px] rounded-xl overflow-hidden mb-4 border border-white/10 shadow-2xl bg-black/40">
                    <Image
                      src={active.image || "/images/service-massage.webp"}
                      alt={active.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 450px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
                    <span className="absolute bottom-3 right-5 text-[48px] font-bold leading-none text-white/10 font-serif select-none pointer-events-none">
                      {String(activeIdx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="display-heading text-[22px] md:text-[25px] text-white mb-2 leading-tight">{stripHtml(active.name)}</h3>
                  <p className="text-white/70 text-[13.5px] leading-[1.65] mb-5 font-light min-h-[58px]">
                    {stripHtml(active.description)}
                  </p>

                  {/* Strictly 4 benefits for clean visual consistency */}
                  {active.benefits && (
                    <div className="flex flex-col gap-2.5 min-h-[110px] justify-start mb-6">
                      {active.benefits.slice(0, 4).map((b: any, idx: number) => {
                        const benefitText = typeof b === 'string' ? b : (b.title || b.name || b.label || "");
                        return (
                          <div key={idx} className="flex items-center gap-2.5 text-white/80 text-[13px]">
                            <CheckCircle2 size={14} className="text-gold flex-shrink-0" />
                            <span className="truncate">{stripHtml(benefitText)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Lower CTA Button block (100% Locked Position) */}
                <div className="pt-2 mt-auto">
                  <Link
                    href={`/${active.slug || active.id}/`}
                    className="btn-gold inline-flex items-center justify-center py-3 px-5 text-[11.5px] font-bold uppercase tracking-wider group/btn"
                  >
                    <span>
                      {(() => {
                        const rawTitle = stripHtml(active.name || active.title || "");
                        if (!rawTitle) return ctaLearnMore || "Explore Service";
                        const shortTitle = rawTitle.replace(/\s*(maryland|baltimore|timonium|clinic)\s*/gi, " ").trim();
                        return `Explore ${shortTitle}`;
                      })()}
                    </span>
                    <ArrowRight size={13} className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}