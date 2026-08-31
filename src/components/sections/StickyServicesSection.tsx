'use client';
import { useEffect, useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { motion } from 'framer-motion';

export default function StickyServicesSection() {
  const { services: servicesData, globalMetadata } = useContent();
  
  // Filter active and published services dynamically
  const rawItems = servicesData?.items || [];
  const items = rawItems.filter((s: any) => s.status === 'published' || s.status === undefined);

  const stickyLabel = servicesData?.badge || "EXPERTISE";
  const stickyHeading = servicesData?.titleLine1 || "Our Services";
  const servicePrefix = "SERVICE";
  const ctaExplore = "Learn More";
  const ctaBook = "Book Now";

  const [activeId, setActiveId] = useState(items[0]?.id || "");

  // Update activeId once items load
  useEffect(() => {
    if (items.length > 0 && !activeId) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  // Bulletproof Observer for synchronized sidebar active state
  useEffect(() => {
    const cards = document.querySelectorAll('.service-card-item');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.id.replace('card-', '');
            if (cardId) {
              setActiveId(cardId);
            }
          }
        });
      },
      {
        rootMargin: '-15% 0px -50% 0px',
        threshold: 0.1
      }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [items]);

  const handleNavClick = (e: any, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const card = document.getElementById(`card-${id}`);
    if (card) {
      const targetY = card.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <section id="services-list" className="bg-dark relative border-b border-border-dark py-16 md:py-24">
      {/* Subtle Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />

      <div className="site-container relative flex flex-col lg:flex-row gap-8 lg:gap-10">

        {/* Left Sticky Sidebar — hidden on mobile, sticky on desktop */}
        <div className="hidden lg:block lg:w-[280px] xl:w-[300px] flex-shrink-0">
          <div className="lg:sticky lg:top-[120px] z-30 bg-transparent py-0">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-gold text-[9.5px] font-bold tracking-[0.25em] uppercase mb-1.5">{stickyLabel}</p>
                <h2 className="display-heading text-[24px] md:text-[28px] text-white leading-tight">{stickyHeading}</h2>
              </div>

              <nav className="relative">
                {/* Left subtle vertical track for desktop */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

                <ul className="flex flex-col gap-1">
                  {items.map((service: any, idx: number) => {
                    const isActive = activeId === service.id;
                    const displayNum = service.number || (idx + 1).toString().padStart(2, '0');
                    return (
                      <li key={service.id} className="relative flex-shrink-0">
                        {/* Active Indicator Line for desktop */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebarActiveIndicator"
                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}

                        <a
                          href={`#card-${service.id}`}
                          onClick={(e) => handleNavClick(e, service.id)}
                          className={`flex items-center justify-between text-[12px] px-4 py-2 rounded-r-lg transition-colors duration-200 font-medium whitespace-nowrap
                            ${isActive
                              ? 'text-gold bg-gold/5 font-semibold'
                              : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="text-[9.5px] font-mono font-bold tracking-widest opacity-70 flex-shrink-0">{displayNum}</span>
                            <span className="truncate">{service.name}</span>
                          </span>
                          <ArrowRight
                            size={12}
                            className={`transition-all duration-200 flex-shrink-0 ${isActive ? 'opacity-100 translate-x-0 text-gold' : 'opacity-0 -translate-x-1'}`}
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Right Service Cards Column */}
        <div id="cards-container" className="w-full lg:flex-1 flex flex-col gap-6 sm:gap-8 relative z-10">
          {items.map((service: any, index: number) => (
            <div
              key={service.id}
              id={`card-${service.id}`}
              className="service-card-item relative w-full bg-dark/95 border border-white/15 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group hover:border-gold/30 transition-colors duration-300"
            >
              <div className="flex flex-col-reverse lg:flex-row min-h-[320px] lg:min-h-[350px]">

                {/* Content Area */}
                <div className="p-5 sm:p-6 lg:p-6 lg:w-[58%] flex flex-col justify-between relative bg-gradient-to-br from-white/[0.04] to-transparent">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gold font-mono text-[9.5px] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 bg-gold/10 rounded-full border border-gold/20">
                        {servicePrefix} {service.number || (index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
                        {index + 1} / {items.length}
                      </span>
                    </div>

                    <h3 className="display-heading text-[18px] sm:text-[20px] md:text-[22px] text-white leading-tight mb-2 group-hover:text-gold transition-colors duration-300">
                      <Link href={`/${service.slug || service.id}/`} className="text-white hover:text-gold transition-colors duration-300">
                        {service.name}
                      </Link>
                    </h3>

                    <div 
                      className="text-white/70 text-[12px] sm:text-[12.5px] leading-relaxed font-light mb-3 [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_span]:!text-white/70 [&_p]:!text-white/70 line-clamp-3 sm:line-clamp-2 lg:line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />

                    {/* Key Benefits List */}
                    {service.benefits && (
                      <div className="flex flex-col gap-1.5 mb-3.5">
                        {service.benefits.slice(0, 3).map((benefit: any, i: number) => {
                          const benefitText = typeof benefit === 'string' ? benefit : (benefit.title || benefit.name || benefit.label || "");
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-gold flex-shrink-0" />
                              <span className="text-[11.5px] sm:text-[12px] text-white/80 font-medium leading-snug">{benefitText}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CTA Buttons - Zero text overlap / Clean wrapping */}
                  <div className="pt-3 mt-auto border-t border-white/10 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Link
                      href={(!service.heroCtaSecondaryUrl || service.heroCtaSecondaryUrl.startsWith('#')) ? `/${service.slug || service.id}/` : service.heroCtaSecondaryUrl}
                      className="btn-gold inline-flex items-center justify-center py-2 px-3.5 sm:px-4 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-md whitespace-nowrap flex-shrink-0"
                    >
                      <span>
                        {(() => {
                          if (service.heroCtaSecondary && !service.heroCtaSecondary.toLowerCase().includes('help') && !service.heroCtaSecondary.toLowerCase().includes('learn more')) {
                            return service.heroCtaSecondary;
                          }
                          const rawName = (service.name || service.title || 'Service').replace(/\s*(maryland|baltimore|timonium|clinic)\s*/gi, '').trim();
                          return `Explore ${rawName || 'Service'}`;
                        })()}
                      </span>
                      <ArrowRight size={12} className="ml-1.5 flex-shrink-0" />
                    </Link>

                    <a
                      href={service.bookingCtaUrl || globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-white inline-flex items-center justify-center py-2 px-3.5 sm:px-4 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider rounded-lg whitespace-nowrap flex-shrink-0 group/book hover:border-gold hover:text-gold transition-all duration-200"
                    >
                      <span>{service.bookingCta || "Book Appointment"}</span>
                      <ArrowRight size={12} className="ml-1.5 flex-shrink-0 group-hover/book:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Image Area (Clickable) */}
                <Link href={`/${service.slug || service.id}/`} className="relative h-[180px] sm:h-[220px] lg:h-auto lg:w-[42%] overflow-hidden bg-black/60 block group/img flex-shrink-0">
                  <Image
                    src={service.image || "/images/service-massage.webp"}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center group-hover/img:scale-105 transition-transform duration-700 opacity-90 group-hover/img:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent lg:bg-gradient-to-r lg:from-dark/80 lg:to-transparent pointer-events-none" />
                </Link>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
