"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Settings, Puzzle, Cpu, Globe, Bell, Link2, Eye, Navigation,
  CheckCircle, AlertCircle, Save, ChevronRight, Power, Database, Search
} from "lucide-react";
import Link from "next/link";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "integrations", label: "Integrations", icon: Puzzle },
  { id: "llm", label: "LLM Configuration", icon: Cpu },
  { id: "samgov-tester", label: "SAM.gov Tester", icon: Search },
  { id: "webhooks", label: "Webhooks", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "links", label: "Social Links", icon: Link2 },
  { id: "ui", label: "UI Preferences", icon: Eye },
  { id: "navigation", label: "Navigation", icon: Navigation },
];

const INTEGRATIONS = [
  {
    id: "resend",
    name: "Resend",
    description: "Email delivery for newsletters and alerts",
    status: "connected",
    icon: "📧",
  },
  {
    id: "pexels",
    name: "Pexels API",
    description: "Stock photography for newsletters and reports",
    status: "connected",
    icon: "📷",
  },
  {
    id: "unsplash",
    name: "Unsplash API",
    description: "High-quality photography for brand imagery",
    status: "connected",
    icon: "📸",
  },
  {
    id: "supabase",
    name: "Supabase Storage",
    description: "Image sync for FedSignal assets",
    status: "connected",
    icon: "☁️",
  },
  {
    id: "grants",
    name: "Grants.gov API",
    description: "Federal grant opportunity data",
    status: "limited",
    icon: "📝",
  },
  {
    id: "sam",
    name: "SAM.gov API",
    description: "Contract opportunities and entity registration",
    status: "connected",
    icon: "🏛️",
  },
  {
    id: "sbir",
    name: "SBIR.gov API",
    description: "SBIR/STTR topic matching",
    status: "connected",
    icon: "🚀",
  },
];

const LLM_PROVIDERS = [
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4", "gpt-3.5-turbo"] },
  { id: "anthropic", name: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"] },
  { id: "ollama", name: "Ollama (Local LLM)", models: ["llama3", "mistral", "mixtral"] },
];

const NAV_ITEMS = [
  {
    category: "INTELLIGENCE",
    items: [
      { id: "command", name: "Command Center", path: "/fedsignal", roles: { admin: true, member: true, affiliate: true, client: true, viewer: true } },
      { id: "pursuit", name: "Pursuit Board", path: "/fedsignal/opportunities", roles: { admin: true, member: true, affiliate: false, client: false, viewer: false } },
      { id: "opportunities", name: "Opportunities", path: "/fedsignal/opportunities", roles: { admin: true, member: true, affiliate: true, client: true, viewer: true } },
    ],
  },
  {
    category: "WORK",
    items: [
      { id: "projects", name: "Projects", path: "/fedsignal/projects", roles: { admin: true, member: true, affiliate: false, client: true, viewer: false } },
      { id: "directory", name: "Member Directory", path: "/fedsignal/directory", roles: { admin: true, member: true, affiliate: true, client: true, viewer: true } },
      { id: "affiliates", name: "Affiliates", path: "/fedsignal/affiliates", roles: { admin: true, member: true, affiliate: true, client: false, viewer: false } },
      { id: "customers", name: "Customers", path: "/fedsignal/customers", roles: { admin: true, member: false, affiliate: false, client: false, viewer: false } },
    ],
  },
  {
    category: "RESOURCE LIBRARY",
    items: [
      { id: "resources", name: "Resource Library", path: "/fedsignal/resources", roles: { admin: true, member: true, affiliate: true, client: true, viewer: true } },
      { id: "membership", name: "My Membership", path: "/fedsignal/membership", roles: { admin: true, member: true, affiliate: false, client: false, viewer: false } },
    ],
  },
];

const ROLES = ["Admin", "Team Member", "Affiliate", "Client", "Viewer"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [selectedLLM, setSelectedLLM] = useState("ollama");
  const [selectedModel, setSelectedModel] = useState("llama3");
  const [apiKey, setApiKey] = useState("");
  const [navPermissions, setNavPermissions] = useState(NAV_ITEMS);

  const togglePermission = (catIdx: number, itemIdx: number, role: string) => {
    const newNav = [...navPermissions];
    const roleKey = role.toLowerCase().replace(" ", "") as keyof typeof newNav[0]["items"][0]["roles"];
    newNav[catIdx].items[itemIdx].roles[roleKey] = !newNav[catIdx].items[itemIdx].roles[roleKey];
    setNavPermissions(newNav);
  };

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">Settings</h1>
          <p className="text-[12px] text-[#64748b]">
            Manage API keys, webhooks, and integrations
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#1a56db] rounded-md hover:bg-[#1a56db]/90">
          <Save className="h-3.5 w-3.5" />
          Save All Settings
        </button>
      </div>

      {/* ─── Tabs ─── */}
      <div className="border-b border-[#e2e8f0] overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-[11px] font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[#1a56db] text-[#1a56db]"
                    : "border-transparent text-[#64748b] hover:text-[#334155]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Integrations Tab ─── */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <h3 className="text-[13px] font-bold text-[#0f172a]">Connected Integrations</h3>
              <p className="text-[11px] text-[#64748b]">Manage your third-party service connections</p>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {INTEGRATIONS.map((integration) => (
                <div key={integration.id} className="px-5 py-4 flex items-center justify-between hover:bg-[#f8faff] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{integration.icon}</span>
                    <div>
                      <h4 className="text-[12px] font-semibold text-[#0f172a]">{integration.name}</h4>
                      <p className="text-[11px] text-[#64748b]">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "flex items-center gap-1 text-[11px] px-2 py-1 rounded-full",
                      integration.status === "connected" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {integration.status === "connected" ? (
                        <><CheckCircle className="h-3 w-3" /> Connected</>
                      ) : (
                        <><AlertCircle className="h-3 w-3" /> Limited</>
                      )}
                    </span>
                    <button className="p-1.5 hover:bg-[#f1f5f9] rounded transition-colors">
                      <ChevronRight className="h-4 w-4 text-[#64748b]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Integration */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-[#0f172a] mb-4">Add New Integration</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Zapier", desc: "Workflow automation", icon: "⚡" },
                { name: "Slack", desc: "Team notifications", icon: "💬" },
                { name: "Google Drive", desc: "Document storage", icon: "📁" },
              ].map((item) => (
                <button key={item.name} className="p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56db] hover:bg-[#f8faff] transition-colors text-left">
                  <span className="text-[24px] mb-2 block">{item.icon}</span>
                  <h4 className="text-[12px] font-semibold text-[#0f172a]">{item.name}</h4>
                  <p className="text-[10px] text-[#64748b]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── LLM Configuration Tab ─── */}
      {activeTab === "llm" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-[#1a56db]" />
              <h3 className="text-[13px] font-bold text-[#0f172a]">LLM Provider Configuration</h3>
            </div>
            <p className="text-[11px] text-[#64748b]">Configure your preferred Large Language Model provider</p>
          </div>
          
          <div className="p-5 space-y-5">
            {/* Provider Selection */}
            <div>
              <label className="block text-[10px] font-semibold text-[#64748b] mb-2">Provider</label>
              <div className="space-y-2">
                {LLM_PROVIDERS.map((provider) => (
                  <label key={provider.id} className="flex items-center gap-3 p-3 border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff] cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="llm"
                      value={provider.id}
                      checked={selectedLLM === provider.id}
                      onChange={(e) => {
                        setSelectedLLM(e.target.value);
                        setSelectedModel(provider.models[0]);
                      }}
                      className="w-4 h-4 text-[#1a56db] focus:ring-[#1a56db]"
                    />
                    <div className="flex-1">
                      <span className="text-[12px] font-medium text-[#334155]">{provider.name}</span>
                      {provider.id === "ollama" && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">RECOMMENDED</span>
                      )}
                      <p className="text-[10px] text-[#94a3b8]">
                        {provider.id === "ollama" ? "Run models locally without API costs" : "Cloud-based with per-token pricing"}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                >
                  {LLM_PROVIDERS.find(p => p.id === selectedLLM)?.models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={selectedLLM === "ollama" ? "Not required for local LLM" : "Enter your API key"}
                    disabled={selectedLLM === "ollama"}
                    className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] disabled:bg-[#f1f5f9] disabled:text-[#94a3b8]"
                  />
                </div>
              </div>
            </div>

            {/* Test Connection */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium text-[#1a56db] border border-[#1a56db] rounded-lg hover:bg-[#eff6ff] transition-colors">
                <Power className="h-3.5 w-3.5" />
                Test LLM Connection
              </button>
              {selectedLLM === "ollama" && (
                <span className="flex items-center gap-1 text-[11px] text-green-600">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Local Ollama detected
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Navigation Tab ─── */}
      {activeTab === "navigation" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="h-4 w-4 text-[#1a56db]" />
                <h3 className="text-[13px] font-bold text-[#0f172a]">Navigation Visibility by Role</h3>
              </div>
              <p className="text-[11px] text-[#64748b]">Control which navigation items are visible to each user role. Toggle visibility per role.</p>
            </div>

            {/* Role Headers */}
            <div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] gap-2 px-5 py-2 bg-[#f8faff] border-b border-[#e2e8f0] text-[9px] font-bold text-[#64748b] uppercase tracking-wide">
              <div>Navigation Item</div>
              {ROLES.map((role) => (
                <div key={role} className="text-center">{role}</div>
              ))}
            </div>

            {/* Navigation Items */}
            <div className="divide-y divide-[#f1f5f9]">
              {navPermissions.map((category, catIdx) => (
                <div key={category.category}>
                  <div className="px-5 py-2 bg-[#f1f5f9] text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                    {category.category}
                  </div>
                  {category.items.map((item, itemIdx) => (
                    <div 
                      key={item.id} 
                      className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] gap-2 px-5 py-3 items-center hover:bg-[#f8faff] transition-colors"
                    >
                      <div>
                        <div className="text-[12px] font-medium text-[#334155]">{item.name}</div>
                        <div className="text-[9px] text-[#94a3b8]">{item.path}</div>
                      </div>
                      {ROLES.map((role) => {
                        const roleKey = role.toLowerCase().replace(" ", "") as keyof typeof item.roles;
                        const isEnabled = item.roles[roleKey];
                        return (
                          <div key={role} className="flex justify-center">
                            <button
                              onClick={() => togglePermission(catIdx, itemIdx, role)}
                              className={cn(
                                "w-8 h-4 rounded-full transition-colors relative",
                                isEnabled ? "bg-green-500" : "bg-[#e2e8f0]"
                              )}
                            >
                              <span className={cn(
                                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                                isEnabled ? "left-[17px]" : "left-0.5"
                              )} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Database className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[12px] font-semibold text-blue-700">Navigation permissions are role-based</h4>
              <p className="text-[11px] text-blue-600 mt-1">
                Changes take effect immediately for all users with the affected roles. Users must refresh their browser to see changes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── SAM.gov Tester Tab ─── */}
      {activeTab === "samgov-tester" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 mb-1">
              <Search className="h-4 w-4 text-[#1a56db]" />
              <h3 className="text-[13px] font-bold text-[#0f172a]">SAM.gov API Tester</h3>
            </div>
            <p className="text-[11px] text-[#64748b]">Test your SAM.gov connection and search capabilities with LLM-powered natural language queries</p>
          </div>
          
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#334155] mb-2">SAM.gov API Testing Tool</h4>
              <p className="text-[12px] text-[#64748b] mb-6">
                Test your SAM.gov API connection, perform searches, and experiment with natural language queries powered by various LLM providers (OpenAI, Claude, Ollama, LM Studio).
              </p>
              <Link
                href="/fedsignal/settings/samgov-tester"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-[12px] font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                Open SAM.gov Tester
              </Link>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <h5 className="text-[11px] font-semibold text-blue-700 mb-2">Features:</h5>
                <ul className="text-[10px] text-blue-600 space-y-1">
                  <li>• Test SAM.gov API connectivity</li>
                  <li>• Structured search with advanced filters</li>
                  <li>• Natural language search with LLM interpretation</li>
                  <li>• Support for multiple LLM providers</li>
                  <li>• Real-time search results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Other Tabs (Placeholders) ─── */}
      {!["integrations", "llm", "navigation", "samgov-tester"].includes(activeTab) && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-8">
          <div className="text-center">
            <Settings className="h-12 w-12 text-[#e2e8f0] mx-auto mb-3" />
            <h3 className="text-[14px] font-semibold text-[#64748b]">{TABS.find(t => t.id === activeTab)?.label} settings coming soon</h3>
            <p className="text-[12px] text-[#94a3b8] mt-1">This section is under development.</p>
          </div>
        </div>
      )}
    </div>
  );
}
