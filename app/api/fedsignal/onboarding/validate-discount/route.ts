/**
 * FedSignal Discount Validation API
 * 
 * Validate discount codes and get pricing information
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  DEFAULT_DISCOUNTS,
  getPlanPrice,
  calculateDiscountedPrice,
  SubscriptionTier,
  BillingInterval,
  OrganizationType,
} from "@/lib/fedsignal/onboarding-types";
import { validateDiscountCodeSchema } from "@/lib/fedsignal/onboarding-validators";

// ============================================================================
// POST /api/fedsignal/onboarding/validate-discount - Validate a discount code
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = validateDiscountCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid request data", 
          details: validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) 
        },
        { status: 400 }
      );
    }

    const { code, tier, organizationType, billingInterval } = validation.data;

    // Find the discount
    const discount = DEFAULT_DISCOUNTS.find(
      (d) => d.code === code.toUpperCase()
    );

    if (!discount) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: "Invalid discount code",
      });
    }

    // Check if discount applies to tier
    if (!discount.appliesTo.tiers.includes(tier)) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `This code does not apply to the ${tier} plan`,
        discount: {
          code: discount.code,
          description: discount.description,
          appliesTo: discount.appliesTo.tiers,
        },
      });
    }

    // Check if discount applies to organization type
    if (!discount.appliesTo.organizationTypes.includes(organizationType)) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `This code is not valid for ${organizationType.replace(/_/g, " ")} organizations`,
        discount: {
          code: discount.code,
          description: discount.description,
          validForTypes: discount.appliesTo.organizationTypes,
        },
      });
    }

    // Check billing interval restrictions
    const validForAnnualOnly = (discount as any).validForAnnualOnly;
    if (validForAnnualOnly && billingInterval !== "annual") {
      return NextResponse.json({
        success: false,
        valid: false,
        error: "This code is only valid for annual subscriptions",
        discount: {
          code: discount.code,
          description: discount.description,
        },
      });
    }

    // Calculate pricing
    const basePrice = getPlanPrice(tier, billingInterval);
    const finalPrice = calculateDiscountedPrice(basePrice, discount.percentOff);
    const savings = basePrice - finalPrice;

    return NextResponse.json({
      success: true,
      valid: true,
      discount: {
        code: discount.code,
        description: discount.description,
        percentOff: discount.percentOff,
        amountOff: savings,
        finalPrice,
        duration: discount.duration,
      },
      pricing: {
        basePrice,
        discountAmount: savings,
        finalPrice,
        billingInterval,
      },
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/fedsignal/onboarding/validate-discount - Get available discounts
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgType = searchParams.get("orgType") as OrganizationType | null;
    const tier = searchParams.get("tier") as SubscriptionTier | null;

    let discounts = DEFAULT_DISCOUNTS;

    // Filter by organization type if provided
    if (orgType) {
      discounts = discounts.filter((d) =>
        d.appliesTo.organizationTypes.includes(orgType)
      );
    }

    // Filter by tier if provided
    if (tier) {
      discounts = discounts.filter((d) =>
        d.appliesTo.tiers.includes(tier)
      );
    }

    return NextResponse.json({
      success: true,
      data: discounts.map((d) => ({
        code: d.code,
        description: d.description,
        percentOff: d.percentOff,
        duration: d.duration,
        appliesTo: d.appliesTo,
        validForAnnualOnly: (d as any).validForAnnualOnly || false,
      })),
    });
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}
