# SAM.gov Opportunity Search Integration

## Overview

The SAM.gov Opportunity Search Agent provides AI-powered natural language search for federal contract opportunities directly integrated into the FedSignal platform.

## Features

### Core Capabilities
- **Natural Language Search** - Search using plain English queries like "software development opportunities in California"
- **Advanced Filters** - Filter by NAICS code, PSC code, Set-Aside type, Notice Type, State, Status, and date ranges
- **AI Recommendations** - Intelligent analysis of search results with actionable insights
- **Paginated Results** - Client-side pagination with configurable page sizes (10, 25, 50, 100)
- **Opportunity Details** - Comprehensive detail view with descriptions, contacts, attachments, and deadlines
- **Deadline Tracking** - Visual indicators for urgent opportunities with approaching deadlines

### Search Filters

**Classification Codes:**
- NAICS Code (e.g., 541511 for Custom Computer Programming)
- PSC Code (e.g., D301 for IT and Telecom)

**Set-Aside Types:**
- Small Business (SBA)
- 8(a) Business Development
- HUBZone
- Service-Disabled Veteran-Owned (SDVOSB)
- Women-Owned Small Business (WOSB)

**Notice Types:**
- Solicitation (o)
- Presolicitation (p)
- Combined Synopsis/Solicitation (k)
- Sources Sought (r)

**Other Filters:**
- State (2-letter code)
- Active/Inactive status
- Response deadline date range
- Posted date range

## Setup

### 1. Get SAM.gov API Key

1. Visit [SAM.gov](https://sam.gov)
2. Create a free account or log in
3. Navigate to Account Details
4. Request a Public API Key (free, instant approval)
5. Copy your API key

### 2. Configure Environment Variables

Add to your `.env.local` file:

```env
# SAM.gov API Key
SAM_API_KEY=your_sam_gov_api_key_here
```

### 3. Access the Feature

Navigate to **Intelligence > SAM.gov Search** in the FedSignal sidebar.

## Usage

### Basic Search

1. Enter a natural language query in the search box:
   - "software development contracts"
   - "research opportunities for universities"
   - "IT services in Virginia"

2. Click **Search** or press Enter

3. View AI-generated recommendations and results

### Advanced Search

1. Click the **Filters** button to expand advanced options
2. Set specific criteria:
   - NAICS Code: `541511` (Custom Computer Programming)
   - PSC Code: `D301` (IT and Telecom)
   - State: `CA` (California)
   - Set-Aside: `SBA` (Small Business)
   - Status: Active Only

3. Search with your query and filters combined

### View Opportunity Details

1. Click **View Details** on any opportunity
2. Review comprehensive information:
   - Full description
   - Key dates and deadlines
   - Organization hierarchy
   - Classification codes
   - Points of contact
   - Attachments and resources
   - Place of performance
   - Award information (if applicable)

3. Click **View on SAM.gov** to open the official listing

## API Endpoints

### Search Opportunities
```
POST /api/samgov/search
```

**Request Body:**
```json
{
  "filters": {
    "naics": "541511",
    "psc": "D301",
    "state": "CA",
    "active": "true",
    "typeOfSetAside": "SBA",
    "noticeType": "o",
    "responseDeadlineFrom": "2024-01-01",
    "responseDeadlineTo": "2024-12-31"
  },
  "limit": 25,
  "offset": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "totalRecords": 150,
  "limit": 25,
  "offset": 0,
  "hasMore": true
}
```

### AI Agent Search
```
POST /api/samgov/agent
```

**Request Body:**
```json
{
  "query": "software development opportunities",
  "filters": {
    "active": "true",
    "state": "CA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "query": "software development opportunities",
  "searchResults": [...],
  "totalRecords": 150,
  "recommendation": "Found 150 opportunities matching...",
  "filters": {...}
}
```

### Get Opportunity Details
```
GET /api/samgov/opportunity/[noticeId]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "noticeId": "abc123",
    "title": "Software Development Services",
    "description": "...",
    "pointOfContact": [...],
    "resourceLinks": [...],
    ...
  }
}
```

## Architecture

### Components

**Backend:**
- `lib/sam-api-client.ts` - SAM.gov API client with search, details, and resources methods
- `app/api/samgov/search/route.ts` - Direct search endpoint
- `app/api/samgov/agent/route.ts` - AI-powered natural language search
- `app/api/samgov/opportunity/[id]/route.ts` - Opportunity details endpoint

**Frontend:**
- `app/(fedsignal)/fedsignal/samgov/page.tsx` - Main search interface
- `app/(fedsignal)/fedsignal/samgov/[id]/page.tsx` - Opportunity detail view

**Navigation:**
- `components/fedsignal/fs-sidebar.tsx` - Sidebar navigation with SAM.gov link

### SAM.gov API Endpoints Used

- **Search:** `https://api.sam.gov/opportunities/v2/search`
- **Details:** `https://api.sam.gov/opportunities/v2/search?noticeid={id}`
- **Resources:** `https://sam.gov/api/prod/opps/v3/opportunities/{id}/resources`
- **UI Link:** `https://sam.gov/opp/{noticeId}/view`

## Data Models

### Opportunity Object
```typescript
interface Opportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  active: boolean;
  type: string;
  organizationHierarchy: string;
  postedDate: string;
  responseDeadLine?: string;
  naicsCode?: string;
  classificationCode?: string;
  typeOfSetAsideDescription?: string;
  description?: string;
  pointOfContact?: any[];
  resourceLinks?: any[];
  uiLink: string;
  placeOfPerformance?: any;
  award?: any;
}
```

## Best Practices

### Search Tips

1. **Be Specific:** Use industry-specific terms and keywords
2. **Use Filters:** Combine natural language with filters for best results
3. **Check Deadlines:** Sort by response deadline to prioritize urgent opportunities
4. **Review Set-Asides:** Filter by relevant set-aside categories for your organization
5. **Monitor Regularly:** Check daily for new opportunities in your areas of interest

### Performance

- Results are paginated for optimal performance
- API calls are cached where appropriate
- Client-side pagination reduces server load
- Deadline calculations are performed client-side

## Troubleshooting

### Common Issues

**"SAM_API_KEY environment variable is not set"**
- Ensure you've added `SAM_API_KEY` to your `.env.local` file
- Restart your development server after adding environment variables

**"Failed to search opportunities"**
- Verify your API key is valid and active
- Check SAM.gov API status at https://sam.gov
- Review API rate limits (typically 1000 requests/hour for free tier)

**No results found**
- Try broader search terms
- Remove or adjust filters
- Check if opportunities exist for your criteria on SAM.gov directly

**Slow search performance**
- Reduce the number of results per page
- Use more specific filters to narrow results
- Check your internet connection

## Rate Limits

SAM.gov API free tier limits:
- **Requests:** 1000 per hour
- **Daily:** 10,000 requests
- **Concurrent:** 5 simultaneous requests

For higher limits, contact SAM.gov for enterprise access.

## Future Enhancements

Planned features:
- [ ] Excel export of search results
- [ ] Saved searches and alerts
- [ ] Email notifications for new opportunities
- [ ] Opportunity tracking and notes
- [ ] Integration with Proposal Pal for direct proposal creation
- [ ] Advanced AI analysis with OpenAI/Anthropic integration
- [ ] Historical opportunity analysis and trends

## Support

For issues or questions:
1. Check the [SAM.gov API Documentation](https://open.gsa.gov/api/opportunities-api/)
2. Review this integration guide
3. Contact your system administrator

## References

- [SAM.gov Official Site](https://sam.gov)
- [SAM.gov API Documentation](https://open.gsa.gov/api/opportunities-api/)
- [NAICS Code Lookup](https://www.naics.com/search/)
- [PSC Code Lookup](https://www.acquisition.gov/psc-manual)
- [Source Repository](https://github.com/brianstittsr/CGray_samgovapiserver.git)
