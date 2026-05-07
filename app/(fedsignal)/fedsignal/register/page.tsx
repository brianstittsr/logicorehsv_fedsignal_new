"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface FormData {
  // Step 1: Basic Information
  institutionName: string;
  institutionType: string;
  state: string;
  website: string;
  
  // Step 2: Leadership Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  
  // Step 3: Capabilities
  primaryDomains: string[];
  researchClassification: string;
  enrollment: string;
  
  // Step 4: Confirmation
  agreedToTerms: boolean;
}

const steps = [
  { id: 1, title: "Basic Information", description: "Tell us about your institution" },
  { id: 2, title: "Leadership Contact", description: "Primary point of contact" },
  { id: 3, title: "Capabilities", description: "Research domains and classification" },
  { id: 4, title: "Review & Submit", description: "Confirm your registration" },
];

const institutionTypes = [
  "Public HBCU",
  "Private HBCU",
  "Public MSI",
  "Private MSI",
  "Tribal College",
  "Other",
];

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
  "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
];

const researchDomains = [
  "Cybersecurity",
  "Artificial Intelligence",
  "Defense R&D",
  "Energy & Environment",
  "Health Sciences",
  "Aerospace",
  "Materials Science",
  "Biotechnology",
  "Data Science",
  "Quantum Computing",
];

const researchClassifications = [
  "R1: Very High Research Activity",
  "R2: High Research Activity",
  "R3: Moderate Research Activity",
  "D/PU: Doctoral/Professional",
  "M1: Master's Colleges",
  "M2: Master's Universities",
  "Baccalaureate",
  "Associate",
];

export default function UniversityRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    institutionName: "",
    institutionType: "",
    state: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactTitle: "",
    primaryDomains: [],
    researchClassification: "",
    enrollment: "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDomainToggle = (domain: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryDomains: prev.primaryDomains.includes(domain)
        ? prev.primaryDomains.filter((d) => d !== domain)
        : [...prev.primaryDomains, domain],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.institutionName && formData.institutionType && formData.state;
      case 2:
        return formData.contactName && formData.contactEmail && formData.contactTitle;
      case 3:
        return formData.primaryDomains.length > 0 && formData.researchClassification;
      case 4:
        return formData.agreedToTerms;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Registration Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for registering your institution. We will review your application and contact you within 2-3 business days.
            </p>
            <Button asChild>
              <Link href="/fedsignal">Return to FedSignal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/fedsignal">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to FedSignal
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">University Registration</h1>
          <p className="text-muted-foreground">Register your institution to join the FedSignal platform</p>
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
                  <div className="text-xs mt-2 text-center font-medium">
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
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="e.g., Tuskegee University"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionType">Institution Type *</Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) => setFormData({ ...formData, institutionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.yourinstitution.edu"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g., Dr. Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactTitle">Title *</Label>
                  <Input
                    id="contactTitle"
                    value={formData.contactTitle}
                    onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                    placeholder="e.g., Vice President of Research"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="e.g., research@institution.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Research Domains *</Label>
                  <p className="text-xs text-muted-foreground">Select at least one domain</p>
                  <div className="grid grid-cols-2 gap-2">
                    {researchDomains.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleDomainToggle(domain)}
                        className={`p-3 text-sm border rounded-md text-left transition-colors ${
                          formData.primaryDomains.includes(domain)
                            ? "border-[#1a56db] bg-[#1a56db]/10 text-[#1a56db]"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {formData.primaryDomains.includes(domain) && (
                          <CheckCircle2 className="h-4 w-4 inline mr-2" />
                        )}
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="researchClassification">Research Classification *</Label>
                  <Select
                    value={formData.researchClassification}
                    onValueChange={(value) => setFormData({ ...formData, researchClassification: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchClassifications.map((classification) => (
                        <SelectItem key={classification} value={classification}>
                          {classification}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollment">Total Enrollment</Label>
                  <Input
                    id="enrollment"
                    type="number"
                    value={formData.enrollment}
                    onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Institution Name</Label>
                    <p className="font-medium">{formData.institutionName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Type</Label>
                      <p className="font-medium">{formData.institutionType}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">State</Label>
                      <p className="font-medium">{formData.state}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Website</Label>
                    <p className="font-medium">{formData.website || "Not provided"}</p>
                  </div>
                  <div className="border-t pt-3">
                    <Label className="text-muted-foreground">Contact Name</Label>
                    <p className="font-medium">{formData.contactName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Title</Label>
                      <p className="font-medium">{formData.contactTitle}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{formData.contactEmail}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <Label className="text-muted-foreground">Research Domains</Label>
                    <p className="font-medium">{formData.primaryDomains.join(", ")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Research Classification</Label>
                    <p className="font-medium">{formData.researchClassification}</p>
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
                    I agree to the terms and conditions and confirm that the information provided is accurate.
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
