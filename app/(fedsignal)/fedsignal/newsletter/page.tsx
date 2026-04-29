"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Image, Type, MousePointerClick, Minus, Columns2, ArrowRight, Upload,
  Search, Sparkles, Library, Video, Link, Film, Award, Trophy, Bell,
  Mail, Check, Send, ChevronDown, Eye, Rocket
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const FILTER_TABS = [
  { id: "contract", label: "Contract Award", icon: Award },
  { id: "opportunity", label: "Opportunity Digest", icon: Trophy },
  { id: "event", label: "Event Announcement", icon: Bell },
  { id: "faculty", label: "Faculty Spotlight", icon: Sparkles },
  { id: "grant", label: "Grant Alert", icon: Award },
  { id: "labs", label: "National Labs Update", icon: Rocket },
];

const LAYOUT_BLOCKS = [
  { id: "hero", label: "Hero Image + Title", icon: Image },
  { id: "text", label: "Text Block", icon: Type },
  { id: "cta", label: "Call to Action", icon: MousePointerClick },
  { id: "divider", label: "Divider", icon: Minus },
  { id: "twocolumn", label: "Two Column", icon: Columns2 },
  { id: "staterow", label: "State Row", icon: ArrowRight },
];

const IMAGE_BLOCKS = [
  { id: "upload", label: "Upload Image", icon: Upload, color: "blue" },
  { id: "pexels", label: "Pexels Image Search", icon: Search, color: "blue" },
  { id: "ai", label: "AI Generate Image", icon: Sparkles, color: "purple" },
  { id: "brand", label: "Brand Library Image", icon: Library, color: "purple" },
];

const VIDEO_BLOCKS = [
  { id: "embed", label: "Embed Video URL", icon: Video, color: "green" },
  { id: "thumbnail", label: "Video Thumbnail Link", icon: Link, color: "green" },
  { id: "texttovideo", label: "AI Text-to-Video", icon: Film, color: "amber", beta: true },
];

const DYNAMIC_BLOCKS = [
  { id: "featured", label: "Featured Opportunity", icon: Trophy, color: "purple" },
  { id: "award", label: "Award Announcement", icon: Award, color: "amber" },
  { id: "grantalert", label: "Grant Alert", icon: Bell, color: "green" },
];

const AI_STYLES = [
  "Professional Photography",
  "Corporate Clean",
  "HBCU Campus Life",
  "Tech Innovation",
  "Abstract Modern",
];

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState("opportunity");
  const [subjectLine, setSubjectLine] = useState("Federal Opportunity Update — March 2024");
  const [recipientList, setRecipientList] = useState("all");
  const [aiPrompt, setAiPrompt] = useState("HBCU engineering students working in a modern cybersecurity lab, professional photo style, diverse");
  const [aiStyle, setAiStyle] = useState("Professional Photography");
  const [blocks, setBlocks] = useState<{ id: string; type: string }[]>([]);

  const addBlock = (type: string) => {
    setBlocks((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), type }]);
  };

  return (
    <div className="space-y-3">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">Newsletter Builder</h1>
          <p className="text-[12px] text-[#64748b]">
            Block-style email builder with AI image generation. Send from your own domain via Resend.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-md hover:bg-[#f8faff]">
            <Eye className="h-3.5 w-3.5" />
            Send Test
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#7A0019] rounded-md hover:bg-[#7A0019]/90">
            <Send className="h-3.5 w-3.5" />
            Send Campaign
          </button>
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-[#1a56db] text-white"
                  : "bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
              )}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Main Builder Layout ─── */}
      <div className="grid grid-cols-[280px_1fr_340px] gap-3 h-[calc(100vh-280px)] min-h-[500px]">
        {/* ─── Left Panel: Blocks ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#f1f5f9]">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#94a3b8]">Blocks</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Layout Section */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2 px-1">Layout</div>
              <div className="space-y-1.5">
                {LAYOUT_BLOCKS.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] hover:border-[#1a56db] transition-colors text-left"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#64748b]" />
                      <span className="text-[11px] font-medium text-[#334155]">{block.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Images Section */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2 px-1">Images</div>
              <div className="space-y-1.5">
                {IMAGE_BLOCKS.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] transition-colors text-left"
                    >
                      <Icon className={cn("h-3.5 w-3.5", block.color === "purple" ? "text-purple-500" : "text-blue-500")} />
                      <span className="text-[11px] font-medium text-[#334155]">{block.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Section */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2 px-1">Video</div>
              <div className="space-y-1.5">
                {VIDEO_BLOCKS.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] transition-colors text-left"
                    >
                      <Icon className={cn(
                        "h-3.5 w-3.5",
                        block.color === "green" ? "text-green-500" : block.color === "amber" ? "text-amber-500" : "text-blue-500"
                      )} />
                      <span className="text-[11px] font-medium text-[#334155]">{block.label}</span>
                      {block.beta && (
                        <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">BETA</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Email Section */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2 px-1">Dynamic Email</div>
              <div className="space-y-1.5">
                {DYNAMIC_BLOCKS.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.id}
                      onClick={() => addBlock(block.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] transition-colors text-left"
                    >
                      <Icon className={cn(
                        "h-3.5 w-3.5",
                        block.color === "purple" ? "text-purple-500" : block.color === "amber" ? "text-amber-500" : "text-green-500"
                      )} />
                      <span className="text-[11px] font-medium text-[#334155]">{block.label}</span>
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
            <span className="text-[11px] font-semibold text-[#64748b]">Email Canvas</span>
            <span className="text-[10px] text-[#94a3b8]">{blocks.length} blocks</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {blocks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-dashed border-[#e2e8f0] flex items-center justify-center mb-3">
                  <Mail className="h-5 w-5 text-[#94a3b8]" />
                </div>
                <p className="text-[12px] text-[#64748b] mb-1">Start building your newsletter</p>
                <p className="text-[11px] text-[#94a3b8]">Click blocks from the left panel to add content</p>
              </div>
            ) : (
              <div className="max-w-[600px] mx-auto bg-white rounded-lg shadow-sm min-h-[400px] p-6 space-y-4">
                {blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className="p-4 border border-[#e2e8f0] rounded-lg bg-white hover:border-[#1a56db] hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-[#94a3b8] uppercase">{block.type}</span>
                      <span className="text-[10px] text-[#c4cdd8]">Block {idx + 1}</span>
                    </div>
                    <div className="h-16 bg-[#f8faff] rounded flex items-center justify-center">
                      <span className="text-[11px] text-[#94a3b8]">Click to edit {block.type} block</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Panel: Settings & AI Generator ─── */}
        <div className="space-y-3">
          {/* Send Settings */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">Send Settings</div>
            </div>
            <div className="p-4 space-y-4">
              {/* From Name */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">From Name</label>
                <input
                  type="text"
                  value="Tuskegee University Research Office"
                  readOnly
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-[#f8faff] text-[#64748b]"
                />
              </div>

              {/* From Address */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">From Address</label>
                <input
                  type="text"
                  value="research@tuskegee.edu"
                  readOnly
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-[#f8faff] text-[#64748b]"
                />
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Subject Line</label>
                <input
                  type="text"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                />
              </div>

              {/* Recipient List */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Recipient List</label>
                <div className="relative">
                  <select
                    value={recipientList}
                    onChange={(e) => setRecipientList(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                  >
                    <option value="all">All Subscribers (847)</option>
                    <option value="faculty">Faculty Only (124)</option>
                    <option value="researchers">Research Staff (89)</option>
                    <option value="admin">Administration (34)</option>
                    <option value="external">External Partners (156)</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>

              {/* Resend Connected */}
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-green-700">Resend Connected</p>
                  <p className="text-[9px] text-green-600">research@tuskegee.edu verified</p>
                </div>
              </div>

              {/* Test/Preview buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Mail className="h-3 w-3" />
                  Test Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* AI Image Generator */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">AI Image Generator</div>
              <p className="text-[9px] text-[#94a3b8] mt-0.5">Generate campus, research, or STEM imagery for newsletters or reports.</p>
            </div>
            <div className="p-4 space-y-3">
              {/* Image Prompt */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Image Prompt</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] resize-none"
                  placeholder="Describe the image you want to generate..."
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Style</label>
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

              {/* Search/Upload buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Search className="h-3 w-3" />
                  Pexels Search
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Upload className="h-3 w-3" />
                  Upload
                </button>
              </div>

              {/* Generate Button */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold text-white bg-[#7A0019] rounded-lg hover:bg-[#7A0019]/90">
                <Sparkles className="h-3.5 w-3.5" />
                Generate with AI
              </button>
            </div>
          </div>

          {/* Text-to-Video */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">Text-to-Video</div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">BETA</span>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-[#64748b] mb-3">Transform newsletters into short, social media reels and video — for newsletters, event reports and social — $0.10/video via Runway ML or Pika.</p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff] disabled:opacity-50" disabled>
                <Film className="h-3.5 w-3.5" />
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
