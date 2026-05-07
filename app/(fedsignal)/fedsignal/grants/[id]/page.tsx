"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Save, 
  FileText, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Paperclip,
  Upload,
  X,
  Sparkles,
  Plus
} from "lucide-react";
import { mockGrantDetails, GrantDetail } from "@/lib/fedsignal/mock-grant-data";
import { Walkthrough, WalkthroughButton } from "@/components/ui/walkthrough";

export default function GrantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;

  const [grant, setGrant] = useState<GrantDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [attachmentMilestoneMap, setAttachmentMilestoneMap] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [newReportFile, setNewReportFile] = useState<File | null>(null);
  const [reportMetadata, setReportMetadata] = useState({
    reportType: "progress" as "progress" | "final" | "interim",
    periodStart: "",
    periodEnd: "",
    executiveSummary: "",
  });
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAddMilestoneDialog, setShowAddMilestoneDialog] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    dueDate: "",
    description: "",
  });
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);

  const handleEnhanceWithAI = (field: "projectSummary" | "intellectualMerit" | "broaderImpacts" | "budgetJustification") => {
    setIsEnhancing(true);
    // Simulate AI enhancement by converting bullets to paragraphs
    setTimeout(() => {
      setEditForm(prev => ({
        ...prev,
        [field]: convertBulletsToParagraphs(prev[field])
      }));
      setIsEnhancing(false);
    }, 1000);
  };

  const convertBulletsToParagraphs = (text: string): string => {
    // Convert bullet points to paragraph format
    const lines = text.split('\n').filter(line => line.trim());
    const paragraphs: string[] = [];
    let currentParagraph = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      // Check if it's a bullet point
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        // Remove bullet marker
        const content = trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
        
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = '';
        }
        currentParagraph = content;
      } else {
        if (currentParagraph) {
          currentParagraph += ' ' + trimmed;
        } else {
          currentParagraph = trimmed;
        }
      }
    });

    if (currentParagraph) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs.join('\n\n');
  };

  const grantDetailWalkthroughSteps = [
    {
      title: "Grant Overview",
      description: "The grant overview shows key information: grant number, title, agency, funding opportunity ID, university, and current status. The status badge indicates the grant's current stage.",
      target: '#grant-overview-card',
      position: "bottom" as const,
    },
    {
      title: "Principal Investigator",
      description: "View the principal investigator details including name, email, title, and contact information. Co-investigators are also listed here if applicable.",
      target: '#pi-card',
      position: "bottom" as const,
    },
    {
      title: "Project Timeline",
      description: "The project timeline shows the start date, end date, and total duration of the grant. Key milestones and reporting deadlines are tracked in the milestones section.",
      target: '#timeline-card',
      position: "bottom" as const,
    },
    {
      title: "Budget Overview",
      description: "View the total award amount, direct costs, indirect costs, and budget breakdown. The budget section tracks spending and remaining funds.",
      target: '#budget-card',
      position: "bottom" as const,
    },
    {
      title: "Edit Grant Information",
      description: "Click the 'Edit' button to modify grant details including title, status, budget amounts, and project summary. Changes are saved to the database.",
      target: '#edit-grant-button',
      position: "bottom" as const,
    },
    {
      title: "Milestones",
      description: "Track project milestones with due dates, status, and completion percentage. Milestones help monitor progress toward grant objectives.",
      target: '#milestones-card',
      position: "right" as const,
    },
    {
      title: "Attachments",
      description: "Upload and manage grant-related documents including proposals, deliverables, reports, and supporting files. Use drag-and-drop to upload multiple files.",
      target: '#attachments-card',
      position: "right" as const,
    },
    {
      title: "Progress Reports",
      description: "Submit and track progress reports with executive summaries, achievements, and challenges. Reports are linked to specific reporting periods.",
      target: '#reports-card',
      position: "right" as const,
    },
    {
      title: "Delete Grant",
      description: "Use the delete button to permanently remove a grant from the system. This action cannot be undone and requires confirmation.",
      target: '#delete-grant-button',
      position: "bottom" as const,
    },
  ];

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    status: "" as GrantDetail["status"],
    totalAwardAmount: 0,
    directCosts: 0,
    indirectCosts: 0,
    projectSummary: "",
    intellectualMerit: "",
    broaderImpacts: "",
    budgetJustification: "",
  });

  useEffect(() => {
    // Load mock data directly
    const mockGrant = mockGrantDetails.find((g) => g.id === grantId);
    if (mockGrant) {
      setGrant(mockGrant);
      setEditForm({
        title: mockGrant.title,
        status: mockGrant.status,
        totalAwardAmount: mockGrant.totalAwardAmount,
        directCosts: mockGrant.directCosts,
        indirectCosts: mockGrant.indirectCosts,
        projectSummary: mockGrant.projectSummary || "• Research focuses on advanced materials science\n• Develops novel composites for aerospace applications\n• Collaborates with industry partners for technology transfer\n• Publishes findings in peer-reviewed journals\n• Trains graduate students in materials engineering",
        intellectualMerit: mockGrant.intellectualMerit || "• Pioneering approach to material synthesis\n• Addresses fundamental challenges in composite materials\n• Innovative methodology with potential for broad impact\n• Contributes to theoretical understanding of material properties\n• Establishes new paradigms in materials design",
        broaderImpacts: mockGrant.broaderImpacts || "• Enhances STEM education through hands-on research\n• Promotes diversity in scientific research fields\n• Provides training opportunities for underrepresented students\n• Engages local communities through science outreach\n• Supports workforce development in advanced manufacturing",
        budgetJustification: "• Personnel costs for research staff and graduate students\n• Equipment purchases for laboratory instrumentation\n• Travel costs for conferences and collaboration meetings\n• Materials and supplies for experimental research\n• Overhead costs for institutional support",
      });
    } else {
      setError("Grant not found");
    }
  }, [grantId]);

  const handleSave = async () => {
    if (!grant) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedGrant = {
        ...grant,
        ...editForm,
        totalAwardAmount: Number(editForm.totalAwardAmount),
        directCosts: Number(editForm.directCosts),
        indirectCosts: Number(editForm.indirectCosts),
        status: editForm.status as GrantDetail["status"],
      };

      // Update local state only (mock data)
      setGrant(updatedGrant);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving grant:", err);
      setError("Failed to save grant. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!grant) return;

    setIsDeleting(true);
    setError(null);

    try {
      // Just redirect (mock data - no actual deletion)
      router.push("/fedsignal/grants");
    } catch (err) {
      console.error("Error deleting grant:", err);
      setError("Failed to delete grant. Please try again.");
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewAttachments(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      setNewAttachments(Array.from(files));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentMilestoneMap(prev => {
      const newMap = { ...prev };
      delete newMap[index.toString()];
      return newMap;
    });
  };

  const handleMilestoneAssociation = (attachmentIndex: number, milestoneId: string) => {
    setAttachmentMilestoneMap(prev => ({
      ...prev,
      [attachmentIndex.toString()]: milestoneId,
    }));
  };

  const handleUploadAttachments = async () => {
    if (!grant || newAttachments.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create new attachment objects
      const newAttachmentObjects = newAttachments.map((file, index) => ({
        id: `ATT-${Date.now()}-${index}`,
        name: file.name,
        type: "other" as const,
        uploadDate: new Date().toISOString().split("T")[0],
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        url: `/files/grants/${grantId}/${file.name}`,
        uploadedBy: "current-user",
        milestoneId: attachmentMilestoneMap[index.toString()] || undefined,
      }));

      // Update grant with new attachments
      const updatedGrant = {
        ...grant,
        attachments: [...(grant.attachments || []), ...newAttachmentObjects],
      };

      // Update local state only (mock data)
      setGrant(updatedGrant);
      setNewAttachments([]);
      setAttachmentMilestoneMap({});
    } catch (err) {
      console.error("Error uploading attachments:", err);
      setError("Failed to upload attachments. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReportFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewReportFile(file);
    }
  };

  const handleSubmitReport = async () => {
    if (!grant || !newReportFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const newReport = {
        id: `RPT-${Date.now()}`,
        grantId: grantId,
        reportType: reportMetadata.reportType,
        reportPeriod: {
          startDate: reportMetadata.periodStart,
          endDate: reportMetadata.periodEnd,
        },
        status: "draft" as const,
        dueDate: new Date().toISOString().split("T")[0],
        executiveSummary: reportMetadata.executiveSummary,
        achievements: [],
        challenges: [],
        submittedAt: new Date().toISOString(),
        submittedBy: "current-user",
      };

      // Update local state only (mock data)
      setGrant({
        ...grant,
        reports: [...(grant.reports || []), newReport],
      });

      // Reset form
      setNewReportFile(null);
      setReportMetadata({
        reportType: "progress",
        periodStart: "",
        periodEnd: "",
        executiveSummary: "",
      });
      setReportDialogOpen(false);
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMilestone = () => {
    if (!grant || !newMilestone.title) return;

    const milestone = {
      id: `MILE-${Date.now()}`,
      title: newMilestone.title,
      dueDate: newMilestone.dueDate,
      description: newMilestone.description,
      status: "not_started" as const,
      completionPercentage: 0,
      deliverables: [] as string[],
      responsiblePerson: "TBD",
    };

    setGrant({
      ...grant,
      milestones: [...(grant.milestones || []), milestone],
    });

    setNewMilestone({ title: "", dueDate: "", description: "" });
    setShowAddMilestoneDialog(false);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (!grant) return;
    setGrant({
      ...grant,
      milestones: grant.milestones?.filter(m => m.id !== milestoneId) || [],
    });
  };

  const handleDeleteReport = (reportId: string) => {
    if (!grant) return;
    setGrant({
      ...grant,
      reports: grant.reports?.filter(r => r.id !== reportId) || [],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "under_review": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pre_award": return "bg-blue-100 text-blue-700 border-blue-200";
      case "awarded": return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed": return "bg-gray-100 text-gray-700 border-gray-200";
      case "on_hold": return "bg-orange-100 text-orange-700 border-orange-200";
      case "terminated": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-5 w-5" />;
      case "under_review": return <Clock className="h-5 w-5" />;
      case "pre_award": return <FileText className="h-5 w-5" />;
      case "awarded": return <CheckCircle2 className="h-5 w-5" />;
      case "completed": return <CheckCircle2 className="h-5 w-5" />;
      case "on_hold": return <AlertCircle className="h-5 w-5" />;
      case "terminated": return <AlertCircle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (error && !grant) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/fedsignal/grants">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Grants
            </Link>
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Grant Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a56db]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/fedsignal/grants">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Grants
            </Link>
          </Button>
          <div className="flex gap-2">
            <WalkthroughButton onClick={() => setWalkthroughOpen(true)} />
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)} id="edit-grant-button">
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700" id="delete-grant-button">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Grant</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this grant? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Grant Details Card */}
        <Card id="grant-overview-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(grant.status)}
                  <Badge className={getStatusColor(grant.status)} variant="outline">
                    {grant.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{grant.agency}</Badge>
                </div>
                {isEditing ? (
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="text-2xl font-bold"
                  />
                ) : (
                  <CardTitle className="text-2xl">{grant.title}</CardTitle>
                )}
                <CardDescription className="mt-2">
                  {grant.grantNumber} • {grant.universityName}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="pi-card">
              <div className="space-y-2">
                <Label>Principal Investigator</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{grant.principalInvestigator.name}</span>
                </div>
              </div>
              <div className="space-y-2" id="timeline-card">
                <Label>Project Period</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{grant.startDate} - {grant.endDate}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Agency Program</Label>
                <span>{grant.agencyProgram || "N/A"}</span>
              </div>
              <div className="space-y-2">
                <Label>Opportunity ID</Label>
                <span>{grant.opportunityId || "N/A"}</span>
              </div>
            </div>

            {/* Budget Information */}
            <div className="border-t pt-6" id="budget-card">
              <h3 className="font-semibold mb-4">Budget Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="totalAward">Total Award Amount</Label>
                      <Input
                        id="totalAward"
                        type="number"
                        value={editForm.totalAwardAmount}
                        onChange={(e) => setEditForm({ ...editForm, totalAwardAmount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="directCosts">Direct Costs</Label>
                      <Input
                        id="directCosts"
                        type="number"
                        value={editForm.directCosts}
                        onChange={(e) => setEditForm({ ...editForm, directCosts: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="indirectCosts">Indirect Costs</Label>
                      <Input
                        id="indirectCosts"
                        type="number"
                        value={editForm.indirectCosts}
                        onChange={(e) => setEditForm({ ...editForm, indirectCosts: Number(e.target.value) })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total Award
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${grant.totalAwardAmount.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Direct Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${grant.directCosts.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Indirect Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${grant.indirectCosts.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Budget Justification */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Budget Justification</h3>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceWithAI("budgetJustification")}
                    disabled={isEnhancing}
                    className="text-[#4d94ff] border-[#4d94ff] hover:bg-[#4d94ff]/10"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editForm.budgetJustification}
                  onChange={(e) => setEditForm({ ...editForm, budgetJustification: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{editForm.budgetJustification || "No budget justification provided"}</p>
              )}
            </div>

            {/* Status */}
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editForm.status} onValueChange={(value: GrantDetail["status"]) => setEditForm({ ...editForm, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="pre_award">Pre-Award</SelectItem>
                    <SelectItem value="awarded">Awarded</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Project Summary */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Project Summary</h3>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceWithAI("projectSummary")}
                    disabled={isEnhancing}
                    className="text-[#4d94ff] border-[#4d94ff] hover:bg-[#4d94ff]/10"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editForm.projectSummary}
                  onChange={(e) => setEditForm({ ...editForm, projectSummary: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{grant.projectSummary || "No summary provided"}</p>
              )}
            </div>

            {/* Intellectual Merit */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Intellectual Merit</h3>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceWithAI("intellectualMerit")}
                    disabled={isEnhancing}
                    className="text-[#4d94ff] border-[#4d94ff] hover:bg-[#4d94ff]/10"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editForm.intellectualMerit}
                  onChange={(e) => setEditForm({ ...editForm, intellectualMerit: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{grant.intellectualMerit || "No information provided"}</p>
              )}
            </div>

            {/* Broader Impacts */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Broader Impacts</h3>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceWithAI("broaderImpacts")}
                    disabled={isEnhancing}
                    className="text-[#4d94ff] border-[#4d94ff] hover:bg-[#4d94ff]/10"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editForm.broaderImpacts}
                  onChange={(e) => setEditForm({ ...editForm, broaderImpacts: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{grant.broaderImpacts || "No information provided"}</p>
              )}
            </div>

            {/* Save Button (when editing) */}
            {isEditing && (
              <div className="flex justify-end gap-2 pt-6">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#1a56db]">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}

            {/* Co-Investigators */}
            {grant.coInvestigators && grant.coInvestigators.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Co-Investigators</h3>
                <div className="space-y-2">
                  {grant.coInvestigators.map((coPI, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{coPI.name}</div>
                        <div className="text-sm text-muted-foreground">{coPI.email} • {coPI.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="border-t pt-6" id="attachments-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Attachments</h3>
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Drag and Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-[#1a56db] bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click "Upload Files" to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports multiple file upload
                </p>
              </div>

              {/* New attachments to upload */}
              {newAttachments.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 mt-4 space-y-3">
                  <h4 className="font-medium text-sm">New Attachments ({newAttachments.length})</h4>
                  {newAttachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded border">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                      {grant.milestones && grant.milestones.length > 0 && (
                        <Select
                          value={attachmentMilestoneMap[index.toString()] || ""}
                          onValueChange={(value) => handleMilestoneAssociation(index, value)}
                        >
                          <SelectTrigger className="w-48 h-8 text-xs">
                            <SelectValue placeholder="Link to milestone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No milestone</SelectItem>
                            {grant.milestones.map((milestone) => (
                              <SelectItem key={milestone.id} value={milestone.id}>
                                {milestone.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={handleUploadAttachments}
                    disabled={isUploading}
                    className="w-full bg-[#1a56db]"
                  >
                    {isUploading ? "Uploading..." : "Upload Attachments"}
                  </Button>
                </div>
              )}

              {/* Existing attachments */}
              {grant.attachments && grant.attachments.length > 0 && (
                <div className="space-y-2">
                  {grant.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{attachment.name}</div>
                        <div className="text-sm text-muted-foreground">{attachment.type} • {attachment.fileSize}</div>
                        {(attachment as any).milestoneId && grant.milestones && (
                          <div className="text-xs text-blue-600">
                            Linked to: {grant.milestones.find(m => m.id === (attachment as any).milestoneId)?.title || "Unknown milestone"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!grant.attachments || grant.attachments.length === 0) && newAttachments.length === 0 && (
                <p className="text-sm text-muted-foreground">No attachments yet. Click "Upload Files" to add attachments.</p>
              )}
            </div>

            {/* Milestones */}
            {grant.milestones && grant.milestones.length > 0 && (
              <div className="border-t pt-6" id="milestones-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Milestones</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowAddMilestoneDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                <div className="space-y-2">
                  {grant.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-muted-foreground">{milestone.dueDate}</div>
                      </div>
                      <Badge variant={milestone.status === "completed" ? "default" : "secondary"}>
                        {milestone.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMilestone(milestone.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports */}
            <div className="border-t pt-6" id="reports-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Reports</h3>
                <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Progress Report</DialogTitle>
                      <DialogDescription>
                        Upload a progress report and provide metadata about the report period and contents.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select value={reportMetadata.reportType} onValueChange={(value: any) => setReportMetadata({ ...reportMetadata, reportType: value })}>
                          <SelectTrigger id="reportType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="progress">Progress Report</SelectItem>
                            <SelectItem value="interim">Interim Report</SelectItem>
                            <SelectItem value="annual">Annual Report</SelectItem>
                            <SelectItem value="final">Final Report</SelectItem>
                            <SelectItem value="financial">Financial Report</SelectItem>
                            <SelectItem value="technical">Technical Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="periodStart">Period Start Date</Label>
                          <Input
                            id="periodStart"
                            type="date"
                            value={reportMetadata.periodStart}
                            onChange={(e) => setReportMetadata({ ...reportMetadata, periodStart: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="periodEnd">Period End Date</Label>
                          <Input
                            id="periodEnd"
                            type="date"
                            value={reportMetadata.periodEnd}
                            onChange={(e) => setReportMetadata({ ...reportMetadata, periodEnd: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reportFile">Report File</Label>
                        <Input
                          id="reportFile"
                          type="file"
                          onChange={handleReportFileUpload}
                          accept=".pdf,.doc,.docx"
                        />
                        {newReportFile && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {newReportFile.name} ({(newReportFile.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="executiveSummary">Executive Summary</Label>
                        <Textarea
                          id="executiveSummary"
                          value={reportMetadata.executiveSummary}
                          onChange={(e) => setReportMetadata({ ...reportMetadata, executiveSummary: e.target.value })}
                          placeholder="Provide a brief summary of the report contents..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitReport} disabled={!newReportFile || isUploading} className="bg-[#1a56db]">
                        {isUploading ? "Uploading..." : "Submit Report"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {grant.reports && grant.reports.length > 0 && (
                <div className="space-y-2">
                  {grant.reports.map((report, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{report.reportType}</div>
                        <div className="text-sm text-muted-foreground">Due: {report.dueDate} • Status: {report.status}</div>
                        {report.reportPeriod && (
                          <div className="text-xs text-muted-foreground">
                            Period: {report.reportPeriod.startDate} - {report.reportPeriod.endDate}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {(!grant.reports || grant.reports.length === 0) && (
                <p className="text-sm text-muted-foreground">No reports yet. Click "Upload Report" to add a progress report.</p>
              )}
            </div>

            {/* Next Report Due */}
            {grant.nextReportDueDate && (
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Next Report Due</div>
                    <div className="text-sm">{grant.nextReportDueDate}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            {grant.internalNotes && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Internal Notes</h3>
                <p className="text-sm text-muted-foreground">{grant.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Milestone Dialog */}
      <Dialog open={showAddMilestoneDialog} onOpenChange={setShowAddMilestoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription>
              Create a new milestone for this grant project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="milestoneTitle">Milestone Title</Label>
              <Input
                id="milestoneTitle"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                placeholder="Enter milestone title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestoneDueDate">Due Date</Label>
              <Input
                id="milestoneDueDate"
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestoneDescription">Description</Label>
              <Textarea
                id="milestoneDescription"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Describe the milestone objectives and deliverables"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMilestoneDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMilestone} disabled={!newMilestone.title}>
              Add Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Walkthrough 
        steps={grantDetailWalkthroughSteps}
        isOpen={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        title="Grant Detail Guide"
      />
    </div>
  );
}
