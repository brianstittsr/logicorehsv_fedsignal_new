"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  X, 
  ExternalLink, 
  Building, 
  Calendar, 
  MapPin, 
  Tag, 
  FileText, 
  User, 
  Mail, 
  Phone,
  Download,
  CheckCircle,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface SamOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber?: string;
  active?: string;
  type?: string;
  organizationHierarchy?: string;
  postedDate?: string;
  responseDeadLine?: string;
  naicsCode?: string;
  classificationCode?: string;
  typeOfSetAside?: string;
  description?: string;
  pointOfContact?: Array<{ name: string; email?: string; phone?: string; title?: string }>;
  resourceLinks?: Array<{ url: string; description?: string; name?: string; downloadUrl?: string }>;
  uiLink?: string;
  award?: {
    date?: string;
    amount?: number;
    awardee?: string;
  };
  placeOfPerformance?: {
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  additionalInfo?: string;
  archiveDate?: string;
  lastModifiedDate?: string;
  department?: string;
  office?: string;
}

interface SamOpportunityDetailProps {
  opportunity: SamOpportunity | null;
  open: boolean;
  onClose: () => void;
}

export function SamOpportunityDetail({ opportunity, open, onClose }: SamOpportunityDetailProps) {
  const [loadingResource, setLoadingResource] = useState<string | null>(null);

  const handleDownloadResource = async (resource: any) => {
    if (!resource.downloadUrl && !resource.url) return;

    setLoadingResource(resource.name || resource.description || "downloading");

    try {
      const url = resource.downloadUrl || resource.url;
      const response = await fetch(url);
      
      if (!response.ok) {
        toast.error("Failed to download resource");
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = resource.name || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      toast.success("Resource downloaded successfully");
    } catch (error) {
      toast.error("Failed to download resource");
      console.error(error);
    } finally {
      setLoadingResource(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{opportunity.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{opportunity.type || "Unknown"}</Badge>
                {opportunity.active === "true" ? (
                  <Badge className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Solicitation Number</label>
                  <p className="text-sm">{opportunity.solicitationNumber || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notice ID</label>
                  <p className="text-sm font-mono">{opportunity.noticeId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Agency</label>
                  <p className="text-sm">{opportunity.organizationHierarchy?.replace(/\./g, " > ") || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p className="text-sm">{opportunity.department || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Office</label>
                  <p className="text-sm">{opportunity.office || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Set-Aside</label>
                  <p className="text-sm">
                    {opportunity.typeOfSetAside ? (
                      <Badge variant="secondary">{opportunity.typeOfSetAside}</Badge>
                    ) : (
                      "None"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Posted Date</label>
                  <p className="text-sm">{formatDate(opportunity.postedDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Response Deadline</label>
                  <p className="text-sm">{formatDate(opportunity.responseDeadLine)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                  <p className="text-sm">{formatDate(opportunity.lastModifiedDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Archive Date</label>
                  <p className="text-sm">{formatDate(opportunity.archiveDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Classification Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NAICS Code</label>
                  <p className="text-sm font-mono">{opportunity.naicsCode || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">PSC Code</label>
                  <p className="text-sm font-mono">{opportunity.classificationCode || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place of Performance */}
          {opportunity.placeOfPerformance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Place of Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-sm">{opportunity.placeOfPerformance.city || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-sm">{opportunity.placeOfPerformance.state || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                    <p className="text-sm">{opportunity.placeOfPerformance.zip || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-sm">{opportunity.placeOfPerformance.country || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{opportunity.description || "No description available"}</p>
              {opportunity.additionalInfo && (
                <div className="mt-4 pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
                  <p className="text-sm whitespace-pre-wrap mt-1">{opportunity.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Points of Contact */}
          {opportunity.pointOfContact && opportunity.pointOfContact.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Points of Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunity.pointOfContact.map((poc, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="font-medium">{poc.name || "Unknown"}</div>
                      {poc.title && <div className="text-sm text-muted-foreground">{poc.title}</div>}
                      <div className="mt-2 space-y-1">
                        {poc.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${poc.email}`} className="text-blue-600 hover:underline">
                              {poc.email}
                            </a>
                          </div>
                        )}
                        {poc.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${poc.phone}`} className="text-blue-600 hover:underline">
                              {poc.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Award Information */}
          {opportunity.award && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Award Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Award Date</label>
                    <p className="text-sm">{formatDate(opportunity.award.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Award Amount</label>
                    <p className="text-sm font-semibold">{formatCurrency(opportunity.award.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Awardee</label>
                    <p className="text-sm">{opportunity.award.awardee || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resources/Attachments */}
          {opportunity.resourceLinks && opportunity.resourceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Resources & Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {opportunity.resourceLinks.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{resource.name || `Resource ${index + 1}`}</div>
                        {resource.description && (
                          <div className="text-xs text-muted-foreground">{resource.description}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {resource.downloadUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadResource(resource)}
                            disabled={loadingResource === (resource.name || resource.description)}
                          >
                            {loadingResource === (resource.name || resource.description) ? (
                              <span className="animate-pulse">Downloading...</span>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        )}
                        {resource.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SAM.gov Link */}
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" asChild>
                <a href={opportunity.uiLink || "#"} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on SAM.gov
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
