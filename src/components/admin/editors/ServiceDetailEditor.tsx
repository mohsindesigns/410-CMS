"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Type, Image as ImageIcon, 
  Plus, Trash2, Mail, List, Heart, CircleHelp, 
  Check, Target, Award, Shield, ArrowRight, 
  Settings, Info, Box, TrendingUp, X
} from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
import ImageField from "@/components/admin/ImageField";
import { UI } from "./styles";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

const DEFAULT_SERVICE_DETAIL = {
  // 1. Hero
  title: "New Service",
  backLink: "Back to All Services",
  heroSectionLabel: "CLINICAL RECOVERY PROTOCOL",
  heroDescription: "Targeted manual therapy engineered to eliminate chronic pain, unlock joint mobility, and accelerate athletic recovery.",
  specDurationValue: "60 / 90 Mins",
  specIntensityValue: "Targeted Deep",
  specFocusValue: "Trigger Mapping",
  bookingCta: "Book Appointment Now",
  bookingCtaUrl: "",
  heroCtaSecondary: "SEE HOW IT HELPS",
  heroCtaSecondaryUrl: "#overview",
  image: "/images/service-massage.webp",

  // 2. Stats
  statsItem1Val: "8 Yrs",
  statsItem1Label: "Clinical Experience",
  statsItem2Val: "5.0 ★",
  statsItem2Label: "Google Reviews",
  statsItem3Val: "100%",
  statsItem3Label: "Satisfaction Guarantee",
  statsItem4Val: "5,000+",
  statsItem4Label: "Sessions Completed",

  // 3. Clinical Overview & Focus Areas
  overviewSectionLabel: "FIX THE PATTERNS THAT KEEP PAIN RETURNING",
  overviewTitle1: "Targeted Bodywork.",
  overviewTitle2: "Engineered For Recovery.",
  overviewWatermark: "SPECIALIST PRACTICE • EST. 2020",
  tailoredLabel: "100% Tailored Therapy",
  tailoredSub: "Individualized Protocols",
  overviewSuccessRate: "5.0 RATED PRACTICE",
  overviewDescription: "We look at mobility, stability, posture, soft-tissue restrictions, and movement habits. Then we pair bodywork with guided exercises that help your body share the load more comfortably.",
  overviewCtaText: "BOOK YOUR SESSION NOW",
  overviewCtaUrl: "",
  overviewHipaaText: "100% Satisfaction Guaranteed & Certified",
  benefits: [
    {
      title: "Recurring Low Back Tightness",
      description: "When the hips stay stiff, the lower back may do more work than you want. We use mobility drills, breathing techniques, and controlled movement exercises."
    },
    {
      title: "Hips That Feel Stuck",
      description: "Limited hip range of motion can change how you walk or squat. We use soft-tissue work, mobility exercises, and simple control drills."
    },
    {
      title: "Neck And Shoulder Strain",
      description: "Long desk hours or overhead work can overload the neck. We work on upper-back mobility, shoulder-blade control, and tight tissue."
    },
    {
      title: "Posture And Compensation Patterns",
      description: "We look for compensation patterns and practice balance, coordination, and joint control to support daily movement."
    }
  ],

  // 4. Candidates & Why Us
  candidateSectionLabel: "WHY 410 MUSCLE THERAPY FEELS DIFFERENT",
  candidateTitle1: "Targeted Care.",
  candidateTitle2: "Built Around You.",
  candidateDescription: "Movement work shaped around what your body can comfortably do. The goal is useful progress, not a rushed routine or generic adjustment.",
  profileBadgePrefix: "ADVANTAGE",
  candidateSuitability: "CLINICAL STANDARD",
  whoProfiles: [
    {
      label: "Eight Years Of Experience",
      desc: "Eight years of professional experience guide every session. Skilled observation and hands-on work matter when pain has several contributors.",
      suitability: "CERTIFIED CARE"
    },
    {
      label: "Five-Star Reputation",
      desc: "A 5.0 Google rating gives you added confidence before you book. Clients praise our targeted muscle work and lasting relief.",
      suitability: "5.0 ★ RATED"
    },
    {
      label: "Guaranteed Client Satisfaction",
      desc: "Backed by a 100% Customer Satisfaction Guarantee. We explain each technique, invite feedback on pressure, and adjust accordingly.",
      suitability: "100% GUARANTEED"
    },
    {
      label: "York Road Convenience",
      desc: "At 1301 York Rd., Timonium, MD, we serve Towson, Lutherville, Cockeysville, and Baltimore County with dedicated one-on-one care.",
      suitability: "TIMONIUM, MD"
    }
  ],

  // 5. Treatment Protocol (Stepper)
  protocolSectionLabel: "SESSION WORKFLOW PROTOCOL",
  protocolTitle1: "What Your Session",
  protocolTitle2: "Looks Like.",
  protocolDescription: "Your visit follows a clear path: listen, observe, release, practice, and retest so you always know what we are working on and why.",
  protocolPhasePrefix: "STEP",
  protocolDurations: ["15 MIN", "30 MIN", "30 MIN", "15 MIN"],
  sessionSteps: [
    {
      num: "01",
      title: "Talk And Screen",
      desc: "We discuss what hurts and when it shows up. Your movement assessment in Timonium includes standing, walking, reaching, or squatting."
    },
    {
      num: "02",
      title: "Release Restricted Tissue",
      desc: "Hands-on work focuses on tight areas, deep muscle knots, and stuck fascia matched to your comfortable pressure level."
    },
    {
      num: "03",
      title: "Practice Better Patterns",
      desc: "We work on breathing, hip control, shoulder mechanics, balance, or core stability drills connected to daily life."
    },
    {
      num: "04",
      title: "Retest And Plan",
      desc: "We repeat the movement that mattered most, evaluate changes, and provide practical next steps to practice between sessions."
    }
  ],
  protocolBannerBadge: "MOVE BETTER STARTING RIGHT HERE",
  protocolBannerTitlePrefix: "Ready to experience",
  protocolBannerTitleSuffix: "?",
  protocolBannerCta: "BOOK YOUR APPOINTMENT",
  protocolBannerCtaUrl: "",

  // 6. FAQs
  faqBadge: "FAQ",
  faqTitle: "Frequently Asked Questions",
  faqDescription: "Everything you need to know about your session and our clinical approach.",
  faq: []
};

export default function ServiceDetailEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({ ...DEFAULT_SERVICE_DETAIL });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateField = (field: string, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const tabs = [
    { id: "hero", label: "1. Hero Banner", title: "Hero Banner & Specifications" },
    { id: "stats", label: "2. Highlight Stats", title: "Highlight Stats Bar" },
    { id: "overview", label: "3. Clinical Overview", title: "Fix Patterns & Focus Areas" },
    { id: "candidates", label: "4. Why Us & Candidates", title: "Why Choose Us & Target Profiles" },
    { id: "protocol", label: "5. Treatment Protocol", title: "Session Sequence & Steps" },
    { id: "faq", label: "6. FAQs & Support", title: "Service FAQs & Support" },
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  return (
    <div className="bg-white max-w-3xl mx-auto pb-20">
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-8 text-[13px] border-b border-[#f0f0f1] pb-1 sticky top-0 bg-white z-10 pt-2">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold border-b-2 border-[#2271b1]' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-10">
          <h2 className={UI.sectionHeader}>{activeTabTitle}</h2>
          <p className="text-[12px] text-[#646970] -mt-2">Configure content synchronized directly with the frontend layout in order.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="space-y-12"
          >
            {/* 1. HERO BANNER */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={UI.label}>Service Name (Title)</label>
                    <input type="text" value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} className={UI.inputLarge} placeholder="e.g., Corrective Movement Therapy Maryland" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Back Link Text</label>
                      <input type="text" value={data.backLink || ""} onChange={(e) => updateField("backLink", e.target.value)} className={UI.input} placeholder="e.g., Back to All Services" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Hero Category Label</label>
                      <input type="text" value={data.heroSectionLabel || ""} onChange={(e) => updateField("heroSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., CLINICAL RECOVERY PROTOCOL" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={UI.label}>Hero Subtitle / Description (Supports Markdown Links)</label>
                    <textarea 
                      value={data.heroDescription || data.heroSubtitle || data.heroDescriptionSuffix || ""} 
                      onChange={(e) => updateField("heroDescription", e.target.value)} 
                      className={UI.input + " h-24 resize-y"} 
                      placeholder="e.g. Tight hips, aching shoulders, back pain, or sciatica can keep returning. Corrective movement therapy sessions in Maryland at [410 Muscle Therapy](https://410-muscletherapy.com/) look beyond the sore spot..."
                    />
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">Quick Specifications (Specs Strip)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Duration Value</label>
                        <input type="text" value={data.specDurationValue || ""} onChange={(e) => updateField("specDurationValue", e.target.value)} className={UI.input} placeholder="e.g., 60 / 90 Mins" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Intensity Value</label>
                        <input type="text" value={data.specIntensityValue || ""} onChange={(e) => updateField("specIntensityValue", e.target.value)} className={UI.input} placeholder="e.g., Targeted Deep" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Focus Value</label>
                        <input type="text" value={data.specFocusValue || ""} onChange={(e) => updateField("specFocusValue", e.target.value)} className={UI.input} placeholder="e.g., Trigger Mapping" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#f0f0f1] pt-6">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Booking Button Text</label>
                      <input type="text" value={data.bookingCta || ""} onChange={(e) => updateField("bookingCta", e.target.value)} className={UI.input} placeholder="e.g., Book Appointment Now" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Booking URL (Optional)</label>
                      <input type="text" value={data.bookingCtaUrl || ""} onChange={(e) => updateField("bookingCtaUrl", e.target.value)} className={UI.input} placeholder="Defaults to StyleSeat portal" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Text</label>
                      <input type="text" value={data.heroCtaSecondary || ""} onChange={(e) => updateField("heroCtaSecondary", e.target.value)} className={UI.input} placeholder="e.g., SEE HOW IT HELPS" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Link (Anchor/URL)</label>
                      <input type="text" value={data.heroCtaSecondaryUrl || ""} onChange={(e) => updateField("heroCtaSecondaryUrl", e.target.value)} className={UI.input} placeholder="#overview" />
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6">
                    <ImageField 
                      label="Service Featured/Hero Image" 
                      value={data.image || data.overviewImage || ""} 
                      onChange={(url: string) => {
                        setData({
                          ...data,
                          image: url,
                          overviewImage: url
                        });
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. HIGHLIGHT STATS */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                <p className="text-[12px] text-slate-500">Configure the 4 numeric statistics that display in the luxury bar beneath the Hero section.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stat 1 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #1</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem1Val || ""} onChange={(e) => updateField("statsItem1Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 8 Yrs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem1Label || ""} onChange={(e) => updateField("statsItem1Label", e.target.value)} className={UI.input} placeholder="e.g., Clinical Experience" />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #2</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem2Val || ""} onChange={(e) => updateField("statsItem2Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 5.0 ★" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem2Label || ""} onChange={(e) => updateField("statsItem2Label", e.target.value)} className={UI.input} placeholder="e.g., Google Reviews" />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #3</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem3Val || ""} onChange={(e) => updateField("statsItem3Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 100%" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem3Label || ""} onChange={(e) => updateField("statsItem3Label", e.target.value)} className={UI.input} placeholder="e.g., Satisfaction Guarantee" />
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #4</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem4Val || ""} onChange={(e) => updateField("statsItem4Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 5,000+" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem4Label || ""} onChange={(e) => updateField("statsItem4Label", e.target.value)} className={UI.input} placeholder="e.g., Sessions Completed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CLINICAL OVERVIEW & FOCUS AREAS */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={UI.label}>Overview Section Label</label>
                    <input type="text" value={data.overviewSectionLabel || ""} onChange={(e) => updateField("overviewSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., FIX THE PATTERNS THAT KEEP PAIN RETURNING" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview Title Part 1 (Plain Text)</label>
                      <input type="text" value={data.overviewTitle1 || ""} onChange={(e) => updateField("overviewTitle1", e.target.value)} className={UI.input} placeholder="e.g., Fix The Patterns That" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview Title Part 2 (Gold / Italic)</label>
                      <input type="text" value={data.overviewTitle2 || ""} onChange={(e) => updateField("overviewTitle2", e.target.value)} className={UI.input} placeholder="e.g., Keep Pain Returning." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Photo Watermark Tag Text</label>
                      <input type="text" value={data.overviewWatermark || ""} onChange={(e) => updateField("overviewWatermark", e.target.value)} className={UI.input} placeholder="e.g., SPECIALIST PRACTICE • EST. 2020" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Floating Badge Title</label>
                      <input type="text" value={data.tailoredLabel || ""} onChange={(e) => updateField("tailoredLabel", e.target.value)} className={UI.input} placeholder="e.g., 100% Tailored Therapy" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Floating Badge Subtitle</label>
                      <input type="text" value={data.tailoredSub || ""} onChange={(e) => updateField("tailoredSub", e.target.value)} className={UI.input} placeholder="e.g., Individualized Protocols" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Success Rate Badge Text</label>
                      <input type="text" value={data.overviewSuccessRate || ""} onChange={(e) => updateField("overviewSuccessRate", e.target.value)} className={UI.input} placeholder="e.g., 5.0 RATED PRACTICE" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <RichTextEditor 
                      label="Clinical Overview Description / Narrative"
                      content={data.overviewDescription || data.description || ""} 
                      onChange={(html) => updateField("overviewDescription", html)} 
                    />
                  </div>

                  {/* Focus Areas & Benefits */}
                  <div className="border-t border-[#f0f0f1] pt-6 space-y-6">
                    <h3 className="text-sm font-bold text-[#1d2327] uppercase tracking-wider">Targeted Patterns & Focus Areas (Cards)</h3>
                    <div className="space-y-6">
                      {(Array.isArray(data.benefits) ? data.benefits : []).map((b: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4 relative"}>
                          <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                            <span className="text-[10px] font-bold text-[#646970] uppercase">Focus Area #{i+1}</span>
                            <button onClick={() => {
                              const newB = (data.benefits || []).filter((_: any, idx: number) => idx !== i); updateField("benefits", newB);
                            }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className={UI.label}>Focus Area Title</label>
                              <input type="text" value={typeof b === 'string' ? b : (b.title || "")} onChange={(e) => {
                                const newB = [...(data.benefits || [])]; 
                                if (typeof b === 'string') {
                                  newB[i] = { title: e.target.value, description: "" };
                                } else {
                                  newB[i] = { ...newB[i], title: e.target.value };
                                }
                                updateField("benefits", newB);
                              }} className={UI.inputLarge} placeholder="e.g., Recurring Low Back Tightness" />
                            </div>
                            <div className="space-y-1.5">
                              <label className={UI.label}>Description (Supports markdown links)</label>
                              <textarea
                                value={typeof b === 'string' ? "" : (b.description || "")}
                                onChange={(e) => {
                                  const newB = [...(data.benefits || [])]; 
                                  if (typeof b === 'string') {
                                    newB[i] = { title: b, description: e.target.value };
                                  } else {
                                    newB[i] = { ...newB[i], description: e.target.value };
                                  }
                                  updateField("benefits", newB);
                                }}
                                className={UI.input + " h-20"}
                                placeholder="Description with optional markdown links..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateField("benefits", [...(data.benefits || []), { title: "", description: "" }])} className={UI.buttonAdd}>+ Add Focus Area</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#f0f0f1] pt-6">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview CTA Button Text</label>
                      <input type="text" value={data.overviewCtaText || ""} onChange={(e) => updateField("overviewCtaText", e.target.value)} className={UI.input} placeholder="e.g., BOOK YOUR SESSION NOW" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Guarantee / Security Text</label>
                      <input type="text" value={data.overviewHipaaText || ""} onChange={(e) => updateField("overviewHipaaText", e.target.value)} className={UI.input} placeholder="e.g., 100% Satisfaction Guaranteed & Certified" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WHY US & CANDIDATES */}
            {activeTab === "candidates" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Section Label</label>
                      <input type="text" value={data.candidateSectionLabel || ""} onChange={(e) => updateField("candidateSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., WHY 410 MUSCLE THERAPY FEELS DIFFERENT" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Badge Prefix</label>
                      <input type="text" value={data.profileBadgePrefix || ""} onChange={(e) => updateField("profileBadgePrefix", e.target.value)} className={UI.input} placeholder="e.g., ADVANTAGE" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Prefix (Plain)</label>
                      <input type="text" value={data.candidateTitle1 || ""} onChange={(e) => updateField("candidateTitle1", e.target.value)} className={UI.input} placeholder="e.g., Targeted Care." />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Highlight (Gold/Italic)</label>
                      <input type="text" value={data.candidateTitle2 || ""} onChange={(e) => updateField("candidateTitle2", e.target.value)} className={UI.input} placeholder="e.g., Built Around You." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={UI.label}>Section Subtitle / Narrative</label>
                    <textarea
                      value={data.candidateDescription || ""}
                      onChange={(e) => updateField("candidateDescription", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="e.g. At 410 Muscle Therapy, our corrective movement therapy in Maryland is designed for people who want more than a feel-good hour..."
                    />
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-6">
                    <h3 className="text-sm font-bold text-[#1d2327] uppercase tracking-wider">Advantage / Candidate Profile Cards</h3>
                    <div className="space-y-6">
                      {(Array.isArray(data.whoProfiles) ? data.whoProfiles : []).map((p: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4 relative"}>
                          <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                            <span className="text-[10px] font-bold text-[#646970] uppercase">Card #{i+1}</span>
                            <button onClick={() => {
                              const newP = (data.whoProfiles || []).filter((_: any, idx: number) => idx !== i); updateField("whoProfiles", newP);
                            }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className={UI.label}>Card Title</label>
                              <input type="text" value={p.label || ""} onChange={(e) => {
                                const newP = [...(data.whoProfiles || [])]; 
                                newP[i] = { ...newP[i], label: e.target.value }; 
                                updateField("whoProfiles", newP);
                              }} className={UI.inputLarge} placeholder="e.g., Eight Years Of Experience" />
                            </div>
                            <div className="space-y-1">
                              <label className={UI.label}>Card Description (Supports links)</label>
                              <textarea 
                                value={p.desc || ""} 
                                onChange={(e) => {
                                  const newP = [...(data.whoProfiles || [])]; 
                                  newP[i] = { ...newP[i], desc: e.target.value }; 
                                  updateField("whoProfiles", newP);
                                }} 
                                className={UI.input + " h-20"}
                                placeholder="Description..."
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={UI.label}>Card Footer Badge Tag</label>
                              <input type="text" value={p.suitability || ""} onChange={(e) => {
                                const newP = [...(data.whoProfiles || [])]; 
                                newP[i] = { ...newP[i], suitability: e.target.value }; 
                                updateField("whoProfiles", newP);
                              }} className={UI.input} placeholder="e.g., CERTIFIED CARE or 5.0 ★ RATED" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateField("whoProfiles", [...(data.whoProfiles || []), { label: "", desc: "", suitability: "SUITABILITY: OPTIMAL" }])} className={UI.buttonAdd}>+ Add Card</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TREATMENT PROTOCOL */}
            {activeTab === "protocol" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Protocol Section Label</label>
                      <input type="text" value={data.protocolSectionLabel || ""} onChange={(e) => updateField("protocolSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., SESSION WORKFLOW PROTOCOL" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Phase Prefix</label>
                      <input type="text" value={data.protocolPhasePrefix || ""} onChange={(e) => updateField("protocolPhasePrefix", e.target.value)} className={UI.input} placeholder="e.g., STEP" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Prefix (Plain)</label>
                      <input type="text" value={data.protocolTitle1 || ""} onChange={(e) => updateField("protocolTitle1", e.target.value)} className={UI.input} placeholder="e.g., What Your Session" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Highlight (Gold/Italic)</label>
                      <input type="text" value={data.protocolTitle2 || ""} onChange={(e) => updateField("protocolTitle2", e.target.value)} className={UI.input} placeholder="e.g., Looks Like." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={UI.label}>Protocol Intro Description</label>
                    <textarea
                      value={data.protocolDescription || ""}
                      onChange={(e) => updateField("protocolDescription", e.target.value)}
                      className={UI.input + " h-20"}
                      placeholder="e.g. Your visit follows a clear path: listen, observe, release, practice, and retest..."
                    />
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-6">
                    <h3 className="text-sm font-bold text-[#1d2327] uppercase tracking-wider">Treatment Workflow Steps</h3>
                    <div className="space-y-6">
                      {(Array.isArray(data.sessionSteps) ? data.sessionSteps : (data.process || [])).map((p: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4 relative"}>
                          <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-[#2271b1] text-white rounded-full flex items-center justify-center text-[10px] font-bold">{p.num || (i+1)}</div>
                              <span className="text-[10px] font-bold text-[#646970] uppercase">Step / Phase</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={data.protocolDurations?.[i] || "15 MIN"}
                                onChange={(e) => {
                                  const newDur = [...(data.protocolDurations || ["15 MIN", "30 MIN", "30 MIN", "15 MIN"])];
                                  newDur[i] = e.target.value;
                                  updateField("protocolDurations", newDur);
                                }}
                                className="w-24 border border-[#8c8f94] px-2 py-0.5 text-xs text-center font-mono"
                                placeholder="15 MIN"
                              />
                              <button onClick={() => {
                                const newP = (data.sessionSteps || data.process || []).filter((_: any, idx: number) => idx !== i);
                                const newD = (data.protocolDurations || []).filter((_: any, idx: number) => idx !== i);
                                setData({ ...data, sessionSteps: newP, process: newP, protocolDurations: newD });
                              }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className={UI.label}>Phase Title</label>
                              <input type="text" value={p.title || ""} onChange={(e) => {
                                const newP = [...(data.sessionSteps || data.process || [])]; 
                                newP[i] = { ...newP[i], title: e.target.value }; 
                                setData({ ...data, sessionSteps: newP, process: newP });
                              }} className={UI.inputLarge} placeholder="e.g., Talk And Screen" />
                            </div>
                            <div className="space-y-1.5">
                              <label className={UI.label}>Description (Supports links)</label>
                              <textarea
                                value={p.description || p.desc || ""}
                                onChange={(e) => {
                                  const newP = [...(data.sessionSteps || data.process || [])]; 
                                  newP[i] = { ...newP[i], description: e.target.value, desc: e.target.value }; 
                                  setData({ ...data, sessionSteps: newP, process: newP });
                                }}
                                className={UI.input + " h-20"}
                                placeholder="Step description..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => {
                        const nextNum = `0${(data.sessionSteps || data.process || []).length + 1}`;
                        const newP = [...(data.sessionSteps || data.process || []), { num: nextNum, title: "", desc: "" }];
                        const newD = [...(data.protocolDurations || []), "15 MIN"];
                        setData({ ...data, sessionSteps: newP, process: newP, protocolDurations: newD });
                      }} className={UI.buttonAdd}>+ Add Treatment Step</button>
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">Bottom Conversion Banner ("Move Better Starting Right Here")</h4>
                    
                    <div className="space-y-1.5">
                      <label className={UI.label}>Banner Badge Text</label>
                      <input type="text" value={data.protocolBannerBadge || ""} onChange={(e) => updateField("protocolBannerBadge", e.target.value)} className={UI.input} placeholder="e.g., MOVE BETTER STARTING RIGHT HERE" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Title Prefix</label>
                        <input type="text" value={data.protocolBannerTitlePrefix || ""} onChange={(e) => updateField("protocolBannerTitlePrefix", e.target.value)} className={UI.input} placeholder="e.g., Ready to experience" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Title Suffix</label>
                        <input type="text" value={data.protocolBannerTitleSuffix || ""} onChange={(e) => updateField("protocolBannerTitleSuffix", e.target.value)} className={UI.input} placeholder="e.g., ?" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={UI.label}>Banner Description / Narrative (Supports phone & address)</label>
                      <textarea
                        value={data.protocolBannerDescription || ""}
                        onChange={(e) => updateField("protocolBannerDescription", e.target.value)}
                        className={UI.input + " h-16"}
                        placeholder="e.g. Call 443-473-2322 or book your session at 1301 York Rd., 8th Floor, Suite 48, Timonium, MD, today and start moving with more confidence."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner CTA Button Text</label>
                        <input type="text" value={data.protocolBannerCta || ""} onChange={(e) => updateField("protocolBannerCta", e.target.value)} className={UI.input} placeholder="e.g., BOOK YOUR APPOINTMENT" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner CTA Link URL (Optional)</label>
                        <input type="text" value={data.protocolBannerCtaUrl || ""} onChange={(e) => updateField("protocolBannerCtaUrl", e.target.value)} className={UI.input} placeholder="Defaults to booking URL" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. FAQS */}
            {activeTab === "faq" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Custom FAQ Badge</label>
                      <input type="text" value={data.faqBadge || ""} onChange={(e) => updateField("faqBadge", e.target.value)} className={UI.input} placeholder="e.g., FAQ" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Custom FAQ Section Title</label>
                      <input type="text" value={data.faqTitle || ""} onChange={(e) => updateField("faqTitle", e.target.value)} className={UI.input} placeholder="e.g., Frequently Asked Questions" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Custom FAQ Description</label>
                      <input type="text" value={data.faqDescription || ""} onChange={(e) => updateField("faqDescription", e.target.value)} className={UI.input} placeholder="e.g., Answers to common questions..." />
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6">
                    <ContentSelector 
                      type="faq" 
                      label="Select FAQs from Global Library (Or custom questions)" 
                      selectedItems={(() => {
                        if (Array.isArray(data.faq)) return data.faq;
                        if (Array.isArray(data.faq?.questions)) return data.faq.questions;
                        return [];
                      })()} 
                      onSelect={(items) => updateField("faq", items)} 
                    />
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
