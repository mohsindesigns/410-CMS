"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function BlogSection({
  title = "Insights & Recovery Tips",
  subtitle = "FROM THE BLOG",
  ctaAll = "View All Articles",
  ctaReadMore = "Read Article",
  posts = [],
  viewAllLink = "/blog",
}: BlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="site-container">

        {/* ── Header ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label text-gold-dark mb-3 md:mb-4">{subtitle}</p>
            <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[44px] text-dark">{title}</h2>
          </div>
          <Link
            href={viewAllLink}
            className="flex items-center gap-2 text-gold-dark text-[12px] font-bold tracking-[0.12em] uppercase hover:gap-3 transition-all duration-200"
          >
            {ctaAll} <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Article Grid ──────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {posts.map((post) => {
            // Derive tag from populated category objects or plain strings
            const rawCat = Array.isArray(post.categories) && post.categories[0];
            const rawTag = Array.isArray(post.tags) && post.tags[0];

            const tag =
              post.category ||
              (rawCat ? (typeof rawCat === "string" ? rawCat : (rawCat as any).name || "") : "") ||
              (rawTag ? (typeof rawTag === "string" ? rawTag : (rawTag as any).name || "") : "") ||
              "";

            // Strip HTML from excerpt
            const rawExcerpt = post.excerpt || "";
            const cleanExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, "").trim();

            const postUrl = `/blog/${post.slug}`;

            return (
              <motion.article
                key={post._id}
                variants={itemVariants}
                className="blog-card group"
              >
                {/* Entire card is a link */}
                <Link href={postUrl} className="flex flex-col flex-1 no-underline">

                  {/* Image */}
                  <div className="img-blog">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-warm-cream flex items-center justify-center">
                        <ArrowRight size={32} className="text-gold-dark/30" />
                      </div>
                    )}
                    {/* Tag chip */}
                    {tag && (
                      <span className="absolute top-4 left-4 bg-gold-dark text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5">
                        {tag}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-dark font-bold text-[17px] md:text-[18px] leading-snug mb-3 group-hover:text-gold-dark transition-colors duration-200">
                      {post.title}
                    </h3>
                    {cleanExcerpt && (
                      <p className="text-dark/55 text-[13.5px] leading-relaxed mb-5 line-clamp-3 flex-1">
                        {cleanExcerpt}
                      </p>
                    )}
                    <span className="flex items-center gap-2 text-gold-dark text-[12px] font-bold tracking-wide uppercase group-hover:gap-3 transition-all duration-200 mt-auto">
                      {ctaReadMore} <ArrowRight size={14} />
                    </span>
                  </div>

                </Link>
              </motion.article>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
