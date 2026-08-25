"use client";

import { useState } from "react";
import { Send, ArrowRight, ShieldCheck, Clock, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks/useContent";

interface QAFormProps {
  pageData?: any;
}

export default function ContactFaqSection({ pageData }: QAFormProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { contactFaq, globalMetadata } = useContent();

  const {
    label = "GET IN TOUCH",
    faqLabel = "FAQ",
    faqTitle = "Frequently Asked Questions",
    formLabel = "GET IN TOUCH",
    formTitle = "Have Questions? Let's Connect.",
    formClinicPortal = "INSTANT ONLINE BOOKING",
    formClinicPortalSub = "Book directly on StyleSeat portal",
    formStyleSeatBtn = "BOOK ON STYLESEAT",
    formNameLabel = "YOUR FULL NAME",
    formNamePlaceholder = "Antoine Lyles",
    formEmailLabel = "EMAIL ADDRESS",
    formEmailPlaceholder = "antoine@example.com",
    formPhoneLabel = "PHONE NUMBER",
    formPhonePlaceholder = "(410) 555-0199",
    formServiceLabel = "DESIRED SERVICE CATEGORY",
    formServicePlaceholder = "Select a service category",
    formMessageLabel = "YOUR MESSAGE / INJURY DETAILS",
    formMessagePlaceholder = "Please describe any pain, stiffness, or injuries...",
    formBtnSubmit = "SEND MESSAGE",
    formBtnSuccess = "MESSAGE SENT!",
    formSuccessToast = "Thank you! Your inquiry has been sent. We will reply within 24 hours.",
    trustHipa = "HIPAA Compliant & Secure",
    trustResponse = "Avg Response: 2 Hours",
    formServicesOptions = [],
    faqs = []
  } = contactFaq || {};

  // Read page-specific overrides if editing or viewing on a specific page
  const rawPageFaqs: any[] = (() => {
    if (Array.isArray(pageData?.faq) && pageData.faq.length > 0) return pageData.faq;
    if (Array.isArray(pageData?.faqs) && pageData.faqs.length > 0) return pageData.faqs;
    if (Array.isArray(pageData?.data?.faq) && pageData.data.faq.length > 0) return pageData.data.faq;
    if (Array.isArray(pageData?.data?.faqs) && pageData.data.faqs.length > 0) return pageData.data.faqs;
    if (Array.isArray(pageData?.content?.faq) && pageData.content.faq.length > 0) return pageData.content.faq;
    if (Array.isArray(pageData?.content?.faqs) && pageData.content.faqs.length > 0) return pageData.content.faqs;
    if (Array.isArray(pageData?.content?.faq?.items) && pageData.content.faq.items.length > 0) return pageData.content.faq.items;
    if (Array.isArray(pageData?.content?.data?.faq) && pageData.content.data.faq.length > 0) return pageData.content.data.faq;
    if (Array.isArray(pageData?.content?.data?.faqs) && pageData.content.data.faqs.length > 0) return pageData.content.data.faqs;
    return [];
  })();

  const activeFaqs = rawPageFaqs.length > 0
    ? rawPageFaqs
        .filter((f: any) => f && (f.q || f.question || f.title || f.a || f.answer || f.desc || f.description))
        .map((f: any) => ({
          q: f.q || f.question || f.title || "",
          a: f.a || f.answer || f.desc || f.description || ""
        }))
    : (Array.isArray(faqs) ? faqs : []);

  const activeFaqLabel = 
    pageData?.faqBadge || 
    pageData?.data?.faqBadge || 
    pageData?.content?.faqBadge || 
    pageData?.content?.data?.faqBadge || 
    pageData?.content?.faq?.section?.badge || 
    pageData?.content?.faq?.badge || 
    faqLabel;

  const activeFaqTitle = 
    pageData?.faqTitle || 
    pageData?.data?.faqTitle || 
    pageData?.content?.faqTitle || 
    pageData?.content?.data?.faqTitle || 
    pageData?.content?.faq?.section?.headline || 
    pageData?.content?.faq?.section?.title || 
    pageData?.content?.faq?.title || 
    faqTitle;

  const activeFaqDescription = 
    pageData?.faqDescription || 
    pageData?.data?.faqDescription || 
    pageData?.content?.faqDescription || 
    pageData?.content?.data?.faqDescription || 
    pageData?.content?.faq?.section?.description || 
    pageData?.content?.faq?.description || 
    "";


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.error("Submission error:", err);
    }

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    }, 3000);
  };

  const bookingUrl = globalMetadata?.bookingUrl || "https://www.styleseat.com/m/v/410muscletherapy";

  return (
    <section id="contact-support" className="bg-warm-cream py-20 md:py-28 overflow-hidden relative border-t border-brand-border-light">
      
      {/* Editorial grid background */}
      <div 
        className="absolute inset-0 opacity-[0.012] bg-grid-pattern-black pointer-events-none" 
      /> 

      <div className="site-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start">

          {/* ── Left Column: Luxury Form Card ── */}
          <div className="w-full h-fit">
            <p className="section-label text-gold-dark mb-4">{formLabel}</p>
            <h2 className="display-heading text-[26px] min-[360px]:text-[30px] min-[400px]:text-[36px] md:text-[44px] text-dark leading-tight mb-8">
              {formTitle.includes(" ") ? (
                <>
                  {formTitle.substring(0, formTitle.lastIndexOf(" "))} {" "}
                  <span className="text-gold-dark italic font-light">{formTitle.substring(formTitle.lastIndexOf(" ") + 1)}</span>
                </>
              ) : (
                formTitle
              )}
            </h2>

            {/* Form wrapper */}
            <div className="bg-white border border-brand-border-light p-6 min-[400px]:p-8 md:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative h-fit transition-all duration-300">
              
              {/* Gold frame accent in top-right */}
              <div className="absolute top-0 right-0 w-8 h-8 m-5 opacity-40 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-[1px] bg-gold-dark" />
                <div className="absolute top-0 right-0 h-full w-[1px] bg-gold-dark" />
              </div>

              {/* Direct StyleSeat Booking Banner */}
              <div className="mb-8 p-5 rounded-lg bg-gradient-to-r from-gold-dark/15 via-warm-cream to-warm-white border border-gold-dark/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-gold-dark font-mono text-[10.5px] font-bold tracking-widest uppercase block mb-0.5">{formClinicPortal}</span>
                  <p className="text-dark font-bold text-[14px]">{formClinicPortalSub}</p>
                </div>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-6 py-3 text-[11.5px] font-bold tracking-wider flex-shrink-0 shadow-md"
                >
                  {formStyleSeatBtn} <ArrowRight size={13} className="ml-1" />
                </a>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-dark/60 text-[10.5px] font-bold tracking-widest uppercase font-mono">
                    {formNameLabel}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={formNamePlaceholder}
                    className="w-full bg-warm-cream border border-brand-border-muted px-4 py-3.5 text-dark text-[14px] focus:border-gold-dark focus:bg-white focus:ring-1 focus:ring-gold-dark/30 focus:outline-none transition-all rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-dark/60 text-[10.5px] font-bold tracking-widest uppercase font-mono">
                      {formEmailLabel}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={formEmailPlaceholder}
                      className="w-full bg-warm-cream border border-brand-border-muted px-4 py-3.5 text-dark text-[14px] focus:border-gold-dark focus:bg-white focus:ring-1 focus:ring-gold-dark/30 focus:outline-none transition-all rounded-md"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-dark/60 text-[10.5px] font-bold tracking-widest uppercase font-mono">
                      {formPhoneLabel}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={formPhonePlaceholder}
                      className="w-full bg-warm-cream border border-brand-border-muted px-4 py-3.5 text-dark text-[14px] focus:border-gold-dark focus:bg-white focus:ring-1 focus:ring-gold-dark/30 focus:outline-none transition-all rounded-md"
                    />
                  </div>
                </div>

                {/* Service Select */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-dark/60 text-[10.5px] font-bold tracking-widest uppercase font-mono">
                    {formServiceLabel}
                  </label>
                  <select
                    id="service"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-warm-cream border border-brand-border-muted px-4 py-3.5 text-dark text-[14px] focus:border-gold-dark focus:bg-white focus:ring-1 focus:ring-gold-dark/30 focus:outline-none transition-all rounded-md appearance-none cursor-pointer"
                  >
                    <option value="" disabled>{formServicePlaceholder}</option>
                    {formServicesOptions.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-dark/60 text-[10.5px] font-bold tracking-widest uppercase font-mono">
                    {formMessageLabel}
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={formMessagePlaceholder}
                    className="w-full bg-warm-cream border border-brand-border-muted px-4 py-3.5 text-dark text-[14px] focus:border-gold-dark focus:bg-white focus:ring-1 focus:ring-gold-dark/30 focus:outline-none transition-all rounded-md resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitted}
                  className="btn-gold justify-center py-4 w-full text-[12px] font-bold shadow-xl tracking-widest group relative overflow-hidden transition-all duration-300 mt-2 rounded-md"
                >
                  {submitted ? (
                    <span className="flex items-center gap-2">
                      {formBtnSuccess} <ArrowRight size={14} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {formBtnSubmit} <Send size={13} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  )}
                </button>
              </form>

              {/* Trust markers */}
              <div className="mt-8 pt-6 border-t border-brand-border-light flex items-center justify-between gap-4 text-[12px] text-dark/50 font-mono">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold-dark" />
                  {trustHipa}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-gold-dark" />
                  {trustResponse}
                </span>
              </div>

              {/* Success Notification Alert */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-x-6 bottom-6 bg-gold text-dark font-bold text-[12px] tracking-wide uppercase px-6 py-4 flex items-center justify-between shadow-2xl rounded-sm border border-gold"
                  >
                    <span>{formSuccessToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Column: Editorial Underlined FAQs ── */}
          <div className="w-full">
            <p className="section-label text-gold-dark mb-4">{activeFaqLabel}</p>
            <h2 className="display-heading text-[30px] min-[400px]:text-[36px] md:text-[44px] text-dark leading-tight mb-4 text-left">
              {activeFaqTitle.includes(" ") ? (
                <>
                  {activeFaqTitle.substring(0, activeFaqTitle.lastIndexOf(" "))} {" "}
                  <span className="text-gold-dark italic font-light">{activeFaqTitle.substring(activeFaqTitle.lastIndexOf(" ") + 1)}</span>
                </>
              ) : (
                activeFaqTitle
              )}
            </h2>
            {activeFaqDescription && (
              <p className="text-dark/65 text-[14px] md:text-[15.5px] font-light leading-relaxed mb-8 text-left">
                {activeFaqDescription}
              </p>
            )}

            {/* Accordion Layout */}
            <div className="flex flex-col border-t border-brand-border-muted text-left">
              {activeFaqs.map((faq: any, i: number) => {
                const isOpen = openIdx === i;

                return (
                  <div
                    key={i}
                    className={`border-b border-brand-border-muted py-5 md:py-6 transition-all duration-300
                      ${isOpen ? "bg-white/40" : ""}`}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      className="w-full text-left flex items-start gap-5 group px-3 md:px-4 focus:outline-none"
                    >
                      {/* Monospace gold number */}
                      <span className={`text-[12px] md:text-[13px] font-mono font-bold tracking-widest mt-1.5 transition-colors duration-300
                        ${isOpen ? "text-gold-dark" : "text-dark/25 group-hover:text-dark/45"}`}>
                        {i < 9 ? `0${i + 1}` : i + 1}
                      </span>
                      
                      {/* Question */}
                      <h3
                        className={`text-[15.5px] md:text-[16.5px] font-semibold flex-1 transition-all duration-300
                          ${isOpen ? "text-dark font-medium translate-x-1" : "text-dark/70 group-hover:text-dark group-hover:translate-x-1"}`}
                        dangerouslySetInnerHTML={{ __html: faq.q }}
                      />
                      
                      {/* Icon */}
                      <span className={`text-gold-dark mt-1.5 transition-transform duration-300 ${isOpen ? "rotate-180 text-dark" : "group-hover:scale-110"}`}>
                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-12 md:pl-14 pr-4 pt-3 pb-2">
                            <div className="border-l-2 border-gold-dark/45 pl-4 py-0.5">
                              <div
                                className="text-dark/55 text-[13.5px] leading-relaxed font-light prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: faq.a }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}