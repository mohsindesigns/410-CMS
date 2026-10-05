export const HOURS_DAYS: Array<{ key: string; label: string }> = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

function to12h(hh: string, mm: string): string {
  const h = Number(hh);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${suffix}`;
}

/** Dashboard stores each day as "HH:MM-HH:MM" or "closed"; legacy free text passes through. */
export function formatHoursValue(raw: string | undefined | null): string | null {
  const v = String(raw ?? "").trim();
  if (!v) return null;
  if (/^closed$/i.test(v)) return "Closed";
  const m = v.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (m) return `${to12h(m[1], m[2])} – ${to12h(m[3], m[4])}`;
  return v.replace(/<[^>]*>/g, "").trim() || null;
}

/** Merges consecutive days with identical hours into one line, e.g. "Mon–Fri: 7:00 AM – 9:00 PM". */
export function buildHoursLines(hours: Record<string, string>): string[] {
  const resolved = HOURS_DAYS.map(({ key, label }) => {
    // Legacy data stored a single "Mon-Fri" value under monday — Tue–Fri inherit it until set individually.
    const raw = hours[key] || (["tuesday", "wednesday", "thursday", "friday"].includes(key) ? hours.monday : undefined);
    return { label, value: formatHoursValue(raw) };
  });

  const lines: string[] = [];
  let i = 0;
  while (i < resolved.length) {
    const cur = resolved[i];
    if (!cur.value) { i++; continue; }
    let j = i;
    while (j + 1 < resolved.length && resolved[j + 1].value === cur.value) j++;
    const range = j === i ? cur.label : `${cur.label}–${resolved[j].label}`;
    lines.push(`${range}: ${cur.value}`);
    i = j + 1;
  }
  return lines;
}
