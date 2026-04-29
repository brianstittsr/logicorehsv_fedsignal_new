"use client";

import { cn } from "@/lib/utils";

interface AlertItem {
  icon: string;
  iconBg: string;
  title: string;
  meta: string;
  desc: string;
  date: string;
  action?: { label: string; style: "primary" | "outline" };
}

interface AlertSection {
  id: string;
  label: string;
  emoji: string;
  accentColor: string;
  borderColor: string;
  items: AlertItem[];
}

const sections: AlertSection[] = [
  {
    id: "urgent",
    label: "URGENT — ACTION REQUIRED",
    emoji: "⚡",
    accentColor: "text-red-700",
    borderColor: "border-red-600",
    items: [
      {
        icon: "🔴",
        iconBg: "bg-red-100",
        title: "NSA Cyber RFP closes in 14 days — No proposal started",
        meta: "W52P1J-25-R-0044 · $750K · HBCU Set-Aside · Match Score 94. This is your highest-fit active opportunity. Assign PI and begin proposal immediately.",
        desc: "",
        date: "Mar 11",
        action: { label: "START PROPOSAL", style: "primary" },
      },
      {
        icon: "⏱",
        iconBg: "bg-slate-100",
        title: "3 unanswered Sources Sought notices — pipeline risk",
        meta: "Non-response removes AAMU from set-aside consideration. NSA SS closes Mar 28. Assign GovCon coordinator.",
        desc: "",
        date: "Mar 10",
        action: { label: "REVIEW RFIS", style: "outline" },
      },
    ],
  },
  {
    id: "market",
    label: "MARKET INTELLIGENCE SIGNALS",
    emoji: "📡",
    accentColor: "text-green-700",
    borderColor: "border-green-600",
    items: [
      {
        icon: "📊",
        iconBg: "bg-blue-50",
        title: "Department of Energy AI research funding increased 37% over 3 years",
        meta: "",
        desc: "8 new HBCU-eligible DoE AI opportunities expected FY2026 Q1. Tuskegee's engineering faculty alignment is 74%. Consider targeted faculty hire in energy AI to close gap.",
        date: "Mar 9",
      },
      {
        icon: "🏆",
        iconBg: "bg-amber-50",
        title: "Peer institutions increased AI research grants by 42% in FY2025",
        meta: "",
        desc: "Howard, FAMU, and NC A&T collectively added $180M in AI-related research awards. Tuskegee's AI pipeline has 8 open opportunities worth $6.4M. Prioritize DARPA and AFRL tracks.",
        date: "Mar 8",
      },
      {
        icon: "💰",
        iconBg: "bg-green-50",
        title: "Transportation infrastructure contracts worth $500M expiring in 24 months",
        meta: "",
        desc: "DoT recompete cycle opening Q3 2026. 6 contracts with HBCU eligibility. Tuskegee's transportation research faculty is relevant. Begin capability positioning now.",
        date: "Mar 7",
      },
    ],
  },
  {
    id: "partnerships",
    label: "PARTNERSHIP OPPORTUNITIES",
    emoji: "🤝",
    accentColor: "text-amber-700",
    borderColor: "border-amber-500",
    items: [
      {
        icon: "🏢",
        iconBg: "bg-slate-100",
        title: "SAIC seeking HBCU cybersecurity research partner",
        meta: "",
        desc: "NSA program vehicle, $4.5M. Tuskegee match score: 92%. SAIC specifically requested HBCU with network security and AI expertise. This matches your cyber lab capabilities exactly.",
        date: "Mar 9",
        action: { label: "CONNECT", style: "outline" },
      },
      {
        icon: "🎓",
        iconBg: "bg-amber-50",
        title: "HBCU STEM Pipeline Consortium forming — 2 seats available",
        meta: "",
        desc: "NC A&T leading 5-institution consortium targeting $12M DoD STEM program. Tuskegee invited as co-performer. Deadline to join: Apr 1.",
        date: "Mar 8",
        action: { label: "JOIN", style: "primary" },
      },
    ],
  },
];

export default function AlertsPage() {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div
          key={section.id}
          className={cn(
            "bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden border-t-2",
            section.borderColor
          )}
        >
          {/* Section Header */}
          <div className="px-5 py-3 border-b border-[#f1f5f9]">
            <span className={cn("text-[12px] font-bold tracking-[0.12em] uppercase", section.accentColor)}>
              {section.emoji} {section.label}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-[#f1f5f9]">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-[#f8faff] transition-colors">
                <div className={cn("w-9 h-9 rounded-md flex items-center justify-center text-base flex-shrink-0 mt-0.5", item.iconBg)}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#0f172a] mb-1 leading-snug">{item.title}</div>
                  <div className="text-[12px] text-[#64748b] leading-relaxed">
                    {item.meta || item.desc}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                  <span className="text-[11px] text-[#94a3b8] whitespace-nowrap">{item.date}</span>
                  {item.action && (
                    <button
                      className={cn(
                        "text-[11px] font-bold px-3 py-1.5 rounded border tracking-wide whitespace-nowrap transition-colors",
                        item.action.style === "primary"
                          ? "bg-[#1a56db] text-white border-[#1a56db] hover:bg-[#1549c0]"
                          : "bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f9fafb]"
                      )}
                    >
                      {item.action.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
