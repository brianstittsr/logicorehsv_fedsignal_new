"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface ConsortiumData {
  id: string;
  name: string;
  status: "Active" | "Forming";
  statusColor: string;
  lead: string;
  estOrForming: string;
  description: string;
  members: string[];
  extraMembers?: number;
  stats?: { members: number; value: string; deadline: string; deadlineColor: string };
  actions: { label: string; variant: "primary" | "outline" | "ghost" }[];
}

const consortiums: ConsortiumData[] = [
  {
    id: "cyber",
    name: "HBCU CYBER DEFENSE RESEARCH ALLIANCE",
    status: "Active",
    statusColor: "bg-green-100 text-green-700 border-green-300",
    lead: "Tuskegee University",
    estOrForming: "Est. Jan 2026",
    description:
      "Targeting ONR Cybersecurity BAA ($3.5M) and NSA HBCU Research Initiative Phase III. Combined faculty expertise in network security, AI-driven threat analysis, and OT/ICS security.",
    members: ["Tuskegee (Lead)", "Howard University", "FAMU", "Morgan State"],
    stats: { members: 4, value: "$3.5M", deadline: "Apr 30", deadlineColor: "text-red-600" },
    actions: [
      { label: "OPEN WORKSPACE", variant: "primary" },
      { label: "PROPOSAL STATUS", variant: "outline" },
      { label: "+ INVITE MEMBER", variant: "ghost" },
    ],
  },
  {
    id: "stem",
    name: "HBCU STEM PIPELINE COALITION",
    status: "Forming",
    statusColor: "bg-amber-100 text-amber-700 border-amber-300",
    lead: "NC A&T",
    estOrForming: "Forming now",
    description:
      "Targeting DoD STEM Education program ($12M) and Army REAP grants. Focus on K-12 pipeline development and undergraduate research experiences across HBCU network.",
    members: ["NC A&T (Lead)", "Tuskegee", "AAMU"],
    extraMembers: 2,
    actions: [
      { label: "JOIN CONSORTIUM", variant: "outline" },
      { label: "VIEW DETAILS", variant: "ghost" },
    ],
  },
];

export default function ConsortiumPage() {
  const [consortiumName, setConsortiumName] = useState("");

  return (
    <div className="space-y-4">
      {/* Consortium Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {consortiums.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col"
          >
            <div className="px-5 pt-4 pb-3 flex-1">
              {/* Title */}
              <div className="text-[12px] font-extrabold tracking-[0.1em] text-[#0f172a] uppercase mb-2">
                {c.name}
              </div>

              {/* Status + Lead */}
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", c.statusColor)}>
                  {c.status === "Active" ? "● Active" : "→ Forming"}
                </span>
                <span className="text-[11px] text-[#64748b]">
                  Lead: {c.lead} · {c.estOrForming}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-[#64748b] leading-relaxed mb-3">
                {c.description}
              </p>

              {/* Member pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.members.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] px-2.5 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-full text-[#334155]"
                  >
                    {m}
                  </span>
                ))}
                {c.extraMembers && (
                  <span className="text-[11px] px-2.5 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-full text-[#64748b]">
                    + {c.extraMembers} more invited
                  </span>
                )}
              </div>

              {/* Stats row (Active consortium only) */}
              {c.stats && (
                <div className="grid grid-cols-3 gap-px bg-[#f1f5f9] rounded-lg overflow-hidden mb-4">
                  <div className="bg-white px-4 py-2.5 text-center">
                    <div className="text-[18px] font-extrabold text-[#1a56db]">{c.stats.members}</div>
                    <div className="text-[9px] font-bold tracking-widest text-[#94a3b8] uppercase">MEMBERS</div>
                  </div>
                  <div className="bg-white px-4 py-2.5 text-center">
                    <div className="text-[18px] font-extrabold text-[#0f172a]">{c.stats.value}</div>
                    <div className="text-[9px] font-bold tracking-widest text-[#94a3b8] uppercase">VALUE TARGET</div>
                  </div>
                  <div className="bg-white px-4 py-2.5 text-center">
                    <div className={cn("text-[18px] font-extrabold", c.stats.deadlineColor)}>{c.stats.deadline}</div>
                    <div className="text-[9px] font-bold tracking-widest text-[#94a3b8] uppercase">DEADLINE</div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-2">
              {c.actions.map((action) => (
                <button
                  key={action.label}
                  className={cn(
                    "text-[11px] font-bold px-3 py-1.5 rounded border tracking-wide transition-colors whitespace-nowrap",
                    action.variant === "primary" && "bg-[#1a56db] text-white border-[#1a56db] hover:bg-[#1549c0]",
                    action.variant === "outline" && "bg-white text-[#1a56db] border-[#bfdbfe] hover:bg-[#eff6ff]",
                    action.variant === "ghost" && "bg-transparent text-[#64748b] border-transparent hover:text-[#0f172a]"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Build New Consortium */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-5 py-5">
        <div className="text-[12px] font-extrabold tracking-[0.1em] text-[#0f172a] uppercase mb-4">
          Build New Consortium
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Consortium Name */}
          <div>
            <label className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase block mb-1">
              Consortium Name
            </label>
            <input
              type="text"
              value={consortiumName}
              onChange={(e) => setConsortiumName(e.target.value)}
              placeholder="e.g. HBCU Energy Research Network"
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#94a3b8]"
            />
          </div>

          {/* Target Opportunity */}
          <div>
            <label className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase block mb-1">
              Target Opportunity
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#94a3b8] pr-8">
                <option value="">Select opportunity...</option>
                <option>ONR Cybersecurity BAA ($3.5M)</option>
                <option>NSA HBCU Research Initiative</option>
                <option>DoD STEM Education ($12M)</option>
                <option>Army REAP Grants</option>
                <option>NSF EHR Core Research</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>

          {/* Focus Area */}
          <div>
            <label className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase block mb-1">
              Focus Area
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#94a3b8] pr-8">
                <option value="">Select domain...</option>
                <option>Cybersecurity</option>
                <option>AI / ML</option>
                <option>Defense R&amp;D</option>
                <option>STEM Education</option>
                <option>Energy Systems</option>
                <option>Biomedical Research</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 text-[12px] font-bold px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors">
          CREATE CONSORTIUM + INVITE MEMBERS →
        </button>
      </div>
    </div>
  );
}
