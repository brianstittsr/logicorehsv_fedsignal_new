"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Image, Type, MousePointerClick, Minus, Columns2, ArrowRight, Upload,
  Search, Sparkles, Library, Video, Link, Film, Award, Trophy, Bell,
  Target, Check, Send, ChevronDown, Eye, Rocket, Layout, Presentation,
  Monitor, Smartphone, Grid3X3, Palette, FileText, Quote, List
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const DECK_TEMPLATES = [
  { id: "pitch", label: "Pitch Deck", icon: Trophy },
  { id: "capability", label: "Capability Deck", icon: Award },
  { id: "research", label: "Research Summary", icon: Target },
  { id: "funding", label: "Funding Request", icon: Rocket },
  { id: "partner", label: "Partner Brief", icon: Bell },
  { id: "annual", label: "Annual Report", icon: FileText },
];

const SLIDE_LAYOUTS = [
  { id: "title", label: "Title Slide", icon: Layout },
  { id: "content", label: "Content Slide", icon: FileText },
  { id: "split", label: "Split Layout", icon: Columns2 },
  { id: "image", label: "Image + Text", icon: Image },
  { id: "quote", label: "Quote Slide", icon: Quote },
  { id: "stats", label: "Stats Row", icon: Grid3X3 },
  { id: "list", label: "Bullet List", icon: List },
  { id: "cta", label: "Call to Action", icon: MousePointerClick },
];

const MEDIA_BLOCKS = [
  { id: "upload", label: "Upload Image", icon: Upload, color: "blue" },
  { id: "pexels", label: "Pexels Search", icon: Search, color: "blue" },
  { id: "ai", label: "AI Generate", icon: Sparkles, color: "purple" },
  { id: "brand", label: "Brand Library", icon: Library, color: "purple" },
];

const CHART_BLOCKS = [
  { id: "bar", label: "Bar Chart", icon: Trophy, color: "green" },
  { id: "pie", label: "Pie Chart", icon: Target, color: "green" },
  { id: "line", label: "Line Chart", icon: Minus, color: "green" },
];

const AI_STYLES = [
  "Corporate Professional",
  "Modern Minimalist",
  "Academic Research",
  "Tech Innovation",
  "HBCU Heritage",
];

const MOCK_SLIDES = [
  {
    id: "1",
    title: "Tuskegee University Research Capabilities",
    subtitle: "FY2025 Federal Contracting & Partnership Overview",
    type: "title",
    thumbnail: "🎓",
  },
  {
    id: "2",
    title: "Research Excellence by the Numbers",
    stats: [
      { label: "Active Awards", value: "$47M" },
      { label: "Faculty Researchers", value: "89" },
      { label: "Patents Filed", value: "12" },
      { label: "Industry Partners", value: "34" },
    ],
    type: "stats",
    thumbnail: "📊",
  },
  {
    id: "3",
    title: "Core Research Competencies",
    bullets: ["Aerospace & Unmanned Systems", "Cybersecurity & AI/ML", "Biomedical & Health Sciences", "Energy & Sustainability", "Advanced Materials & Manufacturing"],
    type: "list",
    thumbnail: "🔬",
  },
  {
    id: "4",
    title: "Success Story: $12M AFWERX Contract",
    content: "Developed autonomous swarm technology for aerial defense applications in partnership with Air Force Research Laboratory.",
    type: "content",
    thumbnail: "✈️",
  },
];

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Slide {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  subtitle?: string;
  stats?: { label: string; value: string }[];
  bullets?: string[];
  content?: string;
}

export default function GammaDeckPage() {
  const [activeTemplate, setActiveTemplate] = useState("capability");
  const [deckName, setDeckName] = useState("Tuskegee University Capability Deck 2025");
  const [slides, setSlides] = useState<Slide[]>(MOCK_SLIDES);
  const [activeSlide, setActiveSlide] = useState("1");
  const [aiPrompt, setAiPrompt] = useState("Research presentation about HBCU federal contracting success, professional corporate style");
  const [aiStyle, setAiStyle] = useState("Corporate Professional");
  const [exportFormat, setExportFormat] = useState("pdf");

  const addSlide = (type: string) => {
    const newSlide: Slide = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Slide",
      type,
      thumbnail: "📝",
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlide(newSlide.id);
  };

  return (
    <div className="space-y-3">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">Gamma Deck</h1>
          <p className="text-[12px] text-[#64748b]">
            AI-powered presentation builder. Create pitch decks, capability summaries, and research reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-md hover:bg-[#f8faff]">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#7A0019] rounded-md hover:bg-[#7A0019]/90">
            <Presentation className="h-3.5 w-3.5" />
            Export Deck
          </button>
        </div>
      </div>

      {/* ─── Template Tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {DECK_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
                activeTemplate === template.id
                  ? "bg-[#1a56db] text-white"
                  : "bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
              )}
            >
              <Icon className="h-3 w-3" />
              {template.label}
            </button>
          );
        })}
      </div>

      {/* ─── Main Builder Layout ─── */}
      <div className="grid grid-cols-[280px_1fr_340px] gap-3 h-[calc(100vh-280px)] min-h-[500px]">
        {/* ─── Left Panel: Slides & Blocks ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#94a3b8]">Slides</div>
            <span className="text-[10px] text-[#94a3b8]">{slides.length} slides</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors text-left",
                  activeSlide === slide.id
                    ? "bg-[#eff6ff] border-[#1a56db]"
                    : "bg-white border-[#e2e8f0] hover:bg-[#f8faff]"
                )}
              >
                <span className="text-[16px]">{slide.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-[#94a3b8] mb-0.5">Slide {idx + 1}</div>
                  <div className="text-[11px] font-medium text-[#334155] truncate">{slide.title}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-[#f1f5f9] p-3 space-y-3">
            {/* Slide Layouts */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2">Add Slide</div>
              <div className="grid grid-cols-2 gap-1.5">
                {SLIDE_LAYOUTS.map((layout) => {
                  const Icon = layout.icon;
                  return (
                    <button
                      key={layout.id}
                      onClick={() => addSlide(layout.id)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] hover:border-[#1a56db] transition-colors text-left"
                    >
                      <Icon className="h-3 w-3 text-[#64748b]" />
                      <span className="text-[10px] font-medium text-[#334155]">{layout.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Middle: Canvas ─── */}
        <div className="bg-[#f8faff] border border-[#e2e8f0] rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#e2e8f0] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748b]">Slide Editor</span>
              <span className="text-[10px] text-[#94a3b8]">
                {slides.find((s) => s.id === activeSlide)?.title || "Untitled"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-[#f1f5f9] text-[#64748b]">
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#f1f5f9] text-[#64748b]">
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[700px] mx-auto bg-white rounded-lg shadow-lg min-h-[400px] aspect-video p-8 flex flex-col">
              {activeSlide === "1" ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#7A0019] flex items-center justify-center mb-4">
                    <span className="text-[24px]">🎓</span>
                  </div>
                  <h2 className="text-[24px] font-bold text-[#0f172a] mb-2">Tuskegee University Research Capabilities</h2>
                  <p className="text-[14px] text-[#64748b]">FY2025 Federal Contracting & Partnership Overview</p>
                  <div className="mt-8 flex items-center gap-4 text-[11px] text-[#94a3b8]">
                    <span>Prepared by Research Office</span>
                    <span>•</span>
                    <span>March 2025</span>
                  </div>
                </div>
              ) : activeSlide === "2" ? (
                <div className="h-full">
                  <h3 className="text-[18px] font-bold text-[#0f172a] mb-6">Research Excellence by the Numbers</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Active Awards", value: "$47M", color: "#1a56db" },
                      { label: "Faculty Researchers", value: "89", color: "#7A0019" },
                      { label: "Patents Filed", value: "12", color: "#047857" },
                      { label: "Industry Partners", value: "34", color: "#b45309" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-4 bg-[#f8faff] rounded-lg">
                        <div className="text-[28px] font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-[10px] text-[#64748b] mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSlide === "3" ? (
                <div className="h-full">
                  <h3 className="text-[18px] font-bold text-[#0f172a] mb-4">Core Research Competencies</h3>
                  <ul className="space-y-3">
                    {[
                      "Aerospace & Unmanned Systems",
                      "Cybersecurity & AI/ML",
                      "Biomedical & Health Sciences",
                      "Energy & Sustainability",
                      "Advanced Materials & Manufacturing",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-[#334155]">
                        <span className="w-2 h-2 rounded-full bg-[#1a56db]"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : activeSlide === "4" ? (
                <div className="h-full grid grid-cols-2 gap-6">
                  <div className="flex flex-col justify-center">
                    <div className="text-[12px] font-bold text-[#7A0019] mb-2">SUCCESS STORY</div>
                    <h3 className="text-[18px] font-bold text-[#0f172a] mb-3">$12M AFWERX Contract</h3>
                    <p className="text-[13px] text-[#64748b] leading-relaxed">
                      Developed autonomous swarm technology for aerial defense applications in partnership with Air Force Research Laboratory.
                    </p>
                  </div>
                  <div className="bg-[#f8faff] rounded-lg flex items-center justify-center">
                    <span className="text-[48px]">✈️</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[14px] text-[#64748b]">Click a slide from the left panel to edit</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Right Panel: AI Generator & Export ─── */}
        <div className="space-y-3">
          {/* AI Slide Generator */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">AI Slide Generator</div>
            </div>
            <div className="p-4 space-y-4">
              {/* Deck Name */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Deck Name</label>
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                />
              </div>

              {/* AI Prompt */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Content Prompt</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] resize-none"
                  placeholder="Describe the presentation you want to create..."
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Visual Style</label>
                <div className="relative">
                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                  >
                    {AI_STYLES.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>

              {/* Generate Button */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold text-white bg-[#1a56db] rounded-lg hover:bg-[#1a56db]/90">
                <Sparkles className="h-3.5 w-3.5" />
                Generate Deck with AI
              </button>
            </div>
          </div>

          {/* Media & Charts */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">Insert Media</div>
            </div>
            <div className="p-4 space-y-3">
              {/* Media Blocks */}
              <div className="space-y-1.5">
                {MEDIA_BLOCKS.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.id}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] transition-colors text-left"
                    >
                      <Icon className={cn("h-3.5 w-3.5", block.color === "purple" ? "text-purple-500" : "text-blue-500")} />
                      <span className="text-[11px] font-medium text-[#334155]">{block.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">Export</div>
            </div>
            <div className="p-4 space-y-3">
              {/* Format */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Format</label>
                <div className="relative">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                    <option value="keynote">Keynote (.key)</option>
                    <option value="google">Google Slides</option>
                    <option value="html">HTML Presentation</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Palette className="h-3 w-3" />
                  Brand Theme
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Layout className="h-3 w-3" />
                  Layout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
