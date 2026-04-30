/**
 * SAM.gov API Client
 * 
 * Client for interacting with the SAM.gov Public API
 * Provides methods for searching opportunities, fetching details, and downloading attachments
 */

const SAM_API_BASE = "https://api.sam.gov/opportunities/v2";
const SAM_RESOURCES_BASE = "https://sam.gov/api/prod/opps/v3/opportunities";

interface SearchParams {
  limit?: number;
  offset?: number;
  postedFrom?: string;
  postedTo?: string;
  responseDeadlineFrom?: string;
  responseDeadlineTo?: string;
  naics?: string;
  psc?: string;
  typeOfSetAside?: string;
  noticeType?: string;
  state?: string;
  active?: string;
  keyword?: string;
}

interface SamOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber?: string;
  department?: string;
  subTier?: string;
  office?: string;
  postedDate: string;
  type: string;
  baseType?: string;
  archiveType?: string;
  archiveDate?: string;
  typeOfSetAsideDescription?: string;
  typeOfSetAside?: string;
  responseDeadLine?: string;
  naicsCode?: string;
  classificationCode?: string;
  active: string;
  award?: any;
  pointOfContact?: any[];
  description?: string;
  organizationLocationCityName?: string;
  organizationLocationStateCode?: string;
  organizationLocationZIPCode?: string;
  placeOfPerformance?: any;
  additionalInfoLink?: string;
  uiLink?: string;
  links?: any[];
  resourceLinks?: string[];
}

interface SearchResponse {
  opportunitiesData: SamOpportunity[];
  totalRecords: number;
  limit: number;
  offset: number;
}

export class SamApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for opportunities using SAM.gov API
   */
  async searchOpportunities(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("api_key", this.apiKey);
    queryParams.append("limit", String(params.limit || 10));
    queryParams.append("offset", String(params.offset || 0));

    if (params.postedFrom) queryParams.append("postedFrom", params.postedFrom);
    if (params.postedTo) queryParams.append("postedTo", params.postedTo);
    if (params.responseDeadlineFrom) queryParams.append("responseDeadlineFrom", params.responseDeadlineFrom);
    if (params.responseDeadlineTo) queryParams.append("responseDeadlineTo", params.responseDeadlineTo);
    if (params.naics) queryParams.append("ncode", params.naics);
    if (params.psc) queryParams.append("psc", params.psc);
    if (params.typeOfSetAside) queryParams.append("typeOfSetAside", params.typeOfSetAside);
    if (params.noticeType) queryParams.append("noticeType", params.noticeType);
    if (params.state) queryParams.append("state", params.state);
    if (params.active) queryParams.append("active", params.active);
    if (params.keyword) queryParams.append("q", params.keyword);

    const url = `${SAM_API_BASE}/search?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        opportunitiesData: data.opportunitiesData || [],
        totalRecords: data.totalRecords || 0,
        limit: params.limit || 10,
        offset: params.offset || 0,
      };
    } catch (error) {
      console.error("Error searching opportunities:", error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific opportunity
   */
  async fetchOpportunityDetails(noticeId: string): Promise<SamOpportunity | null> {
    const queryParams = new URLSearchParams();
    queryParams.append("api_key", this.apiKey);
    queryParams.append("noticeid", noticeId);

    const url = `${SAM_API_BASE}/search?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.opportunitiesData && data.opportunitiesData.length > 0) {
        const opportunity = data.opportunitiesData[0];
        opportunity.uiLink = `https://sam.gov/opp/${noticeId}/view`;
        return opportunity;
      }

      return null;
    } catch (error) {
      console.error("Error fetching opportunity details:", error);
      throw error;
    }
  }

  /**
   * Fetch resource links (attachments) for an opportunity
   */
  async fetchResourceLinks(noticeId: string): Promise<any[]> {
    const url = `${SAM_RESOURCES_BASE}/${noticeId}/resources`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`SAM.gov Resources API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.resourceLinks || [];
    } catch (error) {
      console.error("Error fetching resource links:", error);
      return [];
    }
  }

  /**
   * Transform SAM.gov response to normalized format
   */
  transformSamResponse(opportunity: SamOpportunity): any {
    return {
      noticeId: opportunity.noticeId,
      title: opportunity.title,
      solicitationNumber: opportunity.solicitationNumber || "N/A",
      active: opportunity.active === "Yes",
      type: opportunity.type,
      baseType: opportunity.baseType,
      organizationHierarchy: [
        opportunity.department,
        opportunity.subTier,
        opportunity.office
      ].filter(Boolean).join("."),
      postedDate: opportunity.postedDate,
      responseDeadLine: opportunity.responseDeadLine,
      naicsCode: opportunity.naicsCode,
      classificationCode: opportunity.classificationCode,
      typeOfSetAside: opportunity.typeOfSetAside,
      typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription,
      description: opportunity.description,
      pointOfContact: opportunity.pointOfContact || [],
      resourceLinks: opportunity.resourceLinks || [],
      uiLink: opportunity.uiLink || `https://sam.gov/opp/${opportunity.noticeId}/view`,
      placeOfPerformance: opportunity.placeOfPerformance,
      award: opportunity.award,
    };
  }
}

export function createSamApiClient(): SamApiClient {
  const apiKey = process.env.SAM_API_KEY;
  if (!apiKey) {
    throw new Error("SAM_API_KEY environment variable is not set");
  }
  return new SamApiClient(apiKey);
}
