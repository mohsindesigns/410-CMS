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

export default function ServiceDetailEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
       setData({
         title: "New Service",
         description: "",
         image: "/images/service-massage.webp",
         overviewImage: "/images/service-massage.webp",
         backLink: "Back to All Services",
         heroSectionLabel: "CLINICAL RECOVERY PROTOCOL",
         heroDescriptionSuffix: "",
         bookingCta: "Book Appointment Now",
         heroCtaSecondary: "SEE HOW IT HELPS",
         specDurationValue: "60 / 90 Mins",
         specIntensityValue: "Targeted Deep",
         specFocusValue: "Trigger Mapping",
         statsItem1Val: "98%",
         statsItem1Label: "Pain Relief Success",
         statsItem2Val: "5,000+",
         statsItem2Label: "Sessions Completed",
         statsItem3Val: "Est. 2020",
         statsItem3Label: "Clinical Standard",
         statsItem4Val: "100%",
         statsItem4Label: "Targeted Protocols",
         overviewSectionLabel: "WHY THIS THERAPY WORKS",
         overviewTitle1: "Targeted Bodywork.",
         overviewTitle2: "Engineered For Recovery.",
         overviewWatermark: "SPECIALIST PRACTICE • EST. 2020",
         tailoredLabel: "100% Tailored Therapy",
         tailoredSub: "Individualized Protocols",
         overviewSuccessRate: "98% SUCCESS",
         overviewIntroSuffix: "",
         overviewCtaText: "BOOK YOUR SESSION NOW",
         overviewHipaaText: "HIPAA Compliant & Certified",
         candidateSectionLabel: "TARGET CANDIDATES",
         candidateTitle1: "Who Benefits Most.",
         candidateTitle2: "Clinical Indications.",
         profileBadgePrefix: "PROFILE",
         whoProfiles: [
           { label: "Athletes", desc: "Competitive athletes needing accelerated recovery between high-intensity training sessions.", suitability: "SUITABILITY: OPTIMAL" }
         ],
         protocolSectionLabel: "02 / SESSION PROTOCOL",
         protocolTitle1: "3-Phase Clinical",
         protocolTitle2: "Treatment Sequence.",
         protocolPhasePrefix: "PHASE 0",
         protocolDurations: ["15 MIN", "45 MIN", "15 MIN"],
         process: [
           { title: "Postural & Palpation Assessment", description: "We begin with an active range-of-motion test and palpation to pinpoint tight muscle groups." }
         ],
         protocolBannerBadge: "CLINICAL EXCELLENCE",
         protocolBannerTitlePrefix: "Ready to experience",
         protocolBannerTitleSuffix: "?",
         protocolBannerCta: "BOOK YOUR SESSION NOW",
         faqBadge: "FAQ",
         faqTitle: "Frequently Asked Questions",
         faq: []
       });
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
    { id: "overview", label: "3. Clinical Overview", title: "Why This Therapy Works" },
    { id: "candidates", label: "4. Candidates Profile", title: "Target Candidates & Suitability" },
    { id: "protocol", label: "5. Treatment Protocol", title: "Session Sequence & Phases" },
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
           <p className="text-[12px] text-[#646970] -mt-2">Configure the content that aligns directly with the frontend layout.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="space-y-12"
          >
            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={UI.label}>Service Name (Title)</label>
                    <input type="text" value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} className={UI.inputLarge} placeholder="e.g., Sports Massage" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <RichTextEditor 
                      label="Main Service Description"
                      content={data.description || ""} 
                      onChange={(html) => updateField("description", html)} 
                    />
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
                    <label className={UI.label}>Hero Description Suffix / Secondary Paragraph</label>
                    <textarea 
                      value={data.heroDescriptionSuffix || ""} 
                      onChange={(e) => updateField("heroDescriptionSuffix", e.target.value)} 
                      className={UI.input + " h-20 resize-y"} 
                      placeholder="Targeted manual therapy engineered to eliminate chronic pain..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Booking Button Text</label>
                      <input type="text" value={data.bookingCta || ""} onChange={(e) => updateField("bookingCta", e.target.value)} className={UI.input} placeholder="e.g., Book Appointment Now" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Text</label>
                      <input type="text" value={data.heroCtaSecondary || ""} onChange={(e) => updateField("heroCtaSecondary", e.target.value)} className={UI.input} placeholder="e.g., SEE HOW IT HELPS" />
                    </div>
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
                      altValue={data.imageAlt || ""} 
                      onAltChange={(alt: string) => updateField("imageAlt", alt)} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HIGHLIGHT STATS */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                <p className="text-[12px] text-slate-500">Configure the 4 numeric statistics that display in the luxury bar beneath the Hero section.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stat 1 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #1</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem1Val || ""} onChange={(e) => updateField("statsItem1Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 98%" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem1Label || ""} onChange={(e) => updateField("statsItem1Label", e.target.value)} className={UI.input} placeholder="e.g., Pain Relief Success" />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #2</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem2Val || ""} onChange={(e) => updateField("statsItem2Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 5,000+" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem2Label || ""} onChange={(e) => updateField("statsItem2Label", e.target.value)} className={UI.input} placeholder="e.g., Sessions Completed" />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #3</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem3Val || ""} onChange={(e) => updateField("statsItem3Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., Est. 2020" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem3Label || ""} onChange={(e) => updateField("statsItem3Label", e.target.value)} className={UI.input} placeholder="e.g., Clinical Standard" />
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className={UI.card + " space-y-4"}>
                    <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Stat Column #4</h4>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Value</label>
                      <input type="text" value={data.statsItem4Val || ""} onChange={(e) => updateField("statsItem4Val", e.target.value)} className={UI.inputLarge} placeholder="e.g., 100%" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Label</label>
                      <input type="text" value={data.statsItem4Label || ""} onChange={(e) => updateField("statsItem4Label", e.target.value)} className={UI.input} placeholder="e.g., Targeted Protocols" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLINICAL OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview Section Label</label>
                      <input type="text" value={data.overviewSectionLabel || ""} onChange={(e) => updateField("overviewSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., WHY THIS THERAPY WORKS" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Photo Watermark Text</label>
                      <input type="text" value={data.overviewWatermark || ""} onChange={(e) => updateField("overviewWatermark", e.target.value)} className={UI.input} placeholder="e.g., SPECIALIST PRACTICE • EST. 2020" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview Title Part 1 (Plain Text)</label>
                      <input type="text" value={data.overviewTitle1 || ""} onChange={(e) => updateField("overviewTitle1", e.target.value)} className={UI.input} placeholder="e.g., Targeted Bodywork." />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview Title Part 2 (Gold / Italic)</label>
                      <input type="text" value={data.overviewTitle2 || ""} onChange={(e) => updateField("overviewTitle2", e.target.value)} className={UI.input} placeholder="e.g., Engineered For Recovery." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Floating Badge Title</label>
                      <input type="text" value={data.tailoredLabel || ""} onChange={(e) => updateField("tailoredLabel", e.target.value)} className={UI.input} placeholder="e.g., 100% Tailored Therapy" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Floating Badge Subtitle</label>
                      <input type="text" value={data.tailoredSub || ""} onChange={(e) => updateField("tailoredSub", e.target.value)} className={UI.input} placeholder="e.g., Individualized Protocols" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Success Rate Badge Text</label>
                      <input type="text" value={data.overviewSuccessRate || ""} onChange={(e) => updateField("overviewSuccessRate", e.target.value)} className={UI.input} placeholder="e.g., 98% SUCCESS" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Overview CTA Button Text</label>
                      <input type="text" value={data.overviewCtaText || ""} onChange={(e) => updateField("overviewCtaText", e.target.value)} className={UI.input} placeholder="e.g., BOOK YOUR SESSION NOW" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>HIPAA Compliant Text</label>
                      <input type="text" value={data.overviewHipaaText || ""} onChange={(e) => updateField("overviewHipaaText", e.target.value)} className={UI.input} placeholder="e.g., HIPAA Compliant & Certified" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <RichTextEditor 
                      label="Overview Intro Suffix (Narrative Continuation)"
                      content={data.overviewIntroSuffix || ""} 
                      onChange={(html) => updateField("overviewIntroSuffix", html)} 
                    />
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-6">
                    <h3 className="text-sm font-bold text-[#1d2327] uppercase tracking-wider">Key Clinical Benefits (Value Cards)</h3>
                    <div className="space-y-6">
                       {(Array.isArray(data.benefits) ? data.benefits : []).map((b: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-4 relative"}>
                            <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                               <span className="text-[10px] font-bold text-[#646970] uppercase">Benefit Card #{i+1}</span>
                               <button onClick={() => {
                                 const newB = (data.benefits || []).filter((_: any, idx: number) => idx !== i); updateField("benefits", newB);
                               }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                  <label className={UI.label}>Benefit Title / Headline</label>
                                  <input type="text" value={typeof b === 'string' ? b : (b.title || "")} onChange={(e) => {
                                     const newB = [...(data.benefits || [])]; 
                                     if (typeof b === 'string') {
                                       newB[i] = { title: e.target.value, description: "" };
                                     } else {
                                       newB[i] = { ...newB[i], title: e.target.value };
                                     }
                                     updateField("benefits", newB);
                                  }} className={UI.inputLarge} placeholder="e.g., Joint Decompression" />
                               </div>
                               <div className="space-y-1.5">
                                  <RichTextEditor 
                                    label="Detailed Description / Narrative"
                                    content={typeof b === 'string' ? "" : (b.description || "")} 
                                    onChange={(html) => {
                                       const newB = [...(data.benefits || [])]; 
                                       if (typeof b === 'string') {
                                         newB[i] = { title: b, description: html };
                                       } else {
                                         newB[i] = { ...newB[i], description: html };
                                       }
                                       updateField("benefits", newB);
                                    }} 
                                  />
                               </div>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("benefits", [...(data.benefits || []), { title: "", description: "" }])} className={UI.buttonAdd}>+ Add Benefit Card</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TARGET CANDIDATES */}
            {activeTab === "candidates" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Candidates Section Label</label>
                      <input type="text" value={data.candidateSectionLabel || ""} onChange={(e) => updateField("candidateSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., TARGET CANDIDATES" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Profile Badge Prefix</label>
                      <input type="text" value={data.profileBadgePrefix || ""} onChange={(e) => updateField("profileBadgePrefix", e.target.value)} className={UI.input} placeholder="e.g., PROFILE" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Prefix (Plain)</label>
                      <input type="text" value={data.candidateTitle1 || ""} onChange={(e) => updateField("candidateTitle1", e.target.value)} className={UI.input} placeholder="e.g., Who Benefits Most." />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Highlight (Gold/Italic)</label>
                      <input type="text" value={data.candidateTitle2 || ""} onChange={(e) => updateField("candidateTitle2", e.target.value)} className={UI.input} placeholder="e.g., Clinical Indications." />
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-6">
                    <h3 className="text-sm font-bold text-[#1d2327] uppercase tracking-wider">Candidate / Target Profiles</h3>
                    <div className="space-y-6">
                       {(Array.isArray(data.whoProfiles) ? data.whoProfiles : []).map((p: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-4 relative"}>
                            <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                               <span className="text-[10px] font-bold text-[#646970] uppercase">Profile Card #{i+1}</span>
                               <button onClick={() => {
                                 const newP = (data.whoProfiles || []).filter((_: any, idx: number) => idx !== i); updateField("whoProfiles", newP);
                               }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                  <label className={UI.label}>Profile Title</label>
                                  <input type="text" value={p.label || ""} onChange={(e) => {
                                     const newP = [...(data.whoProfiles || [])]; 
                                     newP[i] = { ...newP[i], label: e.target.value }; 
                                     updateField("whoProfiles", newP);
                                  }} className={UI.inputLarge} placeholder="e.g., Competitive Athletes" />
                               </div>
                               <div className="space-y-1.5">
                                  <RichTextEditor 
                                    label="Profile Description"
                                    content={p.desc || ""} 
                                    onChange={(html) => {
                                       const newP = [...(data.whoProfiles || [])]; 
                                       newP[i] = { ...newP[i], desc: html }; 
                                       updateField("whoProfiles", newP);
                                    }} 
                                  />
                               </div>
                               <div className="space-y-1.5">
                                  <label className={UI.label}>Suitability Status</label>
                                  <input type="text" value={p.suitability || ""} onChange={(e) => {
                                     const newP = [...(data.whoProfiles || [])]; 
                                     newP[i] = { ...newP[i], suitability: e.target.value }; 
                                     updateField("whoProfiles", newP);
                                  }} className={UI.input} placeholder="e.g., SUITABILITY: OPTIMAL" />
                               </div>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("whoProfiles", [...(data.whoProfiles || []), { label: "", desc: "", suitability: "SUITABILITY: OPTIMAL" }])} className={UI.buttonAdd}>+ Add Profile Card</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TREATMENT PROTOCOL */}
            {activeTab === "protocol" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Protocol Section Label</label>
                      <input type="text" value={data.protocolSectionLabel || ""} onChange={(e) => updateField("protocolSectionLabel", e.target.value)} className={UI.input} placeholder="e.g., 02 / SESSION PROTOCOL" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Phase Prefix</label>
                      <input type="text" value={data.protocolPhasePrefix || ""} onChange={(e) => updateField("protocolPhasePrefix", e.target.value)} className={UI.input} placeholder="e.g., PHASE 0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Prefix (Plain)</label>
                      <input type="text" value={data.protocolTitle1 || ""} onChange={(e) => updateField("protocolTitle1", e.target.value)} className={UI.input} placeholder="e.g., 3-Phase Clinical" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Highlight (Gold/Italic)</label>
                      <input type="text" value={data.protocolTitle2 || ""} onChange={(e) => updateField("protocolTitle2", e.target.value)} className={UI.input} placeholder="e.g., Treatment Sequence." />
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">Phase Durations (Matches columns left to right)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Phase 1 Duration</label>
                        <input type="text" value={data.protocolDurations?.[0] || ""} onChange={(e) => {
                           const newDur = [...(data.protocolDurations || ["15 MIN", "45 MIN", "15 MIN"])];
                           newDur[0] = e.target.value;
                           updateField("protocolDurations", newDur);
                        }} className={UI.input} placeholder="e.g., 15 MIN" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Phase 2 Duration</label>
                        <input type="text" value={data.protocolDurations?.[1] || ""} onChange={(e) => {
                           const newDur = [...(data.protocolDurations || ["15 MIN", "45 MIN", "15 MIN"])];
                           newDur[1] = e.target.value;
                           updateField("protocolDurations", newDur);
                        }} className={UI.input} placeholder="e.g., 45 MIN" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Phase 3 Duration</label>
                        <input type="text" value={data.protocolDurations?.[2] || ""} onChange={(e) => {
                           const newDur = [...(data.protocolDurations || ["15 MIN", "45 MIN", "15 MIN"])];
                           newDur[2] = e.target.value;
                           updateField("protocolDurations", newDur);
                        }} className={UI.input} placeholder="e.g., 15 MIN" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-6">
                    <h3 className="text-sm font-bold text-[#1d2327] uppercase tracking-wider">Treatment Phases / Session Steps</h3>
                    <div className="space-y-6">
                       {(Array.isArray(data.process) ? data.process : []).map((p: any, i: number) => (
                         <div key={i} className={UI.card + " space-y-4 relative"}>
                            <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-[#2271b1] text-white rounded-full flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                                 <span className="text-[10px] font-bold text-[#646970] uppercase">Step / Phase</span>
                               </div>
                               <button onClick={() => {
                                 const newP = (data.process || []).filter((_: any, idx: number) => idx !== i); updateField("process", newP);
                               }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                  <label className={UI.label}>Phase Title</label>
                                  <input type="text" value={p.title || ""} onChange={(e) => {
                                     const newP = [...(data.process || [])]; 
                                     newP[i] = { ...newP[i], title: e.target.value }; 
                                     updateField("process", newP);
                                  }} className={UI.inputLarge} placeholder="e.g., Postural Assessment" />
                               </div>
                               <div className="space-y-1.5">
                                  <RichTextEditor 
                                    label="Description Details"
                                    content={p.description || p.desc || ""} 
                                    onChange={(html) => {
                                       const newP = [...(data.process || [])]; 
                                       newP[i] = { ...newP[i], description: html, desc: html }; 
                                       updateField("process", newP);
                                    }} 
                                  />
                               </div>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => updateField("process", [...(data.process || []), { title: "", description: "" }])} className={UI.buttonAdd}>+ Add Treatment Step</button>
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">Bottom Conversion Banner</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner Badge Text</label>
                        <input type="text" value={data.protocolBannerBadge || ""} onChange={(e) => updateField("protocolBannerBadge", e.target.value)} className={UI.input} placeholder="e.g., CLINICAL EXCELLENCE" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI.label}>Banner CTA Button Text</label>
                        <input type="text" value={data.protocolBannerCta || ""} onChange={(e) => updateField("protocolBannerCta", e.target.value)} className={UI.input} placeholder="e.g., BOOK YOUR SESSION NOW" />
                      </div>
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
                  </div>
                </div>
              </div>
            )}

            {/* FAQ SECTION */}
            {activeTab === "faq" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Custom FAQ Badge / Category Label</label>
                      <input type="text" value={data.faqBadge || ""} onChange={(e) => updateField("faqBadge", e.target.value)} className={UI.input} placeholder="e.g., FAQ" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Custom FAQ Section Title</label>
                      <input type="text" value={data.faqTitle || ""} onChange={(e) => updateField("faqTitle", e.target.value)} className={UI.input} placeholder="e.g., Frequently Asked Questions" />
                    </div>
                  </div>

                  <div className="border-t border-[#f0f0f1] pt-6">
                     <ContentSelector 
                        type="faq" 
                        label="Knowledge Inventory (Select from Global Library)" 
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
