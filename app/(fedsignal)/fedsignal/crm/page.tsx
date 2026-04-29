"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Users, Search, Plus, Upload, Mail, Phone, Building2, Briefcase, Calendar, MapPin, Tag, ArrowUpRight } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
type ContactType = "prime" | "agency" | "hbcu" | "teaming" | "cotr";

interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone?: string;
  type: ContactType;
  tags: string[];
  location: string;
  lastContact: string;
  lastActivity: string;
  priority: "high" | "medium" | "low";
  notes?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const CONTACTS: Contact[] = [
  { id: "1", name: "Dr. Patricia Williams", role: "Program Officer", organization: "NIH NIMHD", email: "patricia.williams@nih.gov", phone: "(301) 555-0127", type: "agency", tags: ["NIH", "Health Equity"], location: "Bethesda, MD", lastContact: "Mar 15", lastActivity: "Email – Proposal feedback", priority: "high", notes: "Interested in HBCU partnerships for FY26." },
  { id: "2", name: "Marcus Johnson", role: "VP Research", organization: "Howard University", email: "mjohnson@howard.edu", phone: "(202) 555-0123", type: "hbcu", tags: ["HBCU Lead", "Research"], location: "Washington, DC", lastContact: "Mar 12", lastActivity: "Call – Consortium discussion", priority: "high", notes: "Key partner for HBCU Cyber Defense Alliance." },
  { id: "3", name: "Sarah Chen", role: "Contracts Specialist", organization: "DOD SBIR", email: "sarah.chen@sbir.mil", phone: "(703) 555-0456", type: "agency", tags: ["SBIR", "DoD"], location: "Arlington, VA", lastContact: "Mar 18", lastActivity: "Meeting – Phase I closeout", priority: "medium", notes: "Fast responder on contract mods." },
  { id: "4", name: "Dr. Robert Taylor", role: "Research Director", organization: "NC A&T State", email: "rtaylor@ncat.edu", phone: "(336) 555-0456", type: "hbcu", tags: ["HBCU Lead", "Engineering"], location: "Greensboro, NC", lastContact: "Mar 10", lastActivity: "Email – Joint proposal", priority: "medium" },
  { id: "5", name: "Jennifer Martinez", role: "COTR", organization: "Army Research Lab", email: "j.martinez@arl.army.mil", phone: "(410) 555-0987", type: "agency", tags: ["COTR", "Army"], location: "Adelphi, MD", lastContact: "Mar 19", lastActivity: "Site visit – Lab tour", priority: "high", notes: "Wants quarterly updates." },
  { id: "6", name: "David Park", role: "CEO", organization: "SecureTech Solutions", email: "dpark@securetech.com", phone: "(703) 555-0321", type: "prime", tags: ["Prime", "Cyber"], location: "Reston, VA", lastContact: "Mar 14", lastActivity: "Email – Teaming inquiry", priority: "high", notes: "Looking for HBCU subs on $5M contract." },
  { id: "7", name: "Angela Foster", role: "Director", organization: "L3Harris Technologies", email: "afoster@l3harris.com", phone: "(321) 555-0765", type: "prime", tags: ["Prime", "Aerospace"], location: "Melbourne, FL", lastContact: "Mar 08", lastActivity: "Call – Workforce pipeline", priority: "medium" },
  { id: "8", name: "Dr. Kwame Asante", role: "Dean", organization: "Florida A&M University", email: "kasante@famu.edu", phone: "(850) 555-0543", type: "hbcu", tags: ["HBCU Lead", "STEM"], location: "Tallahassee, FL", lastContact: "Mar 11", lastActivity: "Email – Grant collaboration", priority: "medium" },
  { id: "9", name: "Michelle Brooks", role: "Program Manager", organization: "NSA", email: "mbrooks@nsa.gov", type: "agency", tags: ["NSA", "Cyber"], location: "Fort Meade, MD", lastContact: "Mar 16", lastActivity: "Meeting – BAA briefing", priority: "high", notes: "Key influencer for HBCU cyber grants." },
  { id: "10", name: "James Wilson", role: "VP BD", organization: "Booz Allen Hamilton", email: "jwilson@bah.com", phone: "(703) 555-0876", type: "prime", tags: ["Prime", "Consulting"], location: "McLean, VA", lastContact: "Mar 13", lastActivity: "Email – RFI response", priority: "medium" },
  { id: "11", name: "Dr. Aisha Johnson", role: "Research Director", organization: "Spelman College", email: "ajohnson@spelman.edu", type: "hbcu", tags: ["HBCU Lead", "Health"], location: "Atlanta, GA", lastContact: "Mar 09", lastActivity: "Call – Consortium planning", priority: "medium" },
  { id: "12", name: "Thomas Reed", role: "Contracts Officer", organization: "ONR", email: "treed@onr.navy.mil", phone: "(703) 555-0234", type: "agency", tags: ["ONR", "Navy"], location: "Arlington, VA", lastContact: "Mar 17", lastActivity: "Email – Award notification", priority: "high" },
];

const TABS: { id: ContactType | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 147 },
  { id: "prime", label: "Primes", count: 34 },
  { id: "agency", label: "Agency", count: 28 },
  { id: "hbcu", label: "HBCU", count: 31 },
];

const KPI_CARDS = [
  { label: "Total Contacts", value: 147, color: "text-[#7A0019]" },
  { label: "Prime Contractors", value: 34, color: "text-[#1a56db]" },
  { label: "Agency Officials", value: 28, color: "text-[#047857]" },
  { label: "Active Pursuits", value: 12, color: "text-[#b45309]" },
];

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ContactType | "all">("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = useMemo(() => {
    return CONTACTS.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTab = activeTab === "all" || c.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const getTypeBadge = (type: ContactType) => {
    const styles: Record<ContactType, string> = {
      prime: "bg-blue-100 text-blue-700",
      agency: "bg-green-100 text-green-700",
      hbcu: "bg-purple-100 text-purple-700",
      teaming: "bg-amber-100 text-amber-700",
      cotr: "bg-red-100 text-red-700",
    };
    const labels: Record<ContactType, string> = {
      prime: "Prime",
      agency: "Agency",
      hbcu: "HBCU",
      teaming: "Teaming",
      cotr: "COTR",
    };
    return <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", styles[type])}>{labels[type]}</span>;
  };

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">CRM & Contact Intelligence</h1>
          <p className="text-[12px] text-[#64748b] mt-0.5">
            Track prime contractors, agency officials, and partner relationships. Every interaction logged.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff] transition-colors">
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
          <button className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#6a0015] transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Contact
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-[#e2e8f0] rounded-lg p-4 text-center shadow-sm">
            <div className={cn("text-[24px] font-extrabold", kpi.color)}>{kpi.value}</div>
            <div className="text-[11px] text-[#64748b] font-medium mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ─── Left: Contact List ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-[#f1f5f9]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-[#f1f5f9]">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium transition-colors border-b-2",
                    active
                      ? "text-[#7A0019] border-[#7A0019] bg-[#fef2f2]"
                      : "text-[#64748b] border-transparent hover:bg-[#f8faff]"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    active ? "bg-[#7A0019]/10 text-[#7A0019]" : "bg-[#f1f5f9] text-[#94a3b8]"
                  )}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contact List */}
          <div className="max-h-[500px] overflow-y-auto">
            {filteredContacts.length === 0 && (
              <div className="py-12 text-center text-[#94a3b8] text-[13px]">No contacts match your search.</div>
            )}
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b border-[#f8faff] cursor-pointer transition-colors",
                  selectedContact?.id === contact.id ? "bg-[#eff6ff]" : "hover:bg-[#f8faff]"
                )}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] font-bold text-slate-600">
                    {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#0f172a] truncate">{contact.name}</span>
                    {getTypeBadge(contact.type)}
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate">{contact.role} • {contact.organization}</div>
                </div>
                {/* Arrow */}
                <ArrowUpRight className={cn(
                  "h-4 w-4 flex-shrink-0",
                  selectedContact?.id === contact.id ? "text-[#1a56db]" : "text-[#c4cdd8]"
                )} />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Right: Contact Details ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Users className="h-12 w-12 text-[#e2e8f0] mb-3" />
              <div className="text-[13px] font-semibold text-[#94a3b8]">
                Select a contact to view details
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#f1f5f9]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a56db] to-[#3b82f6] flex items-center justify-center">
                      <span className="text-[16px] font-bold text-white">
                        {selectedContact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-[#0f172a]">{selectedContact.name}</h2>
                      <p className="text-[12px] text-[#64748b]">{selectedContact.role}</p>
                    </div>
                  </div>
                  {getTypeBadge(selectedContact.type)}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
                {/* Organization */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1">Organization</div>
                  <div className="flex items-center gap-2 text-[13px] text-[#334155]">
                    <Building2 className="h-4 w-4 text-[#64748b]" />
                    {selectedContact.organization}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1">Email</div>
                    <a href={`mailto:${selectedContact.email}`} className="flex items-center gap-2 text-[13px] text-[#1a56db] hover:underline">
                      <Mail className="h-4 w-4" />
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1">Phone</div>
                      <a href={`tel:${selectedContact.phone}`} className="flex items-center gap-2 text-[13px] text-[#334155]">
                        <Phone className="h-4 w-4 text-[#64748b]" />
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1">Location</div>
                    <div className="flex items-center gap-2 text-[13px] text-[#334155]">
                      <MapPin className="h-4 w-4 text-[#64748b]" />
                      {selectedContact.location}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContact.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 bg-[#f1f5f9] text-[#64748b] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div className="bg-[#f8faff] rounded-lg p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Recent Activity
                  </div>
                  <div className="text-[12px] text-[#334155]">
                    <span className="font-semibold">{selectedContact.lastContact}:</span> {selectedContact.lastActivity}
                  </div>
                </div>

                {/* Notes */}
                {selectedContact.notes && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-1">Notes</div>
                    <p className="text-[12px] text-[#334155] leading-relaxed">{selectedContact.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-3 border-t border-[#f1f5f9] flex items-center gap-2">
                <button className="flex-1 text-[12px] font-bold py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors flex items-center justify-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Send Email
                </button>
                <button className="flex-1 text-[12px] font-bold py-2 border border-[#e2e8f0] rounded-lg text-[#334155] hover:bg-[#f8faff] transition-colors flex items-center justify-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Schedule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
