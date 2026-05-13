/**
 * FedSignal Validators
 * 
 * Zod schemas for validating FedSignal collection documents
 */

import { z } from "zod";

// ============================================================================
// Base Validators
// ============================================================================

// Note: createdAt and updatedAt are handled automatically by Firestore helpers
// and are not included in the schemas below

// ============================================================================
// University Validators
// ============================================================================

export const universitySchema = z.object({
  name: z.string().min(1, "University name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  state: z.string().length(2, "State must be 2 characters"),
  type: z.enum(["HBCU", "MSI", "Tribal", "Other"]),
  researchClassification: z.enum(["R1", "R2", "R3", "D/PU", "M1", "M2", "Baccalaureate", "Associate"]),
  enrollment: z.number().int().min(0),
  website: z.string().url().optional().or(z.literal("")),
  mascot: z.string().optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
  govConScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    technicalCapability: z.number().min(0).max(100),
    pastPerformance: z.number().min(0).max(100),
    facilities: z.number().min(0).max(100),
    personnel: z.number().min(0).max(100),
    financialHealth: z.number().min(0).max(100),
  }),
  fy25Funding: z.number().min(0),
  fy24Funding: z.number().min(0).optional(),
  fy23Funding: z.number().min(0).optional(),
  capabilityIds: z.array(z.string()).optional(),
  isActive: z.boolean(),
  isRegistered: z.boolean(),
  registrationDate: z.any().optional(),
  isCEO: z.boolean().optional(),
  isCOO: z.boolean().optional(),
  isCTO: z.boolean().optional(),
  isCRO: z.boolean().optional(),
});

export const universityCreateSchema = universitySchema;

export const universityUpdateSchema = universityCreateSchema.partial();

// ============================================================================
// Opportunity Validators
// ============================================================================

export const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  agency: z.string().min(1, "Agency is required"),
  solicitationNumber: z.string().min(1, "Solicitation number is required"),
  type: z.enum(["grant", "contract", "cooperative_agreement", "other"]),
  status: z.enum(["open", "closed", "awarded", "cancelled"]),
  postedDate: z.any(), // Firestore Timestamp
  deadline: z.any(), // Firestore Timestamp
  responseDeadline: z.any().optional(),
  amount: z.string().optional(),
  amountMin: z.number().min(0).optional(),
  amountMax: z.number().min(0).optional(),
  isHbcuSetAside: z.boolean(),
  hbcuPreferred: z.boolean(),
  matchScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()),
  domains: z.array(z.string()),
  description: z.string(),
  requirements: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
  })).optional(),
  views: z.number().int().min(0).optional(),
  saves: z.number().int().min(0).optional(),
});

export const opportunityCreateSchema = opportunitySchema;

export const opportunityUpdateSchema = opportunityCreateSchema.partial();

// ============================================================================
// Contact Validators
// ============================================================================

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  type: z.enum(["prime", "agency", "hbcu", "small_business", "other"]),
  universityId: z.string().optional(),
  expertise: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isFavorite: z.boolean(),
  lastContact: z.any().optional(), // Firestore Timestamp
});

export const contactCreateSchema = contactSchema;

export const contactUpdateSchema = contactCreateSchema.partial();

// ============================================================================
// Grant Validators
// ============================================================================

export const grantSchema = z.object({
  grantNumber: z.string().min(1, "Grant number is required"),
  title: z.string().min(1, "Title is required"),
  agency: z.enum(["NSF", "NASA", "DoD", "DOE", "NIH", "Other"]),
  agencyProgram: z.string().optional(),
  opportunityId: z.string().optional(),
  status: z.enum(["pre_award", "under_review", "awarded", "active", "on_hold", "completed", "terminated", "withdrawn"]),
  universityId: z.string().min(1, "University ID is required"),
  consortiumId: z.string().optional(),
  principalInvestigator: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    title: z.string(),
    userId: z.string().optional(),
  }),
  coInvestigators: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    title: z.string(),
    userId: z.string().optional(),
  })).optional(),
  proposalDate: z.any(), // Firestore Timestamp
  awardDate: z.any().optional(),
  startDate: z.any(), // Firestore Timestamp
  endDate: z.any(), // Firestore Timestamp
  projectedCompletionDate: z.any().optional(),
  totalAwardAmount: z.number().min(0),
  directCosts: z.number().min(0),
  indirectCosts: z.number().min(0),
  budgetPeriods: z.array(z.object({
    period: z.number().int(),
    startDate: z.any(),
    endDate: z.any(),
    amount: z.number().min(0),
  })).optional(),
  projectSummary: z.string().min(1, "Project summary is required"),
  projectDescription: z.string(),
  intellectualMerit: z.string(),
  broaderImpacts: z.string(),
  referencesCited: z.string().optional(),
  seniorKeyPersonnel: z.array(z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email(),
    userId: z.string().optional(),
  })).optional(),
  facilitiesDescription: z.string().optional(),
  equipmentDescription: z.string().optional(),
  mentoringPlan: z.string().optional(),
  dataManagementPlan: z.string().optional(),
  reportingFrequency: z.enum(["monthly", "quarterly", "semi_annual", "annual", "other"]).optional(),
  nextReportDueDate: z.any().optional(),
  reportingPortal: z.string().optional(),
  agencyRequirements: z.object({
    sf298Required: z.boolean().optional(),
    dd250Required: z.boolean().optional(),
    rpprRequired: z.boolean().optional(),
    elinkRequired: z.boolean().optional(),
    other: z.record(z.string(), z.any()).optional(),
  }).optional(),
  milestonesCompleted: z.number().int().min(0).optional(),
  totalMilestones: z.number().int().min(0).optional(),
  reportsSubmitted: z.number().int().min(0).optional(),
  totalReportsRequired: z.number().int().min(0).optional(),
  finalReportSubmitted: z.boolean().optional(),
  finalReportDate: z.any().optional(),
  closeoutDate: z.any().optional(),
  documentIds: z.array(z.string()).optional(),
  internalNotes: z.string().optional(),
  agencyNotes: z.string().optional(),
});

export const grantCreateSchema = grantSchema;

export const grantUpdateSchema = grantCreateSchema.partial();

// ============================================================================
// Consortium Validators
// ============================================================================

export const consortiumSchema = z.object({
  name: z.string().min(1, "Consortium name is required"),
  description: z.string().min(1, "Description is required"),
  universityIds: z.array(z.string()).min(1, "At least one university is required"),
  leadUniversityId: z.string().min(1, "Lead university ID is required"),
  status: z.enum(["forming", "active", "completed", "cancelled"]),
  opportunityIds: z.array(z.string()).optional(),
  contactEmail: z.string().email(),
  contactName: z.string().min(1),
  totalFunding: z.number().min(0).optional(),
  proposalsSubmitted: z.number().int().min(0).optional(),
  proposalsWon: z.number().int().min(0).optional(),
});

export const consortiumCreateSchema = consortiumSchema;

export const consortiumUpdateSchema = consortiumCreateSchema.partial();

// ============================================================================
// Capability Validators
// ============================================================================

export const capabilitySchema = z.object({
  name: z.string().min(1, "Capability name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  universityCount: z.number().int().min(0),
  domains: z.array(z.string()),
  tags: z.array(z.string()),
});

export const capabilityCreateSchema = capabilitySchema;

export const capabilityUpdateSchema = capabilityCreateSchema.partial();

// ============================================================================
// Alert Validators
// ============================================================================

export const alertSchema = z.object({
  title: z.string().min(1, "Alert title is required"),
  type: z.enum(["deadline", "intelligence", "partnership", "funding", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().min(1, "Description is required"),
  link: z.string().url().optional().or(z.literal("")),
  targetUniversityIds: z.array(z.string()).optional(),
  targetDomains: z.array(z.string()).optional(),
  startDate: z.any(), // Firestore Timestamp
  endDate: z.any().optional(),
  views: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  isActive: z.boolean(),
});

export const alertCreateSchema = alertSchema;

export const alertUpdateSchema = alertCreateSchema.partial();

// ============================================================================
// Proposal Validators
// ============================================================================

export const proposalSchema = z.object({
  title: z.string().min(1, "Proposal title is required"),
  opportunityId: z.string().min(1, "Opportunity ID is required"),
  universityId: z.string().min(1, "University ID is required"),
  status: z.enum(["draft", "submitted", "under_review", "awarded", "rejected", "withdrawn"]),
  leadUniversityId: z.string().min(1, "Lead university ID is required"),
  consortiumId: z.string().optional(),
  partnerUniversityIds: z.array(z.string()).optional(),
  submissionDate: z.any().optional(),
  awardDate: z.any().optional(),
  requestedAmount: z.number().min(0).optional(),
  awardedAmount: z.number().min(0).optional(),
  abstract: z.string().optional(),
  teamSize: z.number().int().min(0).optional(),
});

export const proposalCreateSchema = proposalSchema;

export const proposalUpdateSchema = proposalCreateSchema.partial();

// ============================================================================
// Grant Milestone Validators
// ============================================================================

export const grantMilestoneSchema = z.object({
  grantId: z.string().min(1, "Grant ID is required"),
  title: z.string().min(1, "Milestone title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.any(), // Firestore Timestamp
  completionDate: z.any().optional(),
  status: z.enum(["not_started", "in_progress", "completed", "delayed", "cancelled"]),
  deliverables: z.array(z.string()),
  dependsOnMilestoneIds: z.array(z.string()).optional(),
  responsiblePerson: z.string().min(1),
  responsiblePersonId: z.string().optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const grantMilestoneCreateSchema = grantMilestoneSchema;

export const grantMilestoneUpdateSchema = grantMilestoneCreateSchema.partial();

// ============================================================================
// Grant Report Validators
// ============================================================================

export const grantReportSchema = z.object({
  grantId: z.string().min(1, "Grant ID is required"),
  reportType: z.enum(["progress", "interim", "annual", "final", "financial", "technical"]),
  reportPeriod: z.object({
    startDate: z.any(), // Firestore Timestamp
    endDate: z.any(), // Firestore Timestamp
  }),
  status: z.enum(["draft", "submitted", "under_review", "accepted", "revisions_required"]),
  executiveSummary: z.string().min(1, "Executive summary is required"),
  progressDescription: z.string().min(1, "Progress description is required"),
  achievements: z.array(z.string()),
  challenges: z.array(z.string()),
  budgetNarrative: z.string().optional(),
  publications: z.array(z.string()).optional(),
  presentations: z.array(z.string()).optional(),
  expendituresToDate: z.number().min(0).optional(),
  budgetVariance: z.string().optional(),
  milestones: z.array(z.object({
    milestoneId: z.string(),
    description: z.string(),
    status: z.enum(["completed", "in_progress", "delayed", "not_started"]),
    dueDate: z.any(),
    completionDate: z.any().optional(),
  })).optional(),
  personnelChanges: z.string().optional(),
  submittedBy: z.string(),
  submittedAt: z.any().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.any().optional(),
  sf298Data: z.record(z.string(), z.any()).optional(),
  rpprData: z.record(z.string(), z.any()).optional(),
  otherFormData: z.record(z.string(), z.any()).optional(),
  attachmentIds: z.array(z.string()).optional(),
});

export const grantReportCreateSchema = grantReportSchema;

export const grantReportUpdateSchema = grantReportCreateSchema.partial();
