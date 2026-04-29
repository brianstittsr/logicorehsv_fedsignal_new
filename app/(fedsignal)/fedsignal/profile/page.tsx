"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Upload, Building2, MapPin, Mail, Phone, User, Briefcase,
  Shield, Save, Lock, Edit3
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "professional", label: "Professional" },
  { id: "contacts", label: "Contacts" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    firstName: "Brian",
    lastName: "Stitt",
    email: "bstittt@strategicvaluesolutions.com",
    phone: "919-555-0175",
    company: "Strategic Value Plus Solutions (SV), LLC",
    location: "Raleigh, North Carolina",
    title: "Chief Technology Officer (CTO)",
    bio: "Brian Stitt is the Chief Technology Officer (CTO) of Strategic Value Plus Solutions, LLC, where he leads technology strategy, communications, and solution design across multiple industry verticals. He oversees the integration of platforms and data, ensuring seamless collaboration and clear communication between stakeholders, decision-makers, and strategic partners while driving scalable, value-focused solutions.",
    memberSince: "12/20/2020",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">My Profile</h1>
          <p className="text-[12px] text-[#64748b]">
            Manage your profile, networking preferences, and SVP tools
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#1a56db] rounded-md hover:bg-[#1a56db]/90">
          <Save className="h-3.5 w-3.5" />
          Save Changes
        </button>
      </div>

      {/* ─── Profile Card ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a56db] to-[#7c3aed] flex items-center justify-center text-[28px] font-bold text-white">
                BS
              </div>
              <button className="flex items-center gap-1 text-[10px] text-[#1a56db] hover:underline">
                <Upload className="h-3 w-3" />
                Upload Photo
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[18px] font-bold text-[#0f172a]">{formData.firstName} {formData.lastName}</h2>
                <span className="px-2 py-0.5 bg-[#1a56db] text-white text-[9px] font-bold rounded">Platform Admin</span>
              </div>
              <p className="text-[13px] text-[#64748b] mb-3">{formData.title}</p>
              
              <div className="flex flex-wrap gap-4 text-[11px] text-[#64748b]">
                <div className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {formData.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {formData.location}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#94a3b8]">Member since {formData.memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#f8faff] border-t border-[#e2e8f0] text-[10px] text-[#94a3b8]">
          Changes to your profile will be reviewed by 4E/24301
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="border-b border-[#e2e8f0]">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 text-[12px] font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-[#1a56db] text-[#1a56db]"
                  : "border-transparent text-[#64748b] hover:text-[#334155]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Basic Info Tab ─── */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8faff]">
              <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide">Personal Information</h3>
              <p className="text-[10px] text-[#64748b]">Your basic contact and company details</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Bio</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8faff]">
              <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide">Role & Permissions</h3>
              <p className="text-[10px] text-[#64748b]">Your access level and assigned areas</p>
            </div>
            <div className="p-5">
              <div className="p-3 bg-[#e2e8f0] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-[#1a56db]" />
                  <span className="text-[13px] font-semibold text-[#0f172a]">Platform Admin</span>
                </div>
                <p className="text-[11px] text-[#64748b] pl-6">Full system access • Platform administration</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8faff]">
              <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wide">Change Password</h3>
              <p className="text-[10px] text-[#64748b]">Update your account security</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                    />
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold text-white bg-[#1a56db] rounded-lg hover:bg-[#1a56db]/90 w-fit">
                  <Edit3 className="h-3.5 w-3.5" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Professional Tab (Placeholder) ─── */}
      {activeTab === "professional" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-8">
          <div className="text-center">
            <Briefcase className="h-12 w-12 text-[#e2e8f0] mx-auto mb-3" />
            <h3 className="text-[14px] font-semibold text-[#64748b]">Professional details coming soon</h3>
            <p className="text-[12px] text-[#94a3b8] mt-1">This section will include work history, certifications, and expertise areas.</p>
          </div>
        </div>
      )}

      {/* ─── Contacts Tab (Placeholder) ─── */}
      {activeTab === "contacts" && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-8">
          <div className="text-center">
            <User className="h-12 w-12 text-[#e2e8f0] mx-auto mb-3" />
            <h3 className="text-[14px] font-semibold text-[#64748b]">Contact management coming soon</h3>
            <p className="text-[12px] text-[#94a3b8] mt-1">This section will include your network connections and contact preferences.</p>
          </div>
        </div>
      )}
    </div>
  );
}
