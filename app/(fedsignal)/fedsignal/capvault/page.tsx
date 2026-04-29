"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Settings, Paperclip, ChevronDown, X, CheckCircle, FileText, Download, Trash2 } from "lucide-react";

// ── Department tabs ───────────────────────────────────────────────────────────
const DEPARTMENTS = [
  { id: "all",        label: "All Departments", count: 24, emoji: "" },
  { id: "stem",       label: "STEM & Research",  count: 8,  emoji: "🔬" },
  { id: "cyber",      label: "Cybersecurity",     count: 4,  emoji: "🛡️" },
  { id: "ai",         label: "AI & Data Science", count: 4,  emoji: "🤖" },
  { id: "workforce",  label: "Workforce Dev",      count: 4,  emoji: "🎓" },
  { id: "engineering",label: "Engineering",        count: 3,  emoji: "⚙️" },
];

// ── Wizard steps ──────────────────────────────────────────────────────────────
const UPLOAD_STEPS = [
  { num: 1, label: "Select Files" },
  { num: 2, label: "Tag Department" },
  { num: 3, label: "Add Metadata" },
  { num: 4, label: "Index & Store" },
];

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  dept: string;
  indexed: boolean;
}

const MOCK_FILES: UploadedFile[] = [
  { id: "1", name: "Tuskegee_CyberLab_CapStatement_2025.pdf",   size: "1.2 MB", dept: "Cybersecurity",  indexed: true },
  { id: "2", name: "NSF_PastPerformance_STEM_FY24.docx",         size: "890 KB", dept: "STEM & Research", indexed: true },
  { id: "3", name: "AI_Research_WhitePaper_DARPA.pdf",           size: "2.1 MB", dept: "AI & Data Science", indexed: true },
  { id: "4", name: "WorkforceDev_HBCU_Pipeline_Brief.pptx",     size: "3.4 MB", dept: "Workforce Dev",  indexed: false },
];

export default function CapVaultPage() {
  const [activeDept, setActiveDept]       = useState("all");
  const [showWizard, setShowWizard]       = useState(false);
  const [wizardStep, setWizardStep]       = useState(1);
  const [pendingFiles, setPendingFiles]   = useState<File[]>([]);
  const [selectedDept, setSelectedDept]  = useState("");
  const [docTitle, setDocTitle]          = useState("");
  const [notes, setNotes]                = useState("");
  const [indexing, setIndexing]          = useState(false);
  const [indexed, setIndexed]            = useState(false);
  const [dragging, setDragging]          = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) { setPendingFiles(files); setShowWizard(true); setWizardStep(2); }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) { setPendingFiles(files); setShowWizard(true); setWizardStep(2); }
  };

  const handleIndex = () => {
    setIndexing(true);
    setTimeout(() => { setIndexing(false); setIndexed(true); setWizardStep(4); }, 1800);
  };

  const resetWizard = () => {
    setShowWizard(false); setWizardStep(1); setPendingFiles([]);
    setSelectedDept(""); setDocTitle(""); setNotes(""); setIndexed(false);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Capability Vault</h1>
          <p className="text-[12px] text-[#64748b] mt-0.5">
            Organize and store your institution's capabilities by department. Feeds directly into Proposal Pal and RFI Creator.
          </p>
        </div>
        <button
          onClick={() => { setShowWizard(true); setWizardStep(1); }}
          className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#6a0015] transition-colors whitespace-nowrap"
        >
          <Upload className="h-3.5 w-3.5" />
          + Upload Capability
        </button>
      </div>

      {/* Supabase Connection Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f0fdf4] border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <div>
            <span className="text-[12px] font-bold text-green-800">Supabase Connected — Real-time Storage Active</span>
            <span className="text-[11px] text-green-700 ml-2">
              67 capability documents stored · Last sync: 2 minutes ago · Vector search enabled for AI matching
            </span>
          </div>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-semibold text-[#64748b] border border-[#e2e8f0] px-2.5 py-1 rounded hover:bg-white transition-colors">
          <Settings className="h-3 w-3" /> Configure
        </button>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setActiveDept(dept.id)}
            className={cn(
              "flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap",
              activeDept === dept.id
                ? "bg-[#7A0019] text-white border-[#7A0019]"
                : "bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8faff]"
            )}
          >
            {dept.emoji && <span>{dept.emoji}</span>}
            {dept.label}
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full",
              activeDept === dept.id ? "bg-white/20 text-white" : "bg-[#f1f5f9] text-[#64748b]"
            )}>
              {dept.count}
            </span>
          </button>
        ))}
      </div>

      {/* Upload Wizard */}
      {showWizard && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-5">
          {/* Wizard Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
              Upload Capability Document
            </div>
            <button onClick={resetWizard} className="text-[#94a3b8] hover:text-[#64748b]">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step Tabs */}
          <div className="flex items-center gap-0 bg-[#f8faff] border border-[#e2e8f0] rounded-lg overflow-hidden mb-5">
            {UPLOAD_STEPS.map((step) => {
              const isDone   = step.num < wizardStep;
              const isActive = step.num === wizardStep;
              return (
                <button
                  key={step.num}
                  onClick={() => !indexing && setWizardStep(step.num)}
                  className={cn(
                    "flex-1 flex flex-col items-center py-2 px-1 border-r border-[#e2e8f0] last:border-r-0 transition-colors",
                    isActive  && "bg-[#eff6ff] text-[#1a56db]",
                    !isActive && isDone  && "bg-white text-green-600",
                    !isActive && !isDone && "bg-white text-[#94a3b8]"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5",
                    isActive  && "bg-[#1a56db] text-white",
                    !isActive && isDone  && "bg-green-500 text-white",
                    !isActive && !isDone && "bg-[#e2e8f0] text-[#94a3b8]"
                  )}>
                    {(!isActive && isDone) ? "✓" : step.num}
                  </span>
                  <span className="text-[10px] font-medium hidden sm:block">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Step 1: Select Files */}
          {wizardStep === 1 && (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg py-12 flex flex-col items-center justify-center cursor-pointer transition-colors",
                dragging ? "border-[#1a56db] bg-[#eff6ff]" : "border-[#e2e8f0] bg-[#fafcff] hover:border-[#93c5fd]"
              )}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-8 w-8 text-[#94a3b8] mb-2" />
              <div className="text-[13px] font-semibold text-[#334155]">Drop files here or click to upload</div>
              <div className="text-[11px] text-[#94a3b8] mt-1">
                PDF, Word, PowerPoint, Excel · Max 25MB per file · Stored in Supabase with vector indexing
              </div>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" className="hidden" onChange={handleFileInput} />
            </div>
          )}

          {/* Step 2: Tag Department */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Selected Files</label>
                <div className="space-y-1.5">
                  {pendingFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#f8faff] border border-[#e2e8f0] rounded-lg text-[12px] text-[#334155]">
                      <FileText className="h-3.5 w-3.5 text-[#64748b]" />
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Department / Category</label>
                <div className="relative">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] pr-8"
                  >
                    <option value="">Select department...</option>
                    {DEPARTMENTS.filter((d) => d.id !== "all").map((d) => (
                      <option key={d.id} value={d.label}>{d.emoji} {d.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setWizardStep(1)} className="text-[12px] px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff]">Back</button>
                <button
                  onClick={() => setWizardStep(3)}
                  disabled={!selectedDept}
                  className="text-[12px] font-bold px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] disabled:opacity-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Add Metadata */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Document Title / Label</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Tuskegee Cyber Lab Capability Statement FY25"
                  className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748b] mb-1">Notes / Keywords <span className="font-normal text-[#94a3b8]">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Tags, relevant solicitations, or notes for AI matching..."
                  className="w-full px-3 py-2.5 text-[12px] border border-[#e2e8f0] rounded-lg bg-white outline-none focus:border-[#1a56db] text-[#334155] placeholder:text-[#c4cdd8] resize-y"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setWizardStep(2)} className="text-[12px] px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8faff]">Back</button>
                <button
                  onClick={handleIndex}
                  disabled={indexing}
                  className="text-[12px] font-bold px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#6a0015] disabled:opacity-60 transition-colors"
                >
                  {indexing ? "Indexing..." : "Index & Store →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {wizardStep === 4 && (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
              <div className="text-[14px] font-bold text-[#0f172a] mb-1">Document Indexed Successfully</div>
              <div className="text-[12px] text-[#64748b] mb-4">
                Vector embeddings created. This document will now auto-inject into Proposal Pal and RFI Creator.
              </div>
              <button onClick={resetWizard} className="text-[12px] font-bold px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-[#1549c0] transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drop Zone (shown when no wizard) */}
      {!showWizard && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white",
            dragging ? "border-[#1a56db] bg-[#eff6ff]" : "border-[#e2e8f0] hover:border-[#93c5fd]"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-8 w-8 text-[#94a3b8] mb-2" />
          <div className="text-[13px] font-semibold text-[#334155]">Drop files here or click to upload</div>
          <div className="text-[11px] text-[#94a3b8] mt-1">
            PDF, Word, PowerPoint, Excel · Max 25MB per file · Stored in Supabase with vector indexing
          </div>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" className="hidden" onChange={handleFileInput} />
        </div>
      )}

      {/* Existing Documents */}
      {!showWizard && (
        <div className="space-y-2">
          {MOCK_FILES
            .filter((f) => activeDept === "all" || f.dept === DEPARTMENTS.find((d) => d.id === activeDept)?.label)
            .map((file) => (
              <div key={file.id} className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <FileText className="h-5 w-5 text-[#64748b] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#0f172a] truncate">{file.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#94a3b8]">{file.size}</span>
                    <span className="text-[11px] px-1.5 py-0.5 bg-[#f1f5f9] rounded text-[#64748b]">{file.dept}</span>
                    {file.indexed
                      ? <span className="text-[10px] text-green-600 font-semibold">● Indexed</span>
                      : <span className="text-[10px] text-amber-600 font-semibold">⏳ Indexing</span>
                    }
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-[#94a3b8] hover:text-[#64748b] transition-colors"><Download className="h-3.5 w-3.5" /></button>
                  <button className="p-1.5 text-[#94a3b8] hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
