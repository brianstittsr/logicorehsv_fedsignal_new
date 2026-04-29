"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { universityList } from "@/lib/fedsignal/utils";
import { User, Bell, Settings, LogOut, ChevronUp } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: "red" | "amber" | "default";
  href: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Intelligence",
    items: [
      { id: "dashboard", label: "Command Center", icon: "⬡", href: "/fedsignal" },
      { id: "opportunities", label: "Opportunity Feed", icon: "📡", badge: "47", href: "/fedsignal/opportunities" },
      { id: "radar", label: "FedSignal", icon: "📊", href: "/fedsignal/radar" },
      { id: "alerts", label: "Strategic Alerts", icon: "🔔", badge: "6", badgeColor: "red", href: "/fedsignal/alerts" },
      { id: "nationallabs", label: "National Labs", icon: "🔬", badge: "17 Labs", href: "/fedsignal/nationallabs" },
    ],
  },
  {
    label: "University",
    items: [
      { id: "capabilities", label: "Capability Graph", icon: "🔬", href: "/fedsignal/capabilities" },
      { id: "leadership", label: "Leadership", icon: "👤", href: "/fedsignal/leadership" },
      { id: "scoreboard", label: "HBCU Scoreboard", icon: "🏆", href: "/fedsignal/scoreboard" },
    ],
  },
  {
    label: "Partnerships",
    items: [
      { id: "directory", label: "HBCU Network", icon: "🎓", badge: "101", href: "/fedsignal/directory" },
      { id: "marketplace", label: "Contractor Market", icon: "🤝", href: "/fedsignal/marketplace" },
      { id: "consortium", label: "Consortiums", icon: "⬡", badge: "3", badgeColor: "amber", href: "/fedsignal/consortium" },
    ],
  },
  {
    label: "Win Tools",
    items: [
      { id: "proposalpal", label: "Proposal Pal", icon: "🏆", badge: "AI", href: "/fedsignal/proposalpal" },
      { id: "rficreator", label: "RFI Creator", icon: "📝", badge: "AI", href: "/fedsignal/rficreator" },
    ],
  },
  {
    label: "Content & Growth",
    items: [
      { id: "capvault", label: "Capability Vault", icon: "🗂️", href: "/fedsignal/capvault" },
      { id: "contentstudio", label: "Content Studio", icon: "✨", badge: "AI", href: "/fedsignal/contentstudio" },
      { id: "calendar", label: "Content Calendar", icon: "📅", href: "/fedsignal/calendar" },
    ],
  },
  {
    label: "BD & CRM",
    items: [
      { id: "crm", label: "CRM & Contacts", icon: "👥", badge: "PRO", badgeColor: "amber", href: "/fedsignal/crm" },
      { id: "winloss", label: "Win/Loss Tracker", icon: "📊", href: "/fedsignal/winloss" },
      { id: "subplan", label: "Sub Plan Finder", icon: "🔍", href: "/fedsignal/subplan" },
      { id: "teaming", label: "Teaming Generator", icon: "🤝", href: "/fedsignal/teaming" },
    ],
  },
  {
    label: "Research Tools",
    items: [
      { id: "sbir", label: "SBIR/STTR Match", icon: "🚀", href: "/fedsignal/sbir" },
      { id: "fanda", label: "F&A Calculator", icon: "📊", href: "/fedsignal/fanda" },
    ],
  },
  {
    label: "Publish",
    items: [
      { id: "newsletter", label: "Newsletter Builder", icon: "📧", badge: "PRO", href: "/fedsignal/newsletter" },
      { id: "gamma", label: "Gamma Deck", icon: "🎯", badge: "AI", href: "/fedsignal/gamma" },
    ],
  },
  {
    label: "Reports",
    items: [
      { id: "grants", label: "Grant Tracker", icon: "📋", href: "/fedsignal/grants" },
      { id: "reporthub", label: "Report Hub", icon: "📊", badge: "PRO", href: "/fedsignal/reporthub" },
      { id: "board", label: "Board Report", icon: "📑", href: "/fedsignal/board" },
    ],
  },
  {
    label: "Branding",
    items: [
      { id: "hbcudir", label: "HBCU/MSI Directory", icon: "🎓", badge: "101", href: "/fedsignal/hbcudir" },
      { id: "branding", label: "University Branding", icon: "🎨", href: "/fedsignal/branding" },
    ],
  },
  {
    label: "Executive",
    items: [
      { id: "presidentbrief", label: "President's Brief", icon: "👔", badge: "ADD-ON", badgeColor: "amber", href: "/fedsignal/presidentbrief" },
      { id: "pricing", label: "Plans & Pricing", icon: "💳", href: "/fedsignal/pricing" },
    ],
  },
];

interface FSSidebarProps {
  universityId?: string;
  onUniversityChange?: (id: string) => void;
}

export function FSSidebar({ universityId = "tuskegee", onUniversityChange }: FSSidebarProps) {
  const pathname = usePathname();
  const [selectedUni, setSelectedUni] = useState(universityId);

  const handleUniChange = (value: string) => {
    setSelectedUni(value);
    onUniversityChange?.(value);
  };

  const isActive = (href: string) => {
    if (href === "/fedsignal" && pathname === "/fedsignal") return true;
    if (href !== "/fedsignal" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="w-[230px] flex-shrink-0 flex flex-col h-screen overflow-y-auto overflow-x-hidden bg-[#0f2a4a] text-white">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-extrabold text-white bg-[#1a56db]">
          FS
        </div>
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
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-2">
        {navSections.map((section) => (
          <div key={section.label} className="py-1">
            <div className="px-4 py-1.5 text-[9px] font-bold tracking-[0.15em] uppercase text-white/35">
              {section.label}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 border-l-[3px] transition-all duration-150",
                  isActive(item.href)
                    ? "bg-[rgba(26,86,219,0.25)] text-white border-l-[#4d94ff] font-semibold"
                    : "border-l-transparent hover:bg-white/[0.07] hover:text-white hover:border-l-[rgba(77,148,255,0.5)]"
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
        ))}
      </div>

      {/* User Profile Section */}
      <div className="relative p-3 border-t border-white/10">
        <UserProfileDropdown />
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
    </nav>
  );
}

// User Profile Dropdown Component
function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, href: "/fedsignal/profile" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/fedsignal/notifications" },
    { id: "settings", label: "Settings", icon: Settings, href: "/fedsignal/settings" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2.5 bg-white/[0.08] border border-white/15 rounded hover:bg-white/[0.15] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center text-sm font-semibold text-white">
          BS
        </div>
        <div className="flex-1 text-left">
          <div className="text-[12px] font-semibold text-white">Brian Stitt</div>
          <div className="text-[10px] text-white/60">Platform Admin</div>
        </div>
        <ChevronUp className={cn("h-4 w-4 text-white/60 transition-transform", !isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-[#e2e8f0] overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#e2e8f0]">
              <span className="text-[13px] font-semibold text-[#0f172a]">My Account</span>
            </div>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors",
                    isActive(item.href)
                      ? "bg-[#eff6ff] text-[#1a56db]"
                      : "text-[#334155] hover:bg-[#f8faff]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="border-t border-[#e2e8f0]">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
