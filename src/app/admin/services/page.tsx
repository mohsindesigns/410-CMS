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
  BadgeCheck as BadgeCheckIcon, Star as StarIcon, Clock as ClockIcon
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageField from "@/components/admin/ImageField";
import SeoEditor from "@/components/admin/SeoEditor";
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
  "Activity", "Heart", "Target", "Zap", "Star"
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
                  type="button"
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

const DEFAULT_SERVICE_FIELDS = {
  // 1. Hero
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

  // 2. Stats
  statsItem1Val: "8 Yrs",
  statsItem1Label: "Clinical Experience",
  statsItem2Val: "5.0 ★",
  statsItem2Label: "Google Reviews",
  statsItem3Val: "100%",
  statsItem3Label: "Satisfaction Guarantee",
  statsItem4Val: "5,000+",
  statsItem4Label: "Sessions Completed",

  // 3. Clinical Overview & Patterns
  overviewSectionLabel: "FIX THE PATTERNS THAT KEEP PAIN RETURNING",
  overviewTitle1: "Targeted Bodywork.",
  overviewTitle2: "Engineered For Recovery.",
  overviewWatermark: "SPECIALIST PRACTICE • EST. 2020",
  overviewSuccessRate: "5.0 RATED PRACTICE",
  tailoredLabel: "100% Tailored Therapy",
  tailoredSub: "Individualized Protocols",
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
  faq: [
    {
      question: "What is corrective movement therapy, and who is it for?",
      answer: "Corrective movement therapy looks at how you move through simple tasks and mobility drills. It suits active adults with stiffness or inefficient movement habits."
    },
    {
      question: "How is corrective movement therapy different from physical therapy?",
      answer: "Physical therapy is licensed medical healthcare for diagnosed injuries and rehabilitation. Corrective movement focuses on soft tissue feel, movement mechanics, and safe exercise cues."
    },
    {
      question: "Can corrective movement therapy help recurring back pain or sciatica?",
      answer: "Research supports guided movement for chronic non-specific discomfort. We keep movement comfortable and refer to medical providers when red flags appear."
    },
    {
      question: "What happens at the first session, and what should I wear?",
      answer: "We discuss symptoms, evaluate movement, apply targeted hands-on work, and practice drills. Wear comfortable clothing that lets you bend and move freely."
    },
    {
      question: "How many sessions will I need, and do I need a referral?",
      answer: "There is no fixed count. We plan your visits based on response. No medical referral is required to book a session."
    }
  ],
  faqSchemaMarkup: ""
};

export default function ServicesAdminPage() {
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [seo, setSeo] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [quickEditing, setQuickEditing] = useState<any>(null);

  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    image: "",
    icon: "Activity",
    tag: "",
    status: "published",
    ...DEFAULT_SERVICE_FIELDS
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(json => {
      setData(json);
      setServices(json.services?.services || []);
    });
  }, []);

  useEffect(() => {
    if (isEditing !== null && form.title && !form.id) {
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
        setToast({ type: "ok", msg: "Services saved successfully." });
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
    const serviceData = {
      ...form,
      seo: seo,
      id: form.id || Date.now().toString(),
      number: form.number || (services.length + 1).toString().padStart(2, '0')
    };
    
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
      ...DEFAULT_SERVICE_FIELDS,
      ...service,
      // Ensure arrays fall back gracefully
      benefits: (service.benefits && service.benefits.length > 0) ? service.benefits : DEFAULT_SERVICE_FIELDS.benefits,
      whoProfiles: (service.whoProfiles && service.whoProfiles.length > 0) ? service.whoProfiles : DEFAULT_SERVICE_FIELDS.whoProfiles,
      sessionSteps: (service.sessionSteps && service.sessionSteps.length > 0) ? service.sessionSteps : (service.process || DEFAULT_SERVICE_FIELDS.sessionSteps),
      protocolDurations: (service.protocolDurations && service.protocolDurations.length > 0) ? service.protocolDurations : DEFAULT_SERVICE_FIELDS.protocolDurations,
      faq: (service.faq && service.faq.length > 0) ? service.faq : (service.faqs || DEFAULT_SERVICE_FIELDS.faq)
    });
    setSeo(service.seo || {});
    setIsEditing(originalIdx);
    setActiveTab("hero");
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
    const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const isTrashed = s.isTrashed === true;

    if (filter === 'trash') return matchesSearch && isTrashed;
    if (isTrashed) return false;

    return matchesSearch && (filter === 'all' || s.status === filter);
  });

  if (!data) return <div className="flex h-screen items-center justify-center text-[#646970] font-serif">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Services</h1>
        {isEditing === null && (
          <button
            onClick={() => {
              setIsEditing(services.length);
              setForm({
                title: "",
                slug: "",
                image: "",
                icon: "Activity",
                tag: "",
                status: "published",
                ...DEFAULT_SERVICE_FIELDS
              });
              setSeo({});
              setActiveTab("hero");
            }}
            className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] hover:text-[#135e96] hover:border-[#135e96] px-2 py-1 text-[13px] rounded-[3px] transition-colors"
          >
            Add New Service
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
                  placeholder="Enter service title here (e.g., Corrective Movement Therapy Maryland)"
                />

                {/* WP-Style Tabs for Service Editor (1:1 with Frontend Layout) */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-wrap border-b border-[#c3c4c7]">
                    {[
                      { id: "hero", label: "1. Hero Banner" },
                      { id: "stats", label: "2. Highlight Stats" },
                      { id: "overview", label: "3. Clinical Overview & Focus Areas" },
                      { id: "candidates", label: "4. Why Us & Candidates" },
                      { id: "stepper", label: "5. Treatment Protocol" },
                      { id: "faq", label: "6. FAQs & Support" },
                      { id: "seo", label: "7. SEO Settings" }
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
                  {/* 1. HERO BANNER */}
                  {activeTab === "hero" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Permalink Slug</label>
                          <input type="text" value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. corrective-movement-therapy-maryland" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Category Tag</label>
                          <input type="text" value={form.tag || ""} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Movement Therapy" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Menu Icon</label>
                          <div><IconSelector value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} /></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Breadcrumb Backlink Text</label>
                          <input type="text" value={form.backLink || ""} onChange={(e) => setForm({ ...form, backLink: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Back to All Services" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Hero Section Label / Badge</label>
                          <input type="text" value={form.heroSectionLabel || ""} onChange={(e) => setForm({ ...form, heroSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. CLINICAL RECOVERY PROTOCOL" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Hero Subtitle / Description (Supports Markdown Links)</label>
                        <textarea
                          value={form.heroDescription || ""}
                          onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                          className="w-full border border-[#8c8f94] px-3 py-2 text-[14px] rounded-[3px] h-24"
                          placeholder="e.g. Tight hips, aching shoulders, back pain, or sciatica can keep returning. Corrective movement therapy sessions in Maryland at [410 Muscle Therapy](https://410-muscletherapy.com/) look beyond the sore spot..."
                        />
                        <p className="text-[11px] text-[#646970]">You can use markdown links like <code>[Link Text](https://url.com)</code> to insert clickable links.</p>
                      </div>

                      <div className="border-t border-[#f0f0f1] pt-4">
                        <h4 className="text-[13px] font-bold mb-2 text-[#1d2327]">Quick Specifications Strip</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Duration</label>
                            <input type="text" value={form.specDurationValue || ""} onChange={(e) => setForm({ ...form, specDurationValue: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. 60 / 90 Mins" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Intensity</label>
                            <input type="text" value={form.specIntensityValue || ""} onChange={(e) => setForm({ ...form, specIntensityValue: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Targeted Deep" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Focus</label>
                            <input type="text" value={form.specFocusValue || ""} onChange={(e) => setForm({ ...form, specFocusValue: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Trigger Mapping" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#f0f0f1] pt-4">
                        <h4 className="text-[13px] font-bold mb-2 text-[#1d2327]">Call-to-Action Buttons & Links</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Primary Booking Button Text</label>
                            <input type="text" value={form.bookingCta || ""} onChange={(e) => setForm({ ...form, bookingCta: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Book Appointment Now" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Primary Booking URL (Leave blank for default portal)</label>
                            <input type="text" value={form.bookingCtaUrl || ""} onChange={(e) => setForm({ ...form, bookingCtaUrl: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="https://www.styleseat.com/m/v/410muscletherapy" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Secondary Button Text</label>
                            <input type="text" value={form.heroCtaSecondary || ""} onChange={(e) => setForm({ ...form, heroCtaSecondary: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. SEE HOW IT HELPS" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-[#646970]">Secondary Button Link / Anchor</label>
                            <input type="text" value={form.heroCtaSecondaryUrl || ""} onChange={(e) => setForm({ ...form, heroCtaSecondaryUrl: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="#overview" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#f0f0f1] pt-4">
                        <ImageField label="Hero & Overview Featured Image" value={form.image || ""} onChange={(url) => setForm({ ...form, image: url })} />
                      </div>
                    </div>
                  )}

                  {/* 2. HIGHLIGHT STATS */}
                  {activeTab === "stats" && (
                    <div className="space-y-6">
                      <div className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                        <h3 className="text-[14px] font-bold border-b border-[#c3c4c7] pb-2 text-[#1d2327]">Highlight Stats Strip (4 Metric Items)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2 bg-white p-3 border border-[#c3c4c7] rounded-sm">
                            <label className="text-xs font-bold block text-[#2271b1]">Stat 1 (e.g. 8 Yrs Experience)</label>
                            <div className="flex gap-2">
                              <input type="text" value={form.statsItem1Val || ""} onChange={(e) => setForm({ ...form, statsItem1Val: e.target.value })} className="w-28 border border-[#8c8f94] px-2 py-1 text-xs font-bold" placeholder="8 Yrs" />
                              <input type="text" value={form.statsItem1Label || ""} onChange={(e) => setForm({ ...form, statsItem1Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="Clinical Experience" />
                            </div>
                          </div>
                          <div className="space-y-2 bg-white p-3 border border-[#c3c4c7] rounded-sm">
                            <label className="text-xs font-bold block text-[#2271b1]">Stat 2 (e.g. 5.0 Google Rating)</label>
                            <div className="flex gap-2">
                              <input type="text" value={form.statsItem2Val || ""} onChange={(e) => setForm({ ...form, statsItem2Val: e.target.value })} className="w-28 border border-[#8c8f94] px-2 py-1 text-xs font-bold" placeholder="5.0 ★" />
                              <input type="text" value={form.statsItem2Label || ""} onChange={(e) => setForm({ ...form, statsItem2Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="Google Reviews" />
                            </div>
                          </div>
                          <div className="space-y-2 bg-white p-3 border border-[#c3c4c7] rounded-sm">
                            <label className="text-xs font-bold block text-[#2271b1]">Stat 3 (e.g. 100% Satisfaction Guarantee)</label>
                            <div className="flex gap-2">
                              <input type="text" value={form.statsItem3Val || ""} onChange={(e) => setForm({ ...form, statsItem3Val: e.target.value })} className="w-28 border border-[#8c8f94] px-2 py-1 text-xs font-bold" placeholder="100%" />
                              <input type="text" value={form.statsItem3Label || ""} onChange={(e) => setForm({ ...form, statsItem3Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="Satisfaction Guarantee" />
                            </div>
                          </div>
                          <div className="space-y-2 bg-white p-3 border border-[#c3c4c7] rounded-sm">
                            <label className="text-xs font-bold block text-[#2271b1]">Stat 4 (e.g. 5,000+ Completed Sessions)</label>
                            <div className="flex gap-2">
                              <input type="text" value={form.statsItem4Val || ""} onChange={(e) => setForm({ ...form, statsItem4Val: e.target.value })} className="w-28 border border-[#8c8f94] px-2 py-1 text-xs font-bold" placeholder="5,000+" />
                              <input type="text" value={form.statsItem4Label || ""} onChange={(e) => setForm({ ...form, statsItem4Label: e.target.value })} className="flex-1 border border-[#8c8f94] px-2 py-1 text-xs" placeholder="Sessions Completed" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. CLINICAL OVERVIEW & FOCUS AREAS */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Overview Section Label / Badge</label>
                        <input type="text" value={form.overviewSectionLabel || ""} onChange={(e) => setForm({ ...form, overviewSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. FIX THE PATTERNS THAT KEEP PAIN RETURNING" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Heading Part 1 (Regular)</label>
                          <input type="text" value={form.overviewTitle1 || ""} onChange={(e) => setForm({ ...form, overviewTitle1: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Fix The Patterns That" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Heading Part 2 (Gold Italic)</label>
                          <input type="text" value={form.overviewTitle2 || ""} onChange={(e) => setForm({ ...form, overviewTitle2: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Keep Pain Returning." />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Photo Watermark Tag Text</label>
                          <input type="text" value={form.overviewWatermark || ""} onChange={(e) => setForm({ ...form, overviewWatermark: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. SPECIALIST PRACTICE • EST. 2020" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Floating Badge Title</label>
                          <input type="text" value={form.tailoredLabel || ""} onChange={(e) => setForm({ ...form, tailoredLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. 100% Tailored Therapy" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Floating Badge Subtitle</label>
                          <input type="text" value={form.tailoredSub || ""} onChange={(e) => setForm({ ...form, tailoredSub: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Individualized Protocols" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Success/Rating Badge</label>
                          <input type="text" value={form.overviewSuccessRate || ""} onChange={(e) => setForm({ ...form, overviewSuccessRate: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. 5.0 RATED PRACTICE" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Clinical Overview Narrative / Description</label>
                        <QuillEditor
                          content={form.overviewDescription || form.description || ""}
                          onChange={(v) => setForm({ ...form, overviewDescription: v, description: v })}
                          placeholder="e.g. Corrective movement therapy in Maryland starts with a question: What keeps making this area work too hard?..."
                        />
                      </div>

                      {/* Targeted Patterns / Benefits Cards */}
                      <div className="border-t border-[#c3c4c7] pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-[14px] font-bold text-[#1d2327]">Targeted Patterns & Focus Areas Cards</h3>
                            <p className="text-[12px] text-[#646970]">Add specific pain points and conditions addressed (e.g. Low Back, Stiff Hips, Neck Strain, Sciatica).</p>
                          </div>
                          <button type="button" onClick={() => setForm({ ...form, benefits: [...(form.benefits || []), { title: "", description: "" }] })} className="text-[#2271b1] text-xs font-bold underline">+ Add Focus Area</button>
                        </div>

                        <div className="space-y-4">
                          {(form.benefits || []).map((b: any, i: number) => (
                            <div key={i} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-3">
                              <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-1">
                                <span className="text-[11px] font-mono font-bold text-[#2271b1]">PATTERN / BENEFIT #{i+1}</span>
                                <button type="button" onClick={() => {
                                  const nb = form.benefits.filter((_: any, idx: number) => idx !== i);
                                  setForm({ ...form, benefits: nb });
                                }} className="text-[#d63638] text-xs">Remove</button>
                              </div>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={b.title || ""}
                                  onChange={(e) => {
                                    const nb = [...form.benefits];
                                    nb[i] = { ...nb[i], title: e.target.value };
                                    setForm({ ...form, benefits: nb });
                                  }}
                                  className="w-full border border-[#8c8f94] px-3 py-1 text-xs font-bold"
                                  placeholder="Focus Area Title (e.g. Recurring Low Back Tightness)"
                                />
                                <textarea
                                  value={b.description || ""}
                                  onChange={(e) => {
                                    const nb = [...form.benefits];
                                    nb[i] = { ...nb[i], description: e.target.value };
                                    setForm({ ...form, benefits: nb });
                                  }}
                                  className="w-full border border-[#8c8f94] px-3 py-1.5 text-xs h-20"
                                  placeholder="Description with optional markdown link (e.g. When the hips stay stiff... For added work, [Maryland stretch therapy](https://410-muscletherapy.com/maryland-stretch-therapy/) may also support...)"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#c3c4c7] pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Overview CTA Button Text</label>
                          <input type="text" value={form.overviewCtaText || ""} onChange={(e) => setForm({ ...form, overviewCtaText: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="BOOK YOUR SESSION NOW" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Overview CTA Link URL</label>
                          <input type="text" value={form.overviewCtaUrl || ""} onChange={(e) => setForm({ ...form, overviewCtaUrl: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="Defaults to Booking URL" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Security / Guarantee Text</label>
                          <input type="text" value={form.overviewHipaaText || ""} onChange={(e) => setForm({ ...form, overviewHipaaText: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="100% Satisfaction Guaranteed & Certified" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. WHY US & CANDIDATES */}
                  {activeTab === "candidates" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Section Label / Badge</label>
                          <input type="text" value={form.candidateSectionLabel || ""} onChange={(e) => setForm({ ...form, candidateSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. WHY 410 MUSCLE THERAPY FEELS DIFFERENT" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Profile / Advantage Badge Prefix</label>
                          <input type="text" value={form.profileBadgePrefix || ""} onChange={(e) => setForm({ ...form, profileBadgePrefix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. ADVANTAGE or PROFILE" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Heading Part 1 (Regular)</label>
                          <input type="text" value={form.candidateTitle1 || ""} onChange={(e) => setForm({ ...form, candidateTitle1: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Targeted Care." />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Heading Part 2 (Gold Italic)</label>
                          <input type="text" value={form.candidateTitle2 || ""} onChange={(e) => setForm({ ...form, candidateTitle2: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Built Around You." />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Section Narrative / Subtitle Description</label>
                        <textarea
                          value={form.candidateDescription || ""}
                          onChange={(e) => setForm({ ...form, candidateDescription: e.target.value })}
                          className="w-full border border-[#8c8f94] px-3 py-2 text-[14px] rounded-[3px] h-20"
                          placeholder="e.g. At 410 Muscle Therapy, our corrective movement therapy in Maryland is designed for people who want more than a feel-good hour..."
                        />
                      </div>

                      {/* Repeatable Cards (Ordered: Title -> Description -> Footer Badge) */}
                      <div className="border-t border-[#c3c4c7] pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-[14px] font-bold text-[#1d2327]">Differentiators / Candidate Profiles Cards</h3>
                            <p className="text-[12px] text-[#646970]">Add experience points, guarantees, location convenience, or client profiles.</p>
                          </div>
                          <button type="button" onClick={() => setForm({ ...form, whoProfiles: [...(form.whoProfiles || []), { label: "", desc: "", suitability: "SUITABILITY: OPTIMAL" }] })} className="text-[#2271b1] text-xs font-bold underline">+ Add Card</button>
                        </div>

                        <div className="space-y-4">
                          {(form.whoProfiles || []).map((p: any, pIdx: number) => (
                            <div key={pIdx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-3">
                              <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-1">
                                <span className="text-[11px] font-mono font-bold text-[#2271b1]">CARD #{pIdx + 1}</span>
                                <button type="button" onClick={() => {
                                  const np = form.whoProfiles.filter((_: any, idx: number) => idx !== pIdx);
                                  setForm({ ...form, whoProfiles: np });
                                }} className="text-[#d63638] text-xs">Remove</button>
                              </div>
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-[#646970]">Card Title</label>
                                  <input
                                    type="text"
                                    value={p.label || ""}
                                    onChange={(e) => {
                                      const np = [...form.whoProfiles];
                                      np[pIdx] = { ...np[pIdx], label: e.target.value };
                                      setForm({ ...form, whoProfiles: np });
                                    }}
                                    className="w-full border border-[#8c8f94] px-2.5 py-1 text-xs font-bold"
                                    placeholder="Title (e.g. Eight Years Of Experience)"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-[#646970]">Card Description</label>
                                  <textarea
                                    value={p.desc || ""}
                                    onChange={(e) => {
                                      const np = [...form.whoProfiles];
                                      np[pIdx] = { ...np[pIdx], desc: e.target.value };
                                      setForm({ ...form, whoProfiles: np });
                                    }}
                                    className="w-full border border-[#8c8f94] px-2.5 py-1.5 text-xs h-20"
                                    placeholder="Description with optional links (e.g. Eight years of professional experience... and [deep tissue massage Maryland](https://410-muscletherapy.com/deep-tissue-massage-maryland/) may help...)"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-[#646970]">Card Footer Badge Tag</label>
                                  <input
                                    type="text"
                                    value={p.suitability || ""}
                                    onChange={(e) => {
                                      const np = [...form.whoProfiles];
                                      np[pIdx] = { ...np[pIdx], suitability: e.target.value };
                                      setForm({ ...form, whoProfiles: np });
                                    }}
                                    className="w-full border border-[#8c8f94] px-2.5 py-1 text-xs text-[#be9c25] font-mono"
                                    placeholder="Footer Tag (e.g. CERTIFIED CARE or 5.0 ★ RATED)"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. TREATMENT PROTOCOL */}
                  {activeTab === "stepper" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Protocol Section Label</label>
                          <input type="text" value={form.protocolSectionLabel || ""} onChange={(e) => setForm({ ...form, protocolSectionLabel: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. SESSION WORKFLOW PROTOCOL" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Phase Prefix Label</label>
                          <input type="text" value={form.protocolPhasePrefix || ""} onChange={(e) => setForm({ ...form, protocolPhasePrefix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. STEP" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Heading Part 1 (Regular)</label>
                          <input type="text" value={form.protocolTitle1 || ""} onChange={(e) => setForm({ ...form, protocolTitle1: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. What Your Session" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[13px] font-bold">Heading Part 2 (Gold Italic)</label>
                          <input type="text" value={form.protocolTitle2 || ""} onChange={(e) => setForm({ ...form, protocolTitle2: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Looks Like." />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold">Protocol Intro Description</label>
                        <textarea
                          value={form.protocolDescription || ""}
                          onChange={(e) => setForm({ ...form, protocolDescription: e.target.value })}
                          className="w-full border border-[#8c8f94] px-3 py-2 text-[14px] rounded-[3px] h-20"
                          placeholder="e.g. Your corrective movement therapy visit follows a clear path: listen, observe, release, practice, and retest..."
                        />
                      </div>

                      {/* Repeatable Treatment Steps */}
                      <div className="border-t border-[#c3c4c7] pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-[14px] font-bold text-[#1d2327]">Treatment Workflow Steps</h3>
                            <p className="text-[12px] text-[#646970]">Configure the sequential steps for the treatment session.</p>
                          </div>
                          <button type="button" onClick={() => {
                            const nextNum = `0${(form.sessionSteps || []).length + 1}`;
                            setForm({
                              ...form,
                              sessionSteps: [...(form.sessionSteps || []), { num: nextNum, title: "", desc: "" }],
                              protocolDurations: [...(form.protocolDurations || []), "15 MIN"]
                            });
                          }} className="text-[#2271b1] text-xs font-bold underline">+ Add Step</button>
                        </div>

                        <div className="space-y-4">
                          {(form.sessionSteps || []).map((step: any, sIdx: number) => (
                            <div key={sIdx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded-sm space-y-3">
                              <div className="flex justify-between items-center border-b border-[#c3c4c7] pb-2">
                                <span className="text-[11px] font-mono font-bold text-[#2271b1]">STEP {step.num || `0${sIdx+1}`}</span>
                                <div className="flex gap-4 items-center">
                                  <div className="flex items-center gap-2">
                                    <label className="text-[11px] font-bold text-[#646970]">Duration Pill:</label>
                                    <input
                                      type="text"
                                      value={form.protocolDurations?.[sIdx] || "15 MIN"}
                                      onChange={(e) => {
                                        const nd = [...(form.protocolDurations || ["15 MIN", "30 MIN", "30 MIN", "15 MIN"])];
                                        nd[sIdx] = e.target.value;
                                        setForm({ ...form, protocolDurations: nd });
                                      }}
                                      className="w-24 border border-[#8c8f94] px-2 py-0.5 text-xs text-center font-mono"
                                      placeholder="15 MIN"
                                    />
                                  </div>
                                  <button type="button" onClick={() => {
                                    const ns = form.sessionSteps.filter((_: any, idx: number) => idx !== sIdx);
                                    const nd = (form.protocolDurations || []).filter((_: any, idx: number) => idx !== sIdx);
                                    setForm({ ...form, sessionSteps: ns, protocolDurations: nd });
                                  }} className="text-[#d63638] text-xs">Remove</button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={step.title || ""}
                                  onChange={(e) => {
                                    const ns = [...form.sessionSteps];
                                    ns[sIdx] = { ...ns[sIdx], title: e.target.value };
                                    setForm({ ...form, sessionSteps: ns });
                                  }}
                                  className="w-full border border-[#8c8f94] px-2.5 py-1 text-xs font-bold"
                                  placeholder="Step Title (e.g. Talk And Screen)"
                                />
                                <textarea
                                  value={step.desc || ""}
                                  onChange={(e) => {
                                    const ns = [...form.sessionSteps];
                                    ns[sIdx] = { ...ns[sIdx], desc: e.target.value };
                                    setForm({ ...form, sessionSteps: ns });
                                  }}
                                  className="w-full border border-[#8c8f94] px-2.5 py-1.5 text-xs h-20"
                                  placeholder="Step description with optional markdown links (e.g. Hands-on work focuses on tight areas... [myofascial release therapy Maryland](https://410-muscletherapy.com/myofascial-release-maryland/) may also support...)"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Banner Config */}
                      <div className="border-t border-[#c3c4c7] pt-6 space-y-4">
                        <h3 className="text-[14px] font-bold border-b border-[#c3c4c7] pb-2 text-[#1d2327]">Bottom CTA Stepper Banner ("Move Better Starting Right Here")</h3>
                        
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold">Banner Top Badge</label>
                          <input type="text" value={form.protocolBannerBadge || ""} onChange={(e) => setForm({ ...form, protocolBannerBadge: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. MOVE BETTER STARTING RIGHT HERE" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold">Banner Title Prefix</label>
                            <input type="text" value={form.protocolBannerTitlePrefix || ""} onChange={(e) => setForm({ ...form, protocolBannerTitlePrefix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. Ready to experience" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold">Banner Title Suffix</label>
                            <input type="text" value={form.protocolBannerTitleSuffix || ""} onChange={(e) => setForm({ ...form, protocolBannerTitleSuffix: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. ?" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[12px] font-bold">Banner Description / Narrative (Supports phone & address)</label>
                          <textarea
                            value={form.protocolBannerDescription || ""}
                            onChange={(e) => setForm({ ...form, protocolBannerDescription: e.target.value })}
                            className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] h-16"
                            placeholder="e.g. Call 443-473-2322 or book your session at 1301 York Rd., 8th Floor, Suite 48, Timonium, MD, today and start moving with more confidence."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold">Banner CTA Button Text</label>
                            <input type="text" value={form.protocolBannerCta || ""} onChange={(e) => setForm({ ...form, protocolBannerCta: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="e.g. BOOK YOUR APPOINTMENT" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold">Banner Custom URL (Optional)</label>
                            <input type="text" value={form.protocolBannerCtaUrl || ""} onChange={(e) => setForm({ ...form, protocolBannerCtaUrl: e.target.value })} className="w-full border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" placeholder="Defaults to booking URL" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. FAQS & SUPPORT */}
                  {activeTab === "faq" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-[#c3c4c7]">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">FAQ Badge</label>
                          <input
                            type="text"
                            value={form.faqBadge || ""}
                            onChange={(e) => setForm({ ...form, faqBadge: e.target.value })}
                            placeholder="e.g. FAQ"
                            className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px] rounded-sm outline-none bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">FAQ Section Heading</label>
                          <input
                            type="text"
                            value={form.faqTitle || ""}
                            onChange={(e) => setForm({ ...form, faqTitle: e.target.value })}
                            placeholder="e.g. Frequently Asked Questions"
                            className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px] rounded-sm outline-none bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">FAQ Description</label>
                          <input
                            type="text"
                            value={form.faqDescription || ""}
                            onChange={(e) => setForm({ ...form, faqDescription: e.target.value })}
                            placeholder="e.g. Answers to common questions..."
                            className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px] rounded-sm outline-none bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <h4 className="text-[13px] font-bold text-[#1d2327]">Service-Specific FAQs ({form.faq?.length || 0})</h4>
                        <button type="button" onClick={() => setForm({ ...form, faq: [...(form.faq || []), { question: "", answer: "" }] })} className="text-[#2271b1] text-xs font-bold underline">+ Add FAQ Item</button>
                      </div>

                      <div className="space-y-4">
                        {(form.faq || []).map((item: any, i: number) => (
                          <div key={i} className="bg-white border border-[#c3c4c7] p-4 space-y-3 shadow-sm rounded-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-mono font-bold text-[#2271b1]">QUESTION #{i+1}</span>
                              <button type="button" onClick={() => { const nf = form.faq.filter((_: any, idx: number) => idx !== i); setForm({ ...form, faq: nf }); }} className="text-[#d63638] text-xs">Remove FAQ</button>
                            </div>
                            <input
                              value={item.question || ""}
                              onChange={(e) => { const nf = [...form.faq]; nf[i] = { ...nf[i], question: e.target.value }; setForm({ ...form, faq: nf }); }}
                              placeholder="Enter Question (e.g. What is corrective movement therapy, and who is it for?)"
                              className="w-full border border-[#8c8f94] px-3 py-1.5 text-xs font-bold"
                            />
                            <QuillEditor
                              content={item.answer || ""}
                              onChange={(v) => { const nf = [...form.faq]; nf[i] = { ...nf[i], answer: v }; setForm({ ...form, faq: nf }); }}
                              placeholder="Write the detailed answer here (supports links)..."
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-[#c3c4c7] space-y-1">
                        <label className="text-[13px] font-bold">FAQ Schema Markup (Bulk JSON-LD)</label>
                        <p className="text-[11px] text-[#646970]">Optional custom JSON-LD schema block covering all FAQs for this service.</p>
                        <textarea
                          value={form.faqSchemaMarkup || ""}
                          onChange={(e) => setForm({ ...form, faqSchemaMarkup: e.target.value })}
                          placeholder='e.g. {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [...]}'
                          className="w-full border border-[#8c8f94] px-2 py-1.5 text-xs font-mono"
                          rows={6}
                        />
                      </div>
                    </div>
                  )}

                  {/* 7. SEO SETTINGS */}
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
                    <p><strong>Status:</strong> {form.status === 'published' ? 'Published' : 'Draft'} <button type="button" onClick={() => setForm({ ...form, status: form.status === 'published' ? 'draft' : 'published' })} className="text-[#2271b1] underline ml-1">Toggle</button></p>
                    <p><strong>Visibility:</strong> Public</p>
                    {form.slug && (
                      <p className="flex items-center gap-1">
                        <strong>Permalink:</strong>
                        <Link href={`/${form.slug}/`} target="_blank" className="text-[#2271b1] hover:underline truncate max-w-[150px] inline-flex items-center gap-1">
                          View Page <ExternalLink className="w-3 h-3" />
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
