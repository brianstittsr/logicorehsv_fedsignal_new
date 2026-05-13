/**
 * FedSignal Onboarding Types
 * 
 * Type definitions for user onboarding, subscription management,
 * and marketing tier support.
 */

import { Timestamp } from "firebase/firestore";

// ============================================================================
// Subscription & Tier Types
// ============================================================================

export type SubscriptionTier = "starter" | "professional" | "enterprise";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "paused";
export type BillingInterval = "monthly" | "annual";
export type OrganizationType = "hbcu" | "minority_owned_business" | "small_business" | "enterprise" | "other";
export type CertificationType = "8a" | "hubzone" | "sdvosb" | "wosb" | "veteran_owned" | "sdb";

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular?: boolean;
}

export interface PlanFeature {
  name: string;
  description: string;
  included: boolean;
  highlight?: boolean;
}

export interface PlanLimits {
  maxOpportunities: number | null; // null = unlimited
  maxTeamSeats: number;
  maxGrants: number | null;
  maxContacts: number | null;
  maxStorageGB: number;
  aiFeatures: boolean;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  organizationId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  trialEnd?: Timestamp;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  discountCode?: string;
  discountPercent: number;
  amountPaid: number;
  currency: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Onboarding Types
// ============================================================================

export type OnboardingStep = 
  | "welcome"
  | "organization_type"
  | "organization_details"
  | "certifications"
  | "capabilities"
  | "team_invite"
  | "preferences"
  | "billing"
  | "complete";

export type OnboardingStatus = "in_progress" | "completed" | "abandoned";

export interface OnboardingProgress {
  id: string;
  userId: string;
  organizationId: string;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  status: OnboardingStatus;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  lastActivityAt: Timestamp;
  stepData: Record<OnboardingStep, any>;
  marketingAttribution?: {
    source: string;
    campaign?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

// ============================================================================
// Organization Profile Types
// ============================================================================

export interface OrganizationProfile {
  id: string;
  name: string;
  type: OrganizationType;
  subtype?: string;
  
  // For HBCUs
  universityId?: string;
  isHbcu: boolean;
  hbcuType?: "public" | "private" | "tribal";
  enrollment?: number;
  researchClassification?: "R1" | "R2" | "R3" | "none";
  
  // For Minority-Owned Businesses
  isMinorityOwned: boolean;
  minorityOwnerEthnicity?: string;
  yearEstablished?: number;
  annualRevenue?: number;
  employeeCount?: number;
  
  // Certifications
  certifications: CertificationInfo[];
  
  // Contact
  website?: string;
  phone?: string;
  address: {
    street?: string;
    city?: string;
    state: string;
    zip?: string;
    country: string;
  };
  
  // SAM.gov
  samUeid?: string;
  samCageCode?: string;
  samRegistrationStatus?: "active" | "expired" | "pending";
  samExpirationDate?: Timestamp;
  
  // Capabilities
  naicsCodes: string[];
  pscCodes: string[];
  primaryIndustry?: string;
  capabilities: string[];
  pastPerformance: PastPerformance[];
  
  // Settings
  timezone: string;
  notificationPreferences: NotificationPreferences;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CertificationInfo {
  type: CertificationType;
  certifyingAgency: string;
  certificationNumber?: string;
  issueDate: Timestamp;
  expirationDate?: Timestamp;
  status: "active" | "expired" | "pending";
  documentUrl?: string;
}

export interface PastPerformance {
  contractNumber: string;
  agency: string;
  title: string;
  amount: number;
  startDate: Timestamp;
  endDate?: Timestamp;
  isHbcuSetAside: boolean;
  rating?: "exceptional" | "very_good" | "good" | "satisfactory" | "unsatisfactory";
}

export interface NotificationPreferences {
  email: {
    dailyDigest: boolean;
    opportunityAlerts: boolean;
    deadlineReminders: boolean;
    grantAlerts: boolean;
    marketingEmails: boolean;
  };
  sms: {
    urgentDeadlines: boolean;
    opportunityAlerts: boolean;
  };
  inApp: {
    opportunityRecommendations: boolean;
    teamingSuggestions: boolean;
    systemUpdates: boolean;
  };
}

// ============================================================================
// Onboarding Step Data Types
// ============================================================================

export interface WelcomeStepData {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  marketingConsent?: boolean;
}

export interface OrganizationTypeStepData {
  type: OrganizationType;
  subtype?: string;
}

export interface OrganizationDetailsStepData {
  name: string;
  website?: string;
  phone?: string;
  address: {
    street?: string;
    city?: string;
    state: string;
    zip?: string;
    country: string;
  };
}

export interface CertificationsStepData {
  certifications: CertificationInfo[];
  samUeid?: string;
  samCageCode?: string;
}

export interface CapabilitiesStepData {
  naicsCodes: string[];
  pscCodes: string[];
  primaryIndustry?: string;
  capabilities: string[];
  researchAreas?: string[];
}

export interface TeamInviteStepData {
  invites: TeamInvite[];
  skipForNow: boolean;
}

export interface TeamInvite {
  email: string;
  role: "admin" | "researcher" | "viewer" | "bd_manager";
  firstName?: string;
  lastName?: string;
}

export interface PreferencesStepData {
  opportunityTypes: string[];
  agenciesOfInterest: string[];
  setAsidePreferences: string[];
  fundingDomains: string[];
  minContractValue?: number;
  maxContractValue?: number;
  notificationPreferences: NotificationPreferences;
}

export interface BillingStepData {
  tier: SubscriptionTier;
  billingInterval: BillingInterval;
  discountCode?: string;
  stripePaymentMethodId?: string;
  billingDetails: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

// ============================================================================
// Predefined Plans
// ============================================================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    tier: "starter",
    name: "Starter",
    description: "Perfect for exploring federal contracting opportunities",
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      { name: "Track up to 5 opportunities", description: "Active opportunity tracking", included: true },
      { name: "Weekly set-aside alerts", description: "HBCU, 8(a), WOSB set-asides", included: true },
      { name: "Basic SAM.gov search", description: "Search and filter opportunities", included: true },
      { name: "Community access", description: "Join the FedSignal community", included: true },
      { name: "Educational content", description: "Guides and resources", included: true },
      { name: "AI-powered scoring", description: "Smart opportunity matching", included: false },
      { name: "Recompete predictions", description: "Early opportunity alerts", included: false },
      { name: "Teaming partner matching", description: "Find collaboration partners", included: false },
    ],
    limits: {
      maxOpportunities: 5,
      maxTeamSeats: 1,
      maxGrants: 3,
      maxContacts: 10,
      maxStorageGB: 1,
      aiFeatures: false,
      advancedAnalytics: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  {
    id: "professional",
    tier: "professional",
    name: "Professional",
    description: "For HBCUs and small businesses ready to scale",
    priceMonthly: 99,
    priceAnnual: 999,
    isPopular: true,
    features: [
      { name: "Unlimited opportunity tracking", description: "Track all opportunities", included: true, highlight: true },
      { name: "AI-powered opportunity scoring", description: "Smart match scoring", included: true, highlight: true },
      { name: "Recompete predictions", description: "12-24 month forecasts", included: true, highlight: true },
      { name: "Teaming partner matching", description: "Find partners", included: true },
      { name: "Grant intelligence", description: "Grant tracking", included: true },
      { name: "Real-time alerts", description: "Instant notifications", included: true },
      { name: "Competitor analysis", description: "Competitive insights", included: true },
      { name: "Set-aside scanner", description: "Find set-asides", included: true },
      { name: "Advanced analytics", description: "Deep insights", included: false },
      { name: "API access", description: "Integrations", included: false },
    ],
    limits: {
      maxOpportunities: null,
      maxTeamSeats: 3,
      maxGrants: null,
      maxContacts: null,
      maxStorageGB: 10,
      aiFeatures: true,
      advancedAnalytics: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  {
    id: "enterprise",
    tier: "enterprise",
    name: "Enterprise",
    description: "Advanced intelligence for growing teams",
    priceMonthly: 199,
    priceAnnual: 1999,
    features: [
      { name: "Everything in Professional", description: "All Pro features", included: true },
      { name: "Compliance readiness scoring", description: "Compliance analysis", included: true, highlight: true },
      { name: "Pricing intelligence", description: "Competitive pricing", included: true, highlight: true },
      { name: "Go/No-Go decision support", description: "Decision tools", included: true, highlight: true },
      { name: "Relationship intelligence", description: "Contact tracking", included: true },
      { name: "Advanced analytics", description: "Custom reports", included: true },
      { name: "API access", description: "Full API", included: true },
      { name: "Team collaboration", description: "Up to 10 seats", included: true },
      { name: "Priority support", description: "Dedicated support", included: true },
      { name: "Custom integrations", description: "Enterprise integrations", included: true },
    ],
    limits: {
      maxOpportunities: null,
      maxTeamSeats: 10,
      maxGrants: null,
      maxContacts: null,
      maxStorageGB: 50,
      aiFeatures: true,
      advancedAnalytics: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
];

// ============================================================================
// Discount Codes
// ============================================================================

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  percentOff: number;
  amountOff?: number;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  validFrom: Timestamp;
  validUntil?: Timestamp;
  maxRedemptions?: number;
  redemptionsUsed: number;
  appliesTo: {
    tiers: SubscriptionTier[];
    organizationTypes: OrganizationType[];
  };
  restrictions: {
    newCustomersOnly?: boolean;
    minPurchaseAmount?: number;
    validForAnnualOnly?: boolean;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Predefined discount codes
export const DEFAULT_DISCOUNTS = [
  {
    code: "HBCU50",
    description: "50% off for accredited HBCUs",
    percentOff: 50,
    duration: "forever",
    appliesTo: { tiers: ["professional", "enterprise"], organizationTypes: ["hbcu"] },
  },
  {
    code: "MOB25",
    description: "25% off for minority-owned businesses",
    percentOff: 25,
    duration: "forever",
    appliesTo: { tiers: ["professional", "enterprise"], organizationTypes: ["minority_owned_business"] },
  },
  {
    code: "8A30",
    description: "30% off for 8(a) certified firms",
    percentOff: 30,
    duration: "forever",
    appliesTo: { tiers: ["professional", "enterprise"], organizationTypes: ["minority_owned_business", "small_business"] },
  },
  {
    code: "ANNUAL16",
    description: "16% off annual plans",
    percentOff: 16,
    duration: "forever",
    validForAnnualOnly: true,
    appliesTo: { tiers: ["professional", "enterprise"], organizationTypes: ["hbcu", "minority_owned_business", "small_business", "enterprise", "other"] },
  },
];

// ============================================================================
// Onboarding Flow Configuration
// ============================================================================

export const ONBOARDING_FLOW: Record<OrganizationType, OnboardingStep[]> = {
  hbcu: [
    "welcome",
    "organization_type",
    "organization_details",
    "certifications",
    "capabilities",
    "team_invite",
    "preferences",
    "billing",
    "complete",
  ],
  minority_owned_business: [
    "welcome",
    "organization_type",
    "organization_details",
    "certifications",
    "capabilities",
    "team_invite",
    "preferences",
    "billing",
    "complete",
  ],
  small_business: [
    "welcome",
    "organization_type",
    "organization_details",
    "certifications",
    "capabilities",
    "preferences",
    "billing",
    "complete",
  ],
  enterprise: [
    "welcome",
    "organization_type",
    "organization_details",
    "team_invite",
    "preferences",
    "complete",
  ],
  other: [
    "welcome",
    "organization_type",
    "organization_details",
    "preferences",
    "billing",
    "complete",
  ],
};

// ============================================================================
// Helper Functions
// ============================================================================

export function getPlanByTier(tier: SubscriptionTier): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.tier === tier);
}

export function getPlanPrice(tier: SubscriptionTier, interval: BillingInterval): number {
  const plan = getPlanByTier(tier);
  if (!plan) return 0;
  return interval === "monthly" ? plan.priceMonthly : plan.priceAnnual;
}

export function calculateDiscountedPrice(
  basePrice: number,
  discountPercent: number
): number {
  return Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
}

export function getNextStep(
  currentStep: OnboardingStep,
  organizationType: OrganizationType
): OnboardingStep | null {
  const flow = ONBOARDING_FLOW[organizationType];
  const currentIndex = flow.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex >= flow.length - 1) return null;
  return flow[currentIndex + 1];
}

export function isStepRequired(
  step: OnboardingStep,
  tier: SubscriptionTier
): boolean {
  // Billing step not required for starter tier
  if (step === "billing" && tier === "starter") return false;
  return true;
}
