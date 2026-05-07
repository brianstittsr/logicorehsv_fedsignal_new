"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Users, 
  Building2, 
  GraduationCap, 
  Database, 
  Save,
  Plus,
  X,
  Paperclip,
  Sparkles,
  Upload,
  FileUp,
  CheckSquare,
  Square,
  AlertCircle,
  FileDown,
  Wand2,
  Loader2,
  Copy,
  Download,
  HelpCircle
} from "lucide-react";
import { mockGrantDetails, GrantDetail } from "@/lib/fedsignal/mock-grant-data";
import { Walkthrough, WalkthroughButton } from "@/components/ui/walkthrough";

const steps = [
  { id: 0, title: "Grant Type", description: "Choose how to proceed" },
  { id: 1, title: "Basic Information", description: "Grant details and agency selection" },
  { id: 2, title: "Project Summary", description: "Project overview and objectives" },
  { id: 3, title: "Project Description", description: "Detailed project description" },
  { id: 4, title: "Budget & Justification", description: "Budget breakdown and justification" },
  { id: 5, title: "Personnel", description: "PI, Co-PIs, and key personnel" },
  { id: 6, title: "Facilities & Resources", description: "Available facilities and equipment" },
  { id: 7, title: "Additional Plans", description: "Mentoring and data management" },
  { id: 8, title: "Attachments", description: "Upload supporting documents" },
  { id: 9, title: "Review & Submit", description: "Review and submit application" },
];

const agencies = [
  { id: "NSF", name: "National Science Foundation", description: "Basic research and education" },
  { id: "NASA", name: "NASA", description: "Aeronautics and space research" },
  { id: "DoD", name: "Department of Defense", description: "Defense research and development" },
  { id: "DOE", name: "Department of Energy", description: "Energy research and development" },
  { id: "NIH", name: "National Institutes of Health", description: "Biomedical and health research" },
  { id: "Other", name: "Other Agency", description: "Other federal or state agency" },
];

const reportingFrequencies = [
  { id: "monthly", name: "Monthly" },
  { id: "quarterly", name: "Quarterly" },
  { id: "semi_annual", name: "Semi-Annual" },
  { id: "annual", name: "Annual" },
  { id: "other", name: "Other" },
];

// Grant templates
const grantTemplates = [
  {
    id: "nsf_stem",
    name: "NSF STEM Education",
    description: "Template for NSF STEM education grants",
    category: "Education",
    fields: {
      intellectualMerit: "This project addresses the critical need for improving STEM education at HBCUs through innovative pedagogical approaches and technology integration. The intellectual merit lies in developing evidence-based teaching methods that can be scaled across institutions.",
      broaderImpacts: "This project will benefit society by increasing STEM graduation rates among underrepresented minorities, creating a more diverse STEM workforce. The broader impacts include curriculum development, faculty training, and student mentorship programs.",
    },
  },
  {
    id: "nsf_research",
    name: "NSF Basic Research",
    description: "Template for NSF basic research proposals",
    category: "Research",
    fields: {
      intellectualMerit: "This research advances fundamental understanding in the field by investigating novel mechanisms and methodologies. The intellectual significance lies in addressing long-standing questions through innovative experimental approaches and theoretical frameworks.",
      broaderImpacts: "This research will benefit society through potential applications in healthcare, technology, and environmental sustainability. It will also provide training opportunities for undergraduate and graduate students from diverse backgrounds.",
    },
  },
  {
    id: "dod_research",
    name: "DoD Research",
    description: "Template for Department of Defense research grants",
    category: "Defense",
    fields: {
      intellectualMerit: "This research addresses critical defense technology needs through innovative approaches. The intellectual merit lies in developing novel solutions that enhance national security capabilities while maintaining ethical standards.",
      broaderImpacts: "This project will benefit national defense and security while creating opportunities for HBCU researchers and students to contribute to defense technology development.",
    },
  },
];

interface Personnel {
  id: string;
  name: string;
  email: string;
  title: string;
  role: "PI" | "Co-PI" | "Senior Personnel" | "Other";
}

export default function NewGrantApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Grant type selection state
  const [grantType, setGrantType] = useState<"create" | "respond" | null>(null);
  const [uploadedGrantFile, setUploadedGrantFile] = useState<File | null>(null);
  const [isParsingGrant, setIsParsingGrant] = useState(false);
  const [parsedGrantRequirements, setParsedGrantRequirements] = useState<any>(null);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [isEnhancingAI, setIsEnhancingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    grantNumber: "",
    title: "",
    agency: "",
    agencyProgram: "",
    opportunityId: "",
    status: "pre_award",
    
    // Step 2: Project Summary
    projectSummary: "",
    intellectualMerit: "",
    broaderImpacts: "",
    
    // Step 3: Project Description
    projectDescription: "",
    referencesCited: "",
    
    // Step 4: Budget
    totalAwardAmount: "",
    directCosts: "",
    indirectCosts: "",
    budgetJustification: "",
    budgetPeriods: [] as { period: number; startDate: string; endDate: string; amount: string }[],
    
    // Step 5: Personnel
    principalInvestigator: { name: "", email: "", title: "" },
    coInvestigators: [] as Personnel[],
    seniorKeyPersonnel: [] as Personnel[],
    
    // Step 6: Facilities
    facilitiesDescription: "",
    equipmentDescription: "",
    
    // Step 7: Additional Plans
    mentoringPlan: "",
    dataManagementPlan: "",
    
    // Step 8: Attachments
    attachments: [] as { name: string; type: string; file: File }[],
    
    // Step 9: Review
    agreedToTerms: false,
  });

  const [newCoPI, setNewCoPI] = useState({ name: "", email: "", title: "" });
  const [newSeniorPersonnel, setNewSeniorPersonnel] = useState({ name: "", email: "", title: "", role: "Senior Personnel" as const });
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const grantApplicationWalkthroughSteps = [
    {
      title: "Grant Type Selection",
      description: "Choose between starting from scratch, using a template, or uploading an existing application. Templates provide pre-populated content for common grant types.",
      target: '[class*="Card"]:first-of-type',
      position: "bottom" as const,
    },
    {
      title: "Basic Information",
      description: "Enter grant details including grant number, title, agency, program, opportunity ID, and status. Select the appropriate federal agency from the dropdown.",
      target: 'input[name="title"]',
      position: "bottom" as const,
    },
    {
      title: "Project Summary",
      description: "Provide a concise project summary, intellectual merit, and broader impacts. These sections are critical for NSF and many other agencies.",
      target: 'textarea[name="projectSummary"]',
      position: "bottom" as const,
    },
    {
      title: "Project Description",
      description: "Write a detailed project description with background, methodology, and references. Use AI assistance to help generate or improve content.",
      target: 'textarea[name="projectDescription"]',
      position: "bottom" as const,
    },
    {
      title: "Budget & Justification",
      description: "Enter total award amount, direct costs, indirect costs, and budget justification. Add budget periods for multi-year grants.",
      target: 'input[name="totalAwardAmount"]',
      position: "bottom" as const,
    },
    {
      title: "Personnel Information",
      description: "Add principal investigator, co-investigators, and senior key personnel. Include names, emails, titles, and roles.",
      target: 'input[name="principalInvestigator.name"]',
      position: "bottom" as const,
    },
    {
      title: "Facilities & Resources",
      description: "Describe available facilities, equipment, and institutional resources that support the proposed project.",
      target: 'textarea[name="facilitiesDescription"]',
      position: "bottom" as const,
    },
    {
      title: "Additional Plans",
      description: "Provide mentoring plans for students and data management plans as required by many funding agencies.",
      target: 'textarea[name="mentoringPlan"]',
      position: "bottom" as const,
    },
    {
      title: "Attachments",
      description: "Upload supporting documents including CVs, letters of support, institutional approvals, and other required files.",
      target: 'input[type="file"]',
      position: "bottom" as const,
    },
    {
      title: "Review & Submit",
      description: "Review all application information before submitting. Ensure all required fields are complete and attachments are uploaded.",
      target: 'button:has([class*="Save"])',
      position: "bottom" as const,
    },
  ];
  const [newAttachment, setNewAttachment] = useState({ name: "", type: "proposal" as const });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        attachments: [
          ...formData.attachments,
          { name: file.name, type: newAttachment.type, file },
        ],
      });
      setNewAttachment({ name: "", type: "proposal" });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  // Grant file upload handlers
  const handleGrantFileUpload = (file: File) => {
    setUploadedGrantFile(file);
    setIsParsingGrant(true);
    
    // Simulate AI parsing - in production, this would call an AI API
    setTimeout(() => {
      setParsedGrantRequirements({
        title: "Sample Grant Program",
        agency: "NSF",
        deadline: "2025-03-15",
        requiredFields: [
          "Project Summary",
          "Project Description",
          "Budget Justification",
          "Personnel Information",
          "Facilities Description",
          "Data Management Plan",
          "Mentoring Plan",
        ],
        specificRequirements: [
          "Maximum budget: $500,000",
          "Project duration: 2-3 years",
          "Must include broader impacts",
          "Requires collaboration with at least one other institution",
        ],
      });
      
      setChecklistItems([
        { id: 1, text: "Review grant guidelines and eligibility requirements", completed: false },
        { id: 2, text: "Confirm project alignment with agency priorities", completed: false },
        { id: 3, text: "Prepare budget within specified limits", completed: false },
        { id: 4, text: "Identify required personnel and secure commitments", completed: false },
        { id: 5, text: "Draft project summary with intellectual merit", completed: false },
        { id: 6, text: "Develop broader impacts statement", completed: false },
        { id: 7, text: "Complete facilities and resources description", completed: false },
        { id: 8, text: "Prepare data management plan", completed: false },
        { id: 9, text: "Create mentoring plan if applicable", completed: false },
        { id: 10, text: "Gather required attachments and documents", completed: false },
        { id: 11, text: "Internal review and approval", completed: false },
        { id: 12, text: "Final submission before deadline", completed: false },
      ]);
      
      setIsParsingGrant(false);
    }, 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleGrantFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      handleGrantFileUpload(file);
    }
  };

  // AI enhancement handlers
  const handleEnhanceWithAI = (field: string) => {
    setIsEnhancingAI(true);
    
    // Simulate AI enhancement - in production, this would call an AI API
    setTimeout(() => {
      const currentText = formData[field as keyof typeof formData] as string;
      
      // Convert bullets to paragraphs
      const enhancedText = currentText
        .replace(/^- /g, "")
        .replace(/•/g, "")
        .split("\n")
        .filter(line => line.trim())
        .map(line => line.trim())
        .join(" ");
      
      setFormData({
        ...formData,
        [field]: enhancedText,
      });
      
      setIsEnhancingAI(false);
    }, 1500);
  };

  const toggleChecklistItem = (id: number) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Save as draft handler
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    // Simulate saving to local storage or backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Save to localStorage for persistence
    const draftData = {
      grantType,
      formData,
      checklistItems,
      currentStep,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('grant-draft', JSON.stringify(draftData));
    
    setLastSaved(new Date().toLocaleTimeString());
    setIsSavingDraft(false);
  };

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('grant-draft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      // Ask user if they want to restore the draft
      // For now, just log it - in production, show a dialog
      console.log('Found saved draft:', draft);
    }
  }, []);

  // Auto-save on step change or form data change
  useEffect(() => {
    if (currentStep > 0) {
      const draftData = {
        grantType,
        formData,
        checklistItems,
        currentStep,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('grant-draft', JSON.stringify(draftData));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [currentStep, formData, grantType, checklistItems]);

  // Apply template handler
  const handleApplyTemplate = (templateId: string) => {
    const template = grantTemplates.find((t) => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        intellectualMerit: template.fields.intellectualMerit,
        broaderImpacts: template.fields.broaderImpacts,
      });
    }
  };

  // Autocomplete suggestions
  const autocompleteSuggestions = {
    title: [
      "Enhancing STEM Education at HBCUs through",
      "Innovative Approaches to",
      "Development of",
      "Research Initiative for",
      "Capacity Building in",
    ],
    projectSummary: [
      "This project aims to",
      "The proposed work will",
      "Our approach involves",
      "The significance of this project lies in",
      "This research addresses",
    ],
    intellectualMerit: [
      "This project advances knowledge by",
      "The intellectual merit lies in",
      "This research contributes to",
      "The novelty of this approach is",
      "This work builds on",
    ],
    broaderImpacts: [
      "This project will benefit society by",
      "The broader impacts include",
      "This work will enhance",
      "This project addresses the need for",
      "The societal benefits are",
    ],
  };

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteField, setAutocompleteField] = useState<string | null>(null);
  const [autocompleteSuggestionsList, setAutocompleteSuggestionsList] = useState<string[]>([]);

  const handleAutocomplete = (field: string) => {
    setAutocompleteField(field);
    setAutocompleteSuggestionsList(autocompleteSuggestions[field as keyof typeof autocompleteSuggestions] || []);
    setShowAutocomplete(true);
  };

  const applySuggestion = (suggestion: string) => {
    if (autocompleteField) {
      const currentValue = formData[autocompleteField as keyof typeof formData] as string;
      const newValue = currentValue ? `${currentValue} ${suggestion}` : suggestion;
      setFormData({
        ...formData,
        [autocompleteField]: newValue,
      });
    }
    setShowAutocomplete(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return grantType !== null;
      case 1:
        return formData.title && formData.agency;
      case 2:
        return formData.projectSummary && formData.intellectualMerit && formData.broaderImpacts;
      case 3:
        return formData.projectDescription;
      case 4:
        return formData.totalAwardAmount && formData.directCosts;
      case 5:
        return formData.principalInvestigator.name && formData.principalInvestigator.email;
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        return true; // Attachments are optional
      case 9:
        return formData.agreedToTerms;
      default:
        return false;
    }
  };

  const handleAddCoPI = () => {
    if (newCoPI.name && newCoPI.email) {
      setFormData({
        ...formData,
        coInvestigators: [
          ...formData.coInvestigators,
          { ...newCoPI, id: String(Date.now()), role: "Co-PI" },
        ],
      });
      setNewCoPI({ name: "", email: "", title: "" });
    }
  };

  const handleRemoveCoPI = (id: string) => {
    setFormData({
      ...formData,
      coInvestigators: formData.coInvestigators.filter((p) => p.id !== id),
    });
  };

  const handleAddSeniorPersonnel = () => {
    if (newSeniorPersonnel.name && newSeniorPersonnel.email) {
      setFormData({
        ...formData,
        seniorKeyPersonnel: [
          ...formData.seniorKeyPersonnel,
          { ...newSeniorPersonnel, id: String(Date.now()) },
        ],
      });
      setNewSeniorPersonnel({ name: "", email: "", title: "", role: "Senior Personnel" });
    }
  };

  const handleRemoveSeniorPersonnel = (id: string) => {
    setFormData({
      ...formData,
      seniorKeyPersonnel: formData.seniorKeyPersonnel.filter((p) => p.id !== id),
    });
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    // Create new grant from form data
    const newGrant: GrantDetail = {
      id: `GRANT-${String(mockGrantDetails.length + 1).padStart(3, "0")}`,
      grantNumber: formData.grantNumber || `PENDING-${Date.now()}`,
      title: formData.title,
      agency: formData.agency as any,
      agencyProgram: formData.agencyProgram,
      opportunityId: formData.opportunityId,
      status: "pre_award",
      universityId: "tuskegee", // Default to Tuskegee for now
      universityName: "Tuskegee University",
      principalInvestigator: {
        name: formData.principalInvestigator.name,
        email: formData.principalInvestigator.email,
        title: formData.principalInvestigator.title,
      },
      coInvestigators: formData.coInvestigators.map((coPI) => ({
        name: coPI.name,
        email: coPI.email,
        title: coPI.title,
      })),
      proposalDate: new Date().toISOString().split("T")[0],
      awardDate: undefined,
      startDate: "",
      endDate: "",
      totalAwardAmount: Number(formData.totalAwardAmount),
      directCosts: Number(formData.directCosts),
      indirectCosts: Number(formData.indirectCosts),
      projectSummary: formData.projectSummary,
      intellectualMerit: formData.intellectualMerit,
      broaderImpacts: formData.broaderImpacts,
      reportingFrequency: "quarterly",
      nextReportDueDate: undefined,
      reportingPortal: "research.gov",
      milestones: [],
      reports: [],
      budgets: [],
      attachments: [
        ...formData.attachments.map((att) => ({
          id: `ATT-${Date.now()}-${Math.random()}`,
          name: att.name,
          type: att.type as any,
          uploadDate: new Date().toISOString().split("T")[0],
          fileSize: att.file ? `${(att.file.size / 1024).toFixed(1)} KB` : "0 KB",
          url: `/files/grants/draft/${att.name}`,
          uploadedBy: formData.principalInvestigator.name,
        })),
        {
          id: `ATT-${Date.now()}`,
          name: `${formData.title}-Proposal.pdf`,
          type: "proposal",
          uploadDate: new Date().toISOString().split("T")[0],
          fileSize: "0 KB",
          url: "/files/grants/draft/proposal.pdf",
          uploadedBy: formData.principalInvestigator.name,
        },
      ],
      internalNotes: "Application submitted via FedSignal wizard",
      agencyNotes: undefined,
    };

    // Simulate API call to save grant application
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add to mock data (in a real app, this would be saved to Firebase)
    mockGrantDetails.push(newGrant);

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Redirect to grants list after successful submission
    setTimeout(() => {
      router.push("/fedsignal/grants");
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your grant application has been submitted successfully. Redirecting to grant tracker...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex gap-2 mb-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/fedsignal/grants">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Grants
                  </Link>
                </Button>
                <WalkthroughButton onClick={() => setWalkthroughOpen(true)} />
              </div>
              <h1 className="text-3xl font-bold">New Grant Application</h1>
              <p className="text-muted-foreground">Create a new grant application or respond to an opportunity</p>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Last saved: {lastSaved}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSavingDraft}>
                {isSavingDraft ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep === step.id
                        ? "bg-[#1a56db] text-white"
                        : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="text-xs mt-2 text-center font-medium max-w-24">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 0 && <Sparkles className="h-5 w-5" />}
              {currentStep === 1 && <FileText className="h-5 w-5" />}
              {currentStep === 2 && <FileText className="h-5 w-5" />}
              {currentStep === 3 && <FileText className="h-5 w-5" />}
              {currentStep === 4 && <DollarSign className="h-5 w-5" />}
              {currentStep === 5 && <Users className="h-5 w-5" />}
              {currentStep === 6 && <Building2 className="h-5 w-5" />}
              {currentStep === 7 && <GraduationCap className="h-5 w-5" />}
              {currentStep === 8 && <CheckCircle2 className="h-5 w-5" />}
              {currentStep === 9 && <CheckCircle2 className="h-5 w-5" />}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 0: Grant Type Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">How would you like to proceed?</h2>
                  <p className="text-muted-foreground">Choose the option that best describes your situation</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                      grantType === "create" ? "border-[#1a56db] bg-blue-50 dark:bg-blue-950" : "border-slate-200"
                    }`}
                    onClick={() => setGrantType("create")}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-full ${
                          grantType === "create" ? "bg-[#1a56db] text-white" : "bg-slate-100"
                        }`}>
                          <FileText className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Create New Grant</h3>
                          <p className="text-sm text-muted-foreground">
                            Start a new grant application from scratch with all required sections
                          </p>
                        </div>
                        <Button 
                          variant={grantType === "create" ? "default" : "outline"}
                          className={grantType === "create" ? "bg-[#1a56db]" : ""}
                        >
                          {grantType === "create" ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                      grantType === "respond" ? "border-[#1a56db] bg-blue-50 dark:bg-blue-950" : "border-slate-200"
                    }`}
                    onClick={() => setGrantType("respond")}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-full ${
                          grantType === "respond" ? "bg-[#1a56db] text-white" : "bg-slate-100"
                        }`}>
                          <FileUp className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Respond to Grant</h3>
                          <p className="text-sm text-muted-foreground">
                            Upload an existing grant RFP and let AI help parse requirements
                          </p>
                        </div>
                        <Button 
                          variant={grantType === "respond" ? "default" : "outline"}
                          className={grantType === "respond" ? "bg-[#1a56db]" : ""}
                        >
                          {grantType === "respond" ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* File Upload for Responding */}
                {grantType === "respond" && (
                  <div className="mt-6 space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#1a56db] transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      ref={dropZoneRef}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your grant RFP here, or click to browse
                      </p>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <FileUp className="h-4 w-4 mr-2" />
                        Upload Grant Document
                      </Button>
                    </div>

                    {uploadedGrantFile && (
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileDown className="h-5 w-5 text-[#1a56db]" />
                            <div>
                              <p className="font-medium">{uploadedGrantFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(uploadedGrantFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          {isParsingGrant ? (
                            <div className="flex items-center gap-2 text-sm text-[#1a56db]">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Parsing with AI...
                            </div>
                          ) : parsedGrantRequirements ? (
                            <Badge variant="default" className="bg-green-500">
                              Parsed Successfully
                            </Badge>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => setUploadedGrantFile(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {parsedGrantRequirements && (
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          AI-Parsed Grant Requirements
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Grant Title:</span>
                            <p className="font-medium">{parsedGrantRequirements.title}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Agency:</span>
                            <p className="font-medium">{parsedGrantRequirements.agency}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline:</span>
                            <p className="font-medium">{parsedGrantRequirements.deadline}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Required Fields:</p>
                          <div className="flex flex-wrap gap-2">
                            {parsedGrantRequirements.requiredFields.map((field: string, idx: number) => (
                              <Badge key={idx} variant="secondary">{field}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Specific Requirements:</p>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {parsedGrantRequirements.specificRequirements.map((req: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button className="w-full bg-[#1a56db]" onClick={() => {
                          // Pre-fill form with parsed data
                          setFormData({
                            ...formData,
                            title: parsedGrantRequirements.title,
                            agency: parsedGrantRequirements.agency,
                          });
                        }}>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Pre-fill Application with AI Data
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grantNumber">Grant Number (if known)</Label>
                  <Input
                    id="grantNumber"
                    value={formData.grantNumber}
                    onChange={(e) => setFormData({ ...formData, grantNumber: e.target.value })}
                    placeholder="e.g., NSF-25-1234"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title">Grant Title *</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAutocomplete("title")}
                      className="text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Suggestions
                    </Button>
                  </div>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., HBCU Cybersecurity Research Initiative"
                  />
                  {showAutocomplete && autocompleteField === "title" && (
                    <div className="bg-white dark:bg-slate-800 border rounded-lg p-2 shadow-lg space-y-1">
                      {autocompleteSuggestionsList.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency">Agency *</Label>
                  <Select value={formData.agency} onValueChange={(value) => setFormData({ ...formData, agency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agency" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id}>
                          {agency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencyProgram">Agency Program</Label>
                  <Input
                    id="agencyProgram"
                    value={formData.agencyProgram}
                    onChange={(e) => setFormData({ ...formData, agencyProgram: e.target.value })}
                    placeholder="e.g., HBCU-UP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opportunityId">Opportunity ID (if responding to an opportunity)</Label>
                  <Input
                    id="opportunityId"
                    value={formData.opportunityId}
                    onChange={(e) => setFormData({ ...formData, opportunityId: e.target.value })}
                    placeholder="e.g., OPP-12345"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Template Library */}
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Quick Start Templates
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Use these templates as a starting point for your grant application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-3">
                      {grantTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-300"
                          onClick={() => handleApplyTemplate(template.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <Badge variant="secondary" className="text-xs">
                                {template.category}
                              </Badge>
                              <h4 className="font-semibold text-sm">{template.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {template.description}
                              </p>
                              <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                                <Copy className="h-3 w-3 mr-1" />
                                Apply Template
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="projectSummary">Project Summary (1-page) *</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutocomplete("projectSummary")}
                        disabled={isEnhancingAI}
                        className="text-xs"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Suggestions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnhanceWithAI("projectSummary")}
                        disabled={isEnhancingAI || !formData.projectSummary}
                        className="text-xs"
                      >
                        {isEnhancingAI ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            Enhance with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Provide a concise overview of the proposed activity, intellectual merit, and broader impacts.</p>
                  <Textarea
                    id="projectSummary"
                    value={formData.projectSummary}
                    onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
                    placeholder="Summarize the proposed project, its intellectual merit, and broader impacts..."
                    rows={6}
                  />
                  {showAutocomplete && autocompleteField === "projectSummary" && (
                    <div className="bg-white dark:bg-slate-800 border rounded-lg p-2 shadow-lg space-y-1">
                      {autocompleteSuggestionsList.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.projectSummary.length} characters (recommended: ~3000)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="intellectualMerit">Intellectual Merit *</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutocomplete("intellectualMerit")}
                        disabled={isEnhancingAI}
                        className="text-xs"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Suggestions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnhanceWithAI("intellectualMerit")}
                        disabled={isEnhancingAI || !formData.intellectualMerit}
                        className="text-xs"
                      >
                        {isEnhancingAI ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            Enhance with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Describe how the proposed activity advances knowledge and understanding within its field.</p>
                  <Textarea
                    id="intellectualMerit"
                    value={formData.intellectualMerit}
                    onChange={(e) => setFormData({ ...formData, intellectualMerit: e.target.value })}
                    placeholder="Explain the intellectual significance of the proposed work..."
                    rows={4}
                  />
                  {showAutocomplete && autocompleteField === "intellectualMerit" && (
                    <div className="bg-white dark:bg-slate-800 border rounded-lg p-2 shadow-lg space-y-1">
                      {autocompleteSuggestionsList.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="broaderImpacts">Broader Impacts *</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutocomplete("broaderImpacts")}
                        disabled={isEnhancingAI}
                        className="text-xs"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Suggestions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnhanceWithAI("broaderImpacts")}
                        disabled={isEnhancingAI || !formData.broaderImpacts}
                        className="text-xs"
                      >
                        {isEnhancingAI ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            Enhance with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Describe how the proposed activity benefits society and advances desired societal outcomes.</p>
                  <Textarea
                    id="broaderImpacts"
                    value={formData.broaderImpacts}
                    onChange={(e) => setFormData({ ...formData, broaderImpacts: e.target.value })}
                    placeholder="Explain the broader impacts of the proposed work..."
                    rows={4}
                  />
                  {showAutocomplete && autocompleteField === "broaderImpacts" && (
                    <div className="bg-white dark:bg-slate-800 border rounded-lg p-2 shadow-lg space-y-1">
                      {autocompleteSuggestionsList.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEnhanceWithAI("projectDescription")}
                      disabled={isEnhancingAI || !formData.projectDescription}
                      className="text-xs"
                    >
                      {isEnhancingAI ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3 w-3 mr-1" />
                          Enhance with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Detailed description of the proposed project (up to 15 pages for NSF). Include: objectives, methodology, evaluation, and expected outcomes.</p>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Provide a detailed description of what you want to do, why you want to do it, how you plan to do it, how you will know if you succeed, and what benefits could accrue if the project is successful..."
                    rows={12}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencesCited">References Cited</Label>
                  <Textarea
                    id="referencesCited"
                    value={formData.referencesCited}
                    onChange={(e) => setFormData({ ...formData, referencesCited: e.target.value })}
                    placeholder="List bibliographic citations..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAwardAmount">Total Award Amount ($) *</Label>
                    <Input
                      id="totalAwardAmount"
                      type="number"
                      value={formData.totalAwardAmount}
                      onChange={(e) => setFormData({ ...formData, totalAwardAmount: e.target.value })}
                      placeholder="250000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="directCosts">Direct Costs ($) *</Label>
                    <Input
                      id="directCosts"
                      type="number"
                      value={formData.directCosts}
                      onChange={(e) => setFormData({ ...formData, directCosts: e.target.value })}
                      placeholder="200000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indirectCosts">Indirect Costs ($)</Label>
                    <Input
                      id="indirectCosts"
                      type="number"
                      value={formData.indirectCosts}
                      onChange={(e) => setFormData({ ...formData, indirectCosts: e.target.value })}
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetJustification">Budget Justification *</Label>
                  <p className="text-xs text-muted-foreground">Document and justify each budget line item (typically up to 5 pages).</p>
                  <Textarea
                    id="budgetJustification"
                    value={formData.budgetJustification}
                    onChange={(e) => setFormData({ ...formData, budgetJustification: e.target.value })}
                    placeholder="Provide a detailed justification for each budget category..."
                    rows={8}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-semibold">Principal Investigator *</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="piName">Name</Label>
                      <Input
                        id="piName"
                        value={formData.principalInvestigator.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            principalInvestigator: { ...formData.principalInvestigator, name: e.target.value },
                          })
                        }
                        placeholder="Dr. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="piEmail">Email</Label>
                      <Input
                        id="piEmail"
                        type="email"
                        value={formData.principalInvestigator.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            principalInvestigator: { ...formData.principalInvestigator, email: e.target.value },
                          })
                        }
                        placeholder="john.doe@institution.edu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="piTitle">Title</Label>
                      <Input
                        id="piTitle"
                        value={formData.principalInvestigator.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            principalInvestigator: { ...formData.principalInvestigator, title: e.target.value },
                          })
                        }
                        placeholder="Professor"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Co-Principal Investigators</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coPIName">Name</Label>
                      <Input
                        id="coPIName"
                        value={newCoPI.name}
                        onChange={(e) => setNewCoPI({ ...newCoPI, name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coPIEmail">Email</Label>
                      <Input
                        id="coPIEmail"
                        type="email"
                        value={newCoPI.email}
                        onChange={(e) => setNewCoPI({ ...newCoPI, email: e.target.value })}
                        placeholder="jane.smith@institution.edu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coPITitle">Title</Label>
                      <Input
                        id="coPITitle"
                        value={newCoPI.title}
                        onChange={(e) => setNewCoPI({ ...newCoPI, title: e.target.value })}
                        placeholder="Associate Professor"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCoPI} disabled={!newCoPI.name || !newCoPI.email}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Co-PI
                  </Button>
                  {formData.coInvestigators.length > 0 && (
                    <div className="space-y-2">
                      {formData.coInvestigators.map((person) => (
                        <div key={person.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <span className="font-medium">{person.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{person.email}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveCoPI(person.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Senior/Key Personnel</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seniorName">Name</Label>
                      <Input
                        id="seniorName"
                        value={newSeniorPersonnel.name}
                        onChange={(e) => setNewSeniorPersonnel({ ...newSeniorPersonnel, name: e.target.value })}
                        placeholder="Dr. Bob Johnson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seniorEmail">Email</Label>
                      <Input
                        id="seniorEmail"
                        type="email"
                        value={newSeniorPersonnel.email}
                        onChange={(e) => setNewSeniorPersonnel({ ...newSeniorPersonnel, email: e.target.value })}
                        placeholder="bob.johnson@institution.edu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seniorTitle">Title</Label>
                      <Input
                        id="seniorTitle"
                        value={newSeniorPersonnel.title}
                        onChange={(e) => setNewSeniorPersonnel({ ...newSeniorPersonnel, title: e.target.value })}
                        placeholder="Research Scientist"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seniorRole">Role</Label>
                      <Select
                        value={newSeniorPersonnel.role}
                        onValueChange={(value: any) => setNewSeniorPersonnel({ ...newSeniorPersonnel, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Senior Personnel">Senior Personnel</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddSeniorPersonnel} disabled={!newSeniorPersonnel.name || !newSeniorPersonnel.email}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Personnel
                  </Button>
                  {formData.seniorKeyPersonnel.length > 0 && (
                    <div className="space-y-2">
                      {formData.seniorKeyPersonnel.map((person) => (
                        <div key={person.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <span className="font-medium">{person.name}</span>
                            <Badge variant="secondary" className="ml-2">{person.role}</Badge>
                            <span className="text-sm text-muted-foreground ml-2">{person.email}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveSeniorPersonnel(person.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilitiesDescription">Facilities, Equipment, and Other Resources</Label>
                  <p className="text-xs text-muted-foreground">Describe the internal and external resources (both physical and personnel) that the proposing organization and its collaborators will provide to the project if funded.</p>
                  <Textarea
                    id="facilitiesDescription"
                    value={formData.facilitiesDescription}
                    onChange={(e) => setFormData({ ...formData, facilitiesDescription: e.target.value })}
                    placeholder="Describe available laboratories, equipment, computing resources, and other facilities..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipmentDescription">Major Equipment (if applicable)</Label>
                  <Textarea
                    id="equipmentDescription"
                    value={formData.equipmentDescription}
                    onChange={(e) => setFormData({ ...formData, equipmentDescription: e.target.value })}
                    placeholder="List major equipment to be acquired or used..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mentoringPlan">Mentoring Plan (if applicable)</Label>
                  <p className="text-xs text-muted-foreground">If your proposal requests funding to support graduate students or postdoctoral researchers, include a 1-page summary describing the mentoring activities.</p>
                  <Textarea
                    id="mentoringPlan"
                    value={formData.mentoringPlan}
                    onChange={(e) => setFormData({ ...formData, mentoringPlan: e.target.value })}
                    placeholder="Describe mentoring activities for graduate students and postdoctoral researchers..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataManagementPlan">Data Management and Sharing Plan</Label>
                  <p className="text-xs text-muted-foreground">Describe how data will be managed, preserved, and shared throughout the project lifecycle and beyond.</p>
                  <Textarea
                    id="dataManagementPlan"
                    value={formData.dataManagementPlan}
                    onChange={(e) => setFormData({ ...formData, dataManagementPlan: e.target.value })}
                    placeholder="Describe data types, standards, preservation, access, and sharing plans..."
                    rows={6}
                  />
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Supporting Documents</Label>
                  <p className="text-xs text-muted-foreground">Attach required documents such as proposal PDFs, budget justifications, biosketches, and other deliverables.</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="attachmentType">Document Type</Label>
                    <Select
                      value={newAttachment.type}
                      onValueChange={(value: any) => setNewAttachment({ ...newAttachment, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="deliverable">Deliverable</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="personnel">Personnel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="fileUpload">Upload File</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                  </div>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Documents</Label>
                    <div className="space-y-2">
                      {formData.attachments.map((att, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="font-medium">{att.name}</span>
                            <Badge variant="secondary">{att.type}</Badge>
                            <span className="text-xs text-muted-foreground">{att.file ? `${(att.file.size / 1024).toFixed(1)} KB` : "0 KB"}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveAttachment(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-6">
                {/* Checklist for Grant Responses */}
                {grantType === "respond" && checklistItems.length > 0 && (
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-[#1a56db]" />
                        Submission Checklist
                      </CardTitle>
                      <CardDescription>
                        Complete all items before submitting your grant response
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {checklistItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                            onClick={() => toggleChecklistItem(item.id)}
                          >
                            <div className="mt-0.5">
                              {item.completed ? (
                                <CheckSquare className="h-5 w-5 text-green-500" />
                              ) : (
                                <Square className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <span
                              className={`flex-1 ${
                                item.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress: {checklistItems.filter((item) => item.completed).length} / {checklistItems.length}
                          </span>
                          <Badge
                            variant={
                              checklistItems.every((item) => item.completed)
                                ? "default"
                                : "secondary"
                            }
                            className={
                              checklistItems.every((item) => item.completed)
                                ? "bg-green-500"
                                : ""
                            }
                          >
                            {checklistItems.every((item) => item.completed)
                              ? "Ready to Submit"
                              : "Incomplete"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Application Summary</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grant Title:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agency:</span>
                      <span className="font-medium">{formData.agency}</span>
                    </div>
                    {formData.grantNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grant Number:</span>
                        <span className="font-medium">{formData.grantNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Award Amount:</span>
                      <span className="font-medium">${Number(formData.totalAwardAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal Investigator:</span>
                      <span className="font-medium">{formData.principalInvestigator.name}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Project Summary Preview</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{formData.projectSummary}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Personnel</h4>
                    <div className="space-y-1 text-sm">
                      <div>PI: {formData.principalInvestigator.name}</div>
                      {formData.coInvestigators.length > 0 && (
                        <div>Co-PIs: {formData.coInvestigators.map((p) => p.name).join(", ")}</div>
                      )}
                      {formData.seniorKeyPersonnel.length > 0 && (
                        <div>Senior Personnel: {formData.seniorKeyPersonnel.map((p) => p.name).join(", ")}</div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Attachments</h4>
                    <div className="space-y-1 text-sm">
                      {formData.attachments.length > 0 ? (
                        formData.attachments.map((att, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Paperclip className="h-3 w-3" />
                            <span>{att.name}</span>
                            <Badge variant="secondary">{att.type}</Badge>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No attachments uploaded</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="rounded border-input"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    I confirm that all information provided is accurate and complete. I understand that submission of this application constitutes agreement to the agency's terms and conditions.
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {currentStep < 9 ? (
                <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Walkthrough 
        steps={grantApplicationWalkthroughSteps}
        isOpen={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        title="Grant Application Guide"
      />
    </div>
  );
}
