"use client";

import { cn } from "@/lib/utils";
import { Landmark, Clock, FileCheck, AlertCircle, DollarSign, Calendar, ExternalLink } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const GRANTS = [
  { id: "1", title: "NSF HBCU-UP Research Grant", agency: "National Science Foundation", amount: "$750,000", deadline: "2025-06-15", status: "Active", type: "Research", pi: "Dr. Patricia Williams" },
  { id: "2", title: "NIH NIMHD R01 Award", agency: "NIH", amount: "$2.1M", deadline: "2025-09-30", status: "Active", type: "Research", pi: "Dr. Kwame Asante" },
  { id: "3", title: "DoD STEM Education Grant", agency: "Department of Defense", amount: "$500,000", deadline: "2025-05-20", status: "Pending", type: "Education", pi: "Dr. Robert Taylor" },
  { id: "4", title: "NASA MUREP Aerospace Grant", agency: "NASA", amount: "$1.2M", deadline: "2025-08-01", status: "Active", type: "Research", pi: "Dr. Marcus Johnson" },
  { id: "5", title: "DOE Cybersecurity Workforce", agency: "Department of Energy", amount: "$400,000", deadline: "2025-04-30", status: "Closing Soon", type: "Workforce", pi: "Dr. Aisha Johnson" },
  { id: "6", title: "USDA NIFA AFRI Education", agency: "USDA", amount: "$650,000", deadline: "2025-07-15", status: "Active", type: "Education", pi: "Dr. James Wilson" },
  { id: "7", title: "ONR HBCU Research Program", agency: "Office of Naval Research", amount: "$1.8M", deadline: "2025-10-01", status: "Draft", type: "Research", pi: "Dr. Angela Foster" },
  { id: "8", title: "EPA SBIR Phase I", agency: "EPA", amount: "$275,000", deadline: "2025-05-15", status: "Submitted", type: "Innovation", pi: "Dr. Thomas Reed" },
];

const KPI_STATS = [
  { label: "Active Grants", value: 12, color: "text-[#047857]", icon: FileCheck },
  { label: "Pending Review", value: 8, color: "text-[#b45309]", icon: Clock },
  { label: "Closing Soon", value: 3, color: "text-[#7A0019]", icon: AlertCircle },
  { label: "Total Portfolio", value: "$12.8M", color: "text-[#1a56db]", icon: DollarSign },
];

export default function GrantsPage() {
  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[#1a56db]" />
            Grant Tracker
          </h1>
          <p className="text-[12px] text-[#64748b] mt-0.5">
            Tuskegee University — FedSignal Intelligence Platform
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> Grants.gov
        </button>
      </div>

      {/* ─── Green Accent Line ─── */}
      <div className="h-0.5 bg-[#047857] rounded-full" />

      {/* ─── Main Content Card ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
            Grant Tracker — FY2025
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="px-5 py-8 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3">
              <Landmark className="h-6 w-6 text-[#94a3b8]" />
            </div>
            <p className="text-[13px] text-[#64748b] max-w-md leading-relaxed">
              Grant tracking module — coming in next build iteration. Includes Grants.gov integration, F&A rate tracking, program officer contacts, and renewal management.
            </p>
          </div>
        </div>

        {/* Preview Stats */}
        <div className="px-5 py-4 border-t border-[#f1f5f9] bg-[#fafafa]">
          <div className="grid grid-cols-4 gap-4">
            {KPI_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className={cn("text-[18px] font-bold", stat.color)}>{stat.value}</div>
                  <div className="text-[10px] text-[#64748b] uppercase tracking-wide font-medium mt-0.5 flex items-center justify-center gap-1">
                    <Icon className="h-3 w-3" /> {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Grant List */}
        <div className="border-t border-[#f1f5f9]">
          <div className="px-5 py-3 bg-[#1e3a5f]">
            <div className="text-[10px] font-bold uppercase tracking-wide text-white">Active Grants Preview</div>
          </div>
          <div className="max-h-[280px] overflow-y-auto">
            {GRANTS.map((grant, idx) => (
              <div
                key={grant.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3 border-b border-[#f1f5f9] hover:bg-[#f8faff] transition-colors",
                  idx % 2 === 1 && "bg-[#fafafa]"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#0f172a] truncate">{grant.title}</div>
                  <div className="text-[11px] text-[#64748b] truncate">{grant.agency} • PI: {grant.pi}</div>
                </div>
                <div className="text-[12px] font-semibold text-[#334155] whitespace-nowrap">{grant.amount}</div>
                <div className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap",
                  grant.status === "Active" ? "bg-green-100 text-green-700" :
                  grant.status === "Pending" ? "bg-amber-100 text-amber-700" :
                  grant.status === "Closing Soon" ? "bg-red-100 text-red-700" :
                  grant.status === "Submitted" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                )}>
                  {grant.status}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] whitespace-nowrap">
                  <Calendar className="h-3 w-3" />
                  {grant.deadline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
