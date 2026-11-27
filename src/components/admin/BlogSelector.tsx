"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Check, BookOpen, Calendar, Loader2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    publishedAt: string;
}

interface BlogSelectorProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    label?: string;
    /** Show 1, 2, 3... on picked cards: the order they appear on the page (click order). */
    showOrder?: boolean;
}

export default function BlogSelector({ 
    selectedIds = [], 
    onChange, 
    label = "Select Featured Blogs",
    showOrder = false
}: BlogSelectorProps) {
    const [search, setSearch] = useState("");
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [onlySelected, setOnlySelected] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blog');
            if (res.ok) {
                const data = await res.json();
                setAllPosts(Array.isArray(data) ? data : []);
                setLoaded(true);
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Picked ids that still point to a published article (deleted/draft/trashed ones are never shown on the site).
    const liveSelected = useMemo(() => {
        const ids = (selectedIds || []).map(String);
        if (!loaded) return ids;
        const live = new Set(allPosts.map(p => String(p._id)));
        return ids.filter(id => live.has(id));
    }, [selectedIds, allPosts, loaded]);

    const filteredPosts = useMemo(() => {
        const q = search.toLowerCase();
        const matches = allPosts.filter(post => (post.title || "").toLowerCase().includes(q));
        if (!onlySelected) return matches;
        // "Selected" view lists the picks in their page order.
        return liveSelected
            .map(id => matches.find(p => String(p._id) === id))
            .filter(Boolean) as BlogPost[];
    }, [allPosts, search, onlySelected, liveSelected]);

    const togglePost = (id: string) => {
        if (liveSelected.includes(id)) {
            onChange(liveSelected.filter(i => i !== id));
        } else {
            onChange([...liveSelected, id]);
        }
    };

    return (
        <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
            {/* Header / Search Area */}
            <div className="p-4 bg-[#f6f7f7] border-b border-[#c3c4c7] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-bold text-[#1d2327] uppercase tracking-tight">{label}</label>
                    <p className="text-[11px] text-[#646970]">Select the articles you want to feature on this page ({liveSelected.length} selected)</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex border border-[#8c8f94] rounded-[3px] overflow-hidden text-[12px] font-semibold">
                        <button
                            type="button"
                            onClick={() => setOnlySelected(false)}
                            className={`px-3 py-1.5 ${!onlySelected ? "bg-[#2271b1] text-white" : "bg-white text-[#2271b1]"}`}
                        >
                            All ({allPosts.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setOnlySelected(true)}
                            className={`px-3 py-1.5 border-l border-[#8c8f94] ${onlySelected ? "bg-[#2271b1] text-white" : "bg-white text-[#2271b1]"}`}
                        >
                            Selected ({liveSelected.length})
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c8f94]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter articles..."
                            className="bg-white border border-[#8c8f94] pl-9 pr-4 py-1.5 text-[13px] rounded-[3px] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none min-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-2 bg-white">
                {loading ? (
                    <div className="py-20 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-[#2271b1] animate-spin mx-auto" />
                        <p className="text-[13px] text-[#646970] font-serif italic">Accessing Blog Intelligence...</p>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
                        {filteredPosts.map(post => {
                            const isSelected = liveSelected.includes(String(post._id));
                            const order = isSelected ? liveSelected.indexOf(String(post._id)) + 1 : 0;
                            return (
                                <button
                                    key={post._id}
                                    type="button"
                                    onClick={() => togglePost(post._id)}
                                    className={`relative flex flex-col h-full text-left border rounded-[3px] overflow-hidden transition-all group ${
                                        isSelected 
                                            ? "border-[#2271b1] ring-1 ring-[#2271b1] bg-[#f0f6fb]" 
                                            : "border-[#c3c4c7] hover:border-[#2271b1] bg-white"
                                    }`}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video relative bg-[#f0f0f1] border-b border-[#c3c4c7] overflow-hidden">
                                        {post.featuredImage ? (
                                            <img src={post.featuredImage} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-6 h-6 text-[#c3c4c7]" />
                                            </div>
                                        )}
                                        
                                        {/* Status Badge */}
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border flex items-center justify-center shadow-sm transition-all ${
                                            isSelected ? "bg-[#2271b1] border-[#2271b1] text-white" : "bg-white/90 border-[#c3c4c7] text-[#c3c4c7]"
                                        }`}>
                                            {isSelected && (showOrder ? <span className="text-[11px] font-bold">{order}</span> : <Check className="w-3.5 h-3.5" />)}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 space-y-1">
                                        <h4 className={`text-[13px] font-bold leading-tight line-clamp-2 ${isSelected ? "text-[#2271b1]" : "text-[#1d2327]"}`}>
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 text-[#8c8f94]" />
                                            <span className="text-[10px] text-[#8c8f94] font-medium uppercase tracking-tighter">
                                                {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Selection Overlay for Grid Mode */}
                                    {isSelected && (
                                        <div className="absolute inset-0 border-2 border-[#2271b1] pointer-events-none rounded-[1px]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-[#dcdcde] rounded-sm m-2">
                        <BookOpen className="w-10 h-10 text-[#dcdcde] mx-auto mb-3" />
                        <p className="text-[14px] text-[#646970] font-medium">
                            {onlySelected && !search ? "No articles selected yet" : `No articles found matching "${search}"`}
                        </p>
                        {search && <button type="button" onClick={() => setSearch("")} className="text-[#2271b1] underline text-[13px] mt-1">Clear search</button>}
                    </div>
                )}
            </div>

            {/* Footer / Summary */}
            <div className="px-4 py-2 bg-[#f6f7f7] border-t border-[#c3c4c7] flex items-center justify-between">
                <span className="text-[11px] text-[#646970] font-medium uppercase tracking-wide">Total Articles: {allPosts.length}</span>
                {selectedIds.length > 0 && (
                    <button 
                        type="button"
                        onClick={() => onChange([])}
                        className="text-[#d63638] text-[11px] font-bold uppercase hover:underline"
                    >
                        Deselect All
                    </button>
                )}
            </div>
        </div>
    );
}
