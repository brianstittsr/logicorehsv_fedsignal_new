"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Star, ArrowRight, Crown, Zap, Building2 } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "research",
    name: "Research",
    subtitle: "Sponsored Programs Office",
    price: "$9,600",
    period: "/year",
    subtext: "$800/month • Billed annually",
    popular: false,
    features: [
      "Live Opportunity Feed (SAM.gov + Grants.gov)",
      "AI Proposal Pal (Shipley-based)",
      "RFI Creator",
      "Capability Vault",
      "SBIR/STTR Match Engine",
      "F&A Rate Calculator",
      "HBCU Scoreboard (read-only)",
      "3 User seats",
    ],
    cta: "Get Started",
    ctaStyle: "outline",
  },
  {
    id: "growth",
    name: "Growth",
    subtitle: "VP Research + BD Team",
    price: "$14,400",
    period: "/year",
    subtext: "$1,200/month • Billed annually",
    popular: true,
    features: [
      "Everything in Research",
      "CRM & Contact Management",
      "Win/Loss Tracker",
      "Newsletter Builder (Resend)",
      "Content Studio + Calendar",
      "Subcontracting Plan Finder",
      "Full Scoreboard + Peer Intel",
      "8 User seats",
    ],
    cta: "Get Started",
    ctaStyle: "solid",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "Institution-Wide",
    price: "$18,000",
    period: "/year",
    subtext: "$1,500/month • Billed annually",
    popular: false,
    features: [
      "Everything in Growth",
      "Gamma Deck Generator",
      "Teaming Agreement Generator",
      "Board Report Module",
      "White-glove onboarding",
      "Quarterly strategy call",
      "Unlimited user seats",
      "Custom NAICS + capability mapping",
    ],
    cta: "Contact Sales",
    ctaStyle: "outline",
  },
];

const PRESIDENT_BRIEF_ADDON = {
  title: "President's Brief Add-On",
  badge: "ANY PLAN",
  price: "$4,800",
  period: "/year",
  subtext: "$400/month • Covers 4 leaders",
  description: "Quarterly Defense Signals intelligence report delivered to your President. HBCU rankings, DoD priorities, board-ready talking points. The briefing that makes your president the best-prepared in the room.",
};

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="text-center">
        <h1 className="text-[24px] font-bold text-[#0f172a] mb-2">FedSignal Plans & Pricing</h1>
        <p className="text-[13px] text-[#64748b]">
          Federal contracting intelligence scaled for every budget. From Sponsored Programs offices to university presidents.
        </p>
      </div>

      {/* ─── Pricing Cards ─── */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative bg-white rounded-xl border p-5 flex flex-col",
              plan.popular 
                ? "border-[#1a56db] shadow-lg ring-1 ring-[#1a56db]/10" 
                : "border-[#e2e8f0] shadow-sm"
            )}
          >
            {/* Most Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#1a56db] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {plan.id === "research" && <Zap className="h-4 w-4 text-blue-500" />}
                {plan.id === "growth" && <Star className="h-4 w-4 text-[#1a56db]" />}
                {plan.id === "enterprise" && <Building2 className="h-4 w-4 text-purple-500" />}
                <h3 className="text-[14px] font-bold text-[#0f172a]">{plan.name}</h3>
              </div>
              <p className="text-[11px] text-[#64748b]">{plan.subtitle}</p>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-extrabold text-[#0f172a]">{plan.price}</span>
                <span className="text-[12px] text-[#64748b]">{plan.period}</span>
              </div>
              <p className="text-[10px] text-[#94a3b8]">{plan.subtext}</p>
            </div>

            {/* Features */}
            <div className="flex-1 space-y-2 mb-5">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-[#334155]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className={cn(
                "w-full py-2.5 rounded-lg text-[12px] font-semibold transition-colors",
                plan.ctaStyle === "solid"
                  ? "bg-[#1a56db] text-white hover:bg-[#1a56db]/90"
                  : "border border-[#1a56db] text-[#1a56db] hover:bg-[#eff6ff]"
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* ─── President's Brief Add-On ─── */}
      <div className="bg-gradient-to-br from-[#1e3a5f] via-[#0f2744] to-[#0a1c33] rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <h3 className="text-[14px] font-bold">{PRESIDENT_BRIEF_ADDON.title}</h3>
              <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-400/30 text-blue-200 rounded uppercase">
                {PRESIDENT_BRIEF_ADDON.badge}
              </span>
            </div>
            <p className="text-[12px] text-blue-200 max-w-2xl leading-relaxed">
              {PRESIDENT_BRIEF_ADDON.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-6">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-[28px] font-extrabold text-white">{PRESIDENT_BRIEF_ADDON.price}</span>
              <span className="text-[12px] text-blue-300">{PRESIDENT_BRIEF_ADDON.period}</span>
            </div>
            <p className="text-[10px] text-blue-300 mb-3">{PRESIDENT_BRIEF_ADDON.subtext}</p>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 ml-auto">
              Learn More
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Footer Note ─── */}
      <div className="text-center">
        <p className="text-[11px] text-[#94a3b8]">
          <strong>GovWin IQ</strong> (market leader) charges $15,000-$40,000/year per user for federal contracting intelligence with <em>no</em> HBCU-specific features.{" "}
          <strong>FedSignal</strong> delivers HBCU-targeted intelligence at institutional pricing — purpose-built for the 101 HBCUs competing for $100B in federal contracts annually.
        </p>
      </div>
    </div>
  );
}
