import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  Calendar,
  User,
  Tag as TagIcon,
  Clock,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  ChevronLeft,
  Star,
  MapPin
} from "lucide-react";

import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import Page from "@/models/Page";
import SiteContent from "@/models/Content";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButton from "@/components/blog/ShareButton";
import PageInlineFaqs from "@/components/PageInlineFaqs";
import { BASE_URL } from "@/lib/constants";
import { makeLinksDoFollow, cleanMojibake } from "@/lib/utils";
import { getRobotsMetadata } from "@/lib/seo";

export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();

  const [post, contentDoc] = await Promise.all([
    Post.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
      status: "published",
      isTrashed: { $ne: true }
    }).populate("categories"),
    SiteContent.findOne({ key: "complete_data" }).lean() as any
  ]);

  if (!post) return { title: "Article Not Found | 410 Muscle Therapy" };

  const settings = contentDoc?.data?.settings;
  const pageTitle = post.seo?.metaTitle || `${post.title} | 410 Muscle Therapy`;
  const pageDesc =
    post.seo?.metaDescription ||
    post.excerpt ||
    `${post.title} - Specialized recovery insights, deep tissue protocols, and clinical tips from 410 Muscle Therapy.`;
  const pageImage = post.seo?.ogImage || post.featuredImage || `${BASE_URL}/logo.png`;
  const canonicalUrl = post.seo?.canonicalUrl || `${BASE_URL}/blogs/${post.slug}/`;

  return {
    title: {
      absolute: pageTitle
    },
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl
    },
    robots: getRobotsMetadata(settings, post.seo),
    openGraph: {
      title: post.seo?.ogTitle || pageTitle,
      description: post.seo?.ogDescription || pageDesc,
      url: `${BASE_URL}/blogs/${post.slug}/`,
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt
        ? new Date(post.publishedAt || post.createdAt)
        : new Date("2025-02-07T15:28:30Z")
      ).toISOString(),
      modifiedTime: (post.updatedAt || post.publishedAt || post.createdAt
        ? new Date(post.updatedAt || post.publishedAt || post.createdAt)
        : new Date("2026-07-24T16:08:21Z")
      ).toISOString(),
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.ogTitle || pageTitle,
      description: post.seo?.ogDescription || pageDesc,
      images: [pageImage],
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy"
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();

  // 1. Fetch Post from MongoDB
  const post = await Post.findOne({
    $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    status: "published",
    isTrashed: { $ne: true }
  })
    .populate("categories tags author")
    .lean();

  if (!post) notFound();

  // 2. Fetch Blog Page Settings for CMS-managed CTAs and Global Defaults
  const [blogPageDoc, contentDoc] = await Promise.all([
    Page.findOne({
      $or: [{ slug: { $in: ["blogs", "/blogs", "blog", "/blog"] } }, { template: { $in: ["blogs", "blog"] } }]
    }).lean() as any,
    SiteContent.findOne({ key: "complete_data" }).lean() as any
  ]);

  const globalContent = contentDoc?.data || {};
  const blogPageData =
    blogPageDoc?.content?.blogPage ||
    blogPageDoc?.content ||
    globalContent.blogsPage ||
    globalContent.blogPage ||
    {};
  const globalCtaBanner = globalContent.ctaBanner || {};
  const globalLeadership = globalContent.leadership || {};
  const globalMetadata = globalContent.globalMetadata || {};
  const defaultBookingUrl =
    globalMetadata?.bookingUrl ||
    globalCtaBanner?.buttonUrl ||
    globalCtaBanner?.btnUrl ||
    "https://www.styleseat.com/m/v/410muscletherapy";

  // Resolve Sidebar Consultation CTA
  const sidebarCta = {
    badge: blogPageData.detailSidebarCta?.badge || "CLINICAL RECOVERY",
    title: blogPageData.detailSidebarCta?.title || "Restore Mobility & Relieve Chronic Tension",
    description:
      blogPageData.detailSidebarCta?.description ||
      "Experience personalized sports massage, targeted neuromuscular therapy, and clinical recovery protocols.",
    buttonText: blogPageData.detailSidebarCta?.buttonText || "BOOK APPOINTMENT",
    buttonHref: blogPageData.detailSidebarCta?.buttonHref || defaultBookingUrl
  };

  // Resolve Signature Detail CTA Banner (Syncs with CMS CTA Banner)
  const ctaSource = blogPageData.ctaBanner || blogPageData.detailCtaBanner || globalCtaBanner || {};
  const detailCtaBanner = {
    eyebrow: ctaSource.eyebrow || ctaSource.tagline || "READY TO FEEL YOUR BEST?",
    titleIntro: ctaSource.titleIntro || "Restore Your Peak",
    titleHighlight: ctaSource.titleHighlight || "Performance",
    titleLine2: ctaSource.titleLine2 || "Together.",
    description:
      ctaSource.description ||
      "Schedule your clinical bodywork or performance recovery session today. We pinpoint muscular dysfunction and restore functional movement.",
    ctaPrimary: {
      label: ctaSource.ctaPrimary?.label || ctaSource.button || "Book Recovery Session",
      href: ctaSource.ctaPrimary?.href || ctaSource.buttonUrl || defaultBookingUrl
    },
    ctaSecondary: {
      label: ctaSource.ctaSecondary?.label || "Explore All Services",
      href: ctaSource.ctaSecondary?.href || "/services/"
    },
    portraitSrc: ctaSource.portraitSrc || globalLeadership.image || "/images/theraphist.jpeg",
    portraitAlt: ctaSource.portraitAlt || "Antoine Lyles - Performance Recovery Specialist"
  };

  // Resolve Related Section Header
  const relatedSection = {
    eyebrow: blogPageData.relatedSection?.eyebrow || "CONTINUE READING",
    title: blogPageData.relatedSection?.title || "Related Articles & Clinical Guides"
  };

  // 3. Fetch 3 Related Articles (excluding current post)
  const postCategoryIds = Array.isArray(post.categories) ? post.categories.map((c: any) => c._id || c) : [];

  let relatedPostsRaw = await Post.find({
    _id: { $ne: post._id },
    status: "published",
    isTrashed: { $ne: true },
    ...(postCategoryIds.length > 0 ? { categories: { $in: postCategoryIds } } : {})
  })
    .populate("categories")
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean();

  if (relatedPostsRaw.length < 3) {
    const existingIds = [post._id, ...relatedPostsRaw.map((r: any) => r._id)];
    const fallbackPosts = await Post.find({
      _id: { $nin: existingIds },
      status: "published",
      isTrashed: { $ne: true }
    })
      .populate("categories")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3 - relatedPostsRaw.length)
      .lean();
    relatedPostsRaw = [...relatedPostsRaw, ...fallbackPosts];
  }

  const relatedPosts = relatedPostsRaw.map((r: any) => {
    let catBadge = "Clinical Insight";
    if (Array.isArray(r.categories) && r.categories.length > 0) {
      catBadge = r.categories[0]?.name || "Clinical Insight";
    }

    let rDate = "Recent";
    if (r.publishedAt || r.createdAt) {
      try {
        rDate = new Date(r.publishedAt || r.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      } catch {
        rDate = "Recent";
      }
    }

    let rReadTime = "5 min read";
    if (r.content) {
      const words = String(r.content).replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      rReadTime = `${Math.max(3, Math.ceil(words / 200))} min read`;
    }

    return {
      id: String(r._id),
      slug: r.slug || String(r._id),
      title: r.title,
      badge: catBadge,
      image: r.featuredImage || "/images/blog-3.webp",
      date: rDate,
      readTime: rReadTime
    };
  });

  // 4. Resolve Post Metadata & Author Information
  let categoryBadge = "Clinical Insight";
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    categoryBadge = post.categories[0]?.name || "Clinical Insight";
  }

  let formattedDate = "Recent";
  if (post.publishedAt || post.createdAt) {
    try {
      formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      formattedDate = "Recent";
    }
  }

  // Strip legacy embedded FAQ blocks from body HTML if present
  let rawHtmlContent = post.content || `<p>${post.excerpt || post.title}</p>`;
  rawHtmlContent = rawHtmlContent
    .replace(/<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked|Common Questions)[^<]*<\/h[1-6]>[\s\S]*?(?=<h[1-6]|$)/gi, "")
    .trim();

  const wordCount = rawHtmlContent.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTimeDisplay = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;
  const featuredImage = post.featuredImage || "/images/blog-3.webp";

  const rawAuthor = post.author as any;
  let cleanName = "Antoine Lyles";
  if (rawAuthor) {
    if (typeof rawAuthor === "string" && rawAuthor.trim()) {
      cleanName = rawAuthor.trim();
    } else if (rawAuthor.name && typeof rawAuthor.name === "string" && rawAuthor.name.trim()) {
      cleanName = rawAuthor.name.trim();
    } else if (rawAuthor.username && typeof rawAuthor.username === "string" && rawAuthor.username.toLowerCase() !== "admin") {
      cleanName = rawAuthor.username;
    }
  }

  let cleanRole = "Founder & Licensed Massage Therapist";
  if (rawAuthor?.role) {
    if (typeof rawAuthor.role === "object" && rawAuthor.role?.name) {
      cleanRole = String(rawAuthor.role.name);
    } else if (typeof rawAuthor.role === "string" && !rawAuthor.role.match(/^[0-9a-fA-F]{24}$/)) {
      cleanRole = rawAuthor.role;
    }
  }

  let cleanAvatar = "/images/theraphist.jpeg";
  if (rawAuthor) {
    const candidate = rawAuthor.image || rawAuthor.avatar;
    if (candidate && typeof candidate === "string" && (candidate.startsWith("http") || candidate.startsWith("/"))) {
      cleanAvatar = candidate;
    }
  }

  const authorInfo = {
    name: String(cleanName),
    role: String(cleanRole),
    avatar: String(cleanAvatar)
  };

  const url = `${BASE_URL}/blogs/${post.slug}/`;
  const publishDate = (post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt)
    : new Date("2025-02-07T15:28:30Z")
  ).toISOString();
  const modifiedDate = (post.updatedAt || post.publishedAt || post.createdAt
    ? new Date(post.updatedAt || post.publishedAt || post.createdAt)
    : new Date("2026-07-24T16:08:21Z")
  ).toISOString();

  // 5. Schema.org Article Graph JSON-LD
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        "url": url,
        "name": `${post.title} | 410 Muscle Therapy`,
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "primaryImageOfPage": { "@id": `${url}#primaryimage` },
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "description": post.seo?.metaDescription || post.excerpt,
        "breadcrumb": { "@id": `${url}#breadcrumb` },
        "inLanguage": "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${BASE_URL}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blogs",
            "item": `${BASE_URL}/blogs/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": url
          }
        ]
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        "isPartOf": { "@id": url },
        "author": {
          "@type": "Person",
          "@id": `${BASE_URL}/#/schema/person/${post.author?._id || "antoine-lyles"}`,
          "name": authorInfo.name,
          "jobTitle": authorInfo.role
        },
        "headline": post.title,
        "description": post.excerpt || post.title,
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "mainEntityOfPage": { "@id": url },
        "wordCount": wordCount,
        "publisher": {
          "@type": "Organization",
          "name": "410 Muscle Therapy",
          "url": BASE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`
          }
        },
        "image": {
          "@type": "ImageObject",
          "@id": `${url}#primaryimage`,
          "url": featuredImage
        },
        "thumbnailUrl": featuredImage,
        "keywords": post.tags?.map((t: any) => t.name).join(", "),
        "inLanguage": "en-US"
      }
    ]
  };

  // 6. Automated Table of Contents Logic
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let processedContent = rawHtmlContent;

  const headingRegex = /<(h[123])\b[^>]*>(.*?)<\/h[123]>/gi;
  let match;
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  while ((match = headingRegex.exec(rawHtmlContent)) !== null) {
    const tag = match[1].toLowerCase();
    const cleanText = match[2].replace(/<[^>]*>/g, "").trim();
    if (!cleanText || cleanText.length < 2) continue;
    if (/FAQ|Frequently Asked|Common Questions/i.test(cleanText)) continue;

    const id = slugify(cleanText) || `section-${tableOfContents.length + 1}`;
    const level = parseInt(tag[1]);

    tableOfContents.push({ id, text: cleanText, level });

    const originalTag = match[0];
    const newTag = `<${tag} id="${id}" class="scroll-mt-32 font-display ${
      level <= 2
        ? "text-2xl sm:text-3xl mt-12 mb-4 font-bold text-white border-b border-white/10 pb-3"
        : "text-xl sm:text-2xl mt-8 mb-3 font-semibold text-white"
    } leading-snug">${match[2]}</${tag}>`;
    processedContent = processedContent.replace(originalTag, newTag);
  }

  processedContent = cleanMojibake(makeLinksDoFollow(processedContent));

  return (
    <article className="min-h-screen bg-dark text-white selection:bg-gold selection:text-dark transition-colors duration-300 pb-24 relative overflow-x-clip font-sans">
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <ReadingProgress />

      {/* ── 1. HERO SECTION WITH RICH TEXTURE & BREADCRUMBS ─────────────── */}
      <section className="pt-[140px] sm:pt-[160px] lg:pt-[180px] pb-12 sm:pb-16 relative overflow-hidden border-b border-white/10">
        {/* Ambient Dark & Gold Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.035] bg-radial-dots-gold" />
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-transparent to-dark pointer-events-none" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 w-full">
          {/* Breadcrumb Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/50 mb-5">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/blogs/" className="hover:text-gold transition-colors">
              Blogs
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-gold font-bold">{categoryBadge}</span>
          </div>

          {/* Title */}
          <h1 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.18] tracking-tight mb-6 max-w-4xl drop-shadow-sm">
            {post.title}
          </h1>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gold text-dark shadow-md shadow-gold/20">
              <Star className="w-3 h-3 fill-current" />
              {categoryBadge}
            </span>

            <span className="inline-flex items-center gap-1.5 text-white/50 font-mono font-medium">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              {formattedDate}
            </span>

            <span className="inline-flex items-center gap-1.5 font-mono font-bold text-gold">
              <Clock className="w-3.5 h-3.5" />
              {readTimeDisplay}
            </span>

            {post.location && (
              <span className="inline-flex items-center gap-1.5 text-white/50 font-mono font-medium">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                {post.location}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED COVER IMAGE CONTAINER ────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8 sm:mt-10 relative z-20">
        <div className="bg-dark-2 rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-white/10 aspect-[16/9] sm:aspect-[21/9] relative group">
          <img
            src={featuredImage}
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── 3. MAIN CONTENT LAYOUT WITH STICKY SIDEBAR ────────────────── */}
      <div className="container mx-auto px-4 mt-14 sm:mt-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left: Blog Content */}
          <div className="lg:w-[65%] min-w-0 w-full">

            {/* Author Attribution Card */}
            {authorInfo && (
              <div className="flex flex-col min-[400px]:flex-row items-center gap-5 mb-12 p-6 min-[400px]:p-8 bg-dark-2 border border-white/10 rounded-2xl min-[400px]:rounded-3xl relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-gold/70">
                    <img
                      src={authorInfo.avatar}
                      alt={authorInfo.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gold mb-1 block">
                    Clinical Recovery Specialist
                  </span>
                  <h4 className="text-xl font-bold text-white leading-tight font-display">
                    {authorInfo.name}
                  </h4>
                  <p className="text-white/60 text-xs sm:text-sm mt-0.5 font-medium">
                    {authorInfo.role}
                  </p>
                </div>
              </div>
            )}

            {/* Main Content Body */}
            <div
              className="prose prose-invert max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:text-white
              prose-p:text-white/75 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-p:font-light
              prose-a:text-gold prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-gold-light transition-colors
              prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:my-8 prose-img:shadow-2xl prose-img:border prose-img:border-white/10
              prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-white/[0.02] prose-blockquote:p-6 md:prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:text-white/85 prose-blockquote:italic
              prose-ul:text-white/75 prose-ul:my-4 prose-li:my-1.5 prose-li:text-[15px]
              prose-table:w-full prose-table:border-collapse prose-table:my-6
              prose-th:bg-white/5 prose-th:text-white prose-th:p-3 prose-th:border prose-th:border-white/10 prose-th:text-left prose-th:text-[13px]
              prose-td:p-3 prose-td:border prose-td:border-white/10 prose-td:text-white/70 prose-td:text-[13px]
              prose-strong:text-white prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>

          {/* Right: Sticky Table of Contents (Sidebar) */}
          <aside className="lg:w-[35%] shrink-0 lg:sticky lg:top-28 w-full">
            <div className="space-y-6 md:space-y-8">

              {/* Table of Contents Box */}
              <div className="bg-dark-2 border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                      Navigation
                    </h3>
                    <p className="text-[9px] text-gold uppercase tracking-widest mt-0.5">
                      Quick Select
                    </p>
                  </div>
                </div>

                {/* Table of Contents Links */}
                {tableOfContents.length > 0 ? (
                  <nav className="space-y-1.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                    {tableOfContents.map((item, idx) => (
                      <a
                        key={idx}
                        href={`#${item.id}`}
                        className={`flex items-center gap-3.5 py-2 px-3 rounded-xl transition-all duration-300 group ${
                          item.level <= 2
                            ? "text-white font-bold hover:bg-gold/10 hover:text-gold bg-white/[0.03]"
                            : "pl-7 text-white/50 hover:text-gold hover:bg-white/[0.02]"
                        }`}
                      >
                        <div
                          className={`shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
                            item.level <= 2
                              ? "bg-gold scale-100 shadow-[0_0_8px_rgba(243,227,140,0.5)]"
                              : "bg-white/30 scale-75 group-hover:bg-gold group-hover:scale-100"
                          }`}
                        />
                        <span className="text-xs sm:text-sm font-semibold line-clamp-1 flex-1">
                          {item.text}
                        </span>
                      </a>
                    ))}
                  </nav>
                ) : (
                  <div className="py-2 space-y-2">
                    <p className="text-xs text-white/40 italic">
                      Comprehensive guide outlined above.
                    </p>
                  </div>
                )}

                {/* Article Impact / Quick Stats */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-3">
                    Article Impact
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/5 text-left">
                      <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider">Words</p>
                      <p className="text-lg font-mono font-bold text-gold mt-0.5">{wordCount}</p>
                    </div>
                    <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/5 text-left">
                      <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider">Read Time</p>
                      <p className="text-lg font-mono font-bold text-gold mt-0.5">{readTimeDisplay}</p>
                    </div>
                  </div>
                </div>

                {/* Engage */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-3">
                    Engage
                  </p>
                  <ShareButton title={post.title} url={post.slug} />
                </div>
              </div>

              {/* Sidebar Clinic Consultation CTA Box */}
              <div className="bg-gradient-to-br from-[#1c1a14] via-[#141414] to-[#0d0d0d] border border-gold/30 rounded-[2rem] p-7 text-white relative overflow-hidden group shadow-2xl space-y-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/15 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-gold/25 transition-colors duration-700 pointer-events-none" />
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9.5px] font-mono font-bold uppercase bg-gold/10 text-gold border border-gold/30">
                  <Star className="w-3 h-3 fill-current" /> {sidebarCta.badge}
                </span>
                <h4 className="display-heading text-2xl font-bold text-white leading-tight">
                  {sidebarCta.title}
                </h4>
                <p className="text-white/80 text-xs leading-relaxed font-sans font-normal">
                  {sidebarCta.description}
                </p>
                <a
                  href={sidebarCta.buttonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full justify-center text-xs py-3.5 mt-2 rounded-lg font-bold flex items-center gap-2 shadow-lg"
                >
                  <span>{sidebarCta.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Inline FAQs attached to this post */}
      {((post.faq && post.faq.length > 0) || (post.faqSchemaMarkup && post.faqSchemaMarkup.trim())) && (
        <div className="mt-16 pt-8 border-t border-white/10">
          <PageInlineFaqs
            faqs={post.faq}
            faqSchemaMarkup={post.faqSchemaMarkup}
            badge={post.faqBadge || "ARTICLE FAQ"}
            title={post.faqTitle || "Frequently Asked Questions"}
            subtitle={post.faqDescription || "Key clinical insights and treatment queries answered."}
          />
        </div>
      )}

      {/* ── 4. RELATED ARTICLES SECTION ───────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 my-20 pt-12 border-t border-white/10 max-w-6xl">
          <div className="text-left mb-8 space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-gold tracking-widest">
              {relatedSection.eyebrow}
            </span>
            <h2 className="display-heading text-2xl sm:text-3xl font-bold text-white">
              {relatedSection.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                href={`/blogs/${rPost.slug}/`}
                className="bg-dark-2 border border-white/10 hover:border-gold/40 rounded-[28px] overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(190,156,37,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group select-none relative block cursor-pointer"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-black/40 border-b border-white/10">
                    <img
                      src={rPost.image}
                      alt={rPost.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gold text-dark shadow-md shadow-gold/20">
                      <Star className="w-3 h-3 fill-current" />
                      {rPost.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
                      {rPost.title}
                    </h3>
                  </div>
                </div>

                <div className="px-6 pb-6 flex items-center justify-between text-xs font-sans border-t border-white/5 pt-4">
                  <span className="text-white/40 font-mono font-medium">
                    {rPost.date}
                  </span>
                  <span className="font-mono font-bold text-gold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rPost.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. SIGNATURE CLINIC CTA BANNER ─────────────────────────── */}
      <section id="contact" className="container mx-auto px-4 my-10 relative overflow-hidden max-w-6xl">
        <div className="bg-gradient-to-br from-[#181818] via-[#121212] to-[#0A0A0A] border border-gold/30 rounded-[32px] p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Background ambient gold orb */}
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-center gap-6 lg:max-w-[62%] text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5 text-[10px] font-mono tracking-widest text-gold font-bold uppercase w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              {detailCtaBanner.eyebrow}
            </div>

            {/* Headline */}
            <h2 className="display-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.18] tracking-tight text-white">
              {detailCtaBanner.titleIntro} <br className="hidden sm:block" />
              <span className="whitespace-nowrap inline-block">
                {detailCtaBanner.titleLine2}{" "}
                <span className="relative inline-block text-gold italic font-light pl-1">
                  {detailCtaBanner.titleHighlight}
                </span>
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base font-sans text-white/80 font-normal leading-relaxed max-w-lg">
              {detailCtaBanner.description}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <a
                href={detailCtaBanner.ctaPrimary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs py-3.5 px-7 rounded-lg font-bold flex items-center gap-2 shadow-lg"
              >
                <span>{detailCtaBanner.ctaPrimary.label}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>

              <Link
                href={detailCtaBanner.ctaSecondary.href}
                className="btn-outline-white text-xs py-3.5 px-7 rounded-lg font-bold flex items-center gap-2"
              >
                <span>{detailCtaBanner.ctaSecondary.label}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Side Portrait & Arch Graphic */}
          <div className="hidden lg:flex flex-1 items-end justify-center relative pr-4">
            <div className="absolute bottom-0 w-[280px] h-[280px] bg-gradient-to-t from-gold/20 via-gold/10 to-transparent rounded-full opacity-70 blur-xl pointer-events-none" />
            <div className="relative z-10 w-[270px] h-[350px] self-end drop-shadow-2xl overflow-hidden rounded-t-[32px] border-t border-l border-r border-gold/40 shadow-2xl">
              <img
                src={detailCtaBanner.portraitSrc}
                alt={detailCtaBanner.portraitAlt}
                className="w-full h-full object-cover object-top filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute top-12 right-16 h-3.5 w-3.5 rounded-full bg-gold shadow-[0_0_15px_#f3e38c] z-20" />
          </div>
        </div>
      </section>
    </article>
  );
}
