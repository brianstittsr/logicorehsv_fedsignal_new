"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Upload, Database, Zap, CheckCircle } from "lucide-react";

// ── Wizard steps ─────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: "Solicitation Received" },
  { num: 2, label: "AI Analysis & Shredding" },
  { num: 3, label: "Win Theme Development" },
  { num: 4, label: "Section Writing (RFI Creator)" },
  { num: 5, label: "Review & Submit" },
];

// ── Analysis result bullets ───────────────────────────────────────────────────
const resultBullets = [
  "Win themes aligned to your capabilities",
  "Compliance matrix (SHALL / WILL / MUST)",
  "Section-by-section outline with writer guidance",
  "Key discriminators vs. likely competitors",
  "Bid / No-Bid recommendation with rationale",
];

// ── Field label wrapper ───────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#64748b] mb-1">
      {children}
    </label>
  );
}

export default function ProposalPalPage() {
  const [activeStep, setActiveStep] = useState(2); // step 2 active per screenshot
  const [institution, setInstitution] = useState("Tuskegee University");
  const [analysisType, setAnalysisType] = useState("full");
  const [solType, setSolType] = useState("rfp");
  const [solText, setSolText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!solText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      setActiveStep(3);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* WIN TOOL Banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          ⚡ WIN TOOL
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>Proposal Pal</strong> — Paste any RFP/SOW and get win themes, compliance matrix, section outlines, and discriminators instantly. Powered by Claude AI.
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ── Left: Configure + Workflow ── */}
        <div className="space-y-4">
          {/* Configure Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
              1. Configure Your Response
            </div>

            {/* Institution */}
            <div className="mb-3">
              <FieldLabel>Institution / Offeror Name</FieldLabel>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
              />
            </div>

            {/* Analysis Type */}
            <div className="mb-3">
              <FieldLabel>Analysis Type</FieldLabel>
              <div className="relative">
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full appearance-none px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                >
                  <option value="full">Full Analysis — Win Themes + Compliance + Outline</option>
                  <option value="compliance">Compliance Matrix Only</option>
                  <option value="themes">Win Themes Only</option>
                  <option value="bidnobid">Bid / No-Bid Assessment</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            {/* Solicitation Type */}
            <div className="mb-3">
              <FieldLabel>Solicitation Type</FieldLabel>
              <div className="relative">
                <select
                  value={solType}
                  onChange={(e) => setSolType(e.target.value)}
                  className="w-full appearance-none px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                >
                  <option value="rfp">RFP — Request for Proposal</option>
                  <option value="rfq">RFQ — Request for Quotation</option>
                  <option value="rfi">RFI — Request for Information</option>
                  <option value="baa">BAA — Broad Agency Announcement</option>
                  <option value="sbir">SBIR / STTR</option>
                  <option value="sow">SOW — Statement of Work</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            {/* Upload row */}
            <div className="mb-3">
              <FieldLabel>Upload or Pull Solicitation</FieldLabel>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  Upload PDF / DOCX / TXT
                </button>
                <button className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors">
                  <Database className="h-3.5 w-3.5" />
                  Pull from Capability Vault
                </button>
              </div>
            </div>

            {/* Solicitation Text */}
            <div className="mb-4">
              <FieldLabel>RFP / Solicitation Text</FieldLabel>
              <textarea
                value={solText}
                onChange={(e) => setSolText(e.target.value)}
                rows={8}
                placeholder={`Paste RFP, SOW, evaluation criteria — or upload / pull from Vault above.\n\nThe Offeror SHALL demonstrate...\nThe Offeror WILL provide...\nThe Offeror MUST include...\n\nCapability Vault context auto-injects when available.`}
                className="w-full px-3 py-2.5 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] leading-relaxed resize-y"
              />
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 rounded-lg text-[13px] font-bold tracking-wide text-white transition-colors"
              style={{ backgroundColor: analyzing ? "#7A0019cc" : "#7A0019" }}
            >
              {analyzing ? "Analyzing..." : "⚡ Analyze Solicitation"}
            </button>
          </div>

          {/* Proposal Workflow */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-3">
              Proposal Workflow
            </div>
            <div className="space-y-2">
              {STEPS.map((step) => {
                const isDone = step.num < activeStep;
                const isActive = step.num === activeStep;
                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(step.num)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-[13px] font-medium transition-colors text-left",
                      isDone && "bg-green-50 border-green-200 text-green-800",
                      isActive && "bg-[#eff6ff] border-[#bfdbfe] text-[#1a56db]",
                      !isDone && !isActive && "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0",
                        isDone && "bg-green-500 text-white",
                        isActive && "bg-[#1a56db] text-white",
                        !isDone && !isActive && "bg-[#e2e8f0] text-[#94a3b8]"
                      )}
                    >
                      {isDone ? <CheckCircle className="h-3.5 w-3.5" /> : step.num}
                    </span>
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Analysis Results ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5 flex flex-col">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
            Analysis Results
          </div>

          {!analyzed ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="text-[#94a3b8] text-[13px] mb-6">
                Paste an RFP or solicitation and click Analyze to get:
              </div>
              <ul className="space-y-3 text-left w-full max-w-xs">
                {resultBullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[12px] text-[#94a3b8]">
                    <span className="mt-0.5 text-[#cbd5e1]">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Win Themes */}
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#1a56db] uppercase mb-2">Win Themes</div>
                {["HBCU mission alignment — 140-year legacy of serving underrepresented communities",
                  "Cyber lab capabilities match NSA network security requirements exactly",
                  "Existing $3.2M ONR relationship demonstrates agency credibility"].map((t) => (
                  <div key={t} className="flex items-start gap-2 mb-1.5">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-[12px] text-[#334155]">{t}</span>
                  </div>
                ))}
              </div>
              {/* Compliance */}
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Compliance Matrix</div>
                {[
                  { req: "SHALL demonstrate HBCU eligibility", status: "✓ Met" },
                  { req: "WILL provide cyber lab access", status: "✓ Met" },
                  { req: "MUST include SAM.gov registration", status: "⚠ Review" },
                ].map((r) => (
                  <div key={r.req} className="flex justify-between text-[12px] py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#334155]">{r.req}</span>
                    <span className={r.status.startsWith("✓") ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
              {/* Bid/No-Bid */}
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="text-[11px] font-bold tracking-widest text-green-700 uppercase mb-1">Recommendation</div>
                <div className="text-[13px] font-bold text-green-800">BID — Strong Match</div>
                <div className="text-[12px] text-green-700 mt-0.5">92% capability alignment. Proceed to proposal.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
