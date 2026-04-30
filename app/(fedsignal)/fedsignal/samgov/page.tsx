"use client";

import { useState } from "react";
import { Search, Filter, Download, ExternalLink, Calendar, Building2, FileText, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";

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
  uiLink: string;
}

interface SearchFilters {
  naics?: string;
  psc?: string;
  typeOfSetAside?: string;
  noticeType?: string;
  state?: string;
  active?: string;
  responseDeadlineFrom?: string;
  responseDeadlineTo?: string;
  postedFrom?: string;
  postedTo?: string;
}

export default function SamGovSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [recommendation, setRecommendation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  const [filters, setFilters] = useState<SearchFilters>({
    active: "true",
  });

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/samgov/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filters }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.searchResults || []);
        setTotalRecords(data.totalRecords || 0);
        setRecommendation(data.recommendation || "");
        setCurrentPage(1);
      } else {
        console.error("Search failed:", data.error);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const days = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">SAM.gov Opportunity Search</h1>
              <p className="text-sm text-slate-600">AI-powered federal contract opportunity discovery</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for opportunities using natural language (e.g., 'software development contracts in California')"
                className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Sparkles className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Searching..." : "Search"}
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NAICS Code</label>
                <input
                  type="text"
                  value={filters.naics || ""}
                  onChange={(e) => handleFilterChange("naics", e.target.value)}
                  placeholder="e.g., 541511"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PSC Code</label>
                <input
                  type="text"
                  value={filters.psc || ""}
                  onChange={(e) => handleFilterChange("psc", e.target.value)}
                  placeholder="e.g., D301"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={filters.state || ""}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                  placeholder="e.g., CA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Set-Aside Type</label>
                <select
                  value={filters.typeOfSetAside || ""}
                  onChange={(e) => handleFilterChange("typeOfSetAside", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={filters.active || "true"}
                  onChange={(e) => handleFilterChange("active", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                  <option value="">All</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendation */}
        {recommendation && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">AI Recommendation</h3>
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, results.length)} of {totalRecords} opportunities
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Per page:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="space-y-4">
          {paginatedResults.map((opp) => {
            const daysUntil = getDaysUntilDeadline(opp.responseDeadLine);
            const isUrgent = daysUntil !== null && daysUntil <= 7 && daysUntil > 0;
            
            return (
              <div key={opp.noticeId} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{opp.title}</h3>
                      {opp.active && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Active
                        </span>
                      )}
                      {isUrgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {opp.solicitationNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {opp.organizationHierarchy}
                      </span>
                      {opp.typeOfSetAsideDescription && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {opp.typeOfSetAsideDescription}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted: {formatDate(opp.postedDate)}
                      </span>
                      {opp.responseDeadLine && (
                        <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-600 font-medium' : ''}`}>
                          <Calendar className="w-4 h-4" />
                          Deadline: {formatDate(opp.responseDeadLine)}
                          {daysUntil !== null && daysUntil > 0 && (
                            <span className="ml-1">({daysUntil} days)</span>
                          )}
                        </span>
                      )}
                      {opp.naicsCode && (
                        <span>NAICS: {opp.naicsCode}</span>
                      )}
                      {opp.classificationCode && (
                        <span>PSC: {opp.classificationCode}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/fedsignal/samgov/${opp.noticeId}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium text-center"
                    >
                      View Details
                    </Link>
                    <a
                      href={opp.uiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium text-center flex items-center gap-2"
                    >
                      SAM.gov
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No opportunities found</h3>
            <p className="text-slate-600">Try adjusting your search query or filters</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Your Search</h3>
            <p className="text-slate-600 mb-4">Use natural language to find federal contract opportunities</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setQuery("software development opportunities");
                  setTimeout(handleSearch, 100);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
              >
                Software Development
              </button>
              <button
                onClick={() => {
                  setQuery("research and development contracts");
                  setTimeout(handleSearch, 100);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
              >
                R&D Contracts
              </button>
              <button
                onClick={() => {
                  setQuery("IT services opportunities");
                  setTimeout(handleSearch, 100);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
              >
                IT Services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
