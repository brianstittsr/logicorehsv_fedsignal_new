"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Search,
  Filter,
  ExternalLink,
  Clock,
  DollarSign,
  Building2,
  Tag,
  Bookmark,
  Share2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Opportunity {
  id: string;
  title: string;
  agency: string;
  solicitationNumber: string;
  type: "grant" | "contract" | "cooperative_agreement" | "other";
  status: "open" | "closed" | "awarded" | "cancelled";
  postedDate: any;
  deadline: any;
  amount: string;
  isHbcuSetAside: boolean;
  hbcuPreferred: boolean;
  tags: string[];
  domains: string[];
  description: string;
  matchScore?: number;
  uiLink?: string;
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [agencyFilter, setAgencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const startPipeline = (opp: Opportunity) => {
    // Save to sessionStorage for pipeline to pick up
    const workspace = {
      opportunityId: opp.id,
      title: opp.title,
      agency: opp.agency,
      solicitationNumber: opp.solicitationNumber,
      naics: opp.tags.find(t => t.includes("NAICS")) || "",
      deadline: opp.deadline,
      amount: opp.amount,
      description: opp.description,
      setAsideType: opp.isHbcuSetAside ? "HBCU Set-Aside" : "None",
      sf424: {
        legalName: "Huston-Tillotson University",
        ein: "74-1320421",
        duns: "123456789",
        address: "900 Chicon Street",
        city: "Austin",
        state: "TX",
        zip: "78702",
        congressionalDistrict: "TX-10",
        projectTitle: opp.title,
        proposedAmount: opp.amount.replace(/[^0-9.]/g, ""),
        projectDuration: "",
        projectDirector: "",
        phone: "(512) 505-3000",
        email: "research@htu.edu",
      },
      projectNarrative: "",
      abstract: "",
      budgetSummary: { directCosts: "", indirectCosts: "", totalCosts: "" },
      keyPersonnel: [],
      pastPerformance: [],
      checklist: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessionStorage.setItem("fs_pipeline_workspace", JSON.stringify(workspace));
    router.push("/fedsignal/pipeline?step=2");
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch("/api/fedsignal/opportunities");
      const result = await response.json();
      if (result.success) {
        setOpportunities(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAgency = agencyFilter === "all" || opp.agency === agencyFilter;
    const matchesType = typeFilter === "all" || opp.type === typeFilter;
    const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
    return matchesSearch && matchesAgency && matchesType && matchesStatus;
  });

  const toggleSave = (id: string) => {
    setSavedOpportunities((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const getMatchBadgeColor = (score?: number) => {
    if (!score) return "bg-gray-600 hover:bg-gray-700";
    if (score >= 90) return "bg-green-600 hover:bg-green-700";
    if (score >= 80) return "bg-blue-600 hover:bg-blue-700";
    if (score >= 70) return "bg-amber-600 hover:bg-amber-700";
    return "bg-gray-600 hover:bg-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Opportunity Feed
          </h1>
          <p className="text-muted-foreground">
            Discover and track government funding opportunities matched to your institution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filteredOpportunities.length} opportunities</Badge>
          <Badge variant="outline" className="text-green-600">
            {filteredOpportunities.filter((o) => o.matchScore && o.matchScore >= 90).length} high match
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search opportunities by title, agency, or tags..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agencies</SelectItem>
                  <SelectItem value="Department of Defense">DOD</SelectItem>
                  <SelectItem value="National Institutes of Health">NIH</SelectItem>
                  <SelectItem value="National Science Foundation">NSF</SelectItem>
                  <SelectItem value="Department of Homeland Security">DHS</SelectItem>
                  <SelectItem value="Department of Energy">DOE</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SBIR Phase I">SBIR Phase I</SelectItem>
                  <SelectItem value="SBIR Phase II">SBIR Phase II</SelectItem>
                  <SelectItem value="R01 Research Grant">R01 Grant</SelectItem>
                  <SelectItem value="Institutional Grant">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">Loading opportunities...</div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => (
            <Card key={opp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Title & Agency */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-muted-foreground">{opp.agency}</p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">{opp.type}</p>
                        </div>
                        <h3 className="text-lg font-semibold">{opp.title}</h3>
                      </div>
                      {opp.matchScore && (
                        <Badge className={getMatchBadgeColor(opp.matchScore)}>
                          {opp.matchScore}% Match
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {opp.isHbcuSetAside && (
                        <Badge variant="secondary" className="text-xs">
                          HBCU Set-Aside
                        </Badge>
                      )}
                      {opp.hbcuPreferred && (
                        <Badge variant="secondary" className="text-xs">
                          HBCU Preferred
                        </Badge>
                      )}
                      {opp.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {opp.deadline ? new Date(opp.deadline.seconds * 1000).toLocaleDateString() : "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-green-600">{opp.amount || "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span>Posted: {opp.postedDate ? new Date(opp.postedDate.seconds * 1000).toLocaleDateString() : "TBD"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(opp.id)}
                        className={savedOpportunities.includes(opp.id) ? "text-primary" : ""}
                      >
                        <Bookmark
                          className="h-4 w-4"
                          fill={savedOpportunities.includes(opp.id) ? "currentColor" : "none"}
                        />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/fedsignal/opportunities/${opp.id}`}>
                          Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="default" onClick={() => startPipeline(opp)}>
                        <ArrowRight className="mr-1 h-3 w-3" />
                        Start Pipeline
                      </Button>
                      {opp.uiLink && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={opp.uiLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            SAM.gov
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOpportunities.length === 0 && (
            <Card className="p-12 text-center">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No opportunities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
