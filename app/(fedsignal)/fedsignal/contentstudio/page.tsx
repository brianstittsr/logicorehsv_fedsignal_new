"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Linkedin, FileText, Newspaper, Mail, MessageSquare, Sparkles,
  ChevronDown, Search, Upload, Wand2, ImageIcon, Library,
  Copy, Calendar, Send, RefreshCw, Download
} from "lucide-react";

// ─── Content Types ────────────────────────────────────────────────────────────
const CONTENT_TYPES = [
  {
    id: "linkedin",
    label: "LinkedIn Post",
    icon: Linkedin,
    description: "Short-form, 1,200 chars",
    color: "blue",
  },
  {
    id: "press",
    label: "Press Release",
    icon: Newspaper,
    description: "AP format, 2 minute read",
    color: "slate",
  },
  {
    id: "brief",
    label: "Executive Brief",
    icon: FileText,
    description: "1-2 pages, Section format",
    color: "slate",
  },
  {
    id: "blog",
    label: "Blog / Article",
    icon: FileText,
    description: "SEO-optimized, Long-form",
    color: "orange",
  },
  {
    id: "email",
    label: "Email / Outreach",
    icon: Mail,
    description: "160 lines, Partnership pitch",
    color: "slate",
  },
  {
    id: "talking",
    label: "Talking Points",
    icon: MessageSquare,
    description: "Board, Media, Conference",
    color: "slate",
  },
];

// ─── Tone Options ─────────────────────────────────────────────────────────────
const TONE_OPTIONS = [
  "Authoritative — Institutional voice (default)",
  "Conversational — Friendly and approachable",
  "Thought Leadership — Industry expert tone",
  "Executive — Boardroom ready",
  "Marketing — Conversion focused",
];

export default function ContentStudioPage() {
  const [selectedType, setSelectedType] = useState("linkedin");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [includeVault, setIncludeVault] = useState(true);
  const [autoShort, setAutoShort] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* ─── WIN CONTENT Banner ─── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[10px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          ✏️ WIN CONTENT
        </span>
        <span className="text-[12px] text-[#334155]">
          <strong>Content Studio</strong> — Transform capabilities into LinkedIn posts, press releases, blog articles, and executive briefs. Defense Signals format. One source, every channel.
        </span>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* ─── Left Panel: Configuration ─── */}
        <div className="space-y-4">
          {/* Section 1: Content Type */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
              1. Content Type
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                      isSelected
                        ? "bg-blue-50 border-blue-300 ring-1 ring-blue-200"
                        : "bg-white border-[#e2e8f0] hover:bg-[#f8faff] hover:border-[#bfdbfe]"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      type.color === "blue" ? "bg-blue-100 text-blue-600" :
                      type.color === "orange" ? "bg-orange-100 text-orange-600" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-[13px] font-semibold",
                        isSelected ? "text-blue-700" : "text-[#334155]"
                      )}>
                        {type.label}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5">
                        {type.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Topic or Source Signal */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
              2. Topic or Source Signal
            </div>

            {/* What's the news/signal */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">
                What's the news / signal?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                placeholder="e.g. Tuskegee University awarded $2.1M NSA cybersecurity contract — first DoD award in 3 years. Team of 8 faculty, 20 students.&#10;&#10;Or paste a signal, press release, grant award notice, or SAM.gov excerpt..."
                className="w-full px-3 py-2.5 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] leading-relaxed resize-y"
              />
            </div>

            {/* Tone/Voice */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#64748b] mb-1.5">
                Tone / Voice
              </label>
              <div className="relative">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full appearance-none px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                >
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVault}
                  onChange={(e) => setIncludeVault(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                />
                <span className="text-[12px] text-[#334155]">Include Capability Vault Content</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoShort}
                  onChange={(e) => setAutoShort(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                />
                <span className="text-[12px] text-[#334155]">Auto-short institution capabilities for stronger positioning</span>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !topic.trim()}
              className="w-full py-3 rounded-lg text-[13px] font-bold tracking-wide text-white transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: generating ? "#7A0019cc" : "#7A0019" }}
            >
              <Sparkles className="h-4 w-4" />
              {generating ? "Generating..." : "Generate Content"}
            </button>
          </div>

          {/* Section 3: Post Image (Optional) */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b] mb-4">
              3. Post Image (Optional)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Image Search"
                  className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#94a3b8]"
                />
              </div>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#e2e8f0] rounded-lg text-[12px] text-[#64748b] hover:bg-[#f8faff] transition-colors">
                <Upload className="h-3.5 w-3.5" />
                Upload Image
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#e2e8f0] rounded-lg text-[12px] text-[#64748b] hover:bg-[#f8faff] transition-colors">
                <Wand2 className="h-3.5 w-3.5" />
                AI Generate
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#e2e8f0] rounded-lg text-[12px] text-[#64748b] hover:bg-[#f8faff] transition-colors">
                <Library className="h-3.5 w-3.5" />
                Brand Library
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right Panel: Output ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] px-5 py-4">
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-blue-200">
              PERSONAL CONTENT STUDIO • OUTPUT
            </div>
            <div className="text-[16px] font-bold text-white mt-0.5">
              {generated ? "Content Generated" : "Ready to Generate"}
            </div>
            {!generated && (
              <div className="text-[11px] text-blue-100 mt-1">
                Select content type and enter your topic above.
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-5 min-h-[300px]">
            {!generated ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ImageIcon className="h-10 w-10 text-[#e2e8f0] mb-3" />
                <div className="text-[13px] font-semibold text-[#94a3b8]">
                  Generated content appears here.
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-1">
                  AI format: Hook/Hook → Problem → Credibility → Solution → CTA
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#f8faff] border border-[#e2e8f0] rounded-lg p-4">
                  <div className="text-[12px] font-semibold text-[#0f172a] mb-2">
                    {CONTENT_TYPES.find((t) => t.id === selectedType)?.label}
                  </div>
                  <div className="text-[13px] text-[#334155] leading-relaxed whitespace-pre-line">
                    {selectedType === "linkedin" ? (
                      `🎯 Breaking: Tuskegee University just secured a $2.1M NSA cybersecurity contract — our first DoD award in 3 years.

This is what happens when HBCU research excellence meets real-world mission needs.

🔒 8 faculty, 20 students
🔒 First DoD prime in 36 months  
🔒 Cyber lab capabilities matched NSA requirements exactly

The result? A 3-year R&D partnership protecting critical infrastructure.

Proud of our team. Ready for what's next.

#HBCU #Cybersecurity #ResearchExcellence #Tuskegee #DoD #NSA`
                    ) : selectedType === "press" ? (
                      `FOR IMMEDIATE RELEASE

Tuskegee University Awarded $2.1M NSA Cybersecurity Research Contract

Tuskegee, AL — Tuskegee University today announced a $2.1 million research contract with the National Security Agency (NSA) to advance cybersecurity technologies for critical infrastructure protection.

The award marks Tuskegee's first Department of Defense prime contract in three years and validates the university's growing capabilities in cybersecurity research and development.

"This contract demonstrates that HBCU research institutions can compete at the highest levels," said Dr. Marcus Wright, Director of Sponsored Programs. "Our faculty and students are ready to deliver mission-critical solutions."

The 3-year project will engage 8 faculty members and 20 students from the university's Cybersecurity Research Lab.

Contact: mwright@tuskegee.edu`
                    ) : (
                      `Executive Brief: Tuskegee DoD Contract Win

SITUATION
Tuskegee University secured a $2.1M NSA cybersecurity contract — first DoD prime award in 36 months.

SIGNIFICANCE
• Validates HBCU competitiveness in defense R&D
• Activates 8 faculty + 20 students in cyber lab
• Opens pathway to additional agency contracts

NEXT STEPS
1. Press release (approved)
2. LinkedIn announcement (scheduled)
3. Capability Vault update (pending)
4. Follow-on BAA response (in draft)`
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {generated && (
            <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors">
                <Copy className="h-3 w-3" /> Copy
              </button>
              <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors">
                <Calendar className="h-3 w-3" /> Add to Calendar
              </button>
              <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors">
                <Send className="h-3 w-3" /> Send to Newsletter
              </button>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Regenerate
              </button>
              <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors ml-auto">
                <Download className="h-3 w-3" /> Export
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
