"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, Plus, Search, Mail,
  X, Calendar as CalIcon, List, Clock, LayoutGrid,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tag = "LinkedIn" | "Grant/Award" | "Deadline" | "Proposal" | "Event";
type View = "month" | "week" | "day" | "list";

interface CalEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  time?: string;      // "HH:MM"
  tag: Tag;
  desc?: string;
  attendees?: string[];
}

// ─── Tag styles ───────────────────────────────────────────────────────────────
const TAG_STYLES: Record<Tag, { bg: string; text: string; dot: string }> = {
  LinkedIn:    { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500" },
  "Grant/Award": { bg: "bg-green-100", text: "text-green-700",  dot: "bg-green-500" },
  Deadline:    { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500" },
  Proposal:    { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  Event:       { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500" },
};

// ─── Seed events ──────────────────────────────────────────────────────────────
const SEED_EVENTS: CalEvent[] = [
  { id: "1",  title: "LinkedIn: AI Research Capabilities Post",  date: "2026-04-02", time: "09:00", tag: "LinkedIn",    desc: "Highlight Tuskegee AI lab milestones." },
  { id: "2",  title: "NSF EHR Core Research Deadline",           date: "2026-04-07", time: "17:00", tag: "Deadline",    desc: "Full proposal due. Upload to Grants.gov." },
  { id: "3",  title: "ONR Cybersecurity BAA Response",           date: "2026-04-10", time: "10:00", tag: "Proposal",    desc: "Submit ONR BAA white paper.", attendees: ["mwright@tuskegee.edu", "wcampbell@tuskegee.edu"] },
  { id: "4",  title: "DoD STEM Industry Day",                    date: "2026-04-14", time: "13:00", tag: "Event",       desc: "Virtual industry day — register team." },
  { id: "5",  title: "LinkedIn: HBCU Partnership Announcement",  date: "2026-04-16", time: "08:00", tag: "LinkedIn",    desc: "Announce Howard consortium agreement." },
  { id: "6",  title: "NSA HBCU Grant Award Notification",        date: "2026-04-18", time: "14:00", tag: "Grant/Award", desc: "$750K NSA award — prepare press release.", attendees: ["cmorris@tuskegee.edu"] },
  { id: "7",  title: "DARPA Young Faculty Award Deadline",       date: "2026-04-22", time: "23:59", tag: "Deadline",    desc: "Final submission window closes." },
  { id: "8",  title: "Proposal Review — CHIPS Act",              date: "2026-04-24", time: "10:00", tag: "Proposal",    desc: "Internal red-team review session.", attendees: ["wcampbell@tuskegee.edu", "afoster@tuskegee.edu"] },
  { id: "9",  title: "HBCU Consortium Summit",                   date: "2026-04-28", time: "09:00", tag: "Event",       desc: "Tuskegee hosting 3-HBCU summit." },
  { id: "10", title: "LinkedIn: CHIPS Act Funding Post",         date: "2026-04-30", time: "08:30", tag: "LinkedIn",    desc: "Promote CHIPS Act engagement." },
  { id: "11", title: "Army REAP Grant – Letter of Intent",       date: "2026-05-05", time: "17:00", tag: "Deadline",    desc: "LOI due before full proposal." },
  { id: "12", title: "DoE AI Research Award Decision",           date: "2026-05-12", time: "12:00", tag: "Grant/Award", desc: "Expected award notification." },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm

function tagBadge(tag: Tag, small = false) {
  const s = TAG_STYLES[tag];
  return (
    <span className={cn("font-semibold rounded-full whitespace-nowrap", s.bg, s.text,
      small ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5")}>
      {tag}
    </span>
  );
}

// ─── Add/Invite Modal ─────────────────────────────────────────────────────────
function EventModal({ initial, onSave, onClose }: {
  initial?: Partial<CalEvent>;
  onSave: (e: CalEvent) => void;
  onClose: () => void;
}) {
  const [title, setTitle]         = useState(initial?.title ?? "");
  const [date, setDate]           = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [time, setTime]           = useState(initial?.time ?? "09:00");
  const [tag, setTag]             = useState<Tag>(initial?.tag ?? "Event");
  const [desc, setDesc]           = useState(initial?.desc ?? "");
  const [attendees, setAttendees] = useState((initial?.attendees ?? []).join(", "));
  const [invited, setInvited]     = useState(false);

  const handleSave = () => {
    if (!title || !date) return;
    onSave({
      id: initial?.id ?? String(Date.now()),
      title, date, time, tag, desc,
      attendees: attendees ? attendees.split(",").map((a) => a.trim()).filter(Boolean) : [],
    });
    onClose();
  };

  const handleInvite = () => setInvited(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
          <div className="text-[13px] font-bold uppercase tracking-wide text-[#0f172a]">
            {initial?.id ? "Edit Event" : "New Event"}
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b]"><X className="h-4 w-4" /></button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title..."
              className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#1a56db] text-[#334155]" />
          </div>
          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#1a56db] text-[#334155]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#1a56db] text-[#334155]" />
            </div>
          </div>
          {/* Tag */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Tag</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(TAG_STYLES) as Tag[]).map((t) => (
                <button key={t} onClick={() => setTag(t)}
                  className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors",
                    tag === t
                      ? cn(TAG_STYLES[t].bg, TAG_STYLES[t].text, "border-transparent")
                      : "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2}
              placeholder="Details, links, notes..."
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] resize-none" />
          </div>
          {/* Attendees / Invite */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1">
              Invite Attendees <span className="font-normal text-[#94a3b8]">(comma-separated emails)</span>
            </label>
            <input value={attendees} onChange={(e) => setAttendees(e.target.value)}
              placeholder="e.g. mwright@tuskegee.edu, wcampbell@tuskegee.edu"
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]" />
          </div>
          {/* Send Invite */}
          {attendees.trim() && (
            <button onClick={handleInvite}
              className={cn("w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-bold border transition-colors",
                invited
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-white text-[#1a56db] border-[#bfdbfe] hover:bg-[#eff6ff]"
              )}>
              <Mail className="h-3.5 w-3.5" />
              {invited ? "✓ Invites Sent" : "Send Meeting Invite"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#f1f5f9] flex justify-end gap-2">
          <button onClick={onClose} className="text-[12px] px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff]">Cancel</button>
          <button onClick={handleSave} disabled={!title || !date}
            className="text-[12px] font-bold px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] disabled:opacity-50 transition-colors">
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const today = new Date();
  const [view, setView]               = useState<View>("month");
  const [cursor, setCursor]           = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [dayCursor, setDayCursor]     = useState(today);
  const [search, setSearch]           = useState("");
  const [activeTags, setActiveTags]   = useState<Set<Tag>>(new Set());
  const [events, setEvents]           = useState<CalEvent[]>(SEED_EVENTS);
  const [modal, setModal]             = useState<{ open: boolean; initial?: Partial<CalEvent> }>({ open: false });
  const [selected, setSelected]       = useState<CalEvent | null>(null);

  const toggleTag = (t: Tag) =>
    setActiveTags((prev) => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });

  const filtered = useMemo(() =>
    events.filter((e) => {
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.desc ?? "").toLowerCase().includes(search.toLowerCase());
      const matchTag    = activeTags.size === 0 || activeTags.has(e.tag);
      return matchSearch && matchTag;
    }), [events, search, activeTags]);

  const eventsOnDate = (dateStr: string) => filtered.filter((e) => e.date === dateStr);

  // ── Month helpers ──────────────────────────────────────────────────────────
  const monthYear = cursor.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay  = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const calCells  = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : new Date(cursor.getFullYear(), cursor.getMonth(), i - firstDay + 1)
  );
  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  // ── Week helpers ───────────────────────────────────────────────────────────
  const weekStart = new Date(dayCursor);
  weekStart.setDate(dayCursor.getDate() - dayCursor.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });

  const navPrev = () => {
    if (view === "month") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
    else if (view === "week") { const d = new Date(dayCursor); d.setDate(d.getDate() - 7); setDayCursor(d); }
    else { const d = new Date(dayCursor); d.setDate(d.getDate() - 1); setDayCursor(d); }
  };
  const navNext = () => {
    if (view === "month") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
    else if (view === "week") { const d = new Date(dayCursor); d.setDate(d.getDate() + 7); setDayCursor(d); }
    else { const d = new Date(dayCursor); d.setDate(d.getDate() + 1); setDayCursor(d); }
  };

  const navLabel = view === "month"
    ? monthYear
    : view === "week"
    ? `${weekDays[0].toLocaleDateString("default",{month:"short",day:"numeric"})} – ${weekDays[6].toLocaleDateString("default",{month:"short",day:"numeric",year:"numeric"})}`
    : dayCursor.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const saveEvent = (e: CalEvent) => setEvents((prev) => {
    const idx = prev.findIndex((x) => x.id === e.id);
    return idx >= 0 ? prev.map((x) => x.id === e.id ? e : x) : [...prev, e];
  });

  const VIEW_ICONS: Record<View, React.ReactNode> = {
    month: <LayoutGrid className="h-3.5 w-3.5" />,
    week:  <CalIcon className="h-3.5 w-3.5" />,
    day:   <Clock className="h-3.5 w-3.5" />,
    list:  <List className="h-3.5 w-3.5" />,
  };

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Content Calendar</h1>
          <p className="text-[12px] text-[#64748b] mt-0.5">Schedule and manage content, deadlines &amp; events</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" /> Add Event
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#94a3b8]"
          />
        </div>

        {/* Tag filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(TAG_STYLES) as Tag[]).map((t) => {
            const s = TAG_STYLES[t];
            const on = activeTags.has(t);
            return (
              <button key={t} onClick={() => toggleTag(t)}
                className={cn("flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-colors",
                  on ? cn(s.bg, s.text, "border-transparent") : "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                {t}
              </button>
            );
          })}
          {activeTags.size > 0 && (
            <button onClick={() => setActiveTags(new Set())} className="text-[11px] text-[#94a3b8] hover:text-[#64748b] px-1">✕ Clear</button>
          )}
        </div>

        {/* View switcher */}
        <div className="flex items-center bg-white border border-[#e2e8f0] rounded-lg overflow-hidden ml-auto">
          {(["month","week","day","list"] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={cn("flex items-center gap-1 px-3 py-2 text-[11px] font-semibold transition-colors border-r border-[#f1f5f9] last:border-r-0",
                view === v ? "bg-[#1a56db] text-white" : "text-[#64748b] hover:bg-[#f8faff]"
              )}>
              {VIEW_ICONS[v]}
              <span className="capitalize hidden sm:inline">{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Nav bar ── */}
      {view !== "list" && (
        <div className="flex items-center gap-3">
          <button onClick={navPrev} className="p-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff]"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-[14px] font-bold text-[#0f172a] flex-1 text-center">{navLabel}</span>
          <button onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setDayCursor(today); }}
            className="text-[11px] font-semibold px-2.5 py-1 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff]">Today</button>
          <button onClick={navNext} className="p-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff]"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {/* ─────────── MONTH VIEW ─────────── */}
      {view === "month" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#f1f5f9]">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-2 text-center text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{d}</div>
            ))}
          </div>
          {/* Cells */}
          <div className="grid grid-cols-7">
            {calCells.map((cellDate, i) => {
              if (!cellDate) return <div key={i} className="min-h-[90px] border-b border-r border-[#f8faff] bg-[#fafafa]" />;
              const iso  = toISO(cellDate);
              const isToday = iso === toISO(today);
              const evs  = eventsOnDate(iso);
              return (
                <div key={i}
                  onClick={() => { setDayCursor(cellDate); setView("day"); }}
                  className="min-h-[90px] border-b border-r border-[#f1f5f9] p-1.5 cursor-pointer hover:bg-[#f8faff] transition-colors"
                >
                  <div className={cn("w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-semibold mb-1",
                    isToday ? "bg-[#1a56db] text-white" : "text-[#334155]")}>
                    {cellDate.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {evs.slice(0, 2).map((e) => (
                      <div key={e.id}
                        onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}
                        className={cn("text-[10px] font-medium px-1 py-0.5 rounded truncate cursor-pointer",
                          TAG_STYLES[e.tag].bg, TAG_STYLES[e.tag].text)}>
                        {e.time && <span className="opacity-70 mr-0.5">{e.time}</span>}{e.title}
                      </div>
                    ))}
                    {evs.length > 2 && <div className="text-[10px] text-[#94a3b8] pl-1">+{evs.length - 2} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────── WEEK VIEW ─────────── */}
      {view === "week" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-auto">
          {/* Header row */}
          <div className="grid grid-cols-8 border-b border-[#f1f5f9] sticky top-0 bg-white z-10">
            <div className="py-2 text-center text-[10px] font-bold text-[#94a3b8]">TIME</div>
            {weekDays.map((d) => {
              const iso = toISO(d);
              const isToday = iso === toISO(today);
              return (
                <div key={iso} className={cn("py-2 text-center border-l border-[#f1f5f9]", isToday && "bg-[#eff6ff]")}>
                  <div className="text-[10px] font-bold text-[#94a3b8] uppercase">{DAYS_OF_WEEK[d.getDay()]}</div>
                  <div className={cn("text-[14px] font-bold mx-auto w-7 h-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-[#1a56db] text-white" : "text-[#334155]")}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Hour rows */}
          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-8 border-b border-[#f8faff] min-h-[52px]">
              <div className="px-2 py-1 text-[10px] text-[#94a3b8] text-right">
                {h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`}
              </div>
              {weekDays.map((d) => {
                const iso = toISO(d);
                const evs = eventsOnDate(iso).filter((e) => e.time && parseInt(e.time.split(":")[0]) === h);
                return (
                  <div key={iso} className="border-l border-[#f1f5f9] px-0.5 py-0.5 space-y-0.5">
                    {evs.map((e) => (
                      <div key={e.id}
                        onClick={() => setSelected(e)}
                        className={cn("text-[10px] font-medium px-1 py-0.5 rounded cursor-pointer truncate",
                          TAG_STYLES[e.tag].bg, TAG_STYLES[e.tag].text)}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ─────────── DAY DETAILS VIEW ─────────── */}
      {view === "day" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-[#f1f5f9] px-5 py-3 flex items-center justify-between">
            <div className="text-[13px] font-bold text-[#0f172a]">
              {dayCursor.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <div className="text-[11px] text-[#94a3b8]">
              {eventsOnDate(toISO(dayCursor)).length} event{eventsOnDate(toISO(dayCursor)).length !== 1 ? "s" : ""}
            </div>
          </div>
          <div>
            {HOURS.map((h) => {
              const evs = eventsOnDate(toISO(dayCursor)).filter((e) => !e.time || parseInt(e.time.split(":")[0]) === h);
              return (
                <div key={h} className={cn("flex border-b border-[#f8faff] min-h-[56px]", evs.length && "bg-[#fafcff]")}>
                  <div className="w-16 px-3 py-2 text-[11px] text-[#94a3b8] text-right flex-shrink-0 border-r border-[#f1f5f9]">
                    {h === 12 ? "12 PM" : h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`}
                  </div>
                  <div className="flex-1 px-3 py-1.5 space-y-1.5">
                    {evs.map((e) => (
                      <div key={e.id}
                        onClick={() => setSelected(e)}
                        className={cn("flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity",
                          TAG_STYLES[e.tag].bg)}>
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", TAG_STYLES[e.tag].dot)} />
                        <div className="flex-1">
                          <div className={cn("text-[12px] font-semibold", TAG_STYLES[e.tag].text)}>{e.title}</div>
                          {e.desc && <div className="text-[11px] text-[#64748b] mt-0.5">{e.desc}</div>}
                        </div>
                        {tagBadge(e.tag, true)}
                        {e.attendees?.length ? (
                          <span className="text-[10px] text-[#94a3b8] flex items-center gap-0.5">
                            <Mail className="h-3 w-3" />{e.attendees.length}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────── LIST VIEW ─────────── */}
      {view === "list" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">All Events</div>
            <div className="text-[11px] text-[#94a3b8]">{filtered.length} events</div>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#94a3b8] text-[13px]">No events match your filter.</div>
          )}
          {filtered
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((e) => (
              <div key={e.id}
                onClick={() => setSelected(e)}
                className="flex items-center gap-4 px-5 py-3 border-b border-[#f8faff] hover:bg-[#f8faff] cursor-pointer transition-colors last:border-b-0"
              >
                {/* Date block */}
                <div className={cn("w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0", TAG_STYLES[e.tag].bg)}>
                  <div className={cn("text-[9px] font-bold uppercase", TAG_STYLES[e.tag].text)}>
                    {new Date(e.date + "T12:00:00").toLocaleString("default", { month: "short" })}
                  </div>
                  <div className={cn("text-[15px] font-extrabold leading-none", TAG_STYLES[e.tag].text)}>
                    {new Date(e.date + "T12:00:00").getDate()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#0f172a] truncate">{e.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {e.time && <span className="text-[11px] text-[#94a3b8]">{e.time}</span>}
                    {e.desc && <span className="text-[11px] text-[#64748b] truncate">{e.desc}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {tagBadge(e.tag)}
                  {e.attendees?.length ? (
                    <span className="flex items-center gap-0.5 text-[11px] text-[#94a3b8]">
                      <Mail className="h-3 w-3" />{e.attendees.length}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ─────────── Event Detail Side Panel ─────────── */}
      {selected && (
        <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-[#e2e8f0] shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#64748b]">Event Details</div>
            <button onClick={() => setSelected(null)} className="text-[#94a3b8] hover:text-[#64748b]"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
            <div className={cn("px-3 py-1 rounded-full w-fit text-[10px] font-bold", TAG_STYLES[selected.tag].bg, TAG_STYLES[selected.tag].text)}>
              {selected.tag}
            </div>
            <h2 className="text-[15px] font-bold text-[#0f172a]">{selected.title}</h2>
            <div className="text-[12px] text-[#64748b]">
              <div>📅 {new Date(selected.date + "T12:00:00").toLocaleDateString("default", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
              {selected.time && <div className="mt-1">🕐 {selected.time}</div>}
            </div>
            {selected.desc && <p className="text-[12px] text-[#334155] leading-relaxed">{selected.desc}</p>}
            {selected.attendees?.length ? (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1.5">Attendees</div>
                {selected.attendees.map((a) => (
                  <div key={a} className="text-[12px] text-[#334155] flex items-center gap-1.5 mb-1">
                    <Mail className="h-3 w-3 text-[#94a3b8]" />{a}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="px-5 py-3 border-t border-[#f1f5f9] space-y-2">
            <button onClick={() => { setModal({ open: true, initial: selected }); setSelected(null); }}
              className="w-full text-[12px] font-bold py-2 border border-[#e2e8f0] rounded-lg text-[#334155] hover:bg-[#f8faff]">
              Edit Event
            </button>
            <button onClick={() => { setModal({ open: true, initial: { tag: selected.tag, date: selected.date } }); setSelected(null); }}
              className="w-full text-[12px] font-bold py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] flex items-center justify-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Send Invite
            </button>
          </div>
        </div>
      )}

      {/* ─────────── Modal ─────────── */}
      {modal.open && (
        <EventModal initial={modal.initial} onSave={saveEvent} onClose={() => setModal({ open: false })} />
      )}
    </div>
  );
}
