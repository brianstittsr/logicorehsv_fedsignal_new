/**
 * Mock Grant Data for FedSignal Grant Tracker
 * This file contains sample grant records with detailed information
 * including milestones, reports, budgets, and attachments.
 */

import { Timestamp } from "firebase/firestore";

export interface GrantMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completionDate?: string;
  status: "not_started" | "in_progress" | "completed" | "delayed" | "cancelled";
  deliverables: string[];
  responsiblePerson: string;
  progressPercentage?: number;
  notes?: string;
}

export interface GrantReport {
  id: string;
  grantId: string;
  reportType: "progress" | "interim" | "annual" | "final" | "financial" | "technical";
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  status: "draft" | "submitted" | "under_review" | "accepted" | "revisions_required";
  submittedAt?: string;
  dueDate: string;
  executiveSummary: string;
  achievements: string[];
  challenges: string[];
}

export interface GrantBudget {
  period: number;
  startDate: string;
  endDate: string;
  personnel: {
    seniorPersonnel: number;
    otherPersonnel: number;
    fringeBenefits: number;
    total: number;
  };
  equipment: {
    amount: number;
    justification: string;
  };
  travel: {
    domestic: number;
    foreign: number;
    total: number;
    justification: string;
  };
  supplies: {
    amount: number;
    justification: string;
  };
  indirectCosts: {
    rate: number;
    baseAmount: number;
    total: number;
  };
  totalDirectCosts: number;
  totalIndirectCosts: number;
  totalBudget: number;
  actualExpenditures?: {
    personnel: number;
    equipment: number;
    travel: number;
    supplies: number;
    total: number;
  };
  variance?: number;
}

export interface GrantAttachment {
  id: string;
  name: string;
  type: "proposal" | "report" | "deliverable" | "budget" | "personnel" | "other";
  uploadDate: string;
  fileSize: string;
  url: string;
  uploadedBy: string;
}

export interface GrantDetail {
  id: string;
  grantNumber: string;
  title: string;
  agency: "NSF" | "NASA" | "DoD" | "DOE" | "NIH" | "Other";
  agencyProgram?: string;
  opportunityId?: string;
  status: "pre_award" | "under_review" | "awarded" | "active" | "on_hold" | "completed" | "terminated" | "withdrawn";
  universityId: string;
  universityName: string;
  principalInvestigator: {
    name: string;
    email: string;
    title: string;
  };
  coInvestigators?: {
    name: string;
    email: string;
    title: string;
  }[];
  proposalDate: string;
  awardDate?: string;
  startDate: string;
  endDate: string;
  totalAwardAmount: number;
  directCosts: number;
  indirectCosts: number;
  projectSummary: string;
  intellectualMerit: string;
  broaderImpacts: string;
  reportingFrequency: "monthly" | "quarterly" | "semi_annual" | "annual" | "other";
  nextReportDueDate?: string;
  reportingPortal?: string;
  milestones: GrantMilestone[];
  reports: GrantReport[];
  budgets: GrantBudget[];
  attachments: GrantAttachment[];
  finalReportSubmitted?: boolean;
  finalReportDate?: string;
  closeoutDate?: string;
  internalNotes?: string;
  agencyNotes?: string;
}

export const mockGrantDetails: GrantDetail[] = [
  {
    id: "GRANT-001",
    grantNumber: "NSF-25-1234",
    title: "HBCU Cybersecurity Research Initiative",
    agency: "NSF",
    agencyProgram: "HBCU-UP",
    opportunityId: "OPP-25-12345",
    status: "active",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. James Wilson",
      email: "wilson@tuskegee.edu",
      title: "Professor of Computer Science",
    },
    coInvestigators: [
      {
        name: "Dr. Sarah Chen",
        email: "schen@tuskegee.edu",
        title: "Associate Professor",
      },
      {
        name: "Dr. Michael Brown",
        email: "mbrown@tuskegee.edu",
        title: "Research Scientist",
      },
    ],
    proposalDate: "2025-01-15",
    awardDate: "2025-04-01",
    startDate: "2025-09-01",
    endDate: "2028-08-31",
    totalAwardAmount: 250000,
    directCosts: 200000,
    indirectCosts: 50000,
    projectSummary:
      "This project aims to establish a comprehensive cybersecurity research and education program at Tuskegee University, focusing on developing innovative approaches to secure critical infrastructure and train the next generation of cybersecurity professionals.",
    intellectualMerit:
      "The project advances knowledge in cybersecurity by developing novel approaches to threat detection, secure communication protocols, and resilient system architectures.",
    broaderImpacts:
      "The project will train 20 undergraduate and 10 graduate students in cybersecurity, establish partnerships with local HBCUs, and provide cybersecurity workshops for underserved communities.",
    reportingFrequency: "quarterly",
    nextReportDueDate: "2026-06-15",
    reportingPortal: "research.gov",
    milestones: [
      {
        id: "M1",
        title: "Establish Cybersecurity Lab",
        description: "Set up dedicated cybersecurity research lab with required equipment and software",
        dueDate: "2025-12-31",
        completionDate: "2025-12-15",
        status: "completed",
        deliverables: ["Lab setup complete", "Equipment inventory", "Software installation"],
        responsiblePerson: "Dr. James Wilson",
        progressPercentage: 100,
        notes: "Lab successfully established ahead of schedule",
      },
      {
        id: "M2",
        title: "Hire Research Staff",
        description: "Recruit 2 postdoctoral researchers and 4 graduate students",
        dueDate: "2026-03-31",
        completionDate: "2026-03-20",
        status: "completed",
        deliverables: ["Postdoc positions filled", "Graduate students hired"],
        responsiblePerson: "Dr. Sarah Chen",
        progressPercentage: 100,
      },
      {
        id: "M3",
        title: "Develop Curriculum",
        description: "Create cybersecurity curriculum modules for undergraduate and graduate programs",
        dueDate: "2026-06-30",
        status: "in_progress",
        deliverables: ["3 undergraduate modules", "2 graduate modules", "Lab exercises"],
        responsiblePerson: "Dr. Michael Brown",
        progressPercentage: 65,
        notes: "On track, 2 undergraduate modules completed",
      },
      {
        id: "M4",
        title: "Community Workshops",
        description: "Conduct 5 cybersecurity awareness workshops for local communities",
        dueDate: "2026-09-30",
        status: "not_started",
        deliverables: ["5 workshops conducted", "200 participants trained", "Evaluation report"],
        responsiblePerson: "Dr. James Wilson",
        progressPercentage: 0,
      },
      {
        id: "M5",
        title: "Research Publications",
        description: "Publish 3 peer-reviewed research papers in cybersecurity",
        dueDate: "2027-03-31",
        status: "not_started",
        deliverables: ["3 submitted papers", "2 published papers"],
        responsiblePerson: "Dr. Sarah Chen",
        progressPercentage: 0,
      },
    ],
    reports: [
      {
        id: "R1",
        grantId: "GRANT-001",
        reportType: "progress",
        reportPeriod: {
          startDate: "2025-09-01",
          endDate: "2025-12-31",
        },
        status: "accepted",
        submittedAt: "2026-01-10",
        dueDate: "2026-01-15",
        executiveSummary:
          "Q1 progress exceeded expectations. Lab established successfully, staff hired on schedule. Research activities initiated ahead of plan.",
        achievements: [
          "Cybersecurity lab established 2 weeks ahead of schedule",
          "All research staff positions filled",
          "Initial research framework developed",
          "Partnership agreements signed with 2 local HBCUs",
        ],
        challenges: [
          "Equipment delivery delays for specialized hardware",
          "Budget reallocation needed for software licenses",
        ],
      },
      {
        id: "R2",
        grantId: "GRANT-001",
        reportType: "progress",
        reportPeriod: {
          startDate: "2026-01-01",
          endDate: "2026-03-31",
        },
        status: "submitted",
        submittedAt: "2026-04-05",
        dueDate: "2026-04-15",
        executiveSummary:
          "Q2 progress on track. Curriculum development proceeding well. Initial research experiments showing promising results.",
        achievements: [
          "2 curriculum modules completed",
          "First research experiments conducted",
          "Graduate student training program initiated",
        ],
        challenges: [
          "One graduate student withdrew, replacement being recruited",
          "Software compatibility issues with new research tools",
        ],
      },
    ],
    budgets: [
      {
        period: 1,
        startDate: "2025-09-01",
        endDate: "2026-08-31",
        personnel: {
          seniorPersonnel: 60000,
          otherPersonnel: 80000,
          fringeBenefits: 20000,
          total: 160000,
        },
        equipment: {
          amount: 30000,
          justification: "Servers, workstations, and specialized cybersecurity equipment",
        },
        travel: {
          domestic: 5000,
          foreign: 0,
          total: 5000,
          justification: "Conference attendance and collaboration meetings",
        },
        supplies: {
          amount: 5000,
          justification: "Software licenses, office supplies, and research materials",
        },
        indirectCosts: {
          rate: 25,
          baseAmount: 200000,
          total: 50000,
        },
        totalDirectCosts: 200000,
        totalIndirectCosts: 50000,
        totalBudget: 250000,
        actualExpenditures: {
          personnel: 40000,
          equipment: 28000,
          travel: 3000,
          supplies: 4000,
          total: 75000,
        },
        variance: 0,
      },
      {
        period: 2,
        startDate: "2026-09-01",
        endDate: "2027-08-31",
        personnel: {
          seniorPersonnel: 60000,
          otherPersonnel: 80000,
          fringeBenefits: 20000,
          total: 160000,
        },
        equipment: {
          amount: 0,
          justification: "N/A - equipment purchased in period 1",
        },
        travel: {
          domestic: 8000,
          foreign: 2000,
          total: 10000,
          justification: "International conference and collaboration visits",
        },
        supplies: {
          amount: 8000,
          justification: "Ongoing software licenses and research materials",
        },
        indirectCosts: {
          rate: 25,
          baseAmount: 178000,
          total: 44500,
        },
        totalDirectCosts: 178000,
        totalIndirectCosts: 44500,
        totalBudget: 222500,
        variance: 0,
      },
    ],
    attachments: [
      {
        id: "ATT-001",
        name: "NSF-25-1234-Proposal.pdf",
        type: "proposal",
        uploadDate: "2025-01-15",
        fileSize: "2.5 MB",
        url: "/files/grants/GRANT-001/proposal.pdf",
        uploadedBy: "Dr. James Wilson",
      },
      {
        id: "ATT-002",
        name: "Q1-Progress-Report-2026.pdf",
        type: "report",
        uploadDate: "2026-01-10",
        fileSize: "1.8 MB",
        url: "/files/grants/GRANT-001/q1-report.pdf",
        uploadedBy: "Dr. Sarah Chen",
      },
      {
        id: "ATT-003",
        name: "Budget-Justification-Period1.pdf",
        type: "budget",
        uploadDate: "2025-09-15",
        fileSize: "0.8 MB",
        url: "/files/grants/GRANT-001/budget-p1.pdf",
        uploadedBy: "Dr. James Wilson",
      },
      {
        id: "ATT-004",
        name: "Personnel-Biosketches.pdf",
        type: "personnel",
        uploadDate: "2025-01-15",
        fileSize: "1.2 MB",
        url: "/files/grants/GRANT-001/biosketches.pdf",
        uploadedBy: "Dr. James Wilson",
      },
    ],
    internalNotes: "Excellent progress in first year. PI very responsive to reporting requirements.",
    agencyNotes: "Award is proceeding satisfactorily. No concerns at this time.",
  },
  {
    id: "GRANT-002",
    grantNumber: "W52P1J-25-R-0044",
    title: "DoD STEM Education Grant",
    agency: "DoD",
    agencyProgram: "HBCU/MI STEM",
    opportunityId: "W52P1J-25-R-0044",
    status: "under_review",
    universityId: "howard",
    universityName: "Howard University",
    principalInvestigator: {
      name: "Dr. Sarah Chen",
      email: "schen@howard.edu",
      title: "Professor of Engineering",
    },
    coInvestigators: [
      {
        name: "Dr. Robert Johnson",
        email: "rjohnson@howard.edu",
        title: "Associate Professor",
      },
    ],
    proposalDate: "2025-02-01",
    awardDate: undefined,
    startDate: "2025-10-01",
    endDate: "2027-09-30",
    totalAwardAmount: 500000,
    directCosts: 400000,
    indirectCosts: 100000,
    projectSummary:
      "This project aims to enhance STEM education for underrepresented minorities through innovative curriculum development, mentorship programs, and hands-on research experiences in defense-related technologies.",
    intellectualMerit:
      "The project advances STEM education by developing novel approaches to integrate defense research into undergraduate curriculum and creating sustainable mentorship pipelines.",
    broaderImpacts:
      "The project will train 100 undergraduate students, establish partnerships with DoD laboratories, and increase representation of minorities in defense careers.",
    reportingFrequency: "quarterly",
    nextReportDueDate: undefined,
    reportingPortal: "eBRAP",
    milestones: [],
    reports: [],
    budgets: [],
    attachments: [
      {
        id: "ATT-005",
        name: "DoD-Proposal-Submission.pdf",
        type: "proposal",
        uploadDate: "2025-02-01",
        fileSize: "3.2 MB",
        url: "/files/grants/GRANT-002/proposal.pdf",
        uploadedBy: "Dr. Sarah Chen",
      },
    ],
    internalNotes: "Proposal submitted. Awaiting agency decision.",
    agencyNotes: undefined,
  },
  {
    id: "GRANT-003",
    grantNumber: "NNX25AB123C",
    title: "NASA Minority University Research",
    agency: "NASA",
    agencyProgram: "MUREP",
    opportunityId: "NNX25AB123C",
    status: "pre_award",
    universityId: "famu",
    universityName: "Florida A&M University",
    principalInvestigator: {
      name: "Dr. Michael Brown",
      email: "mbrown@famu.edu",
      title: "Professor of Physics",
    },
    coInvestigators: [],
    proposalDate: "2025-03-15",
    awardDate: undefined,
    startDate: "",
    endDate: "",
    totalAwardAmount: 750000,
    directCosts: 600000,
    indirectCosts: 150000,
    projectSummary:
      "This project focuses on space science research and education for minority students, including satellite data analysis, atmospheric studies, and aerospace engineering education.",
    intellectualMerit:
      "The project advances knowledge in space science through novel analysis of satellite data and development of new atmospheric modeling techniques.",
    broaderImpacts:
      "The project will train 30 students in space science, establish a NASA collaboration program, and increase minority representation in aerospace careers.",
    reportingFrequency: "annual",
    nextReportDueDate: undefined,
    reportingPortal: "NSFP",
    milestones: [],
    reports: [],
    budgets: [],
    attachments: [
      {
        id: "ATT-006",
        name: "NASA-MUREP-Proposal-Draft.pdf",
        type: "proposal",
        uploadDate: "2025-03-15",
        fileSize: "4.1 MB",
        url: "/files/grants/GRANT-003/proposal-draft.pdf",
        uploadedBy: "Dr. Michael Brown",
      },
    ],
    internalNotes: "Draft proposal being refined before submission.",
    agencyNotes: undefined,
  },
  {
    id: "GRANT-004",
    grantNumber: "DE-FOA-0001234",
    title: "DOE Cybersecurity Workforce Grant",
    agency: "DOE",
    agencyProgram: "CWD",
    opportunityId: "DE-FOA-0001234",
    status: "active",
    universityId: "ncat",
    universityName: "North Carolina A&T State University",
    principalInvestigator: {
      name: "Dr. Lisa Johnson",
      email: "ljohnson@ncat.edu",
      title: "Professor of Information Technology",
    },
    coInvestigators: [
      {
        name: "Dr. David Kim",
        email: "dkim@ncat.edu",
        title: "Associate Professor",
      },
      {
        name: "Dr. Maria Garcia",
        email: "mgarcia@ncat.edu",
        title: "Research Scientist",
      },
    ],
    proposalDate: "2024-08-01",
    awardDate: "2024-11-15",
    startDate: "2025-08-15",
    endDate: "2027-08-14",
    totalAwardAmount: 400000,
    directCosts: 320000,
    indirectCosts: 80000,
    projectSummary:
      "This project addresses the critical shortage of cybersecurity professionals by developing a comprehensive workforce development program focused on energy sector cybersecurity.",
    intellectualMerit:
      "The project advances knowledge in cybersecurity workforce development through innovative training methodologies and industry partnerships.",
    broaderImpacts:
      "The project will train 50 cybersecurity professionals, establish industry partnerships with energy companies, and enhance cybersecurity resilience in the energy sector.",
    reportingFrequency: "quarterly",
    nextReportDueDate: "2026-05-30",
    reportingPortal: "E-Link",
    milestones: [
      {
        id: "M1",
        title: "Industry Partnership Development",
        description: "Establish partnerships with 5 energy sector companies",
        dueDate: "2025-12-31",
        completionDate: "2026-01-15",
        status: "completed",
        deliverables: ["5 partnership agreements signed", "MOUs executed"],
        responsiblePerson: "Dr. Lisa Johnson",
        progressPercentage: 100,
        notes: "All partnerships established successfully",
      },
      {
        id: "M2",
        title: "Curriculum Development",
        description: "Develop energy sector cybersecurity curriculum",
        dueDate: "2026-03-31",
        status: "in_progress",
        deliverables: ["4 course modules", "Lab exercises", "Industry case studies"],
        responsiblePerson: "Dr. David Kim",
        progressPercentage: 80,
        notes: "3 modules completed, 1 in progress",
      },
      {
        id: "M3",
        title: "Student Training Program",
        description: "Train first cohort of 25 students",
        dueDate: "2026-06-30",
        status: "not_started",
        deliverables: ["25 students enrolled", "Training program completed", "Certification exams passed"],
        responsiblePerson: "Dr. Maria Garcia",
        progressPercentage: 0,
      },
    ],
    reports: [
      {
        id: "R1",
        grantId: "GRANT-004",
        reportType: "progress",
        reportPeriod: {
          startDate: "2025-08-15",
          endDate: "2025-12-31",
        },
        status: "submitted",
        submittedAt: "2026-01-10",
        dueDate: "2026-01-15",
        executiveSummary:
          "Partnership development exceeded expectations. Curriculum development proceeding well. Student recruitment to begin in Q2.",
        achievements: [
          "5 industry partnerships established",
          "3 curriculum modules completed",
          "Training infrastructure set up",
        ],
        challenges: [
          "One industry partner requested revised timeline",
          "Additional funding needed for lab equipment",
        ],
      },
    ],
    budgets: [
      {
        period: 1,
        startDate: "2025-08-15",
        endDate: "2026-08-14",
        personnel: {
          seniorPersonnel: 100000,
          otherPersonnel: 120000,
          fringeBenefits: 30000,
          total: 250000,
        },
        equipment: {
          amount: 40000,
          justification: "Lab equipment and cybersecurity tools",
        },
        travel: {
          domestic: 10000,
          foreign: 0,
          total: 10000,
          justification: "Industry visits and conferences",
        },
        supplies: {
          amount: 20000,
          justification: "Software licenses and training materials",
        },
        indirectCosts: {
          rate: 25,
          baseAmount: 320000,
          total: 80000,
        },
        totalDirectCosts: 320000,
        totalIndirectCosts: 80000,
        totalBudget: 400000,
        actualExpenditures: {
          personnel: 62500,
          equipment: 35000,
          travel: 5000,
          supplies: 15000,
          total: 117500,
        },
        variance: 0,
      },
    ],
    attachments: [
      {
        id: "ATT-007",
        name: "DOE-CWD-Proposal.pdf",
        type: "proposal",
        uploadDate: "2024-08-01",
        fileSize: "2.8 MB",
        url: "/files/grants/GRANT-004/proposal.pdf",
        uploadedBy: "Dr. Lisa Johnson",
      },
      {
        id: "ATT-008",
        name: "Partnership-Agreements.pdf",
        type: "deliverable",
        uploadDate: "2026-01-15",
        fileSize: "1.5 MB",
        url: "/files/grants/GRANT-004/partnerships.pdf",
        uploadedBy: "Dr. Lisa Johnson",
      },
    ],
    internalNotes: "Strong industry partnerships established. Good progress on curriculum.",
    agencyNotes: undefined,
  },
  // Additional mock grants for better filtering and sorting
  {
    id: "GRANT-005",
    grantNumber: "NASA-25-4567",
    title: "Space Technology Research for HBCU Students",
    agency: "NASA",
    agencyProgram: "STEM Engagement",
    opportunityId: "NASA-2025-SPACE-001",
    status: "under_review",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. James Wilson",
      email: "jwilson@tuskegee.edu",
      title: "Professor of Aerospace Engineering",
    },
    coInvestigators: [
      {
        name: "Dr. Sarah Lee",
        email: "slee@tuskegee.edu",
        title: "Associate Professor",
      },
    ],
    startDate: "2025-09-01",
    endDate: "2028-08-31",
    totalAwardAmount: 750000,
    directCosts: 600000,
    indirectCosts: 150000,
    projectSummary: "Develop space technology curriculum and research opportunities for HBCU students in aerospace engineering.",
    intellectualMerit: "Advances space technology education and research capabilities at HBCU institutions.",
    broaderImpacts: "Increases diversity in aerospace workforce through targeted student engagement.",
    milestones: [
      {
        id: "MST-005-1",
        title: "Curriculum Development",
        description: "Develop space technology curriculum modules",
        dueDate: "2025-12-31",
        completionDate: undefined,
        status: "in_progress",
        deliverables: ["Curriculum outline", "Lab materials"],
        responsiblePerson: "Dr. James Wilson",
        progressPercentage: 45,
      },
      {
        id: "MST-005-2",
        title: "Student Internship Program",
        description: "Launch NASA internship program for students",
        dueDate: "2026-06-30",
        completionDate: undefined,
        status: "not_started",
        deliverables: ["Internship agreements", "Student placements"],
        responsiblePerson: "Dr. Sarah Lee",
      },
    ],
    reports: [],
    nextReportDueDate: "2025-12-15",
    budgets: [],
    attachments: [
      {
        id: "ATT-009",
        name: "NASA-Proposal.pdf",
        type: "proposal",
        uploadDate: "2025-03-15",
        fileSize: "3.2 MB",
        url: "/files/grants/GRANT-005/proposal.pdf",
        uploadedBy: "Dr. James Wilson",
      },
    ],
    internalNotes: "Pending NASA review. Strong proposal with clear objectives.",
    agencyNotes: undefined,
    proposalDate: "2025-03-15",
    reportingFrequency: "quarterly",
  },
  {
    id: "GRANT-006",
    grantNumber: "NIH-25-7890",
    title: "Health Disparities Research in Rural Communities",
    agency: "NIH",
    agencyProgram: "Health Equity",
    opportunityId: "NIH-2025-HEALTH-002",
    status: "active",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. Maria Garcia",
      email: "mgarcia@tuskegee.edu",
      title: "Professor of Public Health",
    },
    coInvestigators: [
      {
        name: "Dr. Robert Brown",
        email: "rbrown@tuskegee.edu",
        title: "Associate Professor",
      },
      {
        name: "Dr. Emily Davis",
        email: "edavis@tuskegee.edu",
        title: "Research Scientist",
      },
    ],
    startDate: "2025-01-15",
    endDate: "2027-12-31",
    totalAwardAmount: 1200000,
    directCosts: 960000,
    indirectCosts: 240000,
    projectSummary: "Research health disparities in rural Alabama communities and develop intervention strategies.",
    intellectualMerit: "Addresses critical gaps in health disparities research in underserved populations.",
    broaderImpacts: "Improves health outcomes in rural communities through evidence-based interventions.",
    milestones: [
      {
        id: "MST-006-1",
        title: "Community Assessment",
        description: "Complete baseline health assessment in target communities",
        dueDate: "2025-06-30",
        completionDate: "2025-06-15",
        status: "completed",
        deliverables: ["Assessment report", "Data analysis"],
        responsiblePerson: "Dr. Maria Garcia",
        progressPercentage: 100,
      },
      {
        id: "MST-006-2",
        title: "Intervention Development",
        description: "Develop community-based health interventions",
        dueDate: "2026-03-31",
        completionDate: undefined,
        status: "in_progress",
        deliverables: ["Intervention protocols", "Training materials"],
        responsiblePerson: "Dr. Robert Brown",
        progressPercentage: 60,
      },
    ],
    reports: [
      {
        id: "RPT-006-1",
        grantId: "GRANT-006",
        reportType: "progress",
        reportPeriod: {
          startDate: "2025-01-15",
          endDate: "2025-06-30",
        },
        status: "submitted",
        dueDate: "2025-07-15",
        executiveSummary: "Community assessment completed successfully. Intervention development in progress.",
        achievements: [
          "Completed baseline health assessment",
          "Established community partnerships",
          "Recruited research team",
        ],
        challenges: [
          "Weather delays in field work",
          "Participant recruitment challenges",
        ],
      },
    ],
    nextReportDueDate: "2026-04-15",
    budgets: [],
    attachments: [
      {
        id: "ATT-010",
        name: "IRB-Approval.pdf",
        type: "deliverable",
        uploadDate: "2025-01-20",
        fileSize: "0.5 MB",
        url: "/files/grants/GRANT-006/irb.pdf",
        uploadedBy: "Dr. Maria Garcia",
      },
    ],
    internalNotes: "Excellent progress on community assessment. Strong community engagement.",
    agencyNotes: undefined,
    proposalDate: "2024-11-01",
    reportingFrequency: "semi_annual",
  },
  {
    id: "GRANT-007",
    grantNumber: "DoD-25-3456",
    title: "Advanced Materials for Defense Applications",
    agency: "DoD",
    agencyProgram: "Materials Science",
    opportunityId: "DoD-2025-MAT-003",
    status: "pre_award",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. Kevin Chen",
      email: "kchen@tuskegee.edu",
      title: "Professor of Materials Science",
    },
    coInvestigators: [
      {
        name: "Dr. Angela White",
        email: "awhite@tuskegee.edu",
        title: "Associate Professor",
      },
    ],
    startDate: "2026-01-01",
    endDate: "2029-12-31",
    totalAwardAmount: 2000000,
    directCosts: 1600000,
    indirectCosts: 400000,
    projectSummary: "Develop advanced composite materials for defense and aerospace applications.",
    intellectualMerit: "Pioneering research in lightweight, high-strength composite materials.",
    broaderImpacts: "Strengthens U.S. defense capabilities and creates STEM opportunities for students.",
    milestones: [
      {
        id: "MST-007-1",
        title: "Lab Setup",
        description: "Set up materials testing laboratory",
        dueDate: "2026-03-31",
        completionDate: undefined,
        status: "not_started",
        deliverables: ["Equipment installation", "Safety protocols"],
        responsiblePerson: "Dr. Kevin Chen",
      },
    ],
    reports: [],
    nextReportDueDate: "2026-06-30",
    budgets: [],
    attachments: [
      {
        id: "ATT-011",
        name: "DoD-Proposal.pdf",
        type: "proposal",
        uploadDate: "2025-09-01",
        fileSize: "4.5 MB",
        url: "/files/grants/GRANT-007/proposal.pdf",
        uploadedBy: "Dr. Kevin Chen",
      },
    ],
    internalNotes: "Award expected Q1 2026. Lab preparation underway.",
    agencyNotes: "Pending final review and budget approval.",
    proposalDate: "2025-09-01",
    reportingFrequency: "annual",
  },
  {
    id: "GRANT-008",
    grantNumber: "NSF-25-9012",
    title: "AI for Agriculture Research",
    agency: "NSF",
    agencyProgram: "AI Research",
    opportunityId: "NSF-2025-AI-004",
    status: "completed",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. Fatima Ahmed",
      email: "fahmed@tuskegee.edu",
      title: "Professor of Computer Science",
    },
    coInvestigators: [
      {
        name: "Dr. John Smith",
        email: "jsmith@tuskegee.edu",
        title: "Associate Professor",
      },
    ],
    startDate: "2023-09-01",
    endDate: "2025-08-31",
    totalAwardAmount: 450000,
    directCosts: 360000,
    indirectCosts: 90000,
    projectSummary: "Develop AI-powered tools for precision agriculture in underserved farming communities.",
    intellectualMerit: "Advances AI applications in agricultural technology.",
    broaderImpacts: "Helps small farmers improve crop yields and reduce costs through AI tools.",
    milestones: [
      {
        id: "MST-008-1",
        title: "AI Model Development",
        description: "Develop machine learning models for crop prediction",
        dueDate: "2024-06-30",
        completionDate: "2024-05-15",
        status: "completed",
        deliverables: ["Model code", "Documentation"],
        responsiblePerson: "Dr. Fatima Ahmed",
        progressPercentage: 100,
      },
      {
        id: "MST-008-2",
        title: "Field Testing",
        description: "Test AI tools with local farmers",
        dueDate: "2025-03-31",
        completionDate: "2025-02-28",
        status: "completed",
        deliverables: ["Test results", "User feedback"],
        responsiblePerson: "Dr. John Smith",
        progressPercentage: 100,
      },
    ],
    reports: [
      {
        id: "RPT-008-1",
        grantId: "GRANT-008",
        reportType: "final",
        reportPeriod: {
          startDate: "2023-09-01",
          endDate: "2025-08-31",
        },
        status: "accepted",
        dueDate: "2025-09-15",
        executiveSummary: "Project completed successfully. AI tools deployed to 50 farms with positive feedback.",
        achievements: [
          "Developed 3 AI models for crop prediction",
          "Deployed tools to 50 local farms",
          "Published 2 peer-reviewed papers",
          "Trained 25 students in AI applications",
        ],
        challenges: [
          "Weather affected field testing schedule",
          "Initial model accuracy below expectations, improved through iterations",
        ],
      },
    ],
    nextReportDueDate: undefined,
    budgets: [],
    attachments: [
      {
        id: "ATT-012",
        name: "Final-Report.pdf",
        type: "report",
        uploadDate: "2025-09-10",
        fileSize: "5.2 MB",
        url: "/files/grants/GRANT-008/final-report.pdf",
        uploadedBy: "Dr. Fatima Ahmed",
      },
    ],
    internalNotes: "Successful project completion. Considering follow-on proposal.",
    agencyNotes: "Excellent results. Recommend for future funding opportunities.",
    proposalDate: "2023-06-15",
    reportingFrequency: "annual",
  },
  {
    id: "GRANT-009",
    grantNumber: "NSF-25-5678",
    title: "Quantum Computing Education Initiative",
    agency: "NSF",
    agencyProgram: "Quantum Information",
    opportunityId: "NSF-2025-QUANTUM-001",
    status: "on_hold",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. David Park",
      email: "dpark@tuskegee.edu",
      title: "Professor of Physics",
    },
    coInvestigators: [],
    startDate: "2025-07-01",
    endDate: "2028-06-30",
    totalAwardAmount: 1500000,
    directCosts: 1200000,
    indirectCosts: 300000,
    projectSummary: "Develop quantum computing curriculum and establish quantum research lab at HBCU.",
    intellectualMerit: "Advances quantum computing education in underrepresented institutions.",
    broaderImpacts: "Creates pipeline for diverse talent in quantum computing field.",
    milestones: [
      {
        id: "MST-009-1",
        title: "Curriculum Design",
        description: "Design quantum computing curriculum",
        dueDate: "2025-12-31",
        completionDate: undefined,
        status: "not_started",
        deliverables: ["Course syllabus", "Lab materials"],
        responsiblePerson: "Dr. David Park",
      },
    ],
    reports: [],
    nextReportDueDate: "2026-01-15",
    budgets: [],
    attachments: [
      {
        id: "ATT-013",
        name: "NSF-Quantum-Proposal.pdf",
        type: "proposal",
        uploadDate: "2025-02-01",
        fileSize: "6.8 MB",
        url: "/files/grants/GRANT-009/proposal.pdf",
        uploadedBy: "Dr. David Park",
      },
    ],
    internalNotes: "On hold pending equipment procurement. Awaiting vendor response.",
    agencyNotes: "Funding temporarily suspended pending budget review.",
    proposalDate: "2025-02-01",
    reportingFrequency: "quarterly",
  },
  {
    id: "GRANT-010",
    grantNumber: "DoE-25-2345",
    title: "Renewable Energy Storage Systems",
    agency: "DOE",
    agencyProgram: "Energy Storage",
    opportunityId: "DoE-2025-ENERGY-002",
    status: "active",
    universityId: "tuskegee",
    universityName: "Tuskegee University",
    principalInvestigator: {
      name: "Dr. Rachel Green",
      email: "rgreen@tuskegee.edu",
      title: "Professor of Electrical Engineering",
    },
    coInvestigators: [
      {
        name: "Dr. Michael Scott",
        email: "mscott@tuskegee.edu",
        title: "Associate Professor",
      },
    ],
    startDate: "2025-03-01",
    endDate: "2028-02-28",
    totalAwardAmount: 1800000,
    directCosts: 1440000,
    indirectCosts: 360000,
    projectSummary: "Research and develop advanced battery storage systems for renewable energy integration.",
    intellectualMerit: "Contributes to cutting-edge energy storage research.",
    broaderImpacts: "Supports clean energy transition and creates green jobs.",
    milestones: [
      {
        id: "MST-010-1",
        title: "Battery Prototype",
        description: "Develop first prototype battery system",
        dueDate: "2025-09-30",
        completionDate: "2025-08-20",
        status: "completed",
        deliverables: ["Prototype", "Test results"],
        responsiblePerson: "Dr. Rachel Green",
        progressPercentage: 100,
      },
      {
        id: "MST-010-2",
        title: "Grid Integration",
        description: "Integrate battery system with grid simulation",
        dueDate: "2026-06-30",
        completionDate: undefined,
        status: "in_progress",
        deliverables: ["Integration report", "Performance data"],
        responsiblePerson: "Dr. Michael Scott",
        progressPercentage: 35,
      },
    ],
    reports: [
      {
        id: "RPT-010-1",
        grantId: "GRANT-010",
        reportType: "progress",
        reportPeriod: {
          startDate: "2025-03-01",
          endDate: "2025-09-30",
        },
        status: "accepted",
        dueDate: "2025-10-15",
        executiveSummary: "Battery prototype completed successfully. Grid integration testing underway.",
        achievements: [
          "Exceeded energy density targets by 15%",
          "Published 1 journal article",
          "Established industry partnership",
        ],
        challenges: [
          "Supply chain delays for materials",
          "Unexpected thermal management issues, resolved",
        ],
      },
    ],
    nextReportDueDate: "2026-07-15",
    budgets: [],
    attachments: [
      {
        id: "ATT-014",
        name: "Prototype-Specs.pdf",
        type: "deliverable",
        uploadDate: "2025-08-25",
        fileSize: "1.8 MB",
        url: "/files/grants/GRANT-010/prototype.pdf",
        uploadedBy: "Dr. Rachel Green",
      },
    ],
    internalNotes: "Excellent progress. Exceeding performance targets.",
    agencyNotes: "Strong technical achievements. Continue current trajectory.",
    proposalDate: "2024-12-01",
    reportingFrequency: "quarterly",
  },
];
