/**
 * FedSignal Subscription Plans API
 * 
 * Get available subscription plans and pricing
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  SUBSCRIPTION_PLANS,
  DEFAULT_DISCOUNTS,
  getPlanPrice,
  calculateDiscountedPrice,
  SubscriptionTier,
  BillingInterval,
  OrganizationType,
} from "@/lib/fedsignal/onboarding-types";

// ============================================================================
// GET /api/fedsignal/onboarding/plans - Get all plans
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get("tier") as SubscriptionTier | null;
    const interval = searchParams.get("interval") as BillingInterval | null;
    const orgType = searchParams.get("orgType") as OrganizationType | null;
    const discountCode = searchParams.get("discountCode");

    // If specific tier requested, return single plan
    if (tier) {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier);
      if (!plan) {
        return NextResponse.json(
          { error: "Plan not found" },
          { status: 404 }
        );
      }

      // Calculate pricing with discounts
      const pricing = calculatePlanPricing(
        tier,
        interval || "monthly",
        orgType,
        discountCode
      );

      return NextResponse.json({
        success: true,
        data: {
          ...plan,
          pricing,
        },
      });
    }

    // Return all plans with pricing
    const plansWithPricing = SUBSCRIPTION_PLANS.map((plan) => ({
      ...plan,
      pricing: {
        monthly: calculatePlanPricing(plan.tier, "monthly", orgType, discountCode),
        annual: calculatePlanPricing(plan.tier, "annual", orgType, discountCode),
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        plans: plansWithPricing,
        discounts: DEFAULT_DISCOUNTS,
      },
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculatePlanPricing(
  tier: SubscriptionTier,
  interval: BillingInterval,
  orgType: OrganizationType | null,
  discountCode: string | null
) {
  const basePrice = getPlanPrice(tier, interval);
  let discountPercent = 0;
  let appliedDiscount = null;

  // Check explicit discount code
  if (discountCode) {
    const discount = DEFAULT_DISCOUNTS.find(
      (d) => d.code === discountCode.toUpperCase()
    );
    if (discount) {
      const appliesToTier = discount.appliesTo.tiers.includes(tier);
      const appliesToOrgType = !orgType || discount.appliesTo.organizationTypes.includes(orgType);
      const appliesToInterval = !(discount as any).validForAnnualOnly || interval === "annual";
      
      if (appliesToTier && appliesToOrgType && appliesToInterval) {
        discountPercent = discount.percentOff;
        appliedDiscount = discount;
      }
    }
  }

  // Apply automatic discounts for HBCU/MOB if no explicit code
  if (!discountCode && orgType) {
    switch (orgType) {
      case "hbcu":
        discountPercent = Math.max(discountPercent, 50);
        appliedDiscount = DEFAULT_DISCOUNTS.find((d) => d.code === "HBCU50");
        break;
      case "minority_owned_business":
        discountPercent = Math.max(discountPercent, 25);
        appliedDiscount = DEFAULT_DISCOUNTS.find((d) => d.code === "MOB25");
        break;
    }
  }

  const finalPrice = calculateDiscountedPrice(basePrice, discountPercent);
  const savings = basePrice - finalPrice;

  return {
    basePrice,
    discountPercent,
    discountAmount: savings,
    finalPrice,
    interval,
    appliedDiscount: appliedDiscount
      ? {
          code: appliedDiscount.code,
          description: appliedDiscount.description,
          percentOff: appliedDiscount.percentOff,
        }
      : null,
  };
}
