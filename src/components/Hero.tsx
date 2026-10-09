"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function HeroSection() {
  const { hero, globalMetadata } = useContent();

  const {
    label = "Performance Recovery Specialist • Est. 2020",
    title1 = "Recover Faster.",
    title2 = "Perform Higher.",
    description = "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults since 2020. #bodywork #performancerecovery",
    ctaBook = "BOOK RECOVERY SESSION",
    ctaServices = "EXPLORE SERVICES",
    socialProofText = "Trusted by 500+ athletes & active adults",
    image = "/images/hero-bg.webp",
    imageAlt = "Expert muscle therapy session"
  } = hero || {};

  const cleanLabel = stripHtml(label);
  const cleanTitle1 = stripHtml(title1);
  const cleanTitle2 = stripHtml(title2);
  const cleanDescription = stripHtml(description);

  const bookingUrl = globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy";

  const isCdnImage = image.startsWith('/cdn-images/');
  const cdnSubpath = isCdnImage ? image.replace('/cdn-images/', '') : '';

  return (
    <section className="relative bg-dark min-h-screen flex items-center overflow-hidden border-b border-border-dark">

      {/* Subtle gold glow behind text for luxury depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gold/[0.05] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Blended Hero Image Background (More Visible Photo) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
        {image.startsWith('http') || image.startsWith('/uploads') || isCdnImage ? (
          <picture className="w-full h-full block">
            {isCdnImage && (
              <>
                <source
                  media="(max-width: 767px)"
                  srcSet={`/cdn-images/w_640,f_auto,q_75/${cdnSubpath}`}
                />
                <source
                  media="(min-width: 768px)"
                  srcSet={`/cdn-images/w_1280,f_auto,q_75/${cdnSubpath}`}
                />
              </>
            )}
            <img
              src={isCdnImage ? `/cdn-images/w_1280,f_auto,q_75/${cdnSubpath}` : image}
              alt={imageAlt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-right lg:object-center filter contrast-105"
            />
          </picture>
        ) : (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-right lg:object-center filter contrast-105"
            priority
            fetchPriority="high"
          />
        )}

        {/* Multi-directional Luxury Gradient Masks */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-transparent to-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-l from-dark/40 via-transparent to-transparent" />
      </div>

      {/* ── Main Content ───────────────────────────────── */}
      <div className="relative site-container pt-32 pb-16 md:pt-40 md:pb-24 w-full z-10">
        <div
          className="max-w-[620px] text-center md:text-left mx-auto md:mx-0 flex flex-col items-center md:items-start md:border-l md:border-white/10 md:pl-8"
        >
          {/* Label with delicate line accent */}
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <span className="w-6 h-[1px] bg-gold flex-shrink-0 hidden md:block" />
            <p className="section-label">
              {cleanLabel}
            </p>
          </div>

          {/* Headline */}
          <h1 className="display-heading text-[33px] min-[400px]:text-[41px] md:text-[60px] leading-[1.1] mb-6 md:mb-8 tracking-tight">
            <span className="block text-white mb-0">{cleanTitle1}</span>
            <span className="block text-gold italic">{cleanTitle2}</span>
          </h1>

          {/* Description */}
          <p className="text-white/70 md:text-white/55 text-[14px] md:text-[15px] leading-[1.7] md:leading-[1.8] max-w-[460px] mb-8 md:mb-10">
            {cleanDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 md:mb-12">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto justify-center text-center px-8"
            >
              {ctaBook} <ArrowRight size={14} className="ml-1" />
            </a>
            <Link href="/#services" className="btn-outline-white w-full sm:w-auto justify-center text-center px-8">
              {ctaServices} <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}
