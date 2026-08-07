"use client";

import { useContent } from "../hooks/useContent";
import Image from "next/image";
import Link from "next/link";
import RichTextRenderer from "./ui/RichTextRenderer";
import logo from "../assets/logo.png";

/* ── Logo ──────────────────────────────────────────────── */
function FooterLogo({ logoUrl, siteTitle, logoText1, logoText2 }: { logoUrl?: string; siteTitle?: string; logoText1?: string; logoText2?: string }) {
  if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/uploads') || logoUrl.startsWith('/cdn-images'))) {
    return (
      <Link href="/" className="inline-flex items-center gap-3 mb-4">
        <div className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] flex items-center justify-center overflow-hidden">
          <img
            src={logoUrl}
            alt={siteTitle || "410 Muscle Therapy Logo"}
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

/* ── Social Icons ─────────────────────────────────────── */
function SocialIcons({ socialItems }: { socialItems?: any[] }) {
  const socials = [
    {
      label: 'Facebook',
      path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    },
    {
      label: 'Instagram',
      path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z',
    },
    {
      label: 'Google',
      path: 'M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z',
    },
    {
      label: 'YouTube',
      path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z M9.75 15.02V8.98L15.5 12z',
    },
  ];

  const getSocialUrl = (platform: string) => {
    if (!socialItems) return "#";
    const item = socialItems.find((s: any) => s.platform?.toLowerCase() === platform.toLowerCase());
    return item?.href || "#";
  };

  return (
    <div className="flex gap-2.5 mt-4 justify-start">
      {socials.map((s) => (
        <a
          key={s.label}
          href={getSocialUrl(s.label)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="w-9 h-9 rounded-full border border-border-dark flex items-center justify-center text-white/40 hover:text-gold hover:border-gold transition-all duration-200"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

/* ── Map Placeholder ───────────────────────────────────── */
function MapPlaceholder({ addressText }: { addressText: string }) {
  return (
    <div className="mt-5 h-24 sm:h-28 bg-dark-3 rounded-md overflow-hidden relative flex items-center justify-center border border-border-dark">
      <div
        className="absolute inset-0 bg-grid-pattern-white-faint"
      />
      <div className="relative flex flex-col items-center gap-1.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#C8960C">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <div className="text-white/40 text-[10.5px] font-medium text-center px-2 whitespace-pre-line leading-tight">
          <RichTextRenderer content={addressText} className="!text-white/40 text-[10.5px] font-medium text-center [&_p]:m-0" />
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { footer, navbar, services: servicesData } = useContent();

  const contactInfo = footer?.contact || {};
  const companyInfo = footer?.company || {};
  const bottomInfo = footer?.bottom || {};

  const {
    quickLinksLabel = "Quick Links",
    servicesLabel = "Services",
    contactLabel = "Contact Us",
    privacy = "Privacy Policy",
    terms = "Terms & Conditions",
    divider = "|"
  } = footer || {};

  const brandDescriptionText = companyInfo.description || footer?.brandDescription || "Elite performance recovery bodywork, mobility optimization, and injury prevention for athletes and active adults since 2020. #bodywork #performancerecovery";
  const addressText = contactInfo.address || footer?.address || "125 Wellness Way, Suite 101\nLos Angeles, CA 90001";
  const phoneText = contactInfo.phone || footer?.phone || "(323) 456-7890";
  const emailText = contactInfo.email || footer?.email || "info@muscletherapy.com";
  const hoursText = contactInfo.hours || footer?.hours || "Mon–Sat: 8:00 AM – 7:00 PM";
  const copyrightText = bottomInfo.copyright || footer?.copyright || "© 2024 Muscle Therapy. All Rights Reserved.";

  const companyLinks = navbar?.companyLinks || navbar?.links || [];
  const quickLinksData = companyLinks.map((link: any) => ({
    label: link.label,
    href: link.href
  }));

  const servicesListRaw = (servicesData?.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);
  const servicesDataList = servicesListRaw.slice(0, 6).map((svc: any) => ({
    label: svc.title,
    href: `/services/${svc.slug}`
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
              <FooterLogo logoUrl={navbar?.logo} siteTitle={navbar?.siteTitle} logoText1={navbar?.logoText1} logoText2={navbar?.logoText2} />
              <div className="text-white/45 text-[13.5px] leading-[1.8] mb-4 max-w-[280px] [&_p]:m-0">
                <RichTextRenderer content={brandDescriptionText} className="!text-white/45 text-[13.5px]" />
              </div>
              <SocialIcons socialItems={footer?.social} />
            </div>

            {/* Col 2 — Quick Links */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-bold text-[11.5px] tracking-[0.16em] uppercase mb-5">
                {quickLinksLabel}
              </h4>
              <ul className="flex flex-col gap-3">
                {quickLinksData.map((link: any) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/45 text-[13.5px] hover:text-gold transition-colors duration-200 flex items-center gap-2 group py-0.5">
                      <span className="w-0 h-px bg-gold transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Services */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-bold text-[11.5px] tracking-[0.16em] uppercase mb-5">
                {servicesLabel}
              </h4>
              <ul className="flex flex-col gap-3">
                {servicesDataList.map((svc: any) => (
                  <li key={svc.label}>
                    <Link href={svc.href} className="text-white/45 text-[13.5px] hover:text-gold transition-colors duration-200 flex items-center gap-2 group py-0.5">
                      <span className="w-0 h-px bg-gold transition-all duration-200 group-hover:w-3" />
                      {svc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div className="flex flex-col items-start text-left">
              <h4 className="text-white font-bold text-[11.5px] tracking-[0.16em] uppercase mb-5">
                {contactLabel}
              </h4>
              <ul className="flex flex-col gap-3.5 w-full">
                {[
                  {
                    icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />,
                    text: addressText,
                  },
                  {
                    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
                    text: phoneText,
                  },
                  {
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></>,
                    text: emailText,
                  },
                  {
                    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
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
                      className="mt-1 flex-shrink-0"
                    >
                      {item.icon}
                    </svg>
                    <div className="text-white/45 text-[13px] leading-snug [&_p]:m-0">
                      <RichTextRenderer content={item.text} className="!text-white/45 text-[13px]" />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="w-full">
                <MapPlaceholder addressText={addressText} />
              </div>
            </div>

          </div>

          {/* ── Bottom bar ───────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-3 text-center sm:text-left">
            <div className="text-white/30 text-[12px] [&_p]:m-0">
              <RichTextRenderer content={copyrightText} className="!text-white/30 text-[12px]" />
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/contact" className="text-white/30 text-[12px] hover:text-white/70 transition-colors">{privacy}</Link>
              <span className="text-white/15">{divider}</span>
              <Link href="/contact" className="text-white/30 text-[12px] hover:text-white/70 transition-colors">{terms}</Link>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}