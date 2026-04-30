# FedSignal Intelligence Platform

A modern **Next.js 14+** application delivering **federal contracting intelligence** purpose-built for HBCUs and Minority-Serving Institutions (MSIs) competing for $100B+ in annual federal contracts.

## Overview

**FedSignal** helps HBCU research offices, BD teams, and executive leadership win federal contracts through real-time opportunity intelligence, AI-powered proposal tools, and competitive benchmarking against peer institutions.

This platform unifies:
- **Opportunity Intelligence** - Live feeds from SAM.gov, Grants.gov, SBIR.gov
- **AI-Powered Tools** - Proposal writing, capability matching, RFI generation
- **Competitive Analytics** - HBCU scoreboards, peer comparison, win/loss tracking
- **Executive Reporting** - Board reports, President's Brief, strategy dashboards

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React useState/useContext
- **Charts:** Custom responsive visualizations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
Logicore_FedSignalHBCU2-main/
├── app/
│   ├── (fedsignal)/          # FedSignal application
│   │   ├── fedsignal/
│   │   │   ├── page.tsx       # Command Center dashboard
│   │   │   ├── opportunities/ # Opportunity Feed
│   │   │   ├── radar/         # FedSignal Radar
│   │   │   ├── alerts/        # Strategic Alerts
│   │   │   ├── nationallabs/  # National Labs Intelligence
│   │   │   ├── capabilities/  # Capability Graph
│   │   │   ├── leadership/    # Leadership page
│   │   │   ├── scoreboard/    # HBCU Scoreboard
│   │   │   ├── directory/     # HBCU Network Directory
│   │   │   ├── marketplace/   # Contractor Market
│   │   │   ├── consortium/    # Consortiums
│   │   │   ├── proposalpal/   # AI Proposal Pal
│   │   │   ├── rficreator/    # RFI Creator
│   │   │   ├── capvault/      # Capability Vault
│   │   │   ├── contentstudio/ # Content Studio
│   │   │   ├── calendar/      # Content Calendar
│   │   │   ├── crm/           # CRM & Contacts
│   │   │   ├── winloss/       # Win/Loss Tracker
│   │   │   ├── subplan/       # Sub Plan Finder
│   │   │   ├── teaming/       # Teaming Generator
│   │   │   ├── sbir/          # SBIR/STTR Match
│   │   │   ├── fanda/         # F&A Calculator
│   │   │   ├── newsletter/    # Newsletter Builder
│   │   │   ├── gamma/         # Gamma Deck Generator
│   │   │   ├── grants/        # Grant Tracker
│   │   │   ├── reporthub/     # Report Hub
│   │   │   ├── board/         # Board Report
│   │   │   ├── hbcudir/       # HBCU/MSI Directory
│   │   │   ├── branding/      # University Branding
│   │   │   ├── presidentbrief/# President's Brief
│   │   │   ├── pricing/       # Plans & Pricing
│   │   │   ├── profile/       # User Profile
│   │   │   ├── notifications/ # Notifications Settings
│   │   │   └── settings/      # Platform Settings
│   │   └── layout.tsx         # FedSignal layout with sidebar
│   ├── api/                   # API routes
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── fedsignal/             # FedSignal components
│   │   └── fs-sidebar.tsx     # Main navigation sidebar
│   └── shared/                # Shared components
├── lib/                       # Utilities
│   └── fedsignal/
│       └── utils.ts           # FedSignal utilities
└── public/                    # Static assets
```

## Key Features

### Intelligence
- **Command Center** - Real-time dashboard with opportunity pipeline, alerts, and key metrics
- **Opportunity Feed** - Live SAM.gov + Grants.gov opportunities with AI matching
- **SAM.gov Search** - AI-powered natural language search for federal contract opportunities with advanced filters
- **FedSignal Radar** - Trending topics, agency focus areas, emerging opportunities
- **Strategic Alerts** - Policy changes, deadline warnings, competitive moves
- **National Labs** - DOE lab intelligence, proximity mapping, partnership opportunities

### University
- **Capability Graph** - Visual research competency mapping
- **Leadership** - Research leadership profiles and expertise
- **HBCU Scoreboard** - Competitive rankings, peer benchmarks, performance metrics

### Partnerships
- **HBCU Network** - 101 HBCU directory with capability search
- **Contractor Market** - Prime contractor matching and teaming opportunities
- **Consortiums** - Multi-institution collaboration management

### Win Tools
- **Proposal Pal** - AI-powered proposal writing (Shipley-based methodology)
- **RFI Creator** - Automated Request for Information generation

### Content & Growth
- **Capability Vault** - Centralized capability statement repository
- **Content Studio** - AI-assisted content creation for marketing
- **Content Calendar** - Editorial planning and scheduling

### BD & CRM
- **CRM & Contacts** - Relationship management with agency and contractor contacts
- **Win/Loss Tracker** - Deal outcome analysis and lessons learned
- **Sub Plan Finder** - Identify subcontracting opportunities
- **Teaming Generator** - Match with potential partners

### Research Tools
- **SBIR/STTR Match** - Match engine for Small Business Innovation Research opportunities
- **F&A Calculator** - Facilities & Administrative cost calculations with peer comparison

### Publish
- **Newsletter Builder** - Professional email campaigns with AI image generation (Resend integration)
- **Gamma Deck** - AI-powered presentation builder for capability briefs

### Reports
- **Grant Tracker** - Active and historical grant management
- **Report Hub** - Custom report builder with live data export (PDF, Excel, PowerPoint)
- **Board Report** - Executive summaries for trustee meetings

### Branding
- **HBCU/MSI Directory** - Comprehensive institution directory with 700+ MSIs
- **University Branding** - Logo, colors, and brand asset management

### Executive
- **President's Brief** - Quarterly intelligence reports for executive leadership (ADD-ON)
- **Plans & Pricing** - Subscription management and plan comparison

### User Account
- **Profile** - Personal information, role management, password settings
- **Notifications** - Email, SMS, and push notification preferences
- **Settings** - Platform settings including:
  - Integrations (Pexels, Unsplash, Supabase, Grants.gov, SAM.gov, SBIR.gov APIs)
  - LLM Configuration (OpenAI, Anthropic, Ollama local LLM support)
  - Navigation visibility by role
  - Webhooks and API connections

## Pricing Plans

### Research - $9,600/year
- Live Opportunity Feed, AI Proposal Pal, RFI Creator
- Capability Vault, SBIR/STTR Match Engine
- F&A Calculator, HBCU Scoreboard (read-only)
- 3 User seats

### Growth - $14,400/year (MOST POPULAR)
- Everything in Research, plus:
- CRM & Contact Management, Win/Loss Tracker
- Newsletter Builder, Content Studio + Calendar
- Subcontracting Plan Finder, Full Scoreboard + Peer Intel
- 8 User seats

### Enterprise - $18,000/year
- Everything in Growth, plus:
- Gamma Deck Generator, Teaming Agreement Generator
- Board Report Module, White-glove onboarding
- Quarterly strategy call, Unlimited user seats
- Custom NAICS + capability mapping

### Add-Ons
- **President's Brief** - $4,800/year (Quarterly executive intelligence reports)

## Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI / LLM Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Image APIs
PEXELS_API_KEY="..."
UNSPLASH_ACCESS_KEY="..."

# Federal Data APIs
SAM_API_KEY="..."
GRANTS_GOV_API_KEY="..."

# Storage
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or use the Vercel Dashboard for automatic deployments from GitHub.

## Roadmap

### Phase 1 (Current - Complete)
- [x] Marketing website and branding
- [x] FedSignal portal with full navigation
- [x] Command Center dashboard with mock data
- [x] All 20+ portal pages with UI and mock data
- [x] User profile, notifications, and settings
- [x] Pricing and subscription pages

### Phase 2 (Next)
- [ ] Backend API integration with federal data sources
- [ ] Real-time SAM.gov and Grants.gov feeds
- [ ] Authentication with NextAuth.js
- [ ] Database integration with Prisma/PostgreSQL
- [ ] AI integration with LLM providers

### Phase 3 (Future)
- [ ] Mobile application
- [ ] Advanced analytics and predictive intelligence
- [ ] Multi-institution consortium features
- [ ] Automated proposal generation
- [ ] Integration with university grant management systems

## License

Proprietary - FedSignal / LogiCore Solutions

## Contact

- Platform: FedSignal Intelligence Platform
- Purpose: HBCU Federal Contracting Intelligence
- Target: 101 HBCUs competing for $100B+ in federal contracts annually
