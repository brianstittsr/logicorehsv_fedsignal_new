"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Upload, CheckCircle, ExternalLink, Image as ImageIcon,
  Search, Sparkles, Film, FileText, Database, Link2,
  Download, Save, Palette, Building2, Globe, Type
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { name: "Primary", hex: "#7A0019", label: "Maroon" },
  { name: "Secondary", hex: "#D4AF37", label: "Gold" },
  { name: "Accent", hex: "#1a56db", label: "Blue" },
  { name: "Neutral", hex: "#64748b", label: "Slate" },
];

const API_CONNECTIONS = [
  {
    id: "resend",
    name: "Resend",
    status: "connected",
    description: "Email delivery for newsletters and alerts",
    type: "email",
  },
  {
    id: "pexels",
    name: "Pexels API",
    status: "connected",
    description: "20M+ free stock photos for newsletters and reports",
    type: "images",
  },
  {
    id: "unsplash",
    name: "Unsplash API",
    status: "connected",
    description: "High-quality photography for brand imagery",
    type: "images",
  },
  {
    id: "supabase",
    name: "Supabase Storage",
    status: "connected",
    description: "Image sync for FedSignal assets",
    type: "storage",
  },
  {
    id: "grants",
    name: "Grants.gov API",
    status: "limited",
    description: "Free API key required for basic search",
    type: "data",
  },
  {
    id: "sam",
    name: "SAM.gov API",
    status: "connected",
    description: "Contract opportunities and entity registration",
    type: "data",
  },
  {
    id: "sbir",
    name: "SBIR.gov API",
    status: "connected",
    description: "Open API — matches topics to capabilities",
    type: "data",
  },
];

export default function BrandingPage() {
  const [primaryColor, setPrimaryColor] = useState("#7A0019");
  const [secondaryColor, setSecondaryColor] = useState("#D4AF37");
  const [institutionName, setInstitutionName] = useState("Tuskegee University");
  const [shortName, setShortName] = useState("Tuskegee");
  const [tagline, setTagline] = useState("Where achievement and excellence meet");
  const [website, setWebsite] = useState("https://tuskegee.edu");
  const [textToVideoProvider, setTextToVideoProvider] = useState("runway");

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">University Branding & Assets</h1>
          <p className="text-[12px] text-[#64748b]">
            Logos, colors, imagery, and brand rules. Auto-applies to all assets, newsletters, and Gamma decks generated on this platform.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#7A0019] rounded-md hover:bg-[#7A0019]/90">
          <Save className="h-3.5 w-3.5" />
          Save Branding
        </button>
      </div>

      {/* ─── Main Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ─── Left Column ─── */}
        <div className="space-y-4">
          {/* Logo & Identity */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#1a56db]" />
              <span className="text-[12px] font-bold tracking-wide text-[#64748b] uppercase">Logo & Identity</span>
            </div>
            <div className="p-5 space-y-4">
              {/* Logo Upload */}
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#e2e8f0] rounded-lg bg-[#f8faff] hover:bg-[#eff6ff] hover:border-[#1a56db] transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-[#7A0019] flex items-center justify-center mb-3">
                  <span className="text-[24px] text-white font-serif">T</span>
                </div>
                <p className="text-[11px] font-medium text-[#1a56db] mb-1">Upload University Logo</p>
                <p className="text-[10px] text-[#94a3b8]">PNG, SVG, EPS • Recommended: 400×400px</p>
              </div>

              {/* Institution Name */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Institution Official Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                />
              </div>

              {/* Short Name */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Short Name / Abbreviation</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Tagline / Mission Statement</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Where achievement and excellence meet"
                  className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                />
              </div>

              {/* Official Website */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Official Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image API Integration */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#1a56db]" />
              <span className="text-[12px] font-bold tracking-wide text-[#64748b] uppercase">Image API Integration</span>
            </div>
            <div className="p-5 space-y-4">
              {/* Pexels API */}
              <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8faff]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#1a56db]" />
                    <span className="text-[12px] font-semibold text-[#0f172a]">Pexels API</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">FREE</span>
                  </div>
                  <span className="text-[9px] text-[#1a56db]">✓ Recommended</span>
                </div>
                <p className="text-[10px] text-[#64748b] mb-2">20,000 free API calls/month • HBCU campus, STEM, research imagery. No attribution required for commercial use.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="Paste Pexels API key • Free at pexels.com/api"
                    readOnly
                    className="flex-1 px-3 py-1.5 text-[10px] border border-[#e2e8f0] rounded bg-white text-[#94a3b8]"
                  />
                  <button className="px-3 py-1.5 text-[10px] font-medium text-[#1a56db] border border-[#1a56db] rounded hover:bg-[#eff6ff]">
                    Test & Search Images
                  </button>
                </div>
              </div>

              {/* Unsplash API */}
              <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8faff]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#047857]" />
                    <span className="text-[12px] font-semibold text-[#0f172a]">Unsplash API</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">FREE</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#64748b] mb-2">High-quality, free. Strict hotlinking. Best for newsletter hero images.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="API key at unsplash.com/developers"
                    readOnly
                    className="flex-1 px-3 py-1.5 text-[10px] border border-[#e2e8f0] rounded bg-white text-[#94a3b8]"
                  />
                </div>
              </div>

              {/* Text-to-Video */}
              <div className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f8faff]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-amber-500" />
                    <span className="text-[12px] font-semibold text-[#0f172a]">Text-to-Video</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">BETA</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#64748b] mb-2">Runway ML or Pika Labs integration — generate 15-30s social clips for newsletters + social — $0.10/video. Add value for board reports and external communications.</p>
                <div className="flex gap-2">
                  <select
                    value={textToVideoProvider}
                    onChange={(e) => setTextToVideoProvider(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-[10px] border border-[#e2e8f0] rounded bg-white text-[#334155]"
                  >
                    <option value="runway">Select provider — Runway ML | Pika | Run API</option>
                    <option value="runway">Runway ML</option>
                    <option value="pika">Pika Labs</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="API key: sk-..."
                  className="w-full mt-2 px-3 py-1.5 text-[10px] border border-[#e2e8f0] rounded bg-white text-[#334155]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Column ─── */}
        <div className="space-y-4">
          {/* Brand Colors */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#1a56db]" />
              <span className="text-[12px] font-bold tracking-wide text-[#64748b] uppercase">Brand Colors</span>
            </div>
            <div className="p-5 space-y-4">
              {/* Primary Color */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Primary Color</label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-lg border border-[#e2e8f0] overflow-hidden flex-shrink-0">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-full cursor-pointer border-0 p-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] font-mono"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Secondary Color</label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-lg border border-[#e2e8f0] overflow-hidden flex-shrink-0">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full h-full cursor-pointer border-0 p-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] font-mono"
                  />
                </div>
              </div>

              {/* Color Preview */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Color Preview</label>
                <div className="flex rounded-lg overflow-hidden border border-[#e2e8f0]">
                  <div 
                    className="flex-1 py-3 flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-[10px] font-medium text-white">Primary</span>
                  </div>
                  <div 
                    className="flex-1 py-3 flex items-center justify-center"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <span className="text-[10px] font-medium" style={{ color: primaryColor }}>Secondary</span>
                  </div>
                  <div className="flex-1 py-3 flex items-center justify-center bg-white">
                    <span className="text-[10px] font-medium text-[#64748b]">Background</span>
                  </div>
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Presets</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        if (color.name === "Primary") setPrimaryColor(color.hex);
                        if (color.name === "Secondary") setSecondaryColor(color.hex);
                      }}
                      className="p-2 rounded-lg border border-[#e2e8f0] hover:border-[#1a56db] transition-colors text-center"
                    >
                      <div 
                        className="w-6 h-6 rounded mx-auto mb-1"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[9px] text-[#64748b]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Library */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#1a56db]" />
                <span className="text-[12px] font-bold tracking-wide text-[#64748b] uppercase">Image Library</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-green-100 text-green-700 rounded">Connected</span>
            </div>
            <div className="p-5">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#e2e8f0] rounded-lg bg-[#f8faff] hover:bg-[#eff6ff] hover:border-[#1a56db] transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-[#1a56db] mb-2" />
                <p className="text-[11px] font-medium text-[#1a56db] mb-1">Upload Campus Images</p>
                <p className="text-[10px] text-[#94a3b8] text-center">Search AI-generated, research, and news articles, Gamma decks</p>
              </div>
              
              {/* Supabase Connected */}
              <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-[10px] font-medium text-green-700">Supabase Storage Connected</p>
                  <p className="text-[9px] text-green-600">Images sync to fedsignal-assets / contracts-v2 / staging/</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Connections */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center gap-2">
              <Database className="h-4 w-4 text-[#1a56db]" />
              <span className="text-[12px] font-bold tracking-wide text-[#64748b] uppercase">API Connections</span>
            </div>
            <div className="p-5 space-y-3">
              {API_CONNECTIONS.map((api) => (
                <div key={api.id} className={cn(
                  "p-3 rounded-lg border",
                  api.status === "connected" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {api.type === "email" && <Database className="h-3.5 w-3.5 text-green-600" />}
                      {api.type === "images" && <ImageIcon className="h-3.5 w-3.5 text-green-600" />}
                      {api.type === "storage" && <Upload className="h-3.5 w-3.5 text-green-600" />}
                      {api.type === "data" && <FileText className="h-3.5 w-3.5 text-green-600" />}
                      <span className="text-[11px] font-semibold text-[#0f172a]">{api.name}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded",
                      api.status === "connected" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {api.status === "connected" ? "Connected" : "Limited"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#64748b]">{api.description}</p>
                  {api.status === "limited" && (
                    <button className="mt-2 text-[9px] text-[#1a56db] hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Get API Key
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
