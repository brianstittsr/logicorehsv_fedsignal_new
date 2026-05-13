/**
 * FedSignal Transformers
 * 
 * Transform SAM.gov API responses to Firestore document formats
 */

import { Timestamp } from "firebase/firestore";
import type { SamOpportunity } from "@/lib/sam/samApiClient";
import type { FSOpportunityDoc, FSContactDoc } from "./schema";

// ============================================================================
// SAM.gov Opportunity → Firestore Opportunity
// ============================================================================

export function transformSamOpportunityToFirestore(
  samOpp: SamOpportunity,
  universityId?: string
): Partial<FSOpportunityDoc> {
  // Parse dates
  const postedDate = samOpp.postedDate ? parseDateToTimestamp(samOpp.postedDate) : Timestamp.now();
  const deadline = samOpp.responseDeadLine ? parseDateToTimestamp(samOpp.responseDeadLine) : null;
  const responseDeadline = samOpp.responseDeadLine ? parseDateToTimestamp(samOpp.responseDeadLine) : undefined;

  // Determine if HBCU set-aside
  const isHbcuSetAside = samOpp.typeOfSetAside?.toLowerCase().includes("hbcu") || false;
  const hbcuPreferred = samOpp.typeOfSetAside?.toLowerCase().includes("hbcu") || 
                      samOpp.description?.toLowerCase().includes("hbcu") || false;

  // Parse funding amount
  const amount = samOpp.estimatedTotalContractValue || samOpp.contractBaseAndAllOptionsValue || "";
  const amountMin = parseFundingAmount(samOpp.estimatedTotalContractValue);
  const amountMax = parseFundingAmount(samOpp.contractBaseAndAllOptionsValue);

  // Extract tags from various fields
  const tags: string[] = [];
  if (isHbcuSetAside) tags.push("HBCU Set-Aside");
  if (hbcuPreferred) tags.push("HBCU Preferred");
  if (samOpp.typeOfSetAside) tags.push(samOpp.typeOfSetAside);

  // Extract domains from NAICS code
  const domains: string[] = [];
  if (samOpp.naicsCode) {
    domains.push(getDomainFromNaics(samOpp.naicsCode));
  }

  // Transform attachments
  const attachments = samOpp.resourceLinks?.map(link => ({
    name: link.name || link.description || "Attachment",
    url: link.url || link.downloadUrl || "",
    type: link.description || "document",
  })) || [];

  return {
    title: samOpp.title || "",
    agency: samOpp.fundingAgency || samOpp.department || "Unknown",
    solicitationNumber: samOpp.solicitationNumber || samOpp.noticeId || "",
    type: determineOpportunityType(samOpp),
    status: determineOpportunityStatus(samOpp),
    postedDate,
    deadline: deadline || Timestamp.now(),
    responseDeadline,
    amount,
    amountMin,
    amountMax,
    isHbcuSetAside,
    hbcuPreferred,
    tags,
    domains,
    description: samOpp.description || samOpp.additionalInfo || "",
    requirements: samOpp.description || undefined,
    attachments,
    views: 0,
    saves: 0,
  };
}

// ============================================================================
// SAM.gov Entity → Firestore Contact
// ============================================================================

export interface SamEntity {
  legalBusinessName: string;
  ueiSAM: string;
  cageCode?: string;
  physicalAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pointOfContact?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }>;
}

export function transformSamEntityToFirestore(
  samEntity: SamEntity,
  universityId?: string
): Partial<FSContactDoc> {
  const poc = samEntity.pointOfContact?.[0];
  
  return {
    name: samEntity.legalBusinessName || "",
    title: poc ? `${poc.firstName} ${poc.lastName}` : "Contact",
    organization: samEntity.legalBusinessName || "",
    email: poc?.email || "",
    phone: poc?.phone || samEntity.physicalAddress?.zipCode || "",
    type: determineContactType(samEntity),
    universityId,
    expertise: [],
    notes: `UEI: ${samEntity.ueiSAM}${samEntity.cageCode ? `, CAGE: ${samEntity.cageCode}` : ""}`,
    isFavorite: false,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function parseDateToTimestamp(dateString: string): Timestamp {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return Timestamp.now();
    }
    return Timestamp.fromDate(date);
  } catch {
    return Timestamp.now();
  }
}

function parseFundingAmount(value?: string): number | undefined {
  if (!value) return undefined;
  
  // Remove currency symbols and commas, extract number
  const cleaned = value.replace(/[$,]/g, "");
  const match = cleaned.match(/[\d.]+/);
  
  if (match) {
    const num = parseFloat(match[0]);
    return isNaN(num) ? undefined : num;
  }
  
  return undefined;
}

function determineOpportunityType(samOpp: SamOpportunity): "grant" | "contract" | "cooperative_agreement" | "other" {
  if (samOpp.type?.toLowerCase().includes("grant")) return "grant";
  if (samOpp.type?.toLowerCase().includes("contract")) return "contract";
  if (samOpp.type?.toLowerCase().includes("cooperative")) return "cooperative_agreement";
  return "other";
}

function determineOpportunityStatus(samOpp: SamOpportunity): "open" | "closed" | "awarded" | "cancelled" {
  if (samOpp.active === "false" || samOpp.active === "False") return "closed";
  if (samOpp.award?.awardee) return "awarded";
  if (samOpp.archiveDate) return "closed";
  return "open";
}

function getDomainFromNaics(naicsCode?: string): string {
  if (!naicsCode) return "Other";
  
  const code = naicsCode.substring(0, 2); // First 2 digits for high-level categorization
  
  const domainMap: Record<string, string> = {
    "11": "Agriculture",
    "21": "Mining",
    "22": "Utilities",
    "23": "Construction",
    "31": "Manufacturing",
    "32": "Manufacturing",
    "33": "Manufacturing",
    "42": "Wholesale",
    "44": "Retail",
    "45": "Retail",
    "48": "Transportation",
    "49": "Transportation",
    "51": "Information",
    "52": "Finance",
    "53": "Real Estate",
    "54": "Professional Services",
    "55": "Management",
    "56": "Administrative",
    "61": "Education",
    "62": "Healthcare",
    "71": "Arts",
    "72": "Entertainment",
    "81": "Other Services",
    "92": "Public Administration",
  };
  
  return domainMap[code] || "Other";
}

function determineContactType(samEntity: SamEntity): "prime" | "agency" | "hbcu" | "small_business" | "other" {
  const name = samEntity.legalBusinessName.toLowerCase();
  
  if (name.includes("university") || name.includes("college") || name.includes("institute")) {
    return "hbcu";
  }
  if (name.includes("department") || name.includes("agency") || name.includes("administration")) {
    return "agency";
  }
  
  return "other";
}

// ============================================================================
// Sync Summary
// ============================================================================

export interface SyncSummary {
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  details: Array<{
    id: string;
    action: "created" | "updated" | "skipped" | "error";
    message?: string;
  }>;
}

export function createSyncSummary(): SyncSummary {
  return {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };
}
