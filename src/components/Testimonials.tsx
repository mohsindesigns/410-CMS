"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { testimonials } = useContent();

  const {
    label = "Clients Love Us",
    title1 = "Real People.",
    title2 = "Real Results.",
    quoteIcon = "\"",
    dash = "—",
    items = [],
    results = []
  } = testimonials || {};

  const prev = () => setActiveIdx((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === items.length - 1 ? 0 : i + 1));

  if (!items || items.length === 0) return null;
  const activeTestimonial = items[activeIdx];

  return (
    <section id="testimonials" className="bg-dark py-20 md:py-32 relative overflow-hidden border-t border-white/10">
      {/* Delicate Ambient radial dot grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-radial-dots-gold pointer-events-none" />

      <div className="site-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-stretch">

          {/* ── Left: Quote ── */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <p className="section-label mb-4 md:mb-5">{label}</p>

              <h2 className="display-heading text-white leading-[1.06] mb-8 md:mb-10">
                <span className="text-[32px] min-[400px]:text-[38px] md:text-[48px]">{title1}</span><br />
                <span className="text-[32px] min-[400px]:text-[38px] md:text-[48px] text-gold italic">{title2}</span>
              </h2>

              {/* Quote card */}
              <div className="border border-border-dark bg-dark-3/60 p-5 sm:p-8 mb-6 md:mb-8 relative min-h-[220px] md:min-h-[240px] flex flex-col justify-between rounded-lg">
                {/* Large decorative quote mark */}
                <span className="absolute -top-5 left-4 sm:left-6 text-[60px] md:text-[80px] leading-none text-gold font-serif select-none">
                  {quoteIcon}
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <p className="text-white/80 text-[13.5px] min-[400px]:text-[15px] md:text-[16px] leading-[1.65] md:leading-[1.75] font-display italic pt-3 sm:pt-4 mb-5">
                      {stripHtml(activeTestimonial.quote)}
                    </p>

                    {/* Stars + name */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-border-dark">
                      <div className="flex gap-0.5 text-gold flex-shrink-0">
                        {Array.from({ length: activeTestimonial.stars || 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" stroke="none" />
                        ))}
                      </div>
                      <span className="text-gold text-[11.5px] min-[400px]:text-[12.5px] md:text-[13px] font-semibold tracking-wide">
                        {dash} {stripHtml(activeTestimonial.name)}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 md:w-12 md:h-12 border border-border-dark text-white/50 flex items-center justify-center rounded-md hover:border-gold hover:text-gold transition-colors duration-200"
              >
                <ChevronLeft size={18} className="md:w-5 md:h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 md:w-12 md:h-12 border border-border-dark text-white/50 flex items-center justify-center rounded-md hover:border-gold hover:text-gold transition-colors duration-200"
              >
                <ChevronRight size={18} className="md:w-5 md:h-5" />
              </button>
              {/* Dots */}
              <div className="flex gap-1.5 ml-2">
                {items.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-2 rounded-full transition-all duration-200
                      ${i === activeIdx ? "bg-gold w-5" : "bg-white/20 w-2 hover:bg-gold/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Result Cards (6 Images Grid) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-8 lg:mt-0">
            {(results || []).slice(0, 6).map((result: any) => (
              <div key={result.id} className="group relative overflow-hidden cursor-pointer aspect-[4/5] min-h-[170px] border border-border-dark bg-dark-3 rounded-md">
                {/* Photo */}
                <div className="img-testimonial-tile relative w-full h-full">
                  <Image
                    src={result.image || "/images/placeholder.svg"}
                    alt={result.label || "Testimonial result"}
                    fill
                    sizes="(max-width: 640px) 45vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Strong gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />

                  {/* Gold corner accent */}
                  <div className="absolute top-0 left-0 w-5 h-5 m-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gold" />
                    <div className="absolute top-0 left-0 h-full w-[2px] bg-gold" />
                  </div>
                </div>

                {/* Caption */}
                <p className="absolute bottom-3 left-2.5 right-2.5 text-white text-[10.5px] min-[400px]:text-[11.5px] font-semibold leading-tight opacity-90 group-hover:opacity-100 transition-opacity">
                  {result.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}