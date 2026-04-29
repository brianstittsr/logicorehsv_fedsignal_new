"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Crown, CheckCircle, TrendingUp, Award, FileText, AlertCircle,
  Users, Briefcase, GraduationCap, Building2, Shield, Zap,
  ExternalLink, ChevronRight, Star, BarChart3, Globe, Target
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const QUARTERS = [
  {
    id: "q1",
    label: "Q1 • JANUARY",
    title: "Federal Budget Intelligence",
    description: "Presidential budget request analysis. What the President's budget means for your institution.",
    features: [
      { icon: Award, label: "HBCU Ranking Update", desc: "Your institution ranked among 101 HBCUs with YoY movement" },
      { icon: FileText, label: "Legislative Intelligence", desc: "HBCU-IU, STEM appropriations, DOE authorization highlights" },
      { icon: AlertCircle, label: "Signal Alerts", desc: "Major NIH or NSF policy shifts reviewed within 48 hours" },
    ],
  },
  {
    id: "q2",
    label: "Q2 • APRIL",
    title: "HBCU Competitive Landscape",
    description: "Peer win/loss analysis, emerging threats. Your institution position vs. Top 25.",
    features: [
      { icon: TrendingUp, label: "Board-Ready Talking Points", desc: "3 data-backed statements for your next trustee meeting" },
      { icon: Briefcase, label: "Executive Events Calendar", desc: "HBCU Week, NAFEO, OASIS, AI4HBCU, Thurgood Marshall Fund" },
      { icon: BarChart3, label: "Peer Comparison Data", desc: "Howard, FAMU, NC A&T, AAMU win rates and award volumes" },
    ],
  },
  {
    id: "q3",
    label: "Q3 • JULY",
    title: "DoD Priorities Brief",
    description: "Defense budget, major commands, new programs. Acquisition officer HBCU opportunity windows.",
    features: [
      { icon: Shield, label: "AFWERX & SBIR Updates", desc: "Air Force innovation unit funding cycles" },
      { icon: Target, label: "Command-level Intel", desc: "ARCYBER, AFRL, ONR research priorities" },
      { icon: Zap, label: "Contractor Teaming Intel", desc: "Prime contractors seeking HBCU partners" },
    ],
  },
  {
    id: "q4",
    label: "Q4 • OCTOBER",
    title: "Annual Planning Edition",
    description: "End-of-year intel, NIH/NSF board talking points, FY1-6 strategy briefing.",
    features: [
      { icon: FileText, label: "Annual Report Summary", desc: "Consolidated year-over-year performance metrics" },
      { icon: Globe, label: "National Lab Partnerships", desc: "ORNL, SRNL, other lab engagement opportunities" },
      { icon: Star, label: "Strategic Priorities", desc: "Board-level recommendations for upcoming fiscal year" },
    ],
  },
];

const RECIPIENTS = [
  { id: "president", label: "University President", sublabel: "Primary recipient • Board meeting prep • Peer benchmarking", seat: "SEAT 1", color: "blue" },
  { id: "vp", label: "VP Research / Sponsored Programs", sublabel: "Grant pipeline • Compliance tracking", seat: "SEAT 2", color: "green" },
  { id: "general", label: "General Counsel / CFO", sublabel: "Legislative + compliance news", seat: "SEAT 3", color: "amber" },
  { id: "chief", label: "Chief of Staff / Board Liaison", sublabel: "Briefing distribution • scheduling", seat: "SEAT 4", color: "purple" },
];

const BENEFITS = [
  {
    id: "competition",
    title: "Peer Competition Is Real",
    description: "HBCU students actively benchmark against Howard, FAMU, and NC A&T. A quarterly report with YoY movement is a must-read before every board meeting.",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    id: "readiness",
    title: "Board Readiness Is The Hook",
    description: '"Three things your board should know this quarter" — on the cover page. Presidents sign for that single deliverable. Everything else is supporting context.',
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  {
    id: "discretionary",
    title: "$500/Month From Discretionary Budget",
    description: "Research Offices are cost centers. The President's office has discretionary authority. $500/month is a catered lunch meeting. The annual $4,800 strategic subscription is a line item yet.",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
];

export default function PresidentBriefPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[18px] font-bold text-[#0f172a]">President's Intelligence Brief</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded">ADD-ON</span>
          </div>
          <p className="text-[12px] text-[#64748b] max-w-2xl">
            Quarterly Defense Signals intelligence report — delivered directly to your President and designated leadership. 
            DoD priorities, HBCU competitive rankings, legislative outlook, and board-ready talking points — four times per year.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-md hover:bg-[#f8faff]">
          <FileText className="h-3.5 w-3.5" />
          View Sample Brief
        </button>
      </div>

      {/* ─── Main Blue Card ─── */}
      <div className="bg-gradient-to-br from-[#1e3a5f] via-[#0f2744] to-[#0a1c33] rounded-xl p-6 text-white">
        {/* Card Header */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-[10px] font-bold tracking-wider text-blue-300 uppercase">
            DEFENSE SIGNALS INTELLIGENCE — EXCLUSIVE ADD-ON
          </span>
        </div>

        <h2 className="text-[20px] font-bold mb-2">The President's Brief</h2>
        <p className="text-[12px] text-blue-200 mb-6 max-w-2xl">
          The same intelligence FedSignal delivers to the nation's top defense contractors — reframed for HBCU executive leadership. 
          Four strategic reports per year that make your president the most informed person in the room.
        </p>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-extrabold text-white">$4,800</span>
            <span className="text-[14px] text-blue-300">/year</span>
          </div>
          <p className="text-[11px] text-blue-300">
            Add to any FedSignal plan • $400/month equivalent • Covers President + 3 designated seats • 
            Delivered as branded PDF • <span className="text-green-400 font-semibold">Email</span>
          </p>
        </div>

        {/* Quarterly Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {QUARTERS.map((quarter) => (
            <div 
              key={quarter.id} 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="text-[9px] font-bold tracking-wider text-blue-300 mb-2 uppercase">
                {quarter.label}
              </div>
              <h3 className="text-[12px] font-bold text-white mb-1">{quarter.title}</h3>
              <p className="text-[10px] text-blue-200 leading-relaxed">{quarter.description}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {QUARTERS[0].features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex items-start gap-2">
                <Icon className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-white">{feature.label}</div>
                  <div className="text-[10px] text-blue-300">{feature.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-[13px] font-bold rounded-lg transition-colors">
            <Crown className="h-4 w-4" />
            Add President's Brief — $4,800/yr
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium text-blue-300 hover:text-white transition-colors">
            <FileText className="h-4 w-4" />
            View Sample Issue
          </button>
        </div>
      </div>

      {/* ─── Bottom Section: Recipients & Benefits ─── */}
      <div className="grid grid-cols-[1fr_380px] gap-4">
        {/* Who Receives The Brief */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#1a56db]" />
              <span className="text-[12px] font-bold tracking-wide text-[#0f172a] uppercase">
                Who Receives The Brief
              </span>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {RECIPIENTS.map((recipient) => (
              <div 
                key={recipient.id} 
                className="flex items-center justify-between p-3 bg-[#f8faff] rounded-lg border border-[#e2e8f0]"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    recipient.color === "blue" && "bg-blue-100",
                    recipient.color === "green" && "bg-green-100",
                    recipient.color === "amber" && "bg-amber-100",
                    recipient.color === "purple" && "bg-purple-100",
                  )}>
                    {recipient.id === "president" && <Crown className="h-4 w-4 text-blue-600" />}
                    {recipient.id === "vp" && <GraduationCap className="h-4 w-4 text-green-600" />}
                    {recipient.id === "general" && <Shield className="h-4 w-4 text-amber-600" />}
                    {recipient.id === "chief" && <Building2 className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-[#0f172a]">{recipient.label}</div>
                    <div className="text-[10px] text-[#64748b]">{recipient.sublabel}</div>
                  </div>
                </div>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-1 rounded",
                  recipient.color === "blue" && "bg-blue-100 text-blue-700",
                  recipient.color === "green" && "bg-green-100 text-green-700",
                  recipient.color === "amber" && "bg-amber-100 text-amber-700",
                  recipient.color === "purple" && "bg-purple-100 text-purple-700",
                )}>
                  {recipient.seat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Presidents Pay For This */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              <span className="text-[12px] font-bold tracking-wide text-[#0f172a] uppercase">
                Why Presidents Pay For This
              </span>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {BENEFITS.map((benefit) => (
              <div 
                key={benefit.id} 
                className={cn("p-3 rounded-lg border", benefit.color)}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle className={cn("h-4 w-4 flex-shrink-0 mt-0.5", benefit.iconColor)} />
                  <div>
                    <h4 className="text-[11px] font-bold text-[#0f172a] mb-1">{benefit.title}</h4>
                    <p className="text-[10px] text-[#64748b] leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
