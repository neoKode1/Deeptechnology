# Deeptech — Developer Handoff Notes
*Last updated: 2026-04-01*

---

## Current State

| Area | Status | Notes |
|---|---|---|
| Metadata | ✅ Done | Title/desc updated to "Deeptech — Software, Robotics & Creative Technology" |
| Software page | ✅ Done | Cards reordered, split-click navigation working |
| Contact form | ✅ Existing | Has 3 inquiry types (Software, Autonomous, Media) — needs expansion |
| Nimbus integration | ⏳ Planning | Not yet started — see plan below |

### Software Page — Project Card Order & Domains

| # | Project | Image clicks to | Domain set? |
|---|---|---|---|
| 1 | 12 Monkeys | `https://plus12monkeys.com` | ✅ |
| 2 | TheNoelleApp | `https://thenoelle.app` | ✅ |
| 3 | Breach | `https://94breach.com` | ✅ |
| 4 | Edge Quanta | GitHub (no domain) | ❌ |
| 5 | Scam Likely | GitHub (no domain) | ❌ |
| 6 | Director's Chair | `https://directorchairai.com` | ✅ |
| 7 | NEO | `https://www.28neo.com` | ✅ |

**Split-click behavior:** Image area → deployed site (or GitHub fallback). Card details area → shows description/tags. GitHub icon → repo link.

### Unstaged Changes
- `src/app/layout.tsx` — metadata update
- `src/app/software/page.tsx` — card reorder + split-click + domains

---

## Next Up: Nimbus Sourcing Integration

### The Concept
The Deeptech contact form becomes the front door for autonomous sourcing. When a user selects an inquiry type (Media, Robotics, or Software), they get a **tailored follow-up form** that collects exactly the parameters Nimbus needs to source the right solution.

### Planned Flow

```
User visits /contact
       │
       ▼
Step 1: Initial form (name, email, inquiry type)
       │
       ├── "Software" → Software intake form
       ├── "Autonomous solutions" → Robotics intake form
       └── "Media solutions" → Media intake form
       │
       ▼
Step 2: Tailored form collects sourcing parameters
       │
       ▼
Step 3: Form data → API route → Nimbus (Clawdbot)
       │
       ▼
Step 4: Nimbus uses skills to source:
       ├── `sag` / `gog` skills → web search for vendors/products
       ├── `github` skill → find open-source solutions
       ├── `ordercli` skill → check availability/pricing
       └── `coding-agent` → evaluate technical fit
       │
       ▼
Step 5: Nimbus compiles sourcing report → emailed to user + stored
```

### Robotics Intake Form — Key Parameters Needed
Based on the robotics page (`src/app/robotics/page.tsx`), Nimbus needs:
- **Environment type:** Urban, Warehouse, Retail, F&B, Campus, Last-Mile Residential
- **System category:** SADRs, RADRs, UAVs, ADVs, Humanoid, Forklift/Sorting
- **Payload requirements:** weight, dimensions, type (food, packages, pallets)
- **Terrain/surface:** sidewalk, indoor flat, outdoor mixed, bike lane
- **Scale:** single unit pilot vs fleet deployment
- **Integration needs:** POS, ERP, WMS, dashboard
- **Budget range / timeline**

### Key Files to Touch
- `deeptech/src/app/contact/page.tsx` — expand with conditional forms per inquiry type
- `deeptech/src/app/api/contact/route.ts` — handle enriched form data
- New: API route or webhook that forwards structured data to Nimbus gateway (`ws://127.0.0.1:18789`)
- Nimbus skills to review: `sag`, `gog`, `ordercli`, `coding-agent`

### Nimbus Connection Point
Nimbus gateway runs locally at `ws://127.0.0.1:18789`. The Deeptech site API route can send a message to Nimbus via CLI:
```bash
pnpm clawdbot agent \
  --message "Source robotics solutions for: {structured params}" \
  --local --session-id sourcing-{requestId}
```
Or via the WebSocket gateway directly from a Node.js API route.

### Open Questions
1. Should the tailored form be a separate page or inline expansion on /contact?
2. How does Nimbus return results — email? Dashboard? Both?
3. Do we need a sourcing status page where users can track their request?
4. Which Nimbus skills need new SKILL.md files for vendor sourcing specifically?

---

## Repo Info
- **GitHub:** `github.com/neoKode1/Deeptechnology`
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Manrope font
- **Local dev:** `cd deeptech && npm run dev` → `http://localhost:3000`
- **Nimbus:** `/Users/babypegasus/Desktop/prototypes/nimbus` (Clawdbot source)

