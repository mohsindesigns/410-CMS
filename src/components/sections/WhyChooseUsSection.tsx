'use client';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import { CheckCircle2, Star, Shield, Award, Users, Clock, Flame, Zap } from 'lucide-react';

const iconMap: Record<string, any> = {
  Star, Shield, Award, Users, Clock, Flame, Zap, CheckCircle2
};

export default function WhyChooseUsSection() {
  const { whyChooseUs } = useContent();
  
  const badge = whyChooseUs?.section?.badge || "WHY CHOOSE US";
  const headline = whyChooseUs?.section?.headline || "Designed for Maximum Performance";
  const description = whyChooseUs?.section?.description || "We blend clinical orthopedic massage with modern recovery science to get you back to your best self.";
  
  const features = whyChooseUs?.features || [
    { title: "Clinical Expertise", description: "Specialized in soft-tissue dysfunction and chronic pain patterns.", icon: "Shield" },
    { title: "Personalized Approach", description: "Every session is custom-tailored to your specific athletic goals.", icon: "Zap" },
    { title: "Recovery Focused", description: "Designed to accelerate muscle repair and restore range of motion.", icon: "Flame" }
  ];

  const stats = whyChooseUs?.stats || [
    { value: "500", suffix: "+", label: "Athletes Treated" },
    { value: "5", suffix: "/5", label: "Client Rating" },
    { value: "100", suffix: "%", label: "Satisfaction Guarantee" }
  ];

  return (
    <section className="bg-dark border-b border-border-dark py-16 md:py-24 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gold/[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Stats */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <p className="section-label text-gold mb-4">{badge}</p>
              <h2 className="display-heading text-[28px] min-[400px]:text-[34px] md:text-[44px] text-white leading-tight mb-6">
                {headline}
              </h2>
              <div 
                className="text-white/60 text-[14px] md:text-[15px] leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            
            {/* Stats list */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              {stats.map((stat: any, idx: number) => (
                <div key={idx}>
                  <p className="text-[24px] sm:text-[30px] font-bold text-gold leading-none mb-1 font-mono">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="text-white/40 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-mono">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Features grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature: any, idx: number) => {
              const IconComponent = iconMap[feature.icon] || CheckCircle2;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-dark transition-all duration-300">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2 group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>
                  <div 
                    className="text-white/50 text-[13px] leading-relaxed font-light [&_p]:text-white/50"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}
