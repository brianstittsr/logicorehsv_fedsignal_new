"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Info, ChevronDown } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const FA_BASE_OPTIONS = [
  "MTDC (Modified Total Direct Costs) — Most Common",
  "TDC (Total Direct Costs)",
  "S&W (Salaries & Wages only)",
  "Other — Specify",
];

const PEER_RATES = [
  { name: "Howard University", rate: 58, color: "#1a56db" },
  { name: "Tuskegee University", rate: 52, color: "#7A0019" },
  { name: "NC A&T State", rate: 50, color: "#047857" },
  { name: "Florida A&M", rate: 48, color: "#b45309" },
  { name: "Alabama A&M", rate: 46, color: "#64748b" },
];

export default function FAndAPage() {
  const [faRate, setFaRate] = useState("52");
  const [faBase, setFaBase] = useState("MTDC (Modified Total Direct Costs) — Most Common");
  const [personnel, setPersonnel] = useState("");
  const [travel, setTravel] = useState("");
  const [equipment, setEquipment] = useState("");
  const [supplies, setSupplies] = useState("");
  const [subcontracts, setSubcontracts] = useState("");
  const [duration, setDuration] = useState("3");

  const calculations = useMemo(() => {
    const rate = parseFloat(faRate) || 0;
    const personnelNum = parseFloat(personnel) || 0;
    const travelNum = parseFloat(travel) || 0;
    const equipmentNum = parseFloat(equipment) || 0;
    const suppliesNum = parseFloat(supplies) || 0;
    const subcontractsNum = parseFloat(subcontracts) || 0;

    // MTDC excludes equipment and subcontracts over $25K (first $25K included)
    const subcontractsMtdc = Math.min(subcontractsNum, 25000);
    const mtdc = personnelNum + travelNum + suppliesNum + subcontractsMtdc;
    const fanda = mtdc * (rate / 100);
    const totalDirect = personnelNum + travelNum + equipmentNum + suppliesNum + subcontractsNum;
    const total = totalDirect + fanda;

    return {
      mtdc,
      fanda,
      totalDirect,
      total,
      rate,
    };
  }, [faRate, personnel, travel, equipment, supplies, subcontracts]);

  const hasInputs = personnel || travel || equipment || supplies || subcontracts;

  return (
    <div className="space-y-4">
      {/* ─── RESEARCH TOOL Banner ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          RESEARCH TOOL
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>F&A Rate Calculator</strong> — Facilities & Administrative costs are the #1 budget error in HBCU federal proposals. Calculate exact indirect costs, direct costs, and total project budget instantly.
        </span>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ─── Left: Budget Inputs ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
            Budget Inputs
          </div>

          {/* Institution F&A Rate */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">
              Institution F&A Rate (Negotiated)
            </label>
            <div className="relative">
              <input
                type="number"
                value={faRate}
                onChange={(e) => setFaRate(e.target.value)}
                className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#64748b]">%</span>
            </div>
            <p className="text-[10px] text-[#94a3b8] mt-1">
              Tuskegee negotiated rate: 52% MTDC • Howard: 58% • FAMU: 48%
            </p>
          </div>

          {/* F&A Base */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">F&A Base</label>
            <div className="relative">
              <select
                value={faBase}
                onChange={(e) => setFaBase(e.target.value)}
                className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              >
                {FA_BASE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>

          {/* Personnel */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Personnel (Salaries + Fringe)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#94a3b8]">$</span>
              <input
                type="number"
                value={personnel}
                onChange={(e) => setPersonnel(e.target.value)}
                placeholder="e.g. 250000"
                className="w-full pl-6 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
              />
            </div>
          </div>

          {/* Travel */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Travel</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#94a3b8]">$</span>
              <input
                type="number"
                value={travel}
                onChange={(e) => setTravel(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full pl-6 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
              />
            </div>
          </div>

          {/* Equipment */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">
              Equipment (Excluded from MTDC)
              <Info className="inline h-3 w-3 ml-1 text-[#94a3b8]" />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#94a3b8]">$</span>
              <input
                type="number"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full pl-6 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
              />
            </div>
          </div>

          {/* Supplies & Other Direct */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Supplies & Other Direct</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#94a3b8]">$</span>
              <input
                type="number"
                value={supplies}
                onChange={(e) => setSupplies(e.target.value)}
                placeholder="e.g. 20000"
                className="w-full pl-6 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
              />
            </div>
          </div>

          {/* Subcontracts */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">
              Subcontracts (first $25K included in MTDC)
              <Info className="inline h-3 w-3 ml-1 text-[#94a3b8]" />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#94a3b8]">$</span>
              <input
                type="number"
                value={subcontracts}
                onChange={(e) => setSubcontracts(e.target.value)}
                placeholder="e.g. 75000"
                className="w-full pl-6 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
              />
            </div>
          </div>

          {/* Project Duration */}
          <div className="mb-2">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Project Duration (Years)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3"
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
            />
          </div>
        </div>

        {/* ─── Right Column: Budget Calculation + Peer Comparison ─── */}
        <div className="space-y-4">
          {/* Budget Calculation */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
                Budget Calculation
              </div>
            </div>
            <div className="p-5">
              {!hasInputs ? (
                <p className="text-[12px] text-[#94a3b8]">
                  Enter budget values above to see real-time F&A calculation.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#64748b]">Modified Total Direct Costs (MTDC)</span>
                    <span className="font-semibold text-[#0f172a]">${calculations.mtdc.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#64748b]">F&A Costs ({calculations.rate}%)</span>
                    <span className="font-semibold text-[#0f172a]">${calculations.fanda.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#64748b]">Total Direct Costs</span>
                    <span className="font-semibold text-[#0f172a]">${calculations.totalDirect.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#0f172a]">Total Project Cost</span>
                    <span className="text-[16px] font-extrabold text-[#047857]">${calculations.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Peer Comparison - F&A Rates */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
                Peer Comparison — F&A Rates
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {PEER_RATES.map((peer) => (
                  <div key={peer.name} className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-[#334155] w-28 truncate">{peer.name}</span>
                    <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(peer.rate / 70) * 100}%`, backgroundColor: peer.color }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#64748b] w-6 text-right">{peer.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
