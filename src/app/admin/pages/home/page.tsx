"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import HomeEditor from "@/components/admin/editors/HomeEditor";

export default function AdminHomePage() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load homepage content:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Homepage content saved and synchronized successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save content.");
      }
    } catch (err) {
      setMessage("Error saving content.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#2271b1] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0f0f1]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#646970] mb-1">
            <Link href="/admin/pages" className="hover:text-[#135e96] transition-colors">Pages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1d2327] font-bold">Homepage</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1d2327]">Edit Homepage</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2.5 rounded-md font-medium shadow-sm transition-all disabled:opacity-50 text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-md mb-6 text-xs font-semibold flex items-center gap-2 ${
          message.includes("successfully")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.includes("successfully") && <Check className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* Synchronized Home Editor Component */}
      <HomeEditor pageId="home" data={data} setData={setData} />
    </div>
  );
}
