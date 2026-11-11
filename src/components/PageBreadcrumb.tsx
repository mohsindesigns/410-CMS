"use client";

import Link from "next/link";
import { useContent } from "../hooks/useContent";
import { servicePageText, type ServicePageTextKey } from "../lib/servicePageText";

/**
 * Visible "Home / <page>" breadcrumb for top-level pages (it matches the BreadcrumbList in the page's schema).
 * The wording is managed in Admin > Settings > Service Pages > Breadcrumb names.
 */
export default function PageBreadcrumb({
  pageKey,
  tone = "dark",
  centered = false,
  className = "",
}: {
  pageKey: Extract<ServicePageTextKey, `breadcrumb${string}`>;
  /** "dark" = for dark hero backgrounds, "light" = for white pages */
  tone?: "dark" | "light";
  centered?: boolean;
  className?: string;
}) {
  const { serviceDetailPage } = useContent() as any;
  const home = servicePageText(null, serviceDetailPage, "breadcrumbHome");
  const current = servicePageText(null, serviceDetailPage, pageKey);
  const aria = servicePageText(null, serviceDetailPage, "breadcrumbAria");
  const dark = tone === "dark";

  return (
    <nav
      aria-label={aria}
      className={`text-[11.5px] sm:text-[12px] font-mono tracking-wider ${dark ? "text-white/50" : "text-muted-foreground"} ${className}`}
    >
      <ol className={`flex flex-wrap items-center gap-2 ${centered ? "justify-center" : ""}`}>
        <li>
          <Link href="/" className={dark ? "hover:text-gold transition-colors text-white/70" : "hover:text-primary transition-colors text-foreground"}>
            {home}
          </Link>
        </li>
        <li aria-hidden="true" className={dark ? "text-gold/50" : "text-primary/50"}>/</li>
        <li>
          <span aria-current="page" className={`${dark ? "text-gold" : "text-primary"} font-medium`}>{current}</span>
        </li>
      </ol>
    </nav>
  );
}
