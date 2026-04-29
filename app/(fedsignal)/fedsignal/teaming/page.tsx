"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, FileText } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Your Info", complete: true },
  { id: 2, label: "Partner Info", complete: false, active: true },
  { id: 3, label: "Opportunity", complete: false },
  { id: 4, label: "Terms", complete: false },
  { id: 5, label: "Generate", complete: false },
];

const DOCUMENT_TYPES = [
  "Teaming Agreement + NDA (Combined)",
  "Teaming Agreement Only",
  "NDA Only",
  "Mutual NDA",
  "One-Way NDA (Disclosing)",
  "One-Way NDA (Receiving)",
];

const ROLES = [
  "Subcontractor to Prime",
  "Prime with Subcontractor",
  "Joint Venture Partner",
  "Mentor-Protégé (Large)",
  "Mentor-Protégé (Small)",
];

const DURATIONS = [
  "Through proposal submission only",
  "Through contract award",
  "1 Year from execution",
  "3 Years from execution",
  "5 Years from execution",
  "Perpetual",
];

const GENERATED_SECTIONS = [
  "Restate and Purpose clause",
  "Exclusive teaming commitment language",
  "Work share allocation and responsibilities",
  "IP and proprietary information protections",
  "Non-solicitation and exclusivity provisions",
  "Governing law (typically Maryland or Virginia for federal work)",
  "Signature blocks",
];

export default function TeamingPage() {
  const [step, setStep] = useState(2);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [formData, setFormData] = useState({
    documentType: "Teaming Agreement + NDA (Combined)",
    institution: "Tuskegee University",
    partner: "",
    role: "Subcontractor to Prime",
    solicitation: "",
    workShare: "",
    duration: "Through proposal submission only",
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setStep(5);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* ─── WIN TOOL Banner ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
        <span className="bg-[#b45309] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          WIN TOOL
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>Teaming Agreement Generator</strong> — Generate NDA + Teaming Agreement boilerplate in under 60 seconds. Clause-powered, attorney-review-ready.
        </span>
      </div>

      {/* ─── Step Wizard ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-4">
        <div className="flex items-center">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              {/* Step indicator */}
              <div
                onClick={() => s.complete && setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all flex-1 justify-center",
                  s.id === step
                    ? "bg-[#7A0019] text-white"
                    : s.complete
                    ? "bg-green-50 text-green-700"
                    : "bg-[#f1f5f9] text-[#94a3b8]"
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold",
                    s.id === step
                      ? "bg-white/20"
                      : s.complete
                      ? "bg-green-500 text-white"
                      : "bg-[#cbd5e1] text-white"
                  )}
                >
                  {s.complete ? <Check className="h-3 w-3" /> : s.id}
                </span>
                <span className="text-[12px] font-semibold hidden sm:inline">{s.label}</span>
              </div>
              {/* Arrow connector (except last) */}
              {idx < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-[#cbd5e1] mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ─── Left: Agreement Configuration ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
            Agreement Configuration
          </div>

          {/* Document Type */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Document Type</label>
            <div className="relative">
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-3.5 w-3.5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Your Institution */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Your Institution (Prime / Sub)</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
            />
          </div>

          {/* Teaming Partner */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Teaming Partner</label>
            <input
              type="text"
              value={formData.partner}
              onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
              placeholder="e.g. Booz Allen Hamilton, Leidos, SAIC..."
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
            />
          </div>

          {/* Your Role */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Your Role</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-3.5 w-3.5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Solicitation / Opportunity */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Solicitation / Opportunity</label>
            <input
              type="text"
              value={formData.solicitation}
              onChange={(e) => setFormData({ ...formData, solicitation: e.target.value })}
              placeholder="e.g. DARPA-PA-25-01 or ONR BAA 2025"
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
            />
          </div>

          {/* Your Work Share % */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Your Work Share %</label>
            <input
              type="text"
              value={formData.workShare}
              onChange={(e) => setFormData({ ...formData, workShare: e.target.value })}
              placeholder="e.g. 35"
              className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
            />
          </div>

          {/* Agreement Duration */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">Agreement Duration</label>
            <div className="relative">
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-3.5 w-3.5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3 rounded-lg text-[13px] font-bold tracking-wide text-white transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: generating ? "#7A0019cc" : "#7A0019" }}
          >
            <FileText className="h-4 w-4" />
            {generating ? "Generating..." : "Generate Agreement"}
          </button>
        </div>

        {/* ─── Right: Generated Document ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
              Generated Document
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 min-h-[400px]">
            {!generated ? (
              <div className="h-full flex flex-col">
                <p className="text-[12px] text-[#94a3b8] mb-4">
                  Configure the agreement above and click Generate.
                </p>
                <p className="text-[11px] text-[#94a3b8] mb-3">
                  Generate complete documents including:
                </p>
                <ul className="space-y-2">
                  {GENERATED_SECTIONS.map((section, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-[#64748b]">
                      <span className="text-[#cbd5e1]">-</span>
                      <span>{section}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#f8faff] border border-[#e2e8f0] rounded-lg p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-2">
                    {formData.documentType}
                  </div>
                  <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">
                    Between {formData.institution} and {formData.partner || "[Partner Name]"}
                  </h3>
                  <div className="text-[12px] text-[#334155] leading-relaxed space-y-2">
                    <p><strong>RECITALS</strong></p>
                    <p>WHEREAS, {formData.institution} and {formData.partner || "_________________"} (collectively, the "Parties") desire to enter into a teaming arrangement to pursue the {formData.solicitation || "[Solicitation]"} opportunity;</p>
                    <p><strong>PURPOSE</strong></p>
                    <p>The purpose of this Agreement is to establish the terms and conditions under which the Parties will cooperate to prepare and submit a proposal, and if awarded, perform the contract as a team.</p>
                    <p><strong>TEAMING ARRANGEMENT</strong></p>
                    <p>Role: {formData.role}<br />
                    Work Share: {formData.workShare || "___"}%<br />
                    Duration: {formData.duration}</p>
                    <p><strong>EXCLUSIVITY</strong></p>
                    <p>During the term of this Agreement, neither Party shall pursue the {formData.solicitation || "[Solicitation]"} opportunity with any other party without prior written consent.</p>
                    <p><strong>INTELLECTUAL PROPERTY</strong></p>
                    <p>Each Party retains all rights to their pre-existing intellectual property. Jointly developed IP shall be owned as specified in the resulting subcontract.</p>
                    <p><strong>SIGNATURES</strong></p>
                    <p className="mt-4">_________________________________<br />
                    {formData.institution}<br />
                    Date: _______________</p>
                    <p className="mt-3">_________________________________<br />
                    {formData.partner || "_________________"}<br />
                    Date: _______________</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons when generated */}
          {generated && (
            <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-2">
              <button className="flex-1 text-[12px] font-bold py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors flex items-center justify-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Download PDF
              </button>
              <button className="flex-1 text-[12px] font-bold py-2 border border-[#e2e8f0] rounded-lg text-[#334155] hover:bg-[#f8faff] transition-colors flex items-center justify-center gap-1.5">
                Copy Text
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
