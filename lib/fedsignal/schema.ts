/**
 * Firebase Firestore Schema for FedSignal Platform
 * 
 * This file defines the database collections and document structures
 * for the FedSignal government funding intelligence platform.
 * All collections use the "fs_" prefix to keep them isolated from the main platform.
 */

import { Timestamp } from "firebase/firestore";

// ============================================================================
// FedSignal Collection Names
// ============================================================================

export const FSCOLLECTIONS = {
  UNIVERSITIES: "fs_universities",
  OPPORTUNITIES: "fs_opportunities",
  CONTACTS: "fs_contacts",
  CAPABILITIES: "fs_capabilities",
  CONSORTIUMS: "fs_consortiums",
  ALERTS: "fs_alerts",
  PROPOSALS: "fs_proposals",
  WIN_LOSS: "fs_winLoss",
  CALENDAR_EVENTS: "fs_calendarEvents",
  ACTIVITIES: "fs_activities",
  REPORTS: "fs_reports",
  SETTINGS: "fs_settings",
  UNIVERSITY_REGISTRATIONS: "fs_universityRegistrations",
  GRANTS: "fs_grants",
  GRANT_REPORTS: "fs_grantReports",
  GRANT_MILESTONES: "fs_grantMilestones",
  GRANT_BUDGETS: "fs_grantBudgets",
} as const;

// ============================================================================
// Base Document Interface
// ============================================================================

interface BaseFSDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// University Document
// ============================================================================

export interface FSUniversityDoc extends BaseFSDocument {
  name: string;
  acronym: string;
  state: string;
  type: "HBCU" | "MSI" | "Tribal" | "Other";
  researchClassification: "R1" | "R2" | "R3" | "D/PU" | "M1" | "M2" | "Baccalaureate" | "Associate";
  enrollment: number;
  website?: string;
  mascot?: string;
  
  // Branding
  colors: {
    primary: string;
    secondary: string;
  };
  
  // GovCon Readiness
  govConScore: number; // 0-100
  scoreBreakdown: {
    technicalCapability: number;
    pastPerformance: number;
    facilities: number;
    personnel: number;
    financialHealth: number;
  };
  
  // Funding
  fy25Funding: number;
  fy24Funding?: number;
  fy23Funding?: number;
  
  // Capabilities (array of capability IDs)
  capabilityIds?: string[];
  
  // Status
  isActive: boolean;
  isRegistered: boolean;
  registrationDate?: Timestamp;
  
  // Leadership flags
  isCEO?: boolean;
  isCOO?: boolean;
  isCTO?: boolean;
  isCRO?: boolean;
}

// ============================================================================
// Opportunity Document
// ============================================================================

export interface FSOpportunityDoc extends BaseFSDocument {
  title: string;
  agency: string; // e.g., "NSA", "NSF", "DoD", "DOE"
  solicitationNumber: string;
  type: "grant" | "contract" | "cooperative_agreement" | "other";
  status: "open" | "closed" | "awarded" | "cancelled";
  
  // Dates
  postedDate: Timestamp;
  deadline: Timestamp;
  responseDeadline?: Timestamp;
  
  // Funding
  amount?: string; // e.g., "$750K" or "$1.2M"
  amountMin?: number;
  amountMax?: number;
  
  // HBCU-specific
  isHbcuSetAside: boolean;
  hbcuPreferred: boolean;
  
  // Matching
  matchScore?: number; // 0-100, calculated per university
  
  // Categories
  tags: string[];
  domains: string[]; // e.g., ["Cybersecurity", "AI/ML"]
  
  // Description
  description: string;
  requirements?: string;
  
  // Attachments
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  
  // Performance metrics
  views?: number;
  saves?: number;
  
  // University-specific data (stored in subcollection per university)
}

// ============================================================================
// Contact Document
// ============================================================================

export interface FSContactDoc extends BaseFSDocument {
  name: string;
  title: string;
  organization: string;
  email: string;
  phone?: string;
  type: "prime" | "agency" | "hbcu" | "small_business" | "other";
  
  // Relationships
  universityId?: string; // Reference to fs_universities
  
  // Additional info
  expertise?: string[];
  notes?: string;
  
  // Status
  isFavorite: boolean;
  lastContact?: Timestamp;
}

// ============================================================================
// Capability Document
// ============================================================================

export interface FSCapabilityDoc extends BaseFSDocument {
  name: string;
  category: string; // e.g., "Cybersecurity", "AI/ML", "Biotechnology"
  description: string;
  
  // Metrics
  universityCount: number; // Number of universities with this capability
  
  // Related domains
  domains: string[];
  
  // Tags
  tags: string[];
}

// ============================================================================
// Consortium Document
// ============================================================================

export interface FSConsortiumDoc extends BaseFSDocument {
  name: string;
  description: string;
  
  // Universities
  universityIds: string[]; // Array of fs_universities IDs
  leadUniversityId: string; // Lead institution
  
  // Status
  status: "forming" | "active" | "completed" | "cancelled";
  
  // Opportunities
  opportunityIds?: string[]; // Target opportunities
  
  // Contact
  contactEmail: string;
  contactName: string;
  
  // Performance
  totalFunding?: number;
  proposalsSubmitted?: number;
  proposalsWon?: number;
}

// ============================================================================
// Alert Document
// ============================================================================

export interface FSAlertDoc extends BaseFSDocument {
  title: string;
  type: "deadline" | "intelligence" | "partnership" | "funding" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  
  // Content
  description: string;
  link?: string;
  
  // Targeting
  targetUniversityIds?: string[]; // If null, shows for all
  targetDomains?: string[];
  
  // Dates
  startDate: Timestamp;
  endDate?: Timestamp;
  
  // Metrics
  views?: number;
  clicks?: number;
  
  // Status
  isActive: boolean;
}

// ============================================================================
// Proposal Document
// ============================================================================

export interface FSProposalDoc extends BaseFSDocument {
  title: string;
  opportunityId: string; // Reference to fs_opportunities
  universityId: string; // Reference to fs_universities
  
  // Status
  status: "draft" | "submitted" | "under_review" | "awarded" | "rejected" | "withdrawn";
  
  // Team
  leadUniversityId: string; // Primary lead
  consortiumId?: string; // If part of a consortium
  partnerUniversityIds?: string[];
  
  // Dates
  submissionDate?: Timestamp;
  awardDate?: Timestamp;
  
  // Funding
  requestedAmount?: number;
  awardedAmount?: number;
  
  // Content
  abstract?: string;
  
  // Metrics
  teamSize?: number;
}

// ============================================================================
// Win/Loss Document
// ============================================================================

export interface FSWinLossDoc extends BaseFSDocument {
  opportunityId: string;
  universityId: string;
  
  // Outcome
  outcome: "win" | "loss" | "pending";
  
  // Details
  proposalId?: string;
  awardedAmount?: number;
  competitorCount?: number;
  
  // Analysis
  winReasons?: string[];
  lossReasons?: string[];
  lessonsLearned?: string;
  
  // Dates
  decisionDate: Timestamp;
}

// ============================================================================
// Calendar Event Document
// ============================================================================

export interface FSCalendarEventDoc extends BaseFSDocument {
  title: string;
  type: "deadline" | "meeting" | "conference" | "webinar" | "other";
  
  // Dates
  startDate: Timestamp;
  endDate?: Timestamp;
  allDay: boolean;
  
  // Related entities
  opportunityId?: string;
  universityId?: string;
  consortiumId?: string;
  
  // Details
  description?: string;
  location?: string;
  link?: string;
  
  // Participants
  participantIds?: string[]; // User IDs
  
  // Reminders
  reminderSent: boolean;
}

// ============================================================================
// Activity Document
// ============================================================================

export interface FSActivityDoc extends BaseFSDocument {
  type: "opportunity_saved" | "opportunity_viewed" | "contact_created" | "proposal_submitted" | "alert_viewed" | "other";
  
  // Actor
  userId: string;
  universityId?: string;
  
  // Target
  targetId: string; // ID of the entity being acted upon
  targetType: "opportunity" | "contact" | "proposal" | "alert" | "other";
  
  // Details
  description: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// Report Document
// ============================================================================

export interface FSReportDoc extends BaseFSDocument {
  name: string;
  type: "monthly" | "quarterly" | "annual" | "custom";
  
  // Scope
  universityId?: string; // If null, platform-wide report
  dateRange: {
    start: Timestamp;
    end: Timestamp;
  };
  
  // Content
  summary: string;
  metrics: {
    opportunitiesViewed: number;
    proposalsSubmitted: number;
    fundingWon: number;
    activeConsortiums: number;
  };
  
  // File
  fileUrl?: string;
  fileType?: string;
  
  // Status
  isPublished: boolean;
}

// ============================================================================
// Settings Document (Singleton)
// ============================================================================

export interface FSSettingsDoc extends BaseFSDocument {
  // Platform info
  platformName: string;
  currentFiscalYear: string;
  currentQuarter: string;
  
  // Default university
  defaultUniversityId: string;
  
  // Phase banner
  phaseBanner: {
    active: boolean;
    label: string;
    message: string;
  };
  
  // Feature flags
  features: {
    enableProposalPal: boolean;
    enableRfiCreator: boolean;
    enableContentStudio: boolean;
    enableConsortiumWorkspace: boolean;
    enableSbriMatch: boolean;
  };
  
  // Funding domains
  fundingDomains: {
    name: string;
    totalFunding: number;
    color: string;
  }[];
}

// ============================================================================
// University Registration Document
// ============================================================================

export interface FSUniversityRegistrationDoc extends BaseFSDocument {
  // Institution info
  institutionName: string;
  institutionType: string;
  state: string;
  website?: string;
  
  // Contact info
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactTitle: string;
  
  // Capabilities
  primaryDomains: string[];
  researchClassification: string;
  enrollment?: string;
  
  // Status
  status: "pending" | "under_review" | "approved" | "rejected";
  
  // Review
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  reviewNotes?: string;
  
  // When approved, this will link to the university document
  universityId?: string;
}

// ============================================================================
// Grant Document
// ============================================================================

export interface FSGrantDoc extends BaseFSDocument {
  // Basic Information
  grantNumber: string;
  title: string;
  agency: "NSF" | "NASA" | "DoD" | "DOE" | "NIH" | "Other";
  agencyProgram?: string;
  opportunityId?: string; // Reference to fs_opportunities
  
  // Status
  status: "pre_award" | "under_review" | "awarded" | "active" | "on_hold" | "completed" | "terminated" | "withdrawn";
  
  // University
  universityId: string; // Reference to fs_universities
  consortiumId?: string; // Reference to fs_consortiums
  
  // Principal Investigator
  principalInvestigator: {
    name: string;
    email: string;
    title: string;
    userId?: string;
  };
  
  // Co-PIs
  coInvestigators?: {
    name: string;
    email: string;
    title: string;
    userId?: string;
  }[];
  
  // Dates
  proposalDate: Timestamp;
  awardDate?: Timestamp;
  startDate: Timestamp;
  endDate: Timestamp;
  projectedCompletionDate?: Timestamp;
  
  // Funding
  totalAwardAmount: number;
  directCosts: number;
  indirectCosts: number;
  budgetPeriods: {
    period: number;
    startDate: Timestamp;
    endDate: Timestamp;
    amount: number;
  }[];
  
  // Project Details
  projectSummary: string; // 1-page summary
  projectDescription: string; // Full description
  intellectualMerit: string;
  broaderImpacts: string;
  referencesCited?: string;
  
  // Personnel
  seniorKeyPersonnel?: {
    name: string;
    role: string;
    email: string;
    userId?: string;
  }[];
  
  // Facilities and Resources
  facilitiesDescription?: string;
  equipmentDescription?: string;
  
  // Mentoring Plan (if applicable)
  mentoringPlan?: string;
  
  // Data Management Plan
  dataManagementPlan?: string;
  
  // Reporting Requirements
  reportingFrequency: "monthly" | "quarterly" | "semi_annual" | "annual" | "other";
  nextReportDueDate?: Timestamp;
  reportingPortal?: string;
  
  // Agency-Specific Requirements
  agencyRequirements?: {
    sf298Required?: boolean; // DoD
    dd250Required?: boolean; // DoD
    rpprRequired?: boolean; // NIH
    elinkRequired?: boolean; // DOE
    other?: Record<string, any>;
  };
  
  // Performance Metrics
  milestonesCompleted?: number;
  totalMilestones?: number;
  reportsSubmitted?: number;
  totalReportsRequired?: number;
  
  // Closeout
  finalReportSubmitted?: boolean;
  finalReportDate?: Timestamp;
  closeoutDate?: Timestamp;
  
  // Documents
  documentIds?: string[]; // References to uploaded documents
  
  // Notes
  internalNotes?: string;
  agencyNotes?: string;
}

// ============================================================================
// Grant Report Document
// ============================================================================

export interface FSGrantReportDoc extends BaseFSDocument {
  grantId: string; // Reference to fs_grants
  
  // Report Information
  reportType: "progress" | "interim" | "annual" | "final" | "financial" | "technical";
  reportPeriod: {
    startDate: Timestamp;
    endDate: Timestamp;
  };
  
  // Status
  status: "draft" | "submitted" | "under_review" | "accepted" | "revisions_required";
  
  // Content
  executiveSummary: string;
  progressDescription: string;
  achievements: string[];
  challenges: string[];
  budgetNarrative?: string;
  publications?: string[];
  presentations?: string[];
  
  // Financial Information
  expendituresToDate?: number;
  budgetVariance?: string;
  
  // Milestones
  milestones: {
    milestoneId: string;
    description: string;
    status: "completed" | "in_progress" | "delayed" | "not_started";
    dueDate: Timestamp;
    completionDate?: Timestamp;
  }[];
  
  // Personnel Changes
  personnelChanges?: string;
  
  // Submission
  submittedBy: string;
  submittedAt?: Timestamp;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  
  // Agency-Specific Forms
  sf298Data?: Record<string, any>; // DoD
  rpprData?: Record<string, any>; // NIH
  otherFormData?: Record<string, any>;
  
  // Attachments
  attachmentIds?: string[];
}

// ============================================================================
// Grant Milestone Document
// ============================================================================

export interface FSGrantMilestoneDoc extends BaseFSDocument {
  grantId: string; // Reference to fs_grants
  
  // Milestone Information
  title: string;
  description: string;
  
  // Dates
  dueDate: Timestamp;
  completionDate?: Timestamp;
  
  // Status
  status: "not_started" | "in_progress" | "completed" | "delayed" | "cancelled";
  
  // Deliverables
  deliverables?: string[];
  
  // Dependencies
  dependsOnMilestoneIds?: string[];
  
  // Responsibility
  responsiblePerson: string;
  responsiblePersonId?: string;
  
  // Progress
  progressPercentage?: number;
  notes?: string;
}

// ============================================================================
// Grant Budget Document
// ============================================================================

export interface FSGrantBudgetDoc extends BaseFSDocument {
  grantId: string; // Reference to fs_grants
  
  // Budget Period
  period: number;
  startDate: Timestamp;
  endDate: Timestamp;
  
  // Budget Categories
  personnel: {
    seniorPersonnel: number;
    otherPersonnel: number;
    fringeBenefits: number;
    total: number;
  };
  
  equipment: {
    amount: number;
    justification: string;
  };
  
  travel: {
    domestic: number;
    foreign: number;
    total: number;
    justification: string;
  };
  
  supplies: {
    amount: number;
    justification: string;
  };
  
  contractualServices: {
    amount: number;
    justification: string;
  };
  
  construction: {
    amount: number;
    justification: string;
  };
  
  other: {
    amount: number;
    description: string;
    justification: string;
  };
  
  indirectCosts: {
    rate: number;
    baseAmount: number;
    total: number;
  };
  
  totalDirectCosts: number;
  totalIndirectCosts: number;
  totalBudget: number;
  
  // Actual Expenditures
  actualExpenditures?: {
    personnel: number;
    equipment: number;
    travel: number;
    supplies: number;
    contractualServices: number;
    other: number;
    total: number;
  };
  
  // Variance
  variance?: number;
  varianceExplanation?: string;
}
