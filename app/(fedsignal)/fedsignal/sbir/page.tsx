"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Shield, Cpu, Zap, Bot, HeartPulse, Wifi, ChevronDown, Check } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  { label: "Open SBIR Topics", value: "847", sublabel: "↑ 33 new this week", color: "text-[#1a56db]", border: "border-[#1a56db]" },
  { label: "High-Match Topics", value: "34", sublabel: "Score 80+", color: "text-[#047857]", border: "border-[#047857]" },
  { label: "Funding Available", value: "$2.1B", sublabel: "FY2025 SBIR pool", color: "text-[#7A0019]", border: "border-[#7A0019]" },
];

const AGENCIES = [
  "All Agencies",
  "Department of Defense (DOD)",
  "National Institutes of Health (NIH)",
  "National Science Foundation (NSF)",
  "Department of Energy (DOE)",
  "NASA",
  "Department of Homeland Security (DHS)",
  "Environmental Protection Agency (EPA)",
  "Department of Agriculture (USDA)",
  "Department of Education (ED)",
];

const TECH_AREAS = [
  { id: "cyber", label: "Cybersecurity", icon: Shield, selected: true },
  { id: "aiml", label: "AI/ML", icon: Cpu, selected: true },
  { id: "energy", label: "Energy", icon: Zap, selected: false },
  { id: "auto", label: "Autonomous Systems", icon: Bot, selected: false },
  { id: "bio", label: "Biomedical", icon: HeartPulse, selected: false },
  { id: "c4isr", label: "C4ISR/Comms", icon: Wifi, selected: false },
];

const MOCK_TOPICS = [
  { id: "AF25.1-001", agency: "DOD / Air Force", title: "AI-Powered Predictive Maintenance for Aircraft", phase: "Phase I", value: "$275K", match: 94, deadline: "Apr 15, 2025", tech: "AI/ML" },
  { id: "H25.1-042", agency: "NIH / NIAID", title: "Machine Learning for Pathogen Detection", phase: "Phase I", value: "$325K", match: 91, deadline: "Apr 22, 2025", tech: "AI/ML" },
  { id: "N25.1-018", agency: "NASA", title: "Secure Communications for Deep Space Networks", phase: "Phase I", value: "$300K", match: 89, deadline: "May 01, 2025", tech: "Cybersecurity" },
  { id: "D25.1-127", agency: "DOD / DARPA", title: "Zero-Trust Architecture for Tactical Edge", phase: "Phase I", value: "$290K", match: 87, deadline: "Apr 30, 2025", tech: "Cybersecurity" },
  { id: "E25.1-056", agency: "DOE", title: "AI-Driven Grid Resilience Platform", phase: "Phase I", value: "$285K", match: 85, deadline: "May 08, 2025", tech: "AI/ML" },
  { id: "N25.2-003", agency: "NSF", title: "Quantum-Safe Cryptographic Protocols", phase: "Phase II", value: "$1.5M", match: 83, deadline: "Jun 15, 2025", tech: "Cybersecurity" },
];

export default function SBIRPage() {
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [agency, setAgency] = useState("All Agencies");
  const [phase, setPhase] = useState<{ i: boolean; ii: boolean; sttr: boolean }>({ i: true, ii: false, sttr: false });
  const [techAreas, setTechAreas] = useState<string[]>(["cyber", "aiml"]);

  const toggleTech = (id: string) => {
    setTechAreas((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSearched(true);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* ─── RESEARCH INTEL Banner ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          RESEARCH INTEL
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>SBIR/STTR Match Engine</strong> — HBCUs are chronically under-represented in SBIR despite full eligibility. Your AI-powered SBIR match engine surfaces best-fit topics before deadlines.
        </span>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-3 gap-3">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "bg-white rounded-lg p-4 border-t-4 shadow-sm",
              kpi.border
            )}
          >
            <div className="text-[10px] font-bold uppercase tracking-wide text-[#64748b] mb-1">
              {kpi.label}
            </div>
            <div className={cn("text-[26px] font-extrabold", kpi.color)}>{kpi.value}</div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">{kpi.sublabel}</div>
          </div>
        ))}
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ─── Left: SBIR Search Configuration ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
            SBIR Search Configuration
          </div>

          {/* Agency */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Agency</label>
            <div className="relative">
              <select
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              >
                {AGENCIES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>

          {/* Phase */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-2">Phase</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPhase((p) => ({ ...p, i: !p.i }))}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-[11px] font-medium border transition-colors text-center",
                  phase.i
                    ? "bg-[#eff6ff] border-[#1a56db] text-[#1a56db]"
                    : "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                )}
              >
                Phase I <span className="text-[10px] opacity-70">$50K-$325K</span>
              </button>
              <button
                onClick={() => setPhase((p) => ({ ...p, ii: !p.ii }))}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-[11px] font-medium border transition-colors text-center",
                  phase.ii
                    ? "bg-[#eff6ff] border-[#1a56db] text-[#1a56db]"
                    : "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                )}
              >
                Phase II <span className="text-[10px] opacity-70">$750K-$2M</span>
              </button>
              <button
                onClick={() => setPhase((p) => ({ ...p, sttr: !p.sttr }))}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-[11px] font-medium border transition-colors text-center",
                  phase.sttr
                    ? "bg-[#eff6ff] border-[#1a56db] text-[#1a56db]"
                    : "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                )}
              >
                STTR <span className="text-[10px] opacity-70">Transfer required</span>
              </button>
            </div>
          </div>

          {/* Technology Areas */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-2">Technology Areas</label>
            <div className="grid grid-cols-2 gap-2">
              {TECH_AREAS.map((tech) => {
                const Icon = tech.icon;
                const isSelected = techAreas.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    onClick={() => toggleTech(tech.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-colors",
                      isSelected
                        ? "bg-[#eff6ff] border-[#1a56db]"
                        : "bg-white border-[#e2e8f0] hover:bg-[#f8faff]"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isSelected ? "text-[#1a56db]" : "text-[#94a3b8]")} />
                    <span className={cn("text-[11px] font-medium", isSelected ? "text-[#1a56db]" : "text-[#64748b]")}>
                      {tech.label}
                    </span>
                    {isSelected && <Check className="h-3 w-3 text-[#1a56db] ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full py-3 rounded-lg text-[13px] font-bold tracking-wide text-white transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: searching ? "#7A0019cc" : "#7A0019" }}
          >
            <Search className="h-4 w-4" />
            {searching ? "Searching..." : "Find Best-Match Topics"}
          </button>
        </div>

        {/* ─── Right: Matched SBIR/STTR Topics ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
              Matched SBIR/STTR Topics
            </div>
            {searched && (
              <span className="text-[11px] text-[#94a3b8]">
                {MOCK_TOPICS.length} matches
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-[400px]">
            {!searched ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3">
                  <Search className="h-5 w-5 text-[#94a3b8]" />
                </div>
                <p className="text-[13px] text-[#94a3b8] max-w-xs">
                  Configure search and click Find to surface SBIR topics matched to your capabilities.
                </p>
              </div>
            ) : (
              <div className="max-h-[550px] overflow-y-auto">
                {MOCK_TOPICS.map((topic, idx) => (
                  <div
                    key={topic.id}
                    className={cn(
                      "px-5 py-4 border-b border-[#f1f5f9] hover:bg-[#f8faff] transition-colors",
                      idx % 2 === 1 && "bg-[#fafafa]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#e2e8f0] text-[#64748b] rounded">
                            {topic.id}
                          </span>
                          <span className="text-[11px] text-[#94a3b8]">{topic.agency}</span>
                        </div>
                        <h4 className="text-[13px] font-semibold text-[#0f172a] leading-snug mb-2">
                          {topic.title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded",
                            topic.phase === "Phase I" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                          )}>
                            {topic.phase}
                          </span>
                          <span className="text-[11px] text-[#047857] font-semibold">{topic.value}</span>
                          <span className="text-[10px] text-[#94a3b8]">Due: {topic.deadline}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <div className={cn(
                          "text-[16px] font-extrabold",
                          topic.match >= 90 ? "text-[#047857]" : topic.match >= 80 ? "text-[#1a56db]" : "text-[#64748b]"
                        )}>
                          {topic.match}%
                        </div>
                        <div className="text-[9px] text-[#94a3b8] uppercase">Match</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
