"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: ReactNode;
  isOptional?: boolean;
  isComplete: boolean;
  estimatedTime?: string;
  helpText?: string;
  bestPractice?: string;
  requiredFor?: string[];
}

export interface WizardPhase {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: WizardStep[];
  isActive: boolean;
  isComplete: boolean;
  deadline?: Date;
  nextPhaseId?: string;
}

export interface WizardTask {
  id: string;
  title: string;
  description: string;
  phaseId: string;
  stepId?: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "blocked";
  dueDate?: Date;
  estimatedMinutes: number;
  assignedTo?: string;
  completionCriteria: string[];
  resources?: { title: string; url: string }[];
  aiHint?: string;
}

export interface WizardContextType {
  phases: WizardPhase[];
  currentPhase: WizardPhase | null;
  currentStep: WizardStep | null;
  tasks: WizardTask[];
  setPhases: (phases: WizardPhase[]) => void;
  activatePhase: (phaseId: string) => void;
  completeStep: (phaseId: string, stepId: string) => void;
  goToStep: (phaseId: string, stepId: string) => void;
  getNextIncompleteTask: () => WizardTask | null;
  getTasksByPhase: (phaseId: string) => WizardTask[];
  getCriticalTasks: () => WizardTask[];
  getProgress: () => { completed: number; total: number; percentage: number };
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [phases, setPhasesState] = useState<WizardPhase[]>([]);
  const [currentPhaseId, setCurrentPhaseId] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<WizardTask[]>([]);

  const setPhases = useCallback((newPhases: WizardPhase[]) => {
    setPhasesState(newPhases);
    // Auto-activate first incomplete phase
    const firstIncomplete = newPhases.find((p) => !p.isComplete);
    if (firstIncomplete && !currentPhaseId) {
      setCurrentPhaseId(firstIncomplete.id);
      const firstIncompleteStep = firstIncomplete.steps.find((s) => !s.isComplete);
      if (firstIncompleteStep) {
        setCurrentStepId(firstIncompleteStep.id);
      }
    }
  }, [currentPhaseId]);

  const activatePhase = useCallback((phaseId: string) => {
    setPhasesState((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === phaseId,
      }))
    );
    setCurrentPhaseId(phaseId);
    const phase = phases.find((p) => p.id === phaseId);
    if (phase) {
      const firstIncompleteStep = phase.steps.find((s) => !s.isComplete);
      if (firstIncompleteStep) {
        setCurrentStepId(firstIncompleteStep.id);
      }
    }
  }, [phases]);

  const completeStep = useCallback((phaseId: string, stepId: string) => {
    setPhasesState((prev) =>
      prev.map((p) => {
        if (p.id !== phaseId) return p;
        const updatedSteps = p.steps.map((s) =>
          s.id === stepId ? { ...s, isComplete: true } : s
        );
        const allStepsComplete = updatedSteps.every((s) => s.isComplete);
        return {
          ...p,
          steps: updatedSteps,
          isComplete: allStepsComplete,
          isActive: !allStepsComplete,
        };
      })
    );

    // Auto-advance to next step
    const phase = phases.find((p) => p.id === phaseId);
    if (phase) {
      const currentStepIndex = phase.steps.findIndex((s) => s.id === stepId);
      const nextStep = phase.steps[currentStepIndex + 1];
      if (nextStep && !nextStep.isComplete) {
        setCurrentStepId(nextStep.id);
      } else if (!nextStep) {
        // Phase complete, activate next phase
        const currentPhaseIndex = phases.findIndex((p) => p.id === phaseId);
        const nextPhase = phases[currentPhaseIndex + 1];
        if (nextPhase) {
          activatePhase(nextPhase.id);
        }
      }
    }
  }, [phases, activatePhase]);

  const goToStep = useCallback((phaseId: string, stepId: string) => {
    setCurrentPhaseId(phaseId);
    setCurrentStepId(stepId);
  }, []);

  const getNextIncompleteTask = useCallback(() => {
    return tasks.find((t) => t.status !== "completed") || null;
  }, [tasks]);

  const getTasksByPhase = useCallback((phaseId: string) => {
    return tasks.filter((t) => t.phaseId === phaseId);
  }, [tasks]);

  const getCriticalTasks = useCallback(() => {
    return tasks.filter((t) => t.priority === "critical" && t.status !== "completed");
  }, [tasks]);

  const getProgress = useCallback(() => {
    const totalSteps = phases.reduce((acc, p) => acc + p.steps.length, 0);
    const completedSteps = phases.reduce(
      (acc, p) => acc + p.steps.filter((s) => s.isComplete).length,
      0
    );
    return {
      completed: completedSteps,
      total: totalSteps,
      percentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    };
  }, [phases]);

  const currentPhase = phases.find((p) => p.id === currentPhaseId) || null;
  const currentStep = currentPhase?.steps.find((s) => s.id === currentStepId) || null;

  return (
    <WizardContext.Provider
      value={{
        phases,
        currentPhase,
        currentStep,
        tasks,
        setPhases,
        activatePhase,
        completeStep,
        goToStep,
        getNextIncompleteTask,
        getTasksByPhase,
        getCriticalTasks,
        getProgress,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
