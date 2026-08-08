"use client";

import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import StickyServicesSection from '@/components/sections/StickyServicesSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ContactFaqSection from '@/components/sections/ContactFaqSection';
import CtaBanner from '@/components/sections/CtaBanner';

export default function ServicesTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  return (
    <main>
      <ServicesHeroSection />
      <WhyChooseUsSection />
      <StickyServicesSection />
      <CtaBanner />
      <HowItWorksSection />
      <ContactFaqSection />
    </main>
  );
}
