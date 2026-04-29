"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText, BarChart3, PieChart, TrendingUp, Download, Calendar,
  Filter, Search, Plus, Eye, Settings, Clock, CheckCircle, AlertCircle,
  ChevronDown, Sparkles, Layout, Table, Type, Image as ImageIcon,
  MousePointerClick, Minus, Columns2, ArrowRight, Upload, Printer,
  Mail, Users, Award, Trophy, Bell, Rocket, Target, Flag
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const REPORT_TEMPLATES = [
  { id: "funding", label: "Funding Report", icon: Trophy },
  { id: "performance", label: "Performance Dashboard", icon: BarChart3 },
  { id: "pipeline", label: "Pipeline Analysis", icon: TrendingUp },
  { id: "quarterly", label: "Quarterly Review", icon: Calendar },
  { id: "custom", label: "Custom Report", icon: FileText },
  { id: "comparison", label: "Peer Comparison", icon: Target },
];

const REPORT_BLOCKS = [
  { id: "heading", label: "Report Heading", icon: Type },
  { id: "text", label: "Text Block", icon: FileText },
  { id: "chart", label: "Bar Chart", icon: BarChart3 },
  { id: "pie", label: "Pie Chart", icon: PieChart },
  { id: "table", label: "Data Table", icon: Table },
  { id: "kpi", label: "KPI Cards", icon: Layout },
  { id: "image", label: "Image Block", icon: ImageIcon },
  { id: "divider", label: "Divider", icon: Minus },
];

const DATA_SOURCES = [
  { id: "grants", label: "Grant Awards", icon: Award },
  { id: "contracts", label: "Contracts", icon: FileText },
  { id: "opportunities", label: "Opportunities", icon: Target },
  { id: "teaming", label: "Teaming Partners", icon: Users },
  { id: "crmevents", label: "CRM Events", icon: Bell },
];

const MOCK_REPORTS = [
  {
    id: "r1",
    name: "Q1 2025 Federal Funding Report",
    type: "funding",
    status: "Published",
    lastModified: "Mar 15, 2025",
    author: "Research Office",
    thumbnail: "📊",
  },
  {
    id: "r2",
    name: "HBCU Peer Comparison - Research Awards",
    type: "comparison",
    status: "Draft",
    lastModified: "Mar 12, 2025",
    author: "Strategy Team",
    thumbnail: "📈",
  },
  {
    id: "r3",
    name: "SBIR/STTR Opportunity Pipeline",
    type: "pipeline",
    status: "Scheduled",
    lastModified: "Mar 10, 2025",
    author: "BD Team",
    thumbnail: "🚀",
  },
  {
    id: "r4",
    name: "Annual Board Report 2024",
    type: "performance",
    status: "Published",
    lastModified: "Feb 28, 2025",
    author: "Executive Office",
    thumbnail: "📑",
  },
];

const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF Document" },
  { value: "excel", label: "Excel Spreadsheet" },
  { value: "pptx", label: "PowerPoint" },
  { value: "html", label: "HTML Report" },
  { value: "csv", label: "CSV Data" },
];

export default function ReportHubPage() {
  const [activeTemplate, setActiveTemplate] = useState("funding");
  const [reportName, setReportName] = useState("Q1 2025 Federal Funding Report");
  const [selectedReport, setSelectedReport] = useState("r1");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("q1-2025");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);

  const currentReport = MOCK_REPORTS.find((r) => r.id === selectedReport);

  return (
    <div className="space-y-3">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f172a]">Report Hub</h1>
          <p className="text-[12px] text-[#64748b]">
            Build custom reports with live data from FedSignal. Export to PDF, Excel, or PowerPoint.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-md hover:bg-[#f8faff]">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-[#7A0019] rounded-md hover:bg-[#7A0019]/90">
            <Download className="h-3.5 w-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* ─── Template Tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {REPORT_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
                activeTemplate === template.id
                  ? "bg-[#1a56db] text-white"
                  : "bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8faff]"
              )}
            >
              <Icon className="h-3 w-3" />
              {template.label}
            </button>
          );
        })}
      </div>

      {/* ─── Main Builder Layout ─── */}
      <div className="grid grid-cols-[280px_1fr_340px] gap-3 h-[calc(100vh-280px)] min-h-[500px]">
        {/* ─── Left Panel: Reports & Blocks ─── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#f1f5f9]">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#94a3b8]">Saved Reports</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {MOCK_REPORTS.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left",
                  selectedReport === report.id
                    ? "bg-[#eff6ff] border-[#1a56db]"
                    : "bg-white border-[#e2e8f0] hover:bg-[#f8faff]"
                )}
              >
                <span className="text-[18px]">{report.thumbnail}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-[#334155] truncate">{report.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded",
                      report.status === "Published" ? "bg-green-100 text-green-700" :
                      report.status === "Draft" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {report.status}
                    </span>
                    <span className="text-[9px] text-[#94a3b8]">{report.lastModified}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-[#f1f5f9] p-3 space-y-3">
            {/* Report Blocks */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2">Add Section</div>
              <div className="space-y-1">
                {REPORT_BLOCKS.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.id}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] hover:border-[#1a56db] transition-colors text-left"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#64748b]" />
                      <span className="text-[11px] font-medium text-[#334155]">{block.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Sources */}
            <div>
              <div className="text-[9px] font-bold tracking-wide uppercase text-[#94a3b8] mb-2">Data Sources</div>
              <div className="space-y-1">
                {DATA_SOURCES.map((source) => {
                  const Icon = source.icon;
                  return (
                    <button
                      key={source.id}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8faff] transition-colors text-left"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#1a56db]" />
                      <span className="text-[11px] font-medium text-[#334155]">{source.label}</span>
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
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748b]">Report Preview</span>
              <span className="text-[10px] text-[#94a3b8]">{currentReport?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-[#f1f5f9] text-[#64748b]">
                <Printer className="h-3.5 w-3.5" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#f1f5f9] text-[#64748b]">
                <Mail className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[700px] mx-auto bg-white rounded-lg shadow-lg min-h-[500px] p-8">
              {/* Report Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-[#7A0019]">
                <div className="text-[10px] text-[#7A0019] font-bold tracking-wider mb-2">TUSKEGEE UNIVERSITY</div>
                <h2 className="text-[22px] font-bold text-[#0f172a] mb-2">{currentReport?.name}</h2>
                <p className="text-[12px] text-[#64748b]">Research Office • {currentReport?.lastModified}</p>
              </div>

              {/* Executive Summary */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Executive Summary</h3>
                <p className="text-[12px] text-[#64748b] leading-relaxed">
                  This report provides a comprehensive overview of federal funding activities for Q1 2025. 
                  Key highlights include $12.4M in new awards, 47 active opportunities in pipeline, and 
                  strategic partnerships with 8 federal agencies.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "New Awards", value: "$12.4M", change: "+23%", color: "#047857" },
                  { label: "Active Pipeline", value: "47", change: "+8", color: "#1a56db" },
                  { label: "Win Rate", value: "34%", change: "+5%", color: "#7A0019" },
                  { label: "Avg Award", value: "$1.8M", change: "+12%", color: "#b45309" },
                ].map((kpi) => (
                  <div key={kpi.label} className="text-center p-3 bg-[#f8faff] rounded-lg">
                    <div className="text-[20px] font-extrabold" style={{ color: kpi.color }}>{kpi.value}</div>
                    <div className="text-[9px] text-[#64748b] mt-0.5">{kpi.label}</div>
                    <div className="text-[9px] text-[#047857] mt-0.5">{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Funding by Agency</h3>
                <div className="space-y-2">
                  {[
                    { agency: "DOD", amount: "$5.2M", percent: 42, color: "#1a56db" },
                    { agency: "NIH", amount: "$3.1M", percent: 25, color: "#7A0019" },
                    { agency: "NSF", amount: "$2.4M", percent: 19, color: "#047857" },
                    { agency: "DOE", amount: "$1.7M", percent: 14, color: "#b45309" },
                  ].map((item) => (
                    <div key={item.agency} className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-[#334155] w-12">{item.agency}</span>
                      <div className="flex-1 h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0f172a] w-16 text-right">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Recent Awards</h3>
                <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                  <table className="w-full text-[11px]">
                    <thead className="bg-[#f8faff]">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-[#64748b]">Award</th>
                        <th className="px-3 py-2 text-left font-semibold text-[#64748b]">Agency</th>
                        <th className="px-3 py-2 text-right font-semibold text-[#64748b]">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { award: "AFWERX Phase II", agency: "Air Force", amount: "$1.5M" },
                        { award: "NSF IUCRC Grant", agency: "NSF", amount: "$2.2M" },
                        { award: "NIH R01 Research", agency: "NIH", amount: "$3.1M" },
                        { award: "DOE Clean Energy", agency: "DOE", amount: "$1.2M" },
                      ].map((row, idx) => (
                        <tr key={idx} className={cn("border-t border-[#f1f5f9]", idx % 2 === 1 && "bg-[#fafafa]")}>
                          <td className="px-3 py-2 text-[#334155]">{row.award}</td>
                          <td className="px-3 py-2 text-[#64748b]">{row.agency}</td>
                          <td className="px-3 py-2 text-right font-semibold text-[#047857]">{row.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[#e2e8f0] text-center">
                <p className="text-[10px] text-[#94a3b8]">
                  Generated by FedSignal Report Hub • Page 1 of 1
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Panel: Settings & AI ─── */}
        <div className="space-y-3">
          {/* Report Settings */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">Report Settings</div>
            </div>
            <div className="p-4 space-y-4">
              {/* Report Name */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Report Name</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155]"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Date Range</label>
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                  >
                    <option value="q1-2025">Q1 2025 (Jan-Mar)</option>
                    <option value="q4-2024">Q4 2024 (Oct-Dec)</option>
                    <option value="fy-2024">FY 2024 Full Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>

              {/* Include Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <span className="text-[11px] text-[#334155]">Include Charts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTables}
                    onChange={(e) => setIncludeTables(e.target.checked)}
                    className="rounded border-[#e2e8f0] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <span className="text-[11px] text-[#334155]">Include Data Tables</span>
                </label>
              </div>
            </div>
          </div>

          {/* AI Report Generator */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">AI Report Assistant</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">What should this report cover?</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] resize-none"
                  placeholder="e.g. Summary of all federal awards this quarter with comparison to HBCU peers..."
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold text-white bg-[#1a56db] rounded-lg hover:bg-[#1a56db]/90">
                <Sparkles className="h-3.5 w-3.5" />
                Generate Report with AI
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">Export</div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5">Format</label>
                <div className="relative">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[11px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                  >
                    {EXPORT_FORMATS.map((fmt) => (
                      <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Clock className="h-3 w-3" />
                  Schedule
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8faff]">
                  <Users className="h-3 w-3" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
