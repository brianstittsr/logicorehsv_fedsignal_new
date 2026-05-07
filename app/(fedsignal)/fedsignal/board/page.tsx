"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Share2, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  MapPin,
  MessageSquare,
  Sparkles,
  Filter,
  ArrowUp,
  ArrowDown,
  Building2,
  GraduationCap,
  Search,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

interface School {
  id: string;
  name: string;
  location: string;
  state: string;
  programStrengths: string[];
  grantSuccessRate: number;
  totalAwards: number;
  partnershipScore: number;
  researchDomains: string[];
  lat?: number;
  lng?: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

const mockSchools: School[] = [
  {
    id: "1",
    name: "Howard University",
    location: "Washington, DC",
    state: "DC",
    programStrengths: ["Health Sciences", "Engineering", "Law"],
    grantSuccessRate: 42,
    totalAwards: 156,
    partnershipScore: 95,
    researchDomains: ["Biomedical", "Cybersecurity", "Public Health"],
    lat: 38.9243,
    lng: -77.0213
  },
  {
    id: "2",
    name: "Spelman College",
    location: "Atlanta, GA",
    state: "GA",
    programStrengths: ["STEM", "Arts", "Social Sciences"],
    grantSuccessRate: 38,
    totalAwards: 89,
    partnershipScore: 92,
    researchDomains: ["Women in STEM", "Health Disparities", "Education"],
    lat: 33.7574,
    lng: -84.3744
  },
  {
    id: "3",
    name: "North Carolina A&T",
    location: "Greensboro, NC",
    state: "NC",
    programStrengths: ["Engineering", "Agriculture", "Technology"],
    grantSuccessRate: 45,
    totalAwards: 234,
    partnershipScore: 98,
    researchDomains: ["Aerospace", "Robotics", "Sustainable Energy"],
    lat: 36.0746,
    lng: -79.7855
  },
  {
    id: "4",
    name: "Florida A&M",
    location: "Tallahassee, FL",
    state: "FL",
    programStrengths: ["Health Sciences", "Engineering", "Business"],
    grantSuccessRate: 40,
    totalAwards: 178,
    partnershipScore: 94,
    researchDomains: ["Environmental Health", "Pharmaceuticals", "Agriculture"],
    lat: 30.4376,
    lng: -84.2807
  },
  {
    id: "5",
    name: "Tennessee State",
    location: "Nashville, TN",
    state: "TN",
    programStrengths: ["Agriculture", "Engineering", "Education"],
    grantSuccessRate: 35,
    totalAwards: 112,
    partnershipScore: 88,
    researchDomains: ["Urban Agriculture", "Transportation", "Education"],
    lat: 36.1666,
    lng: -86.7833
  },
  {
    id: "6",
    name: "Jackson State",
    location: "Jackson, MS",
    state: "MS",
    programStrengths: ["Health Sciences", "Engineering", "Technology"],
    grantSuccessRate: 37,
    totalAwards: 95,
    partnershipScore: 90,
    researchDomains: ["Public Health", "Environmental Science", "Data Analytics"],
    lat: 32.3174,
    lng: -90.1779
  },
  {
    id: "7",
    name: "Prairie View A&M",
    location: "Prairie View, TX",
    state: "TX",
    programStrengths: ["Agriculture", "Engineering", "Health Sciences"],
    grantSuccessRate: 41,
    totalAwards: 145,
    partnershipScore: 93,
    researchDomains: ["Agricultural Engineering", "Renewable Energy", "Health"],
    lat: 30.0814,
    lng: -95.9935
  },
  {
    id: "8",
    name: "Hampton University",
    location: "Hampton, VA",
    state: "VA",
    programStrengths: ["Engineering", "Health Sciences", "Marine Science"],
    grantSuccessRate: 39,
    totalAwards: 127,
    partnershipScore: 91,
    researchDomains: ["Aerospace", "Marine Biology", "Physics"],
    lat: 37.0298,
    lng: -76.3453
  }
];

const mockAIRecommendations = [
  {
    id: 1,
    type: "Strategic Partnership",
    priority: "High",
    schools: ["North Carolina A&T", "Howard University"],
    opportunity: "Joint SBIR Phase II application for AI-powered healthcare diagnostics",
    estimatedValue: "$2.5M",
    reasoning: "Both schools have strong biomedical research programs and complementary expertise in AI and healthcare"
  },
  {
    id: 2,
    type: "Consortium Grant",
    priority: "Medium",
    schools: ["Spelman College", "Florida A&M", "Prairie View A&M"],
    opportunity: "NSF ADVANCE grant for women in STEM leadership development",
    estimatedValue: "$1.8M",
    reasoning: "Strong alignment with women in STEM initiatives across all three institutions"
  },
  {
    id: 3,
    type: "Research Collaboration",
    priority: "High",
    schools: ["Hampton University", "Jackson State"],
    opportunity: "DOE grant for renewable energy and environmental sustainability",
    estimatedValue: "$3.2M",
    reasoning: "Complementary research in marine science and environmental health"
  }
];

export default function BoardReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [sortBy, setSortBy] = useState("partnershipScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "ai",
      content: "Welcome to the Board Report AI Assistant. I can help you analyze funding opportunities, identify potential school partnerships, and provide strategic recommendations. What would you like to explore?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [drilldownMetric, setDrilldownMetric] = useState<string | null>(null);

  const filteredSchools = mockSchools
    .filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           school.programStrengths.some(strength => strength.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterState === "all" || school.state === filterState;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "partnershipScore") {
        comparison = a.partnershipScore - b.partnershipScore;
      } else if (sortBy === "grantSuccessRate") {
        comparison = a.grantSuccessRate - b.grantSuccessRate;
      } else if (sortBy === "totalAwards") {
        comparison = a.totalAwards - b.totalAwards;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: generateAIResponse(chatInput)
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("partnership") || lowerQuery.includes("partner")) {
      return "Based on current data, I recommend prioritizing partnerships with North Carolina A&T (98% compatibility), Howard University (95% compatibility), and Florida A&M (94% compatibility). These institutions have strong research programs in areas complementary to your strengths. Would you like me to provide specific collaboration opportunities?";
    } else if (lowerQuery.includes("funding") || lowerQuery.includes("grant")) {
      return "Current pipeline shows $8.4M in opportunities with a 34% win rate. Top opportunities include cybersecurity training ($1.2M), logistics support ($850K), and data analytics ($2.1M). I recommend focusing on the data analytics platform as it aligns with multiple school strengths in AI and technology.";
    } else if (lowerQuery.includes("school") || lowerQuery.includes("university")) {
      return "Our network includes 8 HBCU institutions with strong research capabilities. North Carolina A&T leads in engineering and aerospace research, Howard University excels in health sciences and cybersecurity, while Spelman College has notable strengths in STEM education and health disparities research.";
    } else if (lowerQuery.includes("recommend") || lowerQuery.includes("strategy")) {
      return "Strategic recommendations: 1) Form a consortium with NC A&T and Howard for AI healthcare diagnostics ($2.5M opportunity), 2) Pursue NSF ADVANCE grant with Spelman, Florida A&M, and Prairie View ($1.8M), 3) Collaborate with Hampton and Jackson State on DOE renewable energy grant ($3.2M). These align with your research strengths and have high partnership compatibility.";
    } else {
      return "I can help you analyze funding opportunities, identify school partnerships, and provide strategic recommendations. Try asking about partnerships, funding opportunities, specific schools, or collaboration strategies.";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Board Report</h1>
          <p className="text-muted-foreground">Executive dashboard with AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setDrilldownMetric("opportunities")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">47</div>
            <p className="text-xs text-green-600">↑ 12 this month</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "78%" }} />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setDrilldownMetric("pipeline")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$8.4M</div>
            <p className="text-xs text-green-600">↑ 23% from last quarter</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "85%" }} />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setDrilldownMetric("partners")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-green-600">↑ 3 new this month</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: "65%" }} />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setDrilldownMetric("winrate")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">34%</div>
            <p className="text-xs text-green-600">↑ 5% improvement</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: "34%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="partnerships">School Partnerships</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="chat">Chat with Data</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Funding by Agency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { agency: "NSF", amount: 3.2, color: "bg-blue-500" },
                    { agency: "DoD", amount: 2.8, color: "bg-green-500" },
                    { agency: "HHS", amount: 1.5, color: "bg-purple-500" },
                    { agency: "DOE", amount: 0.9, color: "bg-orange-500" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.agency}</span>
                        <span className="font-semibold">${item.amount}M</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${(item.amount / 3.2) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Research Domain Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { domain: "Health Sciences", percentage: 35, color: "bg-blue-500" },
                    { domain: "Engineering", percentage: 28, color: "bg-green-500" },
                    { domain: "Technology", percentage: 20, color: "bg-purple-500" },
                    { domain: "Social Sciences", percentage: 12, color: "bg-orange-500" },
                    { domain: "Arts & Humanities", percentage: 5, color: "bg-pink-500" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.domain}</span>
                          <span className="font-semibold">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Monthly Funding Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2">
                {[
                  { month: "Jan", value: 1.2 },
                  { month: "Feb", value: 1.5 },
                  { month: "Mar", value: 1.8 },
                  { month: "Apr", value: 2.1 },
                  { month: "May", value: 2.4 },
                  { month: "Jun", value: 2.8 }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${(item.value / 3) * 100}%` }}
                      title={`$${item.value}M`}
                    />
                    <span className="text-xs mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Drilldown Section */}
          {drilldownMetric && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {drilldownMetric.charAt(0).toUpperCase() + drilldownMetric.slice(1)} Drilldown
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setDrilldownMetric(null)}>
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {drilldownMetric === "opportunities" && (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Federal Opportunities</p>
                        <p className="text-2xl font-bold">32</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">State Opportunities</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Private Sector</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                    </>
                  )}
                  {drilldownMetric === "pipeline" && (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Pre-award</p>
                        <p className="text-2xl font-bold">$3.2M</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Under Review</p>
                        <p className="text-2xl font-bold">$4.1M</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Awarded</p>
                        <p className="text-2xl font-bold">$1.1M</p>
                      </div>
                    </>
                  )}
                  {drilldownMetric === "partners" && (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Academic Partners</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Industry Partners</p>
                        <p className="text-2xl font-bold">4</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Government Partners</p>
                        <p className="text-2xl font-bold">2</p>
                      </div>
                    </>
                  )}
                  {drilldownMetric === "winrate" && (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">SBIR</p>
                        <p className="text-2xl font-bold">42%</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">STTR</p>
                        <p className="text-2xl font-bold">38%</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Other</p>
                        <p className="text-2xl font-bold">28%</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                School Partnership Explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schools, programs, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="DC">DC</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partnershipScore">Partnership Score</SelectItem>
                    <SelectItem value="grantSuccessRate">Grant Success Rate</SelectItem>
                    <SelectItem value="totalAwards">Total Awards</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>

              {/* Map Visualization */}
              <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    School Locations
                  </h3>
                  <Badge variant="outline">{filteredSchools.length} schools</Badge>
                </div>
                <div className="relative h-64 bg-white rounded-lg border overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🗺️</div>
                      <p className="text-sm text-muted-foreground">Interactive Map View</p>
                      <p className="text-xs text-muted-foreground">Click school cards to see details</p>
                    </div>
                  </div>
                  {/* School markers */}
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${((school.lng || -80) + 100) / 2}%`,
                        top: `${50 - ((school.lat || 35) - 30) * 3}%`
                      }}
                      onClick={() => setSelectedSchool(school)}
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform" />
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {school.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredSchools.map((school) => (
                  <Card 
                    key={school.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedSchool?.id === school.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedSchool(school)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base mb-1">{school.name}</CardTitle>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {school.location}
                          </p>
                        </div>
                        <Badge className={school.partnershipScore >= 95 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                          {school.partnershipScore}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Program Strengths</p>
                        <div className="flex flex-wrap gap-1">
                          {school.programStrengths.slice(0, 2).map((strength, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                          {school.programStrengths.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{school.programStrengths.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-semibold">{school.grantSuccessRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Awards</p>
                          <p className="font-semibold">{school.totalAwards}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* School Detail Panel */}
          {selectedSchool && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {selectedSchool.name} Details
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSchool(null)}>
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedSchool.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Program Strengths</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedSchool.programStrengths.map((strength, i) => (
                          <Badge key={i} variant="secondary">{strength}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Research Domains</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedSchool.researchDomains.map((domain, i) => (
                          <Badge key={i} variant="outline">{domain}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Grant Success Rate</p>
                      <p className="text-3xl font-bold">{selectedSchool.grantSuccessRate}%</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Awards</p>
                      <p className="text-3xl font-bold">{selectedSchool.totalAwards}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Partnership Score</p>
                      <p className="text-3xl font-bold">{selectedSchool.partnershipScore}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered Funding Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAIRecommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base mb-2">{rec.type}</CardTitle>
                          <Badge className={rec.priority === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>
                            {rec.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-green-600">{rec.estimatedValue}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-2">Partner Schools</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.schools.map((school, i) => (
                            <Badge key={i} variant="secondary">{school}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Opportunity</p>
                        <p className="text-sm text-muted-foreground">{rec.opportunity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">AI Reasoning</p>
                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                      </div>
                      <Button className="w-full">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Explore Partnership
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat with Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white border"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about funding opportunities, partnerships, or strategies..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                />
                <Button onClick={handleChatSubmit}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => { setChatInput("What are the best partnership opportunities?"); }}>
                  Partnership opportunities
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setChatInput("Show me funding strategies"); }}>
                  Funding strategies
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setChatInput("Which schools should I partner with?"); }}>
                  School recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}