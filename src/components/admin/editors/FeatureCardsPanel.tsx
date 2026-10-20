"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, RotateCcw, Eye, EyeOff, X } from "lucide-react";
import { UI } from "./styles";
import { FEATURE_ICONS, FEATURE_ICON_NAMES } from "@/lib/featureCardIcons";
import {
  DEFAULT_FEATURE_CARDS,
  MAX_FEATURE_CARDS,
  type FeatureCardItem,
  type FeatureCardsContent,
} from "@/lib/featureCards";

type UpdateSection = (section: string, field: string | null, value: any) => void;

/** Small popover grid to pick one of the curated icons. */
function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const Current = FEATURE_ICONS[value] || FEATURE_ICONS.Sparkles;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px] border border-[#c3c4c7] bg-[#1d2327] text-[#f3e38c] hover:border-[#2271b1] transition-colors"
        title={`Icon: ${value || "Sparkles"} (click to change)`}
      >
        <Current size={22} strokeWidth={1.7} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-[58px] z-50 w-[290px] rounded-[6px] border border-[#c3c4c7] bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#50575e]">Choose icon</span>
              <button type="button" onClick={() => setOpen(false)} className="text-[#787c82] hover:text-[#d63638]">
                <X size={14} />
              </button>
            </div>
            <div className="grid max-h-[220px] grid-cols-6 gap-1 overflow-y-auto">
              {FEATURE_ICON_NAMES.map((name) => {
                const Icon = FEATURE_ICONS[name];
                const active = name === value;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-[4px] transition-colors ${
                      active ? "bg-[#2271b1] text-white" : "text-[#50575e] hover:bg-[#f0f0f1]"
                    }`}
                  >
                    <Icon size={17} />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function FeatureCardsPanel({ data, updateSection }: { data: any; updateSection: UpdateSection }) {
  const fc: FeatureCardsContent | undefined = data?.featureCards;

  // First visit: load the starter content so there is something to edit (nothing is public until saved).
  useEffect(() => {
    if (!fc) updateSection("featureCards", null, DEFAULT_FEATURE_CARDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fc]);

  if (!fc) return null;

  const items: FeatureCardItem[] = Array.isArray(fc.items) ? fc.items : [];
  const set = (field: keyof FeatureCardsContent, value: any) => updateSection("featureCards", field as string, value);
  const setItems = (next: FeatureCardItem[]) => set("items", next);
  const patchItem = (i: number, patch: Partial<FeatureCardItem>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  const enabled = fc.enabled !== false;

  return (
    <div className="space-y-8">
      {/* ── Visibility ── */}
      <div className="space-y-4">
        <h3 className={UI.sectionHeader}>1. Section Visibility</h3>
        <div className={UI.card + " flex flex-wrap items-center justify-between gap-4"}>
          <div>
            <p className="text-[14px] font-bold text-[#1d2327] flex items-center gap-2">
              {enabled ? <Eye size={16} className="text-[#00a32a]" /> : <EyeOff size={16} className="text-[#d63638]" />}
              {enabled ? "Visible on the home page" : "Hidden from the home page"}
            </p>
            <p className="text-[12px] text-[#646970] mt-1">
              Shows between <strong>Services</strong> and the <strong>Specialist Profile</strong>. Remember to press Update/Save to publish changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => set("enabled", !enabled)}
            className={`px-4 py-2 rounded-[3px] text-[13px] font-semibold border transition-colors ${
              enabled
                ? "border-[#d63638] text-[#d63638] hover:bg-[#fcf0f1]"
                : "border-[#2271b1] bg-[#2271b1] text-white hover:bg-[#135e96]"
            }`}
          >
            {enabled ? "Hide section" : "Show section"}
          </button>
        </div>
      </div>

      {/* ── Heading ── */}
      <div className="space-y-4">
        <h3 className={UI.sectionHeader}>2. Section Heading</h3>
        <div className={UI.card + " space-y-4"}>
          <div className="space-y-1.5">
            <label className={UI.label}>Small Label / Badge</label>
            <input
              type="text"
              value={fc.label || ""}
              onChange={(e) => set("label", e.target.value)}
              className={UI.input}
              placeholder="e.g. WHY 410 MUSCLE THERAPY"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className={UI.label}>Headline Line 1</label>
              <input
                type="text"
                value={fc.titleLine1 || ""}
                onChange={(e) => set("titleLine1", e.target.value)}
                className={UI.input + " font-bold"}
                placeholder="e.g. Care That Goes"
              />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Headline Line 2</label>
              <input
                type="text"
                value={fc.titleLine2 || ""}
                onChange={(e) => set("titleLine2", e.target.value)}
                className={UI.input + " font-bold"}
                placeholder="e.g. Beyond The"
              />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Accent Words (Gold Italic)</label>
              <input
                type="text"
                value={fc.titleItalicWord || ""}
                onChange={(e) => set("titleItalicWord", e.target.value)}
                className={UI.input + " font-serif italic"}
                placeholder="e.g. Massage Table."
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={UI.label}>Intro Paragraph</label>
            <textarea
              value={fc.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className={UI.textarea + " h-24"}
              placeholder="A short sentence or two that introduces the cards…"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#f0f0f1]">
            <div className="space-y-1.5">
              <label className={UI.label}>Optional Button Text</label>
              <input
                type="text"
                value={fc.ctaText || ""}
                onChange={(e) => set("ctaText", e.target.value)}
                className={UI.input}
                placeholder="e.g. BOOK YOUR SESSION"
              />
            </div>
            <div className="space-y-1.5">
              <label className={UI.label}>Button Link</label>
              <input
                type="text"
                value={fc.ctaUrl || ""}
                onChange={(e) => set("ctaUrl", e.target.value)}
                className={UI.input}
                placeholder="https://… or /services/ (button shows only when both are filled)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className={UI.sectionHeader + " mb-0 border-b-0 pb-0"}>3. Cards ({items.length}/{MAX_FEATURE_CARDS})</h3>
          <button
            type="button"
            onClick={() => {
              if (confirm("Replace all cards and the heading with the starter content? Your current text will be lost.")) {
                updateSection("featureCards", null, DEFAULT_FEATURE_CARDS);
              }
            }}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#646970] hover:text-[#d63638]"
          >
            <RotateCcw size={13} /> Reset to starter content
          </button>
        </div>
        <p className="text-[12px] text-[#646970] -mt-2 pb-2 border-b border-[#dcdcde]">
          Designed for <strong>6 cards</strong> (a clean 3 × 2 grid). 4 cards make a 2 × 2 grid and other counts wrap naturally. Delete every card to hide the section.
        </p>

        <div className="space-y-5">
          {items.map((card, i) => (
            <div key={i} className="rounded-[4px] border border-[#c3c4c7] bg-[#f6f7f7] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dcdcde] pb-3">
                <span className="text-[11px] font-mono font-bold text-[#2271b1]">CARD {String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up"
                    className="p-1.5 rounded text-[#50575e] hover:bg-white disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down"
                    className="p-1.5 rounded text-[#50575e] hover:bg-white disabled:opacity-30"><ArrowDown size={14} /></button>
                  <button type="button" disabled={items.length >= MAX_FEATURE_CARDS} title="Duplicate"
                    onClick={() => setItems([...items.slice(0, i + 1), { ...card }, ...items.slice(i + 1)])}
                    className="p-1.5 rounded text-[#50575e] hover:bg-white disabled:opacity-30"><Copy size={14} /></button>
                  <button type="button" title="Delete card"
                    onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                    className="p-1.5 rounded text-[#d63638] hover:bg-white"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="space-y-1.5">
                  <label className={UI.label}>Icon</label>
                  <IconPicker value={card.icon} onChange={(name) => patchItem(i, { icon: name })} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className={UI.label}>Card Title</label>
                  <input
                    type="text"
                    value={card.title || ""}
                    onChange={(e) => patchItem(i, { title: e.target.value })}
                    className={UI.input + " font-bold"}
                    placeholder="e.g. Eight Years Of Experience"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={UI.label}>Card Description</label>
                <textarea
                  value={card.description || ""}
                  onChange={(e) => patchItem(i, { description: e.target.value })}
                  className={UI.textarea + " h-20"}
                  placeholder="Two short sentences work best."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className={UI.label}>Tag (optional)</label>
                  <input
                    type="text"
                    value={card.tag || ""}
                    onChange={(e) => patchItem(i, { tag: e.target.value })}
                    className={UI.input}
                    placeholder="e.g. 5.0 ★ RATED"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={UI.label}>Link Text (optional)</label>
                  <input
                    type="text"
                    value={card.linkText || ""}
                    onChange={(e) => patchItem(i, { linkText: e.target.value })}
                    className={UI.input}
                    placeholder="e.g. Learn more"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={UI.label}>Link URL (optional)</label>
                  <input
                    type="text"
                    value={card.linkUrl || ""}
                    onChange={(e) => patchItem(i, { linkUrl: e.target.value })}
                    className={UI.input}
                    placeholder="/services/ or https://…"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={items.length >= MAX_FEATURE_CARDS}
          onClick={() => setItems([...items, { icon: "Sparkles", title: "", description: "", tag: "" }])}
          className={UI.buttonAdd + " flex items-center justify-center gap-2 disabled:opacity-40"}
        >
          <Plus size={14} /> Add card
        </button>
      </div>
    </div>
  );
}
