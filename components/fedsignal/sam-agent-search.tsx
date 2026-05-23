"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Loader2, 
  ExternalLink, 
  Brain,
  Sparkles,
  Building,
  Calendar,
  MapPin,
  Tag,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface SamOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber?: string;
  active?: string;
  type?: string;
  organizationHierarchy?: string;
  postedDate?: string;
  responseDeadLine?: string;
  naicsCode?: string;
  classificationCode?: string;
  typeOfSetAside?: string;
  description?: string;
  pointOfContact?: Array<{ name: string; email?: string; phone?: string; title?: string }>;
  resourceLinks?: Array<{ url: string; description?: string; name?: string; downloadUrl?: string }>;
  uiLink?: string;
  award?: {
    date?: string;
    amount?: number;
    awardee?: string;
  };
}

interface SamAgentSearchProps {
  onOpportunitySelect?: (opportunity: SamOpportunity) => void;
}

export function SamAgentSearch({ onOpportunitySelect }: SamAgentSearchProps) {
  const [query, setQuery] = useState("");
  const [llmProvider, setLlmProvider] = useState<"openai" | "anthropic">("openai");
  const [useAgent, setUseAgent] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SamOpportunity[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [usedAgent, setUsedAgent] = useState(false);
  const [appliedParams, setAppliedParams] = useState<any>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    setResults([]);
    setRecommendation(null);
    setCurrentPage(1);

    try {
      const response = await fetch("/api/fedsignal/sam-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          llmProvider,
          useAgent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.missingApiKey) {
          toast.error("SAM.gov API key not configured. Add SAM_API_KEY to .env.local");
        } else {
          toast.error(data.error || "Search failed");
        }
        return;
      }

      setResults(data.opportunities || []);
      setTotalResults(data.total || 0);
      setRecommendation(data.recommendation || null);
      setUsedAgent(data.usedAgent || false);
      setAppliedParams(data.appliedParams || null);

      if (data.opportunities?.length > 0) {
        toast.success(`Found ${data.total.toLocaleString()} opportunities (showing ${data.opportunities.length})`);
        if (data.usedAgent) {
          toast.info("AI-powered natural language search enabled");
        }
      } else {
        toast.info("No opportunities found for this search");
      }
    } catch (error) {
      toast.error("Failed to search SAM.gov");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (results.length === 0) {
      toast.error("No results to export");
      return;
    }

    try {
      const response = await fetch("/api/fedsignal/sam-agent/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunities: results }),
      });

      if (!response.ok) {
        toast.error("Failed to export results");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sam-opportunities-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Excel file downloaded successfully");
    } catch (error) {
      toast.error("Failed to export results");
      console.error(error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered SAM.gov Search
          </CardTitle>
          <CardDescription>
            Use natural language to search federal contract opportunities. 
            The AI parses your query and applies appropriate filters automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Settings */}
          <div className="flex flex-wrap gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAgent"
                checked={useAgent}
                onChange={(e) => setUseAgent(e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="useAgent" className="text-sm font-medium">
                Enable AI-Powered Search
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="llmProvider" className="text-sm font-medium">
                LLM Provider:
              </label>
              <Select value={llmProvider} onValueChange={(v) => setLlmProvider(v as any)}>
                <SelectTrigger id="llmProvider" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Find software development opportunities for HBCUs in California with NAICS 541511"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : useAgent ? (
                <Sparkles className="h-4 w-4 mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Applied Parameters */}
          {appliedParams && usedAgent && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI-Applied Filters:
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(appliedParams).map(([key, value]) => {
                  if (!value || key === "keywords" || key === "api_key" || key === "limit") return null;
                  return (
                    <Badge key={key} variant="secondary">
                      {key}: {String(value)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* AI Recommendation */}
          {recommendation && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{recommendation}</p>
              </CardContent>
            </Card>
          )}

          {/* Results Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    {totalResults.toLocaleString()} opportunities found
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Solicitation #</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>NAICS</TableHead>
                      <TableHead>Set-Aside</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResults.map((opportunity) => (
                      <TableRow key={opportunity.noticeId}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {opportunity.title}
                        </TableCell>
                        <TableCell className="text-sm">
                          {opportunity.solicitationNumber || "N/A"}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {opportunity.organizationHierarchy?.replace(/\./g, " > ") || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{opportunity.naicsCode || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          {opportunity.typeOfSetAside ? (
                            <Badge variant="secondary">{opportunity.typeOfSetAside}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(opportunity.postedDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(opportunity.responseDeadLine)}
                        </TableCell>
                        <TableCell>
                          {opportunity.active === "true" ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onOpportunitySelect?.(opportunity)}
                            >
                              View
                            </Button>
                            {opportunity.uiLink && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={opportunity.uiLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
