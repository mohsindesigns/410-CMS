'use client';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import { stripHtml } from '@/lib/utils';

export default function ServicesHeroSection() {
  const { services: servicesData, globalMetadata } = useContent();

  const label = servicesData?.badge || servicesData?.label || "Precision Care & Recovery";
  const title1 = servicesData?.headline?.prefix || servicesData?.titleLine1 || "Therapies";
  const title2 = servicesData?.headline?.highlight || servicesData?.titleLine2 || "Designed";
  const title3 = servicesData?.headline?.suffix || servicesData?.titleLine3 || "Around You";
  const description = servicesData?.description || "Experience therapeutic bodywork tailored to your performance and recovery goals.";
  
  const btn1 = "BOOK APPOINTMENT";
  const btn2 = "EXPLORE SERVICES";
  
  // Dynamic or fallback background image
  const image = servicesData?.image || (servicesData?.items?.[0]?.image) || "/images/hero-bg.webp";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  } as const;

  return (
    <section className="relative bg-dark min-h-[80vh] flex items-center overflow-hidden border-b border-border-dark">
      
      {/* ── Completely Blended Ambient Background Image (More Visible Photo) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src={image}
          alt={servicesData?.imageAlt || "Precision Care & Recovery"}
          fill
          className="object-cover object-right lg:object-center opacity-80 filter contrast-105"
          priority
        />
        
        {/* Multi-directional Luxury Gradient Masks to dissolve all sharp corners */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-transparent to-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-l from-dark/40 via-transparent to-transparent" />
      </motion.div>

      {/* Subtle gold atmospheric radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-gold/[0.06] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Main Content ───────────────────────────────── */}
      <div className="relative site-container pt-32 pb-16 md:pt-40 md:pb-24 w-full z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[640px] text-center md:text-left mx-auto md:mx-0 flex flex-col items-center md:items-start md:border-l md:border-white/10 md:pl-8"
        >
          {/* Label with delicate line accent */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4 md:mb-5">
            <span className="w-6 h-[1px] bg-gold flex-shrink-0 hidden md:block" />
            <p className="section-label">
              {label}
            </p>
          </motion.div>

          {/* Headline with Clean Non-Breaking Highlighted Text */}
          <motion.h1 variants={itemVariants} className="display-heading text-[32px] min-[400px]:text-[42px] md:text-[58px] lg:text-[64px] text-white leading-[1.1] mb-6 md:mb-8 tracking-tight max-w-[650px]">
            {title1} {title2} <span className="text-gold italic font-light block sm:inline">{title3}</span>
          </motion.h1>

          {/* Description */}
          <motion.div 
            variants={itemVariants} 
            className="text-white/75 md:text-white/65 text-[14px] md:text-[16px] leading-[1.7] md:leading-[1.8] max-w-[480px] mb-8 md:mb-10 font-light [&_p]:text-white/75 [&_p]:md:text-white/65 [&_span]:!text-white/75 [&_p]:!text-white/75 [&_span]:md:!text-white/65 [&_p]:md:!text-white/65"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 md:mb-12">
            <a
              href={servicesData?.ctaBookUrl || globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto justify-center text-center px-8"
            >
              {servicesData?.ctaBook || "BOOK APPOINTMENT"} <ArrowRight size={14} className="ml-1" />
            </a>
            <a href={servicesData?.ctaExploreUrl || "#services-list"} className="btn-outline-white w-full sm:w-auto justify-center text-center px-8">
              {servicesData?.ctaExplore || "EXPLORE SERVICES"} <ArrowRight size={14} className="ml-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
