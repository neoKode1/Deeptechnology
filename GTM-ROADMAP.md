# Deeptech — Go-To-Market Strategy & Roadmap
**Version 3.0 · April 2026 · Full codebase + architecture audit**
*Founder: Chad Neo · Live: deeptechnologies.dev · Divisions: Software · Robotics · Creative*

---

## Table of Contents

1. [What Deeptech Actually Is](#1-what-deeptech-actually-is)
2. [The Three-Horizon Model](#2-the-three-horizon-model)
3. [Horizon 1 — Activate (Q2–Q3 2026)](#3-horizon-1--activate-q2q3-2026)
4. [Horizon 2 — Scale (Q4 2026–Q2 2027)](#4-horizon-2--scale-q4-2026q2-2027)
5. [Horizon 3 — Platform (Q3 2027–2028)](#5-horizon-3--platform-q3-20272028)
6. [Automated Marketing System](#6-automated-marketing-system)
7. [Architecture Gap Analysis](#7-architecture-gap-analysis)
8. [Market Readiness Gaps](#8-market-readiness-gaps)
9. [Complete Gap Registry](#9-complete-gap-registry)
10. [Phase Execution Plans](#10-phase-execution-plans)
11. [Execution Stack](#11-execution-stack)
12. [Revenue Model](#12-revenue-model)
13. [The Three Things That Matter Most Right Now](#13-the-three-things-that-matter-most-right-now)

---

## 1. What Deeptech Actually Is

After a full codebase audit — the quote lifecycle, the Nimbus sourcing engine, the vendor intelligence
database, Stripe webhook handlers, admin routing system, and customer-facing AI chat — what has been
built is not a consulting agency with a website. It is the foundation of an **AI-native B2B procurement
marketplace** for physical autonomous systems.

### What the Infrastructure Already Supports

| Capability | Source in Codebase |
|---|---|
| Automated AI sourcing via Nimbus (Claude-powered agent) | `src/lib/nimbus.ts` + `GOOGLE_CLOUD_FUNCTION_URL` |
| 14-stage order fulfillment lifecycle | `src/lib/quotes/types.ts` — `QuoteStatus` |
| Dual billing: one-time CapEx + monthly RaaS | `src/app/api/checkout/route.ts` + Stripe subscription |
| Full Stripe webhook handling with idempotency | `src/app/api/webhook/route.ts` |
| Customer-facing AI order tracking (Claude) | `src/app/api/chat/route.ts` + `/orders/[id]` |
| Admin command center with routing decisions | `src/app/admin/quotes/page.tsx` |
| 14-vendor intelligence database with live pricing | `src/data/vendors.ts` |
| Net-30/60 enterprise payment terms | `pending_net_terms` status in quote type |
| Service fee retention on cancellations | `CancellationRecord` in `store.ts` |
| Enterprise fast-track requisition | `/enterprise/requisition` + API route |
| Professional transactional email | Resend + `info@deeptechnologies.dev` |

### The Core Business Model

Deeptech operates as an **AI-powered autonomous systems integrator** with a 15% default markup on all
hardware sourced through the Nimbus pipeline, consulting fees on software engagements, and a growing
recurring revenue layer through RaaS subscriptions and post-deployment fleet optimization retainers.

### The GTM Problem

The problem is not product — it is **traffic and first transactions**. Everything needed to close,
charge, and fulfill a multi-thousand dollar robotics order already exists. The strategy below is built
around that reality. Every phase assumes the infrastructure works and focuses on putting qualified
buyers in front of it — automatically.

---

## 2. The Three-Horizon Model

| Horizon | Period | Theme | Revenue Target |
|---|---|---|---|
| **H1 — Activate** | Q2–Q3 2026 | First 5 paid orders through full pipeline | $50K–$150K GMV |
| **H2 — Scale** | Q4 2026–Q2 2027 | Repeatable acquisition + recurring revenue | $500K–$1M ARR |
| **H3 — Platform** | Q3 2027–2028 | Self-serve marketplace + white-label | $5M ARR |

### Milestone Gates

- **H1 → H2 unlock:** 5 closed orders, Nimbus confirmed end-to-end, first vendor partner agreement signed
- **H2 → H3 unlock:** $500K ARR, Postgres migration complete, customer auth live, 2 channel partners active
- **H3 unlock:** Fleet monitoring SaaS has 3 paying subscribers, white-label licensing first contract signed

---

## 1.5 Competitive Landscape

The document would be incomplete without answering the question every enterprise buyer and any future
investor asks in the second sentence: **"Who else does this? Why you?"**

### Competitive Categories

| Competitor Type | Examples | Their Limitation | Deeptech's Edge |
|---|---|---|---|
| **Traditional robotics integrators** | Bastian Solutions, Honeywell Intelligrated, RobotWorx | Vendor-tied, $500K+ minimum engagement, 6–18 month sales cycle, no AI sourcing | Vendor-agnostic, AI-native pipeline, weeks not months, accessible price point |
| **Vendor direct sales** | Kiwibot, Starship, Serve Robotics (selling direct) | Can only sell their own product — no comparative assessment, no environment fit analysis | Full market view across 14+ vendors, environment-first recommendation |
| **RaaS-only platforms** | 6 River Systems, Dorabot, Locus Robotics | SaaS subscription model only, no flexibility, limited deployment environments | CapEx + RaaS + hybrid — buyer chooses, Deeptech handles both billing modes |
| **General AI procurement tools** | Zip, Coupa, Fairmarkit | No robotics domain knowledge, no vendor intelligence, no physical deployment support | Deep robotics domain expertise + live vendor DB + post-deployment support |
| **Robotics consulting firms** | Graymatrix, RoboticsBiz | Human-only sourcing, slow, expensive, no automated pipeline | Nimbus AI sourcing in < 1 hour vs. weeks of manual analysis |

### The Defensible Moat

No competitor currently operates with all five of the following simultaneously:
1. Vendor-agnostic across 14+ verified vendors in 4 robot categories
2. AI-powered sourcing engine (Nimbus) that produces draft quotes in under an hour
3. Live transactional pipeline (Stripe CapEx + RaaS subscriptions) — not just lead gen
4. 14-stage fulfillment tracking with customer-facing AI chat
5. Post-deployment fleet optimization retainer creating recurring revenue

This is the statement that goes in every sales email, every pitch deck opening, and on the `/about`
page when it is built: *"The only vendor-agnostic, AI-native robotics sourcing and integration
operator with a live transactional pipeline."*



---

## 3. Horizon 1 — Activate (Q2–Q3 2026)

### The Goal
Prove the pipeline end-to-end. One customer fills out the contact form → Nimbus sources → admin
reviews → quote sent → Stripe payment → order fulfilled. Do this 5 times. Everything else is secondary.

---

### 3.1 Fix the Foundation First (Week 1)

Before spending a dollar on outreach, close these gaps. Each takes under 2 hours.

**Domain & Brand Consistency**
The codebase references `deeptechnologies.dev` in email headers, Stripe success URLs, webhook configs,
and the sitemap — but the live site is at `deeptech.varyai.link`. Point `deeptechnologies.dev` to the
live deployment immediately. Every email sent by Resend already comes from `info@deeptechnologies.dev`.
The domain mismatch creates trust issues at the moment a customer is deciding whether to wire $75K.

**Email Consolidation**
Three addresses appear across the codebase: `1deeptechnology@gmail.com` (admin fallback and contact
page copy), `info@varyai.link` (old README), `info@deeptechnologies.dev` (Resend, Stripe, enterprise
emails). Consolidate all external-facing communication to `info@deeptechnologies.dev`. Remove Gmail
from the `/contact` page. Set `ADMIN_EMAIL=info@deeptechnologies.dev` in Vercel env vars.

**Nimbus End-to-End Smoke Test**
The `NIMBUS_STUB=1` flag suggests the full pipeline has not run in production. Before outbound begins,
run a complete test: submit a contact form → confirm Nimbus fires → watch draft quote appear in
`/admin/quotes` → approve → send → pay via Stripe test mode. Close every loop before real leads arrive.

---

### 3.2 Robotics — Direct Outbound Engine (Weeks 2–8)

The robotics division has the most complete pipeline. Close robots first.

#### Target Segments (Priority Order)

| Priority | Segment | Why | Key Contacts |
|---|---|---|---|
| 1 | Ghost kitchen & food delivery operators | Kiwibot $899/mo lease maps perfectly to their unit economics | VP Ops at Ghost Kitchen Brands, Reef, CloudKitchens |
| 2 | University campus facilities managers | Adjacent campuses to existing Starship/Kiwibot deployments | Director of Facilities, Campus Services |
| 3 | Last-mile logistics operators (SF/LA) | CA sidewalk bot regulations are permissive — can deploy now | VP Logistics, Director of Last Mile |
| 4 | Warehouse operators under 200K sq ft | Need a sourcing advisor, not a $500K integrator | VP Operations, Supply Chain Director |

#### Outreach Sequencing (3-touch LinkedIn DM sequence per contact)

| Touch | Timing | Message Angle | CTA |
|---|---|---|---|
| Message 1 | D+0 | Specific environment challenge for their vertical | ROI calculator link |
| Message 2 | D+3 | Enterprise requisition — "4 minutes → term sheet today" | `/enterprise/requisition` |
| Message 3 | D+7 | ROI snapshot or vendor spotlight for their industry | Pilot program `/pilot` |

The enterprise requisition form *is* the discovery call. Never pitch a separate meeting as the first CTA.

#### Volume Targets
- Weeks 1–2: 20 contacts (manual)
- Weeks 3–4: 40 contacts (20/week cadence)
- Weeks 5–8: 60 contacts/week (Expandi LinkedIn automation live)

---

### 3.3 Software — Package Before You Pitch (Weeks 3–6)

Add three fixed-scope SKUs to `/software` with visible pricing anchors before any software outbound.

| SKU | Scope | Price | Proof Points |
|---|---|---|---|
| **AI Readiness Audit** | 2-week codebase assessment + AI opportunity roadmap | $4,500 | TheNoelleApp, 12 Monkeys |
| **AI Integration Sprint** | 4-week LLM/agent integration into one production system | $18K–$35K | Scam Likely, EdgeQuanta |
| **Agent Platform Build** | 8–12 week greenfield autonomous agent system | $60K–$120K | Breach, 12 Monkeys |

---

### 3.4 Pilot Program — Activate the Empty Route (Weeks 4–8)

`/api/pilot-request` exists as an empty directory. Build it. It removes the #1 robotics sales objection.

**Pricing:** Flat $2,500–$5,000 pilot fee based on fleet size (1 unit = $2,500 · 2–3 units = $5,000).
This covers sourcing, vendor coordination, and go-live support. The full fee is applied as a credit
toward the complete fleet order at conversion. Non-refundable if the pilot completes without
conversion. This structure eliminates the "free trial" expectation and pre-qualifies serious buyers.

**Structure:** 30-day paid pilot · 1–3 units · Deeptech manages sourcing + go-live · Day 30: convert
to full fleet (CapEx or RaaS with pilot fee credited), extend for another 30 days, or exit with no
further obligation.

**Build required:**
- `/pilot` landing page with intake form
- `POST /api/pilot-request` → creates `pending_review` quote record in Redis + emails admin
- Add to main nav and every robotics CTA

---

### 3.5 Vendor Partner Agreements (Weeks 3–8)

| Vendor | Contact in vendors.ts | Partnership Type |
|---|---|---|
| Kiwibot | `mariaf.valdez@kiwibot.com` | Certified Deployment Partner for unserved markets |
| Starship | `business@starship.co` | Service contract reseller for hospitality/medical/residential |
| Unitree | ToborLife (Mountain View CA) | Authorized US reseller of G1 EDU ($13,500 direct) |

**Pitch:** Pre-qualified enterprise customers + live Stripe checkout. Vendors get better leads than cold
inbound. Deeptech gets dealer margin + integration consulting fees.



---

## 4. Horizon 2 — Scale (Q4 2026–Q2 2027)

### The Goal
Build repeatable acquisition channels that do not require new sales conversations for every dollar of
revenue. By end of H2: 10+ concurrent orders in the pipeline, recurring revenue live, channel partner
network producing inbound leads, and Noelle auto-routing software quotes without admin intervention.

---

### 4.1 The RaaS Flywheel

The Stripe subscription infrastructure is fully built — `mode: 'subscription'`,
`invoice.payment_succeeded` webhook, `customer.subscription.deleted` cancellation handler. Every
robotics customer who starts on a CapEx purchase should be upsold to a **Fleet Optimization Retainer**
post-deployment.

**Fleet Optimization Retainer (post-`deployed` status):**
- Monthly route tuning, performance monitoring, incident response
- $2,000–$5,000/month depending on fleet size
- Billed via Stripe subscription on existing customer record
- Triggered automatically when quote reaches `deployed` status → Resend sequence fires

**Conversion script:** "Your robots have been live for 30 days. Here is the actual vs. projected ROI.
Here is what we can improve next month with optimization. For $X/month, we handle it for you."

---

### 4.2 Software Retainer Model

After every completed Sprint engagement, offer a 3-month minimum retainer:
- Ongoing LLM/agent maintenance + model upgrades as frontier models improve
- Additional integration sprints at 20% reduced rate
- $5,000–$8,000/month billed via Stripe subscription
- One-page retainer agreement, DocuSign, auto-renewing

---

### 4.3 Noelle Auto-Routing for Software Quotes

The admin routing system already has a `noelle` destination. When a software inquiry arrives through
the contact form, trigger Noelle (`thenoelle.app`) to:
1. Assess the GitHub repo if provided in the intake form
2. Draft a scope-of-work proposal based on project type + tech stack fields
3. Generate a quote via `POST /api/quotes` using the Noelle admin route

This closes the software sales automation loop — equivalent to what Nimbus does for robotics. A
software inquiry comes in, Noelle produces a scoped quote, admin reviews and sends it, customer pays
via Stripe. Same 14-stage pipeline, different sourcing agent.

---

### 4.4 Content Engine at Scale

Founder-led content is the highest-ROI channel for a solo technical operator. Target: 2 posts/week,
every week, 52 weeks/year. Use Claude (already in stack) to accelerate drafting.

**Weekly cadence:**
- **Monday:** Technical deep-dive — one specific problem solved or pattern discovered
- **Thursday:** Industry observation — robotics market move, vendor update, AI integration trend

**High-performing content types for Deeptech specifically:**
- "I just sourced a 3-bot Kiwibot fleet for a ghost kitchen in Oakland. Actual vs. projected ROI after
  30 days." (Robotics operators share this)
- "We added a Claude agent to a 7-year-old Express.js API without touching a single existing route.
  Here's the pattern." (Engineers share this)
- "Tesla Optimus is `not_available` in our vendor database. Here's why and what to use right now."
  (Robotics enthusiasts share this)
- "The difference between Serve Robotics (B2B partner only) and Kiwibot (direct lease)." (Buyers
  Google this)

**Automation:** Use `/api/chat` (Claude, already live) to draft posts from a brief. Chad reviews,
edits for voice, schedules via Typefully. Time: 20 minutes/week instead of 3+ hours.

---

### 4.5 Public Vendor Intelligence API

`src/data/vendors.ts` is a hand-curated database of 14 verified vendors with procurement paths, live
pricing, lead times, and US dealer contacts. This is more accurate than anything on vendor marketing
sites or LinkedIn.

**Productization path:**
- Expose `GET /api/vendors` (filtered, paginated, auth-gated)
- Free tier: 100 queries/month (requires email signup → enters lead nurture sequence)
- Pro tier: $99/month unlimited — billed via Stripe
- Developer who uses the API is a potential referral source or direct robotics customer

---

### 4.6 Individual Robot Landing Pages (SEO Engine)

Generate 14+ pages from `vendors.ts` data programmatically:
`/robotics/kiwibot-leap` · `/robotics/serve-gen3` · `/robotics/boston-dynamics-spot` · etc.

Each page includes: specs, pricing, deployment environments, ROI calculator pre-filtered for that
robot, comparison to 1–2 alternatives, and a CTA to get a quote or start a pilot.

These pages rank for: "[Robot Name] price", "[Robot Name] deployment cost", "[Robot Name] for
[industry]" — all high commercial-intent search queries. Update `sitemap.ts` to generate URLs
dynamically from `vendors.ts` so they are indexed immediately.

---

## 5. Horizon 3 — Platform (Q3 2027–2028)

### The Goal
Productize the infrastructure into a self-serve marketplace and white-label platform. Transition from
project-based revenue to subscription-dominant recurring revenue.

---

### 5.1 Self-Serve Quote Portal

Today, quotes require Nimbus + admin review. The goal in H3 is a self-serve portal where a buyer can:
1. Describe their environment (intake form — already built)
2. See AI-matched vendor recommendations in real time (synchronous Nimbus)
3. Accept a quote and pay without admin involvement for orders under $50K

The infrastructure is already complete. The only missing piece is making admin review optional for
known-good vendor/product combinations where pricing is fixed and `direct_online` is the buy path
(e.g., a Kiwibot Leap lease, a Unitree G1 EDU purchase).

---

### 5.2 Fleet Monitoring SaaS Dashboard

Post-deployment, every Deeptech customer is in `deployed` status with Claude chat on `/orders/[id]`.
Extend this to a full fleet monitoring dashboard at `/dashboard`:
- Real-time delivery count via vendor API integrations
- Monthly ROI vs. pre-deployment calculator projection
- Route performance heatmaps
- Renewal and fleet expansion recommendations
- Billed at $2,000–$8,000/month per fleet as Stripe subscription

This converts a one-time hardware transaction into a recurring SaaS subscription — the highest-margin,
most defensible revenue model available.

---

### 5.3 White-Label Sourcing

The Nimbus sourcing engine + vendor intelligence DB + quote pipeline is a complete backend that can be
licensed to:
- **Logistics SaaS companies** adding a robotics sourcing layer to their existing platform
- **Commercial real estate operators** offering tenants autonomous delivery as a building amenity
- **Government procurement offices** requiring compliant autonomous systems sourcing

White-label pricing: $5,000–$20,000/month per licensee. The API-first architecture, vendor DB as a
data layer, and Stripe payment infrastructure already support this without code changes.

---

### 5.4 The Deeptech OS Vision

By 2028, the three divisions converge into a single integrated platform:

| Layer | Division | Role |
|---|---|---|
| **Hardware** | Robotics | Source, deploy, and monitor autonomous physical systems |
| **Intelligence** | Software | Build and maintain the AI agents running those systems |
| **Media** | Creative | Document, market, and sell the deployed systems via AI-generated content |

A logistics company that deploys a Deeptech-sourced Kiwibot fleet, gets a Deeptech-built AI route
optimization agent, and receives a Deeptech-produced marketing video of their fleet in operation — that
is a full-stack client worth $200K+/year with all three divisions billing concurrently.

The `inquiryType` field in `src/lib/quotes/types.ts` already includes `'Media solutions'` alongside
`'Software solutions'` and `'Autonomous solutions'` — the commercial model is structurally present.



---

## 6. Automated Marketing System

> **The core design principle:** Every step in the funnel must have an automated fallback. If Chad
> doesn't respond in 2 hours — the system follows up. If a quote expires — the system sends a pilot
> offer. If a customer deploys — the system starts the retention sequence. Chad's time is reserved for
> what only Chad can do: reviewing sourcing results, approving quotes, and closing enterprise deals.

---

### 6.1 Pillar 1 — Automated Lead Capture (Currently: Zero)

Every high-intent surface on the site captures no email today. This must change before any paid
acquisition begins.

**Gate the ROI Calculator**
The most expensive missed conversion on the site. Every person who runs the calculator has a number,
a deployment in mind, and a budget range. They are warm leads. Gate the full formatted ROI report
behind an email field. The calculation runs client-side (no friction); the PDF report requires an
email. Estimated lead capture: 30–50% of calculator users.

**Build:** `POST /api/roi-capture` → save email + ROI parameters to Redis → trigger Resend D+0
sequence → create HubSpot Contact via Make.com webhook.

**Gate Vendor Comparison Downloads**
Create 3–5 "Vendor Comparison" PDFs (e.g., "Kiwibot vs. Starship for Campus Delivery"). Gate them
behind an email form. These rank for comparison searches and convert research-mode buyers.

**Pilot Program Intake**
`/pilot` page captures company, environment, robot type, fleet goal — all high-intent signals. Every
submission automatically creates a `pending_review` quote record and enters the pilot nurture sequence.

**Newsletter / Market Update**
Monthly "Autonomous Systems Market Update" — vendor news, new deployments, ROI benchmarks. Email
capture on every page footer. Low friction, high long-term value for buyers in research phase.

---

### 6.2 Pillar 2 — Resend Email Sequences (Currently: Transactional Only)

Resend is already installed and already has a verified domain. The email infrastructure is live. What
is missing is the sequence logic. Build these five sequences using Resend batch sends + Vercel Cron.

#### Sequence 1 — ROI Calculator Lead
*Trigger: Email captured via ROI calculator gate*

| Step | Timing | Content |
|---|---|---|
| Email 1 | D+0 | ROI report PDF + "Here's what this means for your operation" |
| Email 2 | D+3 | Vendor spotlight — most relevant robot for their input parameters |
| Email 3 | D+7 | Pilot program offer — "Test for 30 days before committing" |
| Email 4 | D+14 | Personal note from Chad — "Happy to talk through this" + direct link |

#### Sequence 2 — Contact Form Nurture
*Trigger: `POST /api/contact` submission confirmed*

| Step | Timing | Content |
|---|---|---|
| Email 1 | D+0 | Confirmation + what to expect next (Nimbus sourcing, timeline) |
| Email 2 | D+3 | Case study or portfolio item relevant to their inquiry type |
| Email 3 | D+7 | Pilot offer (robotics) or AI Audit offer (software) |
| Email 4 | D+14 | Last-touch: personal note from Chad, direct calendar link |

#### Sequence 3 — Quote Follow-Up
*Trigger: Quote status transitions to `sent`*

| Step | Timing | Content |
|---|---|---|
| Email 1 | D+0 | Quote delivery: summary, breakdown, accept button |
| Email 2 | D+3 | "Have questions?" — Claude chat link + direct reply encouraged |
| Email 3 | D+7 | Pilot upgrade offer — "Start smaller, scale when ready" |
| Email 4 | D+8 | Expiry warning — "Quote expires in 24 hours" |

#### Sequence 4 — Enterprise Requisition Bridge
*Trigger: `POST /api/enterprise/requisition` submission*

| Step | Timing | Content |
|---|---|---|
| Email 1 | D+0 | Acknowledgment — "Term sheet in progress. Expected: within hours." |
| Email 2 | D+1 | Admin sends term sheet manually (triggered from admin panel) |

#### Sequence 5 — Post-Deployment Retention
*Trigger: Quote status transitions to `deployed`*

| Step | Timing | Content |
|---|---|---|
| Email 1 | M+1 | 30-day check-in — "How are the robots performing?" |
| Email 2 | M+3 | Fleet expansion offer — "ROI data suggests [X] more units" |
| Email 3 | M+6 | Fleet Optimization Retainer offer — "Let us run the numbers" |
| Email 4 | M+12 | Annual review + renewal + upgrade options |

**Implementation:** Store sequence state in Redis as `sequence:{email}:{sequenceName}:{step}`. A
Vercel Cron job runs daily, checks for leads that need the next email, fires via Resend. All sequence
logic lives in `/lib/sequences/` alongside the existing `/lib/quotes/` pattern.

---

### 6.3 Pillar 3 — LinkedIn Automation (Currently: Fully Manual)

Manual outbound at 5 min/contact = 100+ minutes/week at 20 contacts. This does not scale. Three
LinkedIn sequences running via Expandi.io ($99/month):

#### Sequence A — Robotics Operators
*Target: VP Operations, Director of Facilities, Head of Last Mile at F&B/logistics/campus companies*

| Step | Action | Message |
|---|---|---|
| Day 1 | Visit profile | — |
| Day 2 | Connection request | "Working on autonomous deployment sourcing for [industry] operators. Would love to connect." |
| Day 5 | Message 1 | "[Pain point for their vertical]. We built an ROI calculator that models the exact unit economics — might be useful: [link]" |
| Day 9 | Message 2 | "If you're even 20% curious, this form takes 4 minutes and produces a term sheet today: [enterprise/requisition link]" |

#### Sequence B — Software Engineering Leaders
*Target: VP Engineering, CTO, Head of AI at Series A–C companies*

| Step | Action | Message |
|---|---|---|
| Day 1 | Visit profile | — |
| Day 2 | Connection request | "Building AI integration tooling for production stacks. Happy to connect." |
| Day 5 | Message 1 | "We do a 2-week AI readiness audit for production codebases — maps what can be enhanced without a rewrite. Starting from $4,500. Worth a look: [software page link]" |
| Day 9 | Message 2 | Direct GitHub repo offer — "If you have a repo you want a quick assessment on, I'm happy to do a 15-minute async review." |

#### Sequence C — Vendor Channel Partners
*Target: Partnerships/Sales at Kiwibot, Starship, Serve Robotics, Unitree, Agility Robotics*

| Step | Action | Message |
|---|---|---|
| Day 1 | Visit profile | — |
| Day 2 | Connection request | "Independent robotics sourcing and integration. Building a partner network for [vendor]'s technology." |
| Day 5 | Message 1 | "We're deploying [vendor] systems for [segment] operators in [region]. Interested in a formal deployment partner arrangement?" |

**Volume:** 15 new contacts/day per sequence (within LinkedIn safe limits). Total: ~300 new outbound
touches/month running automatically.

---

### 6.4 Pillar 4 — Retargeting Pixels (Currently: None)

Every visitor who leaves without converting is currently lost forever. Three pixels to install in
`src/app/layout.tsx` via Next.js `<Script>` tags, behind cookie consent:

| Pixel | Audience | Ad Message |
|---|---|---|
| **Meta Pixel** | Visited `/robotics` but didn't submit | "30-day robotics pilot. No commitment." |
| **Meta Pixel** | Used ROI calculator | "Your ROI estimate is ready. Here's what fleet optimization adds." |
| **LinkedIn Insight Tag** | Visited `/enterprise/requisition` | Sponsored InMail: "Term sheet within hours." |
| **Google Ads Remarketing** | Any site visit | Google Display: "AI-native robotics sourcing. Vendor-agnostic." |

**Budget:** Start at $20/day Meta + $20/day LinkedIn. Scale based on CPA data from PostHog.
Retargeting CPAs for B2B are typically 3–8x better than cold audiences — and audience building starts
from day one, so install the pixels before spending a dollar on ads.

---

### 6.5 CRM — The Missing System of Record

Every lead today goes to an email inbox. There is no CRM, no deal pipeline, no lead history, no
attribution. This means you cannot tell which channel drove your best customers, cannot prioritize
follow-up by deal value, and cannot hand off context to anyone else.

**Tool:** HubSpot Free CRM — free forever, deal pipelines, contact records, email sequencing.

**What flows into HubSpot automatically via Make.com:**

| Trigger | Action in HubSpot |
|---|---|
| `/api/contact` submission | Create Contact + Deal (stage: "Lead") |
| `/api/enterprise/requisition` submission | Create Deal (stage: "Term Sheet Requested") |
| `/api/roi-capture` submission | Create Contact + Deal (stage: "Researching", score: warm) |
| Quote status → `sent` | Update Deal stage → "Quote Sent" |
| Stripe `checkout.session.completed` | Update Deal → "Closed Won", log revenue |
| Quote status → `expired` | Update Deal → "Follow Up", trigger Resend sequence |
| Quote status → `deployed` | Create new Deal → "Fleet Expansion Opportunity" |

**Lead Scoring Model (auto-applied in HubSpot):**

| Signal | Score | Source Field |
|---|---|---|
| Budget > $25K | +30 | `intake.budgetRange` |
| Timeline = ASAP | +25 | `intake.timeline` |
| Employee count 201+ | +20 | `form.employeeCount` |
| Submitted enterprise requisition | +40 | Form source |
| Ran ROI calculator | +15 | `/api/roi-capture` |
| Opened 2+ emails | +10 | Resend webhook |

Score ≥ 80 = hot lead → Chad notified immediately. Score 40–79 = warm → auto-nurture. Score < 40 =
cold → low-touch sequence only.



---

## 7. Architecture Gap Analysis

### 7.1 Critical Issues — Fix Before Any Outbound Begins

---

#### 🔴 GAP-01 — Package Name Is Wrong
**File:** `package.json` line 2
**Issue:** `"name": "a-dark-orchestra-films"` — the Creative Division's old project name. Affects npm
scripts, debugging metadata, and any Docker/CI tooling.
**Fix:** Change to `"deeptech"` or `"deeptechnologies"`. One line. Five minutes.

---

#### 🔴 GAP-02 — Upstash Redis Is the Only Persistence Layer
**Files:** `src/lib/quotes/store.ts`, all API routes
**Issue:** Redis is an in-memory key-value store. It is the single persistence layer for every quote,
order, payment record, message thread, and fulfillment event in the business. At hundreds of quotes
this is painful. At thousands it becomes dangerous. Redis has no relational queries, no ACID
transactions, no schema enforcement, and no point-in-time backup that enterprise buyers expect.
**Fix:** Migrate to Neon serverless PostgreSQL + Prisma ORM (both free tier, Vercel Marketplace).
Redis stays for sessions, rate limiting, and caching. Business data moves to Postgres. This is a
significant refactor but must happen before $500K GMV. See Phase 3 in Section 10.

---

#### 🔴 GAP-03 — Admin Auth Is a Single Shared Cookie Secret
**Files:** `src/lib/admin-auth.ts`, `src/app/api/admin/login/route.ts`
**Issue:** The cookie value *is* the secret. `admin_token=<ADMIN_SECRET>` is compared by string
equality. Anyone who intercepts the cookie has full admin access — can view all quotes, cancel orders,
and trigger Stripe refunds. No JWT expiry, no RBAC, no audit log, no session invalidation.
**Fix:** Replace with Clerk (free tier, Next.js native, 10K MAU free) or NextAuth with a proper JWT
strategy + role-based organization membership. Takes 2–3 hours to implement.

---

#### 🔴 GAP-04 — No Rate Limiting on Any API Route
**Files:** Every route handler in `src/app/api/`
**Issue:** `/api/contact`, `/api/chat`, and `/api/checkout` are open to unlimited requests. The Claude
chat route can be drained to $0 in minutes by a single malicious bot. The contact route can be spam-
flooded. Stripe checkout can be probed.
**Fix:** `@upstash/ratelimit` is a drop-in — Upstash is already in the stack. Add per-IP sliding
window limits to each public-facing route handler in one function call. Two hours of work total.

---

#### 🔴 GAP-05 — Enterprise Requisition Creates No System Record
**File:** `src/app/api/enterprise/requisition/route.ts`
**Issue:** The route sends an email, logs to console, and returns `{ success: true }`. The lead exists
only in an email inbox. If that email is missed, deleted, or misfiled, the lead is permanently lost.
There is no Redis record, no admin dashboard entry, no CRM event.
**Fix:** After sending the admin email, also call `createQuote()` with the requisition data as a
`pending_review` quote. It will appear in `/admin/quotes` automatically. Adds one function call.

---

### 7.2 High-Priority Issues — Fix Before $250K GMV

---

#### 🟡 GAP-06 — No Analytics
**Files:** `src/app/layout.tsx` has no analytics script
**Issue:** Zero visibility into conversion funnel. No data on which robots get the most views, where
users drop off in the contact form, which source drives enterprise requisitions, or what the ROI
calculator-to-contact conversion rate is.
**Fix:** PostHog (open source, 1M events/month free) + Vercel Analytics (zero config). Install both
in `layout.tsx`. Add custom events: `roi_calculator_run`, `contact_form_started`,
`contact_form_submitted`, `quote_accepted`, `checkout_completed`, `pilot_request_submitted`.

---

#### 🟡 GAP-07 — No Error Tracking or Observability
**Issue:** When Nimbus fails, when Stripe webhooks error, or when Claude is unavailable, the only
signal is `console.error()` in Vercel function logs. No alerts, no aggregation, no stack traces.
**Fix:** Sentry (free tier, Next.js SDK, 5 minutes to install). Wrap all API route handlers. Add
Sentry breadcrumbs to quote lifecycle transitions for full traceability.

---

#### 🟡 GAP-08 — Claude Chat Has No Conversation History
**File:** `src/app/api/chat/route.ts` line 36
**Issue:** The `messages` array always contains exactly one entry — the current user message. Claude
has no context from prior turns. Customers asking follow-up questions get incoherent responses.
**Fix:** Store conversation history in Redis keyed by `orderId` as `chat:{orderId}:history`. Load
last N messages (capped at 10 for token budget). Pass full history in each Claude API call.
~20 lines of code.

---

#### 🟡 GAP-09 — `images: { unoptimized: true }` in next.config.js
**File:** `next.config.js` line 5
**Issue:** Disables all Next.js image optimization — no WebP conversion, no lazy loading, no
responsive srcsets. Measurable Core Web Vitals regression for a site with robot imagery.
**Fix:** Remove `unoptimized: true`. Use Next.js `<Image>` component with explicit dimensions.
For external vendor image URLs, add them to `images.remotePatterns` in config.

---

#### 🟡 GAP-10 — Outdated Next.js (14) and React (18)
**File:** `package.json`
**Issue:** `next: "^14.2.0"`, `react: "^18.3.1"`. Next.js 15 includes improved Server Actions,
Partial Prerendering, and `after()` for post-response side effects (ideal for async Nimbus triggers).
React 19 includes concurrent rendering improvements.
**Fix:** `npm install next@latest react@latest react-dom@latest`. Run build. Likely zero breaking
changes for this codebase.

---

#### 🟡 GAP-11 — `nodemailer` Installed but Unused
**File:** `package.json`
**Issue:** Both `nodemailer` and `@types/nodemailer` are installed. The codebase uses Resend
exclusively. Dead dependency — increases bundle size and attack surface.
**Fix:** `npm uninstall nodemailer @types/nodemailer`. Two minutes.

---

#### 🟡 GAP-12 — YouTube API Route Is Dead Infrastructure
**File:** `src/app/api/youtube-stats/route.ts`
**Issue:** Requires `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` — neither is set. The YouTube channel
doesn't exist yet (Creative division is dark). The route returns 500 errors on every call and
represents unnecessary Google API quota exposure.
**Fix:** Delete the route file or add an early return until the Creative division activates.



---

## 8. Market Readiness Gaps

These are not architecture issues — they are the things that kill deals before the pipeline ever sees
them. Each one has been verified directly in the codebase.

---

#### 🔴 MRG-01 — Gmail Is Hardcoded in the API Route, Not Just the UI Copy
**Files:** `src/app/contact/page.tsx` line 156 · `src/app/api/contact/route.ts` line 259 · line 238

This is a **code fix, not a config fix.** The document originally flagged only the contact page UI
copy. The audit found the same Gmail address hardcoded two additional places in the API layer:

- `route.ts` line 259: `to: '1deeptechnology@gmail.com'` — the Resend send target is hardcoded in
  source. Setting `ADMIN_EMAIL` in Vercel env vars has **no effect** because the route never reads it.
  Change to: `to: process.env.ADMIN_EMAIL ?? 'info@deeptechnologies.dev'`

- `route.ts` line 238: The email footer HTML says `deeptech.com/contact` — wrong domain hardcoded
  in the template string. Change to `deeptechnologies.dev/contact`.

- `page.tsx` line 156: The contact page `mailto:` link still points to Gmail. Change to
  `info@deeptechnologies.dev`.

All three are in the same area of the codebase and can be fixed in one pass (~15 minutes).

---

#### 🟠 MRG-02 — No Social Proof
Zero testimonials, zero case studies, zero partner logos, zero press mentions anywhere on the site.
For robotics at $25K–$250K price points, buyers need evidence that someone else trusted you first.
Even a single vendor endorsement quote, or a before/after case study from a beta customer, changes
the conversion rate materially. Add at minimum: one case study, one vendor quote, and one "as used
by" logo bar — even if the reference is a pilot customer.

---

#### 🟠 MRG-03 — No Cookie Consent / GDPR Banner
Adding Meta Pixel and Google Analytics Tags (which the site needs) requires GDPR/CCPA compliant
cookie consent. Without it, you are legally exposed the moment an EU or California visitor hits the
site. Use `react-cookie-consent` (npm) or a Vercel Edge Middleware solution. Takes 2 hours.
Must be live before any tracking pixels are installed.

---

#### 🟠 MRG-04 — Sitemap Is Static (6 URLs Only)
**File:** `src/app/sitemap.ts`
The sitemap lists exactly 6 URLs. As individual robot landing pages are built from `vendors.ts`,
they will not be indexed unless added to the sitemap. Make `sitemap.ts` dynamic — import `VENDORS`
and generate a URL for each vendor/product combination programmatically. Also add `/pilot`,
`/enterprise/requisition`, and any new SEO pages.

---

#### 🟠 MRG-05 — No Software Pricing Anchor on /software
The software page has no pricing. Enterprise buyers who arrive via outbound will self-qualify only if
there is a price signal. Without it, the contact form receives a higher percentage of low-budget leads
who don't convert, burning Nimbus capacity and admin time. Add "From $4,500" as the minimum anchor
with links to the three packaged SKUs.

---

#### 🟠 MRG-06 — No Pilot Program Page
`/api/pilot-request` is an empty directory. The pilot program is the highest-conversion offer in the
robotics sales playbook — it removes the single biggest objection. The page doesn't exist. Build
`/pilot` and wire `POST /api/pilot-request` to create a `pending_review` quote record.

---

#### 🟠 MRG-07 — No Customer Portal / Login
Customers track orders via `/orders/[id]` from a direct link in their email. There is no login, no
account, no way to see all orders in one place. As soon as a customer places a second order, the
experience breaks. A minimal Clerk-authenticated `/dashboard` listing all quotes and orders by
customer email is a 1-day build and a major trust signal for enterprise buyers.

---

#### 🟠 MRG-08 — OG Image May Not Exist
**File:** `src/app/layout.tsx` references `/media/deeptech.png` (1200×630px) as the OpenGraph image
for all social shares. Every LinkedIn and Twitter/X share of the site will show this image. If the
file is missing, wrong dimensions, or not optimized, every outbound link share shows a broken
preview. Verify the file exists and is the correct dimensions before any outbound campaign.

---

## 9. Complete Gap Registry

| ID | Gap | Severity | Category | Estimated Effort |
|---|---|---|---|---|
| GAP-01 | Package name is `a-dark-orchestra-films` | 🔴 Critical | Hygiene | 5 min |
| GAP-02 | Upstash Redis as only persistence layer | 🔴 Critical | Architecture | High |
| GAP-03 | Admin auth is a single shared cookie secret | 🔴 Critical | Security | Medium |
| GAP-04 | No rate limiting on any API route | 🔴 Critical | Security | Low |
| GAP-05 | Enterprise requisition creates no system record | 🔴 Critical | Product | Low |
| GAP-06 | No analytics — zero funnel visibility | 🟡 High | Marketing | Low |
| GAP-07 | No error tracking / observability (Sentry) | 🟡 High | Architecture | Low |
| GAP-08 | Claude chat has no conversation history | 🟡 High | Product | Low |
| GAP-09 | `images: { unoptimized: true }` in config | 🟡 High | Performance | Low |
| GAP-10 | Next.js 14 / React 18 (outdated) | 🟡 High | Architecture | Low |
| GAP-11 | `nodemailer` unused dependency | 🟡 High | Architecture | Trivial |
| GAP-12 | YouTube API route is dead infrastructure | 🟡 High | Architecture | Trivial |
| GAP-13 | No marketing automation / drip sequences | 🟡 High | Marketing | Medium |
| GAP-14 | No CRM — leads die in email inbox | 🟡 High | Marketing | Low |
| GAP-15 | ROI calculator doesn't capture email | 🟡 High | Marketing | Low |
| GAP-16 | No retargeting pixels installed | 🟡 High | Marketing | Low |
| MRG-01 | Gmail hardcoded in API route + UI copy + email template | 🔴 Critical | Code + Market Readiness | 15 min |
| MRG-02 | No social proof (testimonials, case studies) | 🟠 Medium | Market Readiness | Medium |
| MRG-03 | No cookie consent / GDPR banner | 🟠 Medium | Legal | Low |
| MRG-04 | Sitemap is static — 6 URLs only | 🟠 Medium | SEO | Low |
| MRG-05 | No software pricing anchor on /software | 🟠 Medium | Market Readiness | Low |
| MRG-06 | No pilot program page | 🟠 Medium | Product | Medium |
| MRG-07 | No customer portal / login | 🟠 Medium | Product | Medium |
| MRG-08 | OG image not verified for social shares | 🟠 Medium | Market Readiness | Low |
| MRG-09 | No LinkedIn Insight Tag | 🟠 Medium | Marketing | Trivial |
| MRG-10 | Individual robot landing pages missing | 🟠 Medium | SEO | Medium |
| MRG-11 | Creative division fully dark (redirect) | 🟢 Low | Product | Deferred |
| MRG-12 | No A/B testing infrastructure | 🟢 Low | Marketing | Medium |



---

## 10. Phase Execution Plans

---

### Phase 0 — Foundation (Week 1, ~20 hours total)

*Non-negotiable before any outbound or ad spend. Every item here is a force multiplier on everything
that follows — or a deal-killer if skipped.*

| # | Task | Gaps Closed | Est. Time |
|---|---|---|---|
| 1 | Point `deeptechnologies.dev` → live deployment | MRG-01 | 1h |
| 2 | Fix Gmail in API route: `route.ts` line 259 → `process.env.ADMIN_EMAIL` | MRG-01 | 5m |
| 3 | Fix wrong domain in email template: `route.ts` line 238 → `deeptechnologies.dev` | MRG-01 | 5m |
| 4 | Remove Gmail from `/contact` page `mailto:` link | MRG-01 | 5m |
| 5 | Set `ADMIN_EMAIL=info@deeptechnologies.dev` in Vercel env vars | MRG-01 | 5m |
| 4 | Fix `package.json` name field | GAP-01 | 5m |
| 5 | `npm uninstall nodemailer @types/nodemailer` | GAP-11 | 10m |
| 6 | Delete or stub `/api/youtube-stats` route | GAP-12 | 10m |
| 7 | Remove `unoptimized: true` from `next.config.js` | GAP-09 | 30m |
| 8 | Upgrade Next.js 15 + React 19 (`npm install next@latest react@latest react-dom@latest`) | GAP-10 | 2h |
| 9 | Verify `/media/deeptech.png` exists at 1200×630px | MRG-08 | 30m |
| 10 | Add rate limiting to `/api/contact`, `/api/chat`, `/api/checkout` via `@upstash/ratelimit` | GAP-04 | 2h |
| 11 | Install Sentry (`@sentry/nextjs`) + wrap all API routes | GAP-07 | 1h |
| 12 | Install PostHog + Vercel Analytics in `layout.tsx` | GAP-06 | 1h |
| 13 | Install cookie consent banner (`react-cookie-consent`) | MRG-03 | 2h |
| 14 | Install Meta Pixel + LinkedIn Insight Tag (behind consent) | GAP-16, MRG-09 | 1h |
| 15 | Fix enterprise requisition to call `createQuote()` + save to Redis | GAP-05 | 2h |
| 16 | Add conversation history to Claude chat (`chat:{orderId}:history`) | GAP-08 | 1h |
| 17 | Run Nimbus end-to-end smoke test in staging | — | 2h |

**Phase 0 total: ~17 hours. This is the launch.**

---

### Phase 1 — Lead Capture Infrastructure (Weeks 1–3)

*Build the lead collection surface before spending anything on acquisition.*

**1A — Gate the ROI Calculator (highest priority)**
- Add email input field before displaying full ROI report
- `POST /api/roi-capture` → save `{ email, roiParams, timestamp }` to Redis
- Trigger Resend Sequence 1 (ROI Calculator Lead) on submission
- Fire Make.com webhook → create HubSpot Contact + Deal (stage: "Researching")
- Estimated build: 3–4 hours

**1B — Build `/pilot` Page + API Route**
- Standalone landing page: "30-day pilot. Your environment. No commitment."
- Intake: company, contact, environment, robot type, fleet goal, timeline
- `POST /api/pilot-request` → `createQuote()` with status `pending_review` + admin email
- Trigger Resend Sequence 2 (Contact Form Nurture) on submission
- Add to main navigation and every robotics page CTA
- Estimated build: 4–6 hours

**1C — Build 5 Resend Email Sequences**
- Create `/lib/sequences/` directory mirroring `/lib/quotes/` pattern
- Sequence state storage: `sequence:{email}:{name}:{step}` in Redis
- Vercel Cron (`vercel.json` cron configuration) runs daily → checks pending sends → fires Resend
- Build sequences: roi-lead, contact-nurture, quote-followup, enterprise-bridge, post-deployment
- Estimated build: 6–8 hours

**1D — Connect HubSpot via Make.com**
- Create Make.com account (free tier)
- Set up webhook scenarios for all 7 trigger events listed in Section 6.5
- Configure lead scoring rules in HubSpot
- No code changes required in the app
- Estimated setup: 3–4 hours

---

### Phase 2 — Automated Acquisition (Weeks 2–6)

*Launch all three acquisition channels simultaneously, not sequentially.*

**2A — LinkedIn Automation (Expandi.io)**
- Create Expandi account ($99/month)
- Build three sequences (Robotics Operators, Software Leaders, Vendor Partners) per Section 6.3
- Upload first target list: 50 robotics operators in SF/LA from LinkedIn Sales Navigator
- Set daily limits: 15 new contacts/sequence/day
- Review reply rates weekly; iterate message copy monthly

**2B — Content Engine**
- Set up Typefully account ($29/month)
- Week 1: publish first technical post on X + LinkedIn (existing content, minimal effort)
- Week 2: use `/api/chat` (Claude, already live) to draft second post from a brief
- Establish 2x/week cadence — Monday technical, Thursday industry
- Post to both X (`@JusChadneo`) and LinkedIn personal + company page

**2C — Individual Robot SEO Pages**
- Create `/src/app/robotics/[slug]/page.tsx` — dynamic route reading from `vendors.ts`
- Each page: specs, pricing, deployment use cases, ROI calculator pre-filled, comparison CTA
- Update `sitemap.ts` to import `VENDORS` and generate URLs dynamically
- Submit updated sitemap to Google Search Console
- Estimated build: 4–6 hours

**2D — Vendor Comparison Content**
- Write 3 comparison guides: "Kiwibot vs. Starship", "Serve Gen3 vs. Kiwibot", "Unitree G1 vs. Spot"
- Gate PDF download behind email capture → enters Sequence 1
- Publish as `/blog/[slug]` pages (or standalone download pages)

---

### Phase 3 — Database Migration (Month 2–3, parallel to sales)

*Do not delay sales for this. Run this migration in parallel with H1 closing activity.*

**Migration will proceed in 4 steps:**

| Step | Action | Risk |
|---|---|---|
| 1 | Add Neon PostgreSQL via Vercel Marketplace (zero config) | None |
| 2 | Install Prisma + define schema for `quotes`, `line_items`, `messages`, `leads` | Low |
| 3 | Write dual-write shim: all `createQuote`/`updateQuote` writes go to both Redis + Postgres | Low |
| 4 | Validate Postgres data integrity → cut over reads → remove Redis business-data keys | Medium |

Redis remains as the cache and rate-limit layer. Only business data (quotes, leads, messages) moves to
Postgres. The dual-write shim means zero downtime and zero data loss during migration.

**Trigger:** Begin Phase 3 when quote count approaches 200 or when the first enterprise customer
requests a data export or audit trail.

---

### Phase 4 — Customer Auth + Portal (Month 3–4)

*After 5+ customers have been through the pipeline, the portal becomes the retention and expansion
surface.*

**4A — Install Clerk**
- `npm install @clerk/nextjs`
- Add `ClerkProvider` to `layout.tsx`
- Protect `/dashboard` behind `clerkMiddleware()`
- Replace admin cookie auth with Clerk organization membership (admin role)
- Estimated: 3 hours

**4B — Build `/dashboard` Customer Portal**
- Authenticated page showing all quotes/orders associated with customer email
- Order status cards linking to existing `/orders/[id]` pages
- Message thread preview per order
- Fleet metrics placeholder (expandable in H3)
- Estimated: 1–2 days

**4C — Admin RBAC Upgrade**
- Admin panel protected by Clerk organization membership check
- Audit log for all quote state transitions (who changed what, when)
- No more single shared secret — each admin team member has their own account



---

## 11. Execution Stack

The complete tool stack required to operate this GTM strategy, with monthly costs and rationale.

| Function | Tool | Monthly Cost | Notes |
|---|---|---|---|
| **Hosting** | Vercel (current) | $0–$20 | Pro plan if Cron jobs needed |
| **Email — transactional** | Resend (current) | $0–$20 | Already installed, verified domain |
| **Email — sequences** | Resend Batch + Vercel Cron | $0 | Built on existing infrastructure |
| **CRM** | HubSpot Free | $0 | Deal pipelines, contact records, lead scoring |
| **CRM ↔ App automation** | Make.com | $0–$9 | 1,000 ops/month free; webhooks only |
| **LinkedIn automation** | Expandi.io | $99 | Cloud-based, within LinkedIn limits |
| **Content scheduling** | Typefully | $29 | Thread drafting + scheduling for X + LinkedIn |
| **Analytics** | PostHog | $0 | 1M events/month free |
| **Error tracking** | Sentry | $0 | 5K errors/month free |
| **Auth (customers + admin)** | Clerk | $0 | 10K MAU free, Next.js native |
| **Database (scaled)** | Neon PostgreSQL | $0–$19 | Serverless, Vercel Marketplace |
| **Cookie consent** | react-cookie-consent | $0 | npm package |
| **Retargeting — social** | Meta Pixel + LinkedIn Tag | $0 install / ad spend separate | In `layout.tsx` |
| **Retargeting — search** | Google Ads Tag | $0 install / ad spend separate | In `layout.tsx` |
| **Ad spend (Month 1)** | Meta + LinkedIn retargeting | $50–$100 | Only after 30 days of pixel data |
| **Ad spend (Month 2+)** | Scale based on CPA data | $500–$2,000 | PostHog CPA data drives decision |
| **LinkedIn Sales Navigator** | LinkedIn | $99 | Target list building for Expandi |
| **Document signing** | DocuSign Free | $0 | Software retainer agreements |
| **Video conferencing** | Calendly Free + Google Meet | $0 | Scheduling close calls |
| **Google Cloud Run** | Nimbus CLI agent hosting | $0–$50/mo | Free tier covers ~50 invocations/month; scales with contact volume. Monitor in GCP console. |

**Total fixed monthly stack cost: ~$246–$345/month** (before ad spend; upper bound assumes Cloud Run at scale)
**Total with minimal ad spend: ~$300–$450/month**

This is the complete infrastructure needed to run a $1M ARR business. Every tool pays for itself with
one additional robotics hardware order per quarter.

---

## 12. Revenue Model

### Complete Revenue Stream Map

| Revenue Stream | Billing | Timeline Active | Gross Margin |
|---|---|---|---|
| **Hardware markup (15%)** | One-time Stripe checkout | H1 → ongoing | 15% |
| **Software project fees — AI Audit** | Invoice, net-30 | H1 → ongoing | 80–90% |
| **Software project fees — Sprint** | Milestone-based Stripe | H1 → ongoing | 65–75% |
| **Software project fees — Agent Build** | Milestone-based Stripe | H1 → ongoing | 60–70% |
| **Pilot program fees** | $2,500 (1 unit) · $5,000 (2–3 units) · credited toward full order | H1 → H2 | 40–60% |
| **Fleet optimization retainer** | Monthly Stripe subscription | H2 → ongoing | 70–80% |
| **Software retainer** | Monthly Stripe subscription | H2 → ongoing | 75–85% |
| **RaaS commissions** | Monthly Stripe subscription | H1 → ongoing | 10–20% |
| **Vendor intelligence API** | Freemium SaaS | H2 | 85–90% |
| **White-label sourcing license** | Monthly platform license | H3 | 80–90% |
| **Fleet monitoring SaaS** | Monthly per-fleet dashboard | H3 | 80–90% |

### Revenue Model Risk Map

| Risk | Severity | Mitigation |
|---|---|---|
| Nimbus fails to source correctly | High | `NIMBUS_STUB=1` fallback; admin can create quotes manually |
| Vendor pricing changes without notice | Medium | `vendors.ts` is git-versioned; **quarterly refresh cadence**: contact each vendor, verify pricing + availability + contacts, commit with updated date tag. 2–3 hours/quarter. Calendar reminder set for July, October, January, April. |
| Customer disputes / chargebacks | Medium | `charge.dispute.created` webhook + admin email already live |
| Single-founder bandwidth | High | Entire pipeline automation designed to minimize manual steps |
| Redis data loss | High | → Phase 3 migration to Postgres (see Section 10) |
| RaaS subscription churn | Medium | `customer.subscription.deleted` webhook + pre-churn email sequence |
| Service fee exposure on cancellation | Low | `serviceFeeRetained` vs `vendorCostRefunded` split in `CancellationRecord` |

---

## 13. The Four Things That Matter Most Right Now

If this entire document was reduced to four executable decisions — these are them. They are ordered
by dependency: #0 must be true before #1 matters, #1 before #2, and so on.

---

### #0 — Confirm Nimbus Works End-to-End Before Anything Else

**Why it's #0:** The `NIMBUS_STUB=1` flag in the codebase signals this pipeline has not been
fully validated in production. Every other priority in this section assumes the pipeline works.
If Nimbus is broken, gating the ROI calculator (#1) captures leads that cannot be fulfilled.
Saving enterprise requisitions to Redis (#2) creates a backlog the system cannot process. Installing
pixels (#3) drives traffic into a funnel with no bottom.

**What "confirmed end-to-end" means — five steps, all must pass:**
```
1. Submit contact form as a test customer (robotics inquiry, real intake fields)
2. Confirm Nimbus fires: GOOGLE_CLOUD_FUNCTION_URL receives the request (check GCP logs)
3. Confirm callback arrives: POST /api/nimbus/callback creates a draft quote in Redis
4. Confirm draft appears in /admin/quotes with status pending_review
5. Approve → send quote → pay via Stripe test mode → confirm order reaches accepted status
```

If any step fails, fix it before proceeding. This is not optional — it is the foundation every
other part of this strategy is built on.

**Estimated time: 2 hours.** Run it today.

---

### #1 — Gate the ROI Calculator with an Email Capture

**Why it's #1:** Every person who runs the calculator has a number, a deployment in mind, and a budget
in their head. They are the warmest leads on the site. Today they calculate and leave, permanently
uncaptured. This is the single most expensive missed conversion in the system. It can be fixed in 2–3
hours of engineering work. The ROI calculator is already the most sophisticated self-serve tool on
the page — it just needs one email field before the full report reveals.

**What to build:**
```
POST /api/roi-capture
→ save { email, roiParams, timestamp } to Redis
→ trigger Resend Sequence 1 (D+0 ROI report, D+3 vendor spotlight, D+7 pilot offer)
→ fire Make.com webhook → create HubSpot Contact + Deal (stage: "Researching")
```

---

### #2 — Fix the Enterprise Requisition Route to Create a System Record

**Why it's #2:** The enterprise requisition form is the highest-intent surface on the site — buyers
who fill it out are ready for a term sheet within hours. Today, the route emails admin and returns
`{ success: true }`. If that email is missed, deleted, or lands in spam, the lead is gone. There is
no Redis record, no admin dashboard entry, no CRM trail. One enterprise lead at $250K+ that falls
through a Gmail inbox costs more than a month of engineering time.

**What to build:**
```
After sending admin email, add one line:
await createQuote({ customerName, customerEmail, inquiryType: 'Autonomous solutions',
  summary: `Enterprise req: ${robotType}, fleet: ${fleetSize}`,
  lineItems: [], status: 'pending_review', source: 'enterprise_requisition' });
```

---

### #3 — Install PostHog + Meta Pixel + LinkedIn Insight Tag Today

**Why it's #3:** Analytics and retargeting pixels need to build audience data before you can act on
them. Every day that passes without these installed is a day of irretrievable signal loss. Retargeting
audiences need 1,000+ visitors before ads can run effectively — the clock starts the moment the pixel
fires. PostHog needs data from the first visitor to show you where the funnel is leaking.

**What to install (all three go in `layout.tsx`):**
- PostHog snippet — free, 1M events/month, zero configuration required
- Meta Pixel — behind cookie consent, fires on every page load
- LinkedIn Insight Tag — fires on every page load, builds retargeting audience for `/robotics` visitors

**This is 1 hour of work. The payoff is measurable ad performance 30 days later.**

---

## Appendix A — 30-Day Sprint Checklist

The minimum viable launch. Complete all 17 items in Phase 0, then start Phase 1A immediately.

```
Week 1 — Foundation
[ ] Nimbus end-to-end smoke test passed (5-step validation — do this FIRST) ✓
[ ] Domain deeptechnologies.dev → live
[ ] Fix contact/route.ts line 259: to: process.env.ADMIN_EMAIL (code fix, not config)
[ ] Fix contact/route.ts line 238: domain in email footer → deeptechnologies.dev (code fix)
[ ] Remove Gmail from /contact page mailto: link
[ ] ADMIN_EMAIL=info@deeptechnologies.dev env var set in Vercel
[ ] package.json name fixed
[ ] nodemailer uninstalled
[ ] YouTube route deleted/stubbed
[ ] images.unoptimized removed
[ ] Next.js 15 + React 19 upgrade
[ ] OG image verified (1200×630px)
[ ] Rate limiting on 3 public API routes
[ ] Sentry installed + all API routes wrapped
[ ] PostHog + Vercel Analytics installed
[ ] Cookie consent banner live
[ ] Meta Pixel + LinkedIn Insight Tag live (behind consent)
[ ] Enterprise requisition → createQuote() added
[ ] Claude chat conversation history added
[ ] Nimbus end-to-end smoke test passed ✓

Week 2 — Lead Capture
[ ] ROI calculator email gate built (/api/roi-capture)
[ ] /pilot page built + /api/pilot-request wired
[ ] Resend Sequence 1 (ROI Lead) built + tested
[ ] Resend Sequence 2 (Contact Nurture) built + tested
[ ] HubSpot CRM created + Make.com webhook connected

Week 3–4 — Acquisition
[ ] Resend Sequences 3–5 built + tested
[ ] Expandi.io account created + Sequence A running
[ ] Typefully account + first post scheduled
[ ] First 20 outbound contacts sent (manual or Expandi)
[ ] Dynamic robot pages /robotics/[slug] built
[ ] Sitemap updated dynamically from vendors.ts
[ ] Vendor comparison PDF #1 gated + published
[ ] Kiwibot partnership email sent
```

---

*Document generated from full codebase audit · April 2026*
*Sources: `src/lib/nimbus.ts` · `src/data/vendors.ts` · `src/lib/quotes/types.ts` ·*
*`src/lib/quotes/store.ts` · `src/app/api/checkout/route.ts` · `src/app/api/webhook/route.ts` ·*
*`src/app/api/nimbus/callback/route.ts` · `src/lib/chat-prompt.ts` · `src/lib/admin-auth.ts` ·*
*`src/app/admin/quotes/page.tsx` · `src/app/enterprise/requisition/page.tsx` ·*
*`src/components/RoiCalculator.tsx` · `src/app/contact/page.tsx` · `next.config.js` · `package.json`*
