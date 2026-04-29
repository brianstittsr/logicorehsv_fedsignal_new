"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, Building2, FileText, DollarSign, CheckCircle } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const PRIME_CONTRACTORS = [
  { id: "1", name: "Boeing Defense, Space & Security", location: "Huntsville, AL", contractValue: "$2.4B", subPlanValue: "$720M", deadline: "Apr 30, 2025", naics: "336414", status: "Active", match: 94, description: "Missile defense systems engineering. Seeking HBCU partners for R&D collaboration." },
  { id: "2", name: "Lockheed Martin Rotary & Mission Systems", location: "Orlando, FL", contractValue: "$1.8B", subPlanValue: "$540M", deadline: "May 15, 2025", naics: "541512", status: "Active", match: 91, description: "Cybersecurity and integrated warfare systems. Cyber lab capability match." },
  { id: "3", name: "Northrop Grumman Mission Systems", location: "McLean, VA", contractValue: "$3.2B", subPlanValue: "$960M", deadline: "Jun 01, 2025", naics: "541715", status: "Active", match: 88, description: "C4ISR and AI/ML systems. Research partnership opportunities." },
  { id: "4", name: "Raytheon Technologies", location: "Tucson, AZ", contractValue: "$1.5B", subPlanValue: "$450M", deadline: "Apr 15, 2025", naics: "336414", status: "Active", match: 86, description: "Directed energy and missile systems. Engineering subcontracting needs." },
  { id: "5", name: "L3Harris Technologies", location: "Melbourne, FL", contractValue: "$900M", subPlanValue: "$270M", deadline: "May 30, 2025", naics: "334220", status: "Active", match: 82, description: "Communications and electronic systems. Workforce development focus." },
  { id: "6", name: "General Dynamics Information Technology", location: "Falls Church, VA", contractValue: "$2.1B", subPlanValue: "$630M", deadline: "Jun 15, 2025", naics: "541511", status: "Active", match: 79, description: "IT modernization and cloud services. Small business teaming opportunities." },
  { id: "7", name: "SAIC (Science Applications International)", location: "Reston, VA", contractValue: "$750M", subPlanValue: "$225M", deadline: "Apr 22, 2025", naics: "541512", status: "Active", match: 77, description: "Systems engineering and integration. STEM workforce pipeline." },
  { id: "8", name: "CACI International", location: "Arlington, VA", contractValue: "$1.1B", subPlanValue: "$330M", deadline: "May 08, 2025", naics: "541511", status: "Active", match: 75, description: "Enterprise IT and mission support. HBCU internship programs." },
];

const AGENCIES = [
  "All DoD Agencies",
  "Department of the Army",
  "Department of the Navy",
  "Department of the Air Force",
  "Defense Advanced Research Projects Agency (DARPA)",
  "Missile Defense Agency (MDA)",
  "Defense Information Systems Agency (DISA)",
  "Department of Homeland Security",
  "Department of Energy (National Labs)",
];

const MIN_VALUES = [
  "$750K+ (FAR threshold)",
  "$1M+",
  "$5M+",
  "$10M+",
  "$25M+",
  "$50M+",
];

export default function SubPlanPage() {
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [agency, setAgency] = useState("All DoD Agencies");
  const [naics, setNaics] = useState("");
  const [minValue, setMinValue] = useState("$750K+ (FAR threshold)");
  const [keywords, setKeywords] = useState("");

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSearched(true);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* ─── BD INTEL Banner ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          BD INTEL
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>Subcontracting Plan Finder</strong> — DoD prime contracts over $750K require FAR 52.219-9 small business subcontracting plans. These are your warm leads.
        </span>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4">
        {/* ─── Left: Search Form ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5 h-fit">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
            Search Prime Contracts
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

          {/* NAICS Code */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">NAICS Code</label>
            <input
              type="text"
              value={naics}
              onChange={(e) => setNaics(e.target.value)}
              placeholder="e.g. 541519, 541715, 611430"
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
            />
          </div>

          {/* Minimum Contract Value */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Minimum Contract Value</label>
            <div className="relative">
              <select
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              >
                {MIN_VALUES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>

          {/* Capability Keywords */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Your Capability Keywords</label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={3}
              placeholder="cybersecurity, workforce training, AI/ML, STEM education..."
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] leading-relaxed resize-y"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full py-3 rounded-lg text-[13px] font-bold tracking-wide text-white transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: searching ? "#7A0019cc" : "#7A0019" }}
          >
            <Search className="h-4 w-4" />
            {searching ? "Searching..." : "Find Subcontracting Opportunities"}
          </button>
        </div>

        {/* ─── Right: Results Panel ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
              Prime Contractors with Active Sub Plans
            </div>
            {searched && (
              <span className="text-[11px] text-[#94a3b8]">
                {PRIME_CONTRACTORS.length} matches
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-[400px]">
            {!searched ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Building2 className="h-10 w-10 text-[#e2e8f0] mb-3" />
                <div className="text-[13px] font-semibold text-[#94a3b8]">
                  Configure your search criteria and click
                </div>
                <div className="text-[13px] font-semibold text-[#7A0019]">
                  "Find Subcontracting Opportunities"
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-3 max-w-sm">
                  We'll match your capabilities against active DoD prime contracts with approved subcontracting plans.
                </div>
              </div>
            ) : (
              <div className="max-h-[550px] overflow-y-auto">
                {PRIME_CONTRACTORS.map((prime, idx) => (
                  <div
                    key={prime.id}
                    className={cn(
                      "flex items-start gap-4 px-5 py-4 border-b border-[#f1f5f9] hover:bg-[#f8faff] transition-colors",
                      idx % 2 === 1 && "bg-[#fafafa]"
                    )}
                  >
                    {/* Logo placeholder */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#0f172a] truncate">{prime.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                          {prime.match}% Match
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{prime.location}</div>
                      <div className="text-[12px] text-[#334155] mt-2 leading-relaxed">{prime.description}</div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-[11px] text-[#64748b]">
                          <FileText className="h-3 w-3" /> NAICS: {prime.naics}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#64748b]">
                          <DollarSign className="h-3 w-3" /> {prime.contractValue} prime
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#047857] font-medium">
                          <CheckCircle className="h-3 w-3" /> {prime.subPlanValue} sub plan
                        </span>
                      </div>

                      {/* Deadline */}
                      <div className="text-[11px] text-[#b45309] mt-2 font-medium">
                        Response deadline: {prime.deadline}
                      </div>
                    </div>

                    {/* Action */}
                    <button className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 border border-[#1a56db] text-[#1a56db] rounded-lg hover:bg-[#eff6ff] transition-colors whitespace-nowrap">
                      View Details
                    </button>
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
