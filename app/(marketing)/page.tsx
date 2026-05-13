import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { StatsSection } from "@/components/marketing/stats-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { CTASection } from "@/components/marketing/cta-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  DollarSign, 
  Building2, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Shield, 
  Database, 
  Calendar,
  Award,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  Crown
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      
      {/* FedSignal Feature Showcase */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">HBCU Focus</Badge>
            <h2 className="text-4xl font-bold mb-4">FedSignal Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive federal contracting and grant intelligence designed specifically for Historically Black Colleges and Universities
            </p>
          </div>

          {/* Federal Contracting Opportunities */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-blue-500/20">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Federal Contracting Opportunities</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Real-time access to SAM.gov and FedBizOpps opportunities with AI-powered matching to your HBCU's capabilities. Track RFPs, RFQs, RFIs, and Sources Sought notices with intelligent deadline management.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>AI match scoring for opportunity relevance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Set-aside filtering (HBCU, 8(a), WOSB, HUBZone)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Automated deadline alerts and reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Similar awards and competitor analysis</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto">
                    <Link href="/fedsignal/opportunities">
                      Explore Opportunities <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop" 
                    alt="Federal Contracting Dashboard"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Grants Management */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-green-500/20">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto order-2 md:order-1">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop" 
                    alt="Grants Management"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Grants Intelligence</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive grant database covering federal, private, foundation, and corporate funding opportunities. Track applications from draft to award with built-in proposal management tools.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>NSF, NIH, DoD, and agency-specific grants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Application deadline tracking with alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Budget and cost share requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Similar grants and award history analysis</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto" variant="outline">
                    <Link href="/fedsignal/grants">
                      View Grants <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* SBIR Awards Database */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-purple-500/20">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold">SBIR Awards Database</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Access comprehensive SBIR/STTR award data with detailed information on Phase I, II, and III awards. Analyze award trends, identify research institutions, and discover similar technologies.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Search by topic code, agency, or technology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Principal investigator and institution tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Abstract and keyword analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Related opportunities and technology mapping</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto" variant="secondary">
                    <Link href="/fedsignal/sbir">
                      Browse SBIR Awards <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop" 
                    alt="SBIR Research Innovation"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Real-time Alerts */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-orange-500/20">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto order-2 md:order-1">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop" 
                    alt="Alerts and Notifications"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Real-Time Alerts</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Never miss an opportunity with intelligent alerts for new opportunities, approaching deadlines, news updates, and system notifications. Customize alert preferences by priority and type.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Opportunity deadline reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>New opportunity notifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Agency news and policy updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Priority-based filtering</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto" variant="outline">
                    <Link href="/fedsignal/alerts">
                      Manage Alerts <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Capabilities Catalog */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-indigo-500/20">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Database className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Capabilities Catalog</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Showcase your HBCU's research and technical capabilities with a comprehensive catalog. Track equipment, certifications, past performance, and key personnel to improve match scores with opportunities.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Research and technical capability profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Equipment and facilities inventory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Certifications and compliance tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>NAICS code and keyword optimization</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto">
                    <Link href="/fedsignal/capabilities">
                      Manage Capabilities <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1531480307125-6e4553e1d2d0?w=800&auto=format&fit=crop" 
                    alt="Research Capabilities"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Teaming Partners */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-teal-500/20">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto order-2 md:order-1">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop" 
                    alt="Teaming Partners"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg">
                      <Users className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Teaming Partners</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                      Build strategic partnerships with large contractors, small businesses, nonprofits, and academic institutions. Track relationship status, contract history, and communication to optimize teaming opportunities.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Partner discovery and matching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Set-aside complementarity analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Contract history and capabilities review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Communication tracking and notes</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto" variant="secondary">
                    <Link href="/fedsignal/teaming">
                      Find Partners <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Proposal Management */}
          <div className="mb-20">
            <Card className="overflow-hidden border-2 border-rose-500/20">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-rose-100 rounded-lg">
                      <FileText className="h-8 w-8 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Proposal Management</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    End-to-end proposal development and submission tracking. Manage narrative sections, budgets, team members, subcontractors, and attachments with version control and review checklists.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Narrative section templates and AI assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Budget line item tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Team and subcontractor management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Version history and collaboration</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full md:w-auto">
                    <Link href="/fedsignal/proposals">
                      Manage Proposals <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop" 
                    alt="Proposal Development"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-cyan-100 rounded-lg w-fit mb-3">
                  <Shield className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle>Scorecards</CardTitle>
                <CardDescription>Evaluate opportunities and proposals with weighted criteria scoring</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/fedsignal/scorecards">View Scorecards</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-yellow-100 rounded-lg w-fit mb-3">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Win/Loss Analysis</CardTitle>
                <CardDescription>Track wins and losses with lessons learned and improvement actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/fedsignal/win-loss">Analyze Results</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-pink-100 rounded-lg w-fit mb-3">
                  <Building2 className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Consortiums</CardTitle>
                <CardDescription>Manage research and contracting consortium memberships</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/fedsignal/consortiums">View Consortiums</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-amber-100 rounded-lg w-fit mb-3">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Events & Tasks</CardTitle>
                <CardDescription>Calendar integration for deadlines, meetings, and action items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/fedsignal/events">Manage Calendar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-3">
                  <Search className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>HBCU Directory</CardTitle>
                <CardDescription>Contracting office directory with capabilities and contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/fedsignal/directory">Browse Directory</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-violet-100 rounded-lg w-fit mb-3">
                  <Zap className="h-6 w-6 text-violet-600" />
                </div>
                <CardTitle>CAPVault</CardTitle>
                <CardDescription>Capability documents and past performance repository</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/fedsignal/capvault">Access Documents</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Freemium CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                Start Free Forever
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                No Credit Card Required. Start in 60 Seconds.
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Join 2,000+ HBCUs and minority-owned businesses already using FedSignal. 
                Track 5 opportunities free, upgrade only when you need more power.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Free Starter plan — track 5 opportunities at no cost</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span>30-day free trial on Professional and Enterprise</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span>HBCU 50% discount available on all paid plans</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Cancel anytime — no long-term contracts</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/fedsignal/register">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            <Card className="border-2 border-blue-500/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Simple Pricing</CardTitle>
                    <CardDescription>Choose what works for you</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Save 16% Annually</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Zap className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Starter</p>
                        <p className="text-sm text-muted-foreground">5 opportunities</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">Free</span>
                  </div>
                  <div className="p-4 flex items-center justify-between bg-blue-50/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Crown className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Professional</p>
                        <p className="text-sm text-muted-foreground">Unlimited + AI</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">$99</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Enterprise</p>
                        <p className="text-sm text-muted-foreground">Advanced intelligence</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">$199</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/pricing">See Full Comparison</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">2,000+</div>
              <p className="text-slate-400">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">100+</div>
              <p className="text-slate-400">HBCU Partners</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">$500M+</div>
              <p className="text-slate-400">Opportunities Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">15%</div>
              <p className="text-slate-400">Free-to-Paid Conversion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Win Your Next Federal Contract?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of HBCUs and minority-owned businesses already using FedSignal. 
            Start free, upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/fedsignal/register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
