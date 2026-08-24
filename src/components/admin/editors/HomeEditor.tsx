"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Loader2, Image as ImageIcon,
  LayoutTemplate, Type, Star, Briefcase, Users,
  List, Mail, BookOpen, ChevronRight, Check
} from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
import ImageField from "@/components/admin/ImageField";
import BlogSelector from "@/components/admin/BlogSelector";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

import { UI } from "./styles";

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        hero: {
          label: "Performance Recovery Specialist • Est. 2020",
          title1: "Recover Faster.",
          title2: "Perform Higher.",
          description: "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults since 2020.",
          ctaBook: "BOOK RECOVERY SESSION",
          ctaServices: "EXPLORE SERVICES",
          socialProofText: "Trusted by 500+ athletes & active adults",
          image: "/images/hero-bg.webp",
          imageAlt: "Expert muscle therapy session"
        },
        stats: {
          label: "Our Achievements",
          titleLine1: "Proven Results.",
          titleLine2: "Professional",
          titleItalicWord: "Standards.",
          description: "At 410 Muscle Therapy, we believe that true recovery is built on specialized bodywork and precision movement science.",
          image: "/images/blog-3.webp",
          imageAlt: "Clinical sports massage session",
          items: [
            { value: "8+", label: "Years of Experience" },
            { value: "5,000+", label: "Clients Treated" },
            { value: "15,000+", label: "Sessions Completed" },
            { value: "100%", label: "Satisfaction Rate" }
          ]
        },
        services: {
          label: "Our Services",
          titleLine1: "Therapies",
          titleLine2: "Designed",
          titleLine3: "Around",
          titleItalicWord: "You",
          description: "Experience specialized therapeutic bodywork engineered around your performance and athletic recovery goals.",
          ctaAll: "VIEW ALL SERVICES",
          ctaLearnMore: "LEARN MORE",
          services: [],
          items: []
        },
        leadership: {
          label: "The Specialist",
          title: "Meet Antoine Lyles",
          tagline: "Performance Recovery Specialist",
          desc1: "<p>Antoine Lyles is a certified massage therapist specializing in clinical sports massage, myofascial release, and neuromuscular therapy.</p>",
          desc2: "<p>With years of experience working with competitive athletes and active individuals, he delivers targeted protocols designed to restore functional movement.</p>",
          photoBadge: "PERFORMANCE RECOVERY SPECIALIST",
          image: "/images/theraphist.jpeg",
          imageAlt: "Antoine Lyles",
          ctaMore: "LEARN MORE ABOUT ANTOINE",
          ctaLink: "",
          signatureName: "Antoine Lyles",
          signatureTitle: "Performance Recovery Specialist"
        },
        process: {
          label: "THE CLINICAL PROCESS",
          title: "Your Recovery Journey.",
          description: "We analyze your biomechanics, locate the underlying dysfunctions, and apply clinical treatment steps to ensure lasting relief and athletic longevity.",
          phaseLabel: "PHASE",
          items: [
            { id: "01", title: "Assessment", description: "Identify muscular imbalances and structural restrictions.", image: "/images/blog-1.webp", actions: ["Range of Motion Testing", "Postural Alignment Check"] },
            { id: "02", title: "Targeted Therapy", description: "Address dysfunctions with deep tissue and mobility techniques.", image: "/images/blog-2.webp", actions: ["Trigger Point Releases", "PNF Muscle Stretching"] }
          ]
        },
        testimonials: {
          label: "Clients Love Us",
          title1: "Real People.",
          title2: "Real Results.",
          testimonials: [],
          items: [],
          results: [
            { label: "Post-Workout Recovery", image: "/images/testimonial-1.webp" },
            { label: "Shoulder Range Restoration", image: "/images/testimonial-2.webp" }
          ]
        },
        ctaBanner: {
          tagline: "Take the First Step",
          title: "Ready to Feel Your Best?",
          description: "Book your appointment today and start your journey to a pain-free, stronger you.",
          button: "BOOK APPOINTMENT",
          buttonUrl: ""
        },
        quote: {
          section: { badge: "GET IN TOUCH", headline: "Have Questions? Let's Connect." },
          formClinicPortal: "INSTANT ONLINE BOOKING",
          formClinicPortalSub: "Book directly on StyleSeat portal",
          formStyleSeatBtn: "BOOK ON STYLESEAT",
          formBtnSubmit: "SEND MESSAGE",
          formSuccessToast: "Thank you! Your inquiry has been sent. We will reply within 24 hours.",
          trustHipa: "HIPAA Compliant & Secure",
          trustResponse: "Avg Response: 2 Hours",
          services: [
            { label: "Corrective Movement Therapy", value: "corrective-movement" },
            { label: "Maryland Sports Massage", value: "sports-massage" },
            { label: "Fascial Stretch Therapy", value: "stretch-therapy" },
            { label: "Deep Tissue Massage", value: "deep-tissue" }
          ]
        },
        faq: {
          section: { badge: "FAQ", headline: "Frequently Asked Questions" },
          items: []
        },
        blogSection: {
          subtitle: "FROM THE BLOG",
          title: "Insights & Recovery Tips",
          ctaAll: "View All Articles",
          ctaReadMore: "Read Article",
          description: "Explore the latest clinical insights, recovery methods, and athletic performance tips from our certified specialists.",
          selectedPosts: []
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateSection = (section: string, field: string | null, value: any) => {
    setData((prev: any) => {
      const currentData = prev || {};
      const sectionData = currentData[section] || {};
      
      let newValue = value;
      if (typeof value === 'function') {
        const currentValue = field ? sectionData[field] : sectionData;
        newValue = value(currentValue);
      }

      const updatedSection = field ? {
        ...sectionData,
        [field]: newValue,
      } : newValue;

      return {
        ...currentData,
        [section]: updatedSection,
      };
    });
  };

  const tabs = [
    { id: "hero", label: "1. Hero Banner", icon: LayoutTemplate },
    { id: "stats", label: "2. Stats & Achievements", icon: Star },
    { id: "services", label: "3. Services Showcase", icon: Briefcase },
    { id: "leadership", label: "4. Specialist Profile", icon: Users },
    { id: "process", label: "5. Clinical Process", icon: List },
    { id: "testimonials", label: "6. Reviews & Results", icon: Star },
    { id: "ctaBanner", label: "7. CTA Banner", icon: LayoutTemplate },
    { id: "contact", label: "8. Contact & FAQs", icon: Mail },
    { id: "blog", label: "9. Blog Insights", icon: BookOpen },
  ];

  return (
    <div className="bg-white max-w-4xl mx-auto pb-20">
      {/* Visual Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-8 text-[13px] border-b border-[#f0f0f1] pb-2 sticky top-0 bg-white z-10 pt-2 shadow-sm">
        {tabs.map((tab: any) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-medium transition-colors ${
                isActive
                  ? 'text-[#1d2327] font-bold bg-[#f0f0f1] border-b-2 border-[#2271b1]'
                  : 'text-[#2271b1] hover:text-[#135e96] hover:bg-[#f6f7f7]'
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#2271b1]" : "opacity-70"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="space-y-10"
        >

          {/* ═══════════════════════════════════════════════════════════════
              1. HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "hero" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Branding & Labels</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Top Badge / Label</label>
                    <input
                      type="text"
                      value={data.hero?.label || data.hero?.badge || ""}
                      onChange={(e) => {
                        updateSection("hero", "label", e.target.value);
                        updateSection("hero", "badge", e.target.value);
                      }}
                      className={UI.input}
                      placeholder="e.g. Performance Recovery Specialist • Est. 2020"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline — Line 1</label>
                      <input
                        type="text"
                        value={data.hero?.title1 || ""}
                        onChange={(e) => updateSection("hero", "title1", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Recover Faster."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline — Line 2 (Highlighted)</label>
                      <input
                        type="text"
                        value={data.hero?.title2 || ""}
                        onChange={(e) => updateSection("hero", "title2", e.target.value)}
                        className={UI.input + " font-bold text-[#2271b1]"}
                        placeholder="e.g. Perform Higher."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Hero Description Narrative</label>
                    <textarea
                      value={data.hero?.description || ""}
                      onChange={(e) => updateSection("hero", "description", e.target.value)}
                      className={UI.input + " h-24"}
                      placeholder="Specialized performance bodywork, mobility restoration, and injury prevention..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>2. Call To Action & Social Proof</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Button Label (Booking)</label>
                      <input
                        type="text"
                        value={data.hero?.ctaBook || ""}
                        onChange={(e) => updateSection("hero", "ctaBook", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. BOOK RECOVERY SESSION"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Label (Services)</label>
                      <input
                        type="text"
                        value={data.hero?.ctaServices || ""}
                        onChange={(e) => updateSection("hero", "ctaServices", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. EXPLORE SERVICES"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Social Proof Trust Badge Text</label>
                    <input
                      type="text"
                      value={data.hero?.socialProofText || ""}
                      onChange={(e) => updateSection("hero", "socialProofText", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. Trusted by 500+ athletes & active adults"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>3. Hero Background Image</h3>
                <div className={UI.card + " space-y-4"}>
                  <ImageField
                    label="Background Photography"
                    value={data.hero?.image || data.hero?.images?.[0] || ""}
                    onChange={(url) => {
                      updateSection("hero", "image", url);
                      updateSection("hero", "images", [url]);
                    }}
                    altValue={data.hero?.imageAlt || data.hero?.bgImageAlt || ""}
                    onAltChange={(alt) => {
                      updateSection("hero", "imageAlt", alt);
                      updateSection("hero", "bgImageAlt", alt);
                    }}
                    description="High resolution photo with dark contrast for hero background."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              2. STATS BAR & ACHIEVEMENTS SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Horizontal Highlight Statistics Bar (4 Items)</h3>
                <p className="text-[12px] text-[#646970] -mt-2">These 4 stats are displayed in the quick horizontal strip right under the hero section.</p>
                <div className="space-y-3">
                  {(data.stats?.items || []).map((s: any, i: number) => (
                    <div key={i} className={UI.card + " flex items-center gap-4 relative"}>
                      <span className="text-[11px] font-bold text-[#646970] w-6 flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={UI.label}>Value (e.g. 8+, 5,000+)</label>
                          <input
                            type="text"
                            value={s.value || ""}
                            onChange={(e) => {
                              const newItems = [...(data.stats?.items || [])];
                              newItems[i] = { ...newItems[i], value: e.target.value };
                              updateSection("stats", "items", newItems);
                            }}
                            className={UI.inputLarge}
                          />
                        </div>
                        <div>
                          <label className={UI.label}>Label (e.g. Years of Experience)</label>
                          <input
                            type="text"
                            value={s.label || ""}
                            onChange={(e) => {
                              const newItems = [...(data.stats?.items || [])];
                              newItems[i] = { ...newItems[i], label: e.target.value };
                              updateSection("stats", "items", newItems);
                            }}
                            className={UI.input}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newItems = (data.stats?.items || []).filter((_: any, idx: number) => idx !== i);
                          updateSection("stats", "items", newItems);
                        }}
                        className="text-[#d63638] hover:bg-red-50 p-2 rounded"
                        title="Remove Stat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.stats?.items || [];
                      updateSection("stats", "items", [...current, { value: "", label: "" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Stat Item
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Achievements Editorial Block ("Our Achievements")</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={UI.card + " space-y-4"}>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Label / Badge</label>
                      <input
                        type="text"
                        value={data.stats?.label || ""}
                        onChange={(e) => updateSection("stats", "label", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Our Achievements"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Line 1</label>
                      <input
                        type="text"
                        value={data.stats?.titleLine1 || ""}
                        onChange={(e) => updateSection("stats", "titleLine1", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Proven Results."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Headline Line 2</label>
                        <input
                          type="text"
                          value={data.stats?.titleLine2 || ""}
                          onChange={(e) => updateSection("stats", "titleLine2", e.target.value)}
                          className={UI.input + " font-bold"}
                          placeholder="e.g. Professional"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Accent Word (Italic)</label>
                        <input
                          type="text"
                          value={data.stats?.titleItalicWord || ""}
                          onChange={(e) => updateSection("stats", "titleItalicWord", e.target.value)}
                          className={UI.input + " font-serif italic text-gold"}
                          placeholder="e.g. Standards."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Narrative Paragraph</label>
                      <textarea
                        value={data.stats?.description || ""}
                        onChange={(e) => updateSection("stats", "description", e.target.value)}
                        className={UI.input + " h-24"}
                        placeholder="At 410 Muscle Therapy, we believe that true recovery is built on..."
                      />
                    </div>
                  </div>

                  <div className={UI.card + " space-y-4"}>
                    <ImageField
                      label="Editorial Action Photo"
                      value={data.stats?.image || ""}
                      onChange={(url) => updateSection("stats", "image", url)}
                      altValue={data.stats?.imageAlt || ""}
                      onAltChange={(alt) => updateSection("stats", "imageAlt", alt)}
                      description="Photo displayed in the framed luxury corner-bracket box."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              3. SERVICES SHOWCASE SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "services" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro & Headlines</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Badge / Label</label>
                    <input
                      type="text"
                      value={data.services?.label || data.services?.badge || ""}
                      onChange={(e) => {
                        updateSection("services", "label", e.target.value);
                        updateSection("services", "badge", e.target.value);
                      }}
                      className={UI.input}
                      placeholder="e.g. Our Services"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Title Word 1</label>
                      <input
                        type="text"
                        value={data.services?.titleLine1 || ""}
                        onChange={(e) => updateSection("services", "titleLine1", e.target.value)}
                        className={UI.input}
                        placeholder="Therapies"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Title Word 2</label>
                      <input
                        type="text"
                        value={data.services?.titleLine2 || ""}
                        onChange={(e) => updateSection("services", "titleLine2", e.target.value)}
                        className={UI.input}
                        placeholder="Designed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Title Word 3</label>
                      <input
                        type="text"
                        value={data.services?.titleLine3 || ""}
                        onChange={(e) => updateSection("services", "titleLine3", e.target.value)}
                        className={UI.input}
                        placeholder="Around"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Accent Word (Italic)</label>
                      <input
                        type="text"
                        value={data.services?.titleItalicWord || ""}
                        onChange={(e) => updateSection("services", "titleItalicWord", e.target.value)}
                        className={UI.input + " font-serif italic text-gold"}
                        placeholder="You"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Intro Narrative</label>
                    <textarea
                      value={typeof data.services?.description === 'string' ? data.services.description : ""}
                      onChange={(e) => updateSection("services", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="Experience specialized therapeutic bodywork engineered around your goals..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>"View All" Button Label</label>
                      <input
                        type="text"
                        value={data.services?.ctaAll || ""}
                        onChange={(e) => updateSection("services", "ctaAll", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. VIEW ALL SERVICES"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>"Learn More" Button Label</label>
                      <input
                        type="text"
                        value={data.services?.ctaLearnMore || ""}
                        onChange={(e) => updateSection("services", "ctaLearnMore", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. LEARN MORE"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Featured Services Selection</h3>
                <p className="text-[12px] text-[#646970] -mt-2">Select and order the services shown in the interactive left-to-right preview selector on the homepage.</p>
                <ContentSelector
                  type="services"
                  label="Select Services to Feature on Homepage"
                  selectedItems={data.services?.items || []}
                  onSelect={(items) => {
                    updateSection("services", "items", items);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              4. SPECIALIST PROFILE SECTION (Antoine Lyles)
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "leadership" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Specialist Identity & Titles</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Badge / Label</label>
                      <input
                        type="text"
                        value={data.leadership?.label || ""}
                        onChange={(e) => updateSection("leadership", "label", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. The Specialist"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Main Title Headline</label>
                      <input
                        type="text"
                        value={data.leadership?.title || ""}
                        onChange={(e) => updateSection("leadership", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Meet Antoine Lyles"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Tagline / Subtitle (Gold Serif)</label>
                    <input
                      type="text"
                      value={data.leadership?.tagline || ""}
                      onChange={(e) => updateSection("leadership", "tagline", e.target.value)}
                      className={UI.input + " font-serif italic text-gold-dark"}
                      placeholder="e.g. Performance Recovery Specialist"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>2. Biography & Narrative</h3>
                <div className={UI.card + " space-y-4"}>
                  <RichTextEditor
                    label="First Paragraph Narrative"
                    content={data.leadership?.desc1 || ""}
                    onChange={(html) => updateSection("leadership", "desc1", html)}
                  />
                  <RichTextEditor
                    label="Second Paragraph Narrative"
                    content={data.leadership?.desc2 || ""}
                    onChange={(html) => updateSection("leadership", "desc2", html)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>3. Specialist Photo & Signature</h3>
                <div className={UI.card + " space-y-4"}>
                  <ImageField
                    label="Therapist Portrait Image"
                    value={data.leadership?.image || ""}
                    onChange={(url) => updateSection("leadership", "image", url)}
                    altValue={data.leadership?.imageAlt || ""}
                    onAltChange={(alt) => updateSection("leadership", "imageAlt", alt)}
                  />
                  <div className="space-y-1.5">
                    <label className={UI.label}>Floating Photo Tag (Badge)</label>
                    <input
                      type="text"
                      value={data.leadership?.photoBadge || ""}
                      onChange={(e) => updateSection("leadership", "photoBadge", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. PERFORMANCE RECOVERY SPECIALIST"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button Label</label>
                      <input
                        type="text"
                        value={data.leadership?.ctaMore || ""}
                        onChange={(e) => updateSection("leadership", "ctaMore", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. LEARN MORE ABOUT ANTOINE"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Custom URL (Optional override)</label>
                      <input
                        type="text"
                        value={data.leadership?.ctaLink || ""}
                        onChange={(e) => updateSection("leadership", "ctaLink", e.target.value)}
                        className={UI.input}
                        placeholder="Defaults to StyleSeat Booking"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              5. CLINICAL PROCESS (HOW IT WORKS) SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "process" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Intro Badge</label>
                      <input
                        type="text"
                        value={data.process?.label || ""}
                        onChange={(e) => updateSection("process", "label", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. THE CLINICAL PROCESS"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Title</label>
                      <input
                        type="text"
                        value={data.process?.title || ""}
                        onChange={(e) => updateSection("process", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Your Recovery Journey."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Description</label>
                    <textarea
                      value={data.process?.description || ""}
                      onChange={(e) => updateSection("process", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="We analyze your biomechanics, locate the underlying dysfunctions..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Step Prefix (e.g. PHASE or STEP)</label>
                    <input
                      type="text"
                      value={data.process?.phaseLabel || "PHASE"}
                      onChange={(e) => updateSection("process", "phaseLabel", e.target.value)}
                      className={UI.input}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Clinical Journey Steps</h3>
                <div className="space-y-4">
                  {(data.process?.items || []).map((step: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-4 relative"}>
                      <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                        <span className="text-[10px] font-bold text-[#646970] uppercase">Step #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newItems = data.process.items.filter((_: any, idx: number) => idx !== i);
                            updateSection("process", "items", newItems);
                          }}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className={UI.label}>Number (e.g. 01)</label>
                          <input
                            type="text"
                            value={step.id || ""}
                            onChange={(e) => {
                              const newItems = [...data.process.items];
                              newItems[i] = { ...newItems[i], id: e.target.value };
                              updateSection("process", "items", newItems);
                            }}
                            className={UI.input}
                          />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <label className={UI.label}>Step Title</label>
                          <input
                            type="text"
                            value={step.title || ""}
                            onChange={(e) => {
                              const newItems = [...data.process.items];
                              newItems[i] = { ...newItems[i], title: e.target.value };
                              updateSection("process", "items", newItems);
                            }}
                            className={UI.input + " font-bold"}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Step Description</label>
                        <textarea
                          value={step.description || ""}
                          onChange={(e) => {
                            const newItems = [...data.process.items];
                            newItems[i] = { ...newItems[i], description: e.target.value };
                            updateSection("process", "items", newItems);
                          }}
                          className={UI.input + " h-20"}
                        />
                      </div>
                      <ImageField
                        label="Step Action Photo"
                        value={step.image || ""}
                        onChange={(url) => {
                          const newItems = [...data.process.items];
                          newItems[i] = { ...newItems[i], image: url };
                          updateSection("process", "items", newItems);
                        }}
                        altValue={step.title || ""}
                        onAltChange={() => {}}
                      />
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-center">
                          <label className={UI.label}>Checklist Action Items</label>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...data.process.items];
                              const currentActions = Array.isArray(newItems[i].actions)
                                ? [...newItems[i].actions]
                                : (typeof newItems[i].actions === 'string' ? newItems[i].actions.split("\n").filter(Boolean) : []);
                              newItems[i] = { ...newItems[i], actions: [...currentActions, ""] };
                              updateSection("process", "items", newItems);
                            }}
                            className="text-[#2271b1] hover:underline text-xs font-semibold"
                          >
                            + Add Action Item
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(Array.isArray(step.actions) && step.actions.length > 0
                            ? step.actions
                            : (typeof step.actions === 'string' && step.actions.trim() ? step.actions.split("\n").filter(Boolean) : [""])
                          ).map((act: string, actIdx: number) => (
                            <div key={actIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={act}
                                onChange={(e) => {
                                  const newItems = [...data.process.items];
                                  const rawActions = Array.isArray(newItems[i].actions)
                                    ? [...newItems[i].actions]
                                    : (typeof newItems[i].actions === 'string' ? newItems[i].actions.split("\n").filter(Boolean) : []);
                                  rawActions[actIdx] = e.target.value;
                                  newItems[i] = { ...newItems[i], actions: rawActions };
                                  updateSection("process", "items", newItems);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const newItems = [...data.process.items];
                                    const rawActions = Array.isArray(newItems[i].actions)
                                      ? [...newItems[i].actions]
                                      : (typeof newItems[i].actions === 'string' ? newItems[i].actions.split("\n").filter(Boolean) : []);
                                    rawActions.splice(actIdx + 1, 0, "");
                                    newItems[i] = { ...newItems[i], actions: rawActions };
                                    updateSection("process", "items", newItems);
                                  }
                                }}
                                className={UI.input + " text-xs"}
                                placeholder={`Action Item #${actIdx + 1} (e.g. Range of Motion Testing)`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...data.process.items];
                                  const rawActions = Array.isArray(newItems[i].actions)
                                    ? [...newItems[i].actions]
                                    : (typeof newItems[i].actions === 'string' ? newItems[i].actions.split("\n").filter(Boolean) : []);
                                  rawActions.splice(actIdx, 1);
                                  newItems[i] = { ...newItems[i], actions: rawActions };
                                  updateSection("process", "items", newItems);
                                }}
                                className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                                title="Remove Action Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.process?.items || [];
                      updateSection("process", "items", [
                        ...current,
                        { id: `0${current.length + 1}`, title: "", description: "", image: "", actions: [] }
                      ]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Process Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              6. TESTIMONIALS & RESULTS GALLERY SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "testimonials" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Headlines</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Badge / Label</label>
                    <input
                      type="text"
                      value={data.testimonials?.label || ""}
                      onChange={(e) => updateSection("testimonials", "label", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. Clients Love Us"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Line 1</label>
                      <input
                        type="text"
                        value={data.testimonials?.title1 || ""}
                        onChange={(e) => updateSection("testimonials", "title1", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Real People."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Line 2 (Italic)</label>
                      <input
                        type="text"
                        value={data.testimonials?.title2 || ""}
                        onChange={(e) => updateSection("testimonials", "title2", e.target.value)}
                        className={UI.input + " font-serif italic text-gold"}
                        placeholder="e.g. Real Results."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Featured Client Testimonials Selection</h3>
                <ContentSelector
                  type="reviews"
                  label="Select Customer Reviews to Display"
                  selectedItems={data.testimonials?.testimonials || data.testimonials?.items || []}
                  onSelect={(items) => {
                    updateSection("testimonials", "testimonials", items);
                    updateSection("testimonials", "items", items);
                  }}
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>3. Results Visual Showcase Cards</h3>
                <p className="text-[12px] text-[#646970] -mt-2">Photos shown in the luxury results cards alongside client reviews.</p>
                <div className="space-y-4">
                  {(data.testimonials?.results || []).map((res: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-4 relative"}>
                      <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                        <span className="text-[10px] font-bold text-[#646970] uppercase">Result Card #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newRes = data.testimonials.results.filter((_: any, idx: number) => idx !== i);
                            updateSection("testimonials", "results", newRes);
                          }}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Caption Label</label>
                        <input
                          type="text"
                          value={res.label || ""}
                          onChange={(e) => {
                            const newRes = [...data.testimonials.results];
                            newRes[i] = { ...newRes[i], label: e.target.value };
                            updateSection("testimonials", "results", newRes);
                          }}
                          className={UI.input}
                          placeholder="e.g. Shoulder Range Restoration"
                        />
                      </div>
                      <ImageField
                        label="Result Photo"
                        value={res.image || ""}
                        onChange={(url) => {
                          const newRes = [...data.testimonials.results];
                          newRes[i] = { ...newRes[i], image: url };
                          updateSection("testimonials", "results", newRes);
                        }}
                        altValue={res.label || ""}
                        onAltChange={() => {}}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.testimonials?.results || [];
                      updateSection("testimonials", "results", [...current, { label: "", image: "" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Result Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              7. CTA CONVERSION BANNER SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "ctaBanner" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>Gold Strip Conversion Banner</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Tagline Prefix</label>
                    <input
                      type="text"
                      value={data.ctaBanner?.tagline || ""}
                      onChange={(e) => updateSection("ctaBanner", "tagline", e.target.value)}
                      className={UI.input}
                      placeholder="e.g. Take the First Step"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Headline Title</label>
                    <input
                      type="text"
                      value={data.ctaBanner?.title || ""}
                      onChange={(e) => updateSection("ctaBanner", "title", e.target.value)}
                      className={UI.input + " font-bold text-lg"}
                      placeholder="e.g. Ready to Feel Your Best?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Description Narrative</label>
                    <textarea
                      value={data.ctaBanner?.description || ""}
                      onChange={(e) => updateSection("ctaBanner", "description", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="Book your appointment today and start your journey..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Button Text Label</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.button || ""}
                        onChange={(e) => updateSection("ctaBanner", "button", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. BOOK APPOINTMENT"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Button Link URL (Optional override)</label>
                      <input
                        type="text"
                        value={data.ctaBanner?.buttonUrl || data.ctaBanner?.btnUrl || ""}
                        onChange={(e) => {
                          updateSection("ctaBanner", "buttonUrl", e.target.value);
                          updateSection("ctaBanner", "btnUrl", e.target.value);
                        }}
                        className={UI.input}
                        placeholder="Defaults to StyleSeat booking"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              8. CONTACT FORM & FAQ SECTION (QAForm)
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "contact" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Luxury Contact Form & StyleSeat Portal</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Form Section Badge</label>
                      <input
                        type="text"
                        value={data.quote?.section?.badge || "GET IN TOUCH"}
                        onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), badge: e.target.value })}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Form Headline</label>
                      <input
                        type="text"
                        value={data.quote?.section?.headline || "Have Questions? Let's Connect."}
                        onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), headline: e.target.value })}
                        className={UI.input + " font-bold"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Instant Booking Tag</label>
                      <input
                        type="text"
                        value={data.quote?.formClinicPortal || "INSTANT ONLINE BOOKING"}
                        onChange={(e) => updateSection("quote", "formClinicPortal", e.target.value)}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Instant Booking Subtitle</label>
                      <input
                        type="text"
                        value={data.quote?.formClinicPortalSub || "Book directly on StyleSeat portal"}
                        onChange={(e) => updateSection("quote", "formClinicPortalSub", e.target.value)}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>StyleSeat Button Label</label>
                      <input
                        type="text"
                        value={data.quote?.formStyleSeatBtn || "BOOK ON STYLESEAT"}
                        onChange={(e) => updateSection("quote", "formStyleSeatBtn", e.target.value)}
                        className={UI.input}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f0f0f1]">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Submit Button Label</label>
                      <input
                        type="text"
                        value={data.quote?.formBtnSubmit || "SEND MESSAGE"}
                        onChange={(e) => updateSection("quote", "formBtnSubmit", e.target.value)}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>HIPAA Trust Text</label>
                      <input
                        type="text"
                        value={data.quote?.trustHipa || "HIPAA Compliant & Secure"}
                        onChange={(e) => updateSection("quote", "trustHipa", e.target.value)}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Response Time Text</label>
                      <input
                        type="text"
                        value={data.quote?.trustResponse || "Avg Response: 2 Hours"}
                        onChange={(e) => updateSection("quote", "trustResponse", e.target.value)}
                        className={UI.input}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={UI.label}>Success Toast Notification</label>
                    <input
                      type="text"
                      value={data.quote?.formSuccessToast || "Thank you! Your inquiry has been sent. We will reply within 24 hours."}
                      onChange={(e) => updateSection("quote", "formSuccessToast", e.target.value)}
                      className={UI.input}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Form Service Categories Dropdown Options</h3>
                <div className="space-y-3">
                  {(data.quote?.services || []).map((s: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={typeof s === 'string' ? s : (s.label || s.title || "")}
                        onChange={(e) => {
                          const newServices = [...(data.quote?.services || [])];
                          newServices[i] = { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                          updateSection("quote", "services", newServices);
                        }}
                        className={UI.input}
                        placeholder="Service Category Name"
                      />
                      <button
                        onClick={() => {
                          const newServices = data.quote.services.filter((_: any, idx: number) => idx !== i);
                          updateSection("quote", "services", newServices);
                        }}
                        className="text-[#d63638] hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.quote?.services || [];
                      updateSection("quote", "services", [...current, { label: "New Therapy Category", value: "new-category" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add Dropdown Option
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>3. Homepage FAQ Accordion</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>FAQ Badge</label>
                      <input
                        type="text"
                        value={data.faq?.section?.badge || "FAQ"}
                        onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), badge: e.target.value })}
                        className={UI.input}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>FAQ Section Title</label>
                      <input
                        type="text"
                        value={data.faq?.section?.headline || data.faq?.section?.title || "Frequently Asked Questions"}
                        onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), headline: e.target.value, title: e.target.value })}
                        className={UI.input + " font-bold"}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {(data.faq?.items || []).map((faq: any, i: number) => (
                    <div key={i} className={UI.card + " space-y-3 relative"}>
                      <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                        <span className="text-[10px] font-bold text-[#646970] uppercase">Question #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newFaqs = data.faq.items.filter((_: any, idx: number) => idx !== i);
                            updateSection("faq", "items", newFaqs);
                          }}
                          className="text-[#d63638] hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Question</label>
                        <input
                          type="text"
                          value={faq.question || faq.q || ""}
                          onChange={(e) => {
                            const newFaqs = [...data.faq.items];
                            newFaqs[i] = { ...newFaqs[i], question: e.target.value, q: e.target.value };
                            updateSection("faq", "items", newFaqs);
                          }}
                          className={UI.input + " font-bold"}
                          placeholder="e.g. What should I wear to my first session?"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Answer</label>
                        <textarea
                          value={faq.answer || faq.a || ""}
                          onChange={(e) => {
                            const newFaqs = [...data.faq.items];
                            newFaqs[i] = { ...newFaqs[i], answer: e.target.value, a: e.target.value };
                            updateSection("faq", "items", newFaqs);
                          }}
                          className={UI.input + " h-24"}
                          placeholder="Wear comfortable athletic clothing..."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const current = data.faq?.items || [];
                      updateSection("faq", "items", [...current, { question: "", answer: "" }]);
                    }}
                    className={UI.buttonAdd}
                  >
                    + Add FAQ Item
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              9. BLOG INSIGHTS SECTION
          ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "blog" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className={UI.sectionHeader}>1. Section Intro & Headlines</h3>
                <div className={UI.card + " space-y-4"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Badge / Subtitle</label>
                      <input
                        type="text"
                        value={data.blogSection?.subtitle || ""}
                        onChange={(e) => updateSection("blogSection", "subtitle", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. FROM THE BLOG"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Title</label>
                      <input
                        type="text"
                        value={data.blogSection?.title || ""}
                        onChange={(e) => updateSection("blogSection", "title", e.target.value)}
                        className={UI.input + " font-bold"}
                        placeholder="e.g. Insights & Recovery Tips"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>"View All" Button Text</label>
                      <input
                        type="text"
                        value={data.blogSection?.ctaAll || ""}
                        onChange={(e) => updateSection("blogSection", "ctaAll", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. View All Articles"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>"Read More" Link Text</label>
                      <input
                        type="text"
                        value={data.blogSection?.ctaReadMore || ""}
                        onChange={(e) => updateSection("blogSection", "ctaReadMore", e.target.value)}
                        className={UI.input}
                        placeholder="e.g. Read Article"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Description Narrative (Optional)</label>
                    <textarea
                      value={data.blogSection?.description || ""}
                      onChange={(e) => updateSection("blogSection", "description", e.target.value)}
                      className={UI.input + " h-20"}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                <h3 className={UI.sectionHeader}>2. Featured Blog Posts Selection</h3>
                <BlogSelector
                  selectedIds={data.blogSection?.selectedPosts || []}
                  onChange={(ids) => updateSection("blogSection", "selectedPosts", ids)}
                />
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
