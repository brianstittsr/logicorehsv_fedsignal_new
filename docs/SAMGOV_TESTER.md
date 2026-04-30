# SAM.gov API Tester

## Overview

The SAM.gov API Tester is a comprehensive testing and development tool integrated into the FedSignal Settings section. It allows you to test SAM.gov API connectivity, perform structured searches, and experiment with natural language queries powered by various LLM providers.

## Location

**Settings > SAM.gov Tester**

Or directly at: `/fedsignal/settings/samgov-tester`

## Features

### 1. API Connection Testing

Test your SAM.gov API key before using it in production:

- **Instant validation** - Verify API key is valid and active
- **Connection diagnostics** - Get detailed error messages if connection fails
- **Rate limit checking** - Ensure your API key has available quota

**How to use:**
1. Enter your SAM.gov API key
2. Click "Test Connection"
3. View connection status and available opportunities count

### 2. Structured Search Interface

Replicates the SAM.gov search interface with advanced filtering:

**Basic Search:**
- Keyword search with match types:
  - **All Words** - Results must contain all keywords
  - **Any Word** - Results contain at least one keyword
  - **Exact Phrase** - Results match exact phrase

**Advanced Filters:**
- **NAICS Code** - Industry classification (e.g., 541511 for software development)
- **PSC Code** - Product/Service code (e.g., D301 for IT)
- **State** - Place of performance (2-letter code)
- **Set-Aside Type** - Small Business, 8(a), HUBZone, SDVOSB, WOSB
- **Notice Type** - Solicitation, Presolicitation, Combined, Sources Sought
- **Status** - Active or Inactive opportunities

### 3. Natural Language Search with LLM

Transform plain English queries into structured SAM.gov searches using AI:

**Supported LLM Providers:**

#### OpenAI
- **Models**: GPT-4, GPT-4-Turbo, GPT-3.5-Turbo
- **Setup**: Enter OpenAI API key
- **Best for**: High-quality interpretation, complex queries

#### Anthropic Claude
- **Models**: Claude-3 Opus, Sonnet, Haiku
- **Setup**: Enter Anthropic API key
- **Best for**: Detailed analysis, nuanced understanding

#### Ollama (Local)
- **Models**: Llama 2, Llama 3, Mistral, Mixtral
- **Setup**: Install Ollama locally, set base URL (default: http://localhost:11434)
- **Best for**: Privacy, no API costs, offline use

#### LM Studio (Local)
- **Models**: Any GGUF model loaded in LM Studio
- **Setup**: Run LM Studio server, set base URL (default: http://localhost:1234/v1)
- **Best for**: Custom models, local deployment

#### OpenAI-Compatible
- **Models**: Any OpenAI-compatible endpoint
- **Setup**: Enter base URL and optional API key
- **Best for**: Custom deployments, alternative providers

**Example Natural Language Queries:**
- "Find software development contracts in California for small businesses"
- "Show me research opportunities at universities with NAICS 541715"
- "Active solicitations for IT services in Virginia closing within 30 days"
- "8(a) set-aside opportunities for cybersecurity"

**How it works:**
1. Enter natural language query
2. LLM interprets and extracts:
   - Keywords
   - NAICS/PSC codes
   - Geographic filters
   - Set-aside types
   - Notice types
3. Executes structured search with interpreted parameters
4. Shows LLM interpretation for transparency

## Configuration

### SAM.gov API Key

Get your free API key:
1. Visit [sam.gov](https://sam.gov)
2. Create account or log in
3. Navigate to Account Details
4. Generate Public API Key
5. Copy and paste into tester

### LLM Configuration

#### For Cloud Providers (OpenAI, Claude):
1. Select provider
2. Choose model
3. Enter API key
4. Test connection

#### For Local Providers (Ollama, LM Studio):
1. Install and run local LLM server
2. Select provider
3. Enter base URL
4. Choose model name
5. Test connection (no API key needed)

## Search Results

Results display:
- **Opportunity title** and solicitation number
- **Organization hierarchy** (Department > Sub-tier > Office)
- **Status** (Active/Inactive badge)
- **Classification codes** (NAICS, PSC)
- **Posted date**
- **Actions**:
  - View Details (opens FedSignal detail page)
  - SAM.gov (opens official SAM.gov listing)

## Use Cases

### 1. API Key Validation
Before deploying to production, validate your SAM.gov API key works correctly.

### 2. Search Development
Experiment with different search parameters to understand what works best for your use case.

### 3. LLM Testing
Compare different LLM providers to see which gives best query interpretation for your needs.

### 4. Training & Demos
Show stakeholders how natural language search works without affecting production systems.

### 5. Debugging
Isolate search issues by testing queries in a controlled environment.

## Technical Details

### API Endpoints Used

**Test Connection:**
```
GET /api/samgov/test-connection?api_key=KEY&postedFrom=DATE&postedTo=DATE
```

**Interpret Query (LLM):**
```
POST /api/samgov/interpret-query
Body: { query: string, llmConfig: LLMConfig }
```

**Search:**
```
POST /api/samgov/search
Body: { filters: SearchFilters, limit: number, offset: number, apiKey: string }
```

### LLM Prompt Engineering

The system uses a carefully crafted prompt to extract structured parameters:

```
System: You are a SAM.gov search assistant. Convert natural language queries 
into structured search parameters.

Available parameters:
- keyword: Main search terms
- naics: NAICS code (6 digits)
- psc: PSC code
- state: 2-letter state code
- typeOfSetAside: Set-aside codes
- noticeType: Notice type codes

Respond with JSON containing extracted parameters and interpretation.
```

### Error Handling

**Connection Errors:**
- Invalid API key → Clear error message with instructions
- Network issues → Retry suggestion
- Rate limits → Quota information

**Search Errors:**
- No results → Suggestions to broaden search
- Invalid parameters → Parameter validation feedback
- LLM failures → Fallback to keyword search

## Best Practices

### API Key Management
- ✅ Test with your actual API key before production
- ✅ Store API key in environment variables for production
- ✅ Monitor rate limits
- ❌ Don't commit API keys to version control

### Search Optimization
- ✅ Start with broad searches, then refine
- ✅ Use NAICS codes for industry-specific searches
- ✅ Combine multiple filters for precision
- ✅ Check "Active Only" to filter out expired opportunities

### LLM Selection
- **OpenAI GPT-4**: Best accuracy, higher cost
- **Claude Opus**: Great for complex queries, moderate cost
- **Ollama/LM Studio**: Free, private, good for simple queries
- **GPT-3.5**: Fast, cheap, good for straightforward queries

### Natural Language Queries
- ✅ Be specific: "software development in California"
- ✅ Include relevant codes if known: "NAICS 541511"
- ✅ Specify set-asides: "for small businesses"
- ❌ Avoid vague queries: "find contracts"

## Troubleshooting

### "Connection failed: 401 Unauthorized"
- Check API key is correct
- Verify API key is active on SAM.gov
- Regenerate API key if needed

### "No results found"
- Try broader search terms
- Remove some filters
- Check date range (default: last 6 months)
- Verify opportunities exist on SAM.gov directly

### "LLM interpretation failed"
- Check LLM API key is valid
- Verify LLM service is running (for local)
- Try different LLM provider
- Fallback to structured search

### Slow performance
- Reduce result limit
- Use more specific filters
- Check SAM.gov API status
- Verify LLM service response time

## Keyboard Shortcuts

- **Enter** in search box → Execute search
- **Escape** → Clear search results

## Future Enhancements

Planned features:
- [ ] Save search configurations
- [ ] Export results to CSV/Excel
- [ ] Search history
- [ ] Favorite searches
- [ ] Batch testing multiple API keys
- [ ] Performance benchmarking
- [ ] LLM response comparison
- [ ] Advanced analytics on search patterns

## Related Documentation

- [SAM.gov API Wiki](./SAMGOV_API_WIKI.md) - Complete API reference
- [SAM.gov Integration Guide](./SAMGOV_INTEGRATION.md) - Production integration
- [Migration Prompt](./MIGRATION_PROMPT.md) - Original implementation guide

## Support

For issues or questions:
1. Check [SAM.gov API Status](https://status.sam.gov)
2. Review [SAM.gov API Documentation](https://open.gsa.gov/api/get-opportunities-public-api/)
3. Test with different LLM providers
4. Contact your system administrator
