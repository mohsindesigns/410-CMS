"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICE_PAGE_DEFAULTS } from "@/lib/servicePageText";
import { DEFAULT_PRIVACY, formatLegalDate, type PrivacySection } from "@/lib/privacy";
import { Briefcase, FileText, Save, Loader2, Settings, LayoutTemplate, Type, Image as ImageIcon, ChevronRight, Globe, Mail, Phone, MapPin, Share2, Plus, Trash2, List, ExternalLink, Search, Check, X, Upload, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-20 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

const COMMON_ICONS = [
  "Home", "Info", "Briefcase", "Phone", "Mail", "MapPin", "Shield", "Star", "Check", "Award",
  "Hammer", "Construction", "Wind", "Sun", "Cloud", "Zap", "Layers", "Box", "Package",
  "Facebook", "Instagram", "Twitter", "Linkedin", "Youtube", "Github", "Globe",
  "Calendar", "Clock", "User", "Users", "Camera", "Image", "Video", "FileText", "File",
  "ShieldCheck", "Trophy", "CreditCard", "Settings", "Layout", "Menu", "ExternalLink",
  "ArrowRight", "ChevronRight", "Search", "Map", "Truck", "HardHat", "Ruler", "Paintbrush"
];

const OFFICE_HOURS_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const HOURS_RANGE_RE = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/;

function OfficeHoursDayRow({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  const raw = (value || "").trim();
  const isClosed = raw.toLowerCase() === "closed";
  const m = raw.match(HOURS_RANGE_RE);
  const openTime = m ? `${m[1]}:${m[2]}` : "09:00";
  const closeTime = m ? `${m[3]}:${m[4]}` : "17:00";
  const isLegacy = !!raw && !isClosed && !m;

  return (
    <div className="flex flex-wrap items-center gap-3">
       <span className="w-24 text-[13px] text-[#1d2327]">{label}</span>
       <label className="flex items-center gap-1.5 text-[12px] text-[#646970]">
          <input type="checkbox" checked={isClosed} onChange={(e) => onChange(e.target.checked ? "closed" : `${openTime}-${closeTime}`)} />
          Closed
       </label>
       {!isClosed && (
          <>
             <input type="time" value={openTime} onChange={(e) => onChange(`${e.target.value}-${closeTime}`)} className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
             <span className="text-[12px] text-[#646970]">to</span>
             <input type="time" value={closeTime} onChange={(e) => onChange(`${openTime}-${e.target.value}`)} className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
          </>
       )}
       {isLegacy && (
          <span className="text-[11px] text-[#d63638]">Current value "{raw}" isn't a time range — set times above to replace it.</span>
       )}
    </div>
  );
}

const SOCIAL_STANDARD = [
  { platform: "Facebook", label: "Facebook", icon: "Facebook", match: ["facebook"], placeholder: "https://www.facebook.com/your-page" },
  { platform: "Instagram", label: "Instagram", icon: "Instagram", match: ["instagram"], placeholder: "https://www.instagram.com/your-handle/" },
  { platform: "TikTok", label: "TikTok", icon: "TikTok", match: ["tiktok"], placeholder: "https://www.tiktok.com/@your-handle" },
  { platform: "YouTube", label: "YouTube", icon: "Youtube", match: ["youtube"], placeholder: "https://www.youtube.com/@your-channel" },
  { platform: "Google Business", label: "Google Business Profile", icon: "Google", match: ["google"], placeholder: "https://g.page/your-business" },
  { platform: "X", label: "X (Twitter)", icon: "Twitter", match: ["twitter", "x"], placeholder: "https://x.com/your-handle" },
  { platform: "LinkedIn", label: "LinkedIn", icon: "Linkedin", match: ["linkedin"], placeholder: "https://www.linkedin.com/company/your-company" },
];
/** Shown (and saved on first edit) when no social list has ever been stored - same profiles the footer falls back to. */
const DEFAULT_SOCIAL_ROWS = [
  { platform: "Instagram", href: "https://www.instagram.com/410muscletherapy/", icon: "Instagram" },
  { platform: "TikTok", href: "https://www.tiktok.com/@410muscletherapy", icon: "TikTok" },
  { platform: "YouTube", href: "https://www.youtube.com/@Twon410", icon: "Youtube" },
];
const socialRowMatches = (row: any, p: { match: string[] }) => {
  const name = String(row?.platform || "").trim().toLowerCase();
  return p.match.some((m) => (m === "x" ? name === "x" : name.includes(m)));
};

function IconPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredIcons = COMMON_ICONS.filter(icon => icon.toLowerCase().includes(search.toLowerCase()));
  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle;

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-white border border-[#8c8f94] rounded-[3px] px-3 py-1 text-[13px] hover:border-[#2271b1] transition-all">
        <CurrentIcon className="w-3.5 h-3.5 text-[#50575e]" />
        <span>{value || "Select Icon"}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-[#c3c4c7] shadow-md p-3 rounded-[3px]">
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px] mb-2 outline-none focus:border-[#2271b1]" autoFocus />
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
            {filteredIcons.map(iconName => {
              const Icon = (LucideIcons as any)[iconName];
              return (
                <button key={iconName} onClick={() => { onChange(iconName); setOpen(false); }} className={`p-1.5 rounded hover:bg-[#f0f0f1] ${value === iconName ? "bg-[#2271b1] text-white" : "text-[#50575e]"}`}>
                  {Icon && <Icon className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PageSelector({ value, pages, onChange, label }: { value: string, pages: any[], onChange: (page: any) => void, label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[12px] font-semibold text-[#1d2327]">{label}</label>}
      <select 
        value={value || ""} 
        onChange={(e) => onChange(pages.find(p => p._id === e.target.value))}
        className="border border-[#8c8f94] bg-white px-2 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1]"
      >
        <option value="">-- Custom Link --</option>
        <optgroup label="Pages">
          {pages.filter(p => p.type === 'page').map(page => <option key={page._id} value={page._id}>{page.title}</option>)}
        </optgroup>
        <optgroup label="Services">
          {pages.filter(p => p.type === 'service').map(page => <option key={page._id} value={page._id}>{page.title}</option>)}
        </optgroup>
      </select>
    </div>
  );
}

const SettingsRow = ({ label, children, description }: any) => (
  <div className="py-4 border-b border-[#f0f0f1] flex flex-col md:flex-row gap-4">
    <div className="w-full md:w-64 flex-shrink-0 pt-1">
      <label className="text-[14px] font-semibold text-[#1d2327]">{label}</label>
    </div>
    <div className="flex-1 space-y-2">
      {children}
      {description && <p className="text-[12px] text-[#646970] italic">{description}</p>}
    </div>
  </div>
);

export default function SettingsEditor() {
  const [data, setData] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  // Services menu labels edited on the Header tab (key = service slug/id). Saved separately via the services scope.
  const [menuLabels, setMenuLabels] = useState<Record<string, string>>({});
  const [savingLabels, setSavingLabels] = useState(false);

  // Redirect Manager States
  const [redirects, setRedirects] = useState<any[]>([]);
  const [totalRedirects, setTotalRedirects] = useState(0);
  const [redirectsPage, setRedirectsPage] = useState(1);
  const [loadingRedirects, setLoadingRedirects] = useState(false);
  const [redirectSearch, setRedirectSearch] = useState("");
  const [redirectStatusFilter, setRedirectStatusFilter] = useState("");
  const [redirectTypeFilter, setRedirectTypeFilter] = useState("");
  
  const [redirectForm, setRedirectForm] = useState({
    _id: "",
    sourceUrl: "",
    targetUrl: "",
    statusCode: 301,
    queryParamMode: "ignore",
    ignoreCase: true,
    ignoreSlash: true,
    isRegex: false,
    status: "active",
    notes: ""
  });
  const [submittingRedirect, setSubmittingRedirect] = useState(false);
  const [redirectError, setRedirectError] = useState("");

  const fetchRedirects = async () => {
    setLoadingRedirects(true);
    try {
      const params = new URLSearchParams();
      if (redirectSearch) params.set("search", redirectSearch);
      if (redirectStatusFilter) params.set("status", redirectStatusFilter);
      if (redirectTypeFilter) params.set("type", redirectTypeFilter);
      params.set("page", redirectsPage.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/admin/redirects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRedirects(data.items || []);
        setTotalRedirects(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching redirects:", err);
    } finally {
      setLoadingRedirects(false);
    }
  };

  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRedirect(true);
    setRedirectError("");
    try {
      const isEdit = !!redirectForm._id;
      const url = "/api/admin/redirects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(redirectForm)
      });

      const data = await res.json();
      if (res.ok) {
        setRedirectForm({
          _id: "",
          sourceUrl: "",
          targetUrl: "",
          statusCode: 301,
          queryParamMode: "ignore",
          ignoreCase: true,
          ignoreSlash: true,
          isRegex: false,
          status: "active",
          notes: ""
        });
        setToast({ type: "ok", msg: isEdit ? "Redirect updated." : "Redirect added." });
        setTimeout(() => setToast(null), 3000);
        fetchRedirects();
      } else {
        setRedirectError(data.error || "An error occurred.");
      }
    } catch (err) {
      setRedirectError("Failed to save redirect.");
    } finally {
      setSubmittingRedirect(false);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return;
    try {
      const res = await fetch("/api/admin/redirects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] })
      });
      if (res.ok) {
        setToast({ type: "ok", msg: "Redirect deleted." });
        setTimeout(() => setToast(null), 3000);
        fetchRedirects();
      }
    } catch (err) {
      console.error("Delete redirect error:", err);
    }
  };

  const handleToggleStatus = async (item: any) => {
    try {
      const updated = {
        ...item,
        status: item.status === "active" ? "disabled" : "active"
      };
      const res = await fetch("/api/admin/redirects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setToast({ type: "ok", msg: `Redirect ${updated.status === 'active' ? 'enabled' : 'disabled'}.` });
        setTimeout(() => setToast(null), 3000);
        fetchRedirects();
      }
    } catch (err) {
      console.error("Toggle redirect status error:", err);
    }
  };

  useEffect(() => {
    fetch("/api/content").then((res) => res.json()).then((json) => {
        const d = { ...json };
        if (!d.settings) d.settings = { siteTitle: "410 Muscle Therapy", siteTemplate: "%s | 410 Muscle Therapy", favicon: "/logo.png" };
        if (!d.navbar) d.navbar = { companyLinks: [], ctaText: "Book Now", ctaLink: "/contact-us/", logo: "/logo.png" };
        setData(d);
      });
    Promise.all([
      fetch("/api/admin/pages").then(res => res.json()),
      fetch("/api/content").then(res => res.json())
    ]).then(([pagesJson, contentJson]) => {
      const pageList = (pagesJson || [])
        .filter((p: any) => p.status === 'published')
        .map((p: any) => ({ ...p, type: 'page' }));
      const rawServices = contentJson.services?.services || (Array.isArray(contentJson.services) ? contentJson.services : []);
      const serviceList = rawServices
        .filter((s: any) => s.status === 'published' || s.status === undefined)
        .map((s: any) => ({ ...s, _id: s._id || s.slug, type: 'service', title: s.title, slug: `services/${s.slug}` }));
      setPages([...pageList, ...serviceList]);
    });
  }, []);

  useEffect(() => {
    if (activeTab === "redirects") {
      fetchRedirects();
    }
  }, [activeTab, redirectsPage, redirectSearch, redirectStatusFilter, redirectTypeFilter]);

  const saveMenuLabels = async () => {
    setSavingLabels(true);
    try {
      // Re-read the live content first so nothing edited elsewhere is overwritten, then change ONLY menuLabel.
      const freshRes = await fetch("/api/content", { cache: "no-store" });
      if (!freshRes.ok) throw new Error("load");
      const fresh = await freshRes.json();
      const list = (fresh?.services?.services || []).map((svc: any) => {
        const key = svc.slug || svc.id;
        return Object.prototype.hasOwnProperty.call(menuLabels, key) ? { ...svc, menuLabel: (menuLabels[key] || "").trim() } : svc;
      });
      const body = { ...fresh, services: { ...(fresh.services || {}), services: list } };
      const res = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json", "X-Content-Scope": "services" }, body: JSON.stringify(body) });
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          services: { ...(prev?.services || {}), services: (prev?.services?.services || []).map((svc: any) => {
            const key = svc.slug || svc.id;
            return Object.prototype.hasOwnProperty.call(menuLabels, key) ? { ...svc, menuLabel: (menuLabels[key] || "").trim() } : svc;
          }) },
        }));
        setMenuLabels({});
        setToast({ type: "ok", msg: "Menu labels saved." });
      } else {
        const err = await res.json().catch(() => ({}));
        setToast({ type: "err", msg: `Failed to save menu labels (${res.status}): ${err?.error || "server error"}` });
      }
    } catch {
      setToast({ type: "err", msg: "Failed to save menu labels." });
    } finally {
      setSavingLabels(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        setToast({ type: "ok", msg: "Settings saved." });
        setTimeout(() => setToast(null), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        setToast({ type: "err", msg: `Failed to save settings (${res.status}): ${err?.error || "server error"}` });
      }
    } catch {
      setToast({ type: "err", msg: "Error saving settings." });
    } finally { setSaving(false); }
  };

  const updateData = (section: string, field: string | null, value: any) => {
    setData((prev: any) => ({ ...prev, [section]: field ? { ...prev[section], [field]: value } : value }));
  };

  /** Set/clear the link for one of the standard networks (creates the row on first use, keeps it when emptied). */
  const setSocialUrl = (p: { platform: string; icon: string; match: string[] }, href: string) => {
    setData((prev: any) => {
      const list: any[] = Array.isArray(prev?.footer?.social) ? [...prev.footer.social] : DEFAULT_SOCIAL_ROWS.map((r) => ({ ...r }));
      const idx = list.findIndex((r) => socialRowMatches(r, p));
      if (idx >= 0) list[idx] = { ...list[idx], href };
      else list.push({ platform: p.platform, href, icon: p.icon });
      return { ...prev, footer: { ...(prev?.footer || {}), social: list } };
    });
  };

  if (!data) return <div className="flex h-screen items-center justify-center text-[#646970] font-serif">Loading...</div>;

  const socialRows: any[] = Array.isArray(data?.footer?.social) ? data.footer.social : DEFAULT_SOCIAL_ROWS;

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "header", label: "Header", icon: LayoutTemplate },
    { id: "footer", label: "Footer", icon: List },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "servicePages", label: "Service Pages", icon: Briefcase },
    { id: "privacy", label: "Privacy Policy", icon: FileText },
    { id: "redirects", label: "Redirect Manager", icon: RefreshCw },
  ];


  return (
    <div className="space-y-6">
      {/* WP Header Area */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Settings</h1>
      </div>

      {/* WP Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`px-4 py-2 bg-white border-l-4 text-[13px] shadow-sm mb-4 ${toast.type === "ok" ? "border-[#00a32a]" : "border-[#d63638]"}`}>
            <p className="text-[#1d2327] m-0">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WP-Style Tabs (Subsubsub) */}
      <div className="flex items-center gap-2 text-[13px] mb-6">
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            <button onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7]">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Settings Form Container */}
      <div className="bg-white border border-[#c3c4c7] p-8 rounded-sm shadow-sm max-w-4xl">
        <AnimatePresence mode="wait">
          {activeTab === "general" && (
            <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">General Settings</h2>
               <SettingsRow label="Site Title" description="The main name of your business as it appears in the browser tab.">
                  <input type="text" value={data.settings?.siteTitle || ""} onChange={(e) => updateData("settings", "siteTitle", e.target.value)} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none" />
               </SettingsRow>
               <SettingsRow label="Title Template" description="How page titles are constructed. %s will be replaced by the page name.">
                  <input type="text" value={data.settings?.siteTemplate || ""} onChange={(e) => updateData("settings", "siteTemplate", e.target.value)} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none" />
               </SettingsRow>
               <SettingsRow label="Homepage" description="Select which page or service should be displayed on the root (/) URL.">
                  <select 
                    value={data.settings?.homepageId || ""} 
                    onChange={(e) => updateData("settings", "homepageId", e.target.value)}
                    className="w-full max-w-md border border-[#8c8f94] bg-white px-3 py-1.5 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none"
                  >
                    <option value="">Default (Home Template)</option>
                    <optgroup label="Published Pages">
                      {pages.filter(p => p.type === 'page' && p.published !== false).map(page => (
                        <option key={page._id} value={page._id}>{page.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Published Services">
                      {pages.filter(p => p.type === 'service').map(page => (
                        <option key={page._id} value={page._id}>{page.title}</option>
                      ))}
                    </optgroup>
                  </select>
               </SettingsRow>
               <SettingsRow label="Site Favicon" description="Upload the small icon that appears in the browser tab.">
                  <ImageField value={data.settings?.favicon || ""} onChange={(val) => updateData("settings", "favicon", val)} label="Favicon" />
               </SettingsRow>
               <SettingsRow label="Search Engine Visibility" description="When checked, forces 'noindex, nofollow' across the entire website. Unchecking this restores page-wise SEO settings.">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1d2327]">
                     <input 
                       type="checkbox" 
                       checked={!!data.settings?.noIndexNoFollow} 
                       onChange={(e) => updateData("settings", "noIndexNoFollow", e.target.checked)} 
                       className="w-4 h-4 rounded-[3px] border-[#8c8f94] text-[#2271b1] focus:ring-[#2271b1]" 
                     />
                     <span className="font-semibold text-[#d63638]">Discourage search engines from indexing this site (Global No-Index &amp; No-Follow)</span>
                  </label>
               </SettingsRow>
            </motion.div>
          )}

          {activeTab === "header" && (
            <motion.div key="header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Header & Navigation</h2>
               <SettingsRow label="Navbar Logo">
                  <ImageField value={data.navbar?.logo || ""} onChange={(val) => updateData("navbar", "logo", val)} label="Logo" />
               </SettingsRow>
               <SettingsRow label="Menu button wording (screen readers)">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {([["ariaToggle", "Toggle menu"], ["ariaOpen", "Open"], ["ariaClose", "Close"], ["ariaExpand", "Expand"], ["ariaCollapse", "Collapse"], ["ariaMenuWord", "menu"]] as const).map(([k, ph]) => (
                        <input key={k} type="text" placeholder={ph} value={(data.navbar as any)?.[k] || ""} onChange={(e) => updateData("navbar", k, e.target.value)} className="border border-[#8c8f94] px-3 py-1.5 text-[13px] rounded-[3px]" />
                     ))}
                  </div>
                  <p className="text-[11px] text-[#646970] mt-1">Read aloud by screen readers for the menu buttons. Empty = the grey default.</p>
               </SettingsRow>
               <SettingsRow label="CTA Button">
                  <div className="flex gap-4">
                     <input type="text" placeholder="Text" value={data.navbar?.ctaText || ""} onChange={(e) => updateData("navbar", "ctaText", e.target.value)} className="w-40 border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                     <input type="text" placeholder="Link" value={data.navbar?.ctaLink || ""} onChange={(e) => updateData("navbar", "ctaLink", e.target.value)} className="flex-1 border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                  </div>
               </SettingsRow>
               
               <div className="mt-8 pt-8 border-t border-[#c3c4c7]">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-normal text-[#1d2327] font-serif">Navigation Menu</h3>
                     <button onClick={() => updateData("navbar", "companyLinks", [...(data.navbar?.companyLinks || []), { label: "New Link", href: "/", icon: "Info", subLinks: [] }])} className="text-[#2271b1] hover:underline text-[13px]">+ Add Link</button>
                  </div>
                  <div className="space-y-6">
                     {(data.navbar?.companyLinks || []).map((link: any, idx: number) => (
                        <div key={idx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-5 rounded-sm space-y-5 relative">
                           <div className="absolute top-2 right-2 flex gap-1">
                              <button 
                                onClick={() => {
                                  if (idx === 0) return;
                                  const nl = [...data.navbar.companyLinks];
                                  const temp = nl[idx - 1];
                                  nl[idx - 1] = nl[idx];
                                  nl[idx] = temp;
                                  updateData("navbar", "companyLinks", nl);
                                }}
                                disabled={idx === 0}
                                className="p-1 text-[#50575e] hover:bg-[#dcdcde] rounded disabled:opacity-30 transition-colors"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button 
                                onClick={() => {
                                  if (idx === data.navbar.companyLinks.length - 1) return;
                                  const nl = [...data.navbar.companyLinks];
                                  const temp = nl[idx + 1];
                                  nl[idx + 1] = nl[idx];
                                  nl[idx] = temp;
                                  updateData("navbar", "companyLinks", nl);
                                }}
                                disabled={idx === data.navbar.companyLinks.length - 1}
                                className="p-1 text-[#50575e] hover:bg-[#dcdcde] rounded disabled:opacity-30 transition-colors"
                                title="Move Down"
                              >
                                ↓
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pr-16">
                              <PageSelector value={link.pageId} pages={pages} label="Map to Page" onChange={(p) => {
                                 const nl = [...data.navbar.companyLinks];
                                 nl[idx] = { ...nl[idx], pageId: p?._id || "", label: p?.title || nl[idx].label, href: p ? "/"+p.slug : nl[idx].href };
                                 updateData("navbar", "companyLinks", nl);
                              }} />
                              <div className="flex flex-col gap-1">
                                 <label className="text-[12px] font-semibold text-[#1d2327]">Label</label>
                                 <input type="text" value={link.label} onChange={(e) => {
                                    const nl = [...data.navbar.companyLinks];
                                    nl[idx].label = e.target.value;
                                    updateData("navbar", "companyLinks", nl);
                                 }} className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                              </div>
                              <div className="flex flex-col gap-1">
                                 <label className="text-[12px] font-semibold text-[#1d2327]">Path/URL</label>
                                 <input type="text" value={link.href} onChange={(e) => {
                                    const nl = [...data.navbar.companyLinks];
                                    nl[idx].href = e.target.value;
                                    updateData("navbar", "companyLinks", nl);
                                 }} className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                              </div>
                              <div className="flex flex-col gap-1">
                                 <label className="text-[12px] font-semibold text-[#1d2327]">Icon</label>
                                 <IconPicker value={link.icon} onChange={(v) => {
                                    const nl = [...data.navbar.companyLinks];
                                    nl[idx].icon = v;
                                    updateData("navbar", "companyLinks", nl);
                                 }} />
                              </div>
                              <div className="flex flex-col gap-2 pt-5">
                                 <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#1d2327]">
                                   <input type="checkbox" checked={link.useMegaMenu || false} onChange={(e) => {
                                      const nl = [...data.navbar.companyLinks];
                                      nl[idx].useMegaMenu = e.target.checked;
                                      updateData("navbar", "companyLinks", nl);
                                   }} className="rounded-sm border-[#8c8f94]" />
                                   Use Services Mega Menu
                                 </label>
                                 <button onClick={() => updateData("navbar", "companyLinks", data.navbar.companyLinks.filter((_:any,i:number)=>i!==idx))} className="text-[#d63638] hover:underline text-[12px] text-left">Remove Parent</button>
                              </div>
                           </div>

                           {/* SUBMENU EDITOR */}
                           <div className="pl-6 border-l-2 border-[#c3c4c7] space-y-4">
                              <div className="flex items-center justify-between">
                                 <span className="text-[11px] font-bold text-[#646970] uppercase tracking-wider">Submenu Items</span>
                                 <button onClick={() => {
                                    const nl = [...data.navbar.companyLinks];
                                    if(!nl[idx].subLinks) nl[idx].subLinks = [];
                                    nl[idx].subLinks.push({ label: "New Sub Item", href: "/", icon: "ChevronRight", pageId: "" });
                                    updateData("navbar", "companyLinks", nl);
                                 }} className="text-[#2271b1] text-[11px] hover:underline font-bold">+ Add Submenu Item</button>
                              </div>
                              <div className="space-y-3">
                                 {(link.subLinks || []).map((sub: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white p-4 border border-[#dcdcde] rounded-sm shadow-sm space-y-3">
                                       <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                                          <PageSelector value={sub.pageId} pages={pages} label="Map Sub Page" onChange={(p) => {
                                             const nl = [...data.navbar.companyLinks];
                                             nl[idx].subLinks[sIdx] = { ...nl[idx].subLinks[sIdx], pageId: p?._id || "", label: p?.title || nl[idx].subLinks[sIdx].label, href: p ? "/"+p.slug : nl[idx].subLinks[sIdx].href };
                                             updateData("navbar", "companyLinks", nl);
                                          }} />
                                          <div className="flex flex-col gap-1">
                                             <label className="text-[11px] font-semibold">Sub Label</label>
                                             <input type="text" value={sub.label} onChange={(e) => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks[sIdx].label = e.target.value;
                                                updateData("navbar", "companyLinks", nl);
                                             }} className="border border-[#8c8f94] px-2 py-1 text-[12px] rounded-[3px]" />
                                          </div>
                                          <div className="flex flex-col gap-1">
                                             <label className="text-[11px] font-semibold">Sub Path</label>
                                             <input type="text" value={sub.href} onChange={(e) => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks[sIdx].href = e.target.value;
                                                updateData("navbar", "companyLinks", nl);
                                             }} className="border border-[#8c8f94] px-2 py-1 text-[12px] rounded-[3px]" />
                                          </div>
                                          <div className="flex items-center justify-between pt-4">
                                             <IconPicker value={sub.icon || "ChevronRight"} onChange={(v) => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks[sIdx].icon = v;
                                                updateData("navbar", "companyLinks", nl);
                                             }} />
                                             <button onClick={() => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks = nl[idx].subLinks.filter((_:any, i:number) => i !== sIdx);
                                                updateData("navbar", "companyLinks", nl);
                                             }} className="text-[#d63638] hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="mt-10 border-t border-[#c3c4c7] pt-6">
                  <h3 className="text-[15px] font-bold text-[#1d2327] mb-1">Services menu labels</h3>
                  <p className="text-[12px] text-[#646970] mb-4">Short names shown in the Services mega menu, the mobile menu and the footer. Leave a field empty to show the full service title. Page titles, headings and URLs are not affected. You can also set this per service in Services → Edit → Hero Banner.</p>
                  <div className="space-y-2">
                     {(Array.isArray(data.services?.services) ? data.services.services : []).map((svc: any) => {
                        const key = svc.slug || svc.id;
                        const val = Object.prototype.hasOwnProperty.call(menuLabels, key) ? menuLabels[key] : (svc.menuLabel || "");
                        return (
                           <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                              <label htmlFor={`menulabel-${key}`} className="sm:w-1/2 text-[12px] text-[#50575e] break-words">{svc.title}</label>
                              <input
                                 id={`menulabel-${key}`}
                                 type="text"
                                 maxLength={40}
                                 value={val}
                                 placeholder="Short label, e.g. Deep Tissue"
                                 onChange={(e) => setMenuLabels((prev) => ({ ...prev, [key]: e.target.value }))}
                                 className="flex-1 border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]"
                              />
                           </div>
                        );
                     })}
                  </div>
                  <button
                     type="button"
                     onClick={saveMenuLabels}
                     disabled={savingLabels || Object.keys(menuLabels).length === 0}
                     className="mt-4 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white text-[13px] px-4 py-1.5 rounded-[3px]"
                  >
                     {savingLabels ? "Saving..." : "Save menu labels"}
                  </button>
               </div>
            </motion.div>
          )}

          {activeTab === "footer" && (
            <motion.div key="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Footer Content</h2>
               <SettingsRow label="Footer Logo">
                  <ImageField value={data.footer?.company?.logo || ""} onChange={(val) => updateData("footer", "company", { ...data.footer.company, logo: val })} label="Logo" />
               </SettingsRow>
               <SettingsRow label="Company Name">
                  <input type="text" value={data.footer?.company?.name || ""} onChange={(e) => updateData("footer", "company", { ...data.footer.company, name: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Footer Description">
                  <RichTextEditor 
                    content={data.footer?.company?.description || ""} 
                    onChange={(v) => updateData("footer", "company", { ...data.footer.company, description: v })} 
                  />
               </SettingsRow>
               <SettingsRow label="Marquee Text" description="Add messages for the scrolling bottom bar.">
                  <div className="space-y-2">
                     {(data.footer?.marquee?.texts || []).map((t: string, i: number) => (
                        <div key={i} className="flex gap-2">
                           <input type="text" value={t} onChange={(e) => {
                              const nt = [...data.footer.marquee.texts];
                              nt[i] = e.target.value;
                              updateData("footer", "marquee", { ...data.footer.marquee, texts: nt });
                           }} className="flex-1 border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                           <button onClick={() => {
                              const nt = data.footer.marquee.texts.filter((_:any, idx:number) => idx !== i);
                              updateData("footer", "marquee", { ...data.footer.marquee, texts: nt });
                           }} className="text-[#d63638] text-xs">Remove</button>
                        </div>
                     ))}
                     <button onClick={() => updateData("footer", "marquee", { ...data.footer.marquee, texts: [...(data.footer.marquee?.texts || []), "New Announcement"] })} className="text-[#2271b1] text-xs underline">+ Add Item</button>
                  </div>
               </SettingsRow>
               <SettingsRow label="Services Menu Title" description="The title for the dynamic services list in the footer.">
                  <input type="text" value={data.footer?.services?.title || "Our Services"} onChange={(e) => updateData("footer", "services", { ...data.footer.services, title: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Selected Footer Services" description="Select which services to display in the footer. If none are selected, all published services will be shown.">
                  <div className="flex flex-wrap gap-2">
                     {pages.filter(p => p.type === 'service').map(service => {
                        const isSelected = data.footer?.services?.selectedServices?.includes(service._id);
                        return (
                           <label key={service._id} className="flex items-center gap-2 bg-[#f6f7f7] border border-[#c3c4c7] px-3 py-1.5 rounded-[3px] text-[13px] cursor-pointer hover:bg-white transition-colors">
                              <input
                                 type="checkbox"
                                 checked={!!isSelected}
                                 onChange={(e) => {
                                    const selected = data.footer?.services?.selectedServices || [];
                                    if (e.target.checked) {
                                       updateData("footer", "services", { ...data.footer.services, selectedServices: [...selected, service._id] });
                                    } else {
                                       updateData("footer", "services", { ...data.footer.services, selectedServices: selected.filter((id: string) => id !== service._id) });
                                    }
                                 }}
                              />
                              {service?.title || "Unknown Service"}
                           </label>
                        );
                     })}
                     <div className="w-full mt-2">
                        <select 
                           className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px] w-full max-w-xs"
                           value=""
                           onChange={(e) => {
                              const selected = data.footer?.services?.selectedServices || [];
                              if(e.target.value && !selected.includes(e.target.value)) {
                                 updateData("footer", "services", { ...data.footer.services, selectedServices: [...selected, e.target.value] });
                              }
                           }}
                        >
                           <option value="">+ Add Service</option>
                           {pages.filter(p => p.type === 'service' && !(data.footer?.services?.selectedServices || []).includes(p._id)).map(service => (
                              <option key={service._id} value={service._id}>{service.title}</option>
                           ))}
                        </select>
                     </div>
                  </div>
               </SettingsRow>
                <SettingsRow label="Company Menu Title" description="The title for the company links section in the footer (defaults to 'Company').">
                   <input
                     type="text"
                     value={data.footer?.services?.materials?.title || "Company"}
                     onChange={(e) => {
                       const materials = data.footer?.services?.materials || { title: "Company", items: [] };
                       updateData("footer", "services", {
                         ...data.footer.services,
                         materials: { ...materials, title: e.target.value }
                       });
                     }}
                     className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]"
                   />
                </SettingsRow>
                <SettingsRow label="Company Links" description="Manage the links shown in the Company footer menu. Select from your pages or custom paths.">
                   <div className="space-y-3">
                      {(data.footer?.services?.materials?.items || []).map((link: any, i: number) => (
                         <div key={i} className="flex gap-4 items-center bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                            <div className="flex-1 space-y-1">
                               <label className="text-[11px] font-bold">Link Label</label>
                               <input
                                 type="text"
                                 value={link.label || ""}
                                 onChange={(e) => {
                                   const items = [...(data.footer.services.materials.items || [])];
                                   items[i].label = e.target.value;
                                   updateData("footer", "services", {
                                     ...data.footer.services,
                                     materials: { ...data.footer.services.materials, items }
                                   });
                                 }}
                                 className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]"
                               />
                            </div>
                            <div className="flex-1 space-y-1">
                               <label className="text-[11px] font-bold">Destination Page</label>
                               <select
                                 value={link.href}
                                 onChange={(e) => {
                                   const items = [...(data.footer.services.materials.items || [])];
                                   items[i].href = e.target.value;
                                   updateData("footer", "services", {
                                     ...data.footer.services,
                                     materials: { ...data.footer.services.materials, items }
                                   });
                                 }}
                                 className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]"
                               >
                                  <option value="/">Home</option>
                                  <option value="/blogs/">Blogs Index</option>
                                  <optgroup label="Pages">
                                     {pages.filter(p => p.type !== 'service').map((p: any) => (
                                        <option key={p._id} value={p.slug.startsWith('/') ? p.slug : `/${p.slug}`}>{p.title}</option>
                                     ))}
                                  </optgroup>
                                  <optgroup label="Services">
                                     {pages.filter(p => p.type === 'service').map((p: any) => (
                                        <option key={p._id} value={`/services/${p.slug}`}>{p.title}</option>
                                     ))}
                                  </optgroup>
                               </select>
                            </div>
                            <button
                              onClick={() => {
                                const items = (data.footer.services.materials.items || []).filter((_: any, idx: number) => idx !== i);
                                updateData("footer", "services", {
                                  ...data.footer.services,
                                  materials: { ...data.footer.services.materials, items }
                                });
                              }}
                              className="text-[#d63638] text-[13px] mt-5 hover:underline"
                            >
                              Remove
                            </button>
                         </div>
                      ))}
                      <button
                        onClick={() => {
                          const materials = data.footer?.services?.materials || { title: "Company", items: [] };
                          const items = materials.items || [];
                          updateData("footer", "services", {
                            ...data.footer.services,
                            materials: { ...materials, items: [...items, { label: "New Link", href: "/" }] }
                          });
                        }}
                        className="text-[#2271b1] text-[13px] hover:underline"
                      >
                        + Add Company Link
                      </button>
                   </div>
                </SettingsRow>
               <SettingsRow label="Certifications">
                  <div className="space-y-4">
                     {(data.footer?.certifications || []).map((cert: any, i: number) => (
                        <div key={i} className="flex gap-4 items-end bg-[#f6f7f7] p-4 border border-[#c3c4c7] rounded-sm">
                           <div className="flex-1 space-y-1">
                              <label className="text-[11px] font-bold">Certification Name</label>
                              <input type="text" value={cert.cert || ""} onChange={(e) => {
                                 const nc = [...data.footer.certifications];
                                 nc[i].cert = e.target.value;
                                 updateData("footer", "certifications", nc);
                              }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <label className="text-[11px] font-bold">License / Number</label>
                              <input type="text" value={cert.number || ""} onChange={(e) => {
                                 const nc = [...data.footer.certifications];
                                 nc[i].number = e.target.value;
                                 updateData("footer", "certifications", nc);
                              }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                           </div>
                           <div className="space-y-1 w-24">
                              <label className="text-[11px] font-bold">Icon</label>
                              <IconPicker value={cert.icon || "ShieldCheck"} onChange={(v) => {
                                 const nc = [...data.footer.certifications];
                                 nc[i].icon = v;
                                 updateData("footer", "certifications", nc);
                              }} />
                           </div>
                           <button onClick={() => {
                              const nc = data.footer.certifications.filter((_:any, idx:number) => idx !== i);
                              updateData("footer", "certifications", nc);
                           }} className="text-[#d63638] text-[13px] mb-1 hover:underline">Remove</button>
                        </div>
                     ))}
                     <button onClick={() => updateData("footer", "certifications", [...(data.footer.certifications || []), { cert: "New Cert", number: "#123456", icon: "ShieldCheck" }])} className="text-[#2271b1] text-[13px] hover:underline">+ Add Certification</button>
                  </div>
               </SettingsRow>
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Global Contact Information</h2>
               <p className="text-[12px] text-[#646970] italic mb-6">HTML is supported in all fields below (e.g. &lt;br&gt;, &lt;strong&gt;, &lt;a href=&quot;...&quot;&gt;, &lt;span&gt;). Content is safely sanitized.</p>
               <SettingsRow label="Primary Email" description="Supports HTML. E.g. &lt;a href='mailto:...'&gt;email&lt;/a&gt;">
                  <RichTextEditor
                    content={data.footer?.contact?.email || ""}
                    onChange={(v) => updateData("footer", "contact", { ...data.footer.contact, email: v })}
                  />
               </SettingsRow>
               <SettingsRow label="Primary Phone" description="Supports HTML. E.g. &lt;a href='tel:...'&gt;number&lt;/a&gt;">
                  <RichTextEditor
                    content={data.footer?.contact?.phone || ""}
                    onChange={(v) => updateData("footer", "contact", { ...data.footer.contact, phone: v })}
                  />
               </SettingsRow>
               <SettingsRow label="Office Address" description="Supports HTML. E.g. use &lt;br&gt; for line breaks.">
                  <RichTextEditor
                    content={data.footer?.contact?.address || ""}
                    onChange={(v) => updateData("footer", "contact", { ...data.footer.contact, address: v })}
                  />
               </SettingsRow>
               <SettingsRow label="Map Embed URL (optional)" description="The map already has a working default pin — leave this blank unless you want to change it. Go to Google Maps → Share → Embed a map → Copy HTML, then paste it here. You can paste either the full code it gives you or just the src=&quot;...&quot; URL from inside it — both work. A regular Google Maps link, g.page link, or share link will NOT work here and will be ignored.">
                  <input
                    type="text"
                    value={data.footer?.contact?.mapEmbedUrl || ""}
                    onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, mapEmbedUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]"
                  />
               </SettingsRow>
               <SettingsRow label="24/7 Emergency Text" description="Supports HTML.">
                  <RichTextEditor
                    content={data.footer?.contact?.emergency || ""}
                    onChange={(v) => updateData("footer", "contact", { ...data.footer.contact, emergency: v })}
                  />
               </SettingsRow>
               <SettingsRow label="Service Areas" description="Supports HTML.">
                  <RichTextEditor
                    content={data.footer?.contact?.areas || ""}
                    onChange={(v) => updateData("footer", "contact", { ...data.footer.contact, areas: v })}
                  />
               </SettingsRow>
               <SettingsRow label="Office Hours" description="Set open and close time for each day, or mark it closed. Days with identical hours are merged automatically in the footer.">
                  <div className="space-y-2">
                     {OFFICE_HOURS_DAYS.map(({ key, label }) => (
                        <OfficeHoursDayRow
                           key={key}
                           label={label}
                           value={data.hours?.[key]}
                           onChange={(v) => updateData("hours", key, v)}
                        />
                     ))}
                  </div>
               </SettingsRow>
            </motion.div>
          )}

          {activeTab === "social" && (
            <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-2 font-serif">Social Media Profiles</h2>
               <p className="text-[12px] text-[#646970] mb-6">Paste the full profile link for each network (starting with https://). A profile with a link appears as an icon in the website footer and is added to the search-engine business markup. Leave a field empty to hide that network.</p>
               <div className="space-y-3 mb-8">
                  {SOCIAL_STANDARD.map((p) => {
                     const row = socialRows.find((r: any) => socialRowMatches(r, p));
                     const href = row?.href || "";
                     const invalid = href.trim() !== "" && !/^https?:\/\//i.test(href.trim());
                     return (
                        <div key={p.platform} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#f6f7f7] p-3 border border-[#c3c4c7] rounded-sm">
                           <label htmlFor={`social-${p.platform}`} className="sm:w-44 text-[12px] font-bold text-[#1d2327]">{p.label}</label>
                           <div className="flex-1">
                              <input
                                 id={`social-${p.platform}`}
                                 type="url"
                                 value={href}
                                 placeholder={p.placeholder}
                                 onChange={(e) => setSocialUrl(p, e.target.value)}
                                 className={`w-full border px-2 py-1.5 text-[13px] rounded-[3px] ${invalid ? "border-[#d63638]" : "border-[#8c8f94]"}`}
                              />
                              {invalid && <p className="text-[11px] text-[#d63638] mt-1">Link must start with https://</p>}
                           </div>
                        </div>
                     );
                  })}
               </div>
               <h3 className="text-[13px] font-bold text-[#1d2327] mb-3">Other networks</h3>
               <div className="space-y-4">
                  {socialRows.map((s: any, i: number) => (
                     SOCIAL_STANDARD.some((p) => socialRowMatches(s, p)) ? null : (
                     <div key={i} className="flex gap-4 items-end bg-[#f6f7f7] p-4 border border-[#c3c4c7] rounded-sm">
                        <div className="flex-1 space-y-1">
                           <label className="text-[11px] font-bold">Platform Name</label>
                           <input type="text" value={s.platform} onChange={(e) => {
                              const ns = [...socialRows];
                              ns[i] = { ...ns[i], platform: e.target.value };
                              updateData("footer", "social", ns);
                           }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <label className="text-[11px] font-bold">URL</label>
                           <input type="text" value={s.href} onChange={(e) => {
                              const ns = [...socialRows];
                              ns[i] = { ...ns[i], href: e.target.value };
                              updateData("footer", "social", ns);
                           }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold">Icon</label>
                           <IconPicker value={s.icon} onChange={(v) => {
                              const ns = [...socialRows];
                              ns[i] = { ...ns[i], icon: v };
                              updateData("footer", "social", ns);
                           }} />
                        </div>
                        <button onClick={() => updateData("footer", "social", socialRows.filter((_:any,idx:number)=>idx!==i))} className="p-2 text-[#d63638] hover:bg-white rounded transition-colors" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                     </div>
                     )
                  ))}
                  <button onClick={() => updateData("footer", "social", [...socialRows, { platform: "", href: "", icon: "Globe" }])} className="text-[#2271b1] text-xs underline font-bold">+ Add another network</button>
               </div>
            </motion.div>
          )}

          {activeTab === "servicePages" && (
            <motion.div key="servicePages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div>
                  <h2 className="text-xl font-normal text-[#1d2327] mb-2 font-serif">Service Pages: shared wording</h2>
                  <p className="text-[12px] text-[#646970]">Wording used on every service page and on the Services page. Each service can override the section texts in Services &rarr; Edit &rarr; Page Sections. A field left empty uses the default shown in grey. Click "Save Changes" below to save.</p>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[14px] font-bold text-[#1d2327]">Breadcrumb</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">First crumb</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.breadcrumbHome || ""} placeholder={SERVICE_PAGE_DEFAULTS.breadcrumbHome || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "breadcrumbHome", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Services crumb</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.breadcrumbServices || ""} placeholder={SERVICE_PAGE_DEFAULTS.breadcrumbServices || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "breadcrumbServices", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Screen-reader label</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.breadcrumbAria || ""} placeholder={SERVICE_PAGE_DEFAULTS.breadcrumbAria || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "breadcrumbAria", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">"Last updated" wording (shown under the overview)</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.lastUpdatedLabel || ""} placeholder={SERVICE_PAGE_DEFAULTS.lastUpdatedLabel} onChange={(e) => updateData("serviceDetailPage", "lastUpdatedLabel", e.target.value)} />
                     </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[14px] font-bold text-[#1d2327]">Recommended services section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Small label</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.recommendedLabel || ""} placeholder={SERVICE_PAGE_DEFAULTS.recommendedLabel || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "recommendedLabel", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Title line 1</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.recommendedTitle1 || ""} placeholder={SERVICE_PAGE_DEFAULTS.recommendedTitle1 || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "recommendedTitle1", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Title line 2 (gold)</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.recommendedTitle2 || ""} placeholder={SERVICE_PAGE_DEFAULTS.recommendedTitle2 || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "recommendedTitle2", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Card button text</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.recommendedCtaText || ""} placeholder={SERVICE_PAGE_DEFAULTS.recommendedCtaText || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "recommendedCtaText", e.target.value)} />
                     </div>
                  </div>
                  <div>
                     <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Short text under the title (optional)</label>
                     <textarea rows={2} className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.recommendedDescription || ""} onChange={(e) => updateData("serviceDetailPage", "recommendedDescription", e.target.value)} />
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[14px] font-bold text-[#1d2327]">Client reviews section</h3>
                  <p className="text-[12px] text-[#646970]">Leave empty to use the wording of the home page reviews section.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Small label</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.reviewsLabel || ""} placeholder={SERVICE_PAGE_DEFAULTS.reviewsLabel || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "reviewsLabel", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Title line 1</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.reviewsTitle1 || ""} placeholder={SERVICE_PAGE_DEFAULTS.reviewsTitle1 || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "reviewsTitle1", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Title line 2 (gold)</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.reviewsTitle2 || ""} placeholder={SERVICE_PAGE_DEFAULTS.reviewsTitle2 || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "reviewsTitle2", e.target.value)} />
                     </div>
                  </div>
                  <div>
                     <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Short text under the title (optional)</label>
                     <textarea rows={2} className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.reviewsDescription || ""} onChange={(e) => updateData("serviceDetailPage", "reviewsDescription", e.target.value)} />
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[14px] font-bold text-[#1d2327]">Blog section</h3>
                  <p className="text-[12px] text-[#646970]">Leave empty to use the wording of the home page blog section.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Small label</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.blogLabel || ""} placeholder={SERVICE_PAGE_DEFAULTS.blogLabel || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "blogLabel", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Section title</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.blogTitle || ""} placeholder={SERVICE_PAGE_DEFAULTS.blogTitle || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "blogTitle", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">"View all" link text</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.blogCtaAll || ""} placeholder={SERVICE_PAGE_DEFAULTS.blogCtaAll || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "blogCtaAll", e.target.value)} />
                     </div>
                     <div>
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Card link text</label>
                        <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={data.serviceDetailPage?.blogCtaReadMore || ""} placeholder={SERVICE_PAGE_DEFAULTS.blogCtaReadMore || "Same as the home page"} onChange={(e) => updateData("serviceDetailPage", "blogCtaReadMore", e.target.value)} />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "privacy" && (() => {
            const pv = data.privacyPage || {};
            const sections: PrivacySection[] = Array.isArray(pv.sections) ? pv.sections : DEFAULT_PRIVACY.sections;
            const setPv = (patch: Record<string, any>) => updateData("privacyPage", null, { ...pv, ...patch });
            const setSections = (next: PrivacySection[]) => setPv({ sections: next });
            const setSec = (i: number, patch: Partial<PrivacySection>) => setSections(sections.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
            const moveSec = (i: number, d: -1 | 1) => { const j = i + d; if (j < 0 || j >= sections.length) return; const n = [...sections]; [n[i], n[j]] = [n[j], n[i]]; setSections(n); };
            return (
              <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div>
                    <h2 className="text-xl font-normal text-[#1d2327] mb-2 font-serif">Privacy Policy</h2>
                    <p className="text-[12px] text-[#646970]">The text of the /privacy/ page. In a section: a blank line starts a new paragraph, lines starting with "- " become bullet points, **bold** makes text bold, and [link text](/page/) makes a link. Click "Save Changes" below to save. This is plain-language text; have it reviewed by counsel if you need that.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div><label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Small label</label><input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={pv.label ?? ""} placeholder={DEFAULT_PRIVACY.label} onChange={(e) => setPv({ label: e.target.value })} /></div>
                    <div><label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Title word 1</label><input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={pv.title1 ?? ""} placeholder={DEFAULT_PRIVACY.title1} onChange={(e) => setPv({ title1: e.target.value })} /></div>
                    <div><label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Title word 2 (gold)</label><input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={pv.title2 ?? ""} placeholder={DEFAULT_PRIVACY.title2} onChange={(e) => setPv({ title2: e.target.value })} /></div>
                    <div><label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Wording before the date</label><input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={pv.updatedPrefix ?? ""} placeholder={DEFAULT_PRIVACY.updatedPrefix} onChange={(e) => setPv({ updatedPrefix: e.target.value })} /></div>
                    <div>
                       <label className="text-[11px] font-bold text-[#1d2327] uppercase tracking-wide block mb-1">Last updated (also sent to search engines)</label>
                       <input type="date" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={(pv.updatedIso || DEFAULT_PRIVACY.updatedIso).slice(0, 10)} onChange={(e) => { const v = e.target.value; if (!v) return; const iso = v + "T12:00:00.000Z"; setPv({ updatedIso: iso, updatedLabel: formatLegalDate(iso) }); }} />
                    </div>
                 </div>

                 {sections.map((sec, i) => (
                    <div key={sec.id || i} className="border border-[#c3c4c7] bg-[#f6f7f7] p-4 space-y-3 rounded-[3px]">
                       <div className="flex items-center justify-between gap-3">
                          <span className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Section {i + 1}</span>
                          <div className="flex items-center gap-2">
                             <select value={sec.style || "normal"} onChange={(e) => setSec(i, { style: e.target.value as any })} className="border border-[#8c8f94] bg-white px-2 py-1 text-[12px] rounded-[3px]">
                                <option value="normal">Normal</option>
                                <option value="highlight">Highlighted box</option>
                             </select>
                             <button type="button" onClick={() => moveSec(i, -1)} disabled={i === 0} className="p-1.5 text-[#50575e] hover:text-[#2271b1] disabled:opacity-30" aria-label="Move up"><ChevronUp className="w-4 h-4" /></button>
                             <button type="button" onClick={() => moveSec(i, 1)} disabled={i === sections.length - 1} className="p-1.5 text-[#50575e] hover:text-[#2271b1] disabled:opacity-30" aria-label="Move down"><ChevronDown className="w-4 h-4" /></button>
                             <button type="button" onClick={() => { if (confirm("Remove this section?")) setSections(sections.filter((_, idx) => idx !== i)); }} className="p-1.5 text-[#d63638] hover:bg-white rounded" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                       <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px] font-bold" value={sec.heading || ""} onChange={(e) => setSec(i, { heading: e.target.value })} placeholder="Section heading" />
                       <textarea rows={Math.min(14, Math.max(4, (sec.body || "").split("\n").length + 1))} className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px] leading-relaxed" value={sec.body || ""} onChange={(e) => setSec(i, { body: e.target.value })} />
                    </div>
                 ))}
                 <div className="flex flex-wrap items-center gap-4">
                    <button type="button" onClick={() => setSections([...sections, { id: "sec-" + Date.now().toString(36), heading: "", body: "", style: "normal" }])} className="text-[#2271b1] text-xs underline font-bold">+ Add section</button>
                    <button type="button" onClick={() => { if (confirm("Replace everything on this tab with the original text?")) updateData("privacyPage", null, { ...(pv.seo ? { seo: pv.seo } : {}) }); }} className="text-[#646970] text-xs underline">Restore the original text</button>
                 </div>

                 <div className="border border-[#c3c4c7] bg-[#f6f7f7] p-4 space-y-3 rounded-[3px]">
                    <span className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Contact box at the bottom</span>
                    <input type="text" className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px] font-bold" value={pv.contactHeading ?? ""} placeholder={DEFAULT_PRIVACY.contactHeading} onChange={(e) => setPv({ contactHeading: e.target.value })} />
                    <textarea rows={5} className="w-full border border-[#8c8f94] bg-white px-3 py-1.5 text-[13px] rounded-[3px]" value={pv.contactBody ?? DEFAULT_PRIVACY.contactBody} onChange={(e) => setPv({ contactBody: e.target.value })} />
                    <p className="text-[11px] text-[#646970]">One line per row. Email addresses and phone numbers become links automatically.</p>
                 </div>
              </motion.div>
            );
          })()}

          {activeTab === "redirects" && (
            <motion.div key="redirects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Redirect Manager</h2>
               
               {/* Form Container */}
               <form onSubmit={handleSaveRedirect} className="bg-[#f6f7f7] border border-[#c3c4c7] p-6 rounded-sm space-y-4 mb-8">
                  <h3 className="text-sm font-bold text-[#1d2327] border-b border-[#c3c4c7] pb-2 m-0">
                    {redirectForm._id ? "Edit Redirect Rule" : "Add New Redirect Rule"}
                  </h3>
                  
                  {redirectError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-[13px] rounded-sm">
                      {redirectError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#1d2327] flex items-center gap-1">
                          Source URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. /old-page or ^/old-posts/(.*)"
                          value={redirectForm.sourceUrl}
                          onChange={(e) => setRedirectForm({ ...redirectForm, sourceUrl: e.target.value })}
                          className="w-full border border-[#8c8f94] px-3 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none"
                        />
                     </div>

                     <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#1d2327] flex items-center gap-1">
                          Target URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. /new-page or /new-posts/$1"
                          value={redirectForm.targetUrl}
                          onChange={(e) => setRedirectForm({ ...redirectForm, targetUrl: e.target.value })}
                          className="w-full border border-[#8c8f94] px-3 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#1d2327]">Redirect Type</label>
                        <select
                          value={redirectForm.statusCode}
                          onChange={(e) => setRedirectForm({ ...redirectForm, statusCode: parseInt(e.target.value, 10) })}
                          className="w-full border border-[#8c8f94] bg-white px-2 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none"
                        >
                          <option value={301}>301 Permanent Redirect</option>
                          <option value={302}>302 Temporary Redirect</option>
                          <option value={307}>307 Temporary Redirect</option>
                          <option value={308}>308 Permanent Redirect</option>
                        </select>
                     </div>

                     <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#1d2327]">Query Parameters</label>
                        <select
                          value={redirectForm.queryParamMode}
                          onChange={(e) => setRedirectForm({ ...redirectForm, queryParamMode: e.target.value })}
                          className="w-full border border-[#8c8f94] bg-white px-2 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none"
                        >
                          <option value="ignore">Ignore all parameters (Recommended)</option>
                          <option value="pass">Pass all parameters to target</option>
                          <option value="exact">Exact match in any order</option>
                        </select>
                     </div>

                     <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#1d2327]">Status</label>
                        <select
                          value={redirectForm.status}
                          onChange={(e) => setRedirectForm({ ...redirectForm, status: e.target.value })}
                          className="w-full border border-[#8c8f94] bg-white px-2 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="disabled">Disabled</option>
                        </select>
                     </div>
                  </div>

                  {/* Checkbox Options */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                     <label className="flex items-center gap-2 text-[13px] text-[#2c3338] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={redirectForm.ignoreCase}
                          onChange={(e) => setRedirectForm({ ...redirectForm, ignoreCase: e.target.checked })}
                          className="rounded-sm border-[#8c8f94]"
                        />
                        Ignore Case
                     </label>
                     <label className="flex items-center gap-2 text-[13px] text-[#2c3338] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={redirectForm.ignoreSlash}
                          onChange={(e) => setRedirectForm({ ...redirectForm, ignoreSlash: e.target.checked })}
                          className="rounded-sm border-[#8c8f94]"
                        />
                        Ignore Slash
                     </label>
                     <label className="flex items-center gap-2 text-[13px] text-[#2c3338] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={redirectForm.isRegex}
                          onChange={(e) => setRedirectForm({ ...redirectForm, isRegex: e.target.checked })}
                          className="rounded-sm border-[#8c8f94]"
                        />
                        Regex Match
                     </label>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[12px] font-bold text-[#1d2327]">Notes</label>
                     <input
                       type="text"
                       placeholder="Optional notes for reference..."
                       value={redirectForm.notes}
                       onChange={(e) => setRedirectForm({ ...redirectForm, notes: e.target.value })}
                       className="w-full border border-[#8c8f94] px-3 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] outline-none"
                     />
                  </div>

                  <div className="flex gap-2 pt-2">
                     <button
                       type="submit"
                       disabled={submittingRedirect}
                       className="bg-[#2271b1] text-white px-4 py-1.5 rounded-[3px] text-[13px] font-semibold border border-[#2271b1] hover:bg-[#135e96] hover:border-[#135e96]"
                     >
                       {submittingRedirect ? "Saving..." : redirectForm._id ? "Update Redirect" : "Add Redirect"}
                     </button>
                     {redirectForm._id && (
                       <button
                         type="button"
                         onClick={() => setRedirectForm({
                           _id: "",
                           sourceUrl: "",
                           targetUrl: "",
                           statusCode: 301,
                           queryParamMode: "ignore",
                           ignoreCase: true,
                           ignoreSlash: true,
                           isRegex: false,
                           status: "active",
                           notes: ""
                         })}
                         className="bg-white border border-[#8c8f94] text-[#2c3338] px-4 py-1.5 rounded-[3px] text-[13px] hover:bg-[#f6f7f7]"
                       >
                         Cancel Edit
                       </button>
                     )}
                  </div>
               </form>

               {/* Search, Filter, and Table controls */}
               <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4 pt-4 border-t border-[#c3c4c7]">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                     <input
                       type="text"
                       placeholder="Search redirects..."
                       value={redirectSearch}
                       onChange={(e) => { setRedirectSearch(e.target.value); setRedirectsPage(1); }}
                       className="border border-[#8c8f94] px-3 py-1.5 text-[13px] rounded-[3px] w-full sm:w-64 outline-none focus:border-[#2271b1]"
                     />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                     <select
                       value={redirectStatusFilter}
                       onChange={(e) => { setRedirectStatusFilter(e.target.value); setRedirectsPage(1); }}
                       className="border border-[#8c8f94] bg-white px-2 py-1.5 text-[13px] rounded-[3px]"
                     >
                       <option value="">All Statuses</option>
                       <option value="active">Active Only</option>
                       <option value="disabled">Disabled Only</option>
                     </select>

                     <select
                       value={redirectTypeFilter}
                       onChange={(e) => { setRedirectTypeFilter(e.target.value); setRedirectsPage(1); }}
                       className="border border-[#8c8f94] bg-white px-2 py-1.5 text-[13px] rounded-[3px]"
                     >
                       <option value="">All Types</option>
                       <option value="301">301 Permanent</option>
                       <option value="302">302 Temporary</option>
                       <option value="307">307 Temporary</option>
                       <option value="308">308 Permanent</option>
                     </select>
                  </div>
               </div>

               {/* Table */}
               <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                     <thead>
                        <tr className="border-b border-[#c3c4c7] bg-white text-[#1d2327]">
                           <th className="py-2 px-3 text-[13px] font-semibold">Source</th>
                           <th className="py-2 px-3 text-[13px] font-semibold">Target</th>
                           <th className="py-2 px-3 text-[13px] font-semibold w-24">Type</th>
                           <th className="py-2 px-3 text-[13px] font-semibold w-20">Hits</th>
                           <th className="py-2 px-3 text-[13px] font-semibold w-24">Status</th>
                           <th className="py-2 px-3 text-[13px] font-semibold w-32">Created</th>
                           <th className="py-2 px-3 text-[13px] font-semibold w-28">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="text-[13px] text-[#2c3338] divide-y divide-[#f0f0f1]">
                        {loadingRedirects ? (
                           <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                                Loading redirect rules...
                              </td>
                           </tr>
                        ) : redirects.length === 0 ? (
                           <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                                No redirect rules found.
                              </td>
                           </tr>
                        ) : (
                           redirects.map((item) => (
                              <tr key={item._id} className="hover:bg-[#f0f0f1] transition-colors group">
                                 <td className="py-3 px-3 align-top font-mono break-all text-[12px] max-w-[200px]">
                                    {item.sourceUrl}
                                    {item.isRegex && (
                                      <span className="ml-1 bg-purple-100 text-purple-800 text-[10px] px-1 rounded font-sans">regex</span>
                                    )}
                                    {item.ignoreCase && (
                                      <span className="ml-1 bg-blue-100 text-blue-800 text-[10px] px-1 rounded font-sans">case</span>
                                    )}
                                    {item.ignoreSlash && (
                                      <span className="ml-1 bg-green-100 text-green-800 text-[10px] px-1 rounded font-sans">slash</span>
                                    )}
                                 </td>
                                 <td className="py-3 px-3 align-top font-mono break-all text-[12px] max-w-[200px]">
                                    {item.targetUrl}
                                 </td>
                                 <td className="py-3 px-3 align-top font-bold text-slate-600">
                                    {item.statusCode}
                                 </td>
                                 <td className="py-3 px-3 align-top text-slate-700">
                                    <span className="font-semibold">{item.hits || 0}</span>
                                    {item.lastAccessed && (
                                      <span className="block text-[10px] text-slate-400 font-sans">
                                        Last: {new Date(item.lastAccessed).toLocaleDateString()}
                                      </span>
                                    )}
                                 </td>
                                 <td className="py-3 px-3 align-top">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleStatus(item)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                                        item.status === "active"
                                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                                          : "bg-red-100 text-red-800 hover:bg-red-200"
                                      }`}
                                    >
                                      {item.status}
                                    </button>
                                 </td>
                                 <td className="py-3 px-3 align-top text-slate-500">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                 </td>
                                 <td className="py-3 px-3 align-top">
                                    <div className="flex items-center gap-2">
                                       <button
                                         type="button"
                                         onClick={() => setRedirectForm({ ...item })}
                                         className="text-[#2271b1] hover:underline text-[12px]"
                                       >
                                          Edit
                                       </button>
                                       <span className="text-slate-300">|</span>
                                       <button
                                         type="button"
                                         onClick={() => handleDeleteRedirect(item._id)}
                                         className="text-[#d63638] hover:underline text-[12px]"
                                       >
                                          Delete
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Pagination */}
               {totalRedirects > 10 && (
                  <div className="flex items-center justify-between pt-4">
                     <span className="text-[12px] text-slate-500">
                       Showing {(redirectsPage - 1) * 10 + 1} to {Math.min(redirectsPage * 10, totalRedirects)} of {totalRedirects} redirects
                     </span>
                     <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={redirectsPage === 1}
                          onClick={() => setRedirectsPage((prev) => Math.max(1, prev - 1))}
                          className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 rounded-[3px] text-[12px] hover:bg-[#f6f7f7] disabled:opacity-50"
                        >
                           Prev
                        </button>
                        <button
                          type="button"
                          disabled={redirectsPage * 10 >= totalRedirects}
                          onClick={() => setRedirectsPage((prev) => prev + 1)}
                          className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 rounded-[3px] text-[12px] hover:bg-[#f6f7f7] disabled:opacity-50"
                        >
                           Next
                        </button>
                     </div>
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab !== "redirects" && (
          <div className="mt-12 pt-6 border-t border-[#c3c4c7]">
             <button
               onClick={handleSave}
               disabled={saving}
               className="bg-[#2271b1] text-white px-6 py-2 rounded-[3px] text-[13px] font-semibold border border-[#2271b1] hover:bg-[#135e96] hover:border-[#135e96] transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_1px_0_#135e96]"
             >
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Save Changes
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

