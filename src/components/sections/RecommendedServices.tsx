"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export type RecommendedItem = {
  slug: string;
  label: string;
  tag?: string;
  text?: string;
  image: string;
};

/**
 * Slider of recommended services (same mechanics and look as the blog slider on the home page):
 * 1 card per view on phones, 2 on tablets, 3 on desktop; with more services than fit, arrows and dots appear.
 */
export default function RecommendedServices({
  items,
  ctaText,
  prevLabel,
  nextLabel,
}: {
  items: RecommendedItem[];
  ctaText: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(0, items.length - perView);
  const hasSlider = items.length > perView;
  // keep the position valid when the number of cards per view changes
  useEffect(() => { setIndex((i) => Math.min(i, maxIndex)); }, [maxIndex]);

  if (!items || items.length === 0) return null;
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : maxIndex));
  const next = () => setIndex((i) => (i < maxIndex ? i + 1 : 0));

  return (
    <div>
      <div className="relative overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <motion.ul
          className="flex list-none p-0 m-0"
          animate={{ x: `-${index * (100 / perView)}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          {items.map((rel) => (
            <li key={rel.slug} style={{ width: `${100 / perView}%` }} className="flex-shrink-0 px-3 md:px-4 flex">
              <article className="blog-card group bg-[#fbfbfa] border border-border-light hover:border-gold-dark/40 hover:shadow-xl rounded-sm overflow-hidden flex flex-col h-full w-full transition-all duration-300">
                <Link href={`/${rel.slug}/`} className="flex flex-col flex-1 no-underline">
                  <div className="img-blog relative h-[210px] w-full overflow-hidden bg-dark/10">
                    <Image
                      src={rel.image}
                      alt={rel.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {rel.tag && (
                      <span className="absolute top-3 left-3 bg-gold-dark text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-xs shadow-sm">
                        {rel.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
                    <div>
                      <h3 className="text-dark font-bold text-[16px] sm:text-[17px] leading-snug mb-2.5 group-hover:text-gold-dark transition-colors duration-200 line-clamp-2">
                        {rel.label}
                      </h3>
                      {rel.text && (
                        <p className="text-dark/60 text-[13px] leading-relaxed mb-4 line-clamp-3 font-light">{rel.text}</p>
                      )}
                    </div>
                    <span className="flex items-center gap-2 text-gold-dark text-[11.5px] font-bold tracking-wider uppercase group-hover:gap-3 transition-all duration-200 pt-2 border-t border-border-light/60">
                      {ctaText} <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </motion.ul>
      </div>

      {hasSlider && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={prev}
            aria-label={prevLabel}
            className="w-9 h-9 rounded-md border border-border-light text-dark/70 hover:border-gold-dark hover:text-gold-dark hover:bg-gold-light/10 flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1} / ${maxIndex + 1}`}
                aria-current={index === i ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-200 ${index === i ? "bg-gold-dark w-6" : "bg-[rgba(10,10,10,0.22)] w-2 hover:bg-[rgba(10,10,10,0.5)]"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label={nextLabel}
            className="w-9 h-9 rounded-md border border-border-light text-dark/70 hover:border-gold-dark hover:text-gold-dark hover:bg-gold-light/10 flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
