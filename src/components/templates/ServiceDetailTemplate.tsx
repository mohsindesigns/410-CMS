"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Activity,
  Target
} from 'lucide-react';
import { useContent } from "../../hooks/useContent";
import ContactFaqSection from '../QAForm';

/** Convert markdown links [Label](url) and HTML links to styled clickable anchors */
function formatRichText(content: string | undefined | null, isDark: boolean = false): string {
  if (!content) return "";
  let text = String(content);

  // If content has markdown links [Text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const linkClass = isDark
      ? "text-gold font-medium hover:text-white underline decoration-gold/60 hover:decoration-white transition-colors"
      : "text-gold-dark font-medium hover:text-dark underline decoration-gold-dark/60 hover:decoration-dark transition-colors";
    const target = url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}" class="${linkClass}"${target}>${label}</a>`;
  });

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  // If text doesn't contain HTML tags, preserve newlines as line breaks
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    text = text.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
  }

  return text.trim();
}

/** Plain text helper for headings/badges */
function sh(html: string | undefined | null): string {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

export default function ServiceDetailTemplate({ pageData, params: syncParams }: { pageData?: any, params?: any }) {
  const { services: servicesData, globalMetadata, serviceDetailPage: globalServiceDetailPage } = useContent();

  const resolvedSlug = pageData?.slug || (syncParams?.slug ? (Array.isArray(syncParams.slug) ? syncParams.slug.join('/') : syncParams.slug) : null);
  const servicesList = (servicesData as any)?.services || [];
  const serviceFromHook = resolvedSlug ? (servicesList.find((s: any) => s.slug === resolvedSlug) || (servicesData as any)?.items?.find((s: any) => s.slug === resolvedSlug)) : null;

  const pageDataInner = {
    ...(pageData?.data || {}),
    ...(pageData?.content?.data || {}),
    ...(pageData || {})
  };

  const service = { ...(serviceFromHook || {}), ...(pageDataInner || {}) };

  if (!service || (!service.slug && !service.title && !service.id)) {
    return (
      <main className="bg-dark min-h-screen pt-[140px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }


  const pageContent = pageData?.content || {};
  const serviceDetailPage = pageContent.serviceDetailPage || globalServiceDetailPage || {};

  const defaultBookingUrl = "https://www.styleseat.com/m/v/410muscletherapy";
  const globalBooking = globalMetadata?.bookingUrl || defaultBookingUrl;

  // Hydrate configurations cleanly with zero duplicate texts
  const pg = {
    backLink: service.backLink || serviceDetailPage.backLink || "Back to All Services",
    heroSectionLabel: service.heroSectionLabel || serviceDetailPage.heroSectionLabel || "CLINICAL RECOVERY PROTOCOL",

    // Single distinct Hero Description
    heroDescription: service.heroDescription || service.heroSubtitle || service.heroDescriptionSuffix || serviceDetailPage.heroDescription || "Targeted manual therapy engineered to eliminate chronic pain, unlock joint mobility, and accelerate athletic recovery.",

    // Specs Strip
    specDurationValue: service.specDurationValue || serviceDetailPage.specDurationValue || "60 / 90 Mins",
    specIntensityValue: service.specIntensityValue || serviceDetailPage.specIntensityValue || "Targeted Deep",
    specFocusValue: service.specFocusValue || serviceDetailPage.specFocusValue || "Trigger Mapping",

    // CTAs & Links
    bookingCta: service.bookingCta || serviceDetailPage.bookingCta || "Book Appointment Now",
    bookingCtaUrl: service.bookingCtaUrl || globalBooking,
    heroCtaSecondary: service.heroCtaSecondary || serviceDetailPage.heroCtaSecondary || "SEE HOW IT HELPS",
    heroCtaSecondaryUrl: service.heroCtaSecondaryUrl || "#overview",

    // Stats Strip
    statsItem1Val: service.statsItem1Val || serviceDetailPage.statsItem1Val || "8 Yrs",
    statsItem1Label: service.statsItem1Label || serviceDetailPage.statsItem1Label || "Clinical Experience",
    statsItem2Val: service.statsItem2Val || serviceDetailPage.statsItem2Val || "5.0 ★",
    statsItem2Label: service.statsItem2Label || serviceDetailPage.statsItem2Label || "Google Reviews",
    statsItem3Val: service.statsItem3Val || serviceDetailPage.statsItem3Val || "100%",
    statsItem3Label: service.statsItem3Label || serviceDetailPage.statsItem3Label || "Satisfaction Guarantee",
    statsItem4Val: service.statsItem4Val || serviceDetailPage.statsItem4Val || "5,000+",
    statsItem4Label: service.statsItem4Label || serviceDetailPage.statsItem4Label || "Sessions Completed",

    // Overview Section
    overviewSectionLabel: service.overviewSectionLabel || serviceDetailPage.overviewSectionLabel || "FIX THE PATTERNS THAT KEEP PAIN RETURNING",
    overviewTitle1: service.overviewTitle1 || service.overviewTitlePrefix || serviceDetailPage.overviewTitle1 || "Targeted Bodywork.",
    overviewTitle2: service.overviewTitle2 || service.overviewTitleHighlight || serviceDetailPage.overviewTitle2 || "Engineered For Recovery.",
    overviewWatermark: service.overviewWatermark || serviceDetailPage.overviewWatermark || "SPECIALIST PRACTICE • EST. 2020",
    overviewSuccessRate: service.overviewSuccessRate || serviceDetailPage.overviewSuccessRate || "5.0 RATED PRACTICE",
    tailoredLabel: service.tailoredLabel ?? serviceDetailPage.tailoredLabel ?? "100% Tailored Therapy",
    tailoredSub: service.tailoredSub ?? serviceDetailPage.tailoredSub ?? "Individualized Protocols",

    // Single distinct Overview Clinical Narrative
    overviewDescription: service.overviewDescription || service.overviewIntroSuffix || service.description || serviceDetailPage.overviewDescription || "We look at mobility, stability, posture, soft-tissue restrictions, and movement habits. Then we pair bodywork with guided exercises that help your body share the load more comfortably.",

    overviewCtaText: service.overviewCtaText || serviceDetailPage.overviewCtaText || "BOOK YOUR SESSION NOW",
    overviewCtaUrl: service.overviewCtaUrl || service.bookingCtaUrl || globalBooking,
    overviewHipaaText: service.overviewHipaaText || serviceDetailPage.overviewHipaaText || "100% Satisfaction Guaranteed & Certified",

    // Candidates / Why Choose Us Section
    candidateSectionLabel: service.candidateSectionLabel || serviceDetailPage.candidateSectionLabel || "WHY 410 MUSCLE THERAPY FEELS DIFFERENT",
    candidateTitle1: service.candidateTitle1 || serviceDetailPage.candidateTitle1 || "Targeted Care.",
    candidateTitle2: service.candidateTitle2 || serviceDetailPage.candidateTitle2 || "Built Around You.",
    candidateDescription: service.candidateDescription || serviceDetailPage.candidateDescription || "Movement work shaped around what your body can comfortably do. The goal is useful progress, not a rushed routine or generic adjustment.",
    profileBadgePrefix: service.profileBadgePrefix || serviceDetailPage.profileBadgePrefix || "ADVANTAGE",
    candidateSuitability: service.candidateSuitability ?? serviceDetailPage.candidateSuitability ?? "CLINICAL STANDARD",
    whoProfiles: service.whoProfiles || serviceDetailPage.whoProfiles || [
      {
        label: "Eight Years Of Experience",
        desc: "Eight years of professional experience guide every session. Skilled observation and hands-on work matter when pain has several contributors.",
        suitability: "CERTIFIED CARE"
      },
      {
        label: "Five-Star Reputation",
        desc: "A 5.0 Google rating gives you confidence before you book. Clients praise our knowledge, professionalism, and targeted muscle relief.",
        suitability: "5.0 ★ RATED"
      },
      {
        label: "Guaranteed Client Satisfaction",
        desc: "Backed by our 100% Customer Satisfaction Guarantee. We explain every technique and adjust pressure to your exact comfort.",
        suitability: "100% GUARANTEED"
      },
      {
        label: "York Road Convenience",
        desc: "Conveniently located at 1301 York Rd., Timonium, MD, serving Towson, Lutherville, Cockeysville, and Baltimore County with dedicated one-on-one care.",
        suitability: "TIMONIUM, MD"
      }
    ],

    // Treatment Protocol / Stepper Section
    protocolSectionLabel: service.protocolSectionLabel || serviceDetailPage.protocolSectionLabel || "SESSION WORKFLOW PROTOCOL",
    protocolTitle1: service.protocolTitle1 || serviceDetailPage.protocolTitle1 || "What Your Session",
    protocolTitle2: service.protocolTitle2 || serviceDetailPage.protocolTitle2 || "Looks Like.",
    protocolDescription: service.protocolDescription || serviceDetailPage.protocolDescription || "Your visit follows a clear path: listen, observe, release, practice, and retest so you always know what we are working on and why.",
    protocolPhasePrefix: service.protocolPhasePrefix || serviceDetailPage.protocolPhasePrefix || "STEP 0",
    protocolDurations: service.protocolDurations || serviceDetailPage.protocolDurations || ["15 MIN", "30 MIN", "30 MIN", "15 MIN"],
    protocolBannerBadge: service.protocolBannerBadge || serviceDetailPage.protocolBannerBadge || "MOVE BETTER STARTING RIGHT HERE",
    protocolBannerTitle: service.protocolBannerTitle || serviceDetailPage.protocolBannerTitle,
    protocolBannerTitlePrefix: service.protocolBannerTitlePrefix || serviceDetailPage.protocolBannerTitlePrefix || "Ready to experience",
    protocolBannerTitleSuffix: service.protocolBannerTitleSuffix || serviceDetailPage.protocolBannerTitleSuffix || "?",
    protocolBannerDescription: service.protocolBannerDescription || serviceDetailPage.protocolBannerDescription,
    protocolBannerCta: service.protocolBannerCta || serviceDetailPage.protocolBannerCta || "BOOK YOUR APPOINTMENT",
    protocolBannerCtaUrl: service.protocolBannerCtaUrl || service.bookingCtaUrl || globalBooking,

    benefitsTitle: service.benefitsTitle || serviceDetailPage.benefitsTitle || "Patterns & Focus Areas",
    benefitCardDesc: service.benefitCardDesc || serviceDetailPage.benefitCardDesc || "Targeted mechanical and myofascial input designed to restore movement.",

    // Dynamic Step Sequence
    sessionSteps: service.sessionSteps || (service.process && service.process.length > 0 ? service.process.map((step: any, idx: number) => ({
      num: String(idx + 1).padStart(2, '0'),
      title: step.title,
      desc: step.description || step.desc || ""
    })) : null) || serviceDetailPage.sessionSteps || [
        {
          num: "01",
          title: "Talk And Screen",
          desc: "We talk about what hurts and where motion feels guarded with standing, walking, reaching, or squatting assessments."
        },
        {
          num: "02",
          title: "Release Restricted Tissue",
          desc: "Hands-on myofascial work targets deep muscle knots and stuck fascia matched to your comfortable pressure level."
        },
        {
          num: "03",
          title: "Practice Better Patterns",
          desc: "We work on breathing, hip control, shoulder mechanics, balance, and core stability drills connected to daily life."
        },
        {
          num: "04",
          title: "Retest And Plan",
          desc: "We retest key movements, evaluate improvements, and provide practical next steps to practice between sessions."
        }
      ]
  };

  const serviceName = sh(service.title || service.name || "Service");
  const titleWords = serviceName.split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastTitleWord = titleWords[titleWords.length - 1] || "";
  const serviceImage = service.image || service.featuredImage || "/images/service-massage.webp";

  // Format clinical benefits array
  const benefits = (service.benefits && service.benefits.length > 0) ? service.benefits : [
    {
      title: "Recurring Low Back Tightness",
      description: "Targeted mobility drills and soft-tissue release to take strain off the lumbar spine and restore hip motion."
    },
    {
      title: "Hips That Feel Stuck",
      description: "Soft-tissue work and joint control drills so you practice moving with less compensation during daily tasks."
    },
    {
      title: "Neck And Shoulder Strain",
      description: "Upper-back mobility and shoulder-blade mechanics to make reaching, turning, and desk posture feel natural."
    },
    {
      title: "Posture & Compensation Patterns",
      description: "Balance, coordination, and joint control practice supporting easier standing, walking, training, and work."
    }
  ];

  const statsList = [
    { value: sh(pg.statsItem1Val), label: sh(pg.statsItem1Label) },
    { value: sh(pg.statsItem2Val), label: sh(pg.statsItem2Label) },
    { value: sh(pg.statsItem3Val), label: sh(pg.statsItem3Label) },
    { value: sh(pg.statsItem4Val), label: sh(pg.statsItem4Label) }
  ];

  // Dynamic grid column calculation for Stepper
  const stepCount = pg.sessionSteps.length;
  const stepperGridClass = stepCount === 4
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    : stepCount === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-6"
      : stepCount === 2
        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <>
      <main className="w-full bg-off-white text-body overflow-hidden">
        {/* ════════════════════════════════════════════════════════
           1. HERO SECTION (Matching Site Hero Aesthetics)
           ════════════════════════════════════════════════════════ */}
        <section className="relative bg-dark min-h-[80vh] flex items-center pt-[130px] pb-20 border-b border-border-dark overflow-hidden">
          {/* Ambient Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <img
              src={serviceImage}
              alt={serviceName}
              className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
            />
            {/* Multi-directional luxury gradient masks */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark" />
          </div>

          {/* Subtle Gold Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-gold/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

          <div className="site-container relative z-10 w-full text-left">
            {/* Breadcrumbs & Navigation */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11.5px] sm:text-[12px] font-mono tracking-wider text-white/50">
                <Link href="/" className="hover:text-gold transition-colors text-white/70">
                  Home
                </Link>
                <span className="text-gold/50">/</span>
                <span className="text-gold font-medium truncate max-w-[280px] sm:max-w-none">
                  {serviceName}
                </span>
              </nav>

              <Link
                href="/services/"
                className="hidden sm:inline-flex items-center gap-2 text-white/60 hover:text-gold text-[11px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                <ArrowLeft size={13} className="text-gold" />
                {pg.backLink}
              </Link>
            </div>

            <div className="max-w-[680px]">
              {/* Gold Accent Line + Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[1px] bg-gold flex-shrink-0" />
                <p className="section-label text-gold">
                  {pg.heroSectionLabel}
                </p>
              </div>

              {/* Headline with Playfair Display Italic Gold Accent */}
              <h1 className="font-display font-medium text-[38px] min-[400px]:text-[48px] md:text-[62px] lg:text-[70px] text-white leading-[1.08] mb-6 tracking-tight">
                {mainTitle ? mainTitle : serviceName}{' '}
                {mainTitle && <span className="text-gold italic font-light block sm:inline">{lastTitleWord}</span>}
              </h1>

              {/* Single Hero Description with Link Support */}
              <div
                className="text-white/80 md:text-white/70 text-[15px] md:text-[17px] leading-[1.8] max-w-[560px] mb-8 font-light"
                dangerouslySetInnerHTML={{ __html: formatRichText(pg.heroDescription, true) }}
              />

              {/* Quick Specs Pill Strip */}
              <div className="flex flex-wrap items-center gap-5 py-3.5 px-6 rounded-md bg-white/[0.05] border border-white/10 backdrop-blur-md mb-9 max-w-fit shadow-xl">
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <Clock size={16} className="text-gold flex-shrink-0" />
                  <span>{pg.specDurationValue}</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <Activity size={16} className="text-gold flex-shrink-0" />
                  <span>{pg.specIntensityValue}</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <Target size={16} className="text-gold flex-shrink-0" />
                  <span>{pg.specFocusValue}</span>
                </div>
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href={pg.bookingCtaUrl}
                  target={pg.bookingCtaUrl.startsWith("http") ? "_blank" : undefined}
                  rel={pg.bookingCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4"
                >
                  {pg.bookingCta} <ArrowRight size={14} className="ml-1" />
                </a>
                <a
                  href={pg.heroCtaSecondaryUrl}
                  className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4"
                >
                  {pg.heroCtaSecondary} <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           2. HIGHLIGHT STATS STRIP (Dark Luxury Accent)
           ════════════════════════════════════════════════════════ */}
        <div className="bg-dark-2 border-b border-border-dark py-8 relative z-10">
          <div className="site-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {statsList.map((stat: any, idx: number) => (
                <div key={idx} className="p-5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-gold/40 shadow-xl transition-all duration-300 group text-center">
                  <span className="text-gold font-serif text-[26px] md:text-[32px] font-bold block leading-none mb-1 group-hover:scale-105 transition-transform">{stat.value}</span>
                  <span className="text-white/60 text-[10.5px] font-mono uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
           3. CLINICAL OVERVIEW & TARGETED PATTERNS (Modern Magazine Editorial Layout)
           ════════════════════════════════════════════════════════ */}
        <section id="overview" className="py-24 md:py-32 bg-white border-b border-border-light relative overflow-hidden">
          {/* Subtle Ambient Light Texture */}
          <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gold-dark/[0.03] rounded-full blur-[140px] pointer-events-none" />

          <div className="site-container relative z-10">
            {/* Magazine Header Statement */}
            <div className="max-w-3xl mb-16 md:mb-20 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-gold-dark" />
                <p className="section-label text-gold-dark">
                  {pg.overviewSectionLabel}
                </p>
              </div>

              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[44px] md:text-[60px] text-dark leading-[1.06] tracking-tight">
                {pg.overviewTitle1}{' '}
                <span className="text-gold-dark italic font-light block sm:inline">
                  {pg.overviewTitle2}
                </span>
              </h2>
            </div>

            {/* Asymmetric 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
              {/* Left Column: Offset Photography Frame with Floating Badge */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="relative w-full h-full min-h-[460px] rounded-lg overflow-hidden shadow-2xl border border-border-light p-2.5 bg-warm-white/80 group">
                  <div className="relative w-full h-full min-h-[440px] rounded-md overflow-hidden">
                    <img
                      src={serviceImage}
                      alt={serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />

                    {/* Top Watermark Tag */}
                    <div className="absolute top-5 left-5 bg-dark/85 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/20">
                      <span className="text-gold font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                        {pg.overviewWatermark}
                      </span>
                    </div>

                    {/* Floating Clinical Badge */}
                    <div className="absolute bottom-6 left-6 right-6 p-5 rounded-md bg-white/95 backdrop-blur-md border border-border-light shadow-2xl flex items-center justify-between text-dark">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-sm bg-gold-dark/15 border border-gold-dark/30 flex items-center justify-center text-gold-dark flex-shrink-0">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-dark text-[13.5px] font-bold">{pg.tailoredLabel}</p>
                          <p className="text-dark/50 text-[10.5px] font-mono uppercase tracking-wider">{pg.tailoredSub}</p>
                        </div>
                      </div>
                      <span className="text-gold-dark font-mono text-[11px] font-bold">{pg.overviewSuccessRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative + Targeted Patterns & Benefit Cards */}
              <div className="lg:col-span-7 flex flex-col justify-between text-left">
                <div>
                  {/* Overview Clinical Narrative */}
                  <div
                    className="text-dark/75 text-[16px] md:text-[17.5px] leading-[1.85] font-light mb-8"
                    dangerouslySetInnerHTML={{ __html: formatRichText(pg.overviewDescription, false) }}
                  />

                  {/* Feature & Pattern Cards */}
                  <div className="space-y-4 mb-10">
                    {benefits.map((benefit: any, idx: number) => {
                      const benefitTitle = typeof benefit === 'string' ? benefit : (benefit.title || "");
                      const benefitDesc = typeof benefit === 'string' ? pg.benefitCardDesc : (benefit.description || pg.benefitCardDesc);
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-lg bg-card-bg border border-border-light/80 hover:border-gold-dark/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl flex items-start gap-4 group relative overflow-hidden"
                        >
                          <div className="h-[2px] w-full bg-gradient-to-r from-gold-dark/60 via-gold-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 left-0" />

                          <div className="w-10 h-10 rounded-md bg-gold-dark/15 border border-gold-dark/30 flex items-center justify-center text-gold-dark font-serif font-bold text-[18px] flex-shrink-0 group-hover:bg-gold-dark group-hover:text-white transition-colors">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-dark font-bold text-[17px] mb-1 group-hover:text-gold-dark transition-colors">
                              {sh(benefitTitle)}
                            </h3>
                            <div
                              className="text-dark/65 text-[13.5px] font-light leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: formatRichText(benefitDesc, false) }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-border-light flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={pg.overviewCtaUrl}
                    target={pg.overviewCtaUrl.startsWith("http") ? "_blank" : undefined}
                    rel={pg.overviewCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="btn-gold px-9 py-4 text-[13px] font-bold tracking-wider rounded-md shadow-lg"
                  >
                    {pg.overviewCtaText} <ArrowRight size={14} className="ml-1" />
                  </a>

                  <div className="flex items-center gap-2 text-dark/50 text-[12px] font-mono">
                    <CheckCircle2 size={15} className="text-gold-dark" />
                    <span>{pg.overviewHipaaText}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           4. WHY US & TARGET CANDIDATES (Editorial Grid)
           ════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-brand-bg-light border-b border-border-light relative">
          <div className="site-container">
            {/* Centered Editorial Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-3.5">
                <span className="w-6 h-[1px] bg-gold-dark" />
                <p className="section-label text-gold-dark">
                  {pg.candidateSectionLabel}
                </p>
                <span className="w-6 h-[1px] bg-gold-dark" />
              </div>
              <h2 className="font-display font-medium text-[34px] min-[400px]:text-[44px] md:text-[52px] text-dark leading-[1.08] tracking-tight mb-4">
                {pg.candidateTitle1}{' '}
                <span className="text-gold-dark italic font-light block sm:inline">
                  {pg.candidateTitle2}
                </span>
              </h2>
              {pg.candidateDescription && (
                <div
                  className="text-dark/70 text-[15px] md:text-[16.5px] font-light leading-relaxed max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: formatRichText(pg.candidateDescription, false) }}
                />
              )}
            </div>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {pg.whoProfiles.map((profile: any, idx: number) => (
                <div
                  key={idx}
                  className="candidate-card-clean p-8 rounded-xl bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 border-b border-border-light/70 pb-4 relative z-10">
                      <span className="text-gold-dark font-serif font-bold text-[28px] leading-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gold-dark/10 text-gold-dark text-[10.5px] font-mono font-bold tracking-widest uppercase">
                        {pg.profileBadgePrefix} {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-dark font-bold text-[19px] mb-2.5 leading-snug group-hover:text-gold-dark transition-colors relative z-10">
                      {sh(profile.label)}
                    </h3>

                    <div
                      className="text-dark/65 text-[14px] font-light leading-relaxed relative z-10"
                      dangerouslySetInnerHTML={{ __html: formatRichText(profile.desc, false) }}
                    />
                  </div>

                  <div className="mt-8 pt-4 border-t border-border-light/80 flex items-center justify-between text-gold-dark text-[11.5px] font-mono font-bold tracking-wider uppercase relative z-10">
                    <span>{profile.suitability || profile.status || pg.candidateSuitability}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           5. SESSION PROTOCOL (Dark Luxury Connected Stepper Stage)
           ════════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-dark text-white relative border-b border-white/10 overflow-hidden">
          {/* Ambient Gold Glow Orbs */}
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[160px] pointer-events-none" />

          <div className="site-container relative z-10">
            <div className="max-w-3xl mb-16 md:mb-20 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-gold" />
                <p className="text-gold font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
                  {pg.protocolSectionLabel}
                </p>
              </div>
              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[46px] md:text-[54px] text-white leading-[1.06] tracking-tight mb-4">
                {pg.protocolTitle1} <br />
                <span className="text-gold italic font-light">{pg.protocolTitle2}</span>
              </h2>
              {pg.protocolDescription && (
                <div
                  className="text-white/70 text-[15px] md:text-[16px] font-light leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: formatRichText(pg.protocolDescription, true) }}
                />
              )}
            </div>

            {/* Dynamic Step Connected Cards */}
            <div className={stepperGridClass}>
              {pg.sessionSteps.map((step: any, idx: number) => (
                <div
                  key={step.num || idx}
                  className="stepper-card-dark p-8 md:p-9 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] transition-all duration-300 shadow-2xl flex flex-col justify-between group relative overflow-hidden backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="stepper-step-num w-12 h-12 rounded-lg bg-gold/15 flex items-center justify-center text-gold font-mono font-bold text-[15px] transition-all">
                        {step.num || `0${idx + 1}`}
                      </div>
                      <span className="stepper-step-time px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-mono font-bold tracking-widest uppercase">
                        {pg.protocolDurations[idx] || '15 MIN'}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-[19px] mb-3 leading-snug group-hover:text-gold transition-colors">
                      {sh(step.title)}
                    </h3>

                    <div
                      className="text-white/65 text-[14px] font-light leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatRichText(step.desc, true) }}
                    />
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-gold text-[12px] font-bold tracking-wider uppercase">
                    <span>{((pg.protocolPhasePrefix || "STEP").trim().replace(/0+$/, "").trim())} {String(idx + 1).padStart(2, '0')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Conversion Banner */}
            <div className="stepper-banner-cta mt-16 p-8 md:p-10 rounded-xl bg-gradient-to-r from-gold/20 via-dark to-dark flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-left border border-white/10">
              <div className="max-w-xl">
                {pg.protocolBannerBadge && (
                  <span className="text-gold font-mono text-[10.5px] font-bold tracking-widest uppercase block mb-1">
                    {pg.protocolBannerBadge}
                  </span>
                )}
                <h3 className="font-display font-medium text-[22px] md:text-[28px] text-white leading-snug">
                  {pg.protocolBannerTitle ? (
                    pg.protocolBannerTitle
                  ) : (
                    <>
                      {pg.protocolBannerTitlePrefix}  {pg.protocolBannerTitleSuffix}
                    </>
                  )}
                </h3>
                {pg.protocolBannerDescription && (
                  <div
                    className="text-white/70 text-[14px] font-light mt-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatRichText(pg.protocolBannerDescription, true) }}
                  />
                )}
              </div>
              <a
                href={pg.protocolBannerCtaUrl}
                target={pg.protocolBannerCtaUrl.startsWith("http") ? "_blank" : undefined}
                rel={pg.protocolBannerCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="btn-gold px-9 py-4 text-[13px] font-bold tracking-wider flex-shrink-0 rounded-md shadow-[0_10px_30px_rgba(200,150,12,0.25)] flex items-center gap-2"
              >
                <span>{pg.protocolBannerCta}</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════════
         6. BUILT-IN CONTACT & FAQ SECTION
         ════════════════════════════════════════════════════════ */}
      <ContactFaqSection pageData={service} />
    </>
  );
}
