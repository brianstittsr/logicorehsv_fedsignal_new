"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  WizardProvider,
  WizardPhase,
  WizardStep,
  useWizard,
} from "@/components/fedsignal/wizards/wizard-context";
import { WizardNavigator } from "@/components/fedsignal/wizards/wizard-navigator";
import {
  NotificationProvider,
  useNotifications,
} from "@/components/fedsignal/notifications/notification-context";
import { NotificationCenter } from "@/components/fedsignal/notifications/notification-center";
import { GrantWriterChecklist } from "@/components/fedsignal/grant-writer/grant-writer-checklist";
import {
  Lightbulb,
  BookOpen,
  FileText,
  DollarSign,
  AlertCircle,
  Calendar,
  Bell,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Define all wizard steps for each phase
const createPipelineWizardPhases = (): WizardPhase[] => [
  {
    id: "phase-1-discovery",
    title: "Opportunity Discovery",
    description: "Find and vet the right funding opportunity",
    icon: "💡",
    isActive: true,
    isComplete: false,
    steps: [
      {
        id: "1.1-review-foa",
        title: "Review Funding Opportunity Announcement",
        description: "Read and understand the complete FOA/RFP document",
        isComplete: false,
        estimatedTime: "30 min",
        helpText: "Focus on eligibility, deadlines, and evaluation criteria",
        bestPractice: "Download and save the original PDF - agencies may update without notice",
        component: React.createElement("div", { className: "text-center py-8" },
          React.createElement("p", { className: "text-slate-600" }, "Upload FOA document for AI analysis"),
          React.createElement(Button, { className: "mt-4" }, "Upload FOA PDF")
        ),
      },
      {
        id: "1.2-check-eligibility",
        title: "Verify Institutional Eligibility",
        description: "Confirm your university meets all requirements",
        isComplete: false,
        estimatedTime: "15 min",
        helpText: "Check HBCU-specific set-asides and special eligibility",
        component: React.createElement("div", { className: "space-y-4" },
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("input", { type: "checkbox", className: "h-4 w-4" }),
            React.createElement("span", null, "HBCU status verified")
          ),
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("input", { type: "checkbox", className: "h-4 w-4" }),
            React.createElement("span", null, "SAM.gov registration active")
          ),
          React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("input", { type: "checkbox", className: "h-4 w-4" }),
            React.createElement("span", null, "Research classification matches")
          )
        ),
      },
      {
        id: "1.3-capability-match",
        title: "Assess Capability Alignment",
        description: "Match your strengths to opportunity requirements",
        isComplete: false,
        estimatedTime: "20 min",
        helpText: "Use AI match scores to evaluate fit",
        component: React.createElement("div", { className: "p-4 bg-blue-50 rounded-lg" },
          React.createElement("p", { className: "text-blue-800" }, "AI Match Score: 87%"),
          React.createElement("p", { className: "text-sm text-blue-600 mt-2" }, "Strong alignment with STEM Education and HBCU set-aside")
        ),
      },
      {
        id: "1.4-go-no-go",
        title: "Go/No-Go Decision",
        description: "Make formal decision to pursue this opportunity",
        isComplete: false,
        estimatedTime: "30 min",
        isOptional: false,
        bestPractice: "Document your rationale for future reference",
        component: React.createElement("div", { className: "space-y-4" },
          React.createElement(Button, { className: "w-full bg-emerald-600" }, "✓ GO - Start Proposal"),
          React.createElement(Button, { variant: "outline", className: "w-full" }, "✗ NO-GO - Pass on this opportunity")
        ),
      },
    ],
  },
  {
    id: "phase-2-planning",
    title: "Strategic Planning",
    description: "Build your proposal roadmap and team",
    icon: "📋",
    isActive: false,
    isComplete: false,
    steps: [
      {
        id: "2.1-assemble-team",
        title: "Assemble Proposal Team",
        description: "Identify key personnel and assign roles",
        isComplete: false,
        estimatedTime: "45 min",
        component: React.createElement("div", { className: "space-y-3" },
          React.createElement("input", { placeholder: "Principal Investigator", className: "w-full p-2 border rounded" }),
          React.createElement("input", { placeholder: "Co-Investigator(s)", className: "w-full p-2 border rounded" }),
          React.createElement("input", { placeholder: "Grant Coordinator", className: "w-full p-2 border rounded" })
        ),
      },
      {
        id: "2.2-create-timeline",
        title: "Create Proposal Timeline",
        description: "Work backwards from deadline with milestones",
        isComplete: false,
        estimatedTime: "30 min",
        bestPractice: "Build in 48-72 hour buffer before agency deadline",
        component: React.createElement("div", { className: "p-4 bg-amber-50 rounded-lg" },
          React.createElement("p", { className: "text-amber-800 font-medium" }, "Deadline: 45 days remaining"),
          React.createElement("p", { className: "text-sm text-amber-700 mt-2" }, "Internal deadline set to 42 days (3-day buffer)")
        ),
      },
      {
        id: "2.3-assign-writing",
        title: "Assign Writing Responsibilities",
        description: "Divide narrative sections among team",
        isComplete: false,
        estimatedTime: "20 min",
        component: React.createElement("div", { className: "text-center py-4" },
          React.createElement("p", { className: "text-slate-600" }, "Use Proposal Pal to assign sections")
        ),
      },
    ],
  },
  {
    id: "phase-3-narrative",
    title: "Narrative Development",
    description: "Write compelling proposal content",
    icon: "📝",
    isActive: false,
    isComplete: false,
    steps: [
      {
        id: "3.1-needs-statement",
        title: "Develop Needs Statement",
        description: "Articulate the problem and its significance",
        isComplete: false,
        estimatedTime: "120 min",
        bestPractice: "Support every claim with citations",
        component: React.createElement(Button, { className: "w-full" },
          "Open in Proposal Pal"
        ),
      },
      {
        id: "3.2-methodology",
        title: "Describe Methodology",
        description: "Detail your approach and implementation plan",
        isComplete: false,
        estimatedTime: "180 min",
        component: React.createElement(Button, { className: "w-full" },
          "Open in Proposal Pal"
        ),
      },
      {
        id: "3.3-evaluation",
        title: "Present Evaluation Plan",
        description: "Define measurable outcomes",
        isComplete: false,
        estimatedTime: "90 min",
        component: React.createElement(Button, { className: "w-full" },
          "Open in Proposal Pal"
        ),
      },
    ],
  },
  {
    id: "phase-4-budget",
    title: "Budget Development",
    description: "Build accurate, compliant budget",
    icon: "💰",
    isActive: false,
    isComplete: false,
    steps: [
      {
        id: "4.1-personnel",
        title: "Calculate Personnel Costs",
        description: "Salary, fringe, effort percentages",
        isComplete: false,
        estimatedTime: "90 min",
        component: React.createElement(Button, { className: "w-full" },
          "Open F&A Calculator"
        ),
      },
      {
        id: "4.2-non-personnel",
        title: "Estimate Non-Personnel Costs",
        description: "Equipment, supplies, travel, consultants",
        isComplete: false,
        estimatedTime: "60 min",
        component: React.createElement(Button, { className: "w-full" },
          "Open F&A Calculator"
        ),
      },
      {
        id: "4.3-justification",
        title: "Write Budget Justification",
        description: "Narrative explaining each cost",
        isComplete: false,
        estimatedTime: "90 min",
        component: React.createElement(Button, { className: "w-full" },
          "Open in Proposal Pal"
        ),
      },
    ],
  },
  {
    id: "phase-5-compliance",
    title: "Compliance & Review",
    description: "Ensure all requirements are met",
    icon: "✓",
    isActive: false,
    isComplete: false,
    steps: [
      {
        id: "5.1-federal-forms",
        title: "Complete Federal Forms",
        description: "SF-424, Budget, Assurances",
        isComplete: false,
        estimatedTime: "60 min",
        component: React.createElement(Button, { className: "w-full" },
          "Auto-fill from Profile"
        ),
      },
      {
        id: "5.2-red-team",
        title: "Internal Red Team Review",
        description: "Independent critique of proposal",
        isComplete: false,
        estimatedTime: "120 min",
        component: React.createElement(Button, { className: "w-full" },
          "Request Review"
        ),
      },
      {
        id: "5.3-proofread",
        title: "Final Proofreading",
        description: "Grammar, spelling, consistency",
        isComplete: false,
        estimatedTime: "60 min",
        component: React.createElement(Button, { className: "w-full" },
          "Run AI Proofreader"
        ),
      },
    ],
  },
  {
    id: "phase-6-submission",
    title: "Submission & Follow-up",
    description: "Submit and track your proposal",
    icon: "🚀",
    isActive: false,
    isComplete: false,
    steps: [
      {
        id: "6.1-submit",
        title: "Submit to Agency",
        description: "72 hours before deadline buffer",
        isComplete: false,
        estimatedTime: "30 min",
        component: React.createElement(Button, { className: "w-full bg-emerald-600" },
          "Generate Submission Package"
        ),
      },
      {
        id: "6.2-confirm",
        title: "Confirm Receipt",
        description: "Save tracking numbers",
        isComplete: false,
        estimatedTime: "15 min",
        component: React.createElement("div", { className: "space-y-3" },
          React.createElement("input", { placeholder: "Tracking Number", className: "w-full p-2 border rounded" }),
          React.createElement(Button, { className: "w-full" }, "Save to Grant Tracker")
        ),
      },
      {
        id: "6.3-follow-up",
        title: "Set Follow-up Reminders",
        description: "Track status and JIT readiness",
        isComplete: false,
        estimatedTime: "15 min",
        component: React.createElement(Button, { className: "w-full" },
          "Configure Tracking"
        ),
      },
    ],
  },
];

function PipelineWizardContent() {
  const { setPhases, currentPhase, getProgress, getCriticalTasks } = useWizard();
  const { addNotification, addReminder, unreadCount, criticalCount } = useNotifications();

  useEffect(() => {
    // Initialize wizard phases
    setPhases(createPipelineWizardPhases());

    // Add welcome notification
    addNotification({
      title: "Proposal Wizard Started",
      message: "You're now in guided mode. Follow the steps to complete your proposal successfully.",
      type: "info",
      category: "system",
      dismissible: true,
    });

    // Set up deadline reminders
    addReminder({
      title: "Proposal Deadline Approaching",
      description: "45 days remaining until submission deadline",
      triggerDate: new Date(Date.now() + 1000 * 60), // 1 minute from now for demo
      recurring: false,
      category: "deadline",
      notificationType: "warning",
      actionUrl: "/fedsignal/pipeline-wizard",
      isActive: true,
    });
  }, [setPhases, addNotification, addReminder]);

  const progress = getProgress();
  const criticalTasks = getCriticalTasks();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Proposal Wizard
          </h1>
          <p className="text-slate-600 mt-1">
            Guided step-by-step proposal development with grant writer best practices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            {progress.percentage}% Complete
          </Badge>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <Bell className="h-4 w-4 mr-1" />
              {criticalCount} Alerts
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {createPipelineWizardPhases().map((phase, idx) => {
                const isActive = currentPhase?.id === phase.id;
                const isPast = progress.percentage > ((idx + 1) / 6) * 100;
                
                return (
                  <div
                    key={phase.id}
                    className={`flex flex-col items-center gap-1 ${
                      isActive ? "opacity-100" : isPast ? "opacity-70" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        isPast
                          ? "bg-emerald-100 text-emerald-700"
                          : isActive
                          ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isPast ? "✓" : phase.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-600 text-center max-w-[80px]">
                      {phase.title.split(":")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            {criticalTasks.length > 0 && (
              <div className="text-right">
                <p className="text-red-600 font-medium">
                  {criticalTasks.length} Critical Tasks Pending
                </p>
                <p className="text-sm text-slate-500">
                  Complete before proceeding
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="wizard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wizard" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Wizard
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Full Checklist
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wizard" className="mt-6">
          <WizardNavigator />
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <GrantWriterChecklist />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Grant Writing Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <h4 className="font-medium text-slate-900">SF-424 Guide</h4>
                  <p className="text-sm text-slate-600">
                    Step-by-step guide to federal standard forms
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <h4 className="font-medium text-slate-900">Budget Templates</h4>
                  <p className="text-sm text-slate-600">
                    Pre-formatted Excel templates for common agencies
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <h4 className="font-medium text-slate-900">HBCU Success Stories</h4>
                  <p className="text-sm text-slate-600">
                    Learn from funded HBCU proposals
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <h4 className="font-medium text-slate-900">Sample Narratives</h4>
                  <p className="text-sm text-slate-600">
                    AI-generated examples by project type
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PipelineWizardPage() {
  return (
    <NotificationProvider>
      <WizardProvider>
        <PipelineWizardContent />
      </WizardProvider>
    </NotificationProvider>
  );
}
