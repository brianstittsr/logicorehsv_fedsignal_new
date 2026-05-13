"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap,
  Search,
  MapPin,
  Users,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown,
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
  govConScore: number;
  fy25Funding: number;
  isActive: boolean;
  isRegistered: boolean;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch("/api/fedsignal/universities");
      const result = await response.json();
      if (result.success) {
        setUniversities(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch universities:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.acronym.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || uni.type === filterType;
    const matchesState = filterState === "all" || uni.state === filterState;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && uni.isActive) ||
      (filterStatus === "registered" && uni.isRegistered);
    return matchesSearch && matchesType && matchesState && matchesStatus;
  });

  const sortedUniversities = [...filteredUniversities].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") comparison = a.name.localeCompare(b.name);
    if (sortBy === "score") comparison = a.govConScore - b.govConScore;
    if (sortBy === "funding") comparison = a.fy25Funding - b.fy25Funding;
    if (sortBy === "enrollment") comparison = a.enrollment - b.enrollment;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const states = Array.from(new Set(universities.map((u) => u.state))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Universities
          </h1>
          <p className="text-muted-foreground">
            Manage HBCU and MSI university profiles
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="HBCU">HBCU</SelectItem>
                <SelectItem value="MSI">MSI</SelectItem>
                <SelectItem value="Tribal">Tribal</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="score">GovCon Score</SelectItem>
            <SelectItem value="funding">FY25 Funding</SelectItem>
            <SelectItem value="enrollment">Enrollment</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading universities...</div>
      ) : sortedUniversities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No universities found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedUniversities.map((uni) => (
            <Link key={uni.id} href={`/fedsignal/universities/${uni.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{uni.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {uni.state} • {uni.acronym}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={uni.isActive ? "default" : "secondary"}>
                        {uni.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {uni.isRegistered && (
                        <Badge variant="outline">Registered</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GovCon Score</span>
                      <span className="font-semibold">{uni.govConScore}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">FY25 Funding</span>
                      <span className="font-semibold">${(uni.fy25Funding / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Enrollment</span>
                      <span className="font-semibold">{uni.enrollment.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline">{uni.type}</Badge>
                      <Badge variant="outline">{uni.researchClassification}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
