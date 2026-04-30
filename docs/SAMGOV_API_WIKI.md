# SAM.gov Opportunities API - Technical Wiki

> **Andrej Karpathy-style deep dive**: A comprehensive, implementation-focused guide to the SAM.gov Opportunities Public API. This wiki is designed for engineers building production systems that need to understand not just *what* the API does, but *how* it works, *why* it's designed that way, and *how to use it effectively*.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [API Architecture](#api-architecture)
3. [Request Parameters Deep Dive](#request-parameters-deep-dive)
4. [Response Structure Analysis](#response-structure-analysis)
5. [Data Types & Schemas](#data-types--schemas)
6. [Pagination Strategy](#pagination-strategy)
7. [Search Patterns & Query Optimization](#search-patterns--query-optimization)
8. [Set-Aside System](#set-aside-system)
9. [Notice Type Taxonomy](#notice-type-taxonomy)
10. [Classification Codes](#classification-codes)
11. [Error Handling & Edge Cases](#error-handling--edge-cases)
12. [Rate Limits & Performance](#rate-limits--performance)
13. [Data Freshness & Versioning](#data-freshness--versioning)
14. [Advanced Use Cases](#advanced-use-cases)
15. [Implementation Patterns](#implementation-patterns)

---

## Core Concepts

### What is SAM.gov?

**SAM** = System for Award Management. It's the U.S. government's official system for:
- Publishing federal contract opportunities
- Managing vendor registrations
- Tracking awards and contracts
- Providing transparency in federal procurement

### The Opportunities API

The **Get Opportunities Public API** provides programmatic access to federal contract opportunities. Think of it as a search engine API for government contracts.

**Key insight**: This API only returns the **latest active version** of each opportunity. Historical versions require accessing the Data Services section separately.

### Why v2?

The API is currently at **version 2** (`/v2/search`). Version 2 introduced:
- Full organizational hierarchy paths (`fullParentPathName`, `fullParentPathCode`)
- Better structured response format
- Improved filtering capabilities

**Migration note**: If you see references to `/v1/`, those are legacy. Always use `/v2/`.

---

## API Architecture

### Endpoints

**Production:**
```
https://api.sam.gov/opportunities/v2/search
```

**Alpha (Testing):**
```
https://api-alpha.sam.gov/opportunities/v2/search
```

### Request Method

**GET only**. All parameters are query strings.

### Authentication

**API Key required**. Passed as `api_key` query parameter.

```
GET /opportunities/v2/search?api_key=YOUR_KEY&limit=10&offset=0&postedFrom=01/01/2024&postedTo=12/31/2024
```

**Getting an API Key:**
1. Register at [sam.gov](https://sam.gov) (production) or [alpha.sam.gov](https://alpha.sam.gov) (testing)
2. Navigate to Account Details
3. Enter your password to view API Key section
4. Generate API Key (instant, free)
5. Copy key immediately (only shown once on that page)

**Security note**: API keys are tied to user accounts. Treat them like passwords.

---

## Request Parameters Deep Dive

### Mandatory Parameters

Only **date range** is truly mandatory when using pagination:

| Parameter | Type | Required | Format | Description |
|-----------|------|----------|--------|-------------|
| `postedFrom` | String | Yes* | `MM/DD/YYYY` | Start of posted date range |
| `postedTo` | String | Yes* | `MM/DD/YYYY` | End of posted date range |
| `limit` | Integer | Yes | Number | Records per page (max varies) |
| `offset` | Integer | Yes | Number | Starting position (0-indexed) |
| `api_key` | String | Yes | String | Your API key |

*Required when using pagination (which you always should be)

### Optional Filter Parameters

#### Identification Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `noticeid` | String | Unique notice identifier | `5b345bbb7127b91a3ad577b203fc6f68` |
| `solnum` | String | Solicitation number | `47PF0018R0023` |
| `title` | String | Opportunity title (partial match) | `Software Development` |

**Pro tip**: `noticeid` is the primary key. Use it for direct lookups.

#### Classification Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `ncode` | String | NAICS code | `541511` |
| `ccode` | String | PSC/Classification code | `D301` |

**NAICS** = North American Industry Classification System (6 digits)
**PSC** = Product Service Code (4 characters, alphanumeric)

#### Geographic Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `state` | String | Place of performance state (2-letter) | `CA` |
| `zip` | String | Place of performance ZIP code | `94102` |

**Note**: These filter by **place of performance**, not the contracting office location.

#### Procurement Type Filter

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `ptype` | Array | Notice type codes | `o,p,k` |

**Array format**: Comma-separated values. See [Notice Type Taxonomy](#notice-type-taxonomy) for codes.

#### Set-Aside Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `typeOfSetAside` | String | Set-aside code | `SBA` |
| `typeOfSetAsideDescription` | String | Set-aside description | `Total Small Business Set-Aside` |

**Pro tip**: Use `typeOfSetAside` (code) for exact matching. Use `typeOfSetAsideDescription` for fuzzy searches.

#### Response Deadline Filters

| Parameter | Type | Format | Description |
|-----------|------|--------|-------------|
| `rdlfrom` | String | `MM/DD/YYYY` | Response deadline from |
| `rdlto` | String | `MM/DD/YYYY` | Response deadline to |

**Use case**: Find opportunities closing within next 30 days.

---

## Response Structure Analysis

### Top-Level Response Object

```typescript
interface OpportunitiesResponse {
  totalRecords: number;      // Total matching records
  limit: number;             // Records per page (from request)
  offset: number;            // Starting position (from request)
  opportunitiesData: Opportunity[];  // Array of opportunities
  links: Link[];             // HATEOAS links
}
```

### Opportunity Object (Complete Schema)

```typescript
interface Opportunity {
  // === Core Identification ===
  noticeId: string;                    // Primary key, unique identifier
  title: string;                       // Opportunity title
  solicitationNumber: string;          // Sol number (may be null)
  
  // === Organization Hierarchy (v2) ===
  fullParentPathName: string;          // Dot-separated org path
  fullParentPathCode: string;          // Dot-separated org codes
  
  // === Legacy Organization Fields (deprecated in v2) ===
  department?: string;                 // Top-level department
  subTier?: string;                    // Sub-tier organization
  office?: string;                     // Office name
  
  // === Dates ===
  postedDate: string;                  // ISO date or MM/DD/YYYY
  responseDeadLine: string | null;     // Deadline (null if none)
  archiveDate: string | null;          // When archived (null if active)
  
  // === Notice Type ===
  type: string;                        // Display type (e.g., "Award Notice")
  baseType: string;                    // Base type category
  archiveType: string;                 // Archive method: "manual", "autocustom", etc.
  
  // === Classification ===
  naicsCode: string | null;            // 6-digit NAICS
  classificationCode: string | null;   // PSC code
  
  // === Set-Aside ===
  typeOfSetAside: string | null;       // Set-aside code
  typeOfSetAsideDescription: string | null;  // Human-readable description
  
  // === Status ===
  active: "Yes" | "No";                // Active status
  
  // === Award Information (if applicable) ===
  award: {
    date: string;                      // Award date
    number: string;                    // Award/contract number
    amount: string;                    // Dollar amount (as string!)
    awardee?: {                        // Only in some responses
      name: string;
      location: Location;
      ueiSAM: string;                  // Unique Entity Identifier
    };
  } | null;
  
  // === Contact Information ===
  pointOfContact: PointOfContact[] | null;
  
  // === Description ===
  description: string;                 // URL or text content
  
  // === Location ===
  organizationType: string;            // "OFFICE", "DEPARTMENT", etc.
  officeAddress: Address;              // Contracting office address
  placeOfPerformance: Location | null; // Where work happens
  
  // === Links ===
  additionalInfoLink: string | null;   // External link
  uiLink: string;                      // SAM.gov UI link
  links: Link[];                       // HATEOAS self-links
  resourceLinks: string[] | null;      // Attachments (v2)
}
```

### Nested Object Schemas

#### Location Schema

```typescript
interface Location {
  streetAddress?: string;
  city: {
    code: string;      // City code
    name: string;      // City name
  };
  state: {
    code: string;      // 2-letter state code
  };
  zip: string;
  country: {
    code: string;      // "USA", etc.
  };
}
```

#### Address Schema (Simplified)

```typescript
interface Address {
  zipcode: string;
  city: string;
  countryCode: string;
  state: string;
}
```

#### Point of Contact Schema

```typescript
interface PointOfContact {
  type: "primary" | "secondary";
  fullName: string;
  title: string | null;
  email: string;
  phone: string;
  fax: string | null;
}
```

#### Link Schema (HATEOAS)

```typescript
interface Link {
  rel: string;           // Relationship: "self"
  href: string;          // URL
  hreflang: string | null;
  media: string | null;
  title: string | null;
  type: string | null;
  deprecation: string | null;
}
```

---

## Data Types & Schemas

### Type Coercion Gotchas

**Award Amount is a String!**
```typescript
award: {
  amount: "800620"  // ⚠️ STRING, not number!
}
```

**Why?** To preserve precision and avoid floating-point errors. Always parse:
```typescript
const amount = parseFloat(opportunity.award.amount);
```

**Date Formats Vary**
- Posted dates: Usually `YYYY-MM-DD` (ISO)
- Request parameters: `MM/DD/YYYY`
- Some legacy: `MM/DD/YYYY`

**Null vs Undefined**
- API returns `null` for missing data
- Never returns `undefined`
- Empty arrays are `[]`, not `null`

### Active Status

```typescript
active: "Yes" | "No"  // ⚠️ STRING, not boolean!
```

**Conversion:**
```typescript
const isActive = opportunity.active === "Yes";
```

---

## Pagination Strategy

### How Pagination Works

SAM.gov uses **offset-based pagination**:

```
Page 1: offset=0,  limit=10  → Records 0-9
Page 2: offset=10, limit=10  → Records 10-19
Page 3: offset=20, limit=10  → Records 20-29
```

### Optimal Page Size

**Recommended**: `limit=100`

**Why?**
- Reduces API calls
- Stays under rate limits
- Balances response size vs request count

**Max limit**: Not officially documented, but `1000` appears to be the ceiling.

### Complete Pagination Pattern

```typescript
async function fetchAllOpportunities(filters: SearchFilters): Promise<Opportunity[]> {
  const allOpportunities: Opportunity[] = [];
  let offset = 0;
  const limit = 100;
  let totalRecords = 0;
  
  do {
    const response = await fetch(
      `https://api.sam.gov/opportunities/v2/search?` +
      `api_key=${API_KEY}&` +
      `limit=${limit}&` +
      `offset=${offset}&` +
      `postedFrom=${filters.postedFrom}&` +
      `postedTo=${filters.postedTo}`
    );
    
    const data = await response.json();
    
    totalRecords = data.totalRecords;
    allOpportunities.push(...data.opportunitiesData);
    
    offset += limit;
    
    // Safety: prevent infinite loops
    if (offset > 10000) break;
    
  } while (offset < totalRecords);
  
  return allOpportunities;
}
```

### Pagination Edge Cases

**Empty Results**
```json
{
  "totalRecords": 0,
  "limit": 10,
  "offset": 0,
  "opportunitiesData": [],
  "links": []
}
```

**Last Page Partial**
```
totalRecords: 245
offset: 240, limit: 10 → Returns 5 records
```

---

## Search Patterns & Query Optimization

### Pattern 1: Date Range Scanning

**Use case**: Daily sync of new opportunities

```typescript
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const params = {
  postedFrom: formatDate(yesterday),  // MM/DD/YYYY
  postedTo: formatDate(today),
  limit: 100,
  offset: 0
};
```

**Pro tip**: Run this daily at 2 AM ET (after SAM.gov updates).

### Pattern 2: NAICS-Based Filtering

**Use case**: Industry-specific opportunity tracking

```typescript
const NAICS_CODES = {
  SOFTWARE: "541511",
  IT_CONSULTING: "541512",
  COMPUTER_SYSTEMS: "541513",
  RD_PHYSICAL: "541715",
};

// Search for software development opportunities
const params = {
  ncode: NAICS_CODES.SOFTWARE,
  postedFrom: "01/01/2024",
  postedTo: "12/31/2024",
  active: "Yes"  // ⚠️ Not an official param, filter client-side
};
```

### Pattern 3: Geographic Targeting

**Use case**: State-specific opportunities

```typescript
const params = {
  state: "CA",
  postedFrom: "01/01/2024",
  postedTo: "12/31/2024"
};
```

**Gotcha**: This filters by **place of performance**, not contracting office.

### Pattern 4: Set-Aside Hunting

**Use case**: Small business opportunities

```typescript
const params = {
  typeOfSetAside: "SBA",  // Total Small Business
  postedFrom: "01/01/2024",
  postedTo: "12/31/2024"
};
```

### Pattern 5: Deadline-Driven Search

**Use case**: Find opportunities closing soon

```typescript
const today = new Date();
const in30Days = new Date(today);
in30Days.setDate(in30Days.getDate() + 30);

const params = {
  rdlfrom: formatDate(today),
  rdlto: formatDate(in30Days),
  postedFrom: "01/01/2024",  // Still required!
  postedTo: formatDate(in30Days)
};
```

**Critical**: `postedFrom`/`postedTo` are still required even when using `rdlfrom`/`rdlto`.

### Pattern 6: Multi-Filter Combination

**Use case**: Highly targeted search

```typescript
const params = {
  ncode: "541511",           // Software development
  state: "VA",               // Virginia
  typeOfSetAside: "SBA",     // Small business
  ptype: "o,k",              // Solicitations and combined
  postedFrom: "01/01/2024",
  postedTo: "12/31/2024"
};
```

**Performance**: More filters = faster response (smaller result set).

---

## Set-Aside System

### What are Set-Asides?

**Set-asides** are contract reservations for specific business categories to promote socioeconomic goals.

### Set-Aside Codes

| Code | Description | Eligibility |
|------|-------------|-------------|
| `SBA` | Total Small Business Set-Aside | Small businesses (<500 employees typically) |
| `SBP` | Partial Small Business Set-Aside | Partial small business |
| `8A` | 8(a) Set-Aside | 8(a) Business Development program |
| `8AN` | 8(a) Sole Source | 8(a) without competition |
| `HZC` | Historically Underutilized Business Zone Set-Aside | HUBZone certified |
| `HZS` | HUBZone Sole Source | HUBZone without competition |
| `SDVOSBC` | Service-Disabled Veteran-Owned Small Business Set-Aside | SDVOSB certified |
| `SDVOSBS` | Service-Disabled Veteran-Owned Small Business Sole Source | SDVOSB sole source |
| `WOSB` | Women-Owned Small Business Program Set-Aside | WOSB certified |
| `WOSBSS` | Women-Owned Small Business Program Sole Source | WOSB sole source |
| `EDWOSB` | Economically Disadvantaged WOSB | ED-WOSB certified |
| `EDWOSBSS` | Economically Disadvantaged WOSB Sole Source | ED-WOSB sole source |
| `LAS` | Local Area Set-Aside | Geographic restriction |
| `IEE` | Indian Economic Enterprise Set-Aside | Native American businesses |
| `ISBEE` | Indian Small Business Economic Enterprise | Native American small business |
| `BICiv` | Buy Indian Set-Aside | Indian-owned businesses |
| `VSA` | Veteran-Owned Small Business Set-Aside | Veteran-owned |
| `VSS` | Veteran-Owned Small Business Sole Source | Veteran sole source |

### Set-Aside Hierarchy

**Competitive Set-Asides** (require bidding):
- `SBA`, `8A`, `HZC`, `SDVOSBC`, `WOSB`, `EDWOSB`

**Sole Source** (single vendor):
- `8AN`, `HZS`, `SDVOSBS`, `WOSBSS`, `EDWOSBSS`

### Null Set-Aside

```typescript
typeOfSetAside: null
typeOfSetAsideDescription: null
```

**Meaning**: Unrestricted competition (any business can bid).

---

## Notice Type Taxonomy

### Notice Type Codes (`ptype`)

| Code | Type | Description | Typical Use |
|------|------|-------------|-------------|
| `o` | Solicitation | Formal request for proposals | Main contracting vehicle |
| `p` | Presolicitation | Advance notice of upcoming solicitation | Market research |
| `k` | Combined Synopsis/Solicitation | Combined announcement and solicitation | Simplified acquisition |
| `r` | Sources Sought | Request for information about capable vendors | Market research |
| `s` | Special Notice | General announcements | Various |
| `a` | Award Notice | Contract award announcement | Post-award transparency |
| `i` | Intent to Bundle | Notice of bundling requirements | Small business notification |
| `u` | Justification and Approval | J&A for sole source/limited competition | Transparency |

### Notice Type Lifecycle

```
1. Sources Sought (r)
   ↓
2. Presolicitation (p)
   ↓
3. Solicitation (o) OR Combined Synopsis/Solicitation (k)
   ↓
4. Award Notice (a)
```

**Not all opportunities follow this path**. Many skip directly to solicitation.

### Filtering by Multiple Types

```typescript
ptype: "o,k,p"  // Comma-separated
```

**Returns**: Opportunities matching ANY of the types (OR logic).

---

## Classification Codes

### NAICS Codes

**Format**: 6 digits
**Example**: `541511`

**Structure**:
- First 2 digits: Sector (54 = Professional, Scientific, Technical Services)
- First 3 digits: Subsector (541 = Professional, Scientific, Technical Services)
- First 4 digits: Industry Group (5415 = Computer Systems Design)
- First 5 digits: Industry (54151 = Computer Systems Design and Related Services)
- All 6 digits: National Industry (541511 = Custom Computer Programming Services)

**Common NAICS for Federal Contracting**:
- `541511` - Custom Computer Programming Services
- `541512` - Computer Systems Design Services
- `541513` - Computer Facilities Management Services
- `541519` - Other Computer Related Services
- `541715` - Research and Development in Physical, Engineering, Life Sciences
- `541330` - Engineering Services
- `611430` - Professional and Management Development Training

**Lookup**: https://www.naics.com/search/

### PSC Codes (Product Service Codes)

**Format**: 4 characters (alphanumeric)
**Example**: `D301`

**Structure**:
- First character: Major category
- Remaining characters: Specific product/service

**Common PSC Codes**:
- `D301` - IT and Telecom - IT and Telecom
- `D302` - IT and Telecom - ADP Software
- `D307` - IT and Telecom - IT Strategy and Architecture
- `R408` - R&D - Defense Systems
- `R425` - R&D - Electronics and Communication Equipment
- `Z` - Maintenance, Repair, Alteration of Real Property

**Lookup**: https://www.acquisition.gov/psc-manual

### Code Matching Strategy

**Exact Match**:
```typescript
ncode: "541511"  // Only 541511
```

**Prefix Match** (not supported by API):
```typescript
// ❌ Won't work
ncode: "5415"  // Trying to match all 5415xx

// ✅ Solution: Fetch all, filter client-side
const results = await fetchOpportunities({ postedFrom, postedTo });
const filtered = results.filter(opp => 
  opp.naicsCode?.startsWith("5415")
);
```

---

## Error Handling & Edge Cases

### HTTP Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| `200` | Success | Process data |
| `400` | Bad Request | Check parameters |
| `401` | Unauthorized | Check API key |
| `403` | Forbidden | Check API key permissions |
| `404` | Not Found | No data matches query |
| `500` | Internal Server Error | Retry with backoff |

### Error Response Format

```json
{
  "error": {
    "code": "400",
    "message": "Invalid date format"
  }
}
```

**Note**: Error format is not officially documented. Handle gracefully.

### Common Errors

#### Missing Date Range
```
Error: postedFrom and postedTo are required when using limit
```

**Fix**: Always provide date range.

#### Invalid Date Format
```
Error: Invalid date format
```

**Fix**: Use `MM/DD/YYYY` format exactly.

#### Invalid API Key
```
401 Unauthorized
```

**Fix**: Regenerate API key or check for typos.

#### Rate Limit Exceeded
```
429 Too Many Requests
```

**Fix**: Implement exponential backoff.

### Edge Cases

#### Null Description

```typescript
description: "null"  // ⚠️ String "null", not null!
```

**Check**:
```typescript
if (opp.description === "null" || !opp.description) {
  // No description available
}
```

#### Empty Point of Contact

```typescript
pointOfContact: null  // vs []
```

**Safe access**:
```typescript
const contacts = opp.pointOfContact || [];
```

#### Missing Response Deadline

```typescript
responseDeadLine: null
```

**Common for**:
- Award notices
- Special notices
- Archived opportunities

#### Award Amount Precision

```typescript
award: { amount: "350567.00" }
```

**Parse carefully**:
```typescript
const amount = parseFloat(opp.award.amount);
// 350567.00 → 350567
```

---

## Rate Limits & Performance

### Official Rate Limits

**Not publicly documented**, but observed limits:

- **Requests per hour**: ~1000 (free tier)
- **Requests per day**: ~10,000 (free tier)
- **Concurrent requests**: ~5

**Enterprise tiers**: Contact SAM.gov for higher limits.

### Rate Limit Strategy

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsThisHour = 0;
  private hourStart = Date.now();
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }
  
  private async process() {
    if (this.processing) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      // Reset counter every hour
      if (Date.now() - this.hourStart > 3600000) {
        this.requestsThisHour = 0;
        this.hourStart = Date.now();
      }
      
      // Check limit
      if (this.requestsThisHour >= 900) {  // Buffer of 100
        await this.sleep(3600000 - (Date.now() - this.hourStart));
        this.requestsThisHour = 0;
        this.hourStart = Date.now();
      }
      
      const fn = this.queue.shift()!;
      await fn();
      this.requestsThisHour++;
      
      // Delay between requests
      await this.sleep(100);  // 100ms = max 600/min
    }
    
    this.processing = false;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Performance Optimization

**1. Batch Requests**
```typescript
// ❌ Bad: 365 requests
for (let day = 0; day < 365; day++) {
  await fetchOpportunities({ 
    postedFrom: formatDate(day),
    postedTo: formatDate(day)
  });
}

// ✅ Good: 1 request
await fetchOpportunities({
  postedFrom: "01/01/2024",
  postedTo: "12/31/2024"
});
```

**2. Cache Aggressively**
```typescript
const cache = new Map<string, CachedResponse>();

async function fetchWithCache(params: SearchParams) {
  const key = JSON.stringify(params);
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.data;  // 1 hour cache
  }
  
  const data = await fetchOpportunities(params);
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

**3. Parallel Requests (Carefully)**
```typescript
// Max 5 concurrent
const chunks = chunkArray(dateRanges, 5);

for (const chunk of chunks) {
  await Promise.all(chunk.map(range => 
    fetchOpportunities(range)
  ));
}
```

---

## Data Freshness & Versioning

### Update Schedule

**Active Opportunities**: Updated **daily**
**Archived Opportunities**: Updated **weekly**

**Update time**: Approximately **2:00 AM ET**

### Data Versioning

**Critical insight**: The API returns only the **latest version** of each opportunity.

**What this means**:
- If a solicitation is modified, you only get the current version
- Historical changes are not tracked via API
- For version history, use Data Services downloads

### Detecting Changes

**Strategy 1: Daily Diff**
```typescript
const yesterday = await fetchOpportunities({ 
  postedFrom: "01/01/2024", 
  postedTo: "12/30/2024" 
});

const today = await fetchOpportunities({ 
  postedFrom: "01/01/2024", 
  postedTo: "12/31/2024" 
});

const newOpps = today.filter(t => 
  !yesterday.some(y => y.noticeId === t.noticeId)
);
```

**Strategy 2: Hash Comparison**
```typescript
import crypto from 'crypto';

function hashOpportunity(opp: Opportunity): string {
  const relevant = {
    title: opp.title,
    description: opp.description,
    responseDeadLine: opp.responseDeadLine,
    // ... other fields that matter
  };
  return crypto.createHash('md5')
    .update(JSON.stringify(relevant))
    .digest('hex');
}

// Detect modifications
const oldHash = hashOpportunity(oldVersion);
const newHash = hashOpportunity(newVersion);
if (oldHash !== newHash) {
  console.log('Opportunity was modified');
}
```

---

## Advanced Use Cases

### Use Case 1: Opportunity Alert System

**Goal**: Email users when opportunities match their criteria

```typescript
interface UserProfile {
  userId: string;
  naicsCodes: string[];
  states: string[];
  setAsides: string[];
  email: string;
}

async function checkAlertsForUser(user: UserProfile) {
  const yesterday = formatDate(Date.now() - 86400000);
  const today = formatDate(Date.now());
  
  // Fetch new opportunities
  const opportunities = await fetchOpportunities({
    postedFrom: yesterday,
    postedTo: today
  });
  
  // Filter by user preferences
  const matches = opportunities.filter(opp => {
    const naicsMatch = !user.naicsCodes.length || 
      user.naicsCodes.includes(opp.naicsCode || '');
    
    const stateMatch = !user.states.length ||
      user.states.includes(opp.placeOfPerformance?.state?.code || '');
    
    const setAsideMatch = !user.setAsides.length ||
      user.setAsides.includes(opp.typeOfSetAside || '');
    
    return naicsMatch && stateMatch && setAsideMatch;
  });
  
  if (matches.length > 0) {
    await sendEmail(user.email, matches);
  }
}
```

### Use Case 2: Competitive Intelligence

**Goal**: Track what competitors are winning

```typescript
async function trackCompetitorWins(competitorName: string) {
  const opportunities = await fetchOpportunities({
    ptype: "a",  // Award notices only
    postedFrom: "01/01/2024",
    postedTo: "12/31/2024"
  });
  
  const wins = opportunities.filter(opp => 
    opp.award?.awardee?.name
      .toLowerCase()
      .includes(competitorName.toLowerCase())
  );
  
  const totalValue = wins.reduce((sum, opp) => 
    sum + parseFloat(opp.award?.amount || "0"), 
    0
  );
  
  return {
    wins: wins.length,
    totalValue,
    opportunities: wins
  };
}
```

### Use Case 3: Market Research

**Goal**: Analyze opportunity trends by NAICS

```typescript
async function analyzeMarketTrends(naicsCode: string) {
  const opportunities = await fetchOpportunities({
    ncode: naicsCode,
    postedFrom: "01/01/2023",
    postedTo: "12/31/2024"
  });
  
  const byMonth = opportunities.reduce((acc, opp) => {
    const month = opp.postedDate.substring(0, 7);  // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const bySetAside = opportunities.reduce((acc, opp) => {
    const setAside = opp.typeOfSetAsideDescription || "Unrestricted";
    acc[setAside] = (acc[setAside] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return { byMonth, bySetAside, total: opportunities.length };
}
```

### Use Case 4: Deadline Monitoring

**Goal**: Track opportunities by days until deadline

```typescript
function categorizeByUrgency(opportunities: Opportunity[]) {
  const now = new Date();
  
  return opportunities.reduce((acc, opp) => {
    if (!opp.responseDeadLine) {
      acc.noDeadline.push(opp);
      return acc;
    }
    
    const deadline = new Date(opp.responseDeadLine);
    const daysUntil = Math.ceil(
      (deadline.getTime() - now.getTime()) / 86400000
    );
    
    if (daysUntil < 0) {
      acc.expired.push(opp);
    } else if (daysUntil <= 7) {
      acc.urgent.push(opp);
    } else if (daysUntil <= 30) {
      acc.soon.push(opp);
    } else {
      acc.later.push(opp);
    }
    
    return acc;
  }, {
    urgent: [] as Opportunity[],
    soon: [] as Opportunity[],
    later: [] as Opportunity[],
    expired: [] as Opportunity[],
    noDeadline: [] as Opportunity[]
  });
}
```

---

## Implementation Patterns

### Pattern 1: Robust API Client

```typescript
class SamGovClient {
  private baseUrl = "https://api.sam.gov/opportunities/v2";
  private apiKey: string;
  private rateLimiter: RateLimiter;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter();
  }
  
  async search(params: SearchParams): Promise<OpportunitiesResponse> {
    return this.rateLimiter.add(async () => {
      const url = this.buildUrl(params);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new SamGovError(response.status, await response.text());
      }
      
      return response.json();
    });
  }
  
  async searchAll(params: SearchParams): Promise<Opportunity[]> {
    const all: Opportunity[] = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await this.search({ ...params, offset, limit });
      all.push(...response.opportunitiesData);
      
      if (offset + limit >= response.totalRecords) break;
      offset += limit;
    }
    
    return all;
  }
  
  async getOpportunity(noticeId: string): Promise<Opportunity | null> {
    const response = await this.search({ noticeid: noticeId });
    return response.opportunitiesData[0] || null;
  }
  
  private buildUrl(params: SearchParams): string {
    const query = new URLSearchParams({
      api_key: this.apiKey,
      ...this.serializeParams(params)
    });
    return `${this.baseUrl}/search?${query}`;
  }
  
  private serializeParams(params: SearchParams): Record<string, string> {
    const serialized: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        serialized[key] = String(value);
      }
    }
    
    return serialized;
  }
}

class SamGovError extends Error {
  constructor(public status: number, public body: string) {
    super(`SAM.gov API Error ${status}: ${body}`);
  }
}
```

### Pattern 2: Type-Safe Parameter Builder

```typescript
class SearchParamsBuilder {
  private params: Partial<SearchParams> = {};
  
  dateRange(from: Date, to: Date): this {
    this.params.postedFrom = this.formatDate(from);
    this.params.postedTo = this.formatDate(to);
    return this;
  }
  
  naics(code: string): this {
    this.params.ncode = code;
    return this;
  }
  
  state(code: string): this {
    this.params.state = code.toUpperCase();
    return this;
  }
  
  setAside(code: string): this {
    this.params.typeOfSetAside = code;
    return this;
  }
  
  noticeTypes(...types: string[]): this {
    this.params.ptype = types.join(',');
    return this;
  }
  
  activeOnly(): this {
    // Note: Filter client-side, not an API param
    return this;
  }
  
  build(): SearchParams {
    if (!this.params.postedFrom || !this.params.postedTo) {
      throw new Error('Date range is required');
    }
    return this.params as SearchParams;
  }
  
  private formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
}

// Usage
const params = new SearchParamsBuilder()
  .dateRange(new Date('2024-01-01'), new Date('2024-12-31'))
  .naics('541511')
  .state('CA')
  .setAside('SBA')
  .noticeTypes('o', 'k')
  .build();
```

### Pattern 3: Incremental Sync

```typescript
class OpportunitySync {
  private db: Database;
  private client: SamGovClient;
  private lastSyncDate: Date;
  
  async sync() {
    const now = new Date();
    const from = this.lastSyncDate || new Date('2024-01-01');
    
    const opportunities = await this.client.searchAll({
      postedFrom: this.formatDate(from),
      postedTo: this.formatDate(now)
    });
    
    for (const opp of opportunities) {
      await this.upsertOpportunity(opp);
    }
    
    this.lastSyncDate = now;
    await this.saveLastSyncDate(now);
  }
  
  private async upsertOpportunity(opp: Opportunity) {
    const existing = await this.db.findByNoticeId(opp.noticeId);
    
    if (existing) {
      // Check if changed
      if (this.hasChanged(existing, opp)) {
        await this.db.update(opp.noticeId, opp);
        await this.notifySubscribers(opp, 'updated');
      }
    } else {
      await this.db.insert(opp);
      await this.notifySubscribers(opp, 'new');
    }
  }
  
  private hasChanged(old: Opportunity, new_: Opportunity): boolean {
    return JSON.stringify(old) !== JSON.stringify(new_);
  }
}
```

---

## Quick Reference

### Essential Query Templates

**Daily New Opportunities**
```
/v2/search?api_key=KEY&postedFrom=MM/DD/YYYY&postedTo=MM/DD/YYYY&limit=100&offset=0
```

**Active Solicitations**
```
/v2/search?api_key=KEY&ptype=o,k&postedFrom=01/01/2024&postedTo=12/31/2024&limit=100&offset=0
```

**Small Business Opportunities**
```
/v2/search?api_key=KEY&typeOfSetAside=SBA&postedFrom=01/01/2024&postedTo=12/31/2024&limit=100&offset=0
```

**Specific NAICS**
```
/v2/search?api_key=KEY&ncode=541511&postedFrom=01/01/2024&postedTo=12/31/2024&limit=100&offset=0
```

**By Notice ID**
```
/v2/search?api_key=KEY&noticeid=NOTICE_ID
```

### Key Gotchas Checklist

- [ ] Date format is `MM/DD/YYYY` (not ISO)
- [ ] `active` is string `"Yes"/"No"` (not boolean)
- [ ] `award.amount` is string (not number)
- [ ] `postedFrom`/`postedTo` always required with pagination
- [ ] Only latest version returned (no history)
- [ ] `description` can be `"null"` string
- [ ] Place of performance vs office address
- [ ] Rate limits (~1000/hour)
- [ ] Updates at 2 AM ET daily

---

## Resources

- **Official Docs**: https://open.gsa.gov/api/get-opportunities-public-api/
- **OpenAPI Spec**: https://open.gsa.gov/api/get-opportunities-public-api/v1/get-opportunities-v2.yml
- **SAM.gov**: https://sam.gov
- **NAICS Lookup**: https://www.naics.com/search/
- **PSC Lookup**: https://www.acquisition.gov/psc-manual
- **Support**: https://www.fsd.gov

---

## Changelog

**v2 (Current)**
- Added `fullParentPathName` and `fullParentPathCode`
- Improved response structure
- Better filtering capabilities

**v1 (Legacy)**
- Original implementation
- Deprecated fields: `department`, `subTier`, `office`

---

*This wiki is maintained as a living document. Last updated: 2024*
