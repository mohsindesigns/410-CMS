"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks/useContent";

const stepImages = [
  "/images/blog-1.webp",
  "/images/blog-2.webp",
  "/images/service-massage.webp",
  "/images/testimonial-3.webp",
];

export default function HowItWorksSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { process } = useContent();

  const {
    label = "THE CLINICAL PROCESS",
    title = "Your Recovery Journey.",
    description = "",
    phaseLabel = "PHASE",
    items = []
  } = process || {};

  // Scroll-based sync: finds the step whose center is closest to 40% from the top of the viewport
  useEffect(() => {
    const handleScroll = () => {
      const focalPoint = window.innerHeight * 0.4; // 40% down from top
      const steps = document.querySelectorAll(".process-step-item");
      let bestIdx = 0;
      let bestDist = Infinity;

      steps.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - focalPoint);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActiveIdx(bestIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial active state on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleStepClick = (idx: number) => {
    setActiveIdx(idx);
    const target = document.querySelector(`[data-step-index="${idx}"]`);
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 160;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-16 md:py-32 relative border-t border-border-light/40">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-grid-pattern-black pointer-events-none" />

      <div className="site-container relative">

        {/* ── Header ── */}
        <div className="mb-12 md:mb-20 max-w-xl">
          <p className="section-label text-gold-dark mb-4">{label}</p>
          <h2 className="display-heading text-[28px] min-[400px]:text-[34px] md:text-[48px] text-dark leading-tight">
            {title}
          </h2>
          <p className="text-dark/55 text-[14px] md:text-[15px] leading-relaxed mt-4">
            {description}
          </p>
        </div>

        {/* ── Sticky Scroll Reveal Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20">

          {/* Left Column: Full-height container, sticky image frame */}
          <div className="hidden md:block">
            <div className="sticky top-36 h-[460px] w-full overflow-hidden rounded-xl shadow-2xl border border-border-light bg-dark">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={items[activeIdx]?.image || stepImages[activeIdx] || stepImages[0]}
                    alt={items[activeIdx]?.title || "Recovery Phase"}
                    fill
                    sizes="45vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Phase Overlay Badge */}
              {items && items[activeIdx] && (
                <div className="absolute bottom-6 left-6 right-6 bg-dark/85 backdrop-blur-md p-4 border border-white/15 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-gold font-mono font-bold text-[11px] tracking-[0.2em] uppercase mb-0.5">
                      {phaseLabel} {items[activeIdx].id}
                    </p>
                    <p className="text-white font-semibold text-[14px] leading-snug">
                      {items[activeIdx].title}
                    </p>
                  </div>
                  <span className="text-white/40 text-[11px] font-mono font-bold">
                    {activeIdx + 1} / {items.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Scroll Trigger Items */}
          <div className="flex flex-col gap-8 md:gap-14">
            {(items || []).map((step: any, idx: number) => {
              const actions = step.actions || [];
              const isActive = activeIdx === idx;

              return (
                <div
                  key={step.id}
                  data-step-index={idx}
                  onClick={() => handleStepClick(idx)}
                  className={`process-step-item py-6 md:py-8 border-b border-border-light transition-all duration-300 cursor-pointer flex flex-col justify-center min-h-[240px] md:min-h-[320px] rounded-lg px-3 md:px-4
                    ${isActive ? "bg-warm-white/60 md:bg-transparent opacity-100 border-gold-dark/40 shadow-sm md:shadow-none" : "opacity-60 md:opacity-40 hover:opacity-80"}`}
                >
                  {/* Step ID & Phase Label */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[36px] md:text-[44px] font-serif font-bold leading-none transition-colors select-none
                      ${isActive ? "text-gold-dark" : "text-dark/30"}`}>
                      {step.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border transition-all
                      ${isActive ? "bg-gold-dark/15 text-gold-dark border-gold-dark/30" : "bg-black/5 text-dark/40 border-transparent"}`}>
                      {phaseLabel} {step.id}
                    </span>
                  </div>

                  {/* Mobile Image Preview for responsive excellence */}
                  <div className="md:hidden relative w-full h-[180px] rounded-lg overflow-hidden my-3 border border-border-light">
                    <Image
                      src={step.image || stepImages[idx] || stepImages[0]}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className={`font-bold text-[19px] md:text-[22px] mb-3 tracking-tight leading-snug transition-colors
                    ${isActive ? "text-dark" : "text-dark/80"}`}>
                    {step.title}
                  </h3>

                  <p className="text-dark/65 text-[13.5px] md:text-[14.5px] leading-relaxed mb-5 font-light">
                    {step.description}
                  </p>

                  {/* Action Items Checklist */}
                  <ul className="flex flex-col gap-2.5 pt-4 border-t border-border-light/60">
                    {actions.map((act: string) => (
                      <li key={act} className="flex items-center gap-3 text-dark/75 text-[12.5px] md:text-[13px]">
                        <div className={`w-[18px] h-[18px] md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300
                          ${isActive ? "bg-gold-dark text-white" : "bg-gold-dark/15 text-gold-dark"}`}>
                          <Check size={11} strokeWidth={2.5} />
                        </div>
                        <span className="font-medium">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
