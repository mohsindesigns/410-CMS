import { Metadata } from 'next';

export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { Calendar, User, Tag as TagIcon, Clock, BookOpen, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
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
  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title: {
      absolute: post.seo?.metaTitle || post.title
    },
    description: post.seo?.metaDescription,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: (post.updatedAt || post.publishedAt)?.toISOString(),
      images: [
        {
          url: post.seo?.ogImage || post.featuredImage || `${BASE_URL}/eagle-logo.png`,
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
      images: [post.seo?.ogImage || post.featuredImage || `${BASE_URL}/eagle-logo.png`],
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

  console.log(`[Blog Debug] Post Title: ${post.title}`);
  console.log(`[Blog Debug] Post Location: "${post.location}"`);
  console.log(`[Blog Debug] Post Categories: ${post.categories?.length || 0}`);
  if (post.categories?.length > 0) console.log(`[Blog Debug] First Category: ${post.categories[0].name}`);
  console.log(`[Blog Debug] FAQ Count: ${post.faq?.length || 0}`);
  if (post.faq?.length > 0) console.log(`[Blog Debug] First FAQ: ${post.faq[0].question}`);

  const url = `${BASE_URL}/blog/${slug}`;
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const publishDate = post.publishedAt?.toISOString();
  const modifiedDate = (post.updatedAt || post.publishedAt)?.toISOString();
  const featuredImage = post.featuredImage || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop`;

  // Advanced Schema.org Graph JSON-LD
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}/#article`,
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
        'image': { '@id': `${url}/#primaryimage` },
        'thumbnailUrl': featuredImage,
        'keywords': post.tags?.map((t: any) => t.name).join(', '),
        'inLanguage': 'en-US'
      }
    ]
  };

  // Automated Table of Contents Logic
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let processedContent = post.content;

  const headingRegex = /<(h[123])>(.*?)<\/h[123]>/gi;
  let match;
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  while ((match = headingRegex.exec(post.content)) !== null) {
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
      <Script
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
            href="/blog" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-[12px] font-bold tracking-widest uppercase transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO BLOG
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image & Header (Sticky) */}
          <div className="lg:sticky lg:top-[115px] flex flex-col gap-6">
            <header className="flex flex-col items-start text-left">
              <h1 className="display-heading text-[32px] min-[400px]:text-[40px] md:text-[50px] text-white leading-[1.1] mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-white/50 text-[12px] tracking-[0.1em] uppercase font-bold">
                <span>{post.author?.name || '410 Muscle Therapy'}</span>
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </header>

            <div className="relative w-full h-[320px] md:h-[420px] rounded-sm overflow-hidden shadow-2xl border border-border-dark">
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-slate-700" />
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Article Content */}
          <article className="lg:pt-2 text-left">
            <div 
              className="prose prose-invert max-w-none 
                prose-p:text-white/70 prose-p:text-[16px] md:prose-p:text-[17px] prose-p:leading-[1.85] prose-p:tracking-wide prose-p:mb-8 prose-p:font-light
                prose-headings:text-white
                prose-h2:text-white prose-h2:text-[24px] md:prose-h2:text-[30px] prose-h2:mt-12 prose-h2:mb-6 prose-h2:font-normal prose-h2:tracking-tight prose-h2:leading-snug
                prose-h3:text-white prose-h3:text-[20px] md:prose-h3:text-[24px] prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-normal
                prose-a:text-gold prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                prose-img:rounded-sm prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </article>

        </div>
      </div>

      {/* FAQ Section */}
      {((post.faq && post.faq.length > 0) || (post.faqSchemaMarkup && post.faqSchemaMarkup.trim())) && (
        <div className="mt-20">
          <PageInlineFaqs 
            faqs={post.faq} 
            faqSchemaMarkup={post.faqSchemaMarkup} 
            badge={post.faqBadge}
            title={post.faqTitle}
            subtitle={post.faqDescription}
          />
        </div>
      )}
    </article>
  );
}
