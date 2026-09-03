"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-[#0A0A0A] text-white p-4 pt-32 pb-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6 relative z-10"
      >
        <div className="w-16 h-16 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
            Something went wrong
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            We encountered an unexpected error while rendering this page. Please try again or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-dark font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(200,150,12,0.3)]"
          >
            <RefreshCw size={15} />
            <span>Try again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            <Home size={15} />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
