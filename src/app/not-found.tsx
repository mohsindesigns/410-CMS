"use client";

import Link from "next/link";
import { ArrowRight, Home, Compass, BookOpen, PhoneCall } from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    {
      title: "Clinical Services",
      desc: "Deep tissue, mobility & performance bodywork",
      href: "/services/",
      icon: Compass,
    },
    {
      title: "Recovery Journal",
      desc: "Expert therapy tips & clinical insights",
      href: "/blogs/",
      icon: BookOpen,
    },
    {
      title: "Contact & Location",
      desc: "Find our clinic & connect with our therapists",
      href: "/#contact",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="relative min-h-[90vh] bg-[#0A0A0A] text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Subtle Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, #C8960C 1px, transparent 1px), linear-gradient(to bottom, #C8960C 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Gold Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          404 Error • Page Not Found
        </div>

        {/* Big Stylized 404 */}
        <h1 className="text-8xl sm:text-9xl md:text-[160px] font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-gold/30 select-none">
          404
        </h1>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mt-2 mb-4 font-heading">
          Lost Your Way to Recovery?
        </h2>
        <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
          The page or therapy session you are looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold hover:bg-gold-light text-dark font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(200,150,12,0.35)] hover:shadow-[0_0_35px_rgba(200,150,12,0.55)] transform hover:-translate-y-0.5"
          >
            <Home size={17} />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/services/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 hover:border-gold/50 font-semibold text-sm tracking-wider uppercase rounded-xl transition-all duration-300"
          >
            <span>Explore Services</span>
            <ArrowRight size={16} className="text-gold" />
          </Link>
        </div>

        {/* Helpful Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/10 text-left">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-gold/40 transition-all duration-200"
              >
                <div className="h-8 w-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-2.5 group-hover:bg-gold group-hover:text-dark transition-colors">
                  <Icon size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-gold transition-colors flex items-center justify-between">
                  {item.title}
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gold" />
                </h3>
                <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed font-light">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
