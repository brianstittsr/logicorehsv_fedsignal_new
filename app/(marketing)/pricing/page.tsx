"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Crown, 
  Building2, 
  Check,
  ArrowRight,
  Target,
  DollarSign,
  Users,
  Award,
  Sparkles,
  Shield,
  Clock,
  BarChart3,
  Search,
  Bell,
  FileText
} from "lucide-react";
import Link from "next/link";

const pricingTiers = {
  monthly: [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      badge: "Free Forever",
      description: "Perfect for exploring federal contracting opportunities",
      icon: Zap,
      highlighted: false,
      features: [
        { icon: Search, text: "Track up to 5 opportunities" },
        { icon: Bell, text: "Weekly set-aside alerts (HBCU, 8(a), WOSB)" },
        { icon: FileText, text: "Basic SAM.gov search & filters" },
        { icon: Users, text: "Community access & educational content" },
        { icon: Clock, text: "Deadline reminders" },
      ],
      cta: "Get Started Free",
      ctaVariant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      badge: "Most Popular",
      description: "For HBCUs and small businesses ready to scale",
      icon: Crown,
      highlighted: true,
      features: [
        { icon: Search, text: "Unlimited opportunity tracking" },
        { icon: Sparkles, text: "AI-powered opportunity scoring" },
        { icon: Target, text: "Recompete predictions (12-24 months)" },
        { icon: Users, text: "Teaming partner matching" },
        { icon: DollarSign, text: "Grant intelligence & tracking" },
        { icon: Bell, text: "Real-time alerts & notifications" },
        { icon: BarChart3, text: "Competitor analysis & insights" },
        { icon: Award, text: "Set-aside opportunity scanner" },
      ],
      cta: "Start 30-Day Free Trial",
      ctaVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      badge: "Best Value",
      description: "Advanced intelligence for growing teams",
      icon: Building2,
      highlighted: false,
      features: [
        { icon: Search, text: "Everything in Professional" },
        { icon: Shield, text: "Compliance readiness scoring" },
        { icon: BarChart3, text: "Pricing intelligence & benchmarking" },
        { icon: Target, text: "Go/No-Go decision support" },
        { icon: Users, text: "Relationship intelligence" },
        { icon: FileText, text: "Advanced analytics & reporting" },
        { icon: Award, text: "Team collaboration (up to 10 seats)" },
        { icon: Clock, text: "Priority support & onboarding" },
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
    },
  ],
  annual: [
    {
      name: "Starter",
      price: "$0",
      period: "/year",
      badge: "Free Forever",
      description: "Perfect for exploring federal contracting opportunities",
      icon: Zap,
      highlighted: false,
      features: [
        { icon: Search, text: "Track up to 5 opportunities" },
        { icon: Bell, text: "Weekly set-aside alerts (HBCU, 8(a), WOSB)" },
        { icon: FileText, text: "Basic SAM.gov search & filters" },
        { icon: Users, text: "Community access & educational content" },
        { icon: Clock, text: "Deadline reminders" },
      ],
      cta: "Get Started Free",
      ctaVariant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$999",
      period: "/year",
      badge: "Most Popular • Save 16%",
      description: "For HBCUs and small businesses ready to scale",
      icon: Crown,
      highlighted: true,
      savings: "Save $189/year",
      features: [
        { icon: Search, text: "Unlimited opportunity tracking" },
        { icon: Sparkles, text: "AI-powered opportunity scoring" },
        { icon: Target, text: "Recompete predictions (12-24 months)" },
        { icon: Users, text: "Teaming partner matching" },
        { icon: DollarSign, text: "Grant intelligence & tracking" },
        { icon: Bell, text: "Real-time alerts & notifications" },
        { icon: BarChart3, text: "Competitor analysis & insights" },
        { icon: Award, text: "Set-aside opportunity scanner" },
      ],
      cta: "Start 30-Day Free Trial",
      ctaVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "$1,999",
      period: "/year",
      badge: "Best Value • Save 16%",
      description: "Advanced intelligence for growing teams",
      icon: Building2,
      highlighted: false,
      savings: "Save $389/year",
      features: [
        { icon: Search, text: "Everything in Professional" },
        { icon: Shield, text: "Compliance readiness scoring" },
        { icon: BarChart3, text: "Pricing intelligence & benchmarking" },
        { icon: Target, text: "Go/No-Go decision support" },
        { icon: Users, text: "Relationship intelligence" },
        { icon: FileText, text: "Advanced analytics & reporting" },
        { icon: Award, text: "Team collaboration (up to 10 seats)" },
        { icon: Clock, text: "Priority support & onboarding" },
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
    },
  ],
};

const comparisonFeatures = [
  { name: "Opportunity Tracking", starter: "5 opportunities", professional: "Unlimited", enterprise: "Unlimited" },
  { name: "SAM.gov Integration", starter: "Basic", professional: "Full", enterprise: "Full" },
  { name: "Set-Aside Alerts", starter: "Weekly digest", professional: "Real-time", enterprise: "Real-time" },
  { name: "AI Opportunity Scoring", starter: false, professional: true, enterprise: true },
  { name: "Recompete Predictions", starter: false, professional: "12-24 months", enterprise: "12-24 months" },
  { name: "Teaming Partner Matching", starter: false, professional: true, enterprise: "Advanced" },
  { name: "Grant Intelligence", starter: false, professional: true, enterprise: true },
  { name: "Competitor Analysis", starter: false, professional: true, enterprise: "Advanced" },
  { name: "Compliance Scoring", starter: false, professional: false, enterprise: true },
  { name: "Pricing Intelligence", starter: false, professional: false, enterprise: true },
  { name: "Go/No-Go Support", starter: false, professional: false, enterprise: true },
  { name: "Relationship Intelligence", starter: false, professional: false, enterprise: true },
  { name: "Team Seats", starter: "1", professional: "3", enterprise: "10" },
  { name: "Support", starter: "Community", professional: "Email", enterprise: "Priority" },
  { name: "Onboarding", starter: "Self-service", professional: "Guided", enterprise: "Dedicated" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Start Free. Scale as You Grow.
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join 2,000+ HBCUs and minority-owned businesses using FedSignal to win federal contracts. 
            No credit card required to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/fedsignal/register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="#compare">Compare Plans</Link>
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>30-day free trial on all paid plans</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>HBCU 50% discount available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-200">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">
                  Annual
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                    Save 16%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly">
              <div className="grid md:grid-cols-3 gap-8">
                {pricingTiers.monthly.map((tier) => (
                  <PricingCard key={tier.name} tier={tier} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="annual">
              <div className="grid md:grid-cols-3 gap-8">
                {pricingTiers.annual.map((tier) => (
                  <PricingCard key={tier.name} tier={tier} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* HBCU Discount CTA */}
          <Card className="mt-12 border-blue-200 bg-blue-50/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">HBCU & Minority Business Discount</h3>
                    <p className="text-muted-foreground">
                      Accredited HBCUs receive 50% off all paid plans. 8(a), HUBZone, and WOSB certified businesses receive 25% off.
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/contact">Apply for Discount</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Comparison */}
      <section id="compare" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare All Features</h2>
            <p className="text-muted-foreground">
              Everything you need to win federal contracts, at every stage of your journey
            </p>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Starter</th>
                    <th className="text-center p-4 font-semibold text-blue-600">Professional</th>
                    <th className="text-center p-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <tr key={feature.name} className={idx % 2 === 0 ? "bg-slate-50/50" : ""}>
                      <td className="p-4 font-medium">{feature.name}</td>
                      <td className="p-4 text-center">
                        {typeof feature.starter === "boolean" ? (
                          feature.starter ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-sm">{feature.starter}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-blue-50/30">
                        {typeof feature.professional === "boolean" ? (
                          feature.professional ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-sm font-medium text-blue-600">{feature.professional}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )
                        ) : (
                          <span className="text-sm">{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about getting started
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is the free plan really free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! The Starter plan is free forever. No credit card required, no time limits. 
                  Track up to 5 opportunities, get weekly set-aside alerts, and access our educational content library.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the 30-day free trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start with full Professional or Enterprise features for 30 days. No credit card required. 
                  At the end of your trial, choose to upgrade or continue with the free Starter plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer HBCU discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! Accredited HBCUs receive 50% off all paid plans. We also offer 25% discounts 
                  for 8(a), HUBZone, WOSB, and other certified minority-owned businesses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade, downgrade, or cancel anytime. Annual plan changes take effect at the next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, ACH transfers, and purchase orders for annual Enterprise plans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
    </div>
  );
}

function PricingCard({ tier }: { tier: any }) {
  const Icon = tier.icon;
  return (
    <Card className={`relative overflow-hidden ${tier.highlighted ? "border-blue-500 border-2 shadow-xl scale-105" : ""}`}>
      {tier.badge && (
        <div className={`absolute top-0 right-0 text-xs px-3 py-1 rounded-bl-lg font-medium ${
          tier.highlighted 
            ? "bg-blue-600 text-white" 
            : "bg-slate-200 text-slate-700"
        }`}>
          {tier.badge}
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${tier.highlighted ? "bg-blue-100" : "bg-slate-100"}`}>
            <Icon className={`h-6 w-6 ${tier.highlighted ? "text-blue-600" : "text-slate-600"}`} />
          </div>
          <CardTitle className="text-xl">{tier.name}</CardTitle>
        </div>
        
        <div className="mt-4">
          <span className="text-4xl font-bold">{tier.price}</span>
          <span className="text-muted-foreground">{tier.period}</span>
        </div>
        
        {tier.savings && (
          <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
            {tier.savings}
          </Badge>
        )}
        
        <CardDescription className="mt-2">{tier.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {tier.features.map((feature: any, idx: number) => {
            const FeatureIcon = feature.icon;
            return (
              <li key={idx} className="flex items-start gap-3">
                <div className={`p-1 rounded ${tier.highlighted ? "bg-blue-100" : "bg-slate-100"}`}>
                  <FeatureIcon className={`h-4 w-4 ${tier.highlighted ? "text-blue-600" : "text-slate-600"}`} />
                </div>
                <span className="text-sm">{feature.text}</span>
              </li>
            );
          })}
        </ul>
        
        <Button 
          className={`w-full ${tier.highlighted ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          variant={tier.ctaVariant}
          size="lg"
          asChild
        >
          <Link href="/fedsignal/register">
            {tier.cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
