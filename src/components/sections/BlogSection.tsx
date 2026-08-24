"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string | { name: string };
  categories?: string[];
  tags?: string[];
  category?: string;
}

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaAll?: string;
  ctaReadMore?: string;
  posts?: BlogPost[];
  viewAllLink?: string;
}

export default function BlogSection({
  title = "Insights & Recovery Tips",
  subtitle = "FROM THE BLOG",
  ctaAll = "View All Articles",
  ctaReadMore = "Read Article",
  posts = [],
  viewAllLink = "/blog",
}: BlogSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!posts || posts.length === 0) return null;

  const maxIndex = Math.max(0, posts.length - cardsPerView);
  const hasSlider = posts.length > cardsPerView;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section id="blog" className="bg-white py-16 md:py-24 overflow-hidden border-t border-border-light/40">
      <div className="site-container">

        {/* ── Header ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label text-gold-dark mb-3 md:mb-4">{subtitle}</p>
            <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[44px] text-dark leading-tight">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={viewAllLink}
              className="flex items-center gap-2 text-gold-dark text-[12px] font-bold tracking-[0.12em] uppercase hover:gap-3 transition-all duration-200"
            >
              {ctaAll} <ArrowRight size={14} />
            </Link>

            {/* Slider Navigation Buttons (Visible when posts > cardsPerView) */}
            {hasSlider && (
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={handlePrev}
                  aria-label="Previous article"
                  className="w-9 h-9 rounded-md border border-border-light text-dark/70 hover:border-gold-dark hover:text-gold-dark hover:bg-gold-light/10 flex items-center justify-center transition-all duration-200 active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next article"
                  className="w-9 h-9 rounded-md border border-border-light text-dark/70 hover:border-gold-dark hover:text-gold-dark hover:bg-gold-light/10 flex items-center justify-center transition-all duration-200 active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Sliding Track Carousel ──────────────── */}
        <div className="relative overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * (100 / cardsPerView)}%`
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {posts.map((post) => {
              // Derive tag from category or tags
              const rawCat = Array.isArray(post.categories) && post.categories[0];
              const rawTag = Array.isArray(post.tags) && post.tags[0];

              const tag =
                post.category ||
                (rawCat ? (typeof rawCat === "string" ? rawCat : (rawCat as any).name || "") : "") ||
                (rawTag ? (typeof rawTag === "string" ? rawTag : (rawTag as any).name || "") : "") ||
                "";

              // Clean HTML from excerpt
              const rawExcerpt = post.excerpt || "";
              const cleanExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, "").trim();
              const postUrl = `/blog/${post.slug}`;

              return (
                <div
                  key={post._id}
                  style={{ width: `${100 / cardsPerView}%` }}
                  className="flex-shrink-0 px-3 md:px-4"
                >
                  <article className="blog-card group bg-[#fbfbfa] border border-border-light hover:border-gold-dark/40 hover:shadow-xl rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300">
                    <Link href={postUrl} className="flex flex-col flex-1 no-underline">

                      {/* Image */}
                      <div className="img-blog relative h-[210px] w-full overflow-hidden bg-dark/10">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-warm-cream flex items-center justify-center">
                            <ArrowRight size={32} className="text-gold-dark/30" />
                          </div>
                        )}
                        {/* Tag chip */}
                        {tag && (
                          <span className="absolute top-3 left-3 bg-gold-dark text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-xs shadow-sm">
                            {tag}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
                        <div>
                          <h3 className="text-dark font-bold text-[16px] sm:text-[17px] leading-snug mb-2.5 group-hover:text-gold-dark transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h3>
                          {cleanExcerpt && (
                            <p className="text-dark/60 text-[13px] leading-relaxed mb-4 line-clamp-2 font-light">
                              {cleanExcerpt}
                            </p>
                          )}
                        </div>
                        <span className="flex items-center gap-2 text-gold-dark text-[11.5px] font-bold tracking-wider uppercase group-hover:gap-3 transition-all duration-200 pt-2 border-t border-border-light/60">
                          {ctaReadMore} <ArrowRight size={13} />
                        </span>
                      </div>

                    </Link>
                  </article>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile / Tablet Pagination Dots */}
        {hasSlider && (
          <div className="flex justify-center items-center gap-2 mt-8 md:hidden">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  currentIndex === idx ? "bg-gold-dark w-6" : "bg-dark/20 w-2 hover:bg-gold-dark/50"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
