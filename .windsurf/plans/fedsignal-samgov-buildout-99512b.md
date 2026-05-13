# FedSignal Platform Buildout Plan: SAM.gov Integration & Full CRUD Implementation

This plan outlines the complete buildout required to connect the FedSignal platform to Firebase for persistent storage and integrate all SAM.gov API endpoints with proper CRUD list/detail pages for every entity.

## Current State Assessment

### Firebase Integration
- **Status**: Partially implemented
- **Existing**: Firebase client initialized in `lib/firebase.ts` (auth, db, storage)
- **FedSignal Collections**: 18 collections defined in `lib/fedsignal/schema.ts` with TypeScript interfaces
- **Current Data Flow**: Pages use mock data arrays; only settings page has Firebase read/write
- **Gap**: No API routes exist for FedSignal collections; no Firestore CRUD operations implemented

### SAM.gov Integration
- **Status**: API routes exist but not integrated into pages
- **Existing Routes** (app/api/sam/):
  - `search/route.ts` - Opportunity search (POST)
  - `opportunity/[id]/route.ts` - Opportunity detail (GET)
  - `entities/route.ts` - Entity search v3/v4 (GET)
  - `exclusions/route.ts` - Exclusions search (GET)
  - `federal-hierarchy/route.ts` - Federal hierarchy (GET)
  - `assistance-listings/route.ts` - CFDA/grants (GET)
  - `wage-determinations/route.ts` - Wage determinations (GET)
  - `company-search/route.ts` - Company search from opportunity data (POST)
- **Gap**: These routes are not called from FedSignal pages; no data sync to Firebase; no detail pages for SAM.gov data

### Page Inventory
- **Total Pages**: 30+ pages in `app/(fedsignal)/fedsignal/`
- **With Firebase**: Only settings page
- **With Detail Pages**: Only grants (has [id] and new pages)
- **Missing Detail Pages**: Opportunities, Consortium, Directory, Contacts, Capabilities, Alerts, Proposals, Win/Loss, Calendar Events, Reports, University Registrations, Grant Reports, Grant Milestones, Grant Budgets

## Phase 1: Firebase API Routes (Backend)

### 1.1 Create FedSignal API Route Structure
```
app/api/fedsignal/
├── universities/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── opportunities/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── contacts/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── capabilities/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── consortiums/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── alerts/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── proposals/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── winloss/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── calendar-events/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── activities/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── reports/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── settings/
│   └── route.ts (GET, PUT) - Already exists
├── university-registrations/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── grants/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── grant-reports/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── grant-milestones/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
└── grant-budgets/
    ├── route.ts (GET, POST)
    └── [id]/route.ts (GET, PUT, DELETE)
```

### 1.2 Implement CRUD Pattern
Each route should follow this pattern:
- **GET /api/fedsignal/{collection}**: List with filters (universityId, status, date ranges, pagination)
- **POST /api/fedsignal/{collection}**: Create new document with validation using Zod
- **GET /api/fedsignal/{collection}/[id]**: Get single document by ID
- **PUT /api/fedsignal/{collection}/[id]**: Update document with validation
- **DELETE /api/fedsignal/{collection}/[id]**: Soft delete (set status to inactive) or hard delete

### 1.3 Create Shared Utilities
- `lib/fedsignal/db-helpers.ts`: Firestore query builders, pagination helpers, filter utilities
- `lib/fedsignal/validators.ts`: Zod schemas for each collection
- `lib/fedsignal/transformers.ts`: Transform SAM.gov API responses to Firestore documents

## Phase 2: SAM.gov Data Sync Integration

### 2.1 SAM.gov → Firestore Sync Routes
Create sync endpoints to pull SAM.gov data into Firestore:
```
app/api/fedsignal/sync/
├── opportunities/route.ts (POST)
├── entities/route.ts (POST)
├── exclusions/route.ts (POST)
└── assistance-listings/route.ts (POST)
```

**Sync Logic**:
1. Call SAM.gov API with filters (universityId, NAICS codes, set-asides)
2. Transform SAM.gov response to FedFire document format
3. Check if document exists in Firestore (by noticeId, UEI, etc.)
4. Update existing or create new document
5. Return sync summary (created, updated, skipped counts)

### 2.2 Transform SAM.gov → FedSignal
**Opportunity Mapping** (SamOpportunity → FSOpportunityDoc):
- `noticeId` → `id`
- `title` → `title`
- `fundingAgency` → `agency`
- `solicitationNumber` → `solicitationNumber`
- `typeOfSetAside` → determine `isHbcuSetAside`, `hbcuPreferred`
- `responseDeadLine` → `deadline` (Timestamp)
- `postedDate` → `postedDate` (Timestamp)
- `naicsCode` → add to tags/domains
- `description` → `description`
- `pointOfContact` → create Contact document if not exists
- `resourceLinks` → `attachments`
- `placeOfPerformance.state` → filter by university state

**Entity Mapping** (SAM Entity → FSContactDoc):
- `legalBusinessName` → `name`
- `ueiSAM` → store as identifier
- `cageCode` → store
- `physicalAddress` → address fields
- `pointOfContact` → contact info
- Link to university if matched by name/location

### 2.3 Scheduled Sync Jobs
Create API routes for scheduled sync:
```
app/api/fedsignal/sync/
├── schedule/route.ts (POST) - Create sync schedule
└── run/[id]/route.ts (POST) - Manual trigger
```

## Phase 3: Page CRUD Implementation

### 3.1 Priority 1: Core Entity Pages (List + Detail + Create/Edit)

**Universities** (`universities/`)
- Create list page with filters (state, type, research classification)
- Create detail page `/universities/[id]` with tabs:
  - Overview (basic info, GovCon score)
  - Capabilities (linked capabilities)
  - Contacts (linked contacts)
  - Opportunities (matched opportunities from SAM.gov)
  - Grants (awarded grants)
  - Consortiums (member consortiums)
- Create edit form with all fields from FSUniversityDoc

**Opportunities** (`opportunities/`)
- Update list page to fetch from `/api/fedsignal/opportunities`
- Add filters: agency, status, deadline range, HBCU set-aside, tags
- Create detail page `/opportunities/[id]`:
  - Full opportunity details
  - SAM.gov link
  - Save to favorites (link to user's saved opportunities)
  - Create proposal from opportunity
  - Related contacts
  - Match score by university
- Add "Import from SAM.gov" button to list page

**Grants** (`grants/`)
- Update list page to fetch from `/api/fedsignal/grants`
- Update detail page to fetch from `/api/fedsignal/grants/[id]`
- Update new page to POST to `/api/fedsignal/grants`
- Add sub-collection tabs:
  - Milestones (linked to grant)
  - Reports (linked to grant)
  - Budgets (linked to grant)
  - Documents (Firebase Storage)

**Contacts** (`contacts/`)
- Create list page with filters (type, university, organization)
- Create detail page `/contacts/[id]`
- Create new/edit form
- Link to opportunities and grants

**Consortiums** (`consortium/`)
- Update list page to fetch from Firestore
- Create detail page `/consortiums/[id]`:
  - Member universities (select from universities collection)
  - Target opportunities
  - Contact info
  - Performance metrics
- Create new/edit form

### 3.2 Priority 2: Supporting Entity Pages

**Capabilities** (`capabilities/`)
- Update list page to fetch from Firestore
- Create detail page `/capabilities/[id]`
- Link to universities with this capability

**Alerts** (`alerts/`)
- Update list page to fetch from Firestore
- Create detail page `/alerts/[id]`
- Target by university or domain
- Track views/clicks

**Proposals** (`proposals/`)
- Create list page
- Create detail page `/proposals/[id]`
- Link to opportunity and university
- Track status workflow

**Win/Loss** (`winloss/`)
- Create list page
- Create detail page `/winloss/[id]`
- Analysis fields (reasons, lessons learned)

**Calendar Events** (`calendar/`)
- Update calendar to fetch from Firestore
- Create detail page `/calendar/[id]`
- Link to opportunities, grants, consortiums

**Reports** (`reports/`)
- Create list page
- Create detail page `/reports/[id]`
- Generate from aggregated data

**University Registrations** (`register/`)
- Update registration form to POST to `/api/fedsignal/university-registrations`
- Add approval workflow
- On approval, create University document

### 3.3 Priority 3: Grant Sub-entities

**Grant Reports** (`grants/[id]/reports/`)
- Create list page (sub-page of grant detail)
- Create detail page `/grant-reports/[id]`
- Upload attachments to Firebase Storage

**Grant Milestones** (`grants/[id]/milestones/`)
- Create list page (sub-page of grant detail)
- Create detail page `/grant-milestones/[id]`
- Track progress percentage

**Grant Budgets** (`grants/[id]/budgets/`)
- Create list page (sub-page of grant detail)
- Create detail page `/grant-budgets/[id]`
- Track actual vs budgeted

## Phase 4: SAM.gov Integration Pages

### 4.1 SAM.gov Tester Page
- Already exists at `/portal/admin/sam-gov/tester`
- Add "Sync to Firestore" buttons for each endpoint
- Show sync results (created, updated, skipped counts)

### 4.2 SAM.gov Data Dashboard
Create new page `/fedsignal/sam-dashboard`:
- Show last sync time
- Show counts: opportunities, entities, exclusions in Firestore
- Show sync status per endpoint
- Manual sync triggers
- Sync schedule configuration

### 4.3 Opportunity Import Wizard
Create `/fedsignal/opportunities/import`:
- Step 1: Select filters (agency, NAICS, state, set-aside)
- Step 2: Preview results from SAM.gov
- Step 3: Select opportunities to import
- Step 4: Map to universities (auto-match by state/capability)
- Step 5: Confirm and sync to Firestore

### 4.4 Entity/Contact Import
Create `/fedsignal/contacts/import`:
- Search SAM.gov entities by name, CAGE, UEI
- Preview results
- Select to import as contacts
- Link to universities

## Phase 5: Firebase Storage Integration

### 5.1 Document Upload Routes
```
app/api/fedsignal/upload/
├── document/route.ts (POST) - Upload to Firebase Storage, return URL
└── grant-attachment/route.ts (POST) - Upload grant-specific documents
```

### 5.2 Document Management
- Add upload components to grant detail, proposal pages
- Store file metadata in Firestore
- Generate download URLs with signed URLs
- Implement file deletion

## Phase 6: Data Relationships & Indexing

### 6.1 Firestore Indexes
Create composite indexes for common queries:
- Opportunities: status + deadline + universityId
- Grants: status + universityId + startDate
- Contacts: type + universityId
- Activities: userId + entityType + timestamp

### 6.2 Relationship Helpers
Create functions to fetch related entities:
- Get opportunities by university
- Get grants by university
- Get contacts by university
- Get consortiums by university member

## Phase 7: Authentication & Authorization

### 7.1 Role-Based Access
- Admin: Full CRUD on all collections
- University Admin: CRUD on their university's data
- User: Read-only, can create activities/notes

### 7.2 API Route Guards
Add authentication checks to all API routes:
```typescript
if (!auth.currentUser) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Implementation Order (3-Week Accelerated Timeline)

### Week 1: Foundation + Core CRUD
**Days 1-3**: Firebase API Routes (Phase 1 - Core Collections Only)
- Implement CRUD routes for: universities, opportunities, grants, contacts
- Create shared utilities (db-helpers, validators, transformers)
- Set up Firestore security rules basics

**Days 4-5**: SAM.gov Sync (Phase 2 - Critical Sync Only)
- Transform SAM.gov opportunities → Firestore
- Transform SAM.gov entities → contacts
- Implement sync routes for opportunities and entities only
- Test with real SAM.gov data

**Days 6-7**: Core Pages (Phase 3.1 - Essentials)
- Universities: list + detail + edit
- Opportunities: list + detail + import from SAM.gov
- Grants: update existing pages to use Firestore
- Contacts: list + detail + create/edit

### Week 2: Supporting Entities + SAM.gov Integration
**Days 8-9**: Supporting Pages (Phase 3.2 - High Priority)
- Consortiums: list + detail + create/edit
- Capabilities: list + detail
- Alerts: list + create
- Proposals: list + detail (link to opportunity)

**Days 10-11**: SAM.gov Integration Pages (Phase 4)
- SAM.gov Dashboard: sync status, manual triggers
- Opportunity Import Wizard: filters, preview, sync
- Entity/Contact Import Wizard

**Days 12-14**: Grant Sub-entities + Storage (Phase 3.3 + 5)
- Grant Reports: list + detail + upload
- Grant Milestones: list + detail (sub-pages of grant)
- Firebase Storage: document upload/download for attachments

### Week 3: Remaining Pages + Polish
**Days 15-16**: Remaining Pages (Phase 3.2 - Lower Priority)
- Win/Loss: list + detail
- Calendar Events: update to use Firestore
- Reports: basic list page (defer complex generation)
- University Registrations: update form to use Firestore

**Days 17-18**: Indexing + Auth (Phases 6-7)
- Create Firestore composite indexes for core queries
- Implement basic role-based access (admin vs user)
- Add authentication guards to API routes

**Days 19-21**: Testing + Polish
- End-to-end testing of core flows
- Error handling improvements
- Performance optimization
- Documentation

## Deferred to Future Iterations (Post-3-Week)
The following will be stubbed out with mock data or simplified implementations:
- Grant Budgets (complex budget tracking)
- Full Report Generation (use simple aggregation initially)
- Activities audit trail (basic logging only)
- Advanced sync scheduling (manual sync only)
- University Registrations approval workflow (auto-approve initially)
- Complex consortium workspace (basic CRUD only)

## Critical Dependencies

1. **Firebase Configuration**: Ensure Firebase project is configured with correct rules
2. **SAM.gov API Key**: Required for Entity, Exclusions, Assistance Listings endpoints
3. **Firestore Security Rules**: Implement rules to enforce role-based access
4. **Environment Variables**: Set up for Firebase and SAM.gov API keys

## Risk Mitigation

1. **API Rate Limits**: Implement caching and rate limiting for SAM.gov calls
2. **Data Volume**: Use pagination for large collections; implement lazy loading
3. **Sync Conflicts**: Implement conflict resolution (last-write-wins or versioning)
4. **Data Validation**: Use Zod schemas to validate all incoming data
5. **Error Handling**: Comprehensive error handling with user-friendly messages
