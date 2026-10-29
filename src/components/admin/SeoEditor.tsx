"use client";

import { useState, useEffect } from "react";
import {
  Search, Globe, Share2, Twitter, Info, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Eye, Layout, Type, Image as ImageIcon,
  MousePointer2, ExternalLink, Link2, FileJson, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageField from "./ImageField";
import { BASE_URL } from "@/lib/constants";

interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  metaRobotsIndex?: string;
  metaRobotsFollow?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaData?: string;
  schemaMode?: string;
  breadcrumbTitle?: string;
  secondaryKeywords?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
}

interface SeoEditorProps {
  data: SeoData;
  setData: (data: SeoData) => void;
  pageSlug: string;
  pageTitle: string;
  pageContent?: any;
  /** Public URL prefix for this content type, e.g. "blogs/" for blog posts (default: none, URL is /<slug>/). */
  urlPrefix?: string;
}

export default function SeoEditor({ data, setData, pageSlug, pageTitle, pageContent, urlPrefix = "" }: SeoEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'schema' | 'analysis'>('general');
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const updateField = (field: keyof SeoData, value: string) => {
    // Values are stored exactly as typed. Fallbacks (e.g. featured image -> OG image) are applied when the page is
    // rendered, so changing the featured image later keeps working.
    setData({ ...data, [field]: value });
  };

  // The URL this page is served at - and the canonical used when the field is left empty (recommended).
  const slugPart = (pageSlug === 'home' || pageSlug === '/') ? '' : String(pageSlug || '').replace(/^\/+|\/+$/g, '');
  const automaticCanonical = slugPart ? `${BASE_URL}/${urlPrefix}${slugPart}/` : `${BASE_URL}/`;


  useEffect(() => {
    runAnalysis();
  }, [data, pageSlug, pageTitle, pageContent]);

  const runAnalysis = () => {
    const issues: Array<{ type: 'success' | 'warning' | 'error'; text: string }> = [];
    const ok = (text: string) => issues.push({ type: 'success', text });
    const warn = (text: string) => issues.push({ type: 'warning', text });
    const bad = (text: string) => issues.push({ type: 'error', text });

    const keyword = (data.focusKeyword || "").trim().toLowerCase();
    const title = (data.metaTitle || pageTitle || "").trim();
    const description = (data.metaDescription || "").trim();
    const slug = String(pageSlug || "").toLowerCase();

    // Title
    if (!data.metaTitle) warn("No SEO title set - the page title is used instead. Write a dedicated SEO title (30-60 characters).");
    else if (title.length < 30) warn(`SEO title is short (${title.length} characters). Aim for 30-60.`);
    else if (title.length > 65) bad(`SEO title is ${title.length} characters - Google will cut it off or rewrite it. Keep it under 60.`);
    else if (title.length > 60) warn(`SEO title is ${title.length} characters - slightly long. Aim for 60 or fewer.`);
    else ok(`SEO title length is good (${title.length} characters).`);

    // Description
    if (!description) bad("No meta description. Google will invent a snippet from the page text.");
    else {
      if (/<[a-z][\s\S]*>/i.test(description)) bad("The meta description contains HTML tags. Use plain text only.");
      if (/\s{2,}/.test(description)) warn("The meta description contains double spaces.");
      if (description.length < 70) warn(`Meta description is short (${description.length} characters). Aim for 120-160.`);
      else if (description.length > 160) warn(`Meta description is ${description.length} characters - it will be cut off. Keep it under 160.`);
      else ok(`Meta description length is good (${description.length} characters).`);
    }

    // Focus keyword
    if (!keyword) warn("No focus keyword set. Add the main phrase this page should rank for.");
    else {
      title.toLowerCase().includes(keyword) ? ok("Focus keyword appears in the SEO title.") : warn("Focus keyword is not in the SEO title.");
      description.toLowerCase().includes(keyword) ? ok("Focus keyword appears in the meta description.") : warn("Focus keyword is not in the meta description.");
      slug.includes(keyword.replace(/\s+/g, '-')) ? ok("Focus keyword appears in the URL.") : warn("Focus keyword is not in the URL (fine for existing pages - changing a URL needs a redirect).");
    }

    // Canonical
    const canon = (data.canonicalUrl || "").trim();
    if (!canon) ok("Canonical URL is automatic (recommended).");
    else if (canon !== automaticCanonical) {
      if (!/^https?:\/\//i.test(canon)) bad("Custom canonical must be a full URL starting with https://");
      else if (!canon.endsWith('/') && !canon.includes('?')) bad("Custom canonical has no trailing slash - this site always redirects to the slash version, so Google may ignore it.");
      else warn(`Custom canonical points to a different URL (${canon}). This tells Google another page is the main version of this one. Clear the field unless that is intentional.`);
    } else ok("Canonical URL matches this page.");

    // Social + indexing
    (data.ogImage || data.featuredImage) ? ok("A social/preview image is set.") : warn("No OG image or featured image - shares will use the default site image.");
    if (data.metaRobotsIndex === 'noindex') warn("This page is set to NoIndex - it is hidden from Google.");
    if (data.metaRobotsFollow === 'nofollow') warn("This page is set to NoFollow - Google will not follow its links.");

    setAnalysis(issues);
    const good = issues.filter(i => i.type === 'success').length;
    setScore(issues.length ? Math.round((good / issues.length) * 100) : 0);
  };

  return (
    <div className="flex flex-col bg-white overflow-hidden max-w-full">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#f0f0f1] px-4 py-2 bg-[#f6f7f7]">
        {[
          { id: 'general', label: 'General', icon: Search },
          { id: 'social', label: 'Social', icon: Share2 },
          { id: 'schema', label: 'Schema', icon: FileJson },
          { id: 'analysis', label: 'Analysis', icon: CheckCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[3px] text-[11px] font-bold uppercase transition-all ${activeTab === tab.id
              ? "bg-white border border-[#c3c4c7] text-[#1d2327]"
              : "text-[#2271b1] hover:text-[#135e96]"
              }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-[#f0f0f1]">
        {/* Editor Area */}
        <div className="flex-1 p-4 sm:p-5 space-y-6 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Focus Keyword</label>
                    <input type="text" value={data.focusKeyword || ""} onChange={(e) => updateField('focusKeyword', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" placeholder="e.g. sports massage maryland" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Secondary Keywords</label>
                    <input type="text" value={data.secondaryKeywords || ""} onChange={(e) => updateField('secondaryKeywords', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" placeholder="comma separated" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">SEO Title</label>
                    <span className="text-[10px] text-[#646970] font-mono">{data.metaTitle?.length || 0} / 60 chars</span>
                  </div>
                  <input type="text" placeholder={pageTitle} value={data.metaTitle || ""} onChange={(e) => updateField('metaTitle', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Meta Description</label>
                    <span className="text-[10px] text-[#646970] font-mono">{data.metaDescription?.length || 0} / 160 chars</span>
                  </div>
                  <textarea rows={4} value={data.metaDescription || ""} onChange={(e) => updateField('metaDescription', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-none leading-relaxed" placeholder="Write a summary description for search results..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Canonical URL</label>
                      {!!data.canonicalUrl && (
                        <button
                          type="button"
                          onClick={() => updateField('canonicalUrl', '')}
                          className="text-[11px] text-[#2271b1] hover:underline"
                        >
                          Use automatic
                        </button>
                      )}
                    </div>
                    <input type="text" value={data.canonicalUrl || ""} onChange={(e) => updateField('canonicalUrl', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" placeholder={automaticCanonical} />
                    <p className="text-[11px] text-[#646970]">Leave empty (recommended): the page uses its own URL, <span className="font-mono">{automaticCanonical}</span>, and it follows automatically if you change the slug.</p>
                    {!!data.canonicalUrl && data.canonicalUrl.trim() !== automaticCanonical && (
                      <p className="text-[11px] text-[#b32d2e]">This page tells Google that a different URL is the main version. Clear the field unless that is intentional.</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Breadcrumb Title</label>
                    <input type="text" value={data.breadcrumbTitle || ""} onChange={(e) => updateField('breadcrumbTitle', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                  </div>
                </div>

                <div className="space-y-5 pt-2 border-t border-[#f0f0f1]">
                  <div>
                    <ImageField
                      label="Featured Image (Global/Schema)"
                      value={data.featuredImage || ""}
                      onChange={(url) => updateField('featuredImage', url)}
                      altValue={data.featuredImageAlt || ""}
                      onAltChange={(alt) => updateField('featuredImageAlt', alt)}
                      description="Main image used for Schema.org and as a fallback for OG/Twitter social previews."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Robots Index</label>
                      <select value={data.metaRobotsIndex || 'index'} onChange={(e) => updateField('metaRobotsIndex', e.target.value)} className="w-full border border-[#c3c4c7] bg-white px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none">
                        <option value="index">Index (Allow search engines to show page)</option>
                        <option value="noindex">NoIndex (Hide page from search results)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">Robots Follow</label>
                      <select value={data.metaRobotsFollow || 'follow'} onChange={(e) => updateField('metaRobotsFollow', e.target.value)} className="w-full border border-[#c3c4c7] bg-white px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none">
                        <option value="follow">Follow (Instruct search engines to follow links)</option>
                        <option value="nofollow">NoFollow (Do not crawl links on this page)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide border-b border-[#f0f0f1] pb-1.5">Facebook / Open Graph</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="OG Title (defaults to SEO Title if empty)" value={data.ogTitle || ""} onChange={(e) => updateField('ogTitle', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                    <textarea placeholder="OG Description (defaults to Meta Description if empty)" rows={3} value={data.ogDescription || ""} onChange={(e) => updateField('ogDescription', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-none leading-relaxed" />
                    <ImageField label="OG Image" value={data.ogImage || ""} onChange={(url) => updateField('ogImage', url)} />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#f0f0f1]">
                  <h3 className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide border-b border-[#f0f0f1] pb-1.5">Twitter / X</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase">Twitter Title</label>
                        <input type="text" placeholder="Twitter Title" value={data.twitterTitle || ""} onChange={(e) => updateField('twitterTitle', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#1d2327] uppercase">Card Style</label>
                        <select value={data.twitterCard || 'summary_large_image'} onChange={(e) => updateField('twitterCard', e.target.value)} className="w-full border border-[#c3c4c7] bg-white px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none">
                          <option value="summary">Summary (Small Image Preview)</option>
                          <option value="summary_large_image">Summary with Large Image</option>
                        </select>
                      </div>
                    </div>
                    <textarea placeholder="Twitter Description" rows={3} value={data.twitterDescription || ""} onChange={(e) => updateField('twitterDescription', e.target.value)} className="w-full border border-[#c3c4c7] px-3 py-2 text-[14px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-none leading-relaxed" />
                    <ImageField label="Twitter Image" value={data.twitterImage || ""} onChange={(url) => updateField('twitterImage', url)} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'schema' && (() => {
              const raw = (data.schemaData || '').trim();
              let status: { ok: boolean; msg: string } | null = null;
              if (raw) {
                try {
                  const chunks: string[] = [];
                  const re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
                  let m: RegExpExecArray | null;
                  while ((m = re.exec(raw)) !== null) chunks.push(m[1]);
                  if (!chunks.length) chunks.push(raw);
                  const nodes: any[] = [];
                  chunks.forEach((c) => { const v = JSON.parse(c.trim()); (Array.isArray(v) ? v : [v]).forEach((x: any) => nodes.push(...(x && x['@graph'] ? x['@graph'] : [x]))); });
                  const types = nodes.map((n: any) => [].concat(n?.['@type'] || []).join('/')).filter(Boolean);
                  status = { ok: true, msg: `Valid JSON-LD: ${nodes.length} item(s)${types.length ? ' — ' + types.slice(0, 8).join(', ') : ''}` };
                } catch (e: any) {
                  status = { ok: false, msg: 'Not valid JSON: ' + String(e?.message || e).slice(0, 140) + ' — until this is fixed the page keeps using its automatic schema.' };
                }
              }
              const mode = data.schemaMode === 'append' ? 'append' : 'replace';
              return (
                <motion.div key="schema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="rounded-[3px] border border-[#c3c4c7] bg-[#f6f7f7] p-4 text-[12px] text-[#50575e] leading-relaxed">
                    <strong className="text-[#1d2327]">Custom schema for this page only.</strong> Paste JSON-LD (or the whole <code>&lt;script type="application/ld+json"&gt;</code> block). It is used on this page and nowhere else. Leave the box empty to use the automatic schema.
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">How should it be used?</label>
                    <select value={mode} onChange={(e) => updateField('schemaMode', e.target.value)} className="w-full border border-[#c3c4c7] bg-white px-3 py-2 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none">
                      <option value="replace">Replace the automatic schema (this is the only schema on the page)</option>
                      <option value="append">Add to the automatic schema (both are output)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#1d2327] uppercase tracking-wide">JSON-LD</label>
                    <textarea
                      value={data.schemaData || ''}
                      onChange={(e) => updateField('schemaData', e.target.value)}
                      rows={18}
                      spellCheck={false}
                      className="w-full border border-[#c3c4c7] px-3 py-2 text-[12px] font-mono rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none leading-relaxed"
                      placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Service",\n  ...\n}'}
                    />
                  </div>
                  {status && (
                    <div className={`flex items-start gap-2 p-3 text-[12px] rounded-[3px] border-l-4 ${status.ok ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                      {status.ok ? <CheckCircle className="w-4 h-4 mt-px flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-px flex-shrink-0" />}
                      <span>{status.msg}</span>
                    </div>
                  )}
                  {raw && (
                    <button type="button" onClick={() => updateField('schemaData', '')} className="text-[12px] text-[#d63638] underline">
                      Remove custom schema (go back to the automatic one)
                    </button>
                  )}
                </motion.div>
              );
            })()}

            {activeTab === 'analysis' && (
              <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center justify-between rounded-[3px] border border-[#c3c4c7] bg-[#f6f7f7] px-4 py-3">
                  <span className="text-[12px] font-bold uppercase tracking-wide text-[#1d2327]">SEO checks passed</span>
                  <span className={`text-[20px] font-bold ${score >= 80 ? "text-[#00a32a]" : score >= 50 ? "text-[#dba617]" : "text-[#d63638]"}`}>{score}%</span>
                </div>
                {[...analysis].sort((a, b) => ({ error: 0, warning: 1, success: 2 } as any)[a.type] - ({ error: 0, warning: 1, success: 2 } as any)[b.type]).map((issue, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-3 text-[12px] rounded-[3px] border-l-4 ${issue.type === 'error' ? "bg-red-50 border-red-500 text-red-700" : issue.type === 'warning' ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-green-50 border-green-500 text-green-700"}`}>
                    {issue.type === 'success' ? <CheckCircle className="w-4 h-4 mt-px flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-px flex-shrink-0" />}
                    <span>{issue.text}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview Area */}
        <div className="w-full xl:w-[320px] bg-[#f6f7f7] p-4 sm:p-5 space-y-6 flex-shrink-0 min-w-0">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-[#646970] uppercase tracking-wider">Search Preview</h3>
            <div className="bg-white border border-[#c3c4c7] p-4 rounded-[3px] shadow-sm space-y-1">
              <div className="text-[11px] text-[#4d5156] line-clamp-1">{automaticCanonical.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/').join(' › ')}</div>
              <h4 className="text-[15px] text-[#1a0dab] hover:underline cursor-pointer font-normal line-clamp-1">
                {data.metaTitle || pageTitle}
              </h4>
              <p className="text-[12px] text-[#4d5156] line-clamp-2 leading-snug">
                {data.metaDescription || "..."}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-[#646970] uppercase tracking-wider">Social Preview</h3>
            <div className="bg-white border border-[#c3c4c7] rounded-[3px] shadow-sm overflow-hidden">
              <div className="aspect-[1.91/1] bg-[#f0f0f1] flex items-center justify-center overflow-hidden">
                {(data.ogImage || data.featuredImage) ? <img src={data.ogImage || data.featuredImage} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-[#c3c4c7]" />}
              </div>
              <div className="p-3 border-t border-[#f0f0f1]">
                <div className="text-[9px] text-[#646970] uppercase font-bold">410-muscletherapy.com</div>
                <div className="text-[13px] font-bold text-[#1d2327] line-clamp-1">{data.ogTitle || data.metaTitle || pageTitle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
