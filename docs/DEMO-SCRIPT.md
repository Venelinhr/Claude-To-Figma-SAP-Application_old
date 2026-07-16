# Demo Script — SAP Figma Design Agent
## End-to-end walkthrough for showing the pipeline to a new audience
## Added: 2026-07-09 · Referenced from docs/WAVE-D-ROADMAP.md

---

## Purpose

A 5-minute demo script that shows the complete pipeline in action — from a business requirement to a validated SAP Figma screen. Use for stakeholder demos, onboarding new team members, or recording D4 (the end-to-end demo capture).

---

## Prerequisites (setup, 1 minute)

- [ ] Figma desktop app open
- [ ] SAP Web UI Kit library added to the working file (`p7zm5EMBk5DRRZdxNeJ4f5`)
- [ ] Plugin loaded: **Development → Import plugin from manifest → plugin/figma-builder/manifest.json**
- [ ] Terminal open in project root
- [ ] Reference image ready (recommended: SAP LaMa activities screenshot)

---

## Act 1 — The problem (30 seconds)

**Say:** "Building a SAP Fiori screen manually takes hours. Designers pick components, apply tokens, wire up composition rules, meet accessibility requirements. One mistake breaks the whole design system. What if we could go from requirement to real SAP Figma screen in minutes?"

**Show:** Split screen — Figma on one side, terminal on the other.

---

## Act 2 — The pipeline (2 minutes)

**Say:** "Give the agent a business requirement — a Jira ticket, a screenshot, a wireframe. It runs a 7-step reasoning pipeline."

### Step 1 — Show the requirement
Paste this in the terminal:
```
As a warehouse manager, I need to monitor incoming shipments and flag exceptions.
Actions: approve receipt, mark delayed, escalate critical.
~40-50 shipments per day.
```

### Step 2 — Show the reasoning artifacts (Stage 1.5)
Point out on-screen:
- **Intent Card** — who, what, North Star
- **Business Entity Model** — Shipment → Items
- **Screen Classification** — Worklist (pre-scoped queue with disposition actions)
- **Component Planning Table** — with confidence scores per region

**Say:** "The agent thinks before building. Every generation decision is grounded in explicit intent, an entity model, and confidence-scored component choices."

### Step 3 — Show the ASCII wireframe gate
When the agent renders the ASCII wireframe, point at it:
```
┌──────────────────────────────────────────────────────────┐
│ ShellBar                                                 │
├──────────────────────────────────────────────────────────┤
│ [Filter: SearchField · Select · Select] [Approve][Delay] │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Shipment  Supplier  ETA  Status  Items  Actions      │ │
│ │ SH-4521   Acme      Jul 10  ●     32    [⋯]          │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```
**Say:** "This is a HARD STOP (RULE 19). No JSON generation until the user approves the layout. Costs 2 minutes, prevents 30 minutes of rework."

Reply: `approved`

### Step 4 — Show the QA certification pass (Stage 6.5)
Once the JSON is generated, show:
- **Pre-flight lint** — mechanical checks pass
- **Defect vs. Exception classification** — 0 defects, 0 exceptions
- **Confidence scores per category** — all above 90%
- **21-item certification checklist** — all ✓
- **Result: CERTIFIED**

**Say:** "Every spec passes through Zero-Defect QA before you see it. If defects are found, the agent auto-repairs — up to 3 passes."

---

## Act 3 — The build (1 minute)

**Say:** "The output is a valid JSON spec conforming to `spec-schema.json`. Paste it into the Figma plugin."

Copy the spec to clipboard:
```bash
cat output/warehouse-shipments-worklist-spec.json | pbcopy
```

Switch to Figma → open the plugin → paste JSON → **Validate** button.

**Show:** All validators pass (Registry gate · Composition · Slot names · Token whitelist). Then click **Build Screen**.

**Show:** Real SAP components appear on canvas — ShellBar, DynamicPage, filter panel, Table with 8 rows, 3 action buttons in the title area. All using SAP variables (not raw hex), SAP typography tokens, correct composition.

---

## Act 4 — The proof points (1 minute)

**Show these in sequence:**

1. **The registry** — 151 SAP components, 100% enriched with props/typography/color rules
2. **The token whitelist** — 80 canonical SAP tokens, 0 raw hex anywhere in the output
3. **The doctrine** — 21 mandatory RULEs, 7 specialized agents, 7 canonical doctrine docs
4. **The CLI validator** — `node build/validate-spec.js output/warehouse-shipments-worklist-spec.json` → runs 8 checks in <1s without opening Figma
5. **The regression suite** — `bash build/test-build.sh` → 5 canonical specs verified in <5s

**Say:** "Every rule is enforced. Every decision is auditable. Every deviation is intentional."

---

## Act 5 — The vision (30 seconds)

**Say:** "This is not just a generator. It's an AI SAP Solution Architect. It understands the business problem, plans the solution, validates every decision, and improves the result before presenting it. The next step is a fully closed loop — Chrome MCP auto-refresh keeps the SAP guidelines current, the learning engine remembers every successful repair pattern, and the self-repair engine gets smarter with every session."

---

## Suggested recording setup

- **Screen recorder:** ScreenFlow or QuickTime
- **Resolution:** 1920×1080 minimum
- **Terminal font size:** 16pt (readable in the recording)
- **Figma zoom:** Fit to page when showing the final build
- **Duration:** 5 minutes total (adjust act times as needed)

## Common questions during demos

**Q: How does it know which SAP components to use?**
A: The reasoning brain produces a Component Planning Table with confidence per region. Components below 65% confidence trigger evaluation of alternatives.

**Q: What if the user wants something SAP doesn't recommend?**
A: RULE 16 (Design Flexibility) — user intent takes priority. The agent will build the non-standard solution and note the deviation.

**Q: What happens when a spec has bugs?**
A: RULE 21 (Zero-Defect QA) — the self-repair engine detects, classifies, and fixes bugs across up to 3 passes before presenting the spec. Every fix is auditable in the Repair Diff.

**Q: Can it handle any SAP Fiori screen?**
A: 9 supported floorplans (Worklist, ListReport, ObjectPage, FullscreenDialog, MasterDetail, AnalyticalListPage, OverviewPage, Wizard, InitialPage). 151 components covered. 154 guideline files cached.
