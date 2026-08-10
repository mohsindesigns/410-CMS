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

  // Bulletproof Sentinel-based Observer for 100% synchronized sidebar active state
  useEffect(() => {
    const sentinels = document.querySelectorAll('.service-sentinel');
    if (!sentinels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const serviceId = entry.target.getAttribute('data-service-id');
            if (serviceId) {
              setActiveId(serviceId);
            }
          }
        });
      },
      {
        rootMargin: '-130px 0px -70% 0px',
        threshold: 0
      }
    );

    sentinels.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  const handleNavClick = (e: any, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const sentinel = document.querySelector(`[data-service-id="${id}"]`);
    if (sentinel) {
      const targetY = sentinel.getBoundingClientRect().top + window.pageYOffset - 130;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <section id="services-list" className="bg-dark relative border-b border-border-dark py-16 md:py-24">
      {/* Subtle Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />

      <div className="site-container relative flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Left Sticky Sidebar — hidden on mobile, sticky on desktop */}
        <div className="hidden lg:block lg:w-[320px] flex-shrink-0">
          <div className="lg:sticky lg:top-[140px] z-30 bg-transparent py-0">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase mb-2">{stickyLabel}</p>
                <h2 className="display-heading text-[28px] md:text-[36px] text-white">{stickyHeading}</h2>
              </div>

              <nav className="relative">
                {/* Left subtle vertical track for desktop */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

                <ul className="flex flex-col gap-2">
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
                          href={`#${service.id}`}
                          onClick={(e) => handleNavClick(e, service.id)}
                          className={`flex items-center justify-between text-[13px] md:text-[14px] px-6 py-3 rounded-r-lg transition-all duration-300 font-medium whitespace-nowrap
                            ${isActive
                              ? 'text-gold bg-gold/5 font-semibold'
                              : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-bold tracking-widest opacity-70">{displayNum}</span>
                            {service.name}
                          </span>
                          <ArrowRight
                            size={14}
                            className={`transition-transform duration-300 ${isActive ? 'opacity-100 translate-x-0 text-gold' : 'opacity-0 -translate-x-2'}`}
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

        {/* Right Stackable Sticky Cards Column */}
        <div id="cards-container" className="w-full lg:flex-1 flex flex-col relative z-10">
          {items.map((service: any, index: number) => (
            <Fragment key={service.id}>
              {/* Invisible sentinel for 100% accurate scroll sync */}
              <div
                data-service-id={service.id}
                className="service-sentinel w-full h-px pointer-events-none opacity-0"
              />

              {/* Service Card */}
              <div
                id={`card-${service.id}`}
                className={`service-card-item relative lg:sticky lg:top-[130px] w-full bg-dark border border-white/15 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-all duration-300 group ${index === items.length - 1 ? 'mb-0' : 'mb-8 sm:mb-10 lg:mb-[60vh]'}`}
                style={{
                  zIndex: index + 1
                }}
              >
                <div className="flex flex-col-reverse lg:flex-row lg:min-h-[440px]">

                  {/* Content Area */}
                  <div className="p-5 sm:p-7 md:p-8 lg:w-[58%] flex flex-col justify-between relative bg-gradient-to-br from-white/[0.04] to-transparent">
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-gold font-mono text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                          {servicePrefix} {service.number || (index + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-white/40 text-[11px] font-mono tracking-widest uppercase">
                          {index + 1} / {items.length}
                        </span>
                      </div>

                      <h3 className="display-heading text-[22px] min-[400px]:text-[26px] md:text-[32px] text-white leading-tight mb-3 group-hover:text-gold transition-colors duration-300">
                        <Link href={`/${service.slug || service.id}/`} className="text-white hover:text-gold transition-colors duration-300">
                          {service.name}
                        </Link>
                      </h3>

                      <div 
                        className="text-white/70 text-[13px] sm:text-[14px] leading-relaxed font-light mb-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_span]:!text-white/70 [&_p]:!text-white/70"
                        dangerouslySetInnerHTML={{ __html: service.description }}
                      />

                      {/* Key Benefits List */}
                      {service.benefits && (
                        <div className="flex flex-col gap-2 mb-5">
                          {service.benefits.slice(0, 3).map((benefit: any, i: number) => {
                            const benefitText = typeof benefit === 'string' ? benefit : (benefit.title || benefit.name || benefit.label || "");
                            return (
                              <div key={i} className="flex items-center gap-2.5">
                                <CheckCircle2 size={14} className="text-gold flex-shrink-0" />
                                <span className="text-[12px] sm:text-[13px] text-white/80 font-medium leading-snug">{benefitText}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                      <Link
                        href={service.heroCtaSecondaryUrl || `/${service.slug || service.id}/`}
                        className="btn-gold justify-center text-center w-full sm:w-auto"
                      >
                        {service.heroCtaSecondary || ctaExplore} <ArrowRight size={14} className="ml-1" />
                      </Link>

                      <a
                        href={service.bookingCtaUrl || globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-gold text-[11.5px] font-bold tracking-widest uppercase transition-colors py-2 text-center"
                      >
                        {service.bookingCta || ctaBook} <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>

                  {/* Image Area (Clickable) */}
                  <Link href={`/${service.slug || service.id}/`} className="relative h-[200px] sm:h-[240px] lg:h-auto lg:w-[42%] overflow-hidden bg-black/60 block group/img flex-shrink-0">
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
            </Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
