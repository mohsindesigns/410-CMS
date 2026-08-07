"use client";

import { CalendarRange, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

export default function CtaBanner() {
  const { ctaBanner, globalMetadata } = useContent();

  const {
    tagline = "Take the First Step",
    title = "Ready to Feel Your Best?",
    description = "Book your appointment today and start your journey to a pain-free, stronger you.",
    button = "BOOK APPOINTMENT"
  } = ctaBanner || {};

  const bookingUrl = globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy";

  return (
    <section className="bg-gold relative overflow-hidden py-12 md:py-14">

      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 opacity-[0.07] bg-diagonal-stripes-black"
      />

      {/* Left decorative circle */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[40px] border-black/[0.06] hidden md:block" />
      {/* Right decorative circle */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[40px] border-black/[0.06] hidden md:block" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="site-container relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
      >

        {/* Left: Icon + Text */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
          {/* Calendar icon */}
          <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-dark/10 flex items-center justify-center text-dark">
            <CalendarRange size={24} className="md:w-7 md:h-7" strokeWidth={1.8} />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-dark/60 text-[10px] md:text-[12px] font-bold tracking-[0.15em] uppercase mb-1">
              {tagline}
            </p>
            <h3 className="display-heading text-[20px] min-[400px]:text-[24px] md:text-[30px] text-dark leading-tight mb-1.5">
              {title}
            </h3>
            <p className="text-dark/65 text-[13px] md:text-[14px]">
              {description}
            </p>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark text-[11px] md:text-[12px] px-8 py-3.5 md:py-4 shadow-lg w-full md:w-auto justify-center text-center"
          >
            {button} <ArrowRight size={14} className="ml-1" />
          </a>
        </div>

      </motion.div>
    </section>
  );
}
