"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useContent } from "../../hooks/useContent";
import RichTextRenderer from "../ui/RichTextRenderer";

const TestimonialCard = ({ testimonial, index, onPlay }: any) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const rating = Math.min(5, Math.max(0, Number(testimonial.rating) || 5));
    const subtitle = [testimonial.position, testimonial.company].filter(Boolean).join(', ');
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="group relative bg-white dark:bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-white/5 transition-all duration-300">
            <div className="absolute top-6 right-6 text-5xl text-primary/10 font-serif">"</div>
            <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" /></svg>
                ))}
            </div>
            <div className="text-gray-700 dark:text-foreground/80 text-sm sm:text-base leading-relaxed mb-6 line-clamp-5 italic">
                <RichTextRenderer content={testimonial.text} stripParagraphs={true} />
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-foreground text-sm">{testimonial.name}</h4>
                        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                    </div>
                </div>
                {testimonial.videoId && (
                    <button
                        type="button"
                        onClick={() => onPlay?.({ id: testimonial.videoId, title: testimonial.name })}
                        className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                        aria-label={`Watch ${testimonial.name}'s video review`}
                    >
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default function ReviewsTemplate({ pageData, params }: { pageData?: any, params?: any }) {
    const { testimonials: data } = useContent();
    const { section, testimonials = [], stats = {} as any } = data || {};
    const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

    return (
        <main className="relative min-h-screen bg-gray-50 dark:bg-background pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h1 className="text-4xl sm:text-7xl font-bold tracking-tight mb-4">
                    <RichTextRenderer content={section?.headline || 'Customer Stories'} stripParagraphs={true} />
                </h1>
                <div className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
                    <RichTextRenderer content={section?.description} stripParagraphs={true} />
                </div>

                {(stats?.rating || stats?.count) && (
                    <div className="inline-flex items-center gap-2 mb-12 px-5 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" /></svg>
                        <span>
                            {stats?.rating || '5.0'}{stats?.count ? ` from ${stats.count}` : ''}{stats?.label ? ` ${stats.label}` : ''}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {testimonials.map((item: any, i: number) => (
                        <TestimonialCard key={i} testimonial={item} index={i} onPlay={setSelectedVideo} />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                                aria-label="Close video"
                            >
                                ✕
                            </button>
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
