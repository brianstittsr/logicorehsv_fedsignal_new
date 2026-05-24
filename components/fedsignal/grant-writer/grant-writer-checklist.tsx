"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "preparation" | "narrative" | "budget" | "compliance" | "submission";
  priority: "critical" | "high" | "medium" | "low";
  estimatedMinutes: number;
  completed: boolean;
  required: boolean;
  bestPractice?: string;
  aiTip?: string;
  resources?: { title: string; url: string }[];
  dependsOn?: string[];
}

export interface GrantPhase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
  deadline?: Date;
}

const defaultGrantPhases: GrantPhase[] = [
  {
    id: "phase-1-discovery",
    title: "Phase 1: Opportunity Discovery & Vetting",
    description: "Find the right opportunity and determine fit",
    icon: <Lightbulb className="h-5 w-5" />,
    items: [
      {
        id: "1.1",
        title: "Review opportunity announcement (FOA/RFP)",
        description: "Read the full funding opportunity announcement carefully",
        category: "preparation",
        priority: "critical",
        estimatedMinutes: 30,
        completed: false,
        required: true,
        bestPractice: "Always download and save the original PDF. Agencies sometimes update opportunities without notice.",
        aiTip: "Upload the FOA to Hermes AI for a summary of key requirements and deadlines.",
      },
      {
        id: "1.2",
        title: "Verify institutional eligibility",
        description: "Confirm your university meets all eligibility criteria",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 15,
        completed: false,
        required: true,
        bestPractice: "Check for HBCU-specific set-asides and eligibility requirements.",
      },
      {
        id: "1.3",
        title: "Assess capability alignment",
        description: "Match your research strengths to opportunity requirements",
        category: "preparation",
        priority: "high",
        estimatedMinutes: 20,
        completed: false,
        required: true,
        aiTip: "Use FedSignal's AI Recommendations to see match scores for this opportunity.",
      },
      {
        id: "1.4",
        title: "Check SAM.gov registration status",
        description: "Ensure UEI and CAGE code are active",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 10,
        completed: false,
        required: true,
        bestPractice: "SAM.gov registration must be active throughout the entire proposal process and award period.",
      },
      {
        id: "1.5",
        title: "Review budget limitations",
        description: "Check award ceilings, cost-sharing requirements",
        category: "budget",
        priority: "high",
        estimatedMinutes: 15,
        completed: false,
        required: true,
      },
      {
        id: "1.6",
        title: "Identify teaming opportunities",
        description: "Determine if partnering would strengthen proposal",
        category: "preparation",
        priority: "medium",
        estimatedMinutes: 20,
        completed: false,
        required: false,
        aiTip: "Check the Teaming tab in Recommendations for potential partners.",
      },
      {
        id: "1.7",
        title: "Go/No-Go Decision",
        description: "Make formal decision to pursue or pass",
        category: "preparation",
        priority: "critical",
        estimatedMinutes: 30,
        completed: false,
        required: true,
        bestPractice: "Document the decision rationale. This helps with future opportunity assessment.",
        dependsOn: ["1.1", "1.2", "1.3", "1.4"],
      },
    ],
  },
  {
    id: "phase-2-planning",
    title: "Phase 2: Proposal Planning & Strategy",
    description: "Build your proposal roadmap and team",
    icon: <BookOpen className="h-5 w-5" />,
    items: [
      {
        id: "2.1",
        title: "Assemble proposal team",
        description: "Identify PI, co-investigators, key personnel",
        category: "preparation",
        priority: "critical",
        estimatedMinutes: 45,
        completed: false,
        required: true,
        bestPractice: "Include a grant coordinator/project manager early to manage deadlines and compliance.",
      },
      {
        id: "2.2",
        title: "Create proposal timeline",
        description: "Work backwards from deadline with milestones",
        category: "preparation",
        priority: "critical",
        estimatedMinutes: 30,
        completed: false,
        required: true,
        bestPractice: "Build in buffer time - internal deadlines should be 48-72 hours before agency deadline.",
        aiTip: "Use FedSignal's deadline tracker to set automatic reminders.",
      },
      {
        id: "2.3",
        title: "Assign writing responsibilities",
        description: "Divide narrative sections among team members",
        category: "narrative",
        priority: "high",
        estimatedMinutes: 20,
        completed: false,
        required: true,
      },
      {
        id: "2.4",
        title: "Gather required documents",
        description: "Collect bios, letters of support, MOUs",
        category: "preparation",
        priority: "high",
        estimatedMinutes: 60,
        completed: false,
        required: true,
        bestPractice: "Start gathering documents early. Letters of support often take 2-3 weeks.",
      },
      {
        id: "2.5",
        title: "Review evaluation criteria",
        description: "Understand how proposal will be scored",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 20,
        completed: false,
        required: true,
        bestPractice: "Align your narrative structure with the evaluation criteria sections.",
      },
      {
        id: "2.6",
        title: "Conduct competitor analysis",
        description: "Research likely competing institutions",
        category: "preparation",
        priority: "medium",
        estimatedMinutes: 45,
        completed: false,
        required: false,
        aiTip: "Use Win/Loss Tracker to see which HBCUs have succeeded in similar opportunities.",
      },
    ],
  },
  {
    id: "phase-3-narrative",
    title: "Phase 3: Narrative Development",
    description: "Write compelling proposal content",
    icon: <FileText className="h-5 w-5" />,
    items: [
      {
        id: "3.1",
        title: "Draft executive summary/abstract",
        description: "Create compelling overview of entire proposal",
        category: "narrative",
        priority: "high",
        estimatedMinutes: 90,
        completed: false,
        required: true,
        bestPractice: "Write this last, but place it first. It should capture the essence of your approach.",
        aiTip: "Use Proposal Pal with your concept to generate a strong first draft.",
      },
      {
        id: "3.2",
        title: "Develop needs statement",
        description: "Articulate the problem and its significance",
        category: "narrative",
        priority: "critical",
        estimatedMinutes: 120,
        completed: false,
        required: true,
        bestPractice: "Support every claim with citations to credible sources.",
      },
      {
        id: "3.3",
        title: "Describe project approach/methodology",
        description: "Detail your solution and implementation plan",
        category: "narrative",
        priority: "critical",
        estimatedMinutes: 180,
        completed: false,
        required: true,
        bestPractice: "Use graphics, charts, and timelines to make complex approaches understandable.",
      },
      {
        id: "3.4",
        title: "Present evaluation plan",
        description: "Define measurable outcomes and assessment methods",
        category: "narrative",
        priority: "critical",
        estimatedMinutes: 90,
        completed: false,
        required: true,
        bestPractice: "Include both quantitative and qualitative measures. Show how you'll track success.",
      },
      {
        id: "3.5",
        title: "Detail institutional capacity",
        description: "Demonstrate your university can execute",
        category: "narrative",
        priority: "high",
        estimatedMinutes: 60,
        completed: false,
        required: true,
        bestPractice: "Highlight HBCU-specific strengths: student mentoring, community connections, cultural competency.",
        aiTip: "Pull from your Capability Vault for pre-approved language about institutional strengths.",
      },
      {
        id: "3.6",
        title: "Compile personnel bios/CVs",
        description: "Format according to agency requirements",
        category: "narrative",
        priority: "high",
        estimatedMinutes: 90,
        completed: false,
        required: true,
        bestPractice: "Tailor bios to highlight relevant experience for THIS opportunity.",
      },
      {
        id: "3.7",
        title: "Write sustainability plan",
        description: "Describe post-award continuation strategy",
        category: "narrative",
        priority: "medium",
        estimatedMinutes: 60,
        completed: false,
        required: false,
        bestPractice: "Show how the project continues after federal funding ends.",
      },
    ],
  },
  {
    id: "phase-4-budget",
    title: "Phase 4: Budget Development",
    description: "Build accurate, compliant budget",
    icon: <DollarSign className="h-5 w-5" />,
    items: [
      {
        id: "4.1",
        title: "Calculate personnel costs",
        description: "Salary, fringe benefits, effort percentages",
        category: "budget",
        priority: "critical",
        estimatedMinutes: 90,
        completed: false,
        required: true,
        bestPractice: "Use institutional base salaries, NOT market rates. Document all assumptions.",
        aiTip: "Use F&A Calculator to ensure fringe and overhead are calculated correctly.",
      },
      {
        id: "4.2",
        title: "Estimate non-personnel costs",
        description: "Equipment, supplies, travel, consultants",
        category: "budget",
        priority: "critical",
        estimatedMinutes: 60,
        completed: false,
        required: true,
        bestPractice: "Get 3 quotes for equipment over $5,000. Document cost reasonableness.",
      },
      {
        id: "4.3",
        title: "Apply F&A (indirect costs)",
        description: "Calculate overhead at appropriate rate",
        category: "budget",
        priority: "critical",
        estimatedMinutes: 30,
        completed: false,
        required: true,
        bestPractice: "Use federally negotiated rate. Some programs cap F&A - verify limits.",
      },
      {
        id: "4.4",
        title: "Prepare budget justification",
        description: "Narrative explaining each cost category",
        category: "budget",
        priority: "critical",
        estimatedMinutes: 90,
        completed: false,
        required: true,
        bestPractice: "Justify every cost. Connect expenses directly to project activities.",
      },
      {
        id: "4.5",
        title: "Check cost-sharing commitments",
        description: "Verify matching funds and in-kind contributions",
        category: "budget",
        priority: "high",
        estimatedMinutes: 30,
        completed: false,
        required: false,
        bestPractice: "Get institutional approval for any cost-sharing BEFORE proposal submission.",
      },
      {
        id: "4.6",
        title: "Complete SF-424 budget forms",
        description: "Enter data into federal standard forms",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 45,
        completed: false,
        required: true,
        aiTip: "Use FedSignal's auto-fill feature from your budget spreadsheet.",
      },
    ],
  },
  {
    id: "phase-5-compliance",
    title: "Phase 5: Compliance & Review",
    description: "Ensure all requirements are met",
    icon: <AlertCircle className="h-5 w-5" />,
    items: [
      {
        id: "5.1",
        title: "Complete required federal forms",
        description: "SF-424, Budget, Assurances, etc.",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 60,
        completed: false,
        required: true,
        bestPractice: "Use SAM.gov pre-populated data when available to avoid errors.",
      },
      {
        id: "5.2",
        title: "Verify formatting requirements",
        description: "Font, margins, page limits, file naming",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 20,
        completed: false,
        required: true,
        bestPractice: "Non-compliance with formatting can result in automatic rejection.",
      },
      {
        id: "5.3",
        title: "Check for required certifications",
        description: "Lobbying, debarment, civil rights, etc.",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 30,
        completed: false,
        required: true,
      },
      {
        id: "5.4",
        title: "Run internal review (red team)",
        description: "Independent reviewers critique proposal",
        category: "compliance",
        priority: "high",
        estimatedMinutes: 120,
        completed: false,
        required: true,
        bestPractice: "Use reviewers who understand the program but didn't write the proposal.",
      },
      {
        id: "5.5",
        title: "Compliance checklist review",
        description: "Systematic verification of all requirements",
        category: "compliance",
        priority: "critical",
        estimatedMinutes: 45,
        completed: false,
        required: true,
      },
      {
        id: "5.6",
        title: "Final proofreading",
        description: "Grammar, spelling, consistency check",
        category: "compliance",
        priority: "high",
        estimatedMinutes: 60,
        completed: false,
        required: true,
        bestPractice: "Read aloud to catch awkward phrasing. Use multiple proofreaders.",
      },
    ],
  },
  {
    id: "phase-6-submission",
    title: "Phase 6: Submission & Follow-up",
    description: "Submit and track your proposal",
    icon: <Calendar className="h-5 w-5" />,
    items: [
      {
        id: "6.1",
        title: "Submit 72 hours before deadline",
        description: "Build in buffer for technical issues",
        category: "submission",
        priority: "critical",
        estimatedMinutes: 30,
        completed: false,
        required: true,
        bestPractice: "Agency systems often slow down near deadlines. Early submission is critical.",
      },
      {
        id: "6.2",
        title: "Confirm submission receipt",
        description: "Save tracking numbers and confirmation emails",
        category: "submission",
        priority: "critical",
        estimatedMinutes: 15,
        completed: false,
        required: true,
      },
      {
        id: "6.3",
        title: "Notify institutional officials",
        description: "Alert sponsored programs office",
        category: "submission",
        priority: "high",
        estimatedMinutes: 10,
        completed: false,
        required: true,
      },
      {
        id: "6.4",
        title: "Set up tracking reminders",
        description: "Schedule follow-up for status updates",
        category: "submission",
        priority: "medium",
        estimatedMinutes: 15,
        completed: false,
        required: false,
        aiTip: "FedSignal will automatically track this opportunity and alert you to updates.",
      },
      {
        id: "6.5",
        title: "Prepare for just-in-time requests",
        description: "Gather additional docs that may be requested",
        category: "submission",
        priority: "medium",
        estimatedMinutes: 30,
        completed: false,
        required: false,
        bestPractice: "Keep updated bios, IRB approvals, and current & pending support ready.",
      },
      {
        id: "6.6",
        title: "Document lessons learned",
        description: "Capture insights for future proposals",
        category: "submission",
        priority: "low",
        estimatedMinutes: 20,
        completed: false,
        required: false,
        bestPractice: "Update your capability vault with new accomplishments and lessons.",
      },
    ],
  },
];

export function GrantWriterChecklist() {
  const [phases, setPhases] = useState<GrantPhase[]>(defaultGrantPhases);
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["phase-1-discovery"]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
    );
  };

  const toggleItem = (phaseId: string, itemId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          items: phase.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  const getProgress = (phase: GrantPhase) => {
    const completed = phase.items.filter((i) => i.completed).length;
    const required = phase.items.filter((i) => i.required).length;
    const requiredCompleted = phase.items.filter((i) => i.required && i.completed).length;
    return { completed, total: phase.items.length, required, requiredCompleted };
  };

  const getOverallProgress = () => {
    const allItems = phases.flatMap((p) => p.items);
    const completed = allItems.filter((i) => i.completed).length;
    const criticalPending = allItems.filter(
      (i) => i.priority === "critical" && !i.completed
    ).length;
    return { completed, total: allItems.length, criticalPending };
  };

  const overall = getOverallProgress();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "preparation":
        return <BookOpen className="h-4 w-4" />;
      case "narrative":
        return <FileText className="h-4 w-4" />;
      case "budget":
        return <DollarSign className="h-4 w-4" />;
      case "compliance":
        return <AlertCircle className="h-4 w-4" />;
      case "submission":
        return <Calendar className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Grant Writer's Master Checklist
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete guide from opportunity discovery to award
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round((overall.completed / overall.total) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {overall.completed}/{overall.total} complete
            </p>
            {overall.criticalPending > 0 && (
              <Badge variant="destructive" className="mt-1">
                {overall.criticalPending} critical pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-4">
            {phases.map((phase) => {
              const progress = getProgress(phase);
              const isExpanded = expandedPhases.includes(phase.id);

              return (
                <Collapsible
                  key={phase.id}
                  open={isExpanded}
                  onOpenChange={() => togglePhase(phase.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                        progress.requiredCompleted === progress.required
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            progress.requiredCompleted === progress.required
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-white text-slate-600"
                          }`}
                        >
                          {phase.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{phase.title}</h3>
                          <p className="text-sm text-slate-600">{phase.description}</p>
                          {phase.deadline && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Deadline: {phase.deadline.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {progress.completed}/{progress.total}
                          </p>
                          <p className="text-xs text-slate-500">
                            {progress.requiredCompleted}/{progress.required} required
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 transition-transform ${
                            isExpanded ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="mt-2 space-y-2 pl-4">
                      {phase.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border transition-all ${
                            item.completed
                              ? "bg-emerald-50/50 border-emerald-200"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => toggleItem(phase.id, item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`text-sm font-medium ${
                                        item.completed
                                          ? "text-emerald-700 line-through"
                                          : "text-slate-900"
                                      }`}
                                    >
                                      {item.title}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getPriorityColor(
                                        item.priority
                                      )}`}
                                    >
                                      {item.priority}
                                    </Badge>
                                    {item.required && (
                                      <Badge variant="outline" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                  <p
                                    className={`text-sm mt-1 ${
                                      item.completed
                                        ? "text-emerald-600/70"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {item.description}
                                  </p>

                                  {(item.bestPractice || item.aiTip) && (
                                    <div className="mt-3 space-y-2">
                                      {item.bestPractice && (
                                        <div className="flex items-start gap-2 text-sm">
                                          <BookOpen className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                          <span className="text-amber-800">
                                            <strong>Best Practice:</strong>{" "}
                                            {item.bestPractice}
                                          </span>
                                        </div>
                                      )}
                                      {item.aiTip && (
                                        <div className="flex items-start gap-2 text-sm">
                                          <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                                          <span className="text-purple-800">
                                            <strong>AI Tip:</strong> {item.aiTip}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {item.resources && item.resources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {item.resources.map((resource, idx) => (
                                        <Button
                                          key={idx}
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 text-xs text-blue-600"
                                          asChild
                                        >
                                          <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            {resource.title}
                                          </a>
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {item.estimatedMinutes} min
                                  </Badge>
                                  <div className="p-1.5 rounded bg-slate-100">
                                    {getCategoryIcon(item.category)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
