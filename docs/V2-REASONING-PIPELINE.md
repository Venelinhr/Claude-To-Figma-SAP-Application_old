# v2 Reasoning Pipeline — AI SAP Solution Architect
## Source of Truth · RULE 20 + RULE 21 · added 2026-07-08

This document defines the v2 architecture that transforms the SAP Figma Design Agent from a **generation pipeline** into a **reasoning pipeline**. It identifies the 20 missing stages, maps each to the correct implementation location, and defines the mandatory outputs that make every generation decision auditable.

---

## The Shift: Generator → Reasoning Pipeline

### v1 pipeline (current, production-quality)
```
Input → Analyze → Generate → Build
```

### v2 pipeline (this doc)
```
Input
  ↓
Intent Understanding          ← NEW Stage 1.5A (Reasoning Brain)
  ↓
Business Domain Extraction    ← NEW Stage 1.5B
  ↓
Screen Classification         ← NEW Stage 1.5C
  ↓
Divide & Conquer Analysis     ← Existing Step 0.5 (RULE 17)
  ↓
Spatial Measurement           ← Existing Step 0.5 Phase 0 (RULE 18)
  ↓
Layout Blueprint              ← NEW Stage 1.5D
  ↓
Component Planning Table      ← NEW Stage 1.5E
  ↓
Relationship Graph            ← NEW Stage 1.5F
  ↓
Composition Pre-check         ← NEW Stage 1.5G
  ↓
ASCII Wireframe + Approval    ← Existing Step 3.5 (RULE 19)
  ↓
Generate Spec                 ← Existing Step 6
  ↓
SAP UX Review                 ← NEW Stage 6.5A (QA Certification)
  ↓
Visual Comparison             ← NEW Stage 6.5B
  ↓
Completeness Score            ← NEW Stage 6.5C
  ↓
Architectural Suggestions     ← NEW Stage 6.5D
  ↓
Design System Compliance      ← NEW Stage 6.5E
  ↓
Final Certification           ← NEW Stage 6.5F
  ↓
Production-Ready SAP Figma Output
```

---

## Score Card (v2 Audit — 2026-07-08)

| Area | v1 Score | v2 Target | Gap |
|---|---|---|---|
| Reference analysis | 10/10 | 10/10 | ✅ Excellent |
| Divide & Conquer | 10/10 | 10/10 | ✅ Excellent |
| SAP component mapping | 9.5/10 | 10/10 | Needs confidence scoring |
| SAP guideline usage | 10/10 | 10/10 | ✅ Excellent |
| Floorplan selection | 9/10 | 10/10 | Missing explicit planning stage |
| Auto Layout generation | 9.5/10 | 10/10 | Needs constraint solver (RULE 18) |
| SAP tokens | 10/10 | 10/10 | ✅ Excellent |
| Accessibility | 9.5/10 | 10/10 | Missing post-generation audit |
| Business understanding | 9/10 | 10/10 | Needs intent + entity extraction |
| Validation | 8/10 | 10/10 | **Biggest gap** |
| Self-correction | 7/10 | 9/10 | Major gap |
| Multi-pass reasoning | 6/10 | 9/10 | **Major gap** |

---

## Stage 1.5 — Reasoning Brain (runs BEFORE component hierarchy design)

**Agent:** `skill/agents/reasoning-brain.md`
**Trigger:** After Step 2 (floorplan confirmed) and Step 0.5 (region map produced)
**Output:** 7 mandatory artifacts emitted to chat before Step 4

### 1.5A — Intent Extraction

Before looking at any UI element, answer these questions:

1. What application is this?
2. What problem does it solve?
3. Who is the user?
4. What is the primary workflow (3-step path)?
5. What is the secondary workflow?
6. What are the critical actions (without which the app fails)?
7. What are the optional actions?
8. What is the "North Star" — the single sentence that defines success?

**Template output:**
```
INTENT CARD
───────────────────────────────────────────
Application:        SAP Landscape Management
Problem:            Admin investigates activity execution chains
User:               System administrator (technical, SAP-familiar)
Primary workflow:   Activities → click → Steps → click → Messages
Secondary:          Filter by status; search by name
Critical actions:   Drill-down; read message body
Optional:           Export; sort; filter
North Star:         "Admin reaches any message in < 3 clicks"
───────────────────────────────────────────
```

### 1.5B — Business Entity Extraction

Every SAP application revolves around entities. Identify them before selecting components.

Extract:
- Root entity (what the screen is fundamentally about)
- Child entities (what hangs off the root)
- Key attributes per entity (the fields visible in the reference)
- Relationships between entities (1:N, N:M)
- Enumerations (status values, severity levels, types)

**Template output:**
```
ENTITY MODEL
───────────────────────────────────────────
Activity (root)
  id: Activity Number (integer)
  name: string
  status: enum {Complete, Running, Failed, Pending}
  progress: 0–100%
  startTime: timestamp
  ↳ Step (1:N child)
      id: integer
      operation: string
      status: enum
      ↳ Message (1:N child)
          severity: enum {Trace, Debug, Information, Warning, Error}
          code: string
          timestamp: timestamp
          body: string
───────────────────────────────────────────
```

### 1.5C — Screen Classification

Before choosing a floorplan, classify the screen type. This is distinct from floorplan selection — it answers "what kind of screen is this conceptually?"

**14 screen types:**

| Type | Characteristics |
|---|---|
| Dashboard | KPIs, charts, overview metrics, no editing |
| ListReport | Search-first, large datasets, VariantManagement |
| ObjectPage | Single object detail with sections |
| Wizard | Linear step-by-step creation |
| Dialog | Modal focused action |
| Settings | Configuration, preferences |
| MasterDetail | Persistent list + detail side-by-side |
| Analytical | Chart-driven with drillable tables |
| Overview | KPI tiles + entry points |
| Timeline | Chronological event sequence |
| Inbox | Approval / task queue |
| Approval | Single-item approve/reject/escalate |
| Administration | System configuration, user management |
| Monitoring | Log inspection, event tracking, status investigation |

**Template output:**
```
SCREEN CLASSIFICATION
───────────────────────────────────────────
Type:         Monitoring
Rationale:    Screen shows execution logs for system activities.
              User is investigating, not approving or creating.
              3-column drill-down pattern (Activities→Steps→Messages)
              fits investigation/monitoring, not worklist or list-report.
───────────────────────────────────────────
```

### 1.5D — Layout Blueprint

Create the structural skeleton BEFORE assigning SAP components. This is a pure geometry exercise — containers with names and proportions only.

**Rules:**
- Use named regions, not component names
- Use proportional widths (percentages, not pixels yet)
- Show nesting hierarchy
- No SAP components at this stage — those come in Stage 1.5E

**Template output:**
```
LAYOUT BLUEPRINT
───────────────────────────────────────────
Root (2000px viewport)
├── Shell strip (full width, 48px height)
├── Warning strip (full width, 40px height)
└── Main body (HORIZONTAL, fill height)
    ├── Navigation rail (200px, 10%, VERTICAL)
    └── Content area (1800px, 90%, HORIZONTAL)
        ├── Master column (504px, 28%)
        │   ├── Filter card (full width)
        │   └── List area (full width, scroll)
        ├── Detail column (504px, 28%)
        │   ├── Tabs
        │   ├── Filter card
        │   └── Detail rows
        └── Sub-detail column (792px, 44%)
            ├── Filter card
            └── Messages panel (scroll)
───────────────────────────────────────────
Spatial confidence: HIGH for shell+nav; MEDIUM for column ratios (estimated)
```

### 1.5E — Component Planning Table

For every region in the Layout Blueprint, produce a planning table mapping purpose → SAP component → confidence before instantiating anything.

**Confidence thresholds:**
- 95–100%: Instantiate immediately
- 80–94%: Instantiate with a note
- 65–79%: Evaluate one alternative before deciding
- Below 65%: Must evaluate multiple alternatives; do not instantiate without resolution

**Template output:**
```
COMPONENT PLANNING TABLE
───────────────────────────────────────────
Region              Purpose              SAP Component         Confidence
─────────────────── ──────────────────── ───────────────────── ───────────
Shell strip         App chrome           ShellBar              100%
Warning strip       System alert         MessageStrip          97%
Navigation rail     App navigation       SideNavigation        99%
Master column       Activity list        DynamicPage           95%
  Filter card       Name + Status filter Panel+Inputs          98%
  List area         3 activity rows      Nested Panels         87%  *
Detail column       Step detail          DynamicPage           95%
  Tabs              General/Steps nav    IconTabBar            99%
  Filter card       Status/Op filters    Panel+Select+Input    98%
  Detail rows       Validate System row  Panel+ObjectStatus    91%
Sub-detail col      Messages             DynamicPage           95%
  Filter card       Msg/Severity filters Panel+Input+Select    98%
  Toggle            Plain Text/List      SegmentedButton       94%
  Message cards     7 log entries        Panel×7              88%  *

* Low confidence: Consider Table or List component as alternative
───────────────────────────────────────────
```

### 1.5F — Relationship Graph

Before writing spec JSON, produce the structural containment tree. This is the spec's hierarchy[], not rendered yet — just the tree showing what contains what.

**Template output:**
```
RELATIONSHIP GRAPH
───────────────────────────────────────────
ShellBar
MessageStrip (Warning)
FlexibleColumnLayout
  ├── [begin] DynamicPage (master)
  │     DynamicPageTitle "Activities View"
  │     Panel (filter)
  │       Label + Input "Name"
  │       Label + Select "Status"
  │     Panel "Activities (6)"
  │       Panel (row 1: yanatest)
  │         ObjectStatus ✅
  │         Label × 4
  │         ProgressIndicator
  │         MenuButton "Actions"
  │       Panel (row 2: Validate Instance)
  │       Panel (row 3: Validate System)
  ├── [mid] DynamicPage (detail)
  │     DynamicPageTitle "yanatest"
  │     IconTabBar (General/Steps)
  │     Panel "Steps (1)"
  │       Select + Input
  │     Panel "Operation"
  │       ObjectStatus ✅
  │       Label × 4
  └── [end] DynamicPage (sub-detail)
        DynamicPageTitle "Validate System"
        Panel (filter)
          Input + Select
        Panel "Messages (10)"
          SegmentedButton [Plain Text][List]
          Panel (msg 1) × 7
───────────────────────────────────────────
```

### 1.5G — Composition Pre-check

For every parent-child pair in the Relationship Graph, ask: "Is this allowed?" Check against the registry's `validParents`/`validChildren` rules.

**Template output:**
```
COMPOSITION PRE-CHECK
───────────────────────────────────────────
FlexibleColumnLayout → DynamicPage   ✓ (validParents includes FCL since 2026-07-08)
DynamicPage → Panel                  ✓
Panel → Panel                        ✓ (nested panels allowed)
Panel → ObjectStatus                 ✓
Panel → Label                        ✓
Panel → ProgressIndicator            ✓
Panel → Select                       ✓
IconTabBar → IconTabFilter           ✓
DynamicPage → IconTabBar             ✓
SideNavigation → NavigationItem      ✓
NavigationItem → NavigationItem      ✓ (self-nesting allowed since 2026-07-08)

VIOLATIONS: None
───────────────────────────────────────────
```

---

## Stage 6.5 — QA Certification (Zero-Defect + Exception Engine)

**Agent:** `skill/agents/qa-certification.md`
**Repair patterns:** `docs/REPAIR-PATTERNS.md` (read first every pass)
**Trigger:** After Step 6 (JSON spec generated)
**Output:** 6 QA artifacts + Confidence Scores + Repair Diff + Certification result

---

### 6.5-0 — Governing Principles

**Zero-Defect Policy:** This stage is an active repair engine, not a passive validator. The user receives the highest-quality spec the system can produce, not the first draft.

**Design Flexibility & Exception Engine:** Before any repair attempt, every detected issue is classified as either an **Unintentional Defect** (must repair) or an **Intentional Exception** (preserve, do not repair).

SAP guidelines are the default strategy, not absolute rules. The progressive repair approach:
```
Standard SAP Solution → Small Adaptation → Custom SAP Solution → Hybrid → Fully Custom
```
Always choose the simplest approach that fulfills the user's objective. Significant deviations are explained, never silently applied.

---

### 6.5-A — Defect vs. Exception Classification (MANDATORY BEFORE ANY REPAIR)

**Unintentional Defects → MUST REPAIR:**
Wrong component · Missing tokens · Incorrect Auto Layout · Broken accessibility ·
Missing labels · Incorrect parent-child · Broken composition · Kit defaults leaking

**Intentional Exceptions → PRESERVE:**
Custom layout (user requested) · Detached component (necessary for behavior) ·
Non-standard floorplan (valid business reason) · Hybrid composition (intentional) ·
Pixel-faithful reconstruction · Exploratory design · Enterprise workflow preservation ·
Plugin limitation workaround

**Decision rule:** Did user request it? Is it in the reference? Does removing it reduce fidelity?
→ YES to any = Intentional Exception → preserve.

---

### 6.5-B — Root Cause Analysis (MANDATORY BEFORE REPAIRING A DEFECT)

For every confirmed defect, classify root cause (14 categories) before attempting repair:

| # | Category | # | Category |
|---|---|---|---|
| 1 | Business interpretation | 8 | Design tokens |
| 2 | Layout planning | 9 | Typography |
| 3 | SAP floorplan selection | 10 | Accessibility |
| 4 | SAP component mapping | 11 | Spatial reconstruction |
| 5 | Component composition | 12 | Reference interpretation |
| 6 | Parent-child hierarchy | 13 | Figma implementation |
| 7 | Auto Layout | 14 | **Plugin limitation** → ⚙ PLUGIN_LIMITATION |

Category 14 = PLUGIN_LIMITATION: mark ⚙, skip repair, document workaround. Never waste repair passes on plugin limitations.

---

### 6.5-C — Confidence Scoring

After each QA pass, score every category 0–100%:

```
| Category               | Pass 1 | Pass 2 | Pass 3 |
| Business understanding |   %    |   %    |   %    |
| Floorplan              |   %    |   %    |   %    |
| SAP components         |   %    |   %    |   %    |
| Auto Layout            |   %    |   %    |   %    |
| Design tokens          |   %    |   %    |   %    |
| Typography             |   %    |   %    |   %    |
| Accessibility          |   %    |   %    |   %    |
| Reference coverage     |   %    |   %    |   %    |
| Overall                |   %    |   %    |   %    |
```

Any category below 80% → mandatory repair targeting that category first (3× weight in overall score).

---

### 6.5-E — Targeted Repair Taxonomy (17 repair types)

| # | Repair Type | # | Repair Type |
|---|---|---|---|
| 1 | Replace component instance | 10 | Fix naming |
| 2 | Fix Auto Layout constraints | 11 | Restore missing label |
| 3 | Correct spacing/padding | 12 | Resolve sizing/alignment |
| 4 | Replace color with token | 13 | Correct icon format |
| 5 | Apply typography token | 14 | Update slot key |
| 6 | Repair parent-child | 15 | Fix validParents violation |
| 7 | Correct composition | 16 | Remove orphan node |
| 8 | Replace detached with SAP instance | 17 | Remove empty container |
| 9 | Fix accessibility | | |

**Full regen decision (case-by-case):**
- >50% of components need structural change → full regen faster
- Only props/tokens/labels → always targeted repair, never full regen
- On regen: preserve validated regions, only regenerate failing sections

---

### 6.5-H — Pre-flight Spec Lint (runs BEFORE 6.5A–6.5F)

Quick lint of the JSON draft before any QA pass. Catches ~40% of failures in seconds:

| Rule | Check | Fix |
|---|---|---|
| Title injection | Title child uses `props.text` not `label` | `props.text` → `label` |
| DynamicPageTitle breadcrumbs | `slots.breadcrumbs` absent | Add `"breadcrumbs":[]` |
| DynamicPageTitle actions | `slots.actions` absent | Add `"actions":[]` |
| ObjectStatus icon | Has `icon` prop? | Add `sap-icon://...` |
| Raw hex | `#[hex]` in spec body | Replace with SAP token |
| Raw typography | `props.fontSize` or `props.fontFamily` | Use typography token |
| Table columns | `slots.columns` present? | Add columns slot |
| Dialog footer | `slots.footer` present? | Add footer slot |

---

### 6.5-D — Dependency-Ordered Self-Repair (3-pass budget)

Repair order (upstream before downstream — always):
```
1.Business → 2.Floorplan → 3.Hierarchy → 4.Components → 5.Layout
→ 6.Auto Layout → 7.Tokens → 8.Typography → 9.Accessibility → 10.Cleanup
```

Pass 1: Straightforward, high-confidence fixes (with known patterns from REPAIR-PATTERNS.md applied first)
Pass 2: Secondary issues exposed by Pass 1
Pass 3: Remaining recoverable problems + optimization
After Pass 3: STOP. Present best spec + unresolved issues + confidence scores.

---

### 6.5-F — Repair Diff Output

After each pass:
```
Repair Pass N — X fixed, Y preserved, Z skipped:
  [FIXED]     {id}: {what changed}: {before} → {after}  ({pattern P-NNN or reason})
  [PRESERVED] {id}: {why kept}: {reason}  (RULE 16 exception)
  [SKIPPED ⚙] {id}: Plugin limitation — {gap} · Workaround: {if any}
```

---

### 6.5-G — Learning Engine

After each successful repair: check REPAIR-PATTERNS.md for existing pattern. If new → add entry. If existing → update confidence. This ensures future QA passes apply proven solutions immediately.

---

### 6.5A — SAP UX Review

Ask: "Would a Senior SAP UX Designer approve this?"

Check each dimension:

| Dimension | Question | Status |
|---|---|---|
| Spacing | Is internal padding consistent (8/16/24px rhythm)? | ✓ |
| Typography | Is every text node using a typography token? | ✓ |
| Density | Is compact density applied throughout? | ✓ |
| Consistency | Are the same patterns used for equivalent elements? | ✓ |
| Accessibility | Does every ObjectStatus pair icon + text? | ✓ |
| Responsiveness | Does the layout degrade gracefully at 1280px? | ⚠ (not tested) |
| Interactions | Are all interactive elements reachable by keyboard? | ✓ |

### 6.5B — Visual Comparison

Look again at the reference. Compare it against the generated spec.

Categories:
- **Missing**: Elements visible in reference but not in spec
- **Different**: Present but wrong component, wrong text, wrong state
- **Extra**: In spec but not in reference
- **Misplaced**: Wrong parent, wrong order, wrong position

**Template output:**
```
VISUAL COMPARISON
───────────────────────────────────────────
Missing:     None significant
Different:   Activity row uses Panel + Labels; reference may use a
             List component (lower confidence — see planning table)
Extra:       None
Misplaced:   None
───────────────────────────────────────────
```

### 6.5C — Completeness Score

Give every screen a numeric coverage percentage and list every item not fully covered.

**Template output:**
```
COMPLETENESS SCORE: 94%
───────────────────────────────────────────
Covered (100%):
  ShellBar · MessageStrip · SideNavigation (8 groups, correct expand/select)
  FlexibleColumnLayout (3 columns, correct proportions)
  3× DynamicPage with titles and subtitles
  Filter panels (Name/Status/Message/Severity with icons)
  Activities (3 rows with ObjectStatus + ProgressIndicator + Labels)
  Steps panel (filter + Operation section)
  Messages panel (SegmentedButton + 7 message cards with severity + body)

Low confidence / partial coverage (6%):
  · Activity rows: Panel-based (87%) vs. List component (alternative not evaluated)
  · Message chip colors: Using ObjectStatus (Info/None/Success) but reference shows
    distinct chip colors (lavender for Trace, purple for Debug, blue for Information)
    — may need InfoLabel or custom Panel styling
  · "Actions ▾" MenuButton: spec uses Button type; reference shows dropdown chevron
    → should be MenuButton, not Button
───────────────────────────────────────────
```

### 6.5D — Architectural Suggestions

Ask: "Can this become better?" Suggest improvements beyond what was asked.

**Template output:**
```
ARCHITECTURAL SUGGESTIONS
───────────────────────────────────────────
1. Message severity chips → InfoLabel is a better fit than ObjectStatus.
   ObjectStatus is for semantic state (Success/Warning/Error). The message
   severity labels (Trace/Debug/Information) are categorical, not stateful.
   Recommendation: Replace 7× ObjectStatus with 7× InfoLabel.

2. Activity rows: If activities ever exceed 10, the Panel-per-row pattern will
   become unwieldy. Consider migrating to a proper sap.m.List with
   StandardListItem when the data model grows.

3. Message panel: The SegmentedButton toggle (Plain Text/List) is correct.
   However the "sort" and "settings" toolbar icons after it suggest this should
   be a full OverflowToolbar, not a loose set of icons.
───────────────────────────────────────────
```

### 6.5E — Design System Compliance

Validate that every design token, typography, and color reference in the spec resolves correctly.

**Template output:**
```
DESIGN SYSTEM COMPLIANCE
───────────────────────────────────────────
Typography:   All text nodes use tokens (Title/Label/Text components)         ✓
Color tokens: 0 raw hex values detected                                       ✓
Token whitelist: All referenced tokens in 52-token mandatory whitelist        ✓
Component instances: All 18 distinct components in registry                   ✓
Composition rules: 0 violations                                               ✓
SAP guidelines: iconTabBar.selectedKey ✓ · ObjectStatus icon+text pairing ✓  ✓
Detached components: 0 (no detachInstance required for this spec)             ✓
───────────────────────────────────────────
```

### 6.5F — Final Certification Checklist

Before presenting the spec to the user, complete this checklist. Every ✓ means the item is verifiably true.

```
FINAL CERTIFICATION
═══════════════════════════════════════════

Pre-generation:
  ✓ Business intent understood (Intent Card produced)
  ✓ Business entities extracted (Entity Model produced)
  ✓ Screen classified (Monitoring)
  ✓ Reference analyzed (Divide-and-Conquer, region map produced)
  ✓ Spatial relationships measured (RULE 18, confidence documented)
  ✓ Layout blueprint produced (proportions documented)
  ✓ Component planning table produced (confidence per component)
  ✓ Relationship graph produced (containment validated)
  ✓ Composition pre-check passed (0 violations)
  ✓ ASCII wireframe approved by user (RULE 19)

Generation:
  ✓ SAP floorplan selected and confirmed (RULE 3)
  ✓ All components in registry (RULE 1)
  ✓ All colors from 52-token whitelist (RULE 2)
  ✓ Typography tokens applied (no raw px)
  ✓ Auto Layout values documented (RULE 18)
  ✓ SAP guidelines reviewed per component (RULE 9)
  ✓ Accessibility: WCAG AA; icon+text pairing throughout

Post-generation:
  ✓ Visual comparison completed (RULE 13)
  ✓ Completeness score computed (94%)
  ⚠ 3 low-confidence items flagged (see Completeness Score)
  ✓ Architectural suggestions produced
  ✓ Design system compliance validated

RESULT: CERTIFIED — ready for plugin build
         (3 low-confidence items documented, user may want to review)
═══════════════════════════════════════════
```

---

## Self-Repair Loop

If the certification checklist has ✗ failures (not just ⚠ warnings), the self-repair loop activates:

```
Generate
  ↓
Inspect (QA Stage 6.5)
  ↓
Any ✗ failures?
  → YES: Identify failure → Fix in spec → Re-inspect (max 3 passes)
  → NO: Present certified spec to user
```

**Rules:**
- ✓ = Pass, include in certified spec
- ⚠ = Warning, document and present to user, do not block
- ✗ = Failure, must repair before presenting
- After 3 self-repair passes without clearing all ✗, present to user with explicit failure notes

---

## What the v2 Audit's 20 Stages Map To

| v2 Stage | Maps to | Location |
|---|---|---|
| 1. Intent Extraction | Stage 1.5A | reasoning-brain.md |
| 2. Business Entity Extraction | Stage 1.5B | reasoning-brain.md |
| 3. Screen Classification | Stage 1.5C | reasoning-brain.md |
| 4. Layout Blueprint | Stage 1.5D | reasoning-brain.md |
| 5. Component Planning | Stage 1.5E | reasoning-brain.md |
| 6. Spatial Solver | Existing RULE 18 / Step 0.5 Phase 0 | SYSTEM_PROMPT.md + SKILL.md |
| 7. Relationship Graph | Stage 1.5F | reasoning-brain.md |
| 8. Composition Validation | Stage 1.5G | reasoning-brain.md |
| 9. SAP Guideline Reasoner | Existing RULE 9 (Design Learning Mode) | SYSTEM_PROMPT.md |
| 10. Component Confidence | Stage 1.5E (confidence column) | reasoning-brain.md |
| 11. Alternative Solver | Stage 1.5E (low-confidence trigger) | reasoning-brain.md |
| 12. SAP UX Review | Stage 6.5A | qa-certification.md |
| 13. Visual QA | Stage 6.5B | qa-certification.md |
| 14. Completeness Score | Stage 6.5C | qa-certification.md |
| 15. Self Repair | Self-repair loop | qa-certification.md |
| 16. Architectural Suggestions | Stage 6.5D | qa-certification.md |
| 17. Design System Compliance | Stage 6.5E | qa-certification.md |
| 18. Figma Quality Review | Stage 6.5E + Final Checklist | qa-certification.md |
| 19. Learning Engine | Existing RULE 13 + memory system | SYSTEM_PROMPT.md + memory files |
| 20. Final Certification | Stage 6.5F | qa-certification.md |

---

*Document created 2026-07-08. Formally registered as RULE 20 (Reasoning Before Generation) and RULE 21 (QA Certification Before Handoff) in `skill/SYSTEM_PROMPT.md`. Operational implementation in `skill/agents/reasoning-brain.md` and `skill/agents/qa-certification.md`.*
