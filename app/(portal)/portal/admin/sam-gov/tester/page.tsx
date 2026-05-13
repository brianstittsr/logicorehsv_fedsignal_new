"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Key,
  Building,
  Search,
  FileText,
  AlertTriangle,
  DollarSign,
  Network,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface TestResult {
  status: "idle" | "loading" | "success" | "error";
  statusCode?: number;
  data?: Record<string, unknown>;
  error?: string;
  duration?: number;
}

interface EndpointConfig {
  id: string;
  name: string;
  description: string;
  method: "GET" | "POST";
  path: string;
  icon: React.ElementType;
  requiresApiKey: boolean;
  category: string;
  docUrl: string;
  params: {
    name: string;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: "text" | "select";
    options?: { value: string; label: string }[];
  }[];
}

const endpoints: EndpointConfig[] = [
  // --- Opportunities ---
  {
    id: "opp-search",
    name: "Opportunities Search",
    description: "Search federal contract opportunities using keyword and filters",
    method: "POST",
    path: "/api/sam/search",
    icon: Search,
    requiresApiKey: false,
    category: "Opportunities",
    docUrl: "https://open.gsa.gov/api/get-opportunities-public-api/",
    params: [
      { name: "query", label: "Keyword", placeholder: "e.g. cybersecurity, AI research" },
      { name: "naics_code", label: "NAICS Code", placeholder: "e.g. 541715" },
      { name: "set_aside", label: "Set-Aside", placeholder: "e.g. SBA, WOSB, 8A" },
      { name: "pop_state", label: "State", placeholder: "e.g. TX, VA, DC" },
      { name: "limit", label: "Limit", placeholder: "10" },
    ],
  },
  {
    id: "opp-detail",
    name: "Opportunity Detail",
    description: "Get full details for a specific opportunity by Notice ID",
    method: "GET",
    path: "/api/sam/opportunity",
    icon: FileText,
    requiresApiKey: false,
    category: "Opportunities",
    docUrl: "https://open.gsa.gov/api/get-opportunities-public-api/",
    params: [
      { name: "id", label: "Notice ID", placeholder: "e.g. abc1234567890abcdef1234", required: true },
    ],
  },
  // --- Entity Management ---
  {
    id: "entity-search",
    name: "Entity Search (v3/v4)",
    description: "Search SAM-registered entities. API key sent as x-api-key header per official docs. Get free key at sam.gov/profile/details.",
    method: "GET",
    path: "/api/sam/entities",
    icon: Building,
    requiresApiKey: true,
    category: "Entity Management",
    docUrl: "https://open.gsa.gov/api/entity-api/",
    params: [
      { name: "api_key", label: "API Key (x-api-key)", placeholder: "From sam.gov/profile/details", required: true },
      {
        name: "apiVersion", label: "API Version", placeholder: "v3",
        type: "select",
        options: [
          { value: "v3", label: "v3 (default)" },
          { value: "v4", label: "v4 (latest)" },
        ],
      },
      { name: "entityName", label: "Entity Name", placeholder: "e.g. Huston-Tillotson University" },
      { name: "ueiSAM", label: "UEI SAM", placeholder: "12-char unique entity ID" },
      { name: "cageCode", label: "CAGE Code", placeholder: "5-char CAGE code" },
      { name: "q", label: "Advanced Query (q)", placeholder: "e.g. (businessTypeDesc:'HBCU')" },
      {
        name: "registrationStatus", label: "Registration Status", placeholder: "Active",
        type: "select",
        options: [
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
          { value: "Draft", label: "Draft" },
        ],
      },
      {
        name: "purposeOfRegistrationCode", label: "Purpose of Registration", placeholder: "Select",
        type: "select",
        options: [
          { value: "Z1", label: "Z1 – Federal Assistance Awards" },
          { value: "Z2", label: "Z2 – All Awards" },
          { value: "Z4", label: "Z4 – IGT Only" },
          { value: "Z5", label: "Z5 – Federal Assistance Awards & IGT" },
        ],
      },
      {
        name: "businessTypeCode", label: "Business Type Code", placeholder: "Select",
        type: "select",
        options: [
          { value: "OY", label: "OY – Black American Owned" },
          { value: "8W", label: "8W – Woman Owned Small Business" },
          { value: "8C", label: "8C – Joint Venture Women Owned" },
          { value: "23", label: "23 – Minority Owned Business" },
          { value: "A8", label: "A8 – Non-Profit Organization" },
          { value: "2X", label: "2X – For Profit Organization" },
          { value: "GW", label: "GW – For Profit Limited Liability" },
          { value: "HK", label: "HK – Community Development Corp" },
          { value: "MF", label: "MF – Manufacturer of Goods" },
          { value: "LJ", label: "LJ – Limited Liability Company" },
        ],
      },
      {
        name: "includeSections", label: "Include Sections", placeholder: "Select",
        type: "select",
        options: [
          { value: "entityRegistration,coreData", label: "Registration + Core Data" },
          { value: "All", label: "All (excl. integrityInformation)" },
          { value: "entityRegistration,coreData,assertions,pointsOfContact", label: "Reg + Core + Assertions + POC" },
          { value: "entityRegistration,coreData,integrityInformation", label: "Reg + Core + Integrity Info" },
          { value: "repsAndCerts", label: "Reps & Certs only" },
        ],
      },
      { name: "naicsCode", label: "NAICS Code", placeholder: "e.g. 611310 (Colleges)" },
      { name: "stateOfIncorporationCode", label: "State of Incorporation", placeholder: "e.g. TX" },
      { name: "size", label: "Page Size (max 10)", placeholder: "10" },
      { name: "page", label: "Page (0-indexed)", placeholder: "0" },
    ],
  },
  {
    id: "company-search",
    name: "Company Search",
    description: "Search companies awarded contracts from SAM.gov opportunity data",
    method: "POST",
    path: "/api/sam/company-search",
    icon: Building,
    requiresApiKey: false,
    category: "Entity Management",
    docUrl: "https://open.gsa.gov/api/entity-api/",
    params: [
      { name: "keyword", label: "Keyword", placeholder: "Company name or keyword" },
      { name: "state", label: "State", placeholder: "e.g. TX" },
      { name: "naicsCode", label: "NAICS Code", placeholder: "e.g. 541715" },
      { name: "limit", label: "Limit", placeholder: "10" },
    ],
  },
  // --- Exclusions ---
  {
    id: "exclusions",
    name: "Exclusions Search",
    description: "Search for excluded entities (debarred, suspended vendors)",
    method: "GET",
    path: "/api/sam/exclusions",
    icon: AlertTriangle,
    requiresApiKey: true,
    category: "Exclusions",
    docUrl: "https://open.gsa.gov/api/exclusions-api/",
    params: [
      { name: "api_key", label: "API Key", placeholder: "Your SAM.gov API key", required: true },
      { name: "entityName", label: "Entity Name", placeholder: "Company or person name" },
      { name: "ueiSAM", label: "UEI SAM", placeholder: "12-char UEI" },
      { name: "cageCode", label: "CAGE Code", placeholder: "5-char CAGE code" },
      {
        name: "exclusionType", label: "Exclusion Type", placeholder: "Select type",
        type: "select",
        options: [
          { value: "Individual", label: "Individual" },
          { value: "Firm", label: "Firm" },
          { value: "Vessel", label: "Vessel" },
          { value: "Special Entity Designation", label: "Special Entity" },
        ],
      },
      { name: "limit", label: "Limit", placeholder: "10" },
    ],
  },
  // --- Federal Hierarchy ---
  {
    id: "federal-hierarchy",
    name: "Federal Hierarchy",
    description: "Look up federal agency organizational hierarchy",
    method: "GET",
    path: "/api/sam/federal-hierarchy",
    icon: Network,
    requiresApiKey: false,
    category: "Federal Hierarchy",
    docUrl: "https://open.gsa.gov/api/fh-public-api/",
    params: [
      { name: "orgName", label: "Org Name", placeholder: "e.g. Department of Defense" },
      { name: "orgCode", label: "Org Code", placeholder: "Agency code" },
      {
        name: "level", label: "Level", placeholder: "Select level",
        type: "select",
        options: [
          { value: "DEPARTMENT", label: "Department" },
          { value: "SUBTIER", label: "Sub-Tier" },
          { value: "OFFICE", label: "Office" },
        ],
      },
      { name: "limit", label: "Limit", placeholder: "10" },
    ],
  },
  // --- Assistance Listings ---
  {
    id: "assistance-listings",
    name: "Assistance Listings (CFDA)",
    description: "Search federal assistance programs (formerly CFDA — grants, loans, etc.)",
    method: "GET",
    path: "/api/sam/assistance-listings",
    icon: BookOpen,
    requiresApiKey: true,
    category: "Assistance Listings",
    docUrl: "https://open.gsa.gov/api/assistancelistings-api/",
    params: [
      { name: "api_key", label: "API Key", placeholder: "Your SAM.gov API key", required: true },
      { name: "keyword", label: "Keyword", placeholder: "e.g. HBCU, education, research" },
      { name: "programNumber", label: "Program Number", placeholder: "e.g. 84.031" },
      { name: "federalAgency", label: "Federal Agency", placeholder: "e.g. Department of Education" },
      { name: "limit", label: "Limit", placeholder: "10" },
    ],
  },
  // --- Wage Determinations ---
  {
    id: "wage-determinations",
    name: "Wage Determinations",
    description: "Look up Service Contract Act (SCA) and Davis-Bacon Act wage rates",
    method: "GET",
    path: "/api/sam/wage-determinations",
    icon: DollarSign,
    requiresApiKey: false,
    category: "Wage Determinations",
    docUrl: "https://open.gsa.gov/api/wage-determination-api/",
    params: [
      {
        name: "wdType", label: "Type", placeholder: "Select type",
        type: "select",
        options: [
          { value: "SCA", label: "SCA - Service Contract Act" },
          { value: "DBA", label: "DBA - Davis-Bacon Act" },
        ],
      },
      { name: "state", label: "State", placeholder: "e.g. TX" },
      { name: "county", label: "County", placeholder: "County name" },
      { name: "wdNumber", label: "WD Number", placeholder: "e.g. 2015-4281" },
      { name: "limit", label: "Limit", placeholder: "10" },
    ],
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  "Opportunities": Search,
  "Entity Management": Building,
  "Exclusions": AlertTriangle,
  "Federal Hierarchy": Network,
  "Assistance Listings": BookOpen,
  "Wage Determinations": DollarSign,
};

export default function SamGovTesterPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [params, setParams] = useState<Record<string, Record<string, string>>>({});
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const updateParam = (endpointId: string, paramName: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [endpointId]: { ...(prev[endpointId] || {}), [paramName]: value },
    }));
  };

  const runTest = async (endpoint: EndpointConfig) => {
    const endpointParams = params[endpoint.id] || {};
    const start = Date.now();

    setResults(prev => ({ ...prev, [endpoint.id]: { status: "loading" } }));

    try {
      let response: Response;

      if (endpoint.method === "POST") {
        const body: Record<string, unknown> = {};
        endpoint.params.forEach(p => {
          if (endpointParams[p.name]) body[p.name] = endpointParams[p.name];
        });
        // For opportunities search, nest filters correctly
        if (endpoint.id === "opp-search") {
          const { query, ...filters } = body;
          response = await fetch(endpoint.path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query || "", filters }),
          });
        } else {
          response = await fetch(endpoint.path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
      } else {
        // GET — for opportunity detail, append id to path
        let path = endpoint.path;
        const qp = new URLSearchParams();
        endpoint.params.forEach(p => {
          const v = endpointParams[p.name];
          if (v) {
            if (endpoint.id === "opp-detail" && p.name === "id") {
              path = `${endpoint.path}/${v}`;
            } else {
              qp.set(p.name, v);
            }
          }
        });
        const qs = qp.toString();
        response = await fetch(`${path}${qs ? `?${qs}` : ""}`, { method: "GET" });
      }

      const duration = Date.now() - start;
      const data = await response.json();

      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: response.ok ? "success" : "error",
          statusCode: response.status,
          data,
          duration,
        },
      }));
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: "error",
          error: err instanceof Error ? err.message : "Request failed",
          duration: Date.now() - start,
        },
      }));
    }
  };

  const copyResult = (id: string) => {
    const result = results[id];
    if (result?.data) {
      navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories = [...new Set(endpoints.map(e => e.category))];

  const getStatusBadge = (result: TestResult) => {
    if (result.status === "loading") return <Badge variant="secondary"><Loader2 className="h-3 w-3 animate-spin mr-1" />Testing...</Badge>;
    if (result.status === "success") return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />{result.statusCode} OK</Badge>;
    if (result.status === "error") return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{result.statusCode || "Error"}</Badge>;
    return null;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/portal/admin/sam-gov" className="text-sm text-muted-foreground hover:text-foreground">
              ← SAM.gov Admin
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="h-7 w-7 text-primary" />
            SAM.gov API Endpoint Tester
          </h1>
          <p className="text-muted-foreground mt-1">
            Test all SAM.gov API endpoints. Endpoints marked with{" "}
            <Badge variant="outline" className="text-xs"><Key className="h-3 w-3 mr-1" />API Key</Badge>{" "}
            require a free key from{" "}
            <a href="https://open.gsa.gov/api/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
              open.gsa.gov/api <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3">
          <div className="flex items-center gap-1 text-green-600"><CheckCircle className="h-3 w-3" /> Public (no key)</div>
          <div className="flex items-center gap-1 ml-3 text-amber-600"><Key className="h-3 w-3" /> Requires API key</div>
        </div>
      </div>

      {/* API Key Info Banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-2">
        <div className="font-semibold flex items-center gap-2">
          <Key className="h-4 w-4" /> SAM.gov API Key Setup
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="font-medium mb-1">Getting your free API key:</div>
            <ol className="space-y-0.5 list-decimal list-inside text-amber-800">
              <li>Register at <a href="https://sam.gov" target="_blank" rel="noopener noreferrer" className="underline">sam.gov</a></li>
              <li>Go to <a href="https://sam.gov/profile/details" target="_blank" rel="noopener noreferrer" className="underline">sam.gov/profile/details</a></li>
              <li>Click the <strong>eye icon</strong> next to &quot;Public API Key&quot;</li>
              <li>Enter the one-time password sent to your email</li>
            </ol>
          </div>
          <div>
            <div className="font-medium mb-1">Technical notes (per official docs):</div>
            <ul className="space-y-0.5 list-disc list-inside text-amber-800">
              <li>API key is sent as <code className="bg-amber-100 px-1 rounded">x-api-key</code> header</li>
              <li>Entity API max page size: <strong>10 records</strong></li>
              <li><code className="bg-amber-100 px-1 rounded">integrityInformation</code> section NOT in &quot;All&quot; — request explicitly</li>
              <li>Date params must be <strong>MM/DD/YYYY</strong> format</li>
              <li>Docs: <a href="https://open.gsa.gov/api/entity-api/" target="_blank" rel="noopener noreferrer" className="underline">open.gsa.gov/api/entity-api</a></li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue={categories[0]}>
        <TabsList className="flex-wrap h-auto gap-1">
          {categories.map(cat => {
            const Icon = categoryIcons[cat] || Search;
            const catEndpoints = endpoints.filter(e => e.category === cat);
            const successCount = catEndpoints.filter(e => results[e.id]?.status === "success").length;
            const errorCount = catEndpoints.filter(e => results[e.id]?.status === "error").length;
            return (
              <TabsTrigger key={cat} value={cat} className="flex items-center gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {cat}
                {successCount > 0 && <span className="ml-1 h-4 w-4 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center">{successCount}</span>}
                {errorCount > 0 && <span className="ml-1 h-4 w-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">{errorCount}</span>}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="space-y-4 mt-4">
            {endpoints.filter(e => e.category === cat).map(endpoint => {
              const result = results[endpoint.id] || { status: "idle" };
              const isExpanded = expandedResults[endpoint.id];

              return (
                <Card key={endpoint.id} className={
                  result.status === "success" ? "border-green-200" :
                  result.status === "error" ? "border-red-200" : ""
                }>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <endpoint.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {endpoint.name}
                            <Badge variant="outline" className="text-[10px] font-mono">
                              {endpoint.method}
                            </Badge>
                            {endpoint.requiresApiKey && (
                              <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                                <Key className="h-2.5 w-2.5 mr-1" />API Key
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs">{endpoint.description}</CardDescription>
                          <code className="text-[11px] text-muted-foreground font-mono">{endpoint.path}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(result)}
                        {result.duration && <span className="text-xs text-muted-foreground">{result.duration}ms</span>}
                        <a
                          href={endpoint.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Params */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {endpoint.params.map(param => (
                        <div key={param.name} className="space-y-1">
                          <Label className="text-xs">
                            {param.label}
                            {param.required && <span className="text-red-500 ml-0.5">*</span>}
                          </Label>
                          {param.type === "select" ? (
                            <Select
                              value={params[endpoint.id]?.[param.name] || ""}
                              onValueChange={v => updateParam(endpoint.id, param.name, v)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder={param.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {param.options?.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              className="h-8 text-xs"
                              placeholder={param.placeholder}
                              value={params[endpoint.id]?.[param.name] || ""}
                              onChange={e => updateParam(endpoint.id, param.name, e.target.value)}
                              type={param.name === "api_key" ? "password" : "text"}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => runTest(endpoint)}
                        disabled={result.status === "loading"}
                        className="gap-1.5"
                      >
                        {result.status === "loading" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        Run Test
                      </Button>
                      {result.data && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyResult(endpoint.id)}
                            className="gap-1.5"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copiedId === endpoint.id ? "Copied!" : "Copy JSON"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedResults(prev => ({ ...prev, [endpoint.id]: !prev[endpoint.id] }))}
                            className="gap-1.5"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {isExpanded ? "Hide" : "Show"} Response
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Response preview */}
                    {result.status !== "idle" && result.data && isExpanded && (
                      <div className="rounded-lg border bg-muted/50 p-3 max-h-96 overflow-auto">
                        <pre className="text-[11px] text-foreground whitespace-pre-wrap font-mono">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Summary stats when success */}
                    {result.status === "success" && result.data && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {(() => {
                          const d = result.data as Record<string, unknown>; // eslint-disable-line @typescript-eslint/no-non-null-assertion
                          const items: string[] = [
                            d.totalRecords != null ? `${d.totalRecords} total records` : null,
                            Array.isArray(d.opportunities) ? `${(d.opportunities as unknown[]).length} opportunities` : null,
                            Array.isArray(d.entities) ? `${(d.entities as unknown[]).length} entities` : null,
                            Array.isArray(d.exclusionData) ? `${(d.exclusionData as unknown[]).length} exclusions` : null,
                            Array.isArray(d.orgList) ? `${(d.orgList as unknown[]).length} orgs` : null,
                            Array.isArray(d.programs) ? `${(d.programs as unknown[]).length} programs` : null,
                            Array.isArray(d.wageDeterminations) ? `${(d.wageDeterminations as unknown[]).length} wage determinations` : null,
                          ].filter((x): x is string => x !== null);
                          return items.map((item, i) => (
                            <span key={i} className="bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5">{item}</span>
                          ));
                        })()}
                      </div>
                    )}

                    {/* Error message */}
                    {result.status === "error" && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                        <div className="font-semibold mb-1">Error</div>
                        {result.error ?? (result.data ? String(JSON.stringify((result.data as Record<string, unknown>).error)) : "")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
