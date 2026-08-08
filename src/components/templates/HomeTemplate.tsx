"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import AggressiveRoofingSection from "@/components/RoofingExperts";
import Services from "@/components/Services";


const Portfolio = dynamic(() => import("@/components/Portfolio"));
const Leadership = dynamic(() => import("@/components/Leadership"));
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const QuickQuote = dynamic(() => import("@/components/QuickQuote"), { ssr: false });
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
      <section id="roofingexperts">
        <AggressiveRoofingSection />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="leadership">
        <Leadership />
      </section>


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
        posts={allBlogs.filter((p: any) => (pageData?.content?.blogSection?.selectedPosts || []).includes(p._id))}
      />

      <QuickQuote />

    </div>
  );
}

