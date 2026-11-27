"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const StatsSection = dynamic(() => import("@/components/StatsSection"));
const Services = dynamic(() => import("@/components/Services"));
const FeatureCards = dynamic(() => import("@/components/FeatureCards"));


const Portfolio = dynamic(() => import("@/components/Portfolio"));
const Leadership = dynamic(() => import("@/components/Leadership"));
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const QuickQuote = dynamic(() => import("@/components/QuickQuote"), { ssr: false });
import Certificates from "@/components/Certificates";
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"), { ssr: false });
const CtaBanner = dynamic(() => import("@/components/CtaBanner"), { ssr: false });

import { useContent } from "@/hooks/useContent";
import PageInlineFaqs from "@/components/PageInlineFaqs";

import StatsBar from "@/components/StatsBar";

export default function HomeTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  const { allBlogs, blogSection } = useContent();
  return (
    <div className="relative">
      <Hero />
      <StatsBar />
      <section id="achievements">
        <StatsSection />
      </section>
      {/* #services anchor lives on the inner <section id="services"> in Services.tsx (one id per page) */}
      <div>
        <Services />
      </div>
      <FeatureCards />
      <section id="leadership">
        <Leadership />
      </section>

      <Certificates />


      <section id="about">
        <HowWeWork />
      </section>
      <Testimonials />
      <CtaBanner />
      <section id="contact">
        <QAForm pageData={pageData} />
      </section>


      <BlogSection
        title={pageData?.content?.blogSection?.title || blogSection?.title}
        subtitle={pageData?.content?.blogSection?.subtitle || blogSection?.subtitle}
        description={pageData?.content?.blogSection?.description || blogSection?.description}
        ctaAll={pageData?.content?.blogSection?.ctaAll || blogSection?.ctaAll}
        ctaReadMore={pageData?.content?.blogSection?.ctaReadMore || blogSection?.ctaReadMore}
        posts={(() => {
          // Loaded on the server (src/lib/blogPicks.ts getHomeBlogPosts), already newest first.
          if (Array.isArray(pageData?.homeBlogPosts) && pageData.homeBlogPosts.length > 0) return pageData.homeBlogPosts;
          const all: any[] = Array.isArray(allBlogs) ? allBlogs : [];
          const time = (p: any) => new Date(p?.publishedAt || p?.createdAt || 0).getTime() || 0;
          const newestFirst = (list: any[]) => [...list].sort((a, b) => time(b) - time(a));
          const section = pageData?.content?.blogSection || blogSection || {};
          const selected = Array.isArray(section.selectedPosts) ? section.selectedPosts.map(String) : [];
          const filtered = section.postsMode === 'picked' && selected.length > 0
            ? all.filter((p: any) => selected.includes(String(p._id)))
            : [];
          return filtered.length > 0 ? newestFirst(filtered) : newestFirst(all).slice(0, Number(section.latestCount) || 9);
        })()}
      />


    </div>
  );
}

