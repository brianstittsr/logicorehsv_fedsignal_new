/**
 * FedSignal Onboarding Validators
 * 
 * Zod schemas for validating onboarding data and subscription management
 */

import { z } from "zod";

// ============================================================================
// Subscription & Tier Validators
// ============================================================================

export const subscriptionTierSchema = z.enum(["starter", "professional", "enterprise"]);
export const subscriptionStatusSchema = z.enum(["active", "trialing", "past_due", "canceled", "paused"]);
export const billingIntervalSchema = z.enum(["monthly", "annual"]);
export const organizationTypeSchema = z.enum(["hbcu", "minority_owned_business", "small_business", "enterprise", "other"]);
export const certificationTypeSchema = z.enum(["8a", "hubzone", "sdvosb", "wosb", "veteran_owned", "sdb"]);

export const planLimitsSchema = z.object({
  maxOpportunities: z.number().int().min(0).nullable(),
  maxTeamSeats: z.number().int().min(1),
  maxGrants: z.number().int().min(0).nullable(),
  maxContacts: z.number().int().min(0).nullable(),
  maxStorageGB: z.number().min(0),
  aiFeatures: z.boolean(),
  advancedAnalytics: z.boolean(),
  apiAccess: z.boolean(),
  prioritySupport: z.boolean(),
});

export const subscriptionSchema = z.object({
  tier: subscriptionTierSchema,
  billingInterval: billingIntervalSchema,
  discountCode: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
});

// ============================================================================
// Onboarding Step Validators
// ============================================================================

export const onboardingStepSchema = z.enum([
  "welcome",
  "organization_type",
  "organization_details",
  "certifications",
  "capabilities",
  "team_invite",
  "preferences",
  "billing",
  "complete",
]);

export const onboardingStatusSchema = z.enum(["in_progress", "completed", "abandoned"]);

export const marketingAttributionSchema = z.object({
  source: z.string(),
  campaign: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

// ============================================================================
// Step Data Validators
// ============================================================================

export const welcomeStepSchema = z.object({
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service",
  }),
  acceptedPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must accept the Privacy Policy",
  }),
  marketingConsent: z.boolean().optional(),
});

export const organizationTypeStepSchema = z.object({
  type: organizationTypeSchema,
  subtype: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(2).max(2),
  zip: z.string().optional(),
  country: z.string().default("US"),
});

export const organizationDetailsStepSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: addressSchema,
});

export const certificationInfoSchema = z.object({
  type: certificationTypeSchema,
  certifyingAgency: z.string().min(1),
  certificationNumber: z.string().optional(),
  issueDate: z.any(), // Firestore Timestamp - validated at runtime
  expirationDate: z.any().optional(),
  status: z.enum(["active", "expired", "pending"]),
  documentUrl: z.string().url().optional().or(z.literal("")),
});

export const certificationsStepSchema = z.object({
  certifications: z.array(certificationInfoSchema),
  samUeid: z.string().optional(),
  samCageCode: z.string().optional(),
});

export const capabilitiesStepSchema = z.object({
  naicsCodes: z.array(z.string().regex(/^\d{6}$/, "NAICS code must be 6 digits")),
  pscCodes: z.array(z.string()),
  primaryIndustry: z.string().optional(),
  capabilities: z.array(z.string()),
  researchAreas: z.array(z.string()).optional(),
});

export const teamInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "researcher", "viewer", "bd_manager"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const teamInviteStepSchema = z.object({
  invites: z.array(teamInviteSchema).max(10, "Maximum 10 invites at a time"),
  skipForNow: z.boolean(),
});

export const notificationPreferencesSchema = z.object({
  email: z.object({
    dailyDigest: z.boolean(),
    opportunityAlerts: z.boolean(),
    deadlineReminders: z.boolean(),
    grantAlerts: z.boolean(),
    marketingEmails: z.boolean(),
  }),
  sms: z.object({
    urgentDeadlines: z.boolean(),
    opportunityAlerts: z.boolean(),
  }),
  inApp: z.object({
    opportunityRecommendations: z.boolean(),
    teamingSuggestions: z.boolean(),
    systemUpdates: z.boolean(),
  }),
});

export const preferencesStepSchema = z.object({
  opportunityTypes: z.array(z.string()),
  agenciesOfInterest: z.array(z.string()),
  setAsidePreferences: z.array(z.string()),
  fundingDomains: z.array(z.string()),
  minContractValue: z.number().min(0).optional(),
  maxContractValue: z.number().min(0).optional(),
  notificationPreferences: notificationPreferencesSchema,
});

export const billingAddressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  postal_code: z.string().min(5, "ZIP code is required"),
  country: z.string().default("US"),
});

export const billingStepSchema = z.object({
  tier: subscriptionTierSchema,
  billingInterval: billingIntervalSchema,
  discountCode: z.string().optional(),
  stripePaymentMethodId: z.string().optional(),
  billingDetails: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    address: billingAddressSchema,
  }),
});

// ============================================================================
// Organization Profile Validators
// ============================================================================

export const pastPerformanceSchema = z.object({
  contractNumber: z.string(),
  agency: z.string(),
  title: z.string(),
  amount: z.number().min(0),
  startDate: z.any(), // Firestore Timestamp
  endDate: z.any().optional(),
  isHbcuSetAside: z.boolean(),
  rating: z.enum(["exceptional", "very_good", "good", "satisfactory", "unsatisfactory"]).optional(),
});

const currentYear = new Date().getFullYear();

export const organizationProfileSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  type: organizationTypeSchema,
  subtype: z.string().optional(),
  
  // HBCU specific
  universityId: z.string().optional(),
  isHbcu: z.boolean(),
  hbcuType: z.enum(["public", "private", "tribal"]).optional(),
  enrollment: z.number().int().min(0).optional(),
  researchClassification: z.enum(["R1", "R2", "R3", "none"]).optional(),
  
  // Minority-owned specific
  isMinorityOwned: z.boolean(),
  minorityOwnerEthnicity: z.string().optional(),
  yearEstablished: z.number().int().min(1800).max(currentYear).optional(),
  annualRevenue: z.number().min(0).optional(),
  employeeCount: z.number().int().min(0).optional(),
  
  // Certifications
  certifications: z.array(certificationInfoSchema),
  
  // Contact
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: addressSchema,
  
  // SAM.gov
  samUeid: z.string().optional(),
  samCageCode: z.string().optional(),
  samRegistrationStatus: z.enum(["active", "expired", "pending"]).optional(),
  samExpirationDate: z.any().optional(),
  
  // Capabilities
  naicsCodes: z.array(z.string()),
  pscCodes: z.array(z.string()),
  primaryIndustry: z.string().optional(),
  capabilities: z.array(z.string()),
  pastPerformance: z.array(pastPerformanceSchema),
  
  // Settings
  timezone: z.string().default("America/New_York"),
  notificationPreferences: notificationPreferencesSchema,
});

export const organizationProfileCreateSchema = organizationProfileSchema;

export const organizationProfileUpdateSchema = organizationProfileSchema.partial();

// ============================================================================
// Onboarding Progress Validators
// ============================================================================

export const onboardingProgressSchema = z.object({
  currentStep: onboardingStepSchema,
  completedSteps: z.array(onboardingStepSchema),
  status: onboardingStatusSchema,
  stepData: z.record(z.string(), z.any()),
  marketingAttribution: marketingAttributionSchema.optional(),
});

export const updateOnboardingStepSchema = z.object({
  step: onboardingStepSchema,
  data: z.record(z.string(), z.any()),
  isComplete: z.boolean().optional(),
});

// ============================================================================
// Discount Code Validators
// ============================================================================

export const discountCodeSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().min(1),
  percentOff: z.number().min(0).max(100),
  amountOff: z.number().min(0).optional(),
  duration: z.enum(["once", "repeating", "forever"]),
  durationInMonths: z.number().int().min(1).optional(),
  validFrom: z.any(), // Firestore Timestamp
  validUntil: z.any().optional(),
  maxRedemptions: z.number().int().min(1).optional(),
  appliesTo: z.object({
    tiers: z.array(subscriptionTierSchema),
    organizationTypes: z.array(organizationTypeSchema),
  }),
  restrictions: z.object({
    newCustomersOnly: z.boolean().optional(),
    minPurchaseAmount: z.number().min(0).optional(),
    validForAnnualOnly: z.boolean().optional(),
  }),
  isActive: z.boolean(),
});

export const validateDiscountCodeSchema = z.object({
  code: z.string(),
  tier: subscriptionTierSchema,
  organizationType: organizationTypeSchema,
  billingInterval: billingIntervalSchema,
});

// ============================================================================
// Helper Validation Functions
// ============================================================================

export function validateStepData(
  step: string,
  data: unknown
): { success: true; data: unknown } | { success: false; errors: string[] } {
  let schema: z.ZodSchema;

  switch (step) {
    case "welcome":
      schema = welcomeStepSchema;
      break;
    case "organization_type":
      schema = organizationTypeStepSchema;
      break;
    case "organization_details":
      schema = organizationDetailsStepSchema;
      break;
    case "certifications":
      schema = certificationsStepSchema;
      break;
    case "capabilities":
      schema = capabilitiesStepSchema;
      break;
    case "team_invite":
      schema = teamInviteStepSchema;
      break;
    case "preferences":
      schema = preferencesStepSchema;
      break;
    case "billing":
      schema = billingStepSchema;
      break;
    default:
      return { success: false, errors: [`Unknown step: ${step}`] };
  }

  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.issues.map((issue: z.ZodIssue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }
}

export function validateOrganizationTypeForStep(
  step: string,
  organizationType: string
): boolean {
  // Some steps may be optional for certain organization types
  const optionalSteps: Record<string, string[]> = {
    enterprise: ["certifications", "capabilities"],
    other: ["certifications", "capabilities", "team_invite"],
  };

  const optional = optionalSteps[organizationType] || [];
  return !optional.includes(step);
}

export function getStepValidator(step: string): z.ZodSchema | null {
  switch (step) {
    case "welcome":
      return welcomeStepSchema;
    case "organization_type":
      return organizationTypeStepSchema;
    case "organization_details":
      return organizationDetailsStepSchema;
    case "certifications":
      return certificationsStepSchema;
    case "capabilities":
      return capabilitiesStepSchema;
    case "team_invite":
      return teamInviteStepSchema;
    case "preferences":
      return preferencesStepSchema;
    case "billing":
      return billingStepSchema;
    default:
      return null;
  }
}
