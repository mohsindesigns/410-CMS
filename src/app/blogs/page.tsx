import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import { Calendar, User, ArrowRight, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

export const revalidate = 60; // Cache for 1 minute

import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import Image from 'next/image';
import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const [content, pageDoc] = await Promise.all([
    SiteContent.findOne({ key: 'complete_data' }).lean() as any,
    Page.findOne({ $or: [{ slug: 'blogs' }, { slug: 'blog' }] }).lean() as any
  ]);
  
  const settings = content?.data?.settings;
  const blogData = content?.data?.blogsPage || content?.data?.blogPage || {};
  const seo = {
    ...(blogData?.seo || {}),
    ...(pageDoc?.seo || {})
  };
  const pageUrl = `${BASE_URL}/blogs/`;

  return {
    title: {
      absolute: seo.metaTitle || pageDoc?.title || "Our Blogs | 410 Muscle Therapy"
    },
    description: seo.metaDescription || blogData?.hero?.description || "Explore our latest articles, insights, and clinical recovery tips.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || pageDoc?.title || "Our Blogs | 410 Muscle Therapy",
      description: seo.ogDescription || seo.metaDescription || blogData?.hero?.description || "Explore our latest articles, insights, and clinical recovery tips.",
      url: pageUrl,
      type: 'website',
      images: seo.featuredImage ? [{ url: seo.featuredImage }] : [`${BASE_URL}/logo.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || "Our Blogs | 410 Muscle Therapy",
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || "Explore our latest articles, insights, and clinical recovery tips.",
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/logo.png`].filter(Boolean) as string[],
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy",
    },
    robots: getRobotsMetadata(settings, seo)
  };
}

export default async function BlogsIndexPage() {
  await connectToDatabase();
  
  const [allPosts, pageDoc, content] = await Promise.all([
    Post.find({ status: 'published', isTrashed: { $ne: true } })
      .populate('categories author')
      .sort({ publishedAt: -1, date: -1 })
      .lean(),
    Page.findOne({ $or: [{ slug: 'blogs' }, { slug: 'blog' }] }).lean() as any,
    SiteContent.findOne({ key: 'complete_data' }).lean() as any
  ]);

  const globalBlogsPage = content?.data?.blogsPage || content?.data?.blogPage || {};
  const blogsPage = {
    ...globalBlogsPage,
    ...(pageDoc?.content || {})
  };

  const label = blogsPage.label || blogsPage.header?.badge || "Recovery Insights";
  const titleLine1 = blogsPage.titleLine1 || blogsPage.header?.titlePrefix || "Our";
  const titleLine2 = blogsPage.titleLine2 || blogsPage.header?.titleHighlight || "Journal.";
  const description = blogsPage.description || blogsPage.header?.description || "Explore our latest articles, insights, and clinical tips on deep tissue therapy, mobility, and athletic recovery.";
  const ctaReadMore = blogsPage.ctaReadMore || "Read More";

  // Filter posts based on selected posts list, keeping custom selection order
  let posts = allPosts;
  if (Array.isArray(blogsPage.selectedPosts) && blogsPage.selectedPosts.length > 0) {
    posts = blogsPage.selectedPosts
      .map((id: string) => allPosts.find((p: any) => String(p._id) === String(id)))
      .filter(Boolean);
  }

  return (
    <main className="bg-dark min-h-screen pt-[140px] pb-24 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-radial-dots-gold pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="mb-12 md:mb-20 text-center flex flex-col items-center">
          <p className="section-label mb-4">{label}</p>
          <h1 className="display-heading text-[32px] min-[400px]:text-[44px] md:text-[64px] text-white leading-tight">
            {titleLine1} <span className="text-gold italic font-light">{titleLine2}</span>
          </h1>
          {description && (
            <div 
              className="text-white/60 text-[14px] md:text-[15px] max-w-2xl mx-auto mt-6 leading-relaxed [&_p]:text-white/60 [&_p]:text-center [&_p]:text-[14px] [&_p]:md:text-[15px] [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const tag =
              post.category ||
              (post.categories && post.categories[0]?.name) ||
              "";

            const rawExcerpt = post.excerpt || post.content || "";
            const cleanExcerpt = rawExcerpt.replace(/<[^>]*>/g, '').substring(0, 140) + "...";

            return (
              <Link
                key={post._id}
                href={`/blogs/${post.slug}/`}
                className="bg-black/40 border border-white/5 rounded-sm overflow-hidden group shadow-2xl flex flex-col hover:border-gold/30 hover:shadow-[0_0_30px_rgba(190,156,37,0.06)] transition-all duration-300"
              >
                <div className="relative w-full h-[240px] overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-800" />
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />
                  {tag && (
                    <span className="absolute top-4 left-4 bg-gold text-dark text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 shadow-lg">
                      {tag}
                    </span>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                  <h3 className="text-white font-bold text-[18px] md:text-[20px] leading-snug mb-3 group-hover:text-gold transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-white/60 text-[13.5px] leading-relaxed mb-6 flex-grow">
                    {cleanExcerpt}
                  </p>
                  <div
                    className="flex items-center gap-2 text-gold text-[12px] font-bold tracking-wide uppercase group-hover:gap-3 transition-all duration-200 mt-auto"
                  >
                    {ctaReadMore} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-black/20 rounded-lg border border-border-dark/50">
             <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
             <h3 className="text-2xl font-bold text-white">No posts yet</h3>
             <p className="text-white/40 mt-2">Check back later for new updates.</p>
          </div>
        )}
      </div>
    </main>
  );
}
