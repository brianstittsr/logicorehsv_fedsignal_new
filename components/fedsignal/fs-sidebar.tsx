"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { universityList } from "@/lib/fedsignal/utils";
import { ChevronDown, ChevronRight, User, Settings, LogOut } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: "red" | "amber" | "default";
  href: string;
  step?: number;
}

interface NavSection {
  label: string;
  icon?: string;
  items: NavItem[];
  highlight?: boolean;
}

const navSections: NavSection[] = [
  {
    label: "🏠 Home",
    icon: "🏠",
    items: [
      { id: "dashboard", label: "Command Center", icon: "⬡", href: "/fedsignal" },
      { id: "recommendations", label: "AI Recommendations", icon: "✨", badge: "AI", href: "/fedsignal/recommendations" },
      { id: "alerts", label: "Strategic Alerts", icon: "�", badge: "6", badgeColor: "red", href: "/fedsignal/alerts" },
      { id: "board", label: "Board Report", icon: "📑", href: "/fedsignal/board" },
    ],
  },
  {
    label: "🔍 Opportunity Intel",
    icon: "🔍",
    items: [
      { id: "opportunities", label: "Opportunity Feed", icon: "📡", badge: "47", href: "/fedsignal/opportunities" },
      { id: "sbir", label: "SBIR / STTR Tracker", icon: "�", href: "/fedsignal/sbir" },
      { id: "radar", label: "FedSignal Radar", icon: "📊", href: "/fedsignal/radar" },
      { id: "scoreboard", label: "HBCU Scoreboard", icon: "🏆", href: "/fedsignal/scoreboard" },
    ],
  },
  {
    label: "📋 Submission Pipeline",
    icon: "📋",
    highlight: true,
    items: [
      { id: "pipeline", label: "① Identify → Pipeline", icon: "🎯", href: "/fedsignal/pipeline", step: 1 },
      { id: "proposalpal", label: "② Proposal Pal", icon: "🏆", badge: "AI", href: "/fedsignal/proposalpal" },
      { id: "rficreator", label: "③ RFI Creator", icon: "📝", badge: "AI", href: "/fedsignal/rficreator" },
      { id: "fanda", label: "④ F&A Calculator", icon: "🧮", href: "/fedsignal/fanda" },
      { id: "grants", label: "⑤ Grant Tracker", icon: "📋", href: "/fedsignal/grants" },
      { id: "winloss", label: "⑥ Win/Loss Tracker", icon: "📈", href: "/fedsignal/winloss" },
    ],
  },
  {
    label: "🤝 Partnerships & BD",
    icon: "🤝",
    items: [
      { id: "directory", label: "HBCU Network", icon: "🎓", badge: "101", href: "/fedsignal/directory" },
      { id: "consortium", label: "Consortiums", icon: "⬡", badge: "3", badgeColor: "amber", href: "/fedsignal/consortium" },
      { id: "teaming", label: "Teaming", icon: "🤜🤛", href: "/fedsignal/teaming" },
      { id: "subplan", label: "Sub-Contracting Plan", icon: "📄", href: "/fedsignal/subplan" },
      { id: "marketplace", label: "Contractor Market", icon: "🤝", href: "/fedsignal/marketplace" },
      { id: "crm", label: "CRM & Contacts", icon: "�", badge: "PRO", badgeColor: "amber", href: "/fedsignal/crm" },
      { id: "contacts", label: "Contacts", icon: "📇", href: "/fedsignal/contacts" },
    ],
  },
  {
    label: "📁 Capability & Content",
    icon: "📁",
    items: [
      { id: "capabilities", label: "Capability Graph", icon: "🔬", href: "/fedsignal/capabilities" },
      { id: "capvault", label: "Capability Vault", icon: "🗂️", href: "/fedsignal/capvault" },
      { id: "gammadeck", label: "GammaDeck (Pitch Decks)", icon: "📊", href: "/fedsignal/gammadeck" },
      { id: "contentstudio", label: "Content Studio", icon: "✨", badge: "AI", href: "/fedsignal/contentstudio" },
      { id: "calendar", label: "Content Calendar", icon: "📅", href: "/fedsignal/calendar" },
      { id: "newsletter", label: "Newsletter", icon: "�", href: "/fedsignal/newsletter" },
      { id: "leadership", label: "Leadership", icon: "�", href: "/fedsignal/leadership" },
    ],
  },
  {
    label: "⚙️ System",
    icon: "⚙️",
    items: [
      { id: "settings", label: "Settings", icon: "⚙️", href: "/fedsignal/settings" },
      { id: "bug-tracker", label: "Bug Tracker", icon: "🐛", badge: "4", badgeColor: "red", href: "/fedsignal/bug-tracker" },
      { id: "admin", label: "Admin Panel", icon: "🔐", href: "/portal/admin/fedsignal" },
    ],
  },
];

interface FSSidebarProps {
  universityId?: string;
  onUniversityChange?: (id: string) => void;
}

export function FSSidebar({ universityId = "huston-tillotson", onUniversityChange }: FSSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedUni, setSelectedUni] = useState(universityId);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    "🏠 Home": false,
    "🔍 Opportunity Intel": false,
    "📋 Submission Pipeline": false,
    "🤝 Partnerships & BD": true,
    "📁 Capability & Content": true,
    "⚙️ System": true,
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUniChange = (value: string) => {
    setSelectedUni(value);
    onUniversityChange?.(value);
  };

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/fedsignal" && pathname === "/fedsignal") return true;
    if (href !== "/fedsignal" && pathname.startsWith(href)) return true;
    return false;
  };

  const isInPipeline = pathname === "/fedsignal/pipeline" || pathname.startsWith("/fedsignal/pipeline/");

  return (
    <nav className="w-[240px] flex-shrink-0 flex flex-col h-screen overflow-y-auto overflow-x-hidden bg-[#0f2a4a] text-white">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <Image
          src="/mascots/huston-tillotson.png"
          alt="Huston-Tillotson University"
          width={36}
          height={36}
          className="w-9 h-9 rounded-md object-contain"
        />
        <div className="text-lg font-extrabold tracking-tight">
          Fed<span className="text-[#4d94ff]">Signal</span>
        </div>
      </div>

      {/* University Selector */}
      <div className="p-3 border-b border-white/10">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5">
          Institution
        </div>
        <select
          value={selectedUni}
          onChange={(e) => handleUniChange(e.target.value)}
          className="w-full bg-white/[0.08] border border-white/[0.12] text-white text-xs py-2 px-2.5 rounded outline-none focus:border-[#4d94ff] cursor-pointer"
        >
          {universityList.map((u) => (
            <option key={u.value} value={u.value} className="bg-[#0f2a4a] text-white">
              {u.mascot} {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pipeline Progress Indicator */}
      {isInPipeline && (
        <div className="mx-3 mt-3 p-2.5 bg-gradient-to-r from-[#1a56db]/30 to-[#4d94ff]/20 border border-[#4d94ff]/40 rounded-lg">
          <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-[#4d94ff] mb-1.5">
            Submission Pipeline
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
                  pathname.includes(`step=${step}`) || (step === 1 && pathname === "/fedsignal/pipeline")
                    ? "bg-[#4d94ff]"
                    : "bg-white/20"
                )}
              />
            ))}
          </div>
          <div className="text-[10px] text-white/60 mt-1.5">
            Step {new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("step") || "1"} of 4
          </div>
        </div>
      )}

      {/* User Profile Dropdown */}
      <div className="p-3 border-b border-white/10 relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-2.5 p-2.5 bg-white/[0.08] border border-white/15 rounded text-xs text-white hover:bg-white/[0.15] transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="flex-1 text-left">Profile</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        {showUserMenu && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-[#1a365d] border border-white/20 rounded-lg shadow-xl z-50">
            <Link
              href="/fedsignal/profile/huston-tillotson"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/[0.1] hover:text-white transition-colors"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>
            <Link
              href="/fedsignal/settings"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/[0.1] hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={() => {
                sessionStorage.clear();
                router.push("/fedsignal");
                setShowUserMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/[0.1] hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-2">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections[section.label];
          const isPipeline = section.highlight;
          return (
            <div key={section.label} className={cn("py-1", isPipeline && "px-2")}>
              <button
                onClick={() => toggleSection(section.label)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors rounded-md",
                  isPipeline
                    ? "text-[#4d94ff] bg-gradient-to-r from-[#1a56db]/20 to-transparent border border-[#4d94ff]/30"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span className="flex-1 text-left">{section.label}</span>
              </button>
              {!isCollapsed && section.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 border-l-[3px] transition-all duration-150",
                    isActive(item.href)
                      ? "bg-[rgba(26,86,219,0.25)] text-white border-l-[#4d94ff] font-semibold"
                      : "border-l-transparent hover:bg-white/[0.07] hover:text-white hover:border-l-[rgba(77,148,255,0.5)]",
                    item.step && "pl-6"
                  )}
                >
                  <span className="text-[15px] w-4 text-center flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap",
                        item.badgeColor === "red" && "bg-red-600/75 text-white",
                        item.badgeColor === "amber" && "bg-amber-600/75 text-white",
                        !item.badgeColor && "bg-white/20 text-white"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          );
        })}
      </div>

      {/* Back to main site */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2.5 p-2.5 bg-white/[0.08] border border-white/15 rounded text-xs text-white/70 hover:bg-white/[0.15] hover:text-white transition-colors"
        >
          ← Back to LogiCore HSV
        </Link>
      </div>

      {/* Floating Hermes AI Button */}
      <div className="p-3">
        <button
          onClick={() => {
            // Trigger Hermes chat via global event
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("toggleHermesChat"));
            }
          }}
          className="w-full flex items-center gap-2.5 p-3 bg-gradient-to-r from-[#1a56db] to-[#4d94ff] border border-[#4d94ff]/50 rounded-lg text-xs text-white font-semibold hover:from-[#1e4bb8] hover:to-[#3d7fd9] transition-all shadow-lg shadow-[#1a56db]/25"
        >
          <span className="text-lg">🤖</span>
          <span className="flex-1 text-left">Ask Hermes AI</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">AI</span>
        </button>
      </div>
    </nav>
  );
}
