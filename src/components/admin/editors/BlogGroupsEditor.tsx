"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2, X } from "lucide-react";
import BlogSelector from "@/components/admin/BlogSelector";
import { UI } from "./styles";

export interface BlogGroupValue {
  title?: string;
  serviceSlug?: string;
  postIds?: string[];
}

interface Props {
  groups: BlogGroupValue[];
  onChange: (groups: BlogGroupValue[]) => void;
}

// Blog topic groups: shown as a grouped article list on /services and used for the
// "related articles" at the bottom of every blog post.
export default function BlogGroupsEditor({ groups, onChange }: Props) {
  const [posts, setPosts] = useState<{ _id: string; title: string }[]>([]);
  const [services, setServices] = useState<{ slug: string; name: string }[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/blog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch("/api/content", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const list = Array.isArray(json?.services?.services) ? json.services.services : [];
        setServices(
          list
            .filter((s: any) => s?.slug)
            .map((s: any) => ({ slug: String(s.slug), name: String(s.menuLabel || s.name || s.title || s.slug).trim() }))
        );
      })
      .catch(() => {});
  }, []);

  const list: BlogGroupValue[] = Array.isArray(groups) ? groups : [];
  const titleById = useMemo(() => new Map(posts.map((p) => [String(p._id), p.title])), [posts]);
  const liveIds = (g: BlogGroupValue) => (g.postIds || []).map(String).filter((id) => titleById.has(id));

  const grouped = useMemo(() => new Set(list.flatMap((g) => (g.postIds || []).map(String))), [list]);
  const ungrouped = posts.filter((p) => !grouped.has(String(p._id)));

  const update = (i: number, patch: Partial<BlogGroupValue>) =>
    onChange(list.map((g, j) => (j === i ? { ...g, ...patch } : g)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (openIndex === i) setOpenIndex(j);
  };
  const remove = (i: number) => {
    onChange(list.filter((_, j) => j !== i));
    setOpenIndex(null);
  };
  const add = () => {
    onChange([...list, { title: "New topic", postIds: [] }]);
    setOpenIndex(list.length);
  };

  return (
    <div className="space-y-4">
      {posts.length > 0 && (
        <p className="text-[12px] text-[#646970]">
          {posts.length - ungrouped.length} of {posts.length} published articles are in a topic.
          {ungrouped.length > 0 && (
            <span className="text-[#b32d2e]"> Not in any topic: {ungrouped.map((p) => p.title).join(", ")}</span>
          )}
        </p>
      )}

      {list.map((g, i) => {
        const ids = liveIds(g);
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border border-[#c3c4c7] rounded-[3px] bg-white">
            <div className="flex flex-wrap items-center gap-2 p-3 bg-[#f6f7f7] border-b border-[#c3c4c7]">
              <span className="text-[12px] font-bold text-[#646970] w-6 text-center">{i + 1}</span>
              <input
                type="text"
                value={g.title || ""}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Topic name, e.g. Cupping Therapy"
                className={UI.input + " flex-1 min-w-[200px] !py-1.5"}
              />
              <select
                value={g.serviceSlug || ""}
                onChange={(e) => update(i, { serviceSlug: e.target.value || undefined })}
                className="border border-[#c3c4c7] bg-white px-2 py-1.5 text-[13px] rounded-[3px] max-w-[240px]"
                title="Optional: link this topic to a service page"
              >
                <option value="">No service link</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-[#2271b1] disabled:text-[#c3c4c7]" aria-label="Move topic up">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="p-1.5 text-[#2271b1] disabled:text-[#c3c4c7]" aria-label="Move topic down">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-[#b32d2e]" aria-label="Remove topic">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-3">
              {ids.length > 0 ? (
                <ol className="list-decimal pl-6 text-[13px] text-[#1d2327] space-y-0.5">
                  {ids.map((id) => (
                    <li key={id}>{titleById.get(id)}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-[12px] text-[#646970] italic">No articles in this topic yet.</p>
              )}
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#2271b1] hover:underline"
              >
                {isOpen ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                {isOpen ? "Done choosing articles" : `Choose articles (${ids.length})`}
              </button>
              {isOpen && (
                <BlogSelector
                  showOrder
                  label={`Articles in "${g.title || "this topic"}"`}
                  selectedIds={(g.postIds || []).map(String)}
                  onChange={(next: string[]) => update(i, { postIds: next })}
                />
              )}
            </div>
          </div>
        );
      })}

      <button type="button" onClick={add} className={UI.buttonAdd}>
        + Add topic
      </button>
    </div>
  );
}
