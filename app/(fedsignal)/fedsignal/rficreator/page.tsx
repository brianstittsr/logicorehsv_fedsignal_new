"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Download, Copy, RefreshCw } from "lucide-react";

// ── Capability area options ───────────────────────────────────────────────────
const CAPABILITY_AREAS = [
  { id: "research", label: "Research & STEM",          emoji: "🔬", defaultSelected: true },
  { id: "cyber",    label: "Cybersecurity",             emoji: "🛡️", defaultSelected: false },
  { id: "aiml",     label: "AI & Machine Learning",     emoji: "🤖", defaultSelected: false },
  { id: "energy",   label: "Energy Systems",            emoji: "⚡", defaultSelected: false },
  { id: "aero",     label: "Aerospace & Defense",       emoji: "🚀", defaultSelected: false },
  { id: "workforce",label: "Workforce Development",     emoji: "🎓", defaultSelected: true },
  { id: "transport",label: "Transportation & Logistics",emoji: "🚛", defaultSelected: false },
  { id: "health",   label: "Health Sciences",           emoji: "🏥", defaultSelected: false },
];

// ── Wizard steps ──────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: "Document Type" },
  { num: 2, label: "Agency & Topic" },
  { num: 3, label: "Capability Areas" },
  { num: 4, label: "Key Differentiators" },
  { num: 5, label: "Generate & Review" },
];

// ── Output bullets (right panel placeholder) ─────────────────────────────────
const OUTPUT_BULLETS = [
  "RFI Responses with technical narrative",
  "1-Page Capability Statements (8(a), WOSB, HBCU)",
  "White Papers with executive summary",
  "Past Performance Narratives (CPARS-ready)",
  "Sources Sought with NAICS codes",
];

// ── Generated mock document ───────────────────────────────────────────────────
const MOCK_DOCUMENT = `RFI RESPONSE — TUSKEGEE UNIVERSITY
Responding to: DARPA HBCU Program Office

EXECUTIVE CAPABILITY SUMMARY
Tuskegee University is a federally designated HBCU with 140+ years of excellence in STEM education, research, and workforce development. As an 8(a)-eligible institution, Tuskegee brings demonstrated capability in Research & STEM and Workforce Development domains directly aligned to this RFI.

KEY CAPABILITIES
• Research & STEM: $62M in active federal awards. Faculty expertise spans materials science, biomedical engineering, and computer science. Active DoD, NSF, and NASA partnerships.
• Workforce Development: HBCU STEM Pipeline program reaching 2,400+ students annually. Industry-aligned curriculum redesigned in partnership with L3Harris and SAIC.

PAST PERFORMANCE
Tuskegee holds a strong CPARS record across DoD and NSF vehicles. Prior awards include ONR cybersecurity research ($3.2M), NSF Engineering Education ($1.1M), and DARPA Young Faculty Award.

HBCU DIFFERENTIATORS
As a Historically Black College and University, Tuskegee fulfills DoD diversity and inclusion mandates while delivering research excellence. HBCU set-aside eligibility confirmed. SAM.gov registration current.

POINT OF CONTACT
Dr. Marcus Wright · Director, Sponsored Programs
mwright@tuskegee.edu · (334) 727-8923`;

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-[#64748b] mb-1">
      {children}
      {optional && <span className="font-normal text-[#94a3b8] ml-1">(optional)</span>}
    </label>
  );
}

export default function RFICreatorPage() {
  // Wizard state
  const [activeStep, setActiveStep] = useState(1);

  // Form fields
  const [docType, setDocType]           = useState("rfi");
  const [agency, setAgency]             = useState("");
  const [topic, setTopic]               = useState("");
  const [capabilities, setCapabilities] = useState<Set<string>>(
    new Set(CAPABILITY_AREAS.filter((c) => c.defaultSelected).map((c) => c.id))
  );
  const [notes, setNotes]               = useState("");

  // Generate state
  const [generating, setGenerating]     = useState(false);
  const [generated, setGenerated]       = useState(false);

  const toggleCapability = (id: string) => {
    setCapabilities((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setActiveStep(5);
    }, 1800);
  };

  // Determine which step to show as active based on form completion
  const completedStep = () => {
    if (generated) return 5;
    if (notes) return 4;
    if (capabilities.size > 0) return 3;
    if (agency || topic) return 2;
    return 1;
  };

  return (
    <div className="space-y-4">
      {/* WIN TOOL Banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          ✏️ WIN TOOL
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>RFI Creator</strong> — Generate Shipley-aligned RFI responses, capability statements, and white papers. Pulls from your Capability Vault automatically.
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ── Left: Form ── */}
        <div className="space-y-4">
          {/* Wizard Step Tabs */}
          <div className="flex items-center gap-0 bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
            {STEPS.map((step, i) => {
              const isDone   = step.num < completedStep() + 1;
              const isActive = step.num === activeStep;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={cn(
                    "flex-1 flex flex-col items-center py-2.5 px-1 text-center border-r border-[#f1f5f9] last:border-r-0 transition-colors",
                    isActive  && "bg-[#eff6ff] text-[#1a56db]",
                    !isActive && isDone  && "bg-white text-green-600",
                    !isActive && !isDone && "bg-white text-[#94a3b8] hover:bg-[#f8faff]"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5",
                    isActive  && "bg-[#1a56db] text-white",
                    !isActive && isDone  && "bg-green-500 text-white",
                    !isActive && !isDone && "bg-[#e2e8f0] text-[#94a3b8]"
                  )}>
                    {(!isActive && isDone) ? "✓" : step.num}
                  </span>
                  <span className="text-[10px] font-medium leading-tight hidden sm:block">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Document Configuration Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
              Document Configuration
            </div>

            {/* Step 1: Document Type */}
            <div className={cn("mb-3", activeStep !== 1 && activeStep !== 5 && "opacity-60")}>
              <FieldLabel>Document Type</FieldLabel>
              <div className="relative">
                <select
                  value={docType}
                  onChange={(e) => { setDocType(e.target.value); setActiveStep(2); }}
                  className="w-full appearance-none px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                >
                  <option value="rfi">RFI Response — Request for Information</option>
                  <option value="capstat">1-Page Capability Statement</option>
                  <option value="whitepaper">White Paper</option>
                  <option value="pastperf">Past Performance Narrative</option>
                  <option value="sourcessought">Sources Sought Response</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Agency + Topic */}
            <div className={cn("mb-3", activeStep < 2 && activeStep !== 5 && "opacity-50 pointer-events-none")}>
              <FieldLabel>Agency / Issuing Office</FieldLabel>
              <input
                type="text"
                value={agency}
                onChange={(e) => { setAgency(e.target.value); if (activeStep < 2) setActiveStep(2); }}
                placeholder="e.g. DARPA, NSF, DoD HBCU Program Office"
                className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] mb-3"
              />
              <FieldLabel>Topic / Technology Area</FieldLabel>
              <input
                type="text"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); if (activeStep < 2) setActiveStep(2); }}
                placeholder="e.g. AI/ML for logistics optimization, Cybersecurity workforce..."
                className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
              />
            </div>

            {/* Step 3: Capability Areas */}
            <div className={cn("mb-3", activeStep < 3 && activeStep !== 5 && "opacity-50 pointer-events-none")}>
              <FieldLabel>Relevant Capability Areas <span className="font-normal text-[#94a3b8]">(select all that apply)</span></FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {CAPABILITY_AREAS.map((cap) => {
                  const selected = capabilities.has(cap.id);
                  return (
                    <button
                      key={cap.id}
                      onClick={() => { toggleCapability(cap.id); if (activeStep < 3) setActiveStep(3); }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium text-left transition-colors",
                        selected
                          ? "bg-[#eff6ff] border-[#bfdbfe] text-[#1a56db]"
                          : "bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
                      )}
                    >
                      <span>{cap.emoji}</span>
                      {cap.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Notes */}
            <div className={cn("mb-4", activeStep < 4 && activeStep !== 5 && "opacity-50 pointer-events-none")}>
              <FieldLabel optional>Key Differentiators / Notes</FieldLabel>
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); if (activeStep < 4) setActiveStep(4); }}
                rows={4}
                placeholder="Any specific past performance, unique capabilities, or talking points to emphasize..."
                className="w-full px-3 py-2.5 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] leading-relaxed resize-y"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 rounded-lg text-[13px] font-bold tracking-wide text-white transition-colors"
              style={{ backgroundColor: generating ? "#7A0019cc" : "#7A0019" }}
            >
              {generating ? "Generating..." : "✏️ Generate Document"}
            </button>
          </div>
        </div>

        {/* ── Right: Generated Document ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
              Generated Document
            </div>
            {generated && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setGenerated(false); setActiveStep(1); }}
                  className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#334155] transition-colors"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
                <button className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#334155] transition-colors">
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-[#1a56db] text-white rounded hover:bg-[#1549c0] transition-colors">
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            )}
          </div>

          {!generated ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="text-[#94a3b8] text-[13px] mb-6">
                Configure your document above and click Generate.
              </div>
              <div className="text-[12px] text-[#94a3b8] mb-3">Outputs include:</div>
              <ul className="space-y-2.5 text-left w-full max-w-xs">
                {OUTPUT_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[12px] text-[#94a3b8]">
                    <span className="text-[#cbd5e1] mt-0.5">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <textarea
                defaultValue={MOCK_DOCUMENT}
                className="w-full h-full min-h-[420px] px-3 py-2.5 text-[12px] font-mono border border-[#e2e8f0] rounded-lg bg-[#f8faff] outline-none focus:border-[#1a56db] text-[#334155] leading-relaxed resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
