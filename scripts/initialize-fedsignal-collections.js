/**
 * Initialize FedSignal Firestore Collections
 * 
 * This script creates initial placeholder documents in each FedSignal collection
 * to ensure they exist in Firestore with proper structure.
 * 
 * Usage: node scripts/initialize-fedsignal-collections.js
 */

// Use dynamic import for Firebase v9+ modular SDK
async function main() {
  const { initializeApp, getApps } = await import('firebase/app');
  const { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    serverTimestamp,
    writeBatch
  } = await import('firebase/firestore');

  // Firebase configuration - uses existing project
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'svp-platform-c348a',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize Firebase (only if not already initialized)
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  // Collections to initialize with their sample data templates
  const collections = [
    { name: 'fedsignal_opportunities', data: createSampleOpportunity() },
    { name: 'fedsignal_grants', data: createSampleGrant() },
    { name: 'fedsignal_sbir_awards', data: createSampleSbirAward() },
    { name: 'fedsignal_alerts', data: createSampleAlert() },
    { name: 'fedsignal_capabilities', data: createSampleCapability() },
    { name: 'fedsignal_teaming_partners', data: createSampleTeamingPartner() },
    { name: 'fedsignal_consortiums', data: createSampleConsortium() },
    { name: 'fedsignal_rfis', data: createSampleRfi() },
    { name: 'fedsignal_proposals', data: createSampleProposal() },
    { name: 'fedsignal_subcontracts', data: createSampleSubcontract() },
    { name: 'fedsignal_scorecards', data: createSampleScorecard() },
    { name: 'fedsignal_win_loss', data: createSampleWinLoss() },
    { name: 'fedsignal_fanda_records', data: createSampleFandaRecord() },
    { name: 'fedsignal_gammadeck_cards', data: createSampleGammadeckCard() },
    { name: 'fedsignal_directory_entries', data: createSampleDirectoryEntry() },
    { name: 'fedsignal_events', data: createSampleEvent() },
    { name: 'fedsignal_tasks', data: createSampleTask() },
    { name: 'fedsignal_contacts', data: createSampleContact() },
    { name: 'fedsignal_newsletters', data: createSampleNewsletter() },
    { name: 'fedsignal_content_assets', data: createSampleContentAsset() },
    { name: 'fedsignal_capvault_docs', data: createSampleCapvaultDoc() },
    { name: 'fedsignal_leadership_profiles', data: createSampleLeadershipProfile() },
    { name: 'fedsignal_board_members', data: createSampleBoardMember() },
    { name: 'fedsignal_marketplace_listings', data: createSampleMarketplaceListing() },
    { name: 'fedsignal_onboarding_flows', data: createSampleOnboardingFlow() },
    { name: 'fedsignal_invites', data: createSampleInvite() },
    { name: 'fedsignal_contracts', data: createSampleContract() },
  ];

  // Sample data creators
  function createSampleOpportunity() {
    return {
      title: 'Sample Federal Opportunity',
      agency: 'Department of Defense',
      naics_codes: ['541330', '541715'],
      set_aside: 'SB',
      response_deadline: serverTimestamp(),
      contract_value: 500000,
      status: 'draft',
      opportunity_type: 'rfp',
      university_id: 'tuskegee',
      match_score: 85,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleGrant() {
    return {
      title: 'Sample Research Grant',
      funding_agency: 'National Science Foundation',
      grant_type: 'federal',
      award_ceiling: 1000000,
      award_floor: 500000,
      deadline: serverTimestamp(),
      eligibility: ['HBCU', 'MSI'],
      status: 'open',
      university_id: 'tuskegee',
      match_score: 90,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleSbirAward() {
    return {
      company_name: 'Sample SBIR Company',
      award_title: 'Advanced Research Project',
      agency: 'DARPA',
      topic_code: 'SB172-001',
      award_amount: 150000,
      award_date: serverTimestamp(),
      phase: 'I',
      topic_title: 'AI for Defense Applications',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleAlert() {
    return {
      title: 'Welcome to FedSignal',
      alert_type: 'system',
      priority: 'medium',
      source: 'FedSignal Platform',
      publish_date: serverTimestamp(),
      is_read: false,
      university_id: 'tuskegee',
      user_id: 'system',
      created_at: serverTimestamp(),
    };
  }

  function createSampleCapability() {
    return {
      capability_name: 'AI/ML Research',
      university_id: 'tuskegee',
      department: 'Computer Science',
      naics_codes: ['541715'],
      keywords: ['AI', 'Machine Learning', 'Data Science'],
      capability_type: 'research',
      availability_status: 'available',
      match_score: 95,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleTeamingPartner() {
    return {
      company_name: 'Sample Defense Contractor',
      company_type: 'large',
      primary_naics: '541330',
      set_asides: ['SB', 'WOSB'],
      location: 'Washington, DC',
      contract_history_count: 25,
      relationship_status: 'prospect',
      match_score: 75,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleConsortium() {
    return {
      consortium_name: 'HBCU Research Alliance',
      lead_university: 'Tuskegee University',
      member_count: 5,
      focus_areas: ['STEM', 'Defense', 'Cybersecurity'],
      status: 'active',
      next_meeting_date: serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleRfi() {
    return {
      rfi_title: 'Sources Sought: Cloud Services',
      agency: 'General Services Administration',
      rfi_number: 'RFI-GSA-2024-001',
      response_deadline: serverTimestamp(),
      status: 'draft',
      assigned_university: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleProposal() {
    return {
      proposal_title: 'Sample Proposal',
      proposal_type: 'contract',
      status: 'drafting',
      submission_deadline: serverTimestamp(),
      requested_amount: 750000,
      completion_percentage: 25,
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleSubcontract() {
    return {
      subcontract_title: 'Sample Subcontract',
      prime_contractor: 'Lockheed Martin',
      university_id: 'tuskegee',
      contract_value: 250000,
      status: 'negotiating',
      start_date: serverTimestamp(),
      end_date: serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleScorecard() {
    return {
      scorecard_name: 'Opportunity Evaluation',
      entity_type: 'opportunity',
      entity_id: 'sample-id',
      entity_name: 'Sample Opportunity',
      total_score: 85,
      scored_by: 'system',
      scored_at: serverTimestamp(),
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
    };
  }

  function createSampleWinLoss() {
    return {
      opportunity_name: 'Sample RFP',
      outcome: 'pending',
      award_amount: 0,
      university_id: 'tuskegee',
      analyzed: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleFandaRecord() {
    return {
      university_id: 'tuskegee',
      fiscal_year: '2024',
      rate_type: 'on_campus',
      negotiated_rate: 56.5,
      provisional_rate: 56.5,
      effective_date: serverTimestamp(),
      status: 'approved',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleGammadeckCard() {
    return {
      card_title: 'Capture Opportunity',
      stage: 'identification',
      probability: 30,
      expected_value: 1000000,
      expected_award_date: serverTimestamp(),
      assigned_to: 'system',
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleDirectoryEntry() {
    return {
      university_name: 'Tuskegee University',
      university_id: 'tuskegee',
      location: 'Tuskegee, AL',
      contact_name: 'John Doe',
      title: 'Director of Research',
      email: 'research@tuskegee.edu',
      phone: '(334) 555-0123',
      primary_naics: ['541330', '541715'],
      certifications: ['ISO 9001', 'CMMI Level 3'],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleEvent() {
    return {
      title: 'FedSignal Training Webinar',
      event_type: 'meeting',
      start_time: serverTimestamp(),
      end_time: serverTimestamp(),
      all_day: false,
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleTask() {
    return {
      title: 'Review Opportunity',
      assigned_to: 'system',
      due_date: serverTimestamp(),
      priority: 'medium',
      status: 'open',
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleContact() {
    return {
      first_name: 'Jane',
      last_name: 'Smith',
      full_name: 'Jane Smith',
      organization: 'Department of Defense',
      title: 'Contracting Officer',
      email: 'jane.smith@defense.gov',
      phone: '(202) 555-0123',
      contact_type: 'government',
      university_id: 'tuskegee',
      last_contact_date: serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleNewsletter() {
    return {
      newsletter_name: 'FedSignal Weekly',
      issue_number: '001',
      publish_date: serverTimestamp(),
      status: 'draft',
      recipient_count: 0,
      open_rate: 0,
      click_rate: 0,
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleContentAsset() {
    return {
      asset_name: 'Sample Capability Brief',
      asset_type: 'document',
      file_url: '',
      thumbnail_url: '',
      tags: ['capability', 'brief'],
      usage_count: 0,
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleCapvaultDoc() {
    return {
      document_name: 'Past Performance Summary',
      document_type: 'past_performance',
      file_url: '',
      expiration_date: serverTimestamp(),
      status: 'current',
      university_id: 'tuskegee',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleLeadershipProfile() {
    return {
      full_name: 'Dr. Robert Johnson',
      title: 'Dean of Research',
      university_id: 'tuskegee',
      department: 'Research Office',
      expertise_areas: ['STEM', 'Research Administration'],
      certifications: ['CPEM', 'PMP'],
      clearance_level: 'Secret',
      available_for_teaming: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleBoardMember() {
    return {
      full_name: 'Advisory Board Member',
      organization: 'Industry Partner Inc.',
      role: 'member',
      expertise_areas: ['Defense Contracting', 'Innovation'],
      term_start: serverTimestamp(),
      term_end: serverTimestamp(),
      status: 'active',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleMarketplaceListing() {
    return {
      listing_title: 'Research Partnership Services',
      provider_university: 'tuskegee',
      service_category: 'Research Collaboration',
      price_range: '$50K - $500K',
      availability: 'available',
      rating: 5.0,
      review_count: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleOnboardingFlow() {
    return {
      flow_name: 'New User Onboarding',
      target_audience: 'faculty',
      step_count: 5,
      completion_rate: 0,
      status: 'active',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  function createSampleInvite() {
    return {
      invited_email: 'user@example.com',
      invited_name: 'New User',
      inviter_name: 'System Admin',
      university_id: 'tuskegee',
      invite_type: 'platform',
      status: 'pending',
      sent_at: serverTimestamp(),
      expires_at: serverTimestamp(),
      created_at: serverTimestamp(),
    };
  }

  function createSampleContract() {
    return {
      contract_number: 'Contract-001',
      contract_title: 'Sample Contract',
      prime_contractor: 'Lockheed Martin',
      university_id: 'tuskegee',
      contract_value: 500000,
      start_date: serverTimestamp(),
      end_date: serverTimestamp(),
      status: 'active',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }

  // Initialize collections
  console.log('🚀 Initializing FedSignal Firestore collections...\n');
  
  try {
    const batch = writeBatch(db);
    
    for (const { name, data } of collections) {
      const collRef = collection(db, name);
      const docRef = doc(collRef, '_init_placeholder');
      batch.set(docRef, data);
      console.log(`✅ ${name}`);
    }
    
    await batch.commit();
    
    console.log('\n✅ All collections initialized successfully!');
    console.log('\n📊 Collections created:');
    console.log(collections.map(c => `  • ${c.name}`).join('\n'));
    console.log('\n🎉 FedSignal schema deployment complete!');
    
  } catch (error) {
    console.error('\n❌ Error initializing collections:', error);
    console.error('\n⚠️  Make sure you have:');
    console.error('  1. Firebase CLI configured: firebase login');
    console.error('  2. Environment variables set or using default dev config');
    console.error('  3. Project ID matches your Firebase project');
    process.exit(1);
  }
}

// Run initialization
main();
