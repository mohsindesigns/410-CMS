"use client"

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import logo from "../assets/logo.png";
import Image from "next/image";
import Link from "next/link";

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
};

const Navbar = () => {
  const content = useContent();
  const { navbar, settings, services: servicesData } = content;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [expandedMobileLink, setExpandedMobileLink] = useState<string | null>(null);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { companyLinks } = navbar;
  const services = (servicesData.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMegaMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHoveringMegaMenu(true);
  };

  const handleMegaMenuMouseLeave = () => {
    setIsHoveringMegaMenu(false);
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
      setHoveredService(null);
    }, 150);
  };

  const handleLinkClick = () => {
    setActiveMegaMenu(null);
    setIsMenuOpen(false);
    setHoveredService(null);
    setExpandedMobileLink(null);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-dark shadow-[0_4px_24px_rgba(0,0,0,0.6)] py-1' : 'bg-transparent py-3'}`}
      >
        <div className="site-container flex items-center justify-between h-[76px]">

          {/* ── Logo ───────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 md:gap-3" onClick={handleLinkClick}>
            {navbar.logo && (navbar.logo.startsWith('http') || navbar.logo.startsWith('/uploads') || navbar.logo.startsWith('/cdn-images')) ? (
              <div className="relative h-[85px] w-[85px] min-[400px]:w-[110px] min-[400px]:h-[110px] sm:w-[150px] sm:h-[150px] flex items-center justify-center overflow-hidden">
                <img
                  src={navbar.logo}
                  alt={navbar.siteTitle || "410 Muscle Therapy Logo"}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <svg width="36" height="42" viewBox="0 0 42 48" fill="none" className="md:w-[42px] md:h-[48px] flex-shrink-0">
                  <path d="M21 1L40 9.5V25C40 36.5 31.5 44.5 21 47C10.5 44.5 2 36.5 2 25V9.5L21 1Z" fill="#C8960C" />
                  <text x="21" y="33" textAnchor="middle" fill="#0A0A0A" fontFamily="Georgia,serif" fontSize="20" fontWeight="bold" fontStyle="italic">M</text>
                </svg>
                <span className="flex flex-col text-left">
                  <span className="text-[15px] md:text-[18px] font-black tracking-[0.2em] text-white leading-none">
                    {navbar.logoText1 || "MUSCLE"}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-gold mt-1 leading-none">
                    {navbar.logoText2 || "THERAPY"}
                  </span>
                </span>
              </div>
            )}
          </Link>

          {/* ── Desktop Nav Links ──────────────────────── */}
          <ul className="hidden md:flex items-center gap-7">
            {(companyLinks || []).map((link: any, linkIdx: number) => {
              const active = isLinkActive(link.href);

              // Case 1: Mega Menu
              if (link.useMegaMenu) {
                return (
                  <li key={linkIdx} className="static">
                    <button
                      onMouseEnter={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        setActiveMegaMenu(`mega-${linkIdx}`);
                      }}
                      onMouseLeave={() => {
                        timeoutRef.current = setTimeout(() => {
                          if (!isHoveringMegaMenu) setActiveMegaMenu(null);
                        }, 150);
                      }}
                      className={`flex items-center gap-1 text-[13.5px] font-medium transition-colors duration-200 cursor-pointer
                        ${activeMegaMenu === `mega-${linkIdx}` || active
                          ? 'text-gold'
                          : 'text-white/75 hover:text-white'
                        }`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      {services.length > 0 && (
                        <motion.span animate={{ rotate: activeMegaMenu === `mega-${linkIdx}` ? 180 : 0 }}>
                          <ChevronDown size={14} className="opacity-70 ml-0.5" />
                        </motion.span>
                      )}
                    </button>

                    <AnimatePresence>
                      {activeMegaMenu === `mega-${linkIdx}` && (
                        <motion.div
                          ref={megaMenuRef}
                          initial={{ opacity: 0, y: 12, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 8, x: "-50%" }}
                          onMouseEnter={handleMegaMenuMouseEnter}
                          onMouseLeave={handleMegaMenuMouseLeave}
                          className="absolute left-1/2 top-full mt-2 w-[920px] max-w-[95vw] max-h-[85vh] overflow-y-auto bg-dark rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] border border-border-dark p-5 md:p-6 custom-scrollbar"
                          style={{ zIndex: 1000 }}
                        >
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {services.map((service: any) => {
                              const isThisHovered = hoveredService === service.title;
                              return (
                                <Link
                                  key={service.slug}
                                  href={`/${service.slug}/`}
                                  onMouseEnter={() => setHoveredService(service.title)}
                                  onMouseLeave={() => setHoveredService(null)}
                                  onClick={handleLinkClick}
                                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 border border-transparent hover:border-white/10"
                                >
                                  <div className={`h-9 w-9 min-w-[36px] rounded-lg flex items-center justify-center transition-all duration-200 mt-0.5 ${isThisHovered ? "bg-gold text-dark shadow-md shadow-gold/20" : "bg-white/10 text-white"}`}>
                                    <Icon name={service.icon} className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className={`text-[13px] font-semibold transition-colors leading-snug truncate ${isThisHovered ? "text-gold" : "text-white"}`}>
                                      {service.title}
                                    </h3>
                                    <p className="text-white/45 text-[11px] leading-tight line-clamp-1 mt-0.5 font-light">
                                      {stripHtml(service.heroDescription || service.description || "Specialized clinical therapy protocol")}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Megamenu Footer */}
                          <div className="mt-4 pt-3.5 border-t border-border-dark/80 flex items-center justify-between text-xs px-1">
                            <span className="text-white/40 font-light">Explore all individualized clinical bodywork options</span>
                            <Link
                              href="/services"
                              onClick={handleLinkClick}
                              className="text-gold hover:text-gold-light font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]"
                            >
                              All Services Index <ArrowRight size={13} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              // Case 2: Sub-links Dropdown (Sub-menu)
              if (link.subLinks && link.subLinks.length > 0) {
                return (
                  <li key={linkIdx} className="relative group">
                    <button
                      className={`flex items-center gap-1 text-[13.5px] font-medium transition-colors duration-200 cursor-pointer
                        ${active ? 'text-gold' : 'text-white/75 hover:text-white'}`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      <ChevronDown size={14} className="opacity-70 ml-0.5 transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute left-0 top-full w-48 bg-dark rounded-xl shadow-2xl border border-border-dark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0" style={{ zIndex: 1000 }}>
                      <div className="py-2">
                        {link.subLinks.map((subLink: any, sIdx: number) => (
                          <Link
                            key={sIdx}
                            href={subLink.href}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
                            onClick={handleLinkClick}
                          >
                            {subLink.icon && <Icon name={subLink.icon} className="h-4 w-4" />}
                            <span>{subLink.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              // Case 3: Normal Link
              const isExternal = link.href.startsWith('http');
              return (
                <li key={linkIdx}>
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/75 hover:text-gold text-[13.5px] font-medium transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-1 text-[13.5px] font-medium transition-colors duration-200
                        ${active
                          ? 'text-gold border-b border-gold pb-0.5'
                          : 'text-white/75 hover:text-white'
                        }`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA / Mobile Trigger ───────────── */}
          <div className="flex items-center gap-3">
            <a
              href={navbar.ctaLink || "https://app.squareup.com/gift/V4MA1Q75Q5VJ5/order"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex btn-gold"
            >
              <Icon name={navbar.ctaIcon || "Calendar"} className="h-4 w-4 mr-1.5" />
              {navbar.ctaText || "Book Now"} <ArrowRight size={14} className="ml-1" />
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile Menu Drawer ─────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[76px] z-40 bg-dark border-b border-border-dark flex flex-col px-6 py-8 md:hidden gap-6 shadow-[0_12px_32px_rgba(0,0,0,0.8)]"
            >
              <ul className="flex flex-col gap-4">
                {(companyLinks || []).map((link: any, linkIdx: number) => {
                  const active = isLinkActive(link.href);
                  const isMegaMenu = link.useMegaMenu;
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isExpanded = expandedMobileLink === link.label;
                  const isExternal = link.href.startsWith('http');

                  return (
                    <li key={linkIdx} className="flex flex-col">
                      <div className="flex items-center justify-between py-1">
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-[15px] font-medium text-white/70 hover:text-gold transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={handleLinkClick}
                            className={`block text-[15px] font-medium transition-colors
                              ${active ? 'text-gold' : 'text-white/70 hover:text-white'}`}
                          >
                            {link.label}
                          </Link>
                        )}
                        {(isMegaMenu || hasSubLinks) && (
                          <button
                            onClick={() => setExpandedMobileLink(isExpanded ? null : link.label)}
                            className="p-1 text-white/50 hover:text-gold transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {(isMegaMenu || hasSubLinks) && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 flex flex-col gap-2 mt-1 mb-2 border-l border-white/10 ml-2">
                              {isMegaMenu ? (
                                services.map((service: any) => (
                                  <Link
                                    key={service.slug}
                                    href={`/${service.slug}/`}
                                    onClick={handleLinkClick}
                                    className="block py-1 text-sm font-medium text-white/60 hover:text-gold transition-colors"
                                  >
                                    {service.title}
                                  </Link>
                                ))
                              ) : (
                                link.subLinks.map((subLink: any, sIdx: number) => (
                                  <Link
                                    key={sIdx}
                                    href={subLink.href}
                                    onClick={handleLinkClick}
                                    className="block py-1 text-sm font-medium text-white/60 hover:text-gold transition-colors"
                                  >
                                    {subLink.label}
                                  </Link>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <a
                href={navbar.ctaLink || "https://app.squareup.com/gift/V4MA1Q75Q5VJ5/order"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="btn-gold justify-center w-full py-3.5"
              >
                <Icon name={navbar.ctaIcon || "Calendar"} className="h-4 w-4 mr-1.5" />
                {navbar.ctaText || "Book Now"} <ArrowRight size={14} className="ml-1" />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;