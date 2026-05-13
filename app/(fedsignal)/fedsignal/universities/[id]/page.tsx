"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Users,
  DollarSign,
  Award,
  Building2,
  Mail,
  Phone,
} from "lucide-react";

interface University {
  id: string;
  name: string;
  acronym: string;
  state: string;
  type: "HBCU" | "MSI" | "Tribal" | "Other";
  researchClassification: string;
  enrollment: number;
  website: string;
  mascot?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  govConScore: number;
  scoreBreakdown: {
    technicalCapability: number;
    pastPerformance: number;
    facilities: number;
    personnel: number;
    financialHealth: number;
  };
  fy25Funding: number;
  fy24Funding?: number;
  fy23Funding?: number;
  capabilityIds?: string[];
  isActive: boolean;
  isRegistered: boolean;
  registrationDate?: any;
  isCEO?: boolean;
  isCOO?: boolean;
  isCTO?: boolean;
  isCRO?: boolean;
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchUniversity(params.id as string);
    }
  }, [params.id]);

  const fetchUniversity = async (id: string) => {
    try {
      const response = await fetch(`/api/fedsignal/universities/${id}`);
      const result = await response.json();
      if (result.success) {
        setUniversity(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch university:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading university...</div>;
  }

  if (!university) {
    return <div className="text-center py-12 text-muted-foreground">University not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fedsignal/universities">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{university.name}</h1>
          <p className="text-muted-foreground">{university.acronym} • {university.state}</p>
        </div>
        <div className="flex gap-2">
          {university.website && (
            <Button variant="outline" asChild>
              <a href={university.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Website
              </a>
            </Button>
          )}
          <Button variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                Type
              </div>
              <Badge>{university.type}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                Classification
              </div>
              <Badge variant="outline">{university.researchClassification}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Enrollment
              </div>
              <div className="font-semibold">{university.enrollment.toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                State
              </div>
              <div className="font-semibold">{university.state}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant={university.isActive ? "default" : "secondary"}>
              {university.isActive ? "Active" : "Inactive"}
            </Badge>
            {university.isRegistered && (
              <Badge variant="outline">Registered</Badge>
            )}
            {university.isCEO && <Badge variant="secondary">CEO</Badge>}
            {university.isCOO && <Badge variant="secondary">COO</Badge>}
            {university.isCTO && <Badge variant="secondary">CTO</Badge>}
            {university.isCRO && <Badge variant="secondary">CRO</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* GovCon Score */}
      <Card>
        <CardHeader>
          <CardTitle>GovCon Score</CardTitle>
          <CardDescription>Overall government contracting readiness score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{university.govConScore}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Technical Capability</span>
                <span className="font-semibold">{university.scoreBreakdown.technicalCapability}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${university.scoreBreakdown.technicalCapability}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Past Performance</span>
                <span className="font-semibold">{university.scoreBreakdown.pastPerformance}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${university.scoreBreakdown.pastPerformance}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Facilities</span>
                <span className="font-semibold">{university.scoreBreakdown.facilities}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${university.scoreBreakdown.facilities}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Personnel</span>
                <span className="font-semibold">{university.scoreBreakdown.personnel}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${university.scoreBreakdown.personnel}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Financial Health</span>
                <span className="font-semibold">{university.scoreBreakdown.financialHealth}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${university.scoreBreakdown.financialHealth}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funding */}
      <Card>
        <CardHeader>
          <CardTitle>Funding History</CardTitle>
          <CardDescription>Federal funding over recent fiscal years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">FY25</div>
              <div className="text-2xl font-bold">${(university.fy25Funding / 1000000).toFixed(1)}M</div>
            </div>
            {university.fy24Funding && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">FY24</div>
                <div className="text-2xl font-bold">${(university.fy24Funding / 1000000).toFixed(1)}M</div>
              </div>
            )}
            {university.fy23Funding && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">FY23</div>
                <div className="text-2xl font-bold">${(university.fy23Funding / 1000000).toFixed(1)}M</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for related data */}
      <Tabs defaultValue="capabilities">
        <TabsList>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="consortiums">Consortiums</TabsTrigger>
        </TabsList>
        <TabsContent value="capabilities" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Capabilities will be loaded from Firestore
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Contacts will be loaded from Firestore
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Opportunities will be loaded from Firestore
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grants" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Grants will be loaded from Firestore
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="consortiums" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Consortiums will be loaded from Firestore
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
