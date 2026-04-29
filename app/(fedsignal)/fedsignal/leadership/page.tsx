"use client";

import { User, Mail, Phone, Plus, Pencil } from "lucide-react";

const leadershipTeam = [
  { id: "1", name: "Dr. Charlotte Morris", role: "President", department: "Office of the President", email: "cmorris@tuskegee.edu", phone: "(334) 727-8011", primary: true },
  { id: "2", name: "Dr. William Campbell", role: "VP Research", department: "Research & Innovation", email: "wcampbell@tuskegee.edu", phone: "(334) 727-8012", primary: true },
  { id: "3", name: "Dr. Angela Foster", role: "Dean, Engineering", department: "College of Engineering", email: "afoster@tuskegee.edu", phone: "(334) 727-8456", primary: false },
  { id: "4", name: "Dr. Marcus Wright", role: "Director, Sponsored Programs", department: "Research Administration", email: "mwright@tuskegee.edu", phone: "(334) 727-8923", primary: true },
];

export default function LeadershipPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
            <User className="h-5 w-5 text-[#64748b]" />
            Leadership
          </h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">
            Manage institutional leadership contacts for proposals
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 bg-[#1a56db] text-white rounded hover:bg-[#1549c0] transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add Leader
        </button>
      </div>

      {/* Leader Cards */}
      <div className="space-y-3">
        {leadershipTeam.map((leader) => (
          <div
            key={leader.id}
            className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-5 py-4 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#e8edf5] flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="h-5 w-5 text-[#64748b]" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-[#0f172a]">{leader.name}</span>
                {leader.primary && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1e3a5f] text-white">
                    Primary Contact
                  </span>
                )}
              </div>
              <div className="text-[12px] text-[#64748b]">{leader.role}</div>
              <div className="text-[12px] text-[#64748b]">{leader.department}</div>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="flex items-center gap-1 text-[12px] text-[#64748b]">
                  <Mail className="h-3.5 w-3.5" />
                  {leader.email}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-[#64748b]">
                  <Phone className="h-3.5 w-3.5" />
                  {leader.phone}
                  <span className="text-green-500 text-[10px]">✓</span>
                </span>
              </div>
            </div>

            {/* Edit icon */}
            <button className="text-[#94a3b8] hover:text-[#64748b] transition-colors mt-0.5 flex-shrink-0">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
