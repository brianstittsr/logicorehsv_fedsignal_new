"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Info, HelpCircle } from "lucide-react";

export interface WalkthroughStep {
  title: string;
  description: string;
  target?: string; // CSS selector for the target element
  image?: string;
  position?: "top" | "bottom" | "left" | "right" | "center"; // Position of the walkthrough dialog
}

interface WalkthroughProps {
  steps: WalkthroughStep[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function Walkthrough({ steps, isOpen, onClose, title = "Guide" }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  useEffect(() => {
    if (!isOpen || !step.target) {
      setHighlightedElement(null);
      return;
    }

    // Find the target element
    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      
      // Calculate dialog position based on target element
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      // Default position: bottom of the element
      let top = rect.bottom + scrollY + 10;
      let left = rect.left + scrollX;
      
      // Adjust based on position preference
      if (step.position === "top") {
        top = rect.top + scrollY - 10;
        left = rect.left + scrollX;
      } else if (step.position === "left") {
        top = rect.top + scrollY;
        left = rect.left + scrollX - 10;
      } else if (step.position === "right") {
        top = rect.top + scrollY;
        left = rect.right + scrollX + 10;
      } else if (step.position === "center") {
        top = window.innerHeight / 2 + scrollY;
        left = window.innerWidth / 2 + scrollX;
      }
      
      // Ensure dialog stays within viewport
      const dialogWidth = 400;
      const dialogHeight = 300;
      
      if (left + dialogWidth > window.innerWidth + scrollX) {
        left = window.innerWidth + scrollX - dialogWidth - 20;
      }
      if (left < scrollX + 20) {
        left = scrollX + 20;
      }
      if (top + dialogHeight > window.innerHeight + scrollY) {
        top = window.innerHeight + scrollY - dialogHeight - 20;
      }
      if (top < scrollY + 20) {
        top = scrollY + 20;
      }
      
      setDialogPosition({ top, left });
      
      // Scroll element into view if needed
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setHighlightedElement(null);
    }
  }, [isOpen, currentStep, step.target, step.position]);

  if (!isOpen) return null;

  const isCentered = !step.target || step.position === "center";

  return (
    <>
      {/* Darker background overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      
      {/* Highlight ring around target element */}
      {highlightedElement && !isCentered && (
        <div
          className="fixed border-4 border-[#1a56db] rounded-lg pointer-events-none z-50 transition-all duration-300"
          style={{
            top: highlightedElement.offsetTop,
            left: highlightedElement.offsetLeft,
            width: highlightedElement.offsetWidth,
            height: highlightedElement.offsetHeight,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
          }}
        />
      )}
      
      {/* Walkthrough dialog */}
      <div
        ref={dialogRef}
        className="fixed z-50"
        style={isCentered ? {} : { top: dialogPosition.top, left: dialogPosition.left }}
      >
        <Card className={isCentered ? "max-w-lg w-full max-h-[80vh] overflow-y-auto" : "max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
            </div>
            
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
            
            {step.image && (
              <div className="mt-4 rounded-lg overflow-hidden border">
                <img src={step.image} alt={step.title} className="w-full h-auto" />
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    onClose();
                  }
                }}
              >
                {currentStep === steps.length - 1 ? (
                  "Finish"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

interface WalkthroughButtonProps {
  onClick: () => void;
  label?: string;
}

export function WalkthroughButton({ onClick, label = "Show Guide" }: WalkthroughButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className="gap-2">
      <HelpCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}
