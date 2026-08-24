"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, LayoutTemplate, Type, Image as ImageIcon,
  ChevronRight, Star, Phone, Plus, Trash2, Mail, Upload,
  List, Heart, CircleHelp, Check, Target, Award, Shield,
  ArrowRight, Zap, Globe, ShieldCheck, Settings, Eye
} from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

import { UI } from "./styles";

export default function ServicesEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        services: {
          badge: "Precision Care & Recovery",
          headline: { prefix: "Therapies", highlight: "Designed", suffix: "Around You" },
          description: "<p>Experience therapeutic bodywork tailored to your performance and recovery goals.</p>",
          image: "/images/hero-bg.webp",
          ctaBook: "BOOK APPOINTMENT",
          ctaExplore: "EXPLORE SERVICES",
          services: []
        },
        whyChooseUs: {
          section: { 
            badge: "WHY CHOOSE US", 
            headline: "Designed for Maximum Performance", 
            description: "<p>We blend clinical orthopedic massage with modern recovery science to get you back to your best self.</p>" 
          },
          features: [
            { title: "Clinical Expertise", description: "<p>Specialized in soft-tissue dysfunction and chronic pain patterns.</p>", icon: "Shield" },
            { title: "Personalized Approach", description: "<p>Every session is custom-tailored to your specific athletic goals.</p>", icon: "Zap" },
            { title: "Recovery Focused", description: "<p>Designed to accelerate muscle repair and restore range of motion.</p>", icon: "Flame" }
          ],
          stats: [
            { value: "500", suffix: "+", label: "Athletes Treated" },
            { value: "5", suffix: "/5", label: "Client Rating" },
            { value: "100", suffix: "%", label: "Satisfaction Guarantee" }
          ]
        },
        ctaBanner: {
          tagline: "Take the First Step",
          title: "Ready to Feel Your Best?",
          description: "Book your appointment today and start your journey to a pain-free, stronger you.",
          button: "BOOK APPOINTMENT"
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

      return {
        ...currentData,
        [section]: field ? {
          ...sectionData,
          [field]: newValue,
        } : newValue,
      };
    });
  };

  const tabs = [
    { id: "hero", label: "Page Introduction (Hero)", icon: Type, title: "Services Hero Section" },
    { id: "catalog", label: "Service Catalog", icon: List, title: "Service Offerings Selector" },
    { id: "whyChooseUs", label: "Why Choose Us (Value Props)", icon: Star, title: "Value Propositions" },
    { id: "cta", label: "CTA Banner", icon: LayoutTemplate, title: "Call-to-Action Banner" },
    { id: "process", label: "How It Works (Clinical Process)", icon: Settings, title: "Clinical Process & Recovery Journey" }
  ];

  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;

  // Safe destructuring of section values with robust fallbacks
  const services = data.services || {};
  const whyChooseUs = data.whyChooseUs || {};
  const ctaBanner = data.ctaBanner || {};
  const processData = data.process || {};

  return (
    <div className="bg-white">
      {/* WP Style Sub-tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-[13px] border-b border-[#f0f0f1] pb-1">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6">
        <div className="mb-6">
           <h2 className={UI.sectionHeader}>{activeTabTitle}</h2>
           <p className="text-[12px] text-[#646970] -mt-2">Configure all dynamic sections visible on the public Services page.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 pb-10"
          >

            {/* HERO SECTION */}
            {activeTab === "hero" && (
              <div className="max-w-3xl space-y-6">
                <div className={UI.card + " space-y-5"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Intro Badge</label>
                    <input type="text" value={services.badge || ""} onChange={(e) => updateSection("services", "badge", e.target.value)} className={UI.input} />
                  </div>
                  
                  <div className="space-y-4">
                    <label className={UI.label}>Main Headline Architect</label>
                    <div className="space-y-2">
                      <input type="text" value={services.headline?.prefix || ""} onChange={(e) => updateSection("services", "headline", { ...(services.headline || {}), prefix: e.target.value })} className={UI.input} placeholder="Prefix Text (e.g. Therapies)" />
                      <input type="text" value={services.headline?.highlight || ""} onChange={(e) => updateSection("services", "headline", { ...(services.headline || {}), highlight: e.target.value })} className={UI.input + " font-bold border-[#2271b1]"} placeholder="Highlighted Text (e.g. Designed)" />
                      <input type="text" value={services.headline?.suffix || ""} onChange={(e) => updateSection("services", "headline", { ...(services.headline || {}), suffix: e.target.value })} className={UI.input} placeholder="Suffix Text (e.g. Around You)" />
                    </div>
                  </div>

                  <RichTextEditor 
                    label="Page Narrative" 
                    content={services.description || ""} 
                    onChange={(html) => updateSection("services", "description", html)} 
                  />

                  <ImageField 
                    label="Hero Background Image"
                    value={services.image || ""}
                    onChange={(url) => updateSection("services", "image", url)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button 1 Label</label>
                      <input type="text" value={services.ctaBook || ""} onChange={(e) => updateSection("services", "ctaBook", e.target.value)} className={UI.input} placeholder="e.g. BOOK APPOINTMENT" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button 1 Link (URL)</label>
                      <input type="text" value={services.ctaBookUrl || ""} onChange={(e) => updateSection("services", "ctaBookUrl", e.target.value)} className={UI.input} placeholder="Defaults to global booking link" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button 2 Label</label>
                      <input type="text" value={services.ctaExplore || ""} onChange={(e) => updateSection("services", "ctaExplore", e.target.value)} className={UI.input} placeholder="e.g. EXPLORE SERVICES" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>CTA Button 2 Link (URL)</label>
                      <input type="text" value={services.ctaExploreUrl || ""} onChange={(e) => updateSection("services", "ctaExploreUrl", e.target.value)} className={UI.input} placeholder="Defaults to #services-list" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATALOG SECTION */}
            {activeTab === "catalog" && (
              <div className="space-y-6">
                 <ContentSelector 
                    type="services" 
                    label="Service Catalog (Select from Managed Inventory)" 
                    selectedItems={services.services || []} 
                    onSelect={(items) => updateSection("services", "services", items)} 
                 />
              </div>
            )}

            {/* WHY CHOOSE US SECTION */}
            {activeTab === "whyChooseUs" && (
              <div className="max-w-3xl space-y-8">
                <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Section Intro</h3>
                  <div className={UI.card + " space-y-4"}>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Badge</label>
                      <input type="text" value={whyChooseUs.section?.badge || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(whyChooseUs.section || {}), badge: e.target.value })} className={UI.input} placeholder="e.g. WHY CHOOSE US" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline</label>
                      <input type="text" value={whyChooseUs.section?.headline || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(whyChooseUs.section || {}), headline: e.target.value })} className={UI.input} placeholder="e.g. Designed for Maximum Performance" />
                    </div>
                    <RichTextEditor
                      label="Intro Description"
                      content={whyChooseUs.section?.description || ""}
                      onChange={(html) => updateSection("whyChooseUs", "section", { ...(whyChooseUs.section || {}), description: html })}
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                  <h3 className={UI.sectionHeader}>2. Features Grid</h3>
                  <div className="space-y-4">
                    {(whyChooseUs.features || []).map((f: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-4 relative"}>
                        <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                          <span className="text-[10px] font-bold text-[#646970] uppercase">Feature #{i + 1}</span>
                          <button onClick={() => {
                            const newFeatures = whyChooseUs.features.filter((_: any, idx: number) => idx !== i);
                            updateSection("whyChooseUs", "features", newFeatures);
                          }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <IconSelector label="Icon" value={f.icon || ""} onChange={(val) => {
                          const newFeatures = [...whyChooseUs.features];
                          newFeatures[i] = { ...newFeatures[i], icon: val };
                          updateSection("whyChooseUs", "features", newFeatures);
                        }} />
                        <div className="space-y-1.5">
                          <label className={UI.label}>Title</label>
                          <input type="text" value={f.title || ""} onChange={(e) => {
                            const newFeatures = [...whyChooseUs.features];
                            newFeatures[i] = { ...newFeatures[i], title: e.target.value };
                            updateSection("whyChooseUs", "features", newFeatures);
                          }} className={UI.input + " font-bold"} placeholder="Title" />
                        </div>
                        <RichTextEditor
                          label="Description"
                          content={f.description || ""}
                          onChange={(html) => {
                            const newFeatures = [...whyChooseUs.features];
                            newFeatures[i] = { ...newFeatures[i], description: html };
                            updateSection("whyChooseUs", "features", newFeatures);
                          }}
                        />
                      </div>
                    ))}
                    <button onClick={() => {
                      const currentFeatures = whyChooseUs.features || [];
                      updateSection("whyChooseUs", "features", [...currentFeatures, { title: "", description: "", icon: "Shield" }]);
                    }} className={UI.buttonAdd}>+ Add Feature</button>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                  <h3 className={UI.sectionHeader}>3. Metrics List</h3>
                  <div className="space-y-4">
                    {(whyChooseUs.stats || []).map((s: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-4"}>
                        <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                          <span className="text-[10px] font-bold text-[#646970] uppercase">Metric #{i + 1}</span>
                          <button onClick={() => {
                            const newStats = whyChooseUs.stats.filter((_: any, idx: number) => idx !== i);
                            updateSection("whyChooseUs", "stats", newStats);
                          }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className={UI.label}>Value</label>
                            <input type="text" value={s.value || ""} onChange={(e) => {
                              const newStats = [...whyChooseUs.stats];
                              newStats[i] = { ...newStats[i], value: e.target.value };
                              updateSection("whyChooseUs", "stats", newStats);
                            }} className={UI.inputLarge} placeholder="e.g. 500" />
                          </div>
                          <div className="space-y-1.5">
                            <label className={UI.label}>Suffix</label>
                            <input type="text" value={s.suffix || ""} onChange={(e) => {
                              const newStats = [...whyChooseUs.stats];
                              newStats[i] = { ...newStats[i], suffix: e.target.value };
                              updateSection("whyChooseUs", "stats", newStats);
                            }} className={UI.input} placeholder="e.g. +, %" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className={UI.label}>Label</label>
                          <input type="text" value={s.label || ""} onChange={(e) => {
                            const newStats = [...whyChooseUs.stats];
                            newStats[i] = { ...newStats[i], label: e.target.value };
                            updateSection("whyChooseUs", "stats", newStats);
                          }} className={UI.input} />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => {
                      const currentStats = whyChooseUs.stats || [];
                      updateSection("whyChooseUs", "stats", [...currentStats, { value: "", suffix: "", label: "" }]);
                    }} className={UI.buttonAdd}>+ Add Metric</button>
                  </div>
                </div>
              </div>
            )}

            {/* CTA BANNER SECTION */}
            {activeTab === "cta" && (
              <div className="max-w-3xl space-y-6">
                <div className={UI.card + " space-y-5"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Tagline</label>
                    <input type="text" value={ctaBanner.tagline || ""} onChange={(e) => updateSection("ctaBanner", "tagline", e.target.value)} className={UI.input} placeholder="e.g. Take the First Step" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Headline Title</label>
                    <input type="text" value={ctaBanner.title || ""} onChange={(e) => updateSection("ctaBanner", "title", e.target.value)} className={UI.inputLarge} placeholder="e.g. Ready to Feel Your Best?" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Description</label>
                    <textarea value={ctaBanner.description || ""} onChange={(e) => updateSection("ctaBanner", "description", e.target.value)} className={UI.input + " h-24"} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Button Text</label>
                    <input type="text" value={ctaBanner.button || ""} onChange={(e) => updateSection("ctaBanner", "button", e.target.value)} className={UI.input} placeholder="e.g. BOOK APPOINTMENT" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Button Link (URL)</label>
                    <input type="text" value={ctaBanner.btnUrl || ""} onChange={(e) => updateSection("ctaBanner", "btnUrl", e.target.value)} className={UI.input} placeholder="Defaults to global booking link" />
                  </div>
                </div>
              </div>
            )}

            {/* HOW IT WORKS / CLINICAL PROCESS SECTION */}
            {activeTab === "process" && (
              <div className="max-w-3xl space-y-8">
                <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Section Intro</h3>
                  <div className={UI.card + " space-y-4"}>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Intro Badge</label>
                      <input type="text" value={processData.label || ""} onChange={(e) => updateSection("process", "label", e.target.value)} className={UI.input} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Headline Title</label>
                      <input type="text" value={processData.title || ""} onChange={(e) => updateSection("process", "title", e.target.value)} className={UI.input} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Description Text</label>
                      <textarea value={processData.description || ""} onChange={(e) => updateSection("process", "description", e.target.value)} className={UI.input + " h-24"} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Step ID Prefix Label (e.g. PHASE or STEP)</label>
                      <input type="text" value={processData.phaseLabel || ""} onChange={(e) => updateSection("process", "phaseLabel", e.target.value)} className={UI.input} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#f0f0f1]">
                  <h3 className={UI.sectionHeader}>2. Process Steps</h3>
                  <div className="space-y-6">
                    {(processData.items || []).map((step: any, i: number) => (
                      <div key={i} className={UI.card + " space-y-4"}>
                        <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                          <span className="text-[10px] font-bold text-[#646970] uppercase">Step #{i + 1} Details</span>
                          <button onClick={() => {
                            const newItems = processData.items.filter((_: any, idx: number) => idx !== i);
                            updateSection("process", "items", newItems);
                          }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className={UI.label}>Step ID (e.g. 01)</label>
                            <input type="text" value={step.id || ""} onChange={(e) => {
                              const newItems = [...processData.items];
                              newItems[i] = { ...newItems[i], id: e.target.value };
                              updateSection("process", "items", newItems);
                            }} className={UI.input} />
                          </div>
                          <div className="space-y-1.5">
                            <label className={UI.label}>Step Title</label>
                            <input type="text" value={step.title || ""} onChange={(e) => {
                              const newItems = [...processData.items];
                              newItems[i] = { ...newItems[i], title: e.target.value };
                              updateSection("process", "items", newItems);
                            }} className={UI.input} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className={UI.label}>Step Narrative</label>
                          <textarea value={step.description || ""} onChange={(e) => {
                            const newItems = [...processData.items];
                            newItems[i] = { ...newItems[i], description: e.target.value };
                            updateSection("process", "items", newItems);
                          }} className={UI.input + " h-20"} />
                        </div>

                        <ImageField
                          label="Step Preview Image"
                          value={step.image || ""}
                          onChange={(url) => {
                            const newItems = [...processData.items];
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
                                const newItems = [...processData.items];
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
                                    const newItems = [...processData.items];
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
                                      const newItems = [...processData.items];
                                      const rawActions = Array.isArray(newItems[i].actions)
                                        ? [...newItems[i].actions]
                                        : (typeof newItems[i].actions === 'string' ? newItems[i].actions.split("\n").filter(Boolean) : []);
                                      rawActions.splice(actIdx + 1, 0, "");
                                      newItems[i] = { ...newItems[i], actions: rawActions };
                                      updateSection("process", "items", newItems);
                                    }
                                  }}
                                  className={UI.input + " text-xs"}
                                  placeholder={`Action Item #${actIdx + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...processData.items];
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
                    <button onClick={() => {
                      const currentItems = processData.items || [];
                      updateSection("process", "items", [...currentItems, { id: `0${currentItems.length + 1}`, title: "", description: "", image: "", actions: [] }]);
                    }} className={UI.buttonAdd}>+ Add Step</button>
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
