/**
 * SAM.gov Search Settings Utilities
 * 
 * Functions to load and apply SAM.gov search settings from Firestore
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FSCOLLECTIONS, FSSamSearchSettingsDoc } from "@/lib/fedsignal/schema";

/**
 * Load SAM.gov search settings from Firestore
 */
export async function loadSamSearchSettings(): Promise<FSSamSearchSettingsDoc | null> {
  if (!db) return null;
  
  try {
    const docRef = doc(db, FSCOLLECTIONS.SAM_SEARCH_SETTINGS, "default");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FSSamSearchSettingsDoc;
    }
    
    return null;
  } catch (error) {
    console.error("Error loading SAM search settings:", error);
    return null;
  }
}

/**
 * Apply SAM search settings to search filters
 */
export function applySamSearchSettings(
  settings: FSSamSearchSettingsDoc,
  baseQuery: string,
  baseFilters: Record<string, string | undefined>
): { query: string; filters: Record<string, string | undefined> } {
  if (!settings.enabled) {
    return { query: baseQuery, filters: baseFilters };
  }

  // Build enhanced query with keywords
  const keywords = settings.searchKeywords.join(" OR ");
  const enhancedQuery = keywords ? `(${baseQuery}) AND (${keywords})` : baseQuery;

  // Apply configured filters
  const filters = { ...baseFilters };

  // Notice types
  if (settings.noticeTypes.length > 0) {
    filters.notice_type = settings.noticeTypes.join(",");
  }

  // NAICS codes
  if (settings.naicsCodes.length > 0) {
    filters.naics = settings.naicsCodes.map(n => n.code).join(",");
  }

  // Set-asides
  if (settings.setAsides.length > 0) {
    filters.set_aside = settings.setAsides.join(",");
  }

  // Place of performance states
  if (settings.popStates.length > 0) {
    filters.pop_state = settings.popStates.join(",");
  }

  // Date ranges
  if (settings.responseDateDays > 0) {
    const responseDateFrom = new Date();
    responseDateFrom.setDate(responseDateFrom.getDate() + settings.responseDateDays);
    filters.response_date_from = responseDateFrom.toISOString().split('T')[0];
  }

  if (settings.postedDateDays > 0) {
    const postedDateFrom = new Date();
    postedDateFrom.setDate(postedDateFrom.getDate() - settings.postedDateDays);
    filters.posted_date_from = postedDateFrom.toISOString().split('T')[0];
  }

  // BAA mode
  if (settings.enableBAA && settings.baaKeywords.length > 0) {
    const baaKeywords = settings.baaKeywords.join(" OR ");
    filters.notice_type = "BAA";
    filters.keywords = baaKeywords;
  }

  return { query: enhancedQuery, filters };
}

/**
 * Get target agencies for display
 */
export function getTargetAgencies(settings: FSSamSearchSettingsDoc | null): string[] {
  return settings?.targetAgencies || [];
}

/**
 * Get contract categories for display
 */
export function getContractCategories(settings: FSSamSearchSettingsDoc | null): string[] {
  return settings?.contractCategories || [];
}
