"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

export default function StatsSection() {
  const { stats } = useContent();

  const {
    label = "Our Achievements",
    titleLine1 = "Proven Results.",
    titleLine2 = "Professional",
    titleItalicWord = "Standards.",
    description = "At 410 Muscle Therapy, we believe that true recovery is built on specialized bodywork and precision movement science.",
    image = "/images/blog-3.webp",
    imageAlt = "Clinical sports massage session"
  } = stats || {};

  const paragraphVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden border-y border-border-light/40">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-16 items-center">

          {/* ── Left Column: Editorial Photo Frame ──────── */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[480px] w-full rounded-sm overflow-hidden shadow-xl border border-border-light">
            {image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images') ? (
              <img
                src={image}
                alt={imageAlt}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            )}
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-dark/5" />
            {/* Gold corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 m-3">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-dark" />
              <div className="absolute top-0 left-0 h-full w-[2px] bg-gold-dark" />
            </div>
          </div>

          {/* ── Right Column: Editorial Text ── */}
          <div>
            <p className="section-label text-gold-dark mb-4">{label}</p>
            <h2 className="display-heading text-[30px] min-[400px]:text-[36px] md:text-[44px] text-dark leading-tight mb-6">
              {titleLine1}<br />
              {titleLine2} <span className="text-gold-dark italic">{titleItalicWord}</span>
            </h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={paragraphVariants}
              className="text-dark/70 text-[15px] md:text-[16px] leading-[1.8] font-light max-w-[540px] border-l-2 border-gold-dark/30 pl-4 py-1"
            >
              {description}
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  );
}