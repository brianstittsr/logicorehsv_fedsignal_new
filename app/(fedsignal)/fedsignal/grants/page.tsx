"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Calendar, DollarSign, Filter, Plus, AlertCircle, CheckCircle2, Clock, TrendingUp, Users, Paperclip, Grid, List, Image as ImageIcon, HelpCircle, Download } from "lucide-react";
import Image from "next/image";
import { Walkthrough, WalkthroughButton } from "@/components/ui/walkthrough";

interface GrantDetail {
  id: string;
  grantNumber: string;
  title: string;
  agency: string;
  status: string;
  universityId: string;
  startDate: any;
  endDate: any;
  totalAwardAmount: number;
  principalInvestigator: {
    name: string;
    email: string;
    title: string;
  };
  projectSummary: string;
  nextReportDueDate?: any;
  attachments?: Array<{ name: string; url: string; type: string }>;
  milestones?: Array<{ title: string; dueDate: any; status: string; progressPercentage?: number }>;
}

export default function GrantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [grants, setGrants] = useState<GrantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"title" | "amount" | "date" | "agency">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  const grantTrackerWalkthroughSteps = [
    {
      title: "Dashboard Overview",
      description: "The dashboard shows key metrics for your grants: Active Grants count, Pending Applications, Total Active Value, and Upcoming Reports due in 30 days. Click on any card to filter grants by that metric.",
      target: '[class*="grid"]',
      position: "top" as const,
    },
    {
      title: "Search Grants",
      description: "Use the search bar to find grants by title, agency, or grant number. Type keywords to filter the grant list in real-time.",
      target: 'input[placeholder*="Search"]',
      position: "bottom" as const,
    },
    {
      title: "Filter by Status",
      description: "Use the status dropdown to filter grants by their current status: Active, Under Review, Pre-Award, Awarded, Completed, On Hold, or Terminated.",
      target: '[class*="SelectTrigger"]',
      position: "bottom" as const,
    },
    {
      title: "Sort Grants",
      description: "Use the sort dropdown to organize grants by Title, Award Amount, Start Date, or Agency. Use the toggle button to switch between ascending and descending order.",
      target: 'button:has([class*="ChevronUp"])',
      position: "bottom" as const,
    },
    {
      title: "View Toggle",
      description: "Switch between Card View (default) and List View using the view toggle button. Card View shows grant cards with images, while List View shows a table format.",
      target: 'button:has([class*="Grid"])',
      position: "bottom" as const,
    },
    {
      title: "Grant Cards",
      description: "Each grant card shows the grant title, agency, award amount, status badge, and key dates. Click on any card to view the full grant details.",
      target: '#first-grant-card',
      position: "right" as const,
    },
    {
      title: "Grant Status Badges",
      description: "Color-coded badges indicate grant status: Green for Active, Yellow for Under Review, Blue for Pre-Award, Gray for Completed, and Orange for On Hold.",
      target: '#grant-status-badge',
      position: "right" as const,
    },
    {
      title: "New Application",
      description: "Click the 'New Application' button to start a new grant application. This will guide you through the grant application process.",
      target: 'button:has(.lucide-plus)',
      position: "bottom" as const,
    },
  ];

  useEffect(() => {
    fetchGrants();
  }, []);

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/fedsignal/grants");
      const result = await response.json();
      if (result.success) {
        setGrants(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch grants:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "under_review": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pre_award": return "bg-blue-100 text-blue-700 border-blue-200";
      case "awarded": return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed": return "bg-gray-100 text-gray-700 border-gray-200";
      case "on_hold": return "bg-orange-100 text-orange-700 border-orange-200";
      case "terminated": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-4 w-4" />;
      case "under_review": return <Clock className="h-4 w-4" />;
      case "pre_award": return <FileText className="h-4 w-4" />;
      case "awarded": return <CheckCircle2 className="h-4 w-4" />;
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "on_hold": return <AlertCircle className="h-4 w-4" />;
      case "terminated": return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Generate unique Unsplash image URL based on grant title
  const getGrantImage = (title: string) => {
    const keywords = title.split(" ").slice(0, 3).join(",");
    const encodedKeywords = encodeURIComponent(keywords);
    // Use different Unsplash source URLs based on title to ensure uniqueness
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageVariants = [
      `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&auto=format&q=${hash % 10}`,
      `https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1535378437327-b7149cb4863b?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&auto=format`,
      `https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&auto=format&q=${(hash + 1) % 10}`,
    ];
    return imageVariants[hash % imageVariants.length];
  };

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(search.toLowerCase()) ||
                         grant.agency.toLowerCase().includes(search.toLowerCase()) ||
                         grant.grantNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || grant.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "amount":
        comparison = a.totalAwardAmount - b.totalAwardAmount;
        break;
      case "date":
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case "agency":
        comparison = a.agency.localeCompare(b.agency);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Recalculate statistics whenever grants change
  const activeGrants = grants.filter(g => g.status === "active").length;
  const pendingGrants = grants.filter(g => g.status === "under_review" || g.status === "pre_award").length;
  const totalValue = grants.filter(g => g.status === "active").reduce((sum, g) => sum + g.totalAwardAmount, 0);
  const upcomingReports = grants.filter(g => g.nextReportDueDate && new Date(g.nextReportDueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Grant Tracker</h1>
        <div className="flex gap-2">
          <WalkthroughButton onClick={() => setWalkthroughOpen(true)} />
          <Button asChild>
            <Link href="/fedsignal/grants/new">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search grants..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="pre_award">Pre-Award</SelectItem>
            <SelectItem value="awarded">Awarded</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="date">Start Date</SelectItem>
            <SelectItem value="agency">Agency</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          title={sortOrder === "asc" ? "Sort descending" : "Sort ascending"}
        >
          {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
          title={viewMode === "card" ? "Switch to list view" : "Switch to card view"}
        >
          {viewMode === "card" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Active Grants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeGrants}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to filter</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => setStatusFilter(statusFilter === "under_review" ? "all" : "under_review")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingGrants}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to filter</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => setSortBy(sortBy === "amount" ? "title" : "amount")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Active Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">Click to sort by amount</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => setStatusFilter(statusFilter === "all" && filteredGrants.length === upcomingReports ? "all" : "all")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Upcoming Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to filter</p>
          </CardContent>
        </Card>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGrants.map((grant, index) => (
            <Card 
              key={grant.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                highlightedCard === grant.id ? "ring-4 ring-[#4d94ff] ring-offset-2" : ""
              }`}
              id={grant.id === filteredGrants[0]?.id ? "first-grant-card" : undefined}
            >
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                <img
                  src={getGrantImage(grant.title)}
                  alt={grant.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2" id="grant-status-badge">
                      {getStatusIcon(grant.status)}
                      <Badge className={getStatusColor(grant.status)} variant="outline">
                        {grant.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-2">{grant.title}</CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono text-xs">{grant.grantNumber}</span>
                  <Badge variant="secondary">{grant.agency}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {grant.nextReportDueDate && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Next report: {grant.nextReportDueDate}</span>
                  </div>
                )}
                {grant.attachments && grant.attachments.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                    <span>{grant.attachments?.length || 0} attachments</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/fedsignal/grants/${grant.id}`}>View Details</Link>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => window.open(`/api/fedsignal/pipeline/generate?grantId=${grant.id}&format=zip`, '_blank')}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredGrants.map((grant) => (
                <div key={grant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(grant.status)}
                      <span className="font-medium">{grant.title}</span>
                      <Badge className={getStatusColor(grant.status)} variant="outline">
                        {grant.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">{grant.agency}</Badge>
                      {grant.attachments && grant.attachments.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {grant.attachments.length}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-mono">{grant.grantNumber}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        PI: {grant.principalInvestigator.name}
                      </span>
                      {grant.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {grant.startDate} - {grant.endDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <DollarSign className="h-3 w-3" />
                        ${grant.totalAwardAmount.toLocaleString()}
                      </span>
                      {grant.nextReportDueDate && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          Next report: {grant.nextReportDueDate}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-semibold">
                          {grant.milestones ? `${grant.milestones.filter((m: any) => m.status === "completed").length}/${grant.milestones.length}` : "0/0"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/fedsignal/grants/${grant.id}`}>View</Link>
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => window.open(`/api/fedsignal/pipeline/generate?grantId=${grant.id}&format=zip`, '_blank')}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Package
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredGrants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No grants found matching your criteria</p>
          </CardContent>
        </Card>
      )}
      
      <Walkthrough 
        steps={grantTrackerWalkthroughSteps}
        isOpen={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        title="Grant Tracker Guide"
      />
    </div>
  );
}
