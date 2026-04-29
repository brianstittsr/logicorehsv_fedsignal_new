"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type BadgeType = "HBCU Priority" | "HBCU Specialist";

interface Contractor {
  id: string;
  name: string;
  subtitle: string;
  badge: BadgeType;
  matchScore: number;
  description: string;
  tags: string[];
  primaryAction: { label: string; variant: "blue" | "outline" };
}

const tagColors: Record<string, string> = {
  Cyber:    "bg-blue-100 text-blue-700",
  AI:       "bg-purple-100 text-purple-700",
  NSA:      "bg-slate-100 text-slate-700",
  "STEM Ed":"bg-green-100 text-green-700",
  DoD:      "bg-indigo-100 text-indigo-700",
  Energy:   "bg-yellow-100 text-yellow-700",
  DLA:      "bg-orange-100 text-orange-700",
  "AI/ML":  "bg-purple-100 text-purple-700",
  AFRL:     "bg-red-100 text-red-700",
};

const badgeStyles: Record<BadgeType, string> = {
  "HBCU Priority":   "bg-red-600 text-white",
  "HBCU Specialist": "bg-amber-500 text-white",
};

const contractors: Contractor[] = [
  {
    id: "saic",
    name: "SAIC",
    subtitle: "Science Applications International Corp",
    badge: "HBCU Priority",
    matchScore: 92,
    description: "Seeking HBCU research partner for NSA Cyber program. Background in network security and AI analysis required. $4.5M contract vehicle.",
    tags: ["Cyber", "AI", "NSA"],
    primaryAction: { label: "EXPRESS INTEREST", variant: "outline" },
  },
  {
    id: "leidos",
    name: "Leidos",
    subtitle: "Defense, Intelligence & Health IT",
    badge: "HBCU Priority",
    matchScore: 87,
    description: "STEM workforce pipeline development for DoD STEM initiative. 3-year cooperative agreement, seeking 2–4 HBCU co-performers.",
    tags: ["STEM Ed", "DoD"],
    primaryAction: { label: "EXPRESS INTEREST", variant: "outline" },
  },
  {
    id: "booz",
    name: "Booz Allen Hamilton",
    subtitle: "Strategy, Technology & Management",
    badge: "HBCU Priority",
    matchScore: 79,
    description: "OT/ICS cybersecurity research for DLA energy program. Seeking university research partner with critical infrastructure expertise.",
    tags: ["Cyber", "Energy", "DLA"],
    primaryAction: { label: "EXPRESS INTEREST", variant: "outline" },
  },
  {
    id: "l3harris",
    name: "L3Harris Technologies",
    subtitle: "Defense Electronics & Communication",
    badge: "HBCU Priority",
    matchScore: 74,
    description: "Autonomous systems research for AFRL AI program. Looking for HBCU with AI/ML and robotics research capabilities.",
    tags: ["AI/ML", "AFRL"],
    primaryAction: { label: "EXPRESS INTEREST", variant: "outline" },
  },
  {
    id: "logicore",
    name: "LogiCore Corporation",
    subtitle: "8(a)SB · Cybersecurity, AI & Logistics",
    badge: "HBCU Specialist",
    matchScore: 96,
    description: "OT/ICS cybersecurity and AI-enabled defense systems. NVIDIA Inception member. Actively building HBCU research consortium. Multiple DoD vehicle access.",
    tags: ["Cyber", "AI", "DoD"],
    primaryAction: { label: "CONNECT NOW", variant: "blue" },
  },
];

const tabs = [
  { id: "seeking", label: "Contractors Seeking HBCU Partners" },
  { id: "visibility", label: "University Visibility Settings" },
  { id: "requests", label: "Partnership Requests (3)" },
];

function MatchBar({ score, variant }: { score: number; variant: "blue" | "outline" }) {
  const color = score >= 90 ? "#16a34a" : score >= 80 ? "#2563eb" : score >= 70 ? "#d97706" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[12px] font-bold text-[#0f172a] w-8 text-right">{score}%</span>
    </div>
  );
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("seeking");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-[#e2e8f0] gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-[#1a56db] text-[#1a56db]"
                : "border-transparent text-[#64748b] hover:text-[#334155]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractors.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="px-4 pt-4 pb-3 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-0.5">
                <div>
                  <div className="text-[15px] font-bold text-[#0f172a]">{c.name}</div>
                  <div className="text-[11px] text-[#64748b]">{c.subtitle}</div>
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ml-2 flex-shrink-0", badgeStyles[c.badge])}>
                  {c.badge}
                </span>
              </div>

              {/* Match Score */}
              <div className="mt-3 mb-1">
                <div className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase mb-1">Match Score</div>
                <MatchBar score={c.matchScore} variant={c.primaryAction.variant} />
              </div>

              {/* Description */}
              <p className="text-[12px] text-[#64748b] leading-relaxed mt-3 mb-3 line-clamp-3">
                {c.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn("text-[10px] font-semibold px-2 py-0.5 rounded", tagColors[tag] ?? "bg-slate-100 text-slate-700")}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-[#f1f5f9] flex items-center gap-2">
              <button
                className={cn(
                  "flex-1 text-[11px] font-bold py-2 rounded border tracking-wide transition-colors",
                  c.primaryAction.variant === "blue"
                    ? "bg-[#1a56db] text-white border-[#1a56db] hover:bg-[#1549c0]"
                    : "bg-[#eff6ff] text-[#1a56db] border-[#bfdbfe] hover:bg-[#dbeafe]"
                )}
              >
                {c.primaryAction.label}
              </button>
              <button className="text-[11px] text-[#64748b] hover:text-[#0f172a] transition-colors px-1 whitespace-nowrap">
                VIEW PROFILE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
