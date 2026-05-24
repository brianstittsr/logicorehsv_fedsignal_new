"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  Package,
  AlertCircle,
  Clock,
  DollarSign,
  Building2,
  Users,
  Briefcase,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Pipeline workspace type
interface PipelineWorkspace {
  opportunityId?: string;
  title?: string;
  agency?: string;
  solicitationNumber?: string;
  naics?: string;
  deadline?: string;
  amount?: string;
  description?: string;
  setAsideType?: string;
  // SF-424 Fields
  sf424: {
    legalName: string;
    ein: string;
    duns: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    congressionalDistrict: string;
    projectTitle: string;
    proposedAmount: string;
    projectDuration: string;
    projectDirector: string;
    phone: string;
    email: string;
  };
  // Proposal sections
  projectNarrative: string;
  abstract: string;
  budgetSummary: {
    directCosts: string;
    indirectCosts: string;
    totalCosts: string;
  };
  keyPersonnel: string[];
  pastPerformance: string[];
  // Compliance
  checklist: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

const STEPS = [
  { id: 1, label: "Identify", icon: Target, description: "Find SAM.gov opportunities" },
  { id: 2, label: "Build Proposal", icon: FileText, description: "Draft with AI assistance" },
  { id: 3, label: "Review", icon: CheckCircle, description: "Validate compliance" },
  { id: 4, label: "Generate Package", icon: Package, description: "Download submission files" },
];

const COMPLIANCE_ITEMS = [
  { id: "sf424-complete", label: "SF-424 form completed", required: true },
  { id: "narrative-draft", label: "Project narrative drafted", required: true },
  { id: "budget-complete", label: "Budget summary with F&A calculated", required: true },
  { id: "personnel-confirmed", label: "Key personnel bios attached", required: true },
  { id: "budget-totals-match", label: "Budget totals match narrative", required: true },
  { id: "deadline-valid", label: "Deadline not passed", required: true },
  { id: "hbcu-eligible", label: "HBCU set-aside eligibility confirmed", required: false },
  { id: "subk-plan", label: "Sub-contracting plan (if required)", required: false },
];

export default function PipelinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "1", 10);
  const [currentStep, setCurrentStep] = useState(Math.min(Math.max(initialStep, 1), 4));
  const [workspace, setWorkspace] = useState<PipelineWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  // Load workspace from sessionStorage or Firestore
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("fs_pipeline_workspace");
    if (saved) {
      try {
        setWorkspace(JSON.parse(saved));
      } catch {
        createNewWorkspace();
      }
    } else {
      createNewWorkspace();
    }
    setIsLoading(false);

    // Load sample opportunities for Step 1
    setOpportunities([
      {
        id: "SAM-2024-001",
        title: "SBIR Phase I: AI-Powered Research Analytics Platform",
        agency: "National Science Foundation",
        solicitationNumber: "NSF-24-519",
        naics: "541511",
        deadline: "2024-06-15",
        amount: "$300,000",
        description: "Research and development of AI-powered analytics platforms for academic research institutions.",
        setAsideType: "HBCU/MI",
        hbcuEligible: true,
      },
      {
        id: "SAM-2024-002",
        title: "HBCU Research Infrastructure Development Grant",
        agency: "Department of Education",
        solicitationNumber: "ED-OSERS-24-005",
        naics: "611310",
        deadline: "2024-07-30",
        amount: "$2,500,000",
        description: "Infrastructure development for HBCU research facilities and STEM education programs.",
        setAsideType: "HBCU Set-Aside",
        hbcuEligible: true,
      },
      {
        id: "SAM-2024-003",
        title: "Cybersecurity Workforce Development Initiative",
        agency: "Department of Homeland Security",
        solicitationNumber: "DHS-24-ST-015",
        naics: "611519",
        deadline: "2024-05-28",
        amount: "$750,000",
        description: "Development of cybersecurity workforce training programs for underrepresented populations.",
        setAsideType: "None",
        hbcuEligible: false,
      },
    ]);
  }, []);

  const createNewWorkspace = () => {
    const newWorkspace: PipelineWorkspace = {
      sf424: {
        legalName: "Huston-Tillotson University",
        ein: "74-1320421",
        duns: "123456789",
        address: "900 Chicon Street",
        city: "Austin",
        state: "TX",
        zip: "78702",
        congressionalDistrict: "TX-10",
        projectTitle: "",
        proposedAmount: "",
        projectDuration: "",
        projectDirector: "",
        phone: "(512) 505-3000",
        email: "research@htu.edu",
      },
      projectNarrative: "",
      abstract: "",
      budgetSummary: {
        directCosts: "",
        indirectCosts: "",
        totalCosts: "",
      },
      keyPersonnel: [],
      pastPerformance: [],
      checklist: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkspace(newWorkspace);
    saveWorkspace(newWorkspace);
  };

  const saveWorkspace = (ws: PipelineWorkspace) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("fs_pipeline_workspace", JSON.stringify({ ...ws, updatedAt: new Date().toISOString() }));
  };

  const updateWorkspace = (updates: Partial<PipelineWorkspace>) => {
    if (!workspace) return;
    const updated = { ...workspace, ...updates, updatedAt: new Date().toISOString() };
    setWorkspace(updated);
    saveWorkspace(updated);
  };

  const selectOpportunity = (opp: any) => {
    updateWorkspace({
      opportunityId: opp.id,
      title: opp.title,
      agency: opp.agency,
      solicitationNumber: opp.solicitationNumber,
      naics: opp.naics,
      deadline: opp.deadline,
      amount: opp.amount,
      description: opp.description,
      setAsideType: opp.setAsideType,
      sf424: {
        ...workspace!.sf424,
        projectTitle: opp.title,
        proposedAmount: opp.amount.replace(/[^0-9.]/g, ""),
      },
    });
    setCurrentStep(2);
    router.push(`/fedsignal/pipeline?step=2`);
  };

  const updateSf424 = (field: keyof PipelineWorkspace["sf424"], value: string) => {
    if (!workspace) return;
    const updated = {
      ...workspace,
      sf424: { ...workspace.sf424, [field]: value },
    };
    updateWorkspace(updated);
  };

  const calculateFandA = () => {
    const direct = parseFloat(workspace?.budgetSummary.directCosts || "0");
    const rate = 0.55; // Default 55% F&A rate
    const indirect = direct * rate;
    const total = direct + indirect;
    updateWorkspace({
      budgetSummary: {
        directCosts: direct.toString(),
        indirectCosts: indirect.toString(),
        totalCosts: total.toString(),
      },
    });
  };

  const toggleChecklist = (id: string) => {
    if (!workspace) return;
    const updated = {
      ...workspace,
      checklist: { ...workspace.checklist, [id]: !workspace.checklist[id] },
    };
    updateWorkspace(updated);
  };

  const allRequiredChecksPass = () => {
    const required = COMPLIANCE_ITEMS.filter((item) => item.required);
    return required.every((item) => workspace?.checklist[item.id]);
  };

  const generatePackage = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/fedsignal/pipeline/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fedsignal-package-${workspace?.opportunityId || "proposal"}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);

        // Add to grant tracker
        const grants = JSON.parse(sessionStorage.getItem("fs_grants") || "[]");
        grants.push({
          id: Date.now().toString(),
          opportunityId: workspace?.opportunityId,
          title: workspace?.title || "New Proposal",
          agency: workspace?.agency || "",
          status: "package-ready",
          submittedDate: new Date().toISOString(),
          packageUrl: url,
        });
        sessionStorage.setItem("fs_grants", JSON.stringify(grants));
      }
    } catch (err) {
      console.error("Failed to generate package:", err);
    } finally {
      setGenerating(false);
    }
  };

  const CurrentStepIcon = STEPS[currentStep - 1].icon;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a56db]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1a56db]/10 rounded-lg">
            <CurrentStepIcon className="h-6 w-6 text-[#1a56db]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {STEPS[currentStep - 1].label}
            </h1>
            <p className="text-sm text-gray-500">{STEPS[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;
            const isFuture = currentStep < step.id;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (!isFuture) {
                      setCurrentStep(step.id);
                      router.push(`/fedsignal/pipeline?step=${step.id}`);
                    }
                  }}
                  disabled={isFuture}
                  className={cn(
                    "flex-1 flex items-center gap-2 p-3 rounded-lg border transition-all",
                    isActive
                      ? "bg-[#1a56db] text-white border-[#1a56db]"
                      : isComplete
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  )}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  {isComplete && <CheckCircle className="h-4 w-4 ml-auto" />}
                </button>
                {index < STEPS.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-300 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* STEP 1: Identify */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Select an Opportunity</h2>
                <Link href="/fedsignal/opportunities">
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Browse All Opportunities
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4">
                {opportunities.map((opp) => (
                  <Card
                    key={opp.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      workspace?.opportunityId === opp.id && "border-[#1a56db] ring-1 ring-[#1a56db]"
                    )}
                    onClick={() => selectOpportunity(opp)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{opp.title}</h3>
                            {opp.hbcuEligible && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                HBCU Eligible
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {opp.agency} • Solicitation {opp.solicitationNumber}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">{opp.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-4 w-4" />
                              Due {opp.deadline}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <DollarSign className="h-4 w-4" />
                              {opp.amount}
                            </span>
                            <Badge variant="outline">{opp.setAsideType}</Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectOpportunity(opp);
                          }}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Start Proposal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {workspace?.opportunityId && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Selected: {workspace.title}</span>
                  </div>
                  <Button
                    className="mt-3"
                    onClick={() => {
                      setCurrentStep(2);
                      router.push(`/fedsignal/pipeline?step=2`);
                    }}
                  >
                    Continue to Build Proposal →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Build Proposal */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {workspace?.opportunityId && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{workspace.agency}</span>
                    <span>•</span>
                    <span>{workspace.title}</span>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                {/* SF-424 Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      SF-424 Application
                    </CardTitle>
                    <CardDescription>Federal application form fields</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Legal Name</Label>
                        <Input
                          value={workspace?.sf424.legalName}
                          onChange={(e) => updateSf424("legalName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>EIN</Label>
                        <Input
                          value={workspace?.sf424.ein}
                          onChange={(e) => updateSf424("ein", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Project Title</Label>
                      <Input
                        value={workspace?.sf424.projectTitle}
                        onChange={(e) => updateSf424("projectTitle", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Proposed Amount</Label>
                        <Input
                          value={workspace?.sf424.proposedAmount}
                          onChange={(e) => updateSf424("proposedAmount", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project Duration (months)</Label>
                        <Input
                          value={workspace?.sf424.projectDuration}
                          onChange={(e) => updateSf424("projectDuration", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Project Director</Label>
                      <Input
                        value={workspace?.sf424.projectDirector}
                        onChange={(e) => updateSf424("projectDirector", e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-fill from University Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Budget & F&A */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Budget Summary
                    </CardTitle>
                    <CardDescription>Direct costs + F&A calculation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Direct Costs</Label>
                      <Input
                        type="number"
                        value={workspace?.budgetSummary.directCosts}
                        onChange={(e) =>
                          updateWorkspace({
                            budgetSummary: { ...workspace!.budgetSummary, directCosts: e.target.value },
                          })
                        }
                        placeholder="Enter direct costs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={calculateFandA}>
                        Calculate F&A @ 55%
                      </Button>
                      <Link href="/fedsignal/fanda">
                        <Button variant="ghost" size="sm">
                          Open F&A Calculator
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-500">Indirect (F&A)</div>
                        <div className="font-semibold">
                          ${parseFloat(workspace?.budgetSummary.indirectCosts || "0").toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 bg-[#1a56db]/10 rounded border border-[#1a56db]/20">
                        <div className="text-sm text-[#1a56db]">Total Project Cost</div>
                        <div className="font-bold text-[#1a56db]">
                          ${parseFloat(workspace?.budgetSummary.totalCosts || "0").toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Narrative */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Project Narrative
                  </CardTitle>
                  <CardDescription>Main proposal text with AI assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={workspace?.projectNarrative}
                    onChange={(e) => updateWorkspace({ projectNarrative: e.target.value })}
                    placeholder="Enter your project narrative here..."
                    className="min-h-[200px]"
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Draft with Hermes AI
                    </Button>
                    <Link href="/fedsignal/proposalpal">
                      <Button variant="ghost" size="sm">
                        Open Proposal Pal
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Key Personnel */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Key Personnel
                  </CardTitle>
                  <CardDescription>Principal investigator and team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Link href="/fedsignal/leadership">
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Select from Leadership
                      </Button>
                    </Link>
                    <Link href="/fedsignal/capvault">
                      <Button variant="ghost" size="sm">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Attach Bios from Vault
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Proposal Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Proposal Preview
                  </h3>
                  <ScrollArea className="h-[400px] border rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Project Title</h4>
                        <p className="font-semibold">{workspace?.sf424.projectTitle || "(Not set)"}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Agency</h4>
                        <p>{workspace?.agency || "(Not selected)"}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Budget</h4>
                        <p>
                          Direct: ${parseFloat(workspace?.budgetSummary.directCosts || "0").toLocaleString()}
                          <br />
                          Indirect: ${parseFloat(workspace?.budgetSummary.indirectCosts || "0").toLocaleString()}
                          <br />
                          <strong>
                            Total: ${parseFloat(workspace?.budgetSummary.totalCosts || "0").toLocaleString()}
                          </strong>
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Narrative Preview</h4>
                        <p className="text-sm text-gray-600 line-clamp-10">
                          {workspace?.projectNarrative || "(No narrative drafted)"}
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* Right: Compliance Checklist */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Compliance Checklist
                  </h3>
                  <div className="space-y-2">
                    {COMPLIANCE_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all",
                          workspace?.checklist[item.id]
                            ? "bg-green-50 border-green-200"
                            : item.required
                            ? "bg-red-50 border-red-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <Checkbox
                          checked={workspace?.checklist[item.id] || false}
                          onCheckedChange={() => toggleChecklist(item.id)}
                          className={cn(
                            workspace?.checklist[item.id]
                              ? "border-green-500 data-[state=checked]:bg-green-500"
                              : item.required
                              ? "border-red-500"
                              : ""
                          )}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{item.label}</span>
                            {item.required && (
                              <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          {workspace?.checklist[item.id] ? (
                            <span className="text-xs text-green-600">✓ Verified</span>
                          ) : item.required ? (
                            <span className="text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Must complete before submission
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!allRequiredChecksPass() && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Please complete all required checks before proceeding
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Generate Package */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Ready to Generate Package</h3>
                    <p className="text-sm text-green-700">
                      All compliance checks passed. Generate your submission-ready package.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="font-semibold">SF-424.pdf</h4>
                    <p className="text-sm text-gray-500 mb-4">Pre-filled federal application form</p>
                    <Badge variant="outline">PDF</Badge>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <FileText className="h-12 w-12 text-blue-400 mb-4" />
                    <h4 className="font-semibold">Project_Narrative.docx</h4>
                    <p className="text-sm text-gray-500 mb-4">Formatted Word document</p>
                    <Badge variant="outline" className="bg-blue-50">
                      DOCX
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <DollarSign className="h-12 w-12 text-green-400 mb-4" />
                    <h4 className="font-semibold">Budget_Summary.xlsx</h4>
                    <p className="text-sm text-gray-500 mb-4">Budget with F&A calculations</p>
                    <Badge variant="outline" className="bg-green-50">
                      XLSX
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <FileCheck className="h-12 w-12 text-purple-400 mb-4" />
                    <h4 className="font-semibold">Compliance_Checklist.pdf</h4>
                    <p className="text-sm text-gray-500 mb-4">Audit trail document</p>
                    <Badge variant="outline" className="bg-purple-50">
                      PDF
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={generatePackage}
                  disabled={generating}
                  className="bg-[#1a56db] hover:bg-[#1547b5]"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating Package...
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-2" />
                      Download Submission Package (.zip)
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Link href="/fedsignal/grants">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View in Grant Tracker
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
              router.push(`/fedsignal/pipeline?step=${currentStep - 1}`);
            }
          }}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Step
        </Button>
        <Button
          onClick={() => {
            if (currentStep < 4) {
              setCurrentStep(currentStep + 1);
              router.push(`/fedsignal/pipeline?step=${currentStep + 1}`);
            }
          }}
          disabled={currentStep === 4 || (currentStep === 3 && !allRequiredChecksPass())}
        >
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
