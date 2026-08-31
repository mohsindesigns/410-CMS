import { Metadata } from 'next';

export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { Calendar, User, Tag as TagIcon, Clock, BookOpen, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareButton from '@/components/blog/ShareButton';
import PageInlineFaqs from '@/components/PageInlineFaqs';
import { BASE_URL } from '@/lib/constants';
import { makeLinksDoFollow } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

import SiteContent from "@/models/Content";
import { getRobotsMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const [post, content] = await Promise.all([
    Post.findOne({ slug, status: 'published' }),
    SiteContent.findOne({ key: "complete_data" }).lean() as any
  ]);

  if (!post) return { title: 'Post Not Found' };

  const settings = content?.data?.settings;
  const url = `${BASE_URL}/blogs/${slug}/`;

  return {
    title: {
      absolute: post.seo?.metaTitle || post.title
    },
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: (post.updatedAt || post.publishedAt)?.toISOString(),
      images: [
        {
          url: post.seo?.ogImage || post.featuredImage || `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt,
      images: [post.seo?.ogImage || post.featuredImage || `${BASE_URL}/logo.png`],
      site: "@410MuscleTherapy",
      creator: "@410MuscleTherapy",
    },
    robots: getRobotsMetadata(settings, post.seo),
    alternates: {
      canonical: post.seo?.canonicalUrl || url,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();

  const post = await Post.findOne({ slug, status: 'published' })
    .populate('categories tags author')
    .lean();

  if (!post) notFound();

  const url = `${BASE_URL}/blogs/${slug}/`;
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const publishDate = post.publishedAt?.toISOString();
  const modifiedDate = (post.updatedAt || post.publishedAt)?.toISOString();
  const featuredImage = post.featuredImage || `${BASE_URL}/logo.png`;

  // Advanced Schema.org Graph JSON-LD
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        'isPartOf': { '@id': url },
        'author': {
          '@id': `${BASE_URL}/#/schema/person/${post.author?._id || 'admin'}`
        },
        'headline': post.title,
        'datePublished': publishDate,
        'dateModified': modifiedDate,
        'mainEntityOfPage': { '@id': url },
        'wordCount': wordCount,
        'publisher': { '@id': `${BASE_URL}/#organization` },
        'image': { '@id': `${url}#primaryimage` },
        'thumbnailUrl': featuredImage,
        'keywords': post.tags?.map((t: any) => t.name).join(', '),
        'inLanguage': 'en-US'
      }
    ]
  };

  // Automated Table of Contents Logic
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let processedContent = post.content || "";

  const headingRegex = /<(h[123])>(.*?)<\/h[123]>/gi;
  let match;
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  while ((match = headingRegex.exec(post.content || "")) !== null) {
    const tag = match[1].toLowerCase();
    const text = match[2].replace(/<[^>]*>/g, '');
    const id = slugify(text);

    // Demote H1 to H2 to ensure only one H1 on the page
    const finalTag = tag === 'h1' ? 'h2' : tag;
    const level = parseInt(finalTag[1]);

    tableOfContents.push({ id, text, level });

    const originalTag = match[0];
    const newTag = `<${finalTag} id="${id}" class="scroll-mt-32">${match[2]}</${finalTag}>`;
    processedContent = processedContent.replace(originalTag, newTag);
  }

  processedContent = makeLinksDoFollow(processedContent);

  return (
    <article className="bg-dark min-h-screen pt-[140px] pb-24 relative">
      <script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <ReadingProgress />

      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-radial-dots-gold pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Top Bar Navigation */}
        <div className="mb-10 lg:mb-16 text-left">
          <Link 
            href="/blogs/" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-[12px] font-bold tracking-widest uppercase transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO BLOGS
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image & Header (Sticky) */}
          <div className="lg:sticky lg:top-[115px] flex flex-col gap-6">
            <header className="flex flex-col items-start text-left">
              <h1 className="display-heading text-[32px] min-[400px]:text-[40px] md:text-[50px] text-white leading-[1.1] mb-4">
                {post.title}
              </h1>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-white/40 text-[12px] font-mono tracking-wider mb-6">
                {post.publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gold" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {post.author && (
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-gold" />
                    <span>{typeof post.author === 'string' ? post.author : post.author.name}</span>
                  </div>
                )}
                {post.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-gold" />
                    <span>{post.location}</span>
                  </div>
                )}
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative w-full h-[320px] sm:h-[400px] rounded-lg overflow-hidden border border-white/10 shadow-2xl mb-6">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Share buttons */}
              <div className="w-full pt-4 border-t border-white/10">
                <ShareButton url={url} title={post.title} />
              </div>
            </header>
          </div>

          {/* Right Column: Content & TOC */}
          <div className="flex flex-col gap-10 text-left">
            {/* Table of Contents */}
            {tableOfContents.length > 2 && (
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
                <p className="text-gold font-mono text-[11px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <BookOpen size={14} />
                  Table of Contents
                </p>
                <nav className="flex flex-col gap-2.5">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`text-white/70 hover:text-gold text-[13px] leading-snug transition-colors ${
                        item.level === 3 ? 'pl-4 text-white/50 text-[12px]' : ''
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Main Rich Content */}
            <div
              className="prose prose-invert prose-gold max-w-none 
                prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-white
                prose-h2:text-[24px] prose-h2:sm:text-[28px] prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3
                prose-h3:text-[18px] prose-h3:sm:text-[20px] prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-white/75 prose-p:text-[15px] prose-p:leading-[1.85] prose-p:font-light prose-p:mb-5
                prose-a:text-gold prose-a:underline prose-a:decoration-gold/40 hover:prose-a:decoration-white prose-a:transition-colors
                prose-ul:text-white/75 prose-ul:my-4 prose-li:my-1.5 prose-li:text-[14.5px]
                prose-table:w-full prose-table:border-collapse prose-table:my-6
                prose-th:bg-white/5 prose-th:text-white prose-th:p-3 prose-th:border prose-th:border-white/10 prose-th:text-left prose-th:text-[13px]
                prose-td:p-3 prose-td:border prose-td:border-white/10 prose-td:text-white/70 prose-td:text-[13px]
                prose-strong:text-white prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Bottom inline FAQs if available */}
            {post.faq && Array.isArray(post.faq) && post.faq.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <PageInlineFaqs faqs={post.faq} title="Frequently Asked Questions" />
              </div>
            )}
          </div>

        </div>

      </div>
    </article>
  );
}
