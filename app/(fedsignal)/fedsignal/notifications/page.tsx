"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bell, Mail, Smartphone, AlertTriangle, CheckCircle, Save } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const NOTIFICATION_CATEGORIES = [
  {
    id: "opportunities",
    label: "New Opportunities",
    description: "Get notified when new federal contracts match your university's capabilities",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "alerts",
    label: "Strategic Alerts",
    description: "Important policy changes, deadlines, and funding announcements",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "team",
    label: "Team Activity",
    description: "When team members update opportunities, notes, or assignments",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "reports",
    label: "Report Generation",
    description: "When your scheduled reports are ready for download",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "newsletter",
    label: "Newsletter Engagement",
    description: "Open rates, click rates, and subscriber activity",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "system",
    label: "System Updates",
    description: "Platform maintenance, new features, and version updates",
    email: true,
    push: true,
    sms: false,
  },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(NOTIFICATION_CATEGORIES);
  const [digestFrequency, setDigestFrequency] = useState("daily");
  const [quietHours, setQuietHours] = useState({ enabled: true, start: "22:00", end: "08:00" });

  const toggleSetting = (id: string, channel: "email" | "push" | "sms") => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, [channel]: !s[channel] } : s
    ));
  };

  return (
    <div className="space-y-4">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">Notifications</h1>
          <p className="text-[12px] text-[#64748b]">
            Choose how you want to be notified about activity in your account
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#1a56db] rounded-md hover:bg-[#1a56db]/90">
          <Save className="h-3.5 w-3.5" />
          Save Preferences
        </button>
      </div>

      {/* ─── Contact Methods ─── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#1a56db]" />
          </div>
          <div>
            <p className="text-[11px] text-[#64748b]">Primary Email</p>
            <p className="text-[12px] font-semibold text-[#0f172a]">bstittt@strategicvaluesolutions.com</p>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-[11px] text-[#64748b]">SMS Number</p>
            <p className="text-[12px] font-semibold text-[#0f172a]">+1 (919) 555-0175</p>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Bell className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-[11px] text-[#64748b]">Push Notifications</p>
            <p className="text-[12px] font-semibold text-[#0f172a]">Enabled in browser</p>
          </div>
        </div>
      </div>

      {/* ─── Notification Preferences ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-[#0f172a]">Notification Preferences</h3>
            <p className="text-[11px] text-[#64748b]">Select how you receive updates for each category</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#64748b]">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email</span>
            <span className="flex items-center gap-1"><Bell className="h-3 w-3" /> Push</span>
            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> SMS</span>
          </div>
        </div>
        
        <div className="divide-y divide-[#f1f5f9]">
          {settings.map((category) => (
            <div key={category.id} className="px-5 py-4 flex items-center justify-between hover:bg-[#f8faff] transition-colors">
              <div className="flex-1 pr-4">
                <h4 className="text-[12px] font-semibold text-[#0f172a]">{category.label}</h4>
                <p className="text-[11px] text-[#64748b]">{category.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.email}
                    onChange={() => toggleSetting(category.id, "email")}
                    className="w-4 h-4 rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <span className="text-[9px] text-[#94a3b8]">Email</span>
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.push}
                    onChange={() => toggleSetting(category.id, "push")}
                    className="w-4 h-4 rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <span className="text-[9px] text-[#94a3b8]">Push</span>
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.sms}
                    onChange={() => toggleSetting(category.id, "sms")}
                    className="w-4 h-4 rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <span className="text-[9px] text-[#94a3b8]">SMS</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Digest Settings ─── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <h3 className="text-[13px] font-bold text-[#0f172a] mb-4">Email Digest Frequency</h3>
          <div className="space-y-2">
            {[
              { id: "realtime", label: "Real-time", desc: "Send immediately" },
              { id: "daily", label: "Daily Digest", desc: "Summary every morning at 8 AM" },
              { id: "weekly", label: "Weekly Digest", desc: "Monday summary of the week" },
            ].map((option) => (
              <label key={option.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#f8faff] cursor-pointer">
                <input
                  type="radio"
                  name="digest"
                  value={option.id}
                  checked={digestFrequency === option.id}
                  onChange={(e) => setDigestFrequency(e.target.value)}
                  className="mt-0.5 w-4 h-4 text-[#1a56db] focus:ring-[#1a56db]"
                />
                <div>
                  <span className="text-[12px] font-medium text-[#334155]">{option.label}</span>
                  <p className="text-[10px] text-[#94a3b8]">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-[#0f172a]">Quiet Hours</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quietHours.enabled}
                onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1a56db]"></div>
            </label>
          </div>
          <p className="text-[11px] text-[#64748b] mb-4">Pause non-critical notifications during your quiet hours</p>
          
          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={quietHours.start}
                  onChange={(e) => setQuietHours({ ...quietHours, start: e.target.value })}
                  className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">End Time</label>
                <input
                  type="time"
                  value={quietHours.end}
                  onChange={(e) => setQuietHours({ ...quietHours, end: e.target.value })}
                  className="w-full px-3 py-2 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Info Banner ─── */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[12px] font-semibold text-amber-700">Critical notifications always enabled</h4>
          <p className="text-[11px] text-amber-600 mt-1">
            Security alerts, password resets, and account suspensions will always be sent via email regardless of your preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
