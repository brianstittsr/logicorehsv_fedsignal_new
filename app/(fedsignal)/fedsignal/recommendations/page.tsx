"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Target,
  Users,
  Handshake,
  ArrowRight,
  Star,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Clock,
  DollarSign,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityProfile {
  name: string;
  capabilities: string[];
  researchStrengths: string[];
  preferredContractTypes: string[];
  targetAgencies: string[];
  teamingPreferences: {
    interested: boolean;
    regions: string[];
    complementary: string[];
  };
}

interface OpportunityRecommendation {
  id: string;
  title: string;
  agency: string;
  solicitationNumber: string;
  deadline: string;
  amount: string;
  description: string;
  matchScore: number;
  matchReasons: string[];
  opportunityType: string;
  hbcuSetAside: boolean;
  action: "apply_solo" | "team_recommended" | "consortium_opportunity";
  recommendedPartners?: string[];
}

interface TeamingRecommendation {
  id: string;
  universityName: string;
  state: string;
  complementaryStrengths: string[];
  sharedInterests: string[];
  matchScore: number;
  activeProjects: number;
  consortiums: string[];
  reason: string;
}

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<UniversityProfile | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityRecommendation[]>([]);
  const [teamingMatches, setTeamingMatches] = useState<TeamingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("opportunities");

  useEffect(() => {
    // Load profile from sessionStorage
    const saved = sessionStorage.getItem("fs_university_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }

    // Load sample recommendations
    loadRecommendations();
  }, []);

  const loadRecommendations = () => {
    // Simulated AI recommendations based on typical HBCU strengths
    const sampleOpportunities: OpportunityRecommendation[] = [
      {
        id: "REC-001",
        title: "HBCU STEM Education Research Initiative",
        agency: "NSF",
        solicitationNumber: "NSF-24-578",
        deadline: "2024-08-15",
        amount: "$2,500,000",
        description: "Multi-institutional research on STEM education equity and workforce development at HBCUs.",
        matchScore: 95,
        matchReasons: ["STEM Education capability", "HBCU set-aside", "Research focus match"],
        opportunityType: "Research Grant",
        hbcuSetAside: true,
        action: "consortium_opportunity",
        recommendedPartners: ["Spelman College", "Morehouse College"],
      },
      {
        id: "REC-002",
        title: "AI/ML for Agricultural Innovation",
        agency: "USDA",
        solicitationNumber: "USDA-NIFA-24-012",
        deadline: "2024-07-30",
        amount: "$850,000",
        description: "Applying artificial intelligence to sustainable agriculture and food security challenges.",
        matchScore: 88,
        matchReasons: ["AI/ML capability", "Agricultural Science strength"],
        opportunityType: "Research Grant",
        hbcuSetAside: false,
        action: "team_recommended",
        recommendedPartners: ["Florida A&M University"],
      },
      {
        id: "REC-003",
        title: "Cybersecurity Workforce Development",
        agency: "DHS",
        solicitationNumber: "DHS-24-ST-089",
        deadline: "2024-06-28",
        amount: "$1,200,000",
        description: "Training programs for underrepresented populations in cybersecurity careers.",
        matchScore: 92,
        matchReasons: ["Cybersecurity capability", "Target agency match (DHS)"],
        opportunityType: "Training Grant",
        hbcuSetAside: true,
        action: "apply_solo",
      },
      {
        id: "REC-004",
        title: "Health Disparities Research Center",
        agency: "NIH",
        solicitationNumber: "NIH-MD-24-004",
        deadline: "2024-09-01",
        amount: "$5,000,000",
        description: "Comprehensive research center addressing health equity in minority communities.",
        matchScore: 90,
        matchReasons: ["Health Disparities research", "NIH target agency"],
        opportunityType: "Center Grant",
        hbcuSetAside: true,
        action: "consortium_opportunity",
        recommendedPartners: ["Howard University", "Meharry Medical College"],
      },
      {
        id: "REC-005",
        title: "SBIR Phase I: Renewable Energy Storage",
        agency: "DOE",
        solicitationNumber: "DOE-SBIR-24-015",
        deadline: "2024-07-15",
        amount: "$300,000",
        description: "Development of novel energy storage solutions for rural communities.",
        matchScore: 85,
        matchReasons: ["Renewable Energy capability", "SBIR preference match"],
        opportunityType: "SBIR",
        hbcuSetAside: false,
        action: "team_recommended",
        recommendedPartners: ["NC A&T State University"],
      },
    ];

    const sampleTeaming: TeamingRecommendation[] = [
      {
        id: "TEAM-001",
        universityName: "Florida A&M University",
        state: "FL",
        complementaryStrengths: ["Agricultural Science", "Renewable Energy"],
        sharedInterests: ["USDA funding", "Environmental research"],
        matchScore: 94,
        activeProjects: 12,
        consortiums: ["HBCU Research Alliance"],
        reason: "Strong complementary capabilities in agriculture where your AI/ML strengths could add value",
      },
      {
        id: "TEAM-002",
        universityName: "Spelman College",
        state: "GA",
        complementaryStrengths: ["STEM Education", "Data Science"],
        sharedInterests: ["NSF funding", "STEM equity"],
        matchScore: 91,
        activeProjects: 8,
        consortiums: ["STEM Consortium", "HBCU Research Alliance"],
        reason: "Both focused on STEM education research - ideal for collaborative NSF proposals",
      },
      {
        id: "TEAM-003",
        universityName: "Howard University",
        state: "DC",
        complementaryStrengths: ["Biomedical Research", "Health Disparities"],
        sharedInterests: ["NIH funding", "Health equity"],
        matchScore: 89,
        activeProjects: 24,
        consortiums: ["Health Equity Coalition"],
        reason: "Leading HBCU in health research - perfect partner for NIH consortium applications",
      },
      {
        id: "TEAM-004",
        universityName: "NC A&T State University",
        state: "NC",
        complementaryStrengths: ["Advanced Manufacturing", "Engineering"],
        sharedInterests: ["DoD funding", "Defense research"],
        matchScore: 87,
        activeProjects: 15,
        consortiums: ["Defense Research Network"],
        reason: "Strong engineering capabilities complement your cybersecurity focus for DoD opportunities",
      },
      {
        id: "TEAM-005",
        universityName: "Tuskegee University",
        state: "AL",
        complementaryStrengths: ["Materials Science", "Aerospace Engineering"],
        sharedInterests: ["NASA funding", "Space research"],
        matchScore: 86,
        activeProjects: 10,
        consortiums: ["STEM Consortium"],
        reason: "Historic strengths in aerospace align with your materials science interests",
      },
    ];

    setOpportunities(sampleOpportunities);
    setTeamingMatches(sampleTeaming);
    setLoading(false);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "apply_solo":
        return { label: "Apply Solo", color: "bg-green-100 text-green-700" };
      case "team_recommended":
        return { label: "Team Recommended", color: "bg-blue-100 text-blue-700" };
      case "consortium_opportunity":
        return { label: "Consortium Opportunity", color: "bg-purple-100 text-purple-700" };
      default:
        return { label: "Review", color: "bg-gray-100 text-gray-700" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a56db]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Recommendations</h1>
            <p className="text-sm text-gray-500">
              Personalized opportunities and teaming matches based on your university profile
            </p>
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <Card className="bg-gradient-to-r from-[#1a56db]/5 to-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <div className="text-sm text-gray-500">Your Profile</div>
                  <div className="font-semibold">{profile.name}</div>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex flex-wrap gap-2">
                  {profile.capabilities.slice(0, 3).map((cap) => (
                    <Badge key={cap} variant="outline" className="bg-white">
                      {cap}
                    </Badge>
                  ))}
                  {profile.capabilities.length > 3 && (
                    <Badge variant="outline" className="bg-white">
                      +{profile.capabilities.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="ml-auto">
                  <Link href="/fedsignal/onboarding">
                    <Button variant="outline" size="sm">
                      Update Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Opportunities</span>
            <span className="sm:hidden">Grants</span>
            <Badge variant="secondary" className="ml-1">{opportunities.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="teaming" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            <span className="hidden sm:inline">Teaming Matches</span>
            <span className="sm:hidden">Teaming</span>
            <Badge variant="secondary" className="ml-1">{teamingMatches.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {opportunities.map((opp) => {
              const action = getActionBadge(opp.action);
              return (
                <Card key={opp.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Match Score */}
                      <div className="flex items-center gap-3 lg:w-32 flex-shrink-0">
                        <div className={cn("w-16 h-16 rounded-full flex flex-col items-center justify-center border-2", getMatchColor(opp.matchScore))}>
                          <span className="text-xl font-bold">{opp.matchScore}%</span>
                          <span className="text-[10px] uppercase tracking-wide">Match</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">{opp.title}</h3>
                            <p className="text-sm text-gray-500">
                              {opp.agency} • {opp.solicitationNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {opp.hbcuSetAside && (
                              <Badge className="bg-purple-100 text-purple-700">HBCU Set-Aside</Badge>
                            )}
                            <Badge className={action.color}>{action.label}</Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">{opp.description}</p>

                        {/* Match Reasons */}
                        <div className="flex flex-wrap gap-2">
                          {opp.matchReasons.map((reason) => (
                            <span
                              key={reason}
                              className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {reason}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Due {opp.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {opp.amount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {opp.opportunityType}
                          </span>
                        </div>

                        {/* Recommended Partners */}
                        {opp.recommendedPartners && opp.recommendedPartners.length > 0 && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">
                              Recommended partners: {opp.recommendedPartners.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:w-40 flex-shrink-0">
                        <Link href={`/fedsignal/pipeline?step=1&opp=${opp.id}`} className="flex-1">
                          <Button className="w-full bg-[#1a56db] hover:bg-[#1547b5]">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Start Pipeline
                          </Button>
                        </Link>
                        <Link href={`/fedsignal/opportunities/${opp.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Teaming Tab */}
        <TabsContent value="teaming" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {teamingMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{match.universityName}</CardTitle>
                      <CardDescription>{match.state}</CardDescription>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-sm font-bold border", getMatchColor(match.matchScore))}>
                      {match.matchScore}% Match
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Complementary Strengths */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Complementary Strengths</div>
                    <div className="flex flex-wrap gap-2">
                      {match.complementaryStrengths.map((strength) => (
                        <Badge key={strength} variant="outline" className="bg-blue-50">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Shared Interests */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Shared Interests</div>
                    <div className="flex flex-wrap gap-2">
                      {match.sharedInterests.map((interest) => (
                        <Badge key={interest} variant="outline" className="bg-green-50">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      {match.activeProjects} active projects
                    </div>
                  </div>

                  {/* Consortiums */}
                  {match.consortiums.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Handshake className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">
                        Member: {match.consortiums.join(", ")}
                      </span>
                    </div>
                  )}

                  {/* AI Reason */}
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-sm text-amber-800">{match.reason}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/fedsignal/teaming?partner=${match.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Handshake className="h-4 w-4 mr-2" />
                        Propose Team
                      </Button>
                    </Link>
                    <Link href={`/fedsignal/directory`} className="flex-1">
                      <Button variant="ghost" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-[#1a56db]/10 to-purple-100">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Want Better Recommendations?</h3>
            <p className="text-sm text-gray-600">
              Update your research profile to get more accurate AI matching
            </p>
          </div>
          <Link href="/fedsignal/onboarding">
            <Button className="bg-[#1a56db] hover:bg-[#1547b5]">
              <Sparkles className="h-4 w-4 mr-2" />
              Refine Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
