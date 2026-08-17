import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }
    const db = adminDb;

    const { formData } = await request.json();
    
    if (!formData || !formData.universityName || !formData.primaryContactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const registrationId = `FS-${Date.now().toString(36).toUpperCase()}`;

    // Create university profile document
    const universityProfile = {
      id: registrationId,
      name: formData.universityName,
      acronym: formData.acronym,
      state: formData.state,
      website: formData.website,
      enrollment: parseInt(formData.enrollment) || 0,
      researchClassification: formData.researchClassification,
      branding: {
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
      },
      primaryContact: {
        name: formData.primaryContactName,
        title: formData.primaryContactTitle,
        email: formData.primaryContactEmail,
        phone: formData.primaryContactPhone,
      },
      researchProfile: {
        capabilities: formData.capabilities,
        researchStrengths: formData.researchStrengths,
        preferredContractTypes: formData.preferredContractTypes,
        targetAgencies: formData.targetAgencies,
        valueRange: {
          min: parseInt(formData.minOpportunityValue) || 100000,
          max: parseInt(formData.maxOpportunityValue) || 5000000,
        },
      },
      teamingPreferences: {
        interested: formData.interestedInTeaming,
        preferredRegions: formData.preferredTeamingRegions,
        complementaryStrengths: formData.complementaryStrengths,
        consortiumInterests: formData.consortiumInterests,
      },
      samGov: {
        registered: formData.samRegistered,
        uei: formData.ueiNumber || null,
        cageCode: formData.cageCode || null,
      },
      teamMembers: formData.teamMembers,
      status: "pending_approval",
      createdAt: timestamp,
      updatedAt: timestamp,
      aiPreferences: {
        recommendationsEnabled: true,
        teamingAlertsEnabled: formData.interestedInTeaming,
        emailFrequency: "weekly",
      },
    };

    // Save to Firestore
    const docRef = db.collection("fs_university_profiles").doc(registrationId);
    await docRef.set(universityProfile);

    // Create welcome email records for each team member
    const emailPromises = formData.teamMembers.map(async (member: any) => {
      if (!member.email) return;
      
      await db.collection("fs_email_queue").add({
        type: "welcome",
        to: member.email,
        universityId: registrationId,
        universityName: formData.universityName,
        recipientName: member.name,
        role: member.role,
        status: "pending",
        createdAt: timestamp,
        scheduledFor: timestamp, // Send immediately
      });
    });

    // Create initial AI recommendations job
    await db.collection("fs_recommendation_jobs").add({
      universityId: registrationId,
      type: "initial_setup",
      status: "pending",
      profile: universityProfile.researchProfile,
      createdAt: timestamp,
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      registrationId,
      message: "Registration submitted successfully",
    });
  } catch (error) {
    console.error("Onboarding submission error:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit registration",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
