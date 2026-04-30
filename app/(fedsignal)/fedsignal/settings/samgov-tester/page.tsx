"use client";

import { useState } from "react";
import { Search, Settings, Sparkles, CheckCircle, XCircle, Loader2, ExternalLink, Filter, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface LLMConfig {
  provider: "claude" | "openai" | "ollama" | "lmstudio" | "openai-compatible";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

interface SearchFilters {
  keyword?: string;
  keywordRadio?: "ALL" | "ANY" | "EXACT";
  isActive?: boolean;
  naics?: string;
  psc?: string;
  typeOfSetAside?: string;
  noticeType?: string;
  state?: string;
  responseDeadlineFrom?: string;
  responseDeadlineTo?: string;
  postedFrom?: string;
  postedTo?: string;
}

export default function SamGovTesterPage() {
  const [useProxy, setUseProxy] = useState(true);
  const [samApiKey, setSamApiKey] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");
  
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: "openai",
    apiKey: "",
    model: "gpt-4",
  });
  
  const [searchMode, setSearchMode] = useState<"structured" | "natural">("structured");
  const [naturalQuery, setNaturalQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    keywordRadio: "ALL",
    isActive: true,
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [llmInterpretation, setLlmInterpretation] = useState("");

  const testConnection = async () => {
    if (!useProxy && !samApiKey) {
      setConnectionMessage("Please enter a SAM.gov API key or enable proxy mode");
      setConnectionStatus("error");
      return;
    }

    setConnectionStatus("testing");
    setConnectionMessage(useProxy ? "Testing proxy connection to SAM.gov..." : "Testing connection to SAM.gov...");

    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const url = useProxy
        ? `/api/samgov/test-connection?` +
          `postedFrom=${formatDate(yesterday)}&` +
          `postedTo=${formatDate(today)}&` +
          `limit=1&offset=0`
        : `/api/samgov/test-connection?api_key=${samApiKey}&` +
          `postedFrom=${formatDate(yesterday)}&` +
          `postedTo=${formatDate(today)}&` +
          `limit=1&offset=0`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setConnectionStatus("success");
        setConnectionMessage(
          useProxy
            ? `✓ Proxy connected successfully! Found ${data.totalRecords || 0} opportunities.`
            : `✓ Connected successfully! Found ${data.totalRecords || 0} opportunities.`
        );
      } else {
        setConnectionStatus("error");
        setConnectionMessage(`✗ Connection failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage(`✗ Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleSearch = async () => {
    if (searchMode === "natural" && !naturalQuery.trim()) {
      return;
    }

    setSearching(true);
    setSearchResults([]);
    setLlmInterpretation("");

    try {
      if (searchMode === "natural") {
        // Use LLM to interpret natural language query
        const interpretResponse = await fetch("/api/samgov/interpret-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: naturalQuery,
            llmConfig,
          }),
        });

        const interpretData = await interpretResponse.json();
        
        if (interpretData.success) {
          setLlmInterpretation(interpretData.interpretation);
          setFilters(interpretData.filters);
          
          // Execute search with interpreted filters
          await executeSearch(interpretData.filters);
        } else {
          console.error("LLM interpretation failed:", interpretData.error);
          // Fallback to keyword search
          await executeSearch({ keyword: naturalQuery });
        }
      } else {
        // Direct structured search
        await executeSearch(filters);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const executeSearch = async (searchFilters: SearchFilters) => {
    // Add default date range if not provided
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const filtersWithDates = {
      ...searchFilters,
      postedFrom: searchFilters.postedFrom || formatDate(sixMonthsAgo),
      postedTo: searchFilters.postedTo || formatDate(today),
    };
    
    const response = await fetch("/api/samgov/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filters: filtersWithDates,
        limit: 25,
        offset: 0,
        apiKey: useProxy ? undefined : samApiKey,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setSearchResults(data.data || []);
      setTotalRecords(data.totalRecords || 0);
    }
  };

  const formatDate = (date: Date): string => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">SAM.gov API Tester</h1>
              <p className="text-sm text-slate-600">Test your SAM.gov connection and search capabilities</p>
            </div>
          </div>
        </div>

        {/* Connection Test */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">1. API Connection Test</h2>
          
          <div className="space-y-4">
            {/* Proxy Mode Toggle */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="useProxy"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <label htmlFor="useProxy" className="flex-1 text-sm text-blue-900">
                <strong>Use Proxy Mode</strong> - Search without entering an API key (uses server-side environment variable)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SAM.gov API Key {useProxy && <span className="text-xs text-slate-500">(Optional in proxy mode)</span>}
              </label>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={samApiKey}
                  onChange={(e) => setSamApiKey(e.target.value)}
                  placeholder={useProxy ? "Optional - using proxy" : "Enter your SAM.gov API key"}
                  disabled={useProxy}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                />
                <button
                  onClick={testConnection}
                  disabled={connectionStatus === "testing"}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {connectionStatus === "testing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Test Connection
                    </>
                  )}
                </button>
              </div>
            </div>

            {connectionStatus !== "idle" && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  connectionStatus === "success"
                    ? "bg-green-50 border border-green-200"
                    : connectionStatus === "error"
                    ? "bg-red-50 border border-red-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                {connectionStatus === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {connectionStatus === "error" && <XCircle className="w-5 h-5 text-red-600" />}
                {connectionStatus === "testing" && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                <span
                  className={`text-sm font-medium ${
                    connectionStatus === "success"
                      ? "text-green-800"
                      : connectionStatus === "error"
                      ? "text-red-800"
                      : "text-blue-800"
                  }`}
                >
                  {connectionMessage}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LLM Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">2. LLM Configuration (Optional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Provider</label>
              <select
                value={llmConfig.provider}
                onChange={(e) =>
                  setLlmConfig((prev) => ({
                    ...prev,
                    provider: e.target.value as LLMConfig["provider"],
                  }))
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="openai">OpenAI</option>
                <option value="claude">Anthropic Claude</option>
                <option value="ollama">Ollama (Local)</option>
                <option value="lmstudio">LM Studio (Local)</option>
                <option value="openai-compatible">OpenAI Compatible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
              <input
                type="text"
                value={llmConfig.model}
                onChange={(e) => setLlmConfig((prev) => ({ ...prev, model: e.target.value }))}
                placeholder={
                  llmConfig.provider === "openai"
                    ? "gpt-4"
                    : llmConfig.provider === "claude"
                    ? "claude-3-opus-20240229"
                    : llmConfig.provider === "ollama"
                    ? "llama2"
                    : "model-name"
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {llmConfig.provider !== "ollama" && llmConfig.provider !== "lmstudio" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={llmConfig.apiKey}
                  onChange={(e) => setLlmConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {(llmConfig.provider === "ollama" ||
              llmConfig.provider === "lmstudio" ||
              llmConfig.provider === "openai-compatible") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
                <input
                  type="text"
                  value={llmConfig.baseUrl}
                  onChange={(e) => setLlmConfig((prev) => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder={
                    llmConfig.provider === "ollama"
                      ? "http://localhost:11434"
                      : llmConfig.provider === "lmstudio"
                      ? "http://localhost:1234/v1"
                      : "https://api.example.com/v1"
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Search Interface</h2>

          {/* Search Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSearchMode("structured")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === "structured"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Structured Search
            </button>
            <button
              onClick={() => setSearchMode("natural")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                searchMode === "natural"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Natural Language
            </button>
          </div>

          {/* Natural Language Search */}
          {searchMode === "natural" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Natural Language Query
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g., Find software development contracts in California for small businesses"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || (!useProxy && !samApiKey)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Search
                    </>
                  )}
                </button>
              </div>
              {llmInterpretation && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>LLM Interpretation:</strong> {llmInterpretation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Structured Search */}
          {searchMode === "structured" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Keyword</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={filters.keyword || ""}
                    onChange={(e) => handleFilterChange("keyword", e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter search keywords"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={filters.keywordRadio}
                    onChange={(e) => handleFilterChange("keywordRadio", e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Words</option>
                    <option value="ANY">Any Word</option>
                    <option value="EXACT">Exact Phrase</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    disabled={searching || (!useProxy && !samApiKey)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {searching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NAICS Code</label>
                    <input
                      type="text"
                      value={filters.naics || ""}
                      onChange={(e) => handleFilterChange("naics", e.target.value)}
                      placeholder="e.g., 541511"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PSC Code</label>
                    <input
                      type="text"
                      value={filters.psc || ""}
                      onChange={(e) => handleFilterChange("psc", e.target.value)}
                      placeholder="e.g., D301"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={filters.state || ""}
                      onChange={(e) => handleFilterChange("state", e.target.value)}
                      placeholder="e.g., CA"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Set-Aside Type</label>
                    <select
                      value={filters.typeOfSetAside || ""}
                      onChange={(e) => handleFilterChange("typeOfSetAside", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="SBA">Small Business</option>
                      <option value="8A">8(a)</option>
                      <option value="HUBZone">HUBZone</option>
                      <option value="SDVOSBC">SDVOSB</option>
                      <option value="WOSB">WOSB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notice Type</label>
                    <select
                      value={filters.noticeType || ""}
                      onChange={(e) => handleFilterChange("noticeType", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="o">Solicitation</option>
                      <option value="p">Presolicitation</option>
                      <option value="k">Combined Synopsis/Solicitation</option>
                      <option value="r">Sources Sought</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={filters.isActive ? "true" : "false"}
                      onChange={(e) => handleFilterChange("isActive", e.target.value === "true")}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="true">Active Only</option>
                      <option value="false">Inactive Only</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Search Results ({totalRecords} total)
            </h2>
            <div className="space-y-4">
              {searchResults.map((opp) => (
                <div
                  key={opp.noticeId}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">{opp.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <span>Sol #: {opp.solicitationNumber}</span>
                        <span>{opp.organizationHierarchy}</span>
                        {opp.active && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        {opp.naicsCode && <span>NAICS: {opp.naicsCode}</span>}
                        {opp.classificationCode && <span>PSC: {opp.classificationCode}</span>}
                        {opp.postedDate && <span>Posted: {new Date(opp.postedDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/fedsignal/samgov/${opp.noticeId}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium text-center"
                      >
                        View Details
                      </Link>
                      {opp.uiLink && (
                        <a
                          href={opp.uiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium text-center flex items-center gap-2"
                        >
                          SAM.gov
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searching && searchResults.length === 0 && connectionStatus === "success" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Search</h3>
            <p className="text-slate-600">
              Use the search interface above to find federal contract opportunities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
