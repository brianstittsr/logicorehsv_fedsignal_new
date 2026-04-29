"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
type ProposalStatus = "won" | "lost" | "pending";

interface Proposal {
  id: string;
  solicitation: string;
  agency: string;
  value: string;
  valueNum: number;
  submitted: string;
  status: ProposalStatus;
  notes: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const PROPOSALS: Proposal[] = [
  { id: "1", solicitation: "NSA Cybersecurity BAA #2025-01", agency: "NSA", value: "$2.1M", valueNum: 2100000, submitted: "Mar 15, 2025", status: "won", notes: "First DoD prime in 3 years. Team of 8 faculty, 20 students." },
  { id: "2", solicitation: "NIH NIMHD R01 MH-2024-42", agency: "NIH", value: "$1.8M", valueNum: 1800000, submitted: "Feb 28, 2025", status: "won", notes: "Health equity research partnership with Howard." },
  { id: "3", solicitation: "DOD SBIR Phase I AF-2025-18", agency: "DOD", value: "$275K", valueNum: 275000, submitted: "Feb 10, 2025", status: "lost", notes: "Price competitiveness. Re-engaging for Phase II." },
  { id: "4", solicitation: "ONR BAA N00014-25-1-1234", agency: "ONR", value: "$3.2M", valueNum: 3200000, submitted: "Jan 22, 2025", status: "pending", notes: "Awaiting technical evaluation. Response to Q&A submitted." },
  { id: "5", solicitation: "NSF EHR Core Research", agency: "NSF", value: "$850K", valueNum: 850000, submitted: "Jan 15, 2025", status: "lost", notes: "Scored well but not funded. Trying again FY26." },
  { id: "6", solicitation: "Army REAP Award", agency: "Army", value: "$450K", valueNum: 450000, submitted: "Jan 08, 2025", status: "won", notes: "HBCU partnership highlight." },
  { id: "7", solicitation: "DARPA Young Faculty Award", agency: "DARPA", value: "$500K", valueNum: 500000, submitted: "Dec 20, 2024", status: "lost", notes: "Competitive pool. Faculty developing follow-on ideas." },
  { id: "8", solicitation: "DOE AI Research Award", agency: "DOE", value: "$1.2M", valueNum: 1200000, submitted: "Dec 15, 2024", status: "won", notes: "Energy sector AI application." },
  { id: "9", solicitation: "NIH SBIR HHS-2024-89", agency: "NIH", value: "$1.5M", valueNum: 1500000, submitted: "Dec 01, 2024", status: "pending", notes: "Phase II bridge funding request." },
  { id: "10", solicitation: "CDC Health Disparities", agency: "CDC", value: "$750K", valueNum: 750000, submitted: "Nov 18, 2024", status: "lost", notes: "Aligned with priorities but funding exhausted." },
  { id: "11", solicitation: "NASA HBCU Tech Transfer", agency: "NASA", value: "$1.1M", valueNum: 1100000, submitted: "Nov 05, 2024", status: "won", notes: "Space tech partnership with Marshall." },
  { id: "12", solicitation: "DHS S&T Cyber Research", agency: "DHS", value: "$900K", valueNum: 900000, submitted: "Oct 22, 2024", status: "pending", notes: "Awaiting final agency review." },
  { id: "13", solicitation: "USDA AFRI Education", agency: "USDA", value: "$400K", valueNum: 400000, submitted: "Oct 10, 2024", status: "lost", notes: "Scope mismatch. Pivoting to next BAA." },
  { id: "14", solicitation: "VA Research Merit Award", agency: "VA", value: "$650K", valueNum: 650000, submitted: "Sep 28, 2024", status: "won", notes: "Veteran health equity focus." },
  { id: "15", solicitation: "EPA SBIR 2024-E1", agency: "EPA", value: "$300K", valueNum: 300000, submitted: "Sep 15, 2024", status: "lost", notes: "Environmental monitoring proposal." },
  { id: "16", solicitation: "DOD CDMRP Breakthrough", agency: "DOD", value: "$2.5M", valueNum: 2500000, submitted: "Sep 01, 2024", status: "pending", notes: "Peer review stage." },
  { id: "17", solicitation: "NOAA Ocean Tech", agency: "NOAA", value: "$550K", valueNum: 550000, submitted: "Aug 20, 2024", status: "won", notes: "HBCU marine science collaboration." },
  { id: "18", solicitation: "FAA NextGen Research", agency: "FAA", value: "$800K", valueNum: 800000, submitted: "Aug 05, 2024", status: "lost", notes: "Aviation safety metrics." },
  { id: "19", solicitation: "NIST Cyber Framework", agency: "NIST", value: "$1.3M", valueNum: 1300000, submitted: "Jul 18, 2024", status: "won", notes: "HBCU cybersecurity center designation." },
  { id: "20", solicitation: "DOT SBIR 2024-D1", agency: "DOT", value: "$225K", valueNum: 225000, submitted: "Jul 01, 2024", status: "lost", notes: "Transportation infrastructure monitoring." },
  { id: "21", solicitation: "ED IR&D Partnership", agency: "ED", value: "$600K", valueNum: 600000, submitted: "Jun 15, 2024", status: "won", notes: "HBCU capacity building initiative." },
  { id: "22", solicitation: "AHRQ Health IT", agency: "HHS/AHRQ", value: "$1.0M", valueNum: 1000000, submitted: "Jun 01, 2024", status: "lost", notes: "Health informatics research." },
  { id: "23", solicitation: "DISA Cyber BAA", agency: "DISA", value: "$4.5M", valueNum: 4500000, submitted: "May 20, 2024", status: "pending", notes: "Multi-year enterprise contract. High priority." },
  { id: "24", solicitation: "State Dept Tech Export", agency: "State", value: "$350K", valueNum: 350000, submitted: "May 05, 2024", status: "lost", notes: "Export control training program." },
  { id: "25", solicitation: "NRO Advanced Research", agency: "NRO", value: "$5.0M", valueNum: 5000000, submitted: "Apr 15, 2024", status: "won", notes: "Space situational awareness — major win!" },
  { id: "26", solicitation: "GSA Schedule 70", agency: "GSA", value: "$0", valueNum: 0, submitted: "Apr 01, 2024", status: "won", notes: "IT schedule approval. Enables future sales." },
  { id: "27", solicitation: "SBA Growth Accelerator", agency: "SBA", value: "$150K", valueNum: 150000, submitted: "Mar 20, 2024", status: "lost", notes: "Startup ecosystem development." },
  { id: "28", solicitation: "CNIC Installation Support", agency: "Navy", value: "$3.8M", valueNum: 3800000, submitted: "Mar 10, 2024", status: "pending", notes: "Base operations support contract." },
  { id: "29", solicitation: "ARL Open Campus", agency: "Army", value: "$750K", valueNum: 750000, submitted: "Feb 28, 2024", status: "won", notes: "Research partnership agreement." },
  { id: "30", solicitation: "AFRL University Consortium", agency: "Air Force", value: "$1.9M", valueNum: 1900000, submitted: "Feb 15, 2024", status: "lost", notes: "Multi-university competition." },
  { id: "31", solicitation: "NIH SBIR Phase II", agency: "NIH", value: "$3.0M", valueNum: 3000000, submitted: "Jan 30, 2024", status: "won", notes: "Follow-on to successful Phase I." },
  { id: "32", solicitation: "NSF IUCRC Planning", agency: "NSF", value: "$125K", valueNum: 125000, submitted: "Jan 15, 2024", status: "won", notes: "Industry-university center planning grant." },
  { id: "33", solicitation: "DARPA Subterranean", agency: "DARPA", value: "$8.0M", valueNum: 8000000, submitted: "Dec 20, 2023", status: "lost", notes: "Highly competitive. Led by MIT." },
  { id: "34", solicitation: "DOJ NIJ Research", agency: "DOJ", value: "$450K", valueNum: 450000, submitted: "Dec 10, 2023", status: "pending", notes: "Criminal justice technology." },
  { id: "35", solicitation: "Treasury FinCEN", agency: "Treasury", value: "$1.1M", valueNum: 1100000, submitted: "Nov 30, 2023", status: "lost", notes: "Financial crimes detection." },
];

// ─── KPI Stats ──────────────────────────────────────────────────────────────────
const WINS = PROPOSALS.filter((p) => p.status === "won").length;
const LOSSES = PROPOSALS.filter((p) => p.status === "lost").length;
const PENDING = PROPOSALS.filter((p) => p.status === "pending").length;
const TOTAL = PROPOSALS.length;
const WIN_RATE = Math.round((WINS / (WINS + LOSSES)) * 100);
const TOTAL_VOLUME = PROPOSALS.reduce((sum, p) => sum + p.valueNum, 0);
const VOLUME_FORMATTED = "$" + (TOTAL_VOLUME / 1000000).toFixed(0) + "M";

const KPI_CARDS = [
  { label: "WINS", value: WINS, color: "text-[#047857]", bg: "bg-green-50", border: "border-green-200" },
  { label: "LOSS", value: LOSSES, color: "text-[#7A0019]", bg: "bg-[#fef2f2]", border: "border-[#fecaca]" },
  { label: "PENDING", value: PENDING, color: "text-[#b45309]", bg: "bg-amber-50", border: "border-amber-200" },
  { label: "WIN RATE", value: `${WIN_RATE}%`, color: "text-[#7A0019]", bg: "bg-[#fef2f2]", border: "border-[#fecaca]" },
  { label: "VOLUME", value: VOLUME_FORMATTED, color: "text-[#1a56db]", bg: "bg-blue-50", border: "border-blue-200" },
];

// ─── Trend Data (FY2023 → FY2025) ───────────────────────────────────────────────
const TREND_DATA = [
  { year: "FY23", winRate: 32, label: "32%" },
  { year: "FY24", winRate: 35, label: "35%" },
  { year: "YTD", winRate: 38, label: "38%" },
];

export default function WinLossPage() {
  const [filter, setFilter] = useState<"all" | ProposalStatus>("all");

  const filteredProposals = filter === "all"
    ? PROPOSALS
    : PROPOSALS.filter((p) => p.status === filter);

  const getStatusBadge = (status: ProposalStatus) => {
    const config = {
      won: { bg: "bg-green-500", text: "text-white", icon: TrendingUp, label: "WON" },
      lost: { bg: "bg-[#7A0019]", text: "text-white", icon: TrendingDown, label: "LOSS" },
      pending: { bg: "bg-amber-500", text: "text-white", icon: Minus, label: "PENDING" },
    };
    const c = config[status];
    const Icon = c.icon;
    return (
      <span className={cn("flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full", c.bg, c.text)}>
        <Icon className="h-3 w-3" /> {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Win / Loss Intelligence</h1>
          <p className="text-[12px] text-[#64748b] mt-0.5">
            Track every proposal submitted. Identify patterns. Close the gap between pipeline and capture rate.
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#6a0015] transition-colors">
          <Plus className="h-3.5 w-3.5" /> Log Proposal
        </button>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-5 gap-3">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "rounded-lg p-4 text-center border shadow-sm",
              kpi.bg,
              kpi.border
            )}
          >
            <div className={cn("text-[22px] font-extrabold", kpi.color)}>{kpi.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-[#64748b] mt-0.5">
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Win Rate Trend ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
            Win Rate Trend — FY2023 → FY2025
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#94a3b8]">Current:</span>
            <span className="text-[13px] font-bold text-[#047857]">{WIN_RATE}%</span>
          </div>
        </div>

        {/* Simple bar chart visualization */}
        <div className="flex items-end gap-8 h-32 px-4">
          {TREND_DATA.map((d, i) => (
            <div key={d.year} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[11px] font-bold text-[#334155]">{d.label}</div>
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  d.year === "YTD" ? "bg-[#047857]" : "bg-[#1a56db]/60"
                )}
                style={{ height: `${d.winRate * 2.5}px` }}
              />
              <div className="text-[10px] font-semibold text-[#64748b]">{d.year}</div>
            </div>
          ))}
        </div>

        {/* Trend line indicator */}
        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#047857]" />
            <span className="text-[11px] text-[#64748b]">YTD Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#1a56db]/60" />
            <span className="text-[11px] text-[#64748b]">Historical</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-[#047857]" />
            <span className="text-[12px] font-semibold text-[#047857]">+6 pts vs FY23</span>
          </div>
        </div>
      </div>

      {/* ─── Proposal History Table ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
            Proposal History
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-2 mt-3">
            {(["all", "won", "lost", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors",
                  filter === f
                    ? "bg-[#1a56db] text-white border-[#1a56db]"
                    : "bg-white text-[#64748b] border-[#e2e8f0] hover:bg-[#f8faff]"
                )}
              >
                {f === "all" ? "All Proposals" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <span className="text-[11px] text-[#94a3b8] ml-2">
              {filteredProposals.length} of {PROPOSALS.length} proposals
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e3a5f]">
                <th className="text-left text-[10px] font-bold uppercase tracking-wide text-white py-3 px-4">
                  Solicitation
                </th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wide text-white py-3 px-4">
                  Agency
                </th>
                <th className="text-right text-[10px] font-bold uppercase tracking-wide text-white py-3 px-4">
                  Value
                </th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wide text-white py-3 px-4">
                  Submitted
                </th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wide text-white py-3 px-4">
                  Status
                </th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wide text-white py-3 px-4">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((p, idx) => (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b border-[#f1f5f9] hover:bg-[#f8faff] transition-colors",
                    idx % 2 === 1 && "bg-[#fafafa]"
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="text-[12px] font-semibold text-[#0f172a]">{p.solicitation}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] text-[#334155]">{p.agency}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[12px] font-semibold text-[#0f172a]">{p.value}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] text-[#64748b]">{p.submitted}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[12px] text-[#64748b] truncate max-w-[200px] block" title={p.notes}>
                      {p.notes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProposals.length === 0 && (
          <div className="py-12 text-center text-[#94a3b8] text-[13px]">
            No proposals match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
