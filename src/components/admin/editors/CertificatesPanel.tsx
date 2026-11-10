"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { UI } from "./styles";
import ImageField from "@/components/admin/ImageField";
import { DEFAULT_CERTIFICATES, MAX_CERTIFICATES, type CertificateItem } from "@/lib/certificates";

type UpdateSection = (section: string, field: string | null, value: any) => void;

const newId = () => `cert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Admin > Pages > Home > "Certificates": the continuing-education certificates shown on the home page. */
export default function CertificatesPanel({ data, updateSection }: { data: any; updateSection: UpdateSection }) {
  const stored = data?.certificates && typeof data.certificates === "object" ? data.certificates : null;
  const block = {
    ...DEFAULT_CERTIFICATES,
    ...(stored || {}),
    items: Array.isArray(stored?.items) ? (stored.items as CertificateItem[]) : DEFAULT_CERTIFICATES.items,
  };
  const save = (patch: Record<string, any>) => updateSection("certificates", null, { ...block, ...patch });
  const setItem = (i: number, patch: Partial<CertificateItem>) =>
    save({ items: block.items.map((it: CertificateItem, idx: number) => (idx === i ? { ...it, ...patch } : it)) });
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= block.items.length) return;
    const items = [...block.items];
    [items[i], items[j]] = [items[j], items[i]];
    save({ items });
  };

  return (
    <div className="space-y-8">
      <div className={UI.card}>
        <h3 className={UI.sectionHeader}>Certificates section</h3>
        <p className="text-[12px] text-[#646970] -mt-3">
          Shown on the home page between the specialist profile and the clinical process. Visitors can click a certificate to see it full size.
          Only add certificates you hold, and only describe what is printed on them.
        </p>

        <label className="flex items-center gap-2 text-[13px] font-semibold cursor-pointer">
          <input type="checkbox" checked={block.enabled !== false} onChange={(e) => save({ enabled: e.target.checked })} />
          <span>Show this section on the home page</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={UI.label}>Small label</label>
            <input className={UI.input} value={block.label || ""} onChange={(e) => save({ label: e.target.value })} placeholder="Continuing Education" />
          </div>
          <div>
            <label className={UI.label}>Title line 1</label>
            <input className={UI.input} value={block.title1 || ""} onChange={(e) => save({ title1: e.target.value })} placeholder="Ongoing Training," />
          </div>
          <div>
            <label className={UI.label}>Title line 2 (gold)</label>
            <input className={UI.input} value={block.title2 || ""} onChange={(e) => save({ title2: e.target.value })} placeholder="Behind Your Care." />
          </div>
        </div>
        <div>
          <label className={UI.label}>Short text under the title</label>
          <textarea className={UI.textarea} rows={2} value={block.description || ""} onChange={(e) => save({ description: e.target.value })} />
        </div>

        <div className="border-t border-[#dcdcde] pt-4 space-y-3">
          <p className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Button and image wording (screen readers, full-size view)</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div><label className={UI.label}>Open</label><input className={UI.input} value={block.viewLabel || ""} onChange={(e) => save({ viewLabel: e.target.value })} /></div>
            <div><label className={UI.label}>Close</label><input className={UI.input} value={block.closeLabel || ""} onChange={(e) => save({ closeLabel: e.target.value })} /></div>
            <div><label className={UI.label}>Previous</label><input className={UI.input} value={block.prevLabel || ""} onChange={(e) => save({ prevLabel: e.target.value })} /></div>
            <div><label className={UI.label}>Next</label><input className={UI.input} value={block.nextLabel || ""} onChange={(e) => save({ nextLabel: e.target.value })} /></div>
            <div><label className={UI.label}>Image description start</label><input className={UI.input} value={block.altPrefix || ""} onChange={(e) => save({ altPrefix: e.target.value })} /></div>
          </div>
        </div>
      </div>

      <div className={UI.card}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className={UI.sectionHeader + " mb-0 border-0 pb-0"}>Certificates ({block.items.length})</h3>
          <button
            type="button"
            onClick={() => { if (confirm("Replace the list with the original four certificates?")) save({ items: DEFAULT_CERTIFICATES.items }); }}
            className="flex items-center gap-1.5 text-[12px] text-[#2271b1] hover:underline"
          >
            <RotateCcw size={13} /> Restore the original four
          </button>
        </div>

        {block.items.map((it: CertificateItem, i: number) => (
          <div key={it.id || i} className="border border-[#c3c4c7] bg-[#f6f7f7] p-4 space-y-4 rounded-[3px]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Certificate {i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-[#50575e] hover:text-[#2271b1] disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === block.items.length - 1} className="p-1.5 text-[#50575e] hover:text-[#2271b1] disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
                <button
                  type="button"
                  onClick={() => { if (confirm("Remove this certificate?")) save({ items: block.items.filter((_: any, idx: number) => idx !== i) }); }}
                  className="p-1.5 text-[#d63638] hover:bg-white rounded"
                  aria-label="Remove"
                ><Trash2 size={15} /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
              <ImageField
                label="Certificate image"
                value={it.image || ""}
                onChange={(url) => setItem(i, { id: it.id || newId(), image: url })}
                altValue={it.alt || ""}
                onAltChange={(alt) => setItem(i, { alt })}
              />
              <div className="space-y-3">
                <div>
                  <label className={UI.label}>Course / certificate title</label>
                  <input className={UI.input} value={it.title || ""} onChange={(e) => setItem(i, { title: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={UI.label}>Issued by</label>
                    <input className={UI.input} value={it.issuer || ""} onChange={(e) => setItem(i, { issuer: e.target.value })} />
                  </div>
                  <div>
                    <label className={UI.label}>Completion date (leave empty if none)</label>
                    <input className={UI.input} value={it.date || ""} onChange={(e) => setItem(i, { date: e.target.value })} placeholder="e.g. October 13, 2026" />
                  </div>
                </div>
                <div>
                  <label className={UI.label}>Short detail</label>
                  <input className={UI.input} value={it.detail || ""} onChange={(e) => setItem(i, { detail: e.target.value })} placeholder="e.g. 66-minute webinar and quiz" />
                </div>
                <div>
                  <label className={UI.label}>Image description (for screen readers and search)</label>
                  <input className={UI.input} value={it.alt || ""} onChange={(e) => setItem(i, { alt: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {block.items.length < MAX_CERTIFICATES && (
          <button
            type="button"
            className={UI.buttonAdd}
            onClick={() => save({ items: [...block.items, { id: newId(), image: "", title: "", issuer: "", date: "", detail: "", alt: "" }] })}
          >
            <Plus size={13} className="inline -mt-0.5 mr-1" /> Add certificate
          </button>
        )}
        <p className="text-[12px] text-[#646970]">Certificates without an image are not shown on the website. Remove them all and save to hide the section.</p>
      </div>
    </div>
  );
}
