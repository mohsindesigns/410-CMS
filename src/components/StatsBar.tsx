"use client";

import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

export default function StatsBar() {
  const { stats } = useContent();

  const defaultStats = [
    { value: "8+", label: "Years of Experience" },
    { value: "5,000+", label: "Clients Treated" },
    { value: "15,000+", label: "Sessions Completed" },
    { value: "100%", label: "Satisfaction Rate" }
  ];

  const items = stats?.items && stats.items.length > 0 ? stats.items : defaultStats;
  const statsItems = items.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <div className="bg-dark-2 border-y border-border-dark py-8 relative z-20">
      <div className="site-container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {statsItems.map((stat: any, idx: number) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="flex flex-col items-center text-center p-4 rounded-sm bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-300 group cursor-default"
            >
              <span className="text-gold font-serif text-[28px] md:text-[34px] font-bold block leading-none mb-2 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </span>
              <span className="text-white/60 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-semibold leading-tight">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
