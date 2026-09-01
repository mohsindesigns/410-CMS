'use client';

import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2.5 btn-gold px-8 py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" /> Link Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" /> Share This Article
        </>
      )}
    </button>
  );
}
