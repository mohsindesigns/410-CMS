"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function Leadership() {
  const { leadership, globalMetadata } = useContent();

  const {
    label = "Antoine's Story",
    title = "Antoine Lyles — Performance Recovery Specialist",
    tagline = "My Mission is Your Mobility.",
    desc1 = "",
    desc2 = "",
    photoBadge = "Performance Recovery",
    ctaMore = "BOOK RECOVERY SESSION",
    ctaLink = "",
    signatureName = "Antoine Lyles",
    signatureTitle = "FOUNDER & HEAD THERAPIST",
    image = "/images/theraphist.jpeg",
    imageAlt = "Antoine Lyles — Performance Recovery Specialist"
  } = leadership || {};

  const bookingUrl = ctaLink || globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <section className="bg-white py-28 relative overflow-hidden border-t border-border-light/40">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-grid-pattern-black pointer-events-none" />

      <div className="site-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-16 lg:gap-24 items-center">

          {/* ── Left Column: Premium Framed Image ───────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Gold backdrop accent square */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold-dark/40 rounded-sm pointer-events-none z-0" />

            {/* Main photo container */}
            <div className="img-therapist h-[400px] md:h-[600px] rounded-sm overflow-hidden shadow-2xl relative z-10 border border-border-light group">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-top transition-transform duration-750 group-hover:scale-105"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-dark/5 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Small floating tag */}
            <div className="absolute bottom-6 left-6 z-20 bg-dark text-gold font-mono text-[10px] font-bold tracking-widest uppercase px-4 py-2 border border-border-dark shadow-2xl">
              {photoBadge}
            </div>
          </motion.div>

          {/* ── Right Column: Editorial Text ───────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col"
          >
            <motion.p variants={itemVariants} className="section-label text-gold-dark mb-4">
              {label}
            </motion.p>
            
            <motion.h2 variants={itemVariants} className="display-heading text-[32px] min-[400px]:text-[38px] md:text-[48px] text-dark leading-tight mb-4">
              {title}
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gold-dark font-serif italic text-[18px] md:text-[20px] mb-6">
              {tagline}
            </motion.p>

            <motion.p variants={itemVariants} className="text-dark/60 text-[14.5px] md:text-[15px] leading-relaxed mb-5 font-light">
              {stripHtml(desc1)}
            </motion.p>

            <motion.p variants={itemVariants} className="text-dark/65 text-[14.5px] md:text-[15px] leading-relaxed mb-8 border-l-2 border-gold-dark/30 pl-4 py-1 font-light">
              {stripHtml(desc2)}
            </motion.p>

            {/* Signature + CTA Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border-light mt-auto"
            >
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full sm:w-auto justify-center text-center cursor-pointer"
              >
                {ctaMore} <ArrowRight size={14} className="ml-1" />
              </a>
              <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
                <p className="font-signature text-[38px] min-[360px]:text-[48px] md:text-[56px] text-gold-dark leading-none mb-1 select-none">
                  {signatureName}
                </p>
                <p className="text-dark/50 text-[11.5px] uppercase tracking-wider font-semibold">
                  {signatureTitle}
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
