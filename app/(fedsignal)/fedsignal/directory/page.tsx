"use client";

import { useState } from "react";
import { Search, MapPin, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type RelationshipStatus = "partner" | "trial" | "you" | null;

interface HBCUCard {
  id: string;
  monogram: string;
  monogramColor: string;
  monogramBg: string;
  name: string;
  city: string;
  state: string;
  region: string;
  domains: { label: string; color: string }[];
  fy25Awards: string;
  winRate: string;
  activeBids: number;
  tracked: number;
  status: RelationshipStatus;
  primaryAction: { label: string; style: "blue" | "outline" } | null;
  secondaryActions: string[];
}

const tagColors: Record<string, string> = {
  Cyber:       "bg-blue-100 text-blue-700",
  "AI/ML":     "bg-purple-100 text-purple-700",
  STEM:        "bg-green-100 text-green-700",
  Engineering: "bg-orange-100 text-orange-700",
  Energy:      "bg-yellow-100 text-yellow-700",
  AI:          "bg-purple-100 text-purple-700",
  Defense:     "bg-red-100 text-red-700",
};

const institutions: HBCUCard[] = [
  {
    id: "howard",
    monogram: "HU",
    monogramColor: "text-[#002147]",
    monogramBg: "bg-white border-2 border-[#002147]",
    name: "Howard University",
    city: "Washington", state: "DC", region: "Mid-Atlantic",
    domains: [
      { label: "Cyber", color: tagColors["Cyber"] },
      { label: "AI/ML", color: tagColors["AI/ML"] },
      { label: "STEM", color: tagColors["STEM"] },
    ],
    fy25Awards: "$412M", winRate: "41%", activeBids: 12, tracked: 89,
    status: "partner",
    primaryAction: { label: "View Intel", style: "blue" },
    secondaryActions: ["Team Agreement", "Message"],
  },
  {
    id: "famu",
    monogram: "FAMU",
    monogramColor: "text-[#FF6B00]",
    monogramBg: "bg-white border-2 border-[#FF6B00]",
    name: "Florida A&M University",
    city: "Tallahassee", state: "FL", region: "Southeast",
    domains: [
      { label: "Engineering", color: tagColors["Engineering"] },
      { label: "Energy", color: tagColors["Energy"] },
      { label: "AI", color: tagColors["AI"] },
    ],
    fy25Awards: "$316M", winRate: "35%", activeBids: 9, tracked: 62,
    status: "partner",
    primaryAction: { label: "View Intel", style: "blue" },
    secondaryActions: ["Consortium"],
  },
  {
    id: "tuskegee",
    monogram: "TU",
    monogramColor: "text-[#7A0019]",
    monogramBg: "bg-white border-2 border-[#7A0019]",
    name: "Tuskegee University",
    city: "Tuskegee", state: "AL", region: "Southeast",
    domains: [
      { label: "Cyber", color: tagColors["Cyber"] },
      { label: "Engineering", color: tagColors["Engineering"] },
      { label: "Energy", color: tagColors["Energy"] },
    ],
    fy25Awards: "$62M", winRate: "28%", activeBids: 6, tracked: 47,
    status: "you",
    primaryAction: { label: "Edit Profile", style: "blue" },
    secondaryActions: ["Manage Visibility"],
  },
  {
    id: "aamu",
    monogram: "AAMU",
    monogramColor: "text-[#003087]",
    monogramBg: "bg-white border-2 border-[#003087]",
    name: "Alabama A&M University",
    city: "Normal", state: "AL", region: "Southeast",
    domains: [
      { label: "Cyber", color: tagColors["Cyber"] },
      { label: "Engineering", color: tagColors["Engineering"] },
      { label: "AI", color: tagColors["AI"] },
    ],
    fy25Awards: "$52M", winRate: "28%", activeBids: 5, tracked: 38,
    status: "trial",
    primaryAction: { label: "View Intel", style: "blue" },
    secondaryActions: ["Consortium"],
  },
  {
    id: "ncat",
    monogram: "A&T",
    monogramColor: "text-[#004B87]",
    monogramBg: "bg-white border-2 border-[#004B87]",
    name: "NC A&T State University",
    city: "Greensboro", state: "NC", region: "Southeast",
    domains: [
      { label: "Engineering", color: tagColors["Engineering"] },
      { label: "AI", color: tagColors["AI"] },
      { label: "Defense", color: tagColors["Defense"] },
    ],
    fy25Awards: "$188M", winRate: "36%", activeBids: 8, tracked: 55,
    status: "partner",
    primaryAction: { label: "View Intel", style: "blue" },
    secondaryActions: ["Consortium"],
  },
  {
    id: "invite",
    monogram: "+",
    monogramColor: "text-[#94a3b8]",
    monogramBg: "bg-[#f8faff] border-2 border-dashed border-[#cbd5e1]",
    name: "",
    city: "", state: "", region: "",
    domains: [],
    fy25Awards: "", winRate: "", activeBids: 0, tracked: 0,
    status: null,
    primaryAction: null,
    secondaryActions: [],
  },
];

const statusBadge: Record<NonNullable<RelationshipStatus>, { label: string; style: string }> = {
  partner: { label: "+ Partner", style: "text-green-700 bg-green-50 border border-green-300" },
  trial:   { label: "◉ Trial",   style: "text-red-600 bg-red-50 border border-red-300" },
  you:     { label: "● You",     style: "text-amber-700 bg-amber-50 border border-amber-300" },
};

export default function DirectoryPage() {
  const [search, setSearch] = useState("");

  const visible = institutions.filter((inst) => {
    if (inst.id === "invite") return true;
    if (!search) return true;
    return (
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.city.toLowerCase().includes(search.toLowerCase()) ||
      inst.region.toLowerCase().includes(search.toLowerCase()) ||
      inst.domains.some((d) => d.label.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institutions, cities, research domains, faculty..."
            className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#94a3b8]"
          />
        </div>
        {["All Regions", "All Research Domains", "All"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1 text-[12px] px-3 py-2 border border-[#e2e8f0] rounded-lg bg-white text-[#334155] hover:bg-[#f8faff] transition-colors"
          >
            {label}
            <ChevronDown className="h-3 w-3 text-[#94a3b8]" />
          </button>
        ))}
        <button className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors ml-auto">
          <Plus className="h-3.5 w-3.5" />
          Invite Institution
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((inst) => {
          if (inst.id === "invite") {
            return (
              <div
                key="invite"
                className="bg-white border border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center py-14 gap-2 text-[#94a3b8] hover:border-[#1a56db] hover:text-[#1a56db] transition-colors cursor-pointer"
              >
                <Plus className="h-6 w-6" />
                <span className="text-[12px] font-semibold">Invite Institution</span>
                <span className="text-[11px] text-center px-6">75 additional HBCUs available to join the network</span>
              </div>
            );
          }

          const sb = inst.status ? statusBadge[inst.status] : null;

          return (
            <div
              key={inst.id}
              className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Card Header */}
              <div className="px-4 pt-4 pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-start justify-between mb-1">
                  {/* Monogram */}
                  <div className={cn("px-2 py-0.5 rounded font-extrabold tracking-tight text-[18px] leading-tight", inst.monogramBg, inst.monogramColor)}>
                    {inst.monogram}
                  </div>
                  {sb && (
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", sb.style)}>
                      {sb.label}
                    </span>
                  )}
                </div>
                <div className="text-[13px] font-semibold text-[#0f172a] mt-1.5">{inst.name}</div>
                <div className="flex items-center gap-1 text-[11px] text-[#64748b] mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {inst.city}, {inst.state} &nbsp;·&nbsp; {inst.region}
                </div>
                {/* Domain tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {inst.domains.map((d) => (
                    <span key={d.label} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded", d.color)}>
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-px bg-[#f1f5f9] border-b border-[#f1f5f9]">
                {[
                  { label: "FY25 AWARDS", value: inst.fy25Awards },
                  { label: "WIN RATE",    value: inst.winRate },
                  { label: "ACTIVE BIDS", value: String(inst.activeBids) },
                  { label: "TRACKED",     value: String(inst.tracked) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white px-4 py-2.5">
                    <div className="text-[18px] font-extrabold text-[#0f172a] leading-tight">{stat.value}</div>
                    <div className="text-[9px] font-bold tracking-widest text-[#94a3b8] uppercase mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 flex items-center gap-2">
                {inst.primaryAction && (
                  <button
                    className={cn(
                      "flex-1 text-[11px] font-semibold py-1.5 rounded border transition-colors",
                      inst.primaryAction.style === "blue"
                        ? "bg-[#eff6ff] text-[#1a56db] border-[#bfdbfe] hover:bg-[#dbeafe]"
                        : "bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f9fafb]"
                    )}
                  >
                    {inst.primaryAction.label}
                  </button>
                )}
                {inst.secondaryActions.map((action) => (
                  <button
                    key={action}
                    className="text-[11px] text-[#64748b] hover:text-[#0f172a] transition-colors px-1 whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
