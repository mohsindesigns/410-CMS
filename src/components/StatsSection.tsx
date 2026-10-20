"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { stripHtml } from "../lib/utils";

export default function StatsSection() {
  const { stats } = useContent();

  const {
    label = "Our Achievements",
    titleLine1 = "Proven Results.",
    titleLine2 = "Professional",
    titleItalicWord = "Standards.",
    description = "At 410 Muscle Therapy, we believe that true recovery is built on specialized bodywork and precision movement science.",
    description2 = "",
    image = "/uploads/blog/2_massage-service.jpg",
    imageAlt = "Clinical sports massage session"
  } = stats || {};

  // Paragraphs shown in order; empty ones are skipped so one or two both lay out cleanly.
  const paragraphs = [description, description2].map((p) => stripHtml(p)).filter(Boolean);

  const paragraphVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden border-y border-border-light">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-16 items-stretch">

          {/* ── Left Column: Editorial Photo Frame (grows with the text) ──────── */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[480px] lg:h-auto lg:min-h-[480px] w-full rounded-sm overflow-hidden shadow-xl border border-border-light">
            {image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/cdn-images') ? (
              <img
                src={image}
                alt={imageAlt}
                className="absolute inset-0 object-cover w-full h-full"
              />
            ) : (
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
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
          <div className="flex flex-col justify-center">
            <p className="section-label text-gold-dark mb-4">{stripHtml(label)}</p>
            <h2 className="display-heading text-[30px] min-[400px]:text-[36px] md:text-[44px] text-dark leading-tight mb-7">
              {stripHtml(titleLine1)}<br />
              {stripHtml(titleLine2)} <span className="text-gold-dark italic">{stripHtml(titleItalicWord)}</span>
            </h2>

            {/* One continuous gold rule carries every paragraph; the first reads as the lead. */}
            {paragraphs.length > 0 && (
              <div className="max-w-[580px] space-y-5 border-l-2 border-[rgba(135,100,4,0.45)] pl-5 py-1">
                {paragraphs.map((text, i) => (
                  <motion.p
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    variants={{
                      hidden: paragraphVariants.hidden,
                      visible: {
                        ...paragraphVariants.visible,
                        transition: { ...paragraphVariants.visible.transition, delay: i * 0.12 },
                      },
                    }}
                    className={
                      i === 0 && paragraphs.length > 1
                        ? "text-[16px] md:text-[17px] leading-[1.8] font-normal text-[rgba(10,10,10,0.82)]"
                        : "text-[15px] md:text-[16px] leading-[1.8] font-light text-[rgba(10,10,10,0.68)]"
                    }
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
