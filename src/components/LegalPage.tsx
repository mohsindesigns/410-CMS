"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "../config/icons";
import { parsePrivacyBody, type PrivacyContent } from "../lib/privacy";
import PageBreadcrumb from "./PageBreadcrumb";

/** **bold** and [text](/link) inside a line of policy text */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      return /^https?:\/\//i.test(href)
        ? <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link[1]}</a>
        : <Link key={i} href={href} className="text-primary hover:underline">{link[1]}</Link>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/** a line of the contact card: emails and phone numbers become links */
function ContactLine({ line }: { line: string }) {
  const t = line.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    return (
      <a href={`mailto:${t}`} className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
        {t}
        <Icon name="ArrowRight" className="w-4 h-4" />
      </a>
    );
  }
  if (/^[+()\d][\d\s().+-]{6,}$/.test(t)) {
    return <a href={`tel:${t.replace(/[^\d+]/g, "")}`} className="text-primary hover:underline">{t}</a>;
  }
  return <>{t}</>;
}

/** Shared layout of the managed legal pages (/privacy/, /terms/). */
export default function LegalPage({ cfg, breadcrumbKey, icon = "Shield" }: { cfg: PrivacyContent; breadcrumbKey: string; icon?: string }) {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <PageBreadcrumb pageKey={breadcrumbKey as any} tone="light" centered className="mb-5" />
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 mb-6">
              <Icon name={icon as any} className="w-4 h-4 text-primary" />
              <span className="text-primary uppercase tracking-wider text-xs font-semibold">{cfg.label}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4">
              {cfg.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{cfg.title2}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {cfg.sections.map((s, idx) => {
              const highlight = s.style === "highlight";
              return (
                <div
                  key={s.id || idx}
                  className={`rounded-2xl border p-6 md:p-8 ${highlight ? "bg-gradient-to-r from-primary/5 via-card to-primary/5 border-primary/30" : "bg-card border-border"}`}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{s.heading}</h2>
                  <div className="space-y-3">
                    {parsePrivacyBody(s.body).map((b, i) =>
                      b.type === "ul" ? (
                        <ul key={i} className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                          {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
                        </ul>
                      ) : (
                        <p key={i} className="text-muted-foreground leading-relaxed">{renderInline(b.text)}</p>
                      )
                    )}
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-r from-primary/10 via-card to-primary/10 rounded-2xl border border-primary/30 p-6 md:p-8 text-center">
              <Icon name="Mail" className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{cfg.contactHeading}</h2>
              <div className="text-muted-foreground space-y-1">
                {cfg.contactBody.split("\n").filter((l) => l.trim()).map((l, i) => (
                  <p key={i}><ContactLine line={l} /></p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
