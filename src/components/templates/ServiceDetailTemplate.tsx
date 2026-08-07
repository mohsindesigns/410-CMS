"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Activity,
  Target,
  Loader2
} from 'lucide-react';
import { useContent } from "../../hooks/useContent";
import ContactFaqSection from '../QAForm';
import RichTextRenderer from "../ui/RichTextRenderer";

export default function ServiceDetailTemplate({ pageData, params: syncParams }: { pageData?: any, params?: any }) {
  const { services: servicesData, globalMetadata, serviceDetailPage: globalServiceDetailPage } = useContent();
  const [slug, setSlug] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (pageData?.slug) setSlug(pageData.slug);
    else if (syncParams?.slug) {
      const pSlug = syncParams.slug;
      setSlug(Array.isArray(pSlug) ? pSlug.join('/') : pSlug);
    }
  }, [pageData, syncParams]);

  const servicesList = (servicesData as any).services || [];
  const service = servicesList.find((s: any) => s.slug === slug) || (servicesData as any).items?.find((s: any) => s.slug === slug);

  useEffect(() => {
    if (service) {
      setIsDataLoaded(true);
    }
  }, [service]);

  if (!service || !isDataLoaded) {
    return (
      <main className="bg-dark min-h-screen pt-[140px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const pageContent = pageData?.content || {};
  const serviceDetailPage = pageContent.serviceDetailPage || globalServiceDetailPage || {};

  // Hydrate configurations with defaults
  const pg = {
    backLink: service.backLink || serviceDetailPage.backLink || "Back to All Services",
    heroSectionLabel: service.heroSectionLabel || serviceDetailPage.heroSectionLabel || "CLINICAL RECOVERY PROTOCOL",
    profileBadgePrefix: service.profileBadgePrefix || serviceDetailPage.profileBadgePrefix || "PROFILE",
    specialtyBadge: service.specialtyBadge || serviceDetailPage.specialtyBadge || "Clinical Specialty",
    tailoredLabel: service.tailoredLabel || serviceDetailPage.tailoredLabel || "100% Tailored Therapy",
    tailoredSub: service.tailoredSub || serviceDetailPage.tailoredSub || "Individualized Protocols",
    specDurationLabel: service.specDurationLabel || serviceDetailPage.specDurationLabel || "Duration",
    specDurationValue: service.specDurationValue || serviceDetailPage.specDurationValue || "60 / 90 Mins",
    specIntensityLabel: service.specIntensityLabel || serviceDetailPage.specIntensityLabel || "Intensity",
    specIntensityValue: service.specIntensityValue || serviceDetailPage.specIntensityValue || "Targeted Deep",
    specFocusLabel: service.specFocusLabel || serviceDetailPage.specFocusLabel || "Focus",
    specFocusValue: service.specFocusValue || serviceDetailPage.specFocusValue || "Trigger Mapping",
    specResultsLabel: service.specResultsLabel || serviceDetailPage.specResultsLabel || "Results",
    specResultsValue: service.specResultsValue || serviceDetailPage.specResultsValue || "Immediate Relief",
    bookingDesc: service.bookingDesc || serviceDetailPage.bookingDesc || "Schedule your consultation with Antoine Lyles and start feeling pain-free.",
    bookingCta: service.bookingCta || serviceDetailPage.bookingCta || "Book Appointment Now",
    heroDescriptionSuffix: service.heroDescriptionSuffix || service.heroDescription || serviceDetailPage.heroDescriptionSuffix || "Targeted manual therapy engineered to eliminate chronic pain, unlock joint mobility, and accelerate athletic recovery.",
    heroCtaSecondary: service.heroCtaSecondary || serviceDetailPage.heroCtaSecondary || "SEE HOW IT HELPS",
    statsItem1Val: service.statsItem1Val || serviceDetailPage.statsItem1Val || "98%",
    statsItem1Label: service.statsItem1Label || serviceDetailPage.statsItem1Label || "Pain Relief Success",
    statsItem2Val: service.statsItem2Val || serviceDetailPage.statsItem2Val || "5,000+",
    statsItem2Label: service.statsItem2Label || serviceDetailPage.statsItem2Label || "Sessions Completed",
    statsItem3Val: service.statsItem3Val || serviceDetailPage.statsItem3Val || "Est. 2020",
    statsItem3Label: service.statsItem3Label || serviceDetailPage.statsItem3Label || "Clinical Standard",
    statsItem4Val: service.statsItem4Val || serviceDetailPage.statsItem4Val || "100%",
    statsItem4Label: service.statsItem4Label || serviceDetailPage.statsItem4Label || "Targeted Protocols",
    overviewSectionLabel: service.overviewSectionLabel || serviceDetailPage.overviewSectionLabel || "WHY THIS THERAPY WORKS",
    overviewTitle1: service.overviewTitle1 || service.overviewTitlePrefix || serviceDetailPage.overviewTitle1 || "Targeted Bodywork.",
    overviewTitle2: service.overviewTitle2 || service.overviewTitleHighlight || serviceDetailPage.overviewTitle2 || "Engineered For Recovery.",
    overviewWatermark: service.overviewWatermark || serviceDetailPage.overviewWatermark || "SPECIALIST PRACTICE • EST. 2020",
    overviewSuccessRate: service.overviewSuccessRate || serviceDetailPage.overviewSuccessRate || "98% SUCCESS",
    overviewIntroSuffix: service.overviewIntroSuffix || serviceDetailPage.overviewIntroSuffix || "We map postural compensations and active muscle trigger points to eliminate root-cause pain, flush soreness, and decompress joint structures.",
    overviewCtaText: service.overviewCtaText || serviceDetailPage.overviewCtaText || "BOOK YOUR SESSION NOW",
    overviewHipaaText: service.overviewHipaaText || serviceDetailPage.overviewHipaaText || "HIPAA Compliant & Certified",
    candidateSectionLabel: service.candidateSectionLabel || serviceDetailPage.candidateSectionLabel || "TARGET CANDIDATES",
    candidateTitle1: service.candidateTitle1 || serviceDetailPage.candidateTitle1 || "Who Benefits Most.",
    candidateTitle2: service.candidateTitle2 || serviceDetailPage.candidateTitle2 || "Clinical Indications.",
    candidateSuitability: service.candidateSuitability || serviceDetailPage.candidateSuitability || "SUITABILITY: OPTIMAL",
    protocolSectionLabel: service.protocolSectionLabel || serviceDetailPage.protocolSectionLabel || "02 / SESSION PROTOCOL",
    protocolTitle1: service.protocolTitle1 || serviceDetailPage.protocolTitle1 || "3-Phase Clinical",
    protocolTitle2: service.protocolTitle2 || serviceDetailPage.protocolTitle2 || "Treatment Sequence.",
    protocolPhasePrefix: service.protocolPhasePrefix || serviceDetailPage.protocolPhasePrefix || "PHASE 0",
    protocolDurations: service.protocolDurations || serviceDetailPage.protocolDurations || ["15 MIN", "45 MIN", "15 MIN"],
    protocolBannerBadge: service.protocolBannerBadge || serviceDetailPage.protocolBannerBadge || "CLINICAL EXCELLENCE",
    protocolBannerTitlePrefix: service.protocolBannerTitlePrefix || serviceDetailPage.protocolBannerTitlePrefix || "Ready to experience",
    protocolBannerTitleSuffix: service.protocolBannerTitleSuffix || serviceDetailPage.protocolBannerTitleSuffix || "?",
    protocolBannerCta: service.protocolBannerCta || serviceDetailPage.protocolBannerCta || "BOOK YOUR SESSION NOW",
    benefitsTitle: service.benefitsTitle || serviceDetailPage.benefitsTitle || "Key Clinical Benefits",
    benefitCardDesc: service.benefitCardDesc || serviceDetailPage.benefitCardDesc || "Targeted mechanical input designed to accelerate tissue recovery and restore movement.",
    whoTitle: service.whoTitle || serviceDetailPage.whoTitle || "Who Is This Therapy For?",
    whoProfiles: service.whoProfiles || serviceDetailPage.whoProfiles || [
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
    sessionTitle: service.sessionTitle || serviceDetailPage.sessionTitle || "What To Expect During Your Session",
    sessionSteps: service.sessionSteps || (service.process && service.process.length > 0 ? service.process.map((step: any, idx: number) => ({
      num: String(idx + 1).padStart(2, '0'),
      title: step.title,
      desc: step.description || step.desc || ""
    })) : null) || serviceDetailPage.sessionSteps || [
      {
        num: "01",
        title: "Postural & Palpation Assessment",
        desc: "We begin with an active range-of-motion test and palpation to pinpoint tight muscle groups and trigger points."
      },
      {
        num: "02",
        title: "Targeted Myofascial Release",
        desc: "Hands-on application of deep tissue pressure, myofascial release, and cross-fiber friction adjusted to your comfort level."
      },
      {
        num: "03",
        title: "Post-Session Recovery Plan",
        desc: "We measure mobility improvements post-therapy and provide personalized home stretching recommendations."
      }
    ]
  };

  const serviceName = service.title || service.name || "";
  const titleWords = serviceName.split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastTitleWord = titleWords[titleWords.length - 1] || "";
  const serviceImage = service.image || service.featuredImage || "/images/service-massage.webp";
  const bookingUrl = globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy";
  const benefits = service.benefits || [];
  const statsList = [
    { value: service.statsItem1Val || pg.statsItem1Val, label: service.statsItem1Label || pg.statsItem1Label },
    { value: service.statsItem2Val || pg.statsItem2Val, label: service.statsItem2Label || pg.statsItem2Label },
    { value: service.statsItem3Val || pg.statsItem3Val, label: service.statsItem3Label || pg.statsItem3Label },
    { value: service.statsItem4Val || pg.statsItem4Val, label: service.statsItem4Label || pg.statsItem4Label }
  ];

  return (
    <>
      <main className="w-full bg-off-white text-body overflow-hidden">
        {/* ════════════════════════════════════════════════════════
           1. HERO SECTION (Matching Site Hero Aesthetics)
           ════════════════════════════════════════════════════════ */}
        <section className="relative bg-dark min-h-[80vh] flex items-center pt-[130px] pb-20 border-b border-border-dark overflow-hidden">
          {/* Completely Blended Ambient Background Image */}
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
            {/* Top Breadcrumb Link */}
            <div className="mb-6">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-[11.5px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                <ArrowLeft size={14} className="text-gold" />
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
                {mainTitle}{' '}
                <span className="text-gold italic font-light block sm:inline">{lastTitleWord}</span>
              </h1>

              {/* Description */}
              <p className="text-white/75 md:text-white/65 text-[15px] md:text-[17px] leading-[1.8] max-w-[540px] mb-8 font-light">
                {service.description} {pg.heroDescriptionSuffix}
              </p>

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
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full sm:w-auto justify-center text-center px-8 py-4"
                >
                  {pg.bookingCta} <ArrowRight size={14} className="ml-1" />
                </a>
                <a href="#overview" className="btn-outline-white w-full sm:w-auto justify-center text-center px-8 py-4">
                  {pg.heroCtaSecondary} <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           1.5 HIGHLIGHT STATS STRIP (Dark Luxury Accent)
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
           2. CLINICAL OVERVIEW & KEY ADVANTAGES (Option 1: Modern Magazine Editorial Layout)
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

              {/* Right Column: Editorial Feature Cards */}
              <div className="lg:col-span-7 flex flex-col justify-between text-left">
                <div>
                  <p className="text-dark/75 text-[16px] md:text-[17.5px] leading-[1.85] font-light mb-8">
                    {service.description} {pg.overviewIntroSuffix}
                  </p>

                  {/* 4 Feature Row Cards */}
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
                          <div>
                            <h3 className="text-dark font-bold text-[17px] mb-1 group-hover:text-gold-dark transition-colors">
                              {benefitTitle}
                            </h3>
                            <p className="text-dark/65 text-[13.5px] font-light leading-relaxed">
                              {benefitDesc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-border-light flex flex-wrap items-center justify-between gap-4">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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
           3. TARGET CANDIDATES (Clean Light-Mode Luxury Editorial Grid)
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
              <h2 className="font-display font-medium text-[34px] min-[400px]:text-[44px] md:text-[52px] text-dark leading-[1.08] tracking-tight">
                {pg.candidateTitle1}{' '}
                <span className="text-gold-dark italic font-light block sm:inline">
                  {pg.candidateTitle2}
                </span>
              </h2>
            </div>

            {/* 2x2 Clean Editorial Feature Grid */}
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
                        {pg.profileBadgePrefix || "PROFILE"} {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-dark font-bold text-[19px] mb-2.5 leading-snug group-hover:text-gold-dark transition-colors relative z-10">
                      {profile.label}
                    </h3>

                    <p className="text-dark/65 text-[14px] font-light leading-relaxed relative z-10">
                      {profile.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border-light/80 flex items-center justify-between text-gold-dark text-[11.5px] font-mono font-bold tracking-wider uppercase relative z-10">
                    <span>{pg.candidateSuitability}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
           4. SESSION SEQUENCE PROTOCOL (Dark Luxury Connected Stepper Stage)
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
              <h2 className="font-display font-medium text-[36px] min-[400px]:text-[46px] md:text-[54px] text-white leading-[1.06] tracking-tight">
                {pg.protocolTitle1} <br />
                <span className="text-gold italic font-light">{pg.protocolTitle2}</span>
              </h2>
            </div>

            {/* 3 Step Connected Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {pg.sessionSteps.map((step: any, idx: number) => (
                <div
                  key={step.num}
                  className="stepper-card-dark p-8 md:p-9 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] transition-all duration-300 shadow-2xl flex flex-col justify-between group relative overflow-hidden backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="stepper-step-num w-12 h-12 rounded-lg bg-gold/15 flex items-center justify-center text-gold font-mono font-bold text-[15px] transition-all">
                        {step.num}
                      </div>
                      <span className="stepper-step-time px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-mono font-bold tracking-widest uppercase">
                        {pg.protocolDurations[idx] || '15 MIN'}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-[19px] mb-3 leading-snug group-hover:text-gold transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-white/65 text-[14px] font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-gold text-[12px] font-bold tracking-wider uppercase">
                    <span>{pg.protocolPhasePrefix}{String(idx + 1).padStart(2, '0')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Banner */}
            <div className="stepper-banner-cta mt-16 p-8 md:p-10 rounded-xl bg-gradient-to-r from-gold/20 via-dark to-dark flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-left">
              <div>
                <span className="text-gold font-mono text-[10.5px] font-bold tracking-widest uppercase block mb-1">{pg.protocolBannerBadge}</span>
                <h3 className="font-display font-medium text-[22px] md:text-[28px] text-white">{pg.protocolBannerTitlePrefix} {serviceName}{pg.protocolBannerTitleSuffix}</h3>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-9 py-4 text-[13px] font-bold tracking-wider flex-shrink-0 rounded-md shadow-[0_10px_30px_rgba(200,150,12,0.25)]"
              >
                {pg.protocolBannerCta} <ArrowRight size={14} className="ml-1" />
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* Built-in Contact & FAQ Section */}
      <ContactFaqSection pageData={pageData} />
    </>
  );
}
