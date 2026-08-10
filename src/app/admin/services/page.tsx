"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, Loader2, CircleHelp, Save, X,
  ChevronRight, Globe, Layers, ListFilter, Layout,
  Settings, Info, Shield, CheckCircle, CircleHelp as FaqIcon,
  Search, ExternalLink, Image as ImageIcon, Upload,
  Check, MoveUp, MoveDown, Home, Building2, Building,
  Droplets, ShieldCheck, Clock, Award, Users, TrendingUp,
  BadgeCheck, Star, Zap, Sparkles, Palette, Sun, Snowflake,
  Trophy, Hammer, Truck, ClipboardCheck, FileText, ArrowRight,
  Wrench, HardHat, Ruler, Paintbrush, Wind, Flame, Thermometer,
  Copy, Shovel, Fence, Drill, Square, Box, Construction, PenTool as Tool,
  Home as HomeIcon, Map, MapPin, Search as SearchIcon, Settings as SettingsIcon,
  Phone as PhoneIcon, Mail as MailIcon, Globe as GlobeIcon, Layers as LayersIcon,
  Shield as ShieldIcon, ShieldCheck as ShieldCheckIcon, Award as AwardIcon,
  Trophy as TrophyIcon, Zap as ZapIcon, Sparkles as SparklesIcon, Palette as PaletteIcon,
  Sun as SunIcon, Snowflake as SnowflakeIcon, Truck as TruckIcon,
  ClipboardCheck as ClipboardCheckIcon, FileText as FileTextIcon,
  Hammer as HammerIcon, CheckCircle as CheckCircleIcon, Check as CheckIcon,
  ArrowRight as ArrowRightIcon, Users as UsersIcon, TrendingUp as TrendingUpIcon,
  BadgeCheck as BadgeCheckIcon, Star as StarIcon, Clock as ClockIcon,
  Warehouse, Factory, Store, Landmark, Castle, Mountain, Trees,
  ThermometerSnowflake, Droplet, FlameKindling, Lightbulb, Power,
  WashingMachine, Microwave, Speaker, Camera, Video, Monitor,
  Smartphone, Tablet, Laptop, Headphones, Wallet, CreditCard,
  ShoppingCart, Gift, Coffee, Utensils, Pizza, Beer
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageField from "@/components/admin/ImageField";
import SeoEditor from "@/components/admin/SeoEditor";
import BlogSelector from "@/components/admin/BlogSelector";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("@/components/admin/QuillEditor"), {
  ssr: false,
  loading: () => <div className="h-48 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Editor...</div>
});

const ICON_LIST = Array.from(new Set([
  "Home", "Layout", "Building2", "Building", "Droplets", "Shield", "ShieldCheck",
  "Award", "Clock", "BadgeCheck", "TrendingUp", "Star", "Zap", "Sparkles",
  "Palette", "Sun", "Snowflake", "Trophy", "Hammer", "Truck", "ClipboardCheck",
  "FileText", "ArrowRight", "CheckCircle", "Check", "Wrench", "HardHat",
  "Ruler", "Paintbrush", "Wind", "Flame", "Thermometer", "Users",
  "Shovel", "Fence", "Drill", "Square", "Box", "Construction", "Tool",
  "Map", "MapPin", "Search", "Settings", "Phone", "Mail", "Globe", "Layers",
  "Warehouse", "Factory", "Store", "Landmark", "Castle", "Mountain", "Trees",
  "Droplet", "FlameKindling", "Lightbulb", "Power",
  "WashingMachine", "Microwave", "Speaker", "Camera", "Video", "Monitor",
  "Smartphone", "Tablet", "Laptop", "Headphones", "Wallet", "CreditCard",
  "ShoppingCart", "Gift", "Coffee", "Utensils", "Pizza", "Beer",
  "Activity", "Anchor", "Aperture", "Archive", "AtSign", "Bell", "Bluetooth",
  "Book", "Bookmark", "Briefcase", "Calendar", "Cast", "Cloud", "Code",
  "Compass", "Copy", "Cpu", "Database", "Disc", "Download", "Edit", "ExternalLink",
  "Eye", "Facebook", "Feather", "File", "Filter", "Flag", "Folder",
  "Github", "Gitlab", "Grid", "HardDrive", "Hash", "Heart", "HelpCircle",
  "Image", "Inbox", "Instagram", "Key", "LifeBuoy", "Link", "Linkedin",
  "List", "Loader", "Lock", "LogIn", "LogOut", "Maximize", "Menu", "MessageCircle",
  "MessageSquare", "Mic", "Minimize", "Minus", "Moon", "MoreHorizontal", "MoreVertical",
  "MousePointer", "Music", "Navigation", "Octagon", "Package", "Paperclip", "Pause",
  "Percent", "PieChart", "Play", "Plus", "Pocket", "Printer", "Radio",
  "RefreshCcw", "Repeat", "Rewind", "RotateCcw", "RotateCw", "Rss", "Save", "Scissors",
  "Send", "Server", "Share", "ShoppingBag",
  "Shuffle", "SkipBack", "SkipForward", "Slack", "Sliders", "Smile", 
  "SkipBack", "SkipForward", "Sunrise", "Sunset", "Tag",
  "Target", "Terminal", "ThumbsDown", "ThumbsUp", "ToggleLeft",
  "ToggleRight", "Trash", "Trello", "TrendingDown", "Triangle",
  "Tv", "Twitter", "Type", "Umbrella", "Underline", "Unlock", "Upload", "User",
  "Voicemail", "Volume", "Watch", "Wifi", "X", "Youtube"
]));

const IconComponentMap: Record<string, any> = LucideIcons;

function IconSelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = IconComponentMap[value] || CircleHelp;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-[#8c8f94] rounded-[3px] px-3 py-1 text-[13px] hover:border-[#2271b1] transition-all"
      >
        <SelectedIcon className="w-3.5 h-3.5 text-[#50575e]" />
        <span>{value || "Select Icon"}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-[#c3c4c7] shadow-md p-3 rounded-[3px]">
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
            {ICON_LIST.map((iconName) => {
              const IconComp = IconComponentMap[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                  className={`p-1.5 rounded hover:bg-[#f0f0f1] ${value === iconName ? "bg-[#2271b1] text-white" : "text-[#50575e]"}`}
                  title={iconName}
                >
                  {IconComp ? (
                    <IconComp className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 border border-dashed rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_CLINICAL_FIELDS = {
  heroSectionLabel: "CLINICAL RECOVERY PROTOCOL",
  heroDescriptionSuffix: "Targeted manual therapy engineered to eliminate chronic pain, unlock joint mobility, and accelerate athletic recovery.",
  specDurationValue: "60 / 90 Mins",
  specIntensityValue: "Targeted Deep",
  specFocusValue: "Trigger Mapping",
  bookingCta: "Book Appointment Now",
  heroCtaSecondary: "SEE HOW IT HELPS",
  
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
  overviewSuccessRate: "98% SUCCESS",
  tailoredLabel: "100% Tailored Therapy",
  tailoredSub: "Individualized Protocols",
  overviewIntroSuffix: "We map postural compensations and active muscle trigger points to eliminate root-cause pain, flush soreness, and decompress joint structures.",
  overviewCtaText: "BOOK YOUR SESSION NOW",
  overviewHipaaText: "HIPAA Compliant & Certified",
  
  candidateSectionLabel: "TARGET CANDIDATES",
  candidateTitle1: "Who Benefits Most.",
  candidateTitle2: "Clinical Indications.",
  candidateSuitability: "SUITABILITY: OPTIMAL",
  profileBadgePrefix: "PROFILE",
  whoProfiles: [
    {
      label: "Athletes",
      desc: "Competitive athletes needing accelerated recovery between high-intensity training sessions."
    },
    {
      label: "Desk Professionals",
      desc: "Individuals suffering from postural neck, shoulder, or lower back tightness from prolonged sitting."
    },
    {
      label: "Chronic Pain Sufferers",
      desc: "Anyone dealing with persistent muscle knots, joint stiffness, or old injury scar tissue buildup."
    },
    {
      label: "Post-Rehab Patients",
      desc: "People looking to safely regain full range of motion following physical therapy or injury rehabilitation."
    }
  ],
  
  protocolSectionLabel: "02 / SESSION PROTOCOL",
  protocolTitle1: "3-Phase Clinical",
  protocolTitle2: "Treatment Sequence.",
  protocolPhasePrefix: "PHASE 0",
  protocolDurations: ["15 MIN", "45 MIN", "15 MIN"],
  protocolBannerBadge: "CLINICAL EXCELLENCE",
  protocolBannerTitlePrefix: "Ready to experience",
  protocolBannerTitleSuffix: "?",
  protocolBannerCta: "BOOK YOUR SESSION NOW",
  
  sessionSteps: [
    {
      num: "01",
      title: "Postural & Palpation Assessment",
      desc: "We begin with an active range-of-motion test and palpation to pinpoint tight muscle groups and trigger points."
    },
    {
      num: "02",
      title: "Targeted Clinical Bodywork",
      desc: "Hands-on application of deep tissue pressure, myofascial release, and cross-fiber friction adjusted to your comfort level."
    },
    {
      num: "03",
      title: "Post-Session Recovery Plan",
      desc: "We measure mobility improvements post-therapy and provide personalized home stretching recommendations."
    }
  ],
  
  benefits: [
    {
      title: "Decompress Joint Structures",
      description: "Gentle traction and targeted pressure release compression in spinal and peripheral joints."
    },
    {
      title: "Flush Inflammatory Waste",
      description: "Deep strokes stimulate lymphatic drainage and blood flow to clear metabolic waste products."
    },
    {
      title: "Restore Myofascial Glide",
      description: "Manual shearing releases adhesions between muscle layers to allow smooth mechanical motion."
    },
    {
      title: "Accelerate Athletic Recovery",
      description: "Faster tissue repair and reduced muscle soreness between intense training sessions."
    }
  ]
};

export default function ServicesAdminPage() {
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [seo, setSeo] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [quickEditing, setQuickEditing] = useState<any>(null);

  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    image: "",
    icon: "Layout",
    tag: "",
    status: "published",
    bookingCtaUrl: "",
    heroCtaSecondaryUrl: "",
    faq: [],
    faqSchemaMarkup: "",
    faqBadge: "",
    faqTitle: "",
    faqDescription: "",
    blogSection: { title: "", subtitle: "", description: "", selectedPosts: [] },
    ...DEFAULT_CLINICAL_FIELDS
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(json => {
      setData(json);
      setServices(json.services?.services || []);
    });
  }, []);

  useEffect(() => {
    if (isEditing !== null && form.title && !form.id) { // Only auto-slug for new ones
      const generatedSlug = form.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");
      if (form.slug !== generatedSlug) setForm((prev: any) => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title]);

  const saveToDb = async (newServices: any[], keepEditingIdx?: number, updatedForm?: any) => {
    setSaving(true);
    const updatedData = { ...data, services: { ...data.services, services: newServices } };
    try {
      const res = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedData) });
      if (res.ok) {
        setData(updatedData);
        setServices(newServices);
        setToast({ type: "ok", msg: "Services updated." });
        setTimeout(() => setToast(null), 3000);
        if (keepEditingIdx !== undefined) {
          setIsEditing(keepEditingIdx);
          if (updatedForm) {
            setForm(updatedForm);
          }
        } else {
          setIsEditing(null);
        }
      }
    } catch {
      setToast({ type: "err", msg: "Failed to save." });
    } finally { setSaving(false); }
  };

  const handleQuickEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newServices = [...services];
    const idx = services.findIndex(s => s.id === quickEditing.id);
    if (idx !== -1) {
      newServices[idx] = { ...newServices[idx], ...quickEditing };
      saveToDb(newServices);
      setQuickEditing(null);
    }
  };

  const handleSaveService = () => {
    if (!form.title || !form.slug) return alert("Title and slug are required.");

    // Validate bulk FAQ JSON-LD schema markup
    const bulkSchema = (form.faqSchemaMarkup || "").trim();
    if (bulkSchema) {
      try {
        let cleaned = bulkSchema;
        if (cleaned.startsWith("<script")) {
          const closeBracket = cleaned.indexOf(">");
          if (closeBracket !== -1) cleaned = cleaned.substring(closeBracket + 1);
        }
        if (cleaned.endsWith("</script>")) {
          cleaned = cleaned.substring(0, cleaned.length - 9);
        }
        JSON.parse(cleaned.trim());
      } catch (e) {
        alert("Invalid JSON in FAQ Schema Markup. Please correct it before saving.");
        return;
      }
    }


    const newServices = [...services];
    const serviceData = { ...form, seo: seo, id: form.id || Date.now().toString(), number: form.number || (services.length + 1).toString().padStart(2, '0') };
    
    let targetIdx = isEditing;
    if (isEditing !== null && isEditing < services.length) {
      newServices[isEditing] = serviceData;
    } else {
      targetIdx = services.length;
      newServices.push(serviceData);
    }
    saveToDb(newServices, targetIdx !== null ? targetIdx : undefined, serviceData);
  };

  const handleEdit = (service: any) => {
    const originalIdx = services.findIndex(orig => orig.id === service.id);
    setForm({
      ...DEFAULT_CLINICAL_FIELDS,
      ...service,
      bookingCtaUrl: service.bookingCtaUrl || "",
      heroCtaSecondaryUrl: service.heroCtaSecondaryUrl || "",
      stats: service.stats || [],
      benefits: service.benefits || [],
      process: service.process || [],
      faq: service.faq || [],
      faqSchemaMarkup: service.faqSchemaMarkup || "",
      faqBadge: service.faqBadge || "",
      faqTitle: service.faqTitle || "",
      faqDescription: service.faqDescription || "",
      whoProfiles: service.whoProfiles || DEFAULT_CLINICAL_FIELDS.whoProfiles,
      sessionSteps: service.sessionSteps || DEFAULT_CLINICAL_FIELDS.sessionSteps,
      protocolDurations: service.protocolDurations || DEFAULT_CLINICAL_FIELDS.protocolDurations
    });
    setSeo(service.seo || {});
    setIsEditing(originalIdx);
    setActiveTab("general");
  };

  const toggleStatus = (service: any) => {
    const newServices = [...services];
    const originalIdx = services.findIndex(orig => orig.id === service.id);
    if (originalIdx === -1) return;
    const s = newServices[originalIdx];
    newServices[originalIdx] = { ...s, status: s.status === 'published' ? 'draft' : 'published' };
    saveToDb(newServices);
  };

  const handleDuplicate = (idx: number) => {
    const s = filteredServices[idx];
    const newService = {
      ...s,
      id: Date.now().toString(),
      title: `${s.title} (Copy)`,
      slug: `${s.slug}-copy`,
      status: 'draft'
    };
    const newServices = [...services, newService];
    saveToDb(newServices);
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedIds.length) return;

    let newServices = [...services];
    if (action === 'delete') {
      if (!confirm(`Permanently delete ${selectedIds.length} services?`)) return;
      newServices = services.filter(s => !selectedIds.includes(s.id));
    } else if (action === 'trash') {
      newServices = services.map(s => selectedIds.includes(s.id) ? { ...s, isTrashed: true, trashedAt: new Date().toISOString() } : s);
    } else if (action === 'restore') {
      newServices = services.map(s => selectedIds.includes(s.id) ? { ...s, isTrashed: false, trashedAt: null } : s);
    } else if (action === 'publish' || action === 'draft') {
      const newStatus = action === 'publish' ? 'published' : 'draft';
      newServices = services.map(s => selectedIds.includes(s.id) ? { ...s, status: newStatus } : s);
    } else {
      return;
    }

    saveToDb(newServices);
    setSelectedIds([]);
  };



  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const isTrashed = s.isTrashed === true;

    if (filter === 'trash') return matchesSearch && isTrashed;
    if (isTrashed) return false;

    return matchesSearch && (filter === 'all' || s.status === filter);
  });

  if (!data) return <div className="flex h-screen items-center justify-center text-[#646970] font-serif">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* WP Header Area */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Services</h1>
        {isEditing === null && (
          <button
            onClick={() => {
              setIsEditing(services.length);
              setForm({
                title: "",
                slug: "",
                tagline: "",
                description: "",
                image: "",
                icon: "Layout",
                tag: "",
                status: "published",
                faq: [],
                faqSchemaMarkup: "",
                faqBadge: "",
                faqTitle: "",
                faqDescription: "",
                blogSection: { title: "", subtitle: "", description: "", selectedPosts: [] },
                ...DEFAULT_CLINICAL_FIELDS
              });
              setSeo({});
              setActiveTab("general");
            }}
            className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] hover:text-[#135e96] hover:border-[#135e96] px-2 py-1 text-[13px] rounded-[3px] transition-colors"
          >
            Add New
          </button>
        )}
      </div>

      {toast && (
        <div className={`px-4 py-2 border-l-4 text-[13px] bg-white shadow-sm mb-4 ${toast.type === 'ok' ? 'border-[#00a32a]' : 'border-[#d63638]'}`}>
          {toast.msg}
        </div>
      )}

      {isEditing !== null ? (
        <div className="space-y-4">
          <div className="flex items-center gap-1 text-[13px] text-[#2271b1] px-1">
            <button onClick={() => setIsEditing(null)} className="hover:underline">Services</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#646970] shrink-0" />
            <span className="text-[#646970] truncate">{form.title || "New Service"}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Form Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm p-6">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-[#8c8f94] px-3 py-2 text-[18px] font-medium rounded-[3px] focus:border-[#2271b1] outline-none mb-4"
                placeholder="Enter service title here"
              />

              {/* WP-Style Tabs for Service Editor */}
              <div className="space-y-4 mb-6">
                {/* Line 1: Core Tabs */}
                <div className="flex flex-wrap border-b border-[#c3c4c7]">
                  {[
                    { id: "general", label: "General Info" },
                    { id: "branding-specs", label: "Hero & Specs" },
                    { id: "overview", label: "Overview" },
                    { id: "stats-candidates", label: "Stats & Candidates" },
                    { id: "stepper", label: "Stepper Protocol" },
                    { id: "benefits", label: "Key Benefits" },
                    { id: "faq", label: "FAQs" },
                    { id: "blog", label: "Blog" },
                    { id: "seo", label: "SEO" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-[13px] border-b-2 transition-all ${
                        activeTab === tab.id
                          ? 'border-[#2271b1] text-[#1d2327] font-bold'
                          : 'border-transparent text-[#2271b1] hover:text-[#135e96]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 min-h-[400px]">
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Category Tag</label>
                        <input type="text" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Menu Icon</label>
                        <IconSelector value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <ImageField label="Breadcrumb Banner Image" value={form.breadcrumbImage || ""} onChange={(v) => setForm({ ...form, breadcrumbImage: v })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Breadcrumb Overlay Text</label>
                      <input type="text" placeholder="e.g. Expert Solutions" value={form.breadcrumbText || ""} onChange={(e) => setForm({ ...form, breadcrumbText: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Hero Description / Subtitle</label>
                      <textarea placeholder="e.g. Professional services with military precision..." value={form.heroDescription || ""} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] h-20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Short Description (Card View)</label>
                      <QuillEditor
                        content={form.description}
                        onChange={(v) => setForm({ ...form, description: v })}
                        placeholder="Write a short description shown on service cards..."
                      />
                    </div>
                  </div>
                )}
                {activeTab === "branding-specs" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Hero Section Label / Badge</label>
                      <input type="text" value={form.heroSectionLabel || ""} onChange={(e) => setForm({ ...form, heroSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Hero Description Suffix</label>
                      <textarea value={form.heroDescriptionSuffix || ""} onChange={(e) => setForm({ ...form, heroDescriptionSuffix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] h-20" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Duration Value</label>
                        <input type="text" value={form.specDurationValue || ""} onChange={(e) => setForm({ ...form, specDurationValue: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. 60 / 90 Mins" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Intensity Value</label>
                        <input type="text" value={form.specIntensityValue || ""} onChange={(e) => setForm({ ...form, specIntensityValue: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Targeted Deep" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Focus Value</label>
                        <input type="text" value={form.specFocusValue || ""} onChange={(e) => setForm({ ...form, specFocusValue: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Trigger Mapping" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Primary Booking CTA text</label>
                        <input type="text" value={form.bookingCta || ""} onChange={(e) => setForm({ ...form, bookingCta: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Primary Booking CTA Link (URL)</label>
                        <input type="text" placeholder="Defaults to global booking link" value={form.bookingCtaUrl || ""} onChange={(e) => setForm({ ...form, bookingCtaUrl: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Secondary CTA button text</label>
                        <input type="text" value={form.heroCtaSecondary || ""} onChange={(e) => setForm({ ...form, heroCtaSecondary: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Secondary CTA Link (URL)</label>
                        <input type="text" placeholder="Defaults to /services/slug" value={form.heroCtaSecondaryUrl || ""} onChange={(e) => setForm({ ...form, heroCtaSecondaryUrl: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Overview Badge / Label</label>
                      <input type="text" value={form.overviewSectionLabel || ""} onChange={(e) => setForm({ ...form, overviewSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Overview Title (Part 1 - Regular)</label>
                        <input type="text" value={form.overviewTitle1 || ""} onChange={(e) => setForm({ ...form, overviewTitle1: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Overview Title (Part 2 - Gold Italic)</label>
                        <input type="text" value={form.overviewTitle2 || ""} onChange={(e) => setForm({ ...form, overviewTitle2: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <ImageField label="Overview Background/Featured Image" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Overview Watermark Text</label>
                        <input type="text" value={form.overviewWatermark || ""} onChange={(e) => setForm({ ...form, overviewWatermark: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Success Rate Badge Right Text</label>
                        <input type="text" value={form.overviewSuccessRate || ""} onChange={(e) => setForm({ ...form, overviewSuccessRate: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Floating Badge Title</label>
                        <input type="text" value={form.tailoredLabel || ""} onChange={(e) => setForm({ ...form, tailoredLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. 100% Tailored Therapy" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Floating Badge Subtitle</label>
                        <input type="text" value={form.tailoredSub || ""} onChange={(e) => setForm({ ...form, tailoredSub: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Individualized Protocols" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold">Overview Description / Suffix</label>
                      <textarea value={form.overviewIntroSuffix || ""} onChange={(e) => setForm({ ...form, overviewIntroSuffix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] h-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Overview CTA Button Text</label>
                        <input type="text" value={form.overviewCtaText || ""} onChange={(e) => setForm({ ...form, overviewCtaText: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Overview HIPAA / Security text</label>
                        <input type="text" value={form.overviewHipaaText || ""} onChange={(e) => setForm({ ...form, overviewHipaaText: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "stats-candidates" && (
                  <div className="space-y-8">
                    {/* 4 Stats Cards */}
                    <div className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                      <h3 className="text-[14px] font-bold border-b border-[#c3c4c7] pb-2 text-[#1d2327]">Highlight Stats Strip (4 Items)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold block">Stat 1 Value & Label</label>
                          <div className="flex gap-2">
                            <input type="text" value={form.statsItem1Val || ""} onChange={(e) => setForm({ ...form, statsItem1Val: e.target.value })} className="w-24 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. 98%" />
                            <input type="text" value={form.statsItem1Label || ""} onChange={(e) => setForm({ ...form, statsItem1Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. Pain Relief" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold block">Stat 2 Value & Label</label>
                          <div className="flex gap-2">
                            <input type="text" value={form.statsItem2Val || ""} onChange={(e) => setForm({ ...form, statsItem2Val: e.target.value })} className="w-24 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. 5,000+" />
                            <input type="text" value={form.statsItem2Label || ""} onChange={(e) => setForm({ ...form, statsItem2Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. Sessions" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold block">Stat 3 Value & Label</label>
                          <div className="flex gap-2">
                            <input type="text" value={form.statsItem3Val || ""} onChange={(e) => setForm({ ...form, statsItem3Val: e.target.value })} className="w-24 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. Est. 2020" />
                            <input type="text" value={form.statsItem3Label || ""} onChange={(e) => setForm({ ...form, statsItem3Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. Standard" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold block">Stat 4 Value & Label</label>
                          <div className="flex gap-2">
                            <input type="text" value={form.statsItem4Val || ""} onChange={(e) => setForm({ ...form, statsItem4Val: e.target.value })} className="w-24 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. 100%" />
                            <input type="text" value={form.statsItem4Label || ""} onChange={(e) => setForm({ ...form, statsItem4Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="e.g. Protocols" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Candidates Section Config */}
                    <div className="space-y-4">
                      <h3 className="text-[14px] font-bold border-b border-[#c3c4c7] pb-2 text-[#1d2327]">Target Candidates Section Config</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Candidates Badge / Label</label>
                          <input type="text" value={form.candidateSectionLabel || ""} onChange={(e) => setForm({ ...form, candidateSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Profiles Badge Prefix</label>
                          <input type="text" value={form.profileBadgePrefix || ""} onChange={(e) => setForm({ ...form, profileBadgePrefix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Heading Part 1</label>
                          <input type="text" value={form.candidateTitle1 || ""} onChange={(e) => setForm({ ...form, candidateTitle1: e.target.value })} className="w-full border border-[#8c8f94] px-2 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Heading Part 2 (Italic)</label>
                          <input type="text" value={form.candidateTitle2 || ""} onChange={(e) => setForm({ ...form, candidateTitle2: e.target.value })} className="w-full border border-[#8c8f94] px-2 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Suitability Footer Label</label>
                          <input type="text" value={form.candidateSuitability || ""} onChange={(e) => setForm({ ...form, candidateSuitability: e.target.value })} className="w-full border border-[#8c8f94] px-2 py-1 text-xs rounded-[2px]" />
                        </div>
                      </div>

                      {/* Repeatable Profiles */}
                      <div className="space-y-3 pt-4">
                        <h4 className="text-xs font-bold border-b border-[#f0f0f1] pb-1 text-[#646970] uppercase tracking-wider">Candidate Profiles</h4>
                        {(form.whoProfiles || []).map((p: any, pIdx: number) => (
                          <div key={pIdx} className="bg-white border border-[#c3c4c7] p-3 rounded-sm space-y-2">
                            <div className="flex gap-2 justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#2271b1]">PROFILE #{pIdx + 1}</span>
                              <button type="button" onClick={() => {
                                const np = form.whoProfiles.filter((_: any, idx: number) => idx !== pIdx);
                                setForm({ ...form, whoProfiles: np });
                              }} className="text-[#d63638] text-xs">Remove</button>
                            </div>
                            <div className="space-y-1.5">
                              <input type="text" value={p.label || ""} onChange={(e) => {
                                const np = [...form.whoProfiles];
                                np[pIdx] = { ...np[pIdx], label: e.target.value };
                                setForm({ ...form, whoProfiles: np });
                              }} className="w-full border border-[#8c8f94] px-2.5 py-1 text-xs font-bold" placeholder="Profile Title (e.g. Athletes)" />
                              <textarea value={p.desc || ""} onChange={(e) => {
                                const np = [...form.whoProfiles];
                                np[pIdx] = { ...np[pIdx], desc: e.target.value };
                                setForm({ ...form, whoProfiles: np });
                              }} className="w-full border border-[#8c8f94] px-2.5 py-1 text-xs h-16" placeholder="Profile indications and descriptions..." />
                              <input type="text" value={p.suitability || ""} onChange={(e) => {
                                const np = [...form.whoProfiles];
                                np[pIdx] = { ...np[pIdx], suitability: e.target.value };
                                setForm({ ...form, whoProfiles: np });
                              }} className="w-full border border-[#8c8f94] px-2.5 py-1 text-xs text-[#be9c25] font-mono" placeholder="Card Suitability Label (optional, e.g. SUITABILITY: OPTIMAL)" />
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => setForm({ ...form, whoProfiles: [...(form.whoProfiles || []), { label: "", desc: "", suitability: "" }] })} className="text-[#2271b1] text-xs underline font-bold">+ Add Profile</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "stepper" && (
                  <div className="space-y-8">
                    {/* Stepper Section Config */}
                    <div className="space-y-4">
                      <h3 className="text-[14px] font-bold border-b border-[#c3c4c7] pb-2 text-[#1d2327]">Stepper Section Config</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Stepper Section Badge</label>
                          <input type="text" value={form.protocolSectionLabel || ""} onChange={(e) => setForm({ ...form, protocolSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Phase Prefix Label</label>
                          <input type="text" value={form.protocolPhasePrefix || ""} onChange={(e) => setForm({ ...form, protocolPhasePrefix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Heading Part 1</label>
                          <input type="text" value={form.protocolTitle1 || ""} onChange={(e) => setForm({ ...form, protocolTitle1: e.target.value })} className="w-full border border-[#8c8f94] px-2 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Heading Part 2 (Gold Italic)</label>
                          <input type="text" value={form.protocolTitle2 || ""} onChange={(e) => setForm({ ...form, protocolTitle2: e.target.value })} className="w-full border border-[#8c8f94] px-2 py-1 text-xs rounded-[2px]" />
                        </div>
                      </div>

                      {/* Step Sequence Details */}
                      <div className="space-y-4 pt-4">
                        <h4 className="text-xs font-bold border-b border-[#f0f0f1] pb-1 text-[#646970] uppercase tracking-wider">Stepper Treatment Phases</h4>
                        {(form.sessionSteps || []).map((step: any, sIdx: number) => (
                          <div key={sIdx} className="bg-white border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                            <div className="flex justify-between items-center border-b border-[#f0f0f1] pb-2">
                              <span className="text-[11px] font-mono font-bold text-[#2271b1]">PHASE {step.num || `0${sIdx+1}`}</span>
                              <div className="flex gap-4 items-center">
                                <div className="space-y-0.5">
                                  <label className="text-[10px] text-[#646970]">Phase Duration</label>
                                  <input type="text" value={form.protocolDurations?.[sIdx] || ""} onChange={(e) => {
                                    const nd = [...(form.protocolDurations || ["15 MIN", "45 MIN", "15 MIN"])];
                                    nd[sIdx] = e.target.value;
                                    setForm({ ...form, protocolDurations: nd });
                                  }} className="w-20 border border-[#8c8f94] px-2 py-0.5 text-xs text-center font-mono" placeholder="15 MIN" />
                                </div>
                                <button type="button" onClick={() => {
                                  const ns = form.sessionSteps.filter((_: any, idx: number) => idx !== sIdx);
                                  setForm({ ...form, sessionSteps: ns });
                                }} className="text-[#d63638] text-xs">Remove</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] text-[#646970]">Step Title</label>
                                <input type="text" value={step.title || ""} onChange={(e) => {
                                  const ns = [...form.sessionSteps];
                                  ns[sIdx] = { ...ns[sIdx], title: e.target.value };
                                  setForm({ ...form, sessionSteps: ns });
                                }} className="w-full border border-[#8c8f94] px-2 py-1 text-xs font-bold" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-[#646970]">Step Description</label>
                                <textarea value={step.desc || ""} onChange={(e) => {
                                  const ns = [...form.sessionSteps];
                                  ns[sIdx] = { ...ns[sIdx], desc: e.target.value };
                                  setForm({ ...form, sessionSteps: ns });
                                }} className="w-full border border-[#8c8f94] px-2 py-1 text-xs h-16" />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => {
                          const nextNum = `0${(form.sessionSteps || []).length + 1}`;
                          setForm({ ...form, sessionSteps: [...(form.sessionSteps || []), { num: nextNum, title: "", desc: "" }] });
                        }} className="text-[#2271b1] text-xs underline font-bold">+ Add Step</button>
                      </div>
                    </div>

                    {/* Banner Config */}
                    <div className="space-y-4 border-t border-[#c3c4c7] pt-6">
                      <h3 className="text-[14px] font-bold border-b border-[#c3c4c7] pb-2 text-[#1d2327]">Bottom CTA Stepper Banner</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Banner Top Badge</label>
                          <input type="text" value={form.protocolBannerBadge || ""} onChange={(e) => setForm({ ...form, protocolBannerBadge: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Banner Button CTA text</label>
                          <input type="text" value={form.protocolBannerCta || ""} onChange={(e) => setForm({ ...form, protocolBannerCta: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Title Prefix (e.g. Ready to experience)</label>
                          <input type="text" value={form.protocolBannerTitlePrefix || ""} onChange={(e) => setForm({ ...form, protocolBannerTitlePrefix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Title Suffix (e.g. ?)</label>
                          <input type="text" value={form.protocolBannerTitleSuffix || ""} onChange={(e) => setForm({ ...form, protocolBannerTitleSuffix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1 text-xs rounded-[2px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-2">
                      <h3 className="text-[14px] font-bold text-[#1d2327]">Key Clinical Benefits</h3>
                      <button type="button" onClick={() => setForm({ ...form, benefits: [...(form.benefits || []), { title: "", description: "" }] })} className="text-[#2271b1] text-xs underline font-bold">+ Add Benefit</button>
                    </div>
                    <div className="space-y-4">
                      {(form.benefits || []).map((b: any, i: number) => (
                        <div key={i} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                          <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-1">
                            <span className="text-[11px] font-mono font-bold text-[#2271b1]">BENEFIT #{i+1}</span>
                            <button type="button" onClick={() => {
                              const nb = form.benefits.filter((_: any, idx: number) => idx !== i);
                              setForm({ ...form, benefits: nb });
                            }} className="text-[#d63638] text-xs">Remove</button>
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-xs font-bold">Title</label>
                              <input type="text" value={b.title || ""} onChange={(e) => {
                                const nb = [...form.benefits];
                                nb[i] = { ...nb[i], title: e.target.value };
                                setForm({ ...form, benefits: nb });
                              }} className="w-full border border-[#8c8f94] px-3 py-1 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold">Description</label>
                              <textarea value={b.description || ""} onChange={(e) => {
                                const nb = [...form.benefits];
                                nb[i] = { ...nb[i], description: e.target.value };
                                setForm({ ...form, benefits: nb });
                              }} className="w-full border border-[#8c8f94] px-3 py-1 text-xs h-16" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-[#c3c4c7]">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">FAQ Section Badge</label>
                        <input
                          type="text"
                          value={form.faqBadge || ""}
                          onChange={(e) => setForm({ ...form, faqBadge: e.target.value })}
                          placeholder="e.g. Got Questions?"
                          className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-sm focus:border-[#2271b1] outline-none bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">FAQ Section Heading</label>
                        <input
                          type="text"
                          value={form.faqTitle || ""}
                          onChange={(e) => setForm({ ...form, faqTitle: e.target.value })}
                          placeholder="e.g. Frequently Asked Questions"
                          className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-sm focus:border-[#2271b1] outline-none bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">FAQ Section Description</label>
                        <input
                          type="text"
                          value={form.faqDescription || ""}
                          onChange={(e) => setForm({ ...form, faqDescription: e.target.value })}
                          placeholder="e.g. Answers to common questions..."
                          className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-sm focus:border-[#2271b1] outline-none bg-white"
                        />
                      </div>
                    </div>

                    <button onClick={() => setForm({ ...form, faq: [...(form.faq || []), { question: "", answer: "" }] })} className="text-[#2271b1] text-xs underline font-bold">+ Add FAQ Item</button>
                    {form.faq?.map((item: any, i: number) => (
                      <div key={i} className="bg-white border border-[#c3c4c7] p-4 space-y-3 shadow-sm">
                        <input value={item.question} onChange={(e) => { const nf = [...form.faq]; nf[i] = { ...nf[i], question: e.target.value }; setForm({ ...form, faq: nf }); }} placeholder="Question" className="w-full border border-[#8c8f94] px-2 py-1 text-xs font-bold" />
                        <QuillEditor
                          content={item.answer}
                          onChange={(v) => { const nf = [...form.faq]; nf[i] = { ...nf[i], answer: v }; setForm({ ...form, faq: nf }); }}
                          placeholder="Write the answer to this FAQ..."
                        />
                        <button onClick={() => { const nf = form.faq.filter((_: any, idx: number) => idx !== i); setForm({ ...form, faq: nf }); }} className="text-[#d63638] text-xs">Remove FAQ</button>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-[#c3c4c7] space-y-1">
                      <label className="text-[13px] font-bold">FAQ Schema Markup (Bulk JSON-LD)</label>
                      <p className="text-[11px] text-[#646970]">Paste a single JSON-LD schema block covering all FAQs for this service.</p>
                      <textarea
                        value={form.faqSchemaMarkup || ""}
                        onChange={(e) => setForm({ ...form, faqSchemaMarkup: e.target.value })}
                        placeholder='e.g. {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [...]}'
                        className="w-full border border-[#8c8f94] px-2 py-1.5 text-xs font-mono"
                        rows={8}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "blog" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Blog Section Title</label>
                        <input type="text" value={form.blogSection?.title || ""} onChange={(e) => setForm({ ...form, blogSection: { ...(form.blogSection || {}), title: e.target.value } })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Blog Section Subtitle</label>
                        <input type="text" value={form.blogSection?.subtitle || ""} onChange={(e) => setForm({ ...form, blogSection: { ...(form.blogSection || {}), subtitle: e.target.value } })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Blog Section Description</label>
                        <QuillEditor
                          content={form.blogSection?.description || ""}
                          onChange={(v) => setForm({ ...form, blogSection: { ...(form.blogSection || {}), description: v } })}
                          placeholder="Write a description for the blog section..."
                        />
                      </div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-[#c3c4c7]">
                      <h3 className="text-sm font-bold">Select Featured Posts</h3>
                      <BlogSelector
                        selectedIds={form.blogSection?.selectedPosts || []}
                        onChange={(ids) => setForm({ ...form, blogSection: { ...(form.blogSection || {}), selectedPosts: ids } })}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <SeoEditor data={seo} setData={setSeo} pageSlug={form.slug} pageTitle={form.title} pageContent={form} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Publish Box */}
          <div className="lg:col-span-1 space-y-6 sticky top-4">
            <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
              <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                <h2 className="text-[14px] font-semibold text-[#1d2327]">Publish</h2>
              </div>
              <div className="p-4 space-y-4 text-[13px] text-[#2c3338]">
                <div className="flex flex-col gap-2">
                  <p><strong>Status:</strong> {form.status === 'published' ? 'Published' : 'Draft'} <Link href="#" className="text-[#2271b1] underline ml-1">Edit</Link></p>
                  <p><strong>Visibility:</strong> Public <Link href="#" className="text-[#2271b1] underline ml-1">Edit</Link></p>
                  {form.slug && (
                    <p className="flex items-center gap-1">
                      <strong>Permalink:</strong>
                      <Link href={`/${form.slug}/`} target="_blank" className="text-[#2271b1] hover:underline truncate max-w-[150px] inline-flex items-center gap-1">
                        View Service <ExternalLink className="w-3 h-3" />
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              <div className="px-3 py-2 bg-[#f6f7f7] border-t border-[#c3c4c7] flex justify-between items-center">
                <button onClick={() => setIsEditing(null)} className="text-[#d63638] underline text-[13px]">Cancel</button>
                <button
                  onClick={handleSaveService}
                  disabled={saving}
                  className="bg-[#2271b1] text-white px-4 py-1.5 rounded-[3px] text-[13px] font-semibold border border-[#2271b1] hover:bg-[#135e96] flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isEditing !== null && isEditing < services.length ? "Update" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        /* WP List View */
        <div className="space-y-4">
          {/* Filter Links */}
          <div className="flex items-center gap-2 text-[13px] mb-2">
            <button onClick={() => setFilter("all")} className={`${filter === 'all' ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              All <span className="text-[#646970] font-normal">({services.length})</span>
            </button>
            <span className="text-[#c3c4c7]">|</span>
            <button onClick={() => setFilter("published")} className={`${filter === 'published' ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              Published <span className="text-[#646970] font-normal">({services.filter(s => s.status === 'published').length})</span>
            </button>
            <span className="text-[#c3c4c7]">|</span>
            <button onClick={() => setFilter("draft")} className={`${filter === 'draft' ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              Drafts <span className="text-[#646970] font-normal">({services.filter(s => s.status === 'draft' && !s.isTrashed).length})</span>
            </button>
            <span className="text-[#c3c4c7]">|</span>
            <button onClick={() => setFilter("trash")} className={`${filter === 'trash' ? 'text-black font-bold' : 'text-[#d63638] underline decoration-transparent hover:decoration-current'}`}>
              Trash <span className="text-[#646970] font-normal">({services.filter(s => s.isTrashed).length})</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <select
                className="border border-[#8c8f94] bg-white text-[#2c3338] px-2 py-1 text-[13px] rounded-[3px] outline-none"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Bulk actions</option>
                {filter === 'trash' ? (
                  <>
                    <option value="restore">Restore</option>
                    <option value="delete">Delete Permanently</option>
                  </>
                ) : (
                  <>
                    <option value="publish">Mark as Published</option>
                    <option value="draft">Mark as Draft</option>
                    <option value="trash">Move to Trash</option>
                  </>
                )}
              </select>
              <button
                onClick={() => { handleBulkAction(bulkAction); setBulkAction(""); }}
                className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7]"
              >
                Apply
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Search Services" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1]" />
              <button className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7]">Search</button>
            </div>
          </div>

          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c3c4c7] bg-white text-[#1d2327]">
                  <th className="w-8 py-2 px-3 align-top"><input type="checkbox" className="w-4 h-4 border-[#8c8f94] rounded-[3px]" /></th>
                  <th className="py-2 px-3 text-[14px] font-semibold">Service Name</th>
                  <th className="py-2 px-3 text-[14px] font-semibold w-40">Category</th>
                  <th className="py-2 px-3 text-[14px] font-semibold w-32">Status</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[#2c3338]">
                {filteredServices.map((service, idx) => {
                  const ServiceIcon = IconComponentMap[service.icon] || Layout;
                  return (
                    <tr key={idx} className={`border-b border-[#f0f0f1] group ${idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1]`}>
                      <td className="py-4 px-3 align-top">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(service.id)}
                          onChange={() => setSelectedIds(prev => prev.includes(service.id) ? prev.filter(i => i !== service.id) : [...prev, service.id])}
                          className="w-4 h-4 border-[#8c8f94] rounded-[3px]"
                        />
                      </td>
                      <td className="py-4 px-3 align-top">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-white border border-[#c3c4c7] rounded-[3px] flex items-center justify-center text-[#8c8f94] shrink-0">
                            <ServiceIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <strong className="text-[#2271b1] block text-[14px]">{service.title} {service.status === 'draft' && <span className="text-[#646970] font-normal italic">— Draft</span>}</strong>
                            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(service)} className="text-[#2271b1] hover:underline text-[12px]">Edit</button>
                              <span className="text-[#a7aaad]">|</span>
                              <button onClick={() => setQuickEditing(service)} className="text-[#2271b1] hover:underline text-[12px]">Quick Edit</button>
                              <span className="text-[#a7aaad]">|</span>
                              <button onClick={() => toggleStatus(service)} className="text-[#2271b1] hover:underline text-[12px]">
                                {service.status === 'draft' ? 'Publish' : 'Set as Draft'}
                              </button>
                              <span className="text-[#a7aaad]">|</span>
                              <Link href={`/${service.slug}/`} target="_blank" className="text-[#2271b1] hover:underline text-[12px]">View</Link>
                              <span className="text-[#a7aaad]">|</span>
                              <button onClick={() => handleDuplicate(idx)} className="text-[#2271b1] hover:underline text-[12px]">Duplicate</button>
                              <span className="text-[#a7aaad]">|</span>
                              {service.isTrashed ? (
                                <>
                                  <button onClick={() => {
                                    const ns = [...services];
                                    const sidx = ns.findIndex(orig => orig.id === service.id);
                                    if (sidx !== -1) { ns[sidx] = { ...ns[sidx], isTrashed: false, trashedAt: null }; saveToDb(ns); }
                                  }} className="text-[#2271b1] hover:underline text-[12px]">Restore</button>
                                  <span className="text-[#a7aaad]">|</span>
                                  <button onClick={() => { if (confirm("Permanently delete this service?")) saveToDb(services.filter(orig => orig.id !== service.id)); }} className="text-[#d63638] hover:underline text-[12px]">Delete Permanently</button>
                                </>
                              ) : (
                                <button onClick={() => {
                                  const ns = [...services];
                                  const sidx = ns.findIndex(orig => orig.id === service.id);
                                  if (sidx !== -1) { ns[sidx] = { ...ns[sidx], isTrashed: true, trashedAt: new Date().toISOString() }; saveToDb(ns); }
                                }} className="text-[#d63638] hover:underline text-[12px]">Trash</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 align-top text-[#50575e]">{service.tag}</td>
                      <td className="py-4 px-3 align-top">
                        <span className={`font-semibold ${service.status === 'draft' ? 'text-[#d63638]' : 'text-[#00a32a]'}`}>
                          {service.status === 'draft' ? 'Draft' : 'Published'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Edit Modal */}
      <AnimatePresence>
        {quickEditing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickEditing(null)} className="absolute inset-0 bg-[#00000066]" />
            <motion.div
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#f1f1f1] border border-[#c3c4c7] shadow-lg rounded-[3px] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#c3c4c7]">
                <h2 className="text-[#1d2327] text-lg font-normal font-serif">Quick Edit Service</h2>
                <button onClick={() => setQuickEditing(null)} className="text-[#787c82] hover:text-[#d63638]"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleQuickEditSave}>
                <div className="p-6 bg-[#f0f0f1] grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#1d2327] text-[12px] font-bold mb-1">Service Title</label>
                      <input
                        type="text"
                        value={quickEditing.title}
                        onChange={(e) => setQuickEditing({ ...quickEditing, title: e.target.value })}
                        className="w-full border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1d2327] text-[12px] font-bold mb-1">Slug</label>
                      <input
                        type="text"
                        value={quickEditing.slug}
                        onChange={(e) => setQuickEditing({ ...quickEditing, slug: e.target.value })}
                        className="w-full border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#1d2327] text-[12px] font-bold mb-1">Category Tag</label>
                      <input
                        type="text"
                        value={quickEditing.tag}
                        onChange={(e) => setQuickEditing({ ...quickEditing, tag: e.target.value })}
                        className="w-full border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1d2327] text-[12px] font-bold mb-1">Status</label>
                      <select
                        value={quickEditing.status}
                        onChange={(e) => setQuickEditing({ ...quickEditing, status: e.target.value })}
                        className="w-full border border-[#8c8f94] bg-white px-2 py-1 text-[13px] rounded-[3px] outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-4 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7]">
                  <button type="button" onClick={() => setQuickEditing(null)} className="text-[#2271b1] text-[13px] hover:text-[#135e96]">Cancel</button>
                  <button
                    type="submit"
                    className="bg-[#2271b1] text-white text-[13px] font-bold px-4 py-1.5 rounded-[3px] border border-[#135e96] hover:bg-[#135e96]"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
