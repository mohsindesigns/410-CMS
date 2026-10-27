"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Type, Quote, ExternalLink, Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});
import { UI } from "./styles";

/**
 * Editor for the public "Reviews" page.
 *
 * The reviews themselves (names, text, stars, dates, order) and the rating / total shown on the page live in ONE place:
 * Admin > Reviews. This page only stores presentation: heading, intro, buttons, summary wording and which reviews to
 * show (default: all, so new reviews appear automatically).
 */
export default function ReviewsEditor({ data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        testimonials: {
          section: { badge: "CLIENT REVIEWS", headline: "What Our Clients Say", description: "<p>Real stories from real clients about their experience with 410 Muscle Therapy.</p>" },
        }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const section = data.testimonials?.section || {};

  // Page-level settings only. Never writes review entries into this page (they are read from the master list).
  const updateSection = (field: string, value: any) => {
    setData({
      ...data,
      testimonials: {
        ...(data.testimonials || {}),
        section: { ...section, [field]: value },
      },
    });
  };
  const updateSelected = (ids: any[]) => {
    setData({ ...data, testimonials: { ...(data.testimonials || {}), selected: ids } });
  };

  const tabs = [
    { id: "header", label: "Header, Buttons & Summary", icon: Type, title: "Page Header, Buttons & Rating Box" },
    { id: "items", label: "Which Reviews To Show", icon: Quote, title: "Review Selection" },
  ];
  const activeTabTitle = tabs.find(t => t.id === activeTab)?.title;
  const summaryVisible = section.showSummary !== false;
  const selectedIds: any[] = Array.isArray(data.testimonials?.selected) ? data.testimonials.selected : [];

  return (
    <div className="bg-white">
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
          <p className="text-[12px] text-[#646970] -mt-2">
            Reviews, their order and the Google rating / total are managed in{" "}
            <Link href="/admin/reviews" className="text-[#2271b1] underline inline-flex items-center gap-1">Admin → Reviews <ExternalLink size={11} /></Link>.
            Changes there appear on this page automatically.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 pb-10"
          >
            {activeTab === "header" && (
              <div className="max-w-3xl space-y-6">
                <div className={UI.card + " space-y-5"}>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Small Label (above the headline)</label>
                    <input type="text" value={section.badge || ""} onChange={(e) => updateSection("badge", e.target.value)} className={UI.input} placeholder="CLIENT REVIEWS" />
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Main Headline</label>
                    <input type="text" value={section.headline || ""} onChange={(e) => updateSection("headline", e.target.value)} className={UI.inputLarge} placeholder="What Our Clients Say" />
                    <p className="text-[11px] text-[#646970]">The last word is shown in gold italic.</p>
                  </div>
                  <RichTextEditor
                    label="Intro Paragraph"
                    content={section.description || ""}
                    onChange={(html) => updateSection("description", html)}
                  />
                </div>

                <div className={UI.card + " space-y-5"}>
                  <h3 className="text-[13px] font-bold text-[#1d2327]">Header Buttons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Button Text</label>
                      <input type="text" value={section.ctaPrimaryText || ""} onChange={(e) => updateSection("ctaPrimaryText", e.target.value)} className={UI.input} placeholder="Leave a Google Review" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Primary Button Link</label>
                      <input type="text" value={section.ctaPrimaryUrl || ""} onChange={(e) => updateSection("ctaPrimaryUrl", e.target.value)} className={UI.input} placeholder="Your Google review link (blank = default)" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Text</label>
                      <input type="text" value={section.ctaSecondaryText || ""} onChange={(e) => updateSection("ctaSecondaryText", e.target.value)} className={UI.input} placeholder="Book Appointment" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI.label}>Secondary Button Link</label>
                      <input type="text" value={section.ctaSecondaryUrl || ""} onChange={(e) => updateSection("ctaSecondaryUrl", e.target.value)} className={UI.input} placeholder="Blank = your booking link" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#646970]">Leave a text field empty to use the default shown in grey.</p>
                </div>

                <div className={UI.card + " space-y-5"}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[13px] font-bold text-[#1d2327] flex items-center gap-2">
                        {summaryVisible ? <Eye size={15} className="text-[#00a32a]" /> : <EyeOff size={15} className="text-[#d63638]" />}
                        Rating Box (the big "5.0" card)
                      </h3>
                      <p className="text-[11px] text-[#646970] mt-1">The rating, total and label come from Admin → Reviews → Summary.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSection("showSummary", !summaryVisible)}
                      className={`px-4 py-2 rounded-[3px] text-[13px] font-semibold border transition-colors ${summaryVisible ? "border-[#d63638] text-[#d63638] hover:bg-[#fcf0f1]" : "border-[#2271b1] bg-[#2271b1] text-white hover:bg-[#135e96]"}`}
                    >
                      {summaryVisible ? "Hide rating box" : "Show rating box"}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Sentence Under The Rating</label>
                    <textarea
                      value={section.summaryText || ""}
                      onChange={(e) => updateSection("summaryText", e.target.value)}
                      className={UI.textarea + " h-20"}
                      placeholder="Based on {count} verified Google reviews from clients across Timonium, Towson, Lutherville and Cockeysville."
                    />
                    <p className="text-[11px] text-[#646970]">Use <code>{"{count}"}</code> for the total number of reviews and <code>{"{rating}"}</code> for the average.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className={UI.label}>Text When There Are No Reviews</label>
                    <input type="text" value={section.emptyText || ""} onChange={(e) => updateSection("emptyText", e.target.value)} className={UI.input} placeholder="Reviews are coming soon." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div className="space-y-6">
                <div className={UI.card + " !mb-0 flex flex-wrap items-center justify-between gap-4"}>
                  <div>
                    <p className="text-[14px] font-bold text-[#1d2327]">
                      {selectedIds.length === 0 ? "Showing ALL reviews (recommended)" : `Showing ${selectedIds.length} selected review${selectedIds.length === 1 ? "" : "s"} only`}
                    </p>
                    <p className="text-[12px] text-[#646970] mt-1">
                      With nothing selected, every review in Admin → Reviews appears here and new ones are added automatically. Select reviews below only if you want to limit and re-order this page.
                    </p>
                  </div>
                  {selectedIds.length > 0 && (
                    <button type="button" onClick={() => updateSelected([])} className="px-4 py-2 rounded-[3px] text-[13px] font-semibold border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fb]">
                      Show all reviews again
                    </button>
                  )}
                </div>
                <ContentSelector
                  type="reviews"
                  label="Limit to specific reviews (optional)"
                  valueMode="ids"
                  selectedItems={selectedIds}
                  onSelect={(ids) => updateSelected(ids)}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
