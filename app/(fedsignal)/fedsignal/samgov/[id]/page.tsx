"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Building2, FileText, MapPin, User, Download, AlertCircle } from "lucide-react";
import Link from "next/link";

interface OpportunityDetail {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  active: boolean;
  type: string;
  baseType?: string;
  organizationHierarchy: string;
  postedDate: string;
  responseDeadLine?: string;
  naicsCode?: string;
  classificationCode?: string;
  typeOfSetAside?: string;
  typeOfSetAsideDescription?: string;
  description?: string;
  pointOfContact?: any[];
  resourceLinks?: any[];
  uiLink: string;
  placeOfPerformance?: any;
  award?: any;
}

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchOpportunityDetails(params.id as string);
    }
  }, [params.id]);

  const fetchOpportunityDetails = async (noticeId: string) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/samgov/opportunity/${noticeId}`);
      const data = await response.json();
      
      if (data.success) {
        setOpportunity(data.data);
      } else {
        setError(data.error || "Failed to load opportunity details");
      }
    } catch (err) {
      setError("An error occurred while loading the opportunity");
      console.error("Error fetching opportunity:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const days = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading opportunity details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Opportunity</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysUntil = getDaysUntilDeadline(opportunity.responseDeadLine);
  const isUrgent = daysUntil !== null && daysUntil <= 7 && daysUntil > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Opportunity Details</h1>
            <p className="text-sm text-slate-600">Notice ID: {opportunity.noticeId}</p>
          </div>
          <a
            href={opportunity.uiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            View on SAM.gov
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Title & Status */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex-1">{opportunity.title}</h2>
            <div className="flex gap-2">
              {opportunity.active && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                  Active
                </span>
              )}
              {isUrgent && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                  Urgent - {daysUntil} days left
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Solicitation:</span>
              <span>{opportunity.solicitationNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">Type:</span>
              <span>{opportunity.type}</span>
            </div>
          </div>
        </div>

        {/* Key Dates */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Dates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Posted Date</span>
              </div>
              <p className="text-slate-900 ml-6">{formatDate(opportunity.postedDate)}</p>
            </div>
            {opportunity.responseDeadLine && (
              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Response Deadline</span>
                </div>
                <p className={`ml-6 ${isUrgent ? 'text-red-600 font-semibold' : 'text-slate-900'}`}>
                  {formatDate(opportunity.responseDeadLine)}
                  {daysUntil !== null && daysUntil > 0 && (
                    <span className="ml-2 text-sm">({daysUntil} days remaining)</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Organization & Classification */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Organization & Classification</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-600">Organization:</span>
              <p className="text-slate-900 mt-1">{opportunity.organizationHierarchy}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {opportunity.naicsCode && (
                <div>
                  <span className="text-sm font-medium text-slate-600">NAICS Code:</span>
                  <p className="text-slate-900 mt-1">{opportunity.naicsCode}</p>
                </div>
              )}
              {opportunity.classificationCode && (
                <div>
                  <span className="text-sm font-medium text-slate-600">PSC Code:</span>
                  <p className="text-slate-900 mt-1">{opportunity.classificationCode}</p>
                </div>
              )}
            </div>

            {opportunity.typeOfSetAsideDescription && (
              <div>
                <span className="text-sm font-medium text-slate-600">Set-Aside:</span>
                <p className="text-slate-900 mt-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                    {opportunity.typeOfSetAsideDescription}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {opportunity.description && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
            <div className="prose prose-sm max-w-none text-slate-700">
              <p className="whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          </div>
        )}

        {/* Place of Performance */}
        {opportunity.placeOfPerformance && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Place of Performance
            </h3>
            <div className="text-slate-700">
              {opportunity.placeOfPerformance.city && (
                <p>{opportunity.placeOfPerformance.city.name}, {opportunity.placeOfPerformance.state?.code}</p>
              )}
              {opportunity.placeOfPerformance.zip && (
                <p className="text-sm text-slate-600">{opportunity.placeOfPerformance.zip}</p>
              )}
            </div>
          </div>
        )}

        {/* Points of Contact */}
        {opportunity.pointOfContact && opportunity.pointOfContact.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Points of Contact
            </h3>
            <div className="space-y-4">
              {opportunity.pointOfContact.map((contact: any, index: number) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">{contact.fullName || "N/A"}</p>
                  {contact.title && <p className="text-sm text-slate-600">{contact.title}</p>}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && <p className="text-sm text-slate-600">{contact.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {opportunity.resourceLinks && opportunity.resourceLinks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Attachments & Resources
            </h3>
            <div className="space-y-2">
              {opportunity.resourceLinks.map((resource: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{resource.name || `Document ${index + 1}`}</p>
                      {resource.type && <p className="text-xs text-slate-600">{resource.type}</p>}
                    </div>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      Download
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Award Information */}
        {opportunity.award && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Award Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {opportunity.award.awardee && (
                <div>
                  <span className="font-medium text-slate-600">Awardee:</span>
                  <p className="text-slate-900 mt-1">{opportunity.award.awardee.name}</p>
                </div>
              )}
              {opportunity.award.amount && (
                <div>
                  <span className="font-medium text-slate-600">Award Amount:</span>
                  <p className="text-slate-900 mt-1">${opportunity.award.amount.toLocaleString()}</p>
                </div>
              )}
              {opportunity.award.date && (
                <div>
                  <span className="font-medium text-slate-600">Award Date:</span>
                  <p className="text-slate-900 mt-1">{formatDate(opportunity.award.date)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
