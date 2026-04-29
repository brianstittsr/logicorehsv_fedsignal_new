"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

const agencyData = [
  { agency: "DoD", value: 315 },
  { agency: "DoE", value: 180 },
  { agency: "NSF", value: 145 },
  { agency: "NASA", value: 95 },
  { agency: "NIH", value: 70 },
  { agency: "DHS", value: 38 },
];

const agencyColors = ["#7ECEF4", "#5BC08A", "#A98AE8", "#F5B942", "#7ECEF4", "#E87A7A"];

const trendData = [
  { year: "FY22", Cyber: 180, "AI/ML": 80, "Defense R&D": 120, Energy: 105 },
  { year: "FY23", Cyber: 195, "AI/ML": 110, "Defense R&D": 185, Energy: 135 },
  { year: "FY24", Cyber: 205, "AI/ML": 130, "Defense R&D": 265, Energy: 160 },
  { year: "FY25", Cyber: 220, "AI/ML": 150, "Defense R&D": 320, Energy: 195 },
];

function KPICard({
  label,
  value,
  subtext,
  badge,
  badgeColor,
}: {
  label: string;
  value: string;
  subtext: string;
  badge: string;
  badgeColor: "blue" | "green" | "amber" | "red";
}) {
  const badgeStyles = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  const valueStyles = {
    blue: "text-[#1a56db]",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600",
  };
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[#64748b] mb-2">{label}</div>
      <div className={`text-[32px] font-extrabold leading-none mb-1 ${valueStyles[badgeColor]}`}>{value}</div>
      <div className="text-xs text-[#64748b] mb-3">{subtext}</div>
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeStyles[badgeColor]}`}>{badge}</span>
    </div>
  );
}

const expiringAlerts = [
  {
    title: "Transportation Infrastructure Research",
    desc: "$500M in DoT contracts expiring Q3 2026. 6 HBCU-eligible recompetes expected.",
    tag: "18 months",
    tagColor: "text-amber-700 bg-amber-50 border-amber-300",
  },
  {
    title: "Army STEM Education Program",
    desc: "$120M expiring Dec 2026. HBCU institutions currently underrepresented.",
    tag: "21 months",
    tagColor: "text-amber-700 bg-amber-50 border-amber-300",
  },
  {
    title: "NSA University Research Centers",
    desc: "$85M program recompete. Tuskegee previously held sub-award. High renewal probability.",
    tag: "High Fit",
    tagColor: "text-green-700 bg-green-50 border-green-300",
  },
];

const intelligenceSignals = [
  {
    tag: "GROWING FAST",
    tagColor: "text-blue-700",
    borderColor: "border-l-blue-500",
    text: (
      <>
        <strong>Department of Energy AI research funding increased 37%</strong> over the last 3 years. 8 HBCU-eligible opportunities expected in FY2026 Q1.
      </>
    ),
  },
  {
    tag: "DECLINING",
    tagColor: "text-red-600",
    borderColor: "border-l-red-500",
    text: (
      <>
        <strong>NIH biomedical grants to HBCUs declined 12%</strong> in FY2025 due to budget rescissions. Diversify away from NIH as primary pipeline.
      </>
    ),
  },
  {
    tag: "NEW LANE",
    tagColor: "text-green-700",
    borderColor: "border-l-green-500",
    text: (
      <>
        <strong>CHIPS Act implementation grants opening Q2 FY2026.</strong> $200M available over 3 years. HBCU engineering programs explicitly named in statute.
      </>
    ),
  },
];

export default function RadarPage() {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="DOD AI Funding Trend"
          value="+61%"
          subtext="3-year CAGR · $142M total FY25"
          badge="↑ Rising"
          badgeColor="green"
        />
        <KPICard
          label="HBCU-Directed Federal"
          value="$855M"
          subtext="FY2025 addressable for HBCUs"
          badge="↑ +34% vs FY23"
          badgeColor="blue"
        />
        <KPICard
          label="Expiring Contracts 24M"
          value="$500M"
          subtext="Transportation research · Recompete alert"
          badge="⚠ Watch"
          badgeColor="amber"
        />
        <KPICard
          label="Your Capture Rate"
          value="1.1%"
          subtext="vs 3–5% peer average"
          badge="↑ Improving"
          badgeColor="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[13px] font-bold uppercase tracking-wide text-[#0f172a] mb-4">
            Federal Funding by Agency – HBCU Programs<br />
            <span className="font-normal text-[#64748b]">(FY2025)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={agencyData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="agency" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}
                formatter={(v: number) => [`$${v}M`, "Funding"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {agencyData.map((_, i) => (
                  <Cell key={i} fill={agencyColors[i % agencyColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[13px] font-bold uppercase tracking-wide text-[#0f172a] mb-4">
            3-Year Funding Growth Trends by Domain
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[50, 350]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e2e8f0" }} formatter={(v: number) => [`$${v}M`]} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Cyber" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="AI/ML" stroke="#c084fc" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Defense R&D" stroke="#15803d" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Energy" stroke="#92400e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Expiring Contract Alerts */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[13px] font-bold uppercase tracking-wide text-[#0f172a] mb-4">
            Expiring Contract Alerts – Next 24 Months
          </div>
          <div className="space-y-3">
            {expiringAlerts.map((alert) => (
              <div key={alert.title} className="flex items-start gap-3 p-3 border border-[#f1f5f9] rounded-lg hover:bg-[#f8faff] transition-colors">
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                  ⏱
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#0f172a] mb-0.5">{alert.title}</div>
                  <div className="text-[12px] text-[#64748b] leading-relaxed">{alert.desc}</div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${alert.tagColor}`}>
                  {alert.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Signals */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          <div className="text-[13px] font-bold uppercase tracking-wide text-[#0f172a] mb-4">
            Intelligence Signals – Funding Movements
          </div>
          <div className="space-y-3">
            {intelligenceSignals.map((signal) => (
              <div key={signal.tag} className={`pl-3 border-l-4 ${signal.borderColor} py-1`}>
                <div className={`text-[10px] font-bold tracking-widest mb-1 ${signal.tagColor}`}>{signal.tag}</div>
                <div className="text-[13px] text-[#334155] leading-relaxed">{signal.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
