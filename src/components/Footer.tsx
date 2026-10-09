"use client";

import { useState, useEffect, useRef } from "react";
import { useContent } from "../hooks/useContent";
import { useContentContext } from "../context/ContentContext";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { buildHoursLines } from "../lib/hours";

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

/** Keep safe inline formatting (links, bold, breaks) but drop scripts/handlers */
function sanitizeInlineHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/* ── Logo ──────────────────────────────────────────────── */
function FooterLogo({ logoUrl, siteTitle, logoText1, logoText2 }: { logoUrl?: string; siteTitle?: string; logoText1?: string; logoText2?: string }) {
  if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/uploads') || logoUrl.startsWith('/cdn-images'))) {
    return (
      <Link href="/" className="inline-flex items-center gap-3 mb-4">
        <div className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] flex items-center justify-center overflow-hidden">
          <img
            src={logoUrl}
            alt={siteTitle || "410 Muscle Therapy Logo"}
            width="150"
            height="29"
            loading="lazy"
            decoding="async"
            className="object-contain w-full h-full"
          />
        </div>
      </Link>
    );
  }
  return (
    <Link href="/" className="inline-flex items-center gap-3 mb-6">
      <svg width="36" height="42" viewBox="0 0 42 48" fill="none" className="md:w-[42px] md:h-[48px] flex-shrink-0">
        <path d="M21 1L40 9.5V25C40 36.5 31.5 44.5 21 47C10.5 44.5 2 36.5 2 25V9.5L21 1Z" fill="#C8960C" />
        <text x="21" y="33" textAnchor="middle" fill="#0A0A0A" fontFamily="Georgia,serif" fontSize="20" fontWeight="bold" fontStyle="italic">M</text>
      </svg>
      <span className="flex flex-col text-left">
        <span className="text-[15px] md:text-[18px] font-black tracking-[0.2em] text-white leading-none">
          {logoText1 || "MUSCLE"}
        </span>
        <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-gold mt-1 leading-none">
          {logoText2 || "THERAPY"}
        </span>
      </span>
    </Link>
  );
}

/* ── Social Icons — only renders platforms added from dashboard ── */
function SocialIcons({ socialItems }: { socialItems?: any[] }) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[Footer] socialItems received:', socialItems);
  }

  if (!socialItems || socialItems.length === 0) return null;

  // Show all entries that have a platform name
  const activeSocials = socialItems.filter((s: any) => s.platform && s.platform.trim() !== '');

  if (activeSocials.length === 0) return null;

  return (
    <div className="flex gap-2.5 mt-4 justify-start">
      {activeSocials.map((s: any, i: number) => {
        // Look up iconName from s.icon or s.platform
        const iconName = s.icon || s.platform || '';
        // Format to PascalCase to match Lucide icon export names
        const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

        let IconComponent = (LucideIcons as any)[formattedIconName];

        // Specific fallbacks for common lowercase names if not direct match
        if (!IconComponent) {
          const lower = formattedIconName.toLowerCase();
          if (lower === 'linkedin') {
            IconComponent = LucideIcons.Linkedin;
          } else if (lower === 'facebook') {
            IconComponent = LucideIcons.Facebook;
          } else if (lower === 'instagram') {
            IconComponent = LucideIcons.Instagram;
          } else if (lower === 'twitter') {
            IconComponent = LucideIcons.Twitter;
          } else if (lower === 'youtube') {
            IconComponent = LucideIcons.Youtube;
          } else {
            IconComponent = LucideIcons.Share2;
          }
        }

        const href = s.href && s.href.trim() !== '' ? s.href : '#';
        return (
          <a
            key={`${s.platform}-${i}`}
            href={href}
            target={href !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label={s.platform}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all duration-200"
          >
            <IconComponent size={16} strokeWidth={1.5} />
          </a>
        );
      })}
    </div>
  );
}


/* ── Map Placeholder ───────────────────────────────────── */
function MapPlaceholder({ addressText, embedUrl, iframeHtml }: { addressText: string; embedUrl?: string | null; iframeHtml?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (embedUrl) {
    return (
      <div ref={containerRef} className="mt-5 h-[160px] w-full rounded-md overflow-hidden border border-white/10 relative bg-dark-3">
        {isVisible ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map location"
          />
        ) : (
          <div aria-hidden="true" className="w-full h-full flex items-center justify-center text-white/80 text-xs font-mono">
            Loading map...
          </div>
        )}
      </div>
    );
  }
  if (iframeHtml) {
    // Legacy path: iframe was pasted directly into the address field
    const styledIframe = iframeHtml
      .replace(/width="[^"]*"/i, 'width="100%"')
      .replace(/height="[^"]*"/i, 'height="100%"');
    return (
      <div
        ref={containerRef}
        className="mt-5 h-[160px] w-full rounded-md overflow-hidden border border-white/10 relative bg-dark-3"
      >
        {isVisible ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: styledIframe }} />
        ) : (
          <div aria-hidden="true" className="w-full h-full flex items-center justify-center text-white/80 text-xs font-mono">
            Loading map...
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="mt-5 h-24 sm:h-28 bg-white/[0.03] rounded-md overflow-hidden relative flex items-center justify-center border border-white/10">
      <div className="relative flex flex-col items-center gap-1.5 px-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#C8960C">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <p className="text-white/55 text-[10.5px] font-medium text-center whitespace-pre-line leading-tight">{addressText}</p>
      </div>
    </div>
  );
}

export default function Footer() {
  const { footer, navbar, services: servicesData, hours } = useContent();
  const rawCtx = useContentContext();
  const rawFooter = rawCtx?.footer || {};

  const contactInfo = footer?.contact || {};
  const companyInfo = footer?.company || {};
  const bottomInfo = footer?.bottom || {};
  const socialLinks: any[] = Array.isArray(rawFooter.social) ? rawFooter.social
    : Array.isArray((footer as any)?.social) ? (footer as any).social
      : [];

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[Footer] rawFooter.social:', rawFooter.social, '| socialLinks:', socialLinks);
  }

  const {
    quickLinksLabel = "Quick Links",
    servicesLabel = "Services",
    contactLabel = "Contact Us",
    privacy = "Privacy Policy",
    terms = "Terms & Conditions",
    divider = "|"
  } = footer || {};

  const brandDescriptionText: string = stripHtml(
    companyInfo.description || (footer as any)?.brandDescription || "Elite performance recovery bodywork, mobility optimization, and injury prevention for athletes and active adults in Maryland."
  );

  // Extract map iframe if present in the address field
  const rawAddress = contactInfo.address || (footer as any)?.address || "1301 York Rd., 8th Floor, Ste 48\nTimonium, MD 21093";
  const iframeRegex = /<iframe[^>]*>[\s\S]*?<\/iframe>/i;
  const match = rawAddress.match(iframeRegex);
  const iframeHtml = match ? match[0] : null;

  // Clean address text by removing the iframe block
  const addressCleanHtml = rawAddress.replace(iframeRegex, "").trim();
  const addressText = stripHtml(addressCleanHtml);
  const addressHtml: string = sanitizeInlineHtml(addressCleanHtml);

  // Only a real "Embed a map" pb= URL survives inside an <iframe> — anything else
  // (a share link, a g.page link, a plain maps.google.com URL) gets blocked by
  // Google with "refused to connect". So a raw admin-pasted URL is only trusted
  // when it's actually an embed URL; otherwise we build a reliable embed
  // ourselves from the business address, which always works without an API key.
  const rawMapEmbedUrl: string = contactInfo.mapEmbedUrl || (footer as any)?.mapEmbedUrl || "";

  // Convert any Google Maps share/place URL (or a full pasted <iframe> tag) into
  // a bare embeddable URL. Accepted inputs from admin:
  //   ✅ <iframe src="https://www.google.com/maps/embed?pb=...">...</iframe>  (full "Copy HTML" block — src extracted)
  //   ✅ https://www.google.com/maps/embed?pb=...  (already embed)
  //   ✅ https://maps.google.com/?q=...             (share link → convert)
  //   ✅ https://www.google.com/maps/place/...      (place link → convert)
  //   ✅ https://goo.gl/maps/...                    (short link — can't auto-convert, fall back)
  function toEmbedUrl(raw: string): string {
    if (!raw) return "";
    let candidate = raw.trim();

    // Admin pasted the whole <iframe ...>...</iframe> block from Google's "Copy HTML"
    // button instead of just the URL — pull the src="" attribute out of it.
    const iframeSrcMatch = candidate.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    if (iframeSrcMatch) candidate = iframeSrcMatch[1];

    // Guard against any other stray HTML/garbage that isn't a real URL.
    if (!/^https?:\/\//i.test(candidate)) return "";

    if (candidate.includes("/maps/embed")) return candidate; // already embed
    if (candidate.includes("google.com/maps") || candidate.includes("maps.google.com")) {
      // Extract q= param if present
      try {
        const u = new URL(candidate);
        const q = u.searchParams.get("q") || u.pathname.replace("/maps/place/", "") || "";
        if (q) return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(q))}&output=embed`;
      } catch {}
      // Fallback: just append output=embed
      const sep = candidate.includes("?") ? "&" : "?";
      return `${candidate}${sep}output=embed`;
    }
    return ""; // unknown URL format — fall back to default
  }

  // Exact "Embed a map" URL for the business's actual Google Business Profile pin
  // (410 Muscle Therapy), used whenever the admin hasn't set a custom map URl.
  const DEFAULT_MAP_EMBED_URL =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3082.271334727853!2d-76.6170997242141!3d39.41798837161769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c80fb6cfb2ae81%3A0xacd0a0f902d0b95e!2s410%20Muscle%20Therapy!5e0!3m2!1sen!2sus!4v1790709834464!5m2!1sen!2sus";

  const resolvedMapUrl = toEmbedUrl(rawMapEmbedUrl);
  const mapEmbedUrl: string = resolvedMapUrl || DEFAULT_MAP_EMBED_URL;

  // Phone/email links are always derived from the plain number/address text
  // rather than trusting an admin-typed <a href>, since a hand-typed href that's
  // missing the tel:/mailto: scheme (e.g. just "+1 443 473 2322") silently turns
  // into a broken relative link instead of a working link.
  const phoneRawText = stripHtml(contactInfo.phone || (footer as any)?.phone || "(410) 555-1234");
  const phoneDigits = phoneRawText.replace(/[^\d+]/g, "");
  const phoneHtml: string = `<a href="tel:${phoneDigits}">${phoneRawText}</a>`;

  // Email: display text comes from stripped HTML; the actual mailto target comes from
  // the href the admin may have set inside the RichTextEditor link (e.g. they want
  // to display info@... but route mail to a yahoo address).
  const emailFieldHtml = contactInfo.email || (footer as any)?.email || "";
  const emailDisplayText = stripHtml(emailFieldHtml) || "info@410muscletherapy.com";
  const emailHrefMatch = emailFieldHtml.match(/href=["']([^"']+)["']/i);
  let emailHref = emailHrefMatch ? emailHrefMatch[1] : "";
  // Normalise the href: https://user@domain -> mailto:user@domain
  if (emailHref && emailHref.startsWith("http") && emailHref.includes("@")) {
    emailHref = `mailto:${emailHref.replace(/^https?:\/\//, "")}`;
  } else if (emailHref && !emailHref.startsWith("mailto:") && emailHref.includes("@")) {
    emailHref = `mailto:${emailHref}`;
  } else if (!emailHref) {
    emailHref = `mailto:${emailDisplayText}`;
  }
  const emailHtml: string = `<a href="${emailHref}">${emailDisplayText}</a>`;

  // Structured per-day hours from the dashboard take priority; freeform text is a legacy fallback.
  const structuredHoursLines = buildHoursLines((hours && typeof hours === 'object' ? hours : {}) as Record<string, string>);
  const freeformHours = stripHtml(contactInfo.hours || (footer as any)?.hours || "");
  const hoursLines: string[] = structuredHoursLines.length > 0
    ? structuredHoursLines
    : freeformHours
      ? [freeformHours]
      : ["Sun–Sat: 8:00 AM – 7:00 PM"];
  const hoursText = hoursLines.join('\n');

  const copyrightText: string = stripHtml(bottomInfo.copyright || (footer as any)?.copyright || "© 2026 410 Muscle Therapy. All Rights Reserved.");

  const companyLinks = navbar?.companyLinks || navbar?.links || [];
  const quickLinksData = companyLinks.map((link: any) => {
    let href = link.href || "/";
    if (href === "/blog" || href === "/blog/") href = "/blogs/";
    if (href.startsWith("/") && !href.endsWith("/") && !href.includes("#") && !href.includes("?")) {
      href = `${href}/`;
    }
    return {
      label: link.label,
      href
    };
  });

  const servicesListRaw = (servicesData?.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);
  const servicesDataList = servicesListRaw.slice(0, 6).map((svc: any) => ({
    label: svc.title,
    href: `/${svc.slug}/`
  }));

  return (
    <footer>

      {/* ══ Main Footer ════════════════════════════════ */}
      <div className="bg-dark-2 pt-12 md:pt-16 pb-0 border-t border-border-dark/10">
        <div className="site-container">

          {/* Responsive grid wrapping from 1 to 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.5fr] gap-10 md:gap-12 pb-12 border-b border-border-dark">

            {/* Col 1 — Brand */}
            <div className="flex flex-col items-start text-left">
              <FooterLogo logoUrl={(navbar as any)?.logo} siteTitle={(navbar as any)?.siteTitle} logoText1={(navbar as any)?.logoText1} logoText2={(navbar as any)?.logoText2} />
              <p className="text-white/80 text-[13.5px] leading-[1.8] mb-4 max-w-[280px]">
                {brandDescriptionText}
              </p>
              <SocialIcons socialItems={socialLinks} />
            </div>

            {/* Col 2 — Quick Links */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-bold text-[12px] tracking-[0.18em] uppercase mb-5">
                {quickLinksLabel}
              </h4>
              <ul className="flex flex-col gap-3">
                {quickLinksData.map((link: any) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/75 text-[13.5px] hover:text-gold transition-colors duration-200 flex items-center gap-2 group py-0.5">
                      <span className="w-0 h-px bg-gold transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Services */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-bold text-[12px] tracking-[0.18em] uppercase mb-5">
                {servicesLabel}
              </h4>
              <ul className="flex flex-col gap-3">
                {servicesDataList.map((svc: any) => (
                  <li key={svc.label}>
                    <Link href={svc.href} className="text-white/75 text-[13.5px] hover:text-gold transition-colors duration-200 flex items-center gap-2 group py-0.5">
                      <span className="w-0 h-px bg-gold transition-all duration-200 group-hover:w-3" />
                      {svc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-bold text-[12px] tracking-[0.18em] uppercase mb-5">
                {contactLabel}
              </h4>
              <ul className="flex flex-col gap-3.5 w-full">
                {[
                  {
                    icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />,
                    html: addressHtml,
                  },
                  {
                    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
                    html: phoneHtml,
                  },
                  {
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></>,
                    html: emailHtml,
                  },
                  {
                    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
                    html: null,
                    text: hoursText,
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      width="14" height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C8960C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 flex-shrink-0"
                    >
                      {item.icon}
                    </svg>
                    {item.html ? (
                      <span
                        className="prose-invert text-white/80 text-[13px] leading-snug whitespace-pre-line [&_a]:pointer-events-auto"
                        dangerouslySetInnerHTML={{ __html: item.html }}
                      />
                    ) : (
                      <span className="text-white/80 text-[13px] leading-snug whitespace-pre-line">
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="w-full">
                <MapPlaceholder addressText={addressText} embedUrl={mapEmbedUrl} iframeHtml={iframeHtml} />
              </div>
            </div>

          </div>

          {/* ── Bottom bar ───────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white/75 text-[13px]">
              <p className="font-medium text-white/85">{copyrightText}</p>
              <span className="hidden sm:inline text-white/30">•</span>
              <p className="text-white/75">
                Designed & Developed by{" "}
                <a
                  href="https://mohsindesigns.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-white font-semibold underline decoration-gold/60 hover:decoration-white transition-colors"
                >
                  Mohsin Design
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-[13px]">
              <Link href="/privacy/" className="text-white/70 hover:text-white transition-colors">{privacy}</Link>
              <span className="text-white/30">{divider}</span>
              <Link href="/terms/" className="text-white/70 hover:text-white transition-colors">{terms}</Link>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}