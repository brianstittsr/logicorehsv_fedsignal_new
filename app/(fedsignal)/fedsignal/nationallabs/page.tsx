"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Zap, Shield, FlaskConical, Atom, Award, Target, TrendingUp,
  MapPin, Users, ExternalLink, ChevronDown, CheckCircle, Info
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  { id: "budget", label: "TOTAL LAB R&D BUDGET", value: "$22B", sublabel: "FY2023 annual", color: "text-[#1a56db]", border: "border-[#1a56db]" },
  { id: "accessible", label: "HBCU-ACCESSIBLE", value: "17", sublabel: "All labs have HBCU programs", color: "text-[#047857]", border: "border-[#047857]" },
  { id: "open", label: "OPEN BAA / FOAs", value: "43", sublabel: "As of March 2025", color: "text-[#b45309]", border: "border-[#b45309]" },
  { id: "capture", label: "HBCU CAPTURE RATE", value: "<3%", sublabel: "Massive whitespace", color: "text-[#7A0019]", border: "border-[#7A0019]" },
];

const FILTER_TABS = [
  { id: "all", label: "All 17 Labs", count: 17 },
  { id: "energy", label: "Energy", count: 6 },
  { id: "defense", label: "Defense / National Security", count: 5 },
  { id: "science", label: "Basic Science", count: 4 },
  { id: "hbcu", label: "Strong HBCU Programs", count: 8 },
];

const NATIONAL_LABS = [
  { id: "ornl", name: "ORNL", fullName: "Oak Ridge National Laboratory", state: "TN", type: "energy", budget: 2.8, x: 68, y: 45, hbcu: true, color: "#0891b2" },
  { id: "anl", name: "ANL", fullName: "Argonne National Laboratory", state: "IL", type: "energy", budget: 1.2, x: 55, y: 35, hbcu: true, color: "#0891b2" },
  { id: "bnl", name: "BNL", fullName: "Brookhaven National Laboratory", state: "NY", type: "science", budget: 0.9, x: 88, y: 32, hbcu: true, color: "#7c3aed" },
  { id: "lanl", name: "LANL", fullName: "Los Alamos National Laboratory", state: "NM", type: "defense", budget: 3.9, x: 28, y: 55, hbcu: true, color: "#dc2626" },
  { id: "snl", name: "SNL", fullName: "Sandia National Laboratories", state: "NM", type: "defense", budget: 3.4, x: 30, y: 58, hbcu: true, color: "#dc2626" },
  { id: "llnl", name: "LLNL", fullName: "Lawrence Livermore National Laboratory", state: "CA", type: "defense", budget: 2.5, x: 15, y: 42, hbcu: false, color: "#dc2626" },
  { id: "slac", name: "SLAC", fullName: "SLAC National Accelerator Laboratory", state: "CA", type: "science", budget: 0.6, x: 12, y: 45, hbcu: false, color: "#7c3aed" },
  { id: "pnnl", name: "PNNL", fullName: "Pacific Northwest National Laboratory", state: "WA", type: "energy", budget: 1.4, x: 10, y: 15, hbcu: false, color: "#0891b2" },
  { id: "inl", name: "INL", fullName: "Idaho National Laboratory", state: "ID", type: "energy", budget: 1.1, x: 22, y: 22, hbcu: false, color: "#0891b2" },
  { id: "nrel", name: "NREL", fullName: "National Renewable Energy Laboratory", state: "CO", type: "energy", budget: 0.8, x: 35, y: 45, hbcu: true, color: "#0891b2" },
  { id: "fnal", name: "FNAL", fullName: "Fermi National Accelerator Laboratory", state: "IL", type: "science", budget: 0.9, x: 57, y: 33, hbcu: true, color: "#7c3aed" },
  { id: "jlab", name: "JLab", fullName: "Thomas Jefferson National Accelerator Facility", state: "VA", type: "science", budget: 0.7, x: 78, y: 50, hbcu: true, color: "#7c3aed" },
  { id: "ames", name: "AMES", fullName: "Ames National Laboratory", state: "IA", type: "energy", budget: 0.5, x: 52, y: 30, hbcu: false, color: "#0891b2" },
  { id: "netl", name: "NETL", fullName: "National Energy Technology Laboratory", state: "WV", type: "energy", budget: 0.9, x: 72, y: 40, hbcu: false, color: "#0891b2" },
  { id: "nnsa", name: "NNSA", fullName: "National Nuclear Security Administration Labs", state: "Various", type: "defense", budget: 4.2, x: 85, y: 35, hbcu: false, color: "#dc2626" },
  { id: "srnl", name: "SRNL", fullName: "Savannah River National Laboratory", state: "SC", type: "defense", budget: 0.6, x: 75, y: 65, hbcu: true, color: "#dc2626" },
  { id: "bnl2", name: "YOU", fullName: "Your Location", state: "AL", type: "marker", budget: 0, x: 65, y: 70, hbcu: false, color: "#f59e0b", isUser: true },
];

const LEGEND_ITEMS = [
  { color: "#0891b2", label: "Energy" },
  { color: "#dc2626", label: "Defense/Nuc" },
  { color: "#047857", label: "Science" },
  { color: "#7c3aed", label: "Physics" },
  { color: "#f59e0b", label: "Your Location" },
  { dashed: true, label: "HBCU Program" },
];

const INSIGHT_CARDS = [
  { label: "CLOSEST LAB", name: "ORNL", sublabel: "~180mi from Tuskegee, TN", color: "bg-blue-50 border-blue-200" },
  { label: "2ND CLOSEST", name: "SRNL", sublabel: "~210 mi / Augusta, SC", color: "bg-slate-50 border-slate-200" },
  { label: "HIGHEST BUDGET", name: "NNSA", sublabel: "$4.2B / Weapons Complex", color: "bg-red-50 border-red-200" },
  { label: "BEST FIRST CONTACT", name: "ORNL", sublabel: "60+ HBCU partnerships", color: "bg-green-50 border-green-200" },
];

export default function NationalLabsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedLab, setSelectedLab] = useState<string | null>(null);

  const filteredLabs = activeFilter === "all" 
    ? NATIONAL_LABS 
    : NATIONAL_LABS.filter(lab => lab.type === activeFilter || (activeFilter === "hbcu" && lab.hbcu));

  return (
    <div className="space-y-4">
      {/* ─── INTELLIGENCE Banner ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          INTELLIGENCE
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>DOE National Lab Intelligence</strong> — 17 national laboratories with $22B in annual R&D. HBCU penetration rate: under 3%. These are your highest-value underpenetrated partnerships.
        </span>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-4 gap-3">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.id}
            className={cn(
              "bg-white rounded-lg p-4 border-t-4 shadow-sm",
              kpi.border
            )}
          >
            <div className="text-[9px] font-bold tracking-wide text-[#64748b] mb-1 uppercase">
              {kpi.label}
            </div>
            <div className={cn("text-[28px] font-extrabold", kpi.color)}>{kpi.value}</div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">{kpi.sublabel}</div>
          </div>
        ))}
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
              activeFilter === tab.id
                ? "bg-[#1a56db] text-white"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded",
              activeFilter === tab.id ? "bg-white/20" : "bg-[#f1f5f9]"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ─── National Lab Proximity Map ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-500">📍</span>
            <span className="text-[12px] font-bold tracking-wide text-[#0f172a] uppercase">NATIONAL LAB PROXIMITY MAP</span>
          </div>
          <span className="text-[10px] text-[#94a3b8]">Color = research category. Size = annual budget. Blue ring = active HBCU program.</span>
        </div>

        {/* Map Container */}
        <div className="relative h-[400px] bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-hidden">
          {/* US Map Outline (simplified) */}
          <svg 
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Simplified US continental outline */}
            <path
              d="M5,15 Q8,12 15,10 L25,8 Q35,5 50,8 L65,12 Q80,15 90,20 L95,35 Q96,50 92,65 L88,75 Q85,82 78,85 L70,88 Q60,90 50,88 L35,85 Q20,82 12,75 L8,65 Q5,50 5,35 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </svg>

          {/* Lab Bubbles */}
          {filteredLabs.map((lab) => (
            <button
              key={lab.id}
              onClick={() => setSelectedLab(selectedLab === lab.id ? null : lab.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
              style={{ left: `${lab.x}%`, top: `${lab.y}%` }}
            >
              <div className={cn(
                "relative flex items-center justify-center rounded-full font-bold text-[10px] text-white shadow-lg transition-all",
                lab.isUser ? "w-10 h-10 bg-amber-500" : "w-8 h-8",
                selectedLab === lab.id && "ring-2 ring-offset-2 ring-[#1a56db] scale-110"
              )}
              style={{ 
                backgroundColor: lab.isUser ? undefined : lab.color,
                width: lab.isUser ? 40 : Math.max(24, 24 + lab.budget * 4),
                height: lab.isUser ? 40 : Math.max(24, 24 + lab.budget * 4),
              }}
              >
                {lab.hbcu && !lab.isUser && (
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/70" />
                )}
                <span className="relative z-10">{lab.name}</span>
              </div>
              
              {/* Tooltip */}
              {selectedLab === lab.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl border border-[#e2e8f0] p-3 z-20">
                  <div className="text-[11px] font-bold text-[#0f172a]">{lab.fullName}</div>
                  <div className="text-[10px] text-[#64748b] mt-1">{lab.state}</div>
                  {!lab.isUser && (
                    <>
                      <div className="text-[10px] text-[#64748b] mt-1">Budget: ${lab.budget}B</div>
                      {lab.hbcu && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-[9px] text-green-600">HBCU Program Active</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#fafafa]">
          <div className="text-[10px] font-bold text-[#64748b] mb-2 uppercase tracking-wide">Legend</div>
          <div className="flex flex-wrap items-center gap-4">
            {LEGEND_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                {item.dashed ? (
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#64748b]" />
                ) : (
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                )}
                <span className="text-[10px] text-[#64748b]">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-[#94a3b8] mt-2">Circle size = annual R&D budget • Dashed ring = active HBCU partnership program</p>
        </div>
      </div>

      {/* ─── Insight Cards ─── */}
      <div className="grid grid-cols-4 gap-3">
        {INSIGHT_CARDS.map((card, idx) => (
          <div key={idx} className={cn("p-4 rounded-lg border", card.color)}>
            <div className="text-[9px] font-bold tracking-wide text-[#64748b] mb-1 uppercase">
              {card.label}
            </div>
            <div className="text-[16px] font-bold text-[#0f172a]">{card.name}</div>
            <div className="text-[10px] text-[#64748b] mt-0.5">{card.sublabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
