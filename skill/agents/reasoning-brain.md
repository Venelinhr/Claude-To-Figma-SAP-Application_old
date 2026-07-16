# Reasoning Brain Agent
## Stage 1.5 — Think Before Building (RULE 20)
## Runs: after Step 2 (floorplan confirmed) + Step 0.5 (region map produced) — before Step 4 (hierarchy design)

---

## Mission

The Reasoning Brain transforms the pipeline from **analysis → generation** into **analysis → understand → plan → generate**. It is the explicit thinking stage that ensures every generation decision is grounded in business intent, entity models, structural blueprints, and validated component plans — before a single SAP component is instantiated.

This agent produces 7 mandatory artifacts. None are optional. The pipeline does not proceed to Step 4 until all 7 are complete.

**Full v2 architecture:** `docs/V2-REASONING-PIPELINE.md`

---

## When to Run

After:
- ✓ Step 0.5 has produced a region map (RULE 17)
- ✓ Step 2 floorplan has been confirmed by the user (RULE 3)
- ✓ ASCII wireframe has been approved (RULE 19)

Before:
- Step 4 (component hierarchy design)
- Any spec JSON generation

---

## Artifact 1 — Intent Card

Before looking at any component, answer these 8 questions:

1. **Application:** What is this system called? What does it do?
2. **Problem:** What pain does it solve for the user?
3. **User:** Who is the persona (role, technical level, familiarity with SAP)?
4. **Primary workflow:** What is the most common 3-step path?
5. **Secondary workflows:** What else can they do?
6. **Critical actions:** Without which actions does the app fail?
7. **Optional actions:** Nice-to-have features
8. **North Star:** A single sentence defining success

**Output format:**
```
INTENT CARD
───────────────────────────────────────────
Application:      [name and purpose]
Problem:          [the pain it solves]
User:             [persona: role, level, SAP familiarity]
Primary workflow: [step1 → step2 → step3]
Secondary:        [other paths]
Critical actions: [must-work items]
Optional:         [nice-to-have]
North Star:       "[single sentence defining success]"
───────────────────────────────────────────
```

---

## Artifact 2 — Business Entity Model

Every SAP application revolves around entities. Identify them before selecting components. The entity model determines what data lives in tables vs. forms vs. detail panels.

Extract:
- **Root entity** — what the screen is fundamentally about
- **Child entities** — what hangs off the root (1:N relationships)
- **Key attributes** — fields visible in the reference per entity
- **Relationships** — 1:N, N:M
- **Enumerations** — status values, severity levels, types

**Output format:**
```
ENTITY MODEL
───────────────────────────────────────────
[Root Entity] (root)
  id: [type]
  [attribute]: [type]
  status: enum {[values]}
  ↳ [Child Entity] (1:N)
      id: [type]
      ↳ [Grandchild Entity] (1:N)
          [attribute]: [type]
───────────────────────────────────────────
```

---

## Artifact 3 — Screen Classification

Classify the screen type before choosing a floorplan. Screen type and floorplan are distinct: type is conceptual, floorplan is the SAP implementation pattern.

**The 14 screen types:**

| Type | Key Signals |
|---|---|
| **Dashboard** | KPIs, charts, overview metrics, read-only, no primary entity |
| **ListReport** | Search-first, large dataset, VariantManagement, no pre-scoped queue |
| **ObjectPage** | Single object with multiple detail sections |
| **Wizard** | Linear step-by-step creation flow |
| **Dialog** | Modal, focused single action |
| **Settings** | Configuration, preferences, toggles |
| **MasterDetail** | Persistent list + detail side-by-side, drill-down |
| **Analytical** | Chart-driven with drillable tables and KPIs |
| **Overview** | KPI tiles + navigation entry points |
| **Timeline** | Chronological event sequence |
| **Inbox** | Approval/task queue, pre-scoped, action-oriented |
| **Approval** | Single-item approve/reject/escalate flow |
| **Administration** | System configuration, user management |
| **Monitoring** | Log inspection, event tracking, execution status investigation |

**Output format:**
```
SCREEN CLASSIFICATION
───────────────────────────────────────────
Type:      [type from list above]
Rationale: [why this type and not the alternatives]
───────────────────────────────────────────
```

---

## Artifact 4 — Layout Blueprint

Create the structural skeleton BEFORE assigning SAP components. This is a pure geometry exercise: named containers with proportions, nesting, and directional layout.

**Rules:**
- Use region names, NOT SAP component names (those come in Artifact 5)
- Use percentages for widths (not pixels yet — those come from RULE 18 spatial analysis)
- Show layout direction (HORIZONTAL / VERTICAL) per container
- Show nesting hierarchy
- If regional proportions differ in confidence, annotate them

**Output format:**
```
LAYOUT BLUEPRINT
───────────────────────────────────────────
Root ([width]px)
├── [Region name] ([width], [height])
├── [Region name] (HORIZONTAL, fill height)
│   ├── [Sub-region] ([width]px, [%])
│   └── [Sub-region] ([width]px, [%])
│       ├── [Panel name] (full width)
│       └── [Panel name] (full width, scroll)
[...]
───────────────────────────────────────────
Spatial confidence: [HIGH/MEDIUM/LOW for key dimensions]
```

---

## Artifact 5 — Component Planning Table

Map every region in the Layout Blueprint to its SAP component with an explicit confidence score. Confidence thresholds determine whether to instantiate immediately or evaluate alternatives.

**Confidence rules:**
- **95–100%:** Instantiate immediately — correct choice is clear
- **80–94%:** Instantiate with a note — possible alternative exists but this is clearly better
- **65–79%:** Evaluate one alternative before deciding — flag in completeness score
- **Below 65%:** Must evaluate multiple alternatives — do NOT instantiate without resolution

**Output format:**
```
COMPONENT PLANNING TABLE
───────────────────────────────────────────
Region               Purpose               SAP Component          Confidence
──────────────────── ───────────────────── ────────────────────── ──────────
[region name]        [what it does]        [SAP component]        [N]%
[...]
───────────────────────────────────────────
Low-confidence items:
  · [region]: [reason for uncertainty] → [alternative to consider]
```

---

## Artifact 6 — Relationship Graph

Before writing spec JSON, produce the structural containment tree. This IS the spec's `hierarchy[]` — not yet written in JSON, but the structural skeleton.

**Rules:**
- Show parent → child relationships
- Show slot names where known (slots.heading, slots.content, etc.)
- Annotate any uncertain relationships with `?`

**Output format:**
```
RELATIONSHIP GRAPH
───────────────────────────────────────────
[Root component]
  [Child via slot "content"]
    [Grandchild]
      [...]
  [Child via slot "title"]
    [...]
───────────────────────────────────────────
```

---

## Artifact 7 — Composition Pre-check

For every parent-child pair in the Relationship Graph, verify the pair is allowed per the registry's `composition.validParents` / `composition.validChildren` rules.

This prevents the most common class of plugin validation failures.

**Output format:**
```
COMPOSITION PRE-CHECK
───────────────────────────────────────────
[ParentComponent] → [ChildComponent]   [✓/✗] ([reason if ✗])
[...]

VIOLATIONS: [None / list any violations]
ACTIONS:    [What to fix if violations exist]
───────────────────────────────────────────
```

---

## Handoff to Step 4

When all 7 artifacts are produced, emit this handoff block:

```
REASONING BRAIN COMPLETE — READY FOR COMPONENT HIERARCHY DESIGN (Step 4)
══════════════════════════════════════════════════════════════════════════
Intent:          [1-line North Star]
Entities:        [root entity] → [child] → [grandchild]
Classification:  [screen type]
Blueprint:       [column structure in 1 line]
Low confidence:  [N] items (see planning table)
Composition:     [0 violations / N violations — fix before proceeding]
══════════════════════════════════════════════════════════════════════════
```

---

## Example (SAP LaMa Activities Screen)

```
INTENT CARD
───────────────────────────────────────────
Application:      SAP Landscape Management — Monitoring
Problem:          Admin needs to investigate activity execution chains to find what 
                  ran, what step failed, and what the system logged about it
User:             System administrator (highly technical, daily SAP user)
Primary workflow: Activities list → click activity → see steps → click step → read messages
Secondary:        Filter by name/status; search; sort by date
Critical actions: Drill-down between levels; read full message body text
Optional:         Export messages; filter by severity
North Star:       "Admin reaches any message log entry in < 3 clicks"
───────────────────────────────────────────

ENTITY MODEL
───────────────────────────────────────────
Activity (root)
  activityNumber: integer
  name: string
  status: enum {Complete, Running, Failed, Pending}
  progress: 0–100 integer
  startTime: datetime
  note: string (optional)
  ↳ Step (1:N)
      stepId: integer
      operation: string
      status: enum {Complete, Running, Failed}
      ↳ Message (1:N)
          severity: enum {Trace, Debug, Information, Warning, Error}
          messageCode: string
          time: datetime
          body: string (multiline)
───────────────────────────────────────────

SCREEN CLASSIFICATION
───────────────────────────────────────────
Type:      Monitoring
Rationale: User is investigating execution logs (not approving, not creating).
           3-level drill-down (Activities→Steps→Messages) is the investigation
           pattern. User needs all 3 levels visible simultaneously to navigate
           without losing context. Worklist rejected (no bulk dispositions).
           ListReport rejected (pre-scoped queue, not open search).
───────────────────────────────────────────

LAYOUT BLUEPRINT
───────────────────────────────────────────
Root (2000px viewport)
├── Shell strip (full width, ~48px)                     [RULE 18: HIGH confidence]
├── Warning strip (full width, ~40px)                    [RULE 18: HIGH confidence]
└── Main body (HORIZONTAL, fill height)
    ├── Navigation rail (200px, ~10%, VERTICAL)          [RULE 18: MEDIUM confidence]
    └── Content area (1800px, ~90%, HORIZONTAL)
        ├── Master column (~504px, 28%)                  [RULE 18: MEDIUM confidence]
        │   ├── Filter card (full width)
        │   └── Activities list (full width, scroll)
        ├── Detail column (~504px, 28%)                  [RULE 18: MEDIUM confidence]
        │   ├── Tabs
        │   ├── Filter card
        │   └── Operation section
        └── Sub-detail column (~792px, 44%)              [RULE 18: MEDIUM confidence]
            ├── Filter card
            └── Messages panel (scroll)
───────────────────────────────────────────

COMPONENT PLANNING TABLE
───────────────────────────────────────────
Region               Purpose               SAP Component          Confidence
──────────────────── ───────────────────── ────────────────────── ──────────
Shell strip          App chrome            ShellBar               100%
Warning strip        System alert          MessageStrip(Warning)  97%
Navigation rail      App navigation        SideNavigation         99%
Master column        Activity container    DynamicPage            95%
  Filter card        Name+Status filters   Panel+Label+Input+Sel  98%
  Activity rows      3 activity entries    Panel × 3              87%  *
Detail column        Step container        DynamicPage            95%
  Tabs               General/Steps nav     IconTabBar             99%
  Filter card        Status+Op filters     Panel+Select+Input     98%
  Operation row      Validate System       Panel+ObjectStatus     91%
Sub-detail column    Messages container    DynamicPage            95%
  Filter card        Msg+Severity filters  Panel+Input+Select     98%
  View toggle        Plain Text/List mode  SegmentedButton        94%
  Message cards      7 log entries         Panel × 7              88%  *

* Low confidence: List component may be more semantically appropriate than
  Panel per row — evaluate if data model grows beyond 10 items
───────────────────────────────────────────

COMPOSITION PRE-CHECK
───────────────────────────────────────────
FlexibleColumnLayout → DynamicPage    ✓ (validParents includes FCL)
DynamicPage → Panel                   ✓
DynamicPage → IconTabBar              ✓
Panel → Panel                         ✓ (nested panels allowed)
Panel → ObjectStatus                  ✓
Panel → ProgressIndicator             ✓
Panel → Select · Input · Label        ✓
IconTabBar → IconTabFilter            ✓
SideNavigation → NavigationItem       ✓
NavigationItem → NavigationItem       ✓ (self-nesting allowed)

VIOLATIONS: None
───────────────────────────────────────────

REASONING BRAIN COMPLETE — READY FOR COMPONENT HIERARCHY DESIGN
══════════════════════════════════════════════════════════════════
Intent:          "Admin reaches any message log entry in < 3 clicks"
Entities:        Activity → Step → Message (3-level hierarchy)
Classification:  Monitoring
Blueprint:       Rail(200px) + 3 columns (28/28/44%)
Low confidence:  2 items — activity rows and message cards (Panel vs List)
Composition:     0 violations
══════════════════════════════════════════════════════════════════
```
