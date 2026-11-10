"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { resolveCertificates } from "../lib/certificates";
import { stripHtml } from "../lib/utils";

/** Home-page section showing the continuing-education certificates (managed in Admin > Pages > Home > Certificates). */
export default function Certificates() {
  const content = useContent() as any;
  const cfg = resolveCertificates(content?.certificates);
  const items = cfg.items;
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, items.length]);

  if (!cfg.enabled || items.length === 0) return null;
  const current = open !== null ? items[open] : null;

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-heading"
      className="bg-brand-bg-light py-20 md:py-28 relative border-t border-border-light/40"
    >
      <div className="site-container">
        {/* Centered editorial header (same style as the service pages) */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-3.5">
            <span className="w-6 h-[1px] bg-gold-dark" />
            <p className="section-label text-gold-dark">{stripHtml(cfg.label)}</p>
            <span className="w-6 h-[1px] bg-gold-dark" />
          </div>
          <h2
            id="certificates-heading"
            className="font-display font-medium text-[34px] min-[400px]:text-[44px] md:text-[52px] text-dark leading-[1.08] tracking-tight"
          >
            {stripHtml(cfg.title1)}{" "}
            <span className="text-gold-dark italic font-light block sm:inline">{stripHtml(cfg.title2)}</span>
          </h2>
          {cfg.description && stripHtml(cfg.description) && (
            <p className="mt-4 text-dark/60 text-[15px] leading-relaxed font-light">{stripHtml(cfg.description)}</p>
          )}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 list-none p-0 m-0">
          {items.map((c, i) => {
            const meta = [c.date, c.detail].filter((x) => x && x.trim()).join(" · ");
            return (
              <li key={c.id || i} className="flex">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`${cfg.viewLabel}: ${stripHtml(c.title)}`}
                  className="group w-full text-left bg-white border border-border-light hover:border-gold-dark hover:shadow-xl rounded-sm overflow-hidden flex flex-col transition-all duration-300 cursor-zoom-in"
                >
                  <div className="relative w-full aspect-[1200/927] bg-white border-b border-border-light/60 overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.alt || `${cfg.altPrefix}: ${stripHtml(c.title)}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-md bg-dark/80 text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={15} />
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="text-dark font-bold text-[15px] leading-snug group-hover:text-gold-dark transition-colors">
                      {stripHtml(c.title)}
                    </h3>
                    <p className="text-gold-dark text-[11px] font-bold tracking-wider uppercase">{stripHtml(c.issuer)}</p>
                    {meta && <p className="text-dark/60 text-[12.5px] leading-relaxed font-light mt-auto">{meta}</p>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Full-size view */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={stripHtml(current.title)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setOpen(null)}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={cfg.closeLabel}
              className="absolute top-4 right-4 w-10 h-10 rounded-md border border-white/30 text-white hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)); }}
                  aria-label={cfg.prevLabel}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md border border-white/30 text-white hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpen((i) => (i === null ? i : (i + 1) % items.length)); }}
                  aria-label={cfg.nextLabel}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md border border-white/30 text-white hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <figure className="max-w-5xl w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt={current.alt || `${cfg.altPrefix}: ${stripHtml(current.title)}`}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-sm bg-white shadow-2xl"
              />
              <figcaption className="text-white/80 text-[13px] text-center">
                {stripHtml(current.title)} &mdash; {stripHtml(current.issuer)}
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
