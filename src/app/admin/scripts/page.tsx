"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Loader2, CheckCircle2, AlertCircle, X, Save, ChevronDown
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────
interface Script {
  id: string;
  name: string;
  location: "head" | "body_start" | "body_end";
  code: string;
  active: boolean;
  createdAt: string;
}

const LOCATION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  head:       { label: "<head>",      color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  body_start: { label: "<body> top",  color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  body_end:   { label: "<body> end",  color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200" },
};

const EMPTY_FORM = { name: "", location: "head" as Script["location"], code: "", active: true };

// ── Google Tag Manager Quick Setup Modal ─────────────────────────────
function GTMSetupModal({
  onSaveBoth,
  onClose,
  saving,
}: {
  onSaveBoth: (gtmId: string) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [gtmId, setGtmId] = useState("GTM-MCJPHMKX");
  const [error, setError] = useState("");

  const handleSave = () => {
    const cleanId = gtmId.trim().toUpperCase();
    if (!cleanId.startsWith("GTM-") || cleanId.length < 7) {
      setError("Please enter a valid GTM Container ID (e.g., GTM-MCJPHMKX)");
      return;
    }
    setError("");
    onSaveBoth(cleanId);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#00000066]"
      />
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        className="relative w-full max-w-lg bg-white border border-[#c3c4c7] shadow-lg rounded-[3px] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#f6f7f7] border-b border-[#c3c4c7]">
          <h2 className="text-[#1d2327] text-lg font-normal font-serif">Quick Google Tag Manager Setup</h2>
          <button onClick={onClose} className="text-[#787c82] hover:text-[#d63638]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 bg-white text-[13px] text-[#2c3338]">
          <p className="text-[#50575e] leading-relaxed">
            Google Tag Manager requires two scripts to function properly:
            <br />
            <strong>1. Head Script:</strong> Injected in <code className="bg-[#f0f0f1] px-1 py-0.5 rounded text-blue-700">&lt;head&gt;</code> to load GTM.
            <br />
            <strong>2. Noscript Fallback:</strong> Injected in <code className="bg-[#f0f0f1] px-1 py-0.5 rounded text-purple-700">&lt;body&gt; top</code> for noscript visitors.
          </p>

          <div>
            <label className="block text-[#1d2327] text-sm font-semibold mb-1">
              GTM Container ID
            </label>
            <input
              type="text"
              value={gtmId}
              onChange={(e) => { setGtmId(e.target.value); setError(""); }}
              placeholder="GTM-MCJPHMKX"
              className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[14px] text-[#2c3338] rounded-[3px] font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.07)] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none uppercase"
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded text-xs space-y-1">
            <p className="font-semibold">✨ What this will do:</p>
            <p>Automatically create and activate both GTM scripts in their exact required locations without any syntax errors or tag collisions.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[#50575e] hover:text-[#1d2327] text-[13px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !gtmId.trim()}
            className="bg-[#2271b1] text-white text-[13px] px-4 py-1.5 rounded-[3px] border border-[#2271b1] hover:bg-[#135e96] hover:border-[#135e96] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Install Both GTM Scripts
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── WordPress-Style Modal ────────────────────────────────────────────
function ScriptModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Partial<Script>;
  onSave: (data: Partial<Script>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleCodeChange = (val: string) => {
    set("code", val);
    const trimmed = val.trim();

    // Smart auto-detection for Title if empty
    if (!form.name || form.name === EMPTY_FORM.name) {
      if (trimmed.includes('<noscript') && !trimmed.includes('<script')) {
        set("name", "Google Tag Manager (noscript)");
      } else if (trimmed.includes('gtm.js?id=')) {
        set("name", "Google Tag Manager (Head)");
      } else if (trimmed.includes('gtag/js?id=')) {
        set("name", "Google Analytics (GA4)");
      }
    }

    // If user pastes pure noscript and location is head, auto-switch to body_start
    if (trimmed.includes('<noscript') && !trimmed.includes('<script') && form.location === 'head') {
      set("location", "body_start");
    }
  };

  const hasNoscriptInHead = form.code.includes('<noscript') && !form.code.includes('<script') && form.location === 'head';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#00000066]"
      />
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        className="relative w-full max-w-2xl bg-[#f1f1f1] border border-[#c3c4c7] shadow-lg rounded-[3px] overflow-hidden flex flex-col"
      >
        {/* WP-Style Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#c3c4c7]">
          <h2 className="text-[#1d2327] text-lg font-normal font-serif">
            {initial.id ? "Edit Script" : "Add New Script"}
          </h2>
          <button onClick={onClose} className="text-[#787c82] hover:text-[#d63638]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WP-Style Body */}
        <div className="p-4 space-y-4 bg-[#f0f0f1] flex-1 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-[#1d2327] text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Google Tag Manager (Head) or Google Analytics"
              className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[14px] text-[#2c3338] rounded-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.07)] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[#1d2327] text-sm font-semibold mb-1">Insert Location</label>
            <select
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full border border-[#8c8f94] bg-white px-2 py-1.5 text-[14px] text-[#2c3338] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
            >
              <option value="head">Header (&lt;head&gt;) — For GTM Head, Google Analytics, Meta Pixel</option>
              <option value="body_start">Body Start (Top of &lt;body&gt;) — For GTM (noscript)</option>
              <option value="body_end">Footer (End of &lt;body&gt;) — For Chat widgets, custom body JS</option>
            </select>

            {hasNoscriptInHead && (
              <div className="mt-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs px-3 py-2 rounded flex items-center justify-between">
                <span>⚠️ This snippet contains a &lt;noscript&gt; tag. For Google Tag Manager, it should be placed in <strong>Body Start (Top of &lt;body&gt;)</strong>.</span>
                <button
                  type="button"
                  onClick={() => set("location", "body_start")}
                  className="bg-amber-600 text-white text-xs px-2 py-1 rounded font-medium hover:bg-amber-700 ml-2 whitespace-nowrap"
                >
                  Move to Body Start
                </button>
              </div>
            )}
          </div>

          {/* Code */}
          <div>
            <label className="block text-[#1d2327] text-sm font-semibold mb-1">Code Snippet</label>
            <textarea
              value={form.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="<!-- Paste HTML / <script> / <noscript> code here -->"
              rows={8}
              className="w-full border border-[#8c8f94] bg-[#f0f0f1] font-mono px-3 py-2 text-[13px] text-[#2c3338] rounded-[3px] focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
            />
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="active-checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="w-4 h-4 text-[#2271b1] border-[#8c8f94] rounded-[3px] focus:ring-[#2271b1]"
            />
            <label htmlFor="active-checkbox" className="text-[#1d2327] text-sm cursor-pointer">
              Active (Inject this snippet into the site)
            </label>
          </div>
        </div>

        {/* WP-Style Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7]">
          <button onClick={onClose} className="text-[#d63638] text-[13px] hover:underline px-2 py-1">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim() || !form.code.trim()}
            className="bg-[#2271b1] text-white text-[13px] px-4 py-1.5 rounded-[3px] border border-[#2271b1] hover:bg-[#135e96] hover:border-[#135e96] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {initial.id ? "Update" : "Publish"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function AdminScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Script> }>({ open: false, data: {} });
  const [gtmModal, setGtmModal] = useState(false);
  
  // Bulk actions state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      const res = await fetch("/api/admin/scripts");
      setScripts(await res.json());
    } catch {
      showToast("err", "Failed to load scripts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ open: true, data: { ...EMPTY_FORM } });
  const openEdit = (s: Script) => setModal({ open: true, data: { ...s } });
  const closeModal = () => setModal({ open: false, data: {} });

  const handleSaveGTM = async (gtmId: string) => {
    setSaving(true);
    try {
      const headCode = `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','${gtmId}');</script>\n<!-- End Google Tag Manager -->`;

      const bodyCode = `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`;

      await fetch("/api/admin/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Google Tag Manager - Head (${gtmId})`,
          location: "head",
          code: headCode,
          active: true,
        }),
      });

      await fetch("/api/admin/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Google Tag Manager - Noscript (${gtmId})`,
          location: "body_start",
          code: bodyCode,
          active: true,
        }),
      });

      await load();
      setGtmModal(false);
      showToast("ok", `Google Tag Manager (${gtmId}) installed successfully!`);
    } catch {
      showToast("err", "Failed to save GTM scripts.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (form: Partial<Script>) => {
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/scripts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await load();
      closeModal();
      showToast("ok", form.id ? "Script updated." : "Script published.");
    } catch {
      showToast("err", "Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (s: Script) => {
    try {
      const toggled = { ...s, active: !s.active };
      const res = await fetch("/api/admin/scripts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toggled),
      });
      if (!res.ok) throw new Error();
      setScripts((prev) => prev.map((x) => x.id === s.id ? toggled : x));
      showToast("ok", `Script ${toggled.active ? 'activated' : 'deactivated'}.`);
    } catch {
      showToast("err", "Toggle failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this script?")) return;
    try {
      await fetch(`/api/admin/scripts?id=${id}`, { method: "DELETE" });
      setScripts((prev) => prev.filter((s) => s.id !== id));
      showToast("ok", "Script deleted.");
    } catch {
      showToast("err", "Delete failed.");
    }
  };

  const handleDuplicate = async (s: Script) => {
    try {
      const duplicated = { ...s, id: undefined, name: s.name + " (Copy)", active: false };
      const res = await fetch("/api/admin/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicated),
      });
      if (!res.ok) throw new Error();
      await load();
      showToast("ok", "Script duplicated.");
    } catch {
      showToast("err", "Duplicate failed.");
    }
  };

  const handleBulkApply = async () => {
    if (bulkAction === "delete" && selectedIds.size > 0) {
      if (!confirm(`Are you sure you want to delete ${selectedIds.size} script(s)?`)) return;
      try {
        for (const id of Array.from(selectedIds)) {
          await fetch(`/api/admin/scripts?id=${id}`, { method: "DELETE" });
        }
        setScripts((prev) => prev.filter((s) => !selectedIds.has(s.id)));
        setSelectedIds(new Set());
        showToast("ok", "Scripts deleted.");
      } catch {
        showToast("err", "Bulk delete encountered an error.");
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === scripts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(scripts.map((s) => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-4">

      {/* WP-Style Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-4 py-2 bg-white border-l-4 text-[13px] shadow-sm ${
              toast.type === "ok" ? "border-[#00a32a]" : "border-[#d63638]"
            }`}
          >
            <p className="text-[#1d2327] m-0">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WP-Style Header */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Scripts</h1>
        <button
          onClick={openAdd}
          className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] hover:text-[#135e96] hover:border-[#135e96] px-2.5 py-1 text-[13px] rounded-[3px] transition-colors font-medium"
        >
          Add New Script
        </button>
        <button
          onClick={() => setGtmModal(true)}
          className="bg-[#2271b1] text-white hover:bg-[#135e96] px-3 py-1 text-[13px] rounded-[3px] transition-colors font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Code2 className="w-3.5 h-3.5" />
          Setup Google Tag Manager (GTM)
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-2 mb-2">
        <select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          className="border border-[#8c8f94] bg-white text-[#2c3338] px-2 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
        >
          <option value="">Bulk actions</option>
          <option value="delete">Delete</option>
        </select>
        <button
          onClick={handleBulkApply}
          className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7] transition-colors"
        >
          Apply
        </button>
        <span className="text-[#50575e] text-[13px] ml-auto">
          {scripts.length} items
        </span>
      </div>

      {/* WP-Style Table */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#c3c4c7] text-[#1d2327]">
              <th className="w-8 py-2 px-3">
                <input
                  type="checkbox"
                  checked={scripts.length > 0 && selectedIds.size === scripts.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 border-[#8c8f94] rounded-[3px] text-[#2271b1] focus:ring-[#2271b1]"
                />
              </th>
              <th className="py-2 px-3 text-[14px] font-semibold">Title</th>
              <th className="py-2 px-3 text-[14px] font-semibold w-40">Location</th>
              <th className="py-2 px-3 text-[14px] font-semibold w-32">Status</th>
              <th className="py-2 px-3 text-[14px] font-semibold w-32">Date</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#2c3338]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#50575e]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : scripts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-[#50575e]">
                  No scripts found.
                </td>
              </tr>
            ) : (
              scripts.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`border-b border-[#f0f0f1] group ${idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1] transition-colors`}
                >
                  <td className="py-3 px-3 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      className="w-4 h-4 border-[#8c8f94] rounded-[3px] text-[#2271b1] focus:ring-[#2271b1]"
                    />
                  </td>
                  <td className="py-3 px-3 align-top">
                    <strong className="text-[#2271b1] block text-[14px]">{s.name}</strong>
                    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(s)} className="text-[#2271b1] hover:underline text-[12px]">Edit</button>
                      <span className="text-[#a7aaad]">|</span>
                      <button onClick={() => handleDuplicate(s)} className="text-[#2271b1] hover:underline text-[12px]">Duplicate</button>
                      <span className="text-[#a7aaad]">|</span>
                      <button onClick={() => handleToggle(s)} className="text-[#2271b1] hover:underline text-[12px]">
                        {s.active ? "Deactivate" : "Activate"}
                      </button>
                      <span className="text-[#a7aaad]">|</span>
                      <button onClick={() => handleDelete(s.id)} className="text-[#d63638] hover:underline text-[12px]">Delete</button>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top">
                    {LOCATION_LABELS[s.location]?.label || "Unknown"}
                  </td>
                  <td className="py-3 px-3 align-top">
                    <button onClick={() => handleToggle(s)} className="hover:underline text-left">
                      {s.active ? (
                        <span className="text-[#00a32a] font-semibold">Active</span>
                      ) : (
                        <span className="text-[#50575e]">Inactive</span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 align-top text-[#50575e]">
                    {new Date(s.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <ScriptModal
            initial={modal.data}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
          />
        )}
        {gtmModal && (
          <GTMSetupModal
            onSaveBoth={handleSaveGTM}
            onClose={() => setGtmModal(false)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
