"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Clock,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useWizard } from "./wizard-context";
import { cn } from "@/lib/utils";

export function WizardNavigator() {
  const {
    phases,
    currentPhase,
    currentStep,
    completeStep,
    goToStep,
    getProgress,
    getCriticalTasks,
  } = useWizard();

  const progress = getProgress();
  const criticalTasks = getCriticalTasks();

  if (!currentPhase || !currentStep) {
    return (
      <Card className="p-8 text-center">
        <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No Active Proposal</h3>
        <p className="text-slate-500 mt-2">
          Start by finding an opportunity in the Opportunity Feed
        </p>
        <Button className="mt-4" asChild>
          <a href="/fedsignal/opportunities">
            Browse Opportunities
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </Card>
    );
  }

  const currentStepIndex = currentPhase.steps.findIndex(
    (s) => s.id === currentStep.id
  );
  const totalSteps = currentPhase.steps.length;
  const phaseProgress = Math.round(
    ((currentStepIndex + (currentStep.isComplete ? 1 : 0)) / totalSteps) * 100
  );

  return (
    <Card className="w-full">
      <CardHeader className="border-b bg-slate-50/50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {currentPhase.icon} Phase {phases.findIndex((p) => p.id === currentPhase.id) + 1} of{" "}
                {phases.length}
              </Badge>
              {criticalTasks.length > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {criticalTasks.length} Critical Tasks
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{currentPhase.title}</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              {currentPhase.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {progress.percentage}%
            </div>
            <p className="text-xs text-slate-500">
              Overall Progress ({progress.completed}/{progress.total} steps)
            </p>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Phase Progress</span>
            <span>
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={phaseProgress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-1 mt-4">
          {currentPhase.steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => goToStep(currentPhase.id, step.id)}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                step.isComplete
                  ? "bg-emerald-500"
                  : idx === currentStepIndex
                  ? "bg-blue-500"
                  : "bg-slate-200 hover:bg-slate-300"
              )}
              title={step.title}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Current Step Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              {currentStep.title}
            </h3>
            <div className="flex items-center gap-2">
              {currentStep.estimatedTime && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentStep.estimatedTime}
                </Badge>
              )}
              {currentStep.isComplete ? (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  In Progress
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {currentStep.description}
          </p>

          {/* Help Text */}
          {currentStep.helpText && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <BookOpen className="h-4 w-4 inline mr-2" />
                {currentStep.helpText}
              </p>
            </div>
          )}

          {/* Best Practice */}
          {currentStep.bestPractice && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <Lightbulb className="h-4 w-4 inline mr-2" />
                <strong>Best Practice:</strong> {currentStep.bestPractice}
              </p>
            </div>
          )}
        </div>

        {/* Step Content Area */}
        <div className="min-h-[300px] bg-slate-50 rounded-lg p-6 border border-slate-200">
          {currentStep.component || (
            <div className="text-center text-slate-400">
              <p>Step content would render here</p>
              <p className="text-sm mt-2">
                This step: {currentStep.title}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const prevIdx = currentStepIndex - 1;
              if (prevIdx >= 0) {
                goToStep(currentPhase.id, currentPhase.steps[prevIdx].id);
              }
            }}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Step
          </Button>

          <div className="flex items-center gap-2">
            {currentStep.isOptional && !currentStep.isComplete && (
              <Button
                variant="ghost"
                onClick={() => {
                  const nextIdx = currentStepIndex + 1;
                  if (nextIdx < totalSteps) {
                    goToStep(currentPhase.id, currentPhase.steps[nextIdx].id);
                  }
                }}
              >
                Skip (Optional)
              </Button>
            )}

            <Button
              onClick={() => completeStep(currentPhase.id, currentStep.id)}
              disabled={currentStep.isComplete}
              className={cn(
                currentStep.isComplete
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {currentStep.isComplete ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  Complete & Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
