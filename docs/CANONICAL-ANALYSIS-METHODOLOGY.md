# Canonical Reference Analysis Methodology
## Source of Truth · added 2026-07-08

This document is the **canonical methodology** for analyzing every reference screen — screenshot, Figma frame, SAP application, PDF, wireframe, whiteboard, or hand-drawn sketch.

Formally referenced as **RULE 17** in `skill/SYSTEM_PROMPT.md`.
Operationally embedded in **Step 0.5** of `skill/SKILL.md`.

---

## The Canonical Approach (Visual Summary)

```
  ┌──────────── WHOLE SCREEN ────────────┐
  │         (understand first)           │
  └──────────────────────────────────────┘
                     ↓
  ┌──── A ──── ShellBar (global shell) ─────────────────────────────────────────┐
  └─────────────────────────────────────────────────────────────────────────────┘
                     ↓
  ┌── B ──┐  ┌───── C ─────┐  ┌───── D ─────┐  ┌──────── E ────────┐
  │ Side  │  │  Column 1   │  │  Column 2   │  │    Column 3        │
  │  Nav  │  │  (master)   │  │  (detail)   │  │  (sub-detail)      │
  └───────┘  └─────────────┘  └─────────────┘  └────────────────────┘
```

Analyze Phase 1 (global shell A) first.
Then analyze each remaining region B, C, D, E independently in order.
Never analyze two regions simultaneously.

---

## Phase 1 — Identify the Global Shell

Begin by identifying the highest-level application structure:
- Shell Bar
- Global Navigation  
- Application Frame
- Side Navigation
- Footer

This establishes the application's architectural foundation before any detail work.

**In the LaMa reference: Region A = the ShellBar strip.**

---

## Phase 2 — Decompose the Interface

After understanding the global shell, divide the remaining interface into independent logical work areas:
- Navigation / Side Panel
- Master List
- Detail View
- Inspector Panel
- Dialog / Popover
- Card Area
- Table
- Form
- Dashboard Region

Each region becomes an independent analysis task.

**In the LaMa reference: Regions B, C, D, E.**

---

## Phase 3 — Analyze One Region Completely

**Never analyze multiple regions simultaneously.**

For each region, apply all three core principles:

### Reading Order — always top-left to bottom-right
Scan the region exactly as you read text: start at the top-left corner, move right, then down. Never jump to the visually prominent element first. SAP regions are hierarchical from top to bottom and left to right — following the reading order surfaces the correct parent-child relationships.

### Divide the Screen into Logical Sub-regions
If the region is complex, name every sub-section before touching any component. An unnamed element is a skipped element. The following list is a checklist — if a region is not present, you need a reason why:
- Region title / heading
- Filter/search area
- Toolbar (with its icons and actions)
- Content list or table
- Detail row / card
- Footer / action area

### Complete One Sub-region Before Starting the Next
Work through this 10-step checklist completely before moving on:
1. **Purpose** — what is this region for in the business flow?
2. **Detect all elements** — every text, icon, control, badge, divider
3. **Extract all text** — literally every visible string, including placeholders and timestamps
4. **Identify actions** — buttons, menus, icons, interactions, chevrons
5. **Understand business purpose** — what does the user accomplish here?
6. **Identify relationships** — what contains what? what triggers what?
7. **Determine SAP floorplan** — which Fiori pattern is this?
8. **Select SAP components** — from the registry, matching exactly what is visible
9. **Apply SAP tokens** — design tokens, typography tokens, spacing, accessibility
10. **Validate completeness** — walk the region one more time before proceeding

---

## Phase 4 — Apply Recursive Decomposition

If a region is still complex after Phase 3, divide it again into smaller logical sections and repeat:

```
Application
│
├── Shell Bar
├── Navigation
├── Content
│   ├── Toolbar
│   ├── Filter Bar
│   ├── Table
│   │   ├── Header row
│   │   ├── Column headers
│   │   ├── Data rows
│   │   └── Row actions
│   └── Detail Panel
└── Footer
```

Continue dividing until each section is small enough to analyze confidently. There is no minimum size — even a single row with a progress bar and a button may need its own recursive pass.

---

## Phase 5 — Assemble the Solution

Only after every region has been independently analyzed and validated, assemble the complete SAP application. During assembly, validate:

- Parent-child relationships
- Navigation flow
- Layout consistency
- SAP component composition
- Auto Layout
- Design tokens
- Typography tokens
- Spacing
- Accessibility
- Business workflow

The final application should appear as one cohesive product even though it was generated section by section.

---

## Adaptive Complexity Management

If the reference is too large or complex to generate reliably in a single pass, recommend splitting the output into multiple SAP screens or flows. When doing so:
- Explain why segmentation is recommended
- Propose logical screen boundaries
- Preserve navigation and relationships between screens
- Allow the user to merge the generated screens if desired

---

## Architectural Mindset

Think like a combination of:
- SAP Product Designer
- Solution Architect
- UX Architect
- Information Architect

Identify business workflows, information hierarchy, component relationships, reusable patterns, missing elements, and opportunities for improvement. The objective is not to copy the interface — it is to understand it.

---
---

# Worked Example: SAP Landscape Management — Activities Screen

## The canonical region map for this reference

This example is the **Source of Truth** for how to apply the 5-phase methodology. Every future analysis of a complex screen should produce an output of this depth and precision.

---

### Region A · Shell Bar (global shell, full viewport width)

Reading order (left → right):
- ≡ hamburger menu (expand/collapse nav)
- ← back · → forward (navigation history)
- SAP logo (blue square, white grid icon)
- **"SAP Landscape Management"** (bold app title)
- **"yana"** (blue chip = tenant/workspace identifier)
- ⚠ **"Active System User"** (orange = warning link, clickable)
- **"Refresh |"** with ∨ chevron (dropdown refresh action)
- **"Working Set: All"** (current data scope selector)
- **"OPU on lama-runtime-5749d75c5c-z5kd9 (13:29)"** (current system status pill)
- 🔍 search icon
- ❓ help icon
- **"Adam Administrator"** (user identity / avatar)

→ SAP component: `ShellBar`
→ Props: `title="SAP Landscape Management"` · `secondaryTitle="yana"` · `showSearchField=true` · `showNotifications=false`
→ Warning line ("⚠ Active System User · Refresh · Working Set · OPU...") is a **separate `MessageStrip type=Warning`** below the ShellBar, not inside it

---

### Region B · Side Navigation (left rail, ~200px, scrollable)

Reading order (top → bottom):

**Group 1:** ⊞ Overview  →  *(collapsed)*
**Group 2:** ⚙ Operations  ↓  *(expanded)*
- Operations
- Operation Templates
- Schedules

**Group 3:** ⚙ Automation Studio  ↓  *(expanded)*
- Content Management
- Provider Definitions
- Custom Operations
- Custom Hooks
- Custom Notifications
- Custom Processes
- Auto-Heal Configurations

**Group 4:** 👤 UI Customizations  ↓  *(expanded)*
- Links
- Menu Items

**Group 5:** 🖥 **Monitoring**  *(selected group — blue background, left blue stripe, | separator)*  ↓
- **Activities**  *(selected sub-item)*
- Logs

**Group 6:** 🔧 Configuration  →  *(collapsed)*
**Group 7:** 🔧 Configuration Ex...  →  *(collapsed, truncated)*
**Group 8:** 🖧 Infrastructure  →  *(collapsed)*

→ SAP component: `SideNavigation` with `NavigationItem` tree
→ Monitoring: `expanded=true` · Activities: `selected=true`

---

### Region C · Column 1 — Activities View (master column, ~28% width)

**Sub-region C1 · Column title area:**
Reading order (left → right):
- **"Activities View ▼"** (blue, large bold, dropdown chevron = view selector)
- ⓘ info icon (tooltip/help)
- ⋯ overflow menu icon

**Sub-region C2 · Server time strip:**
- "Latest Server Time: 2026-07-08 / 13:29:43 (UTC)" (grey metadata)

**Sub-region C3 · Filter card:**
- "Name" label → Input field (placeholder "String")
- "Status" label → Select dropdown ("Select Value") + Fx clear-filter + F+ add-filter icons

**Sub-region C4 · Activities list:**
Toolbar: "**Activities (6)**" (bold count) + copy icon + ↑↓ sort + grid view + ⚙ settings
Column header: "Name"

**Row 1 (selected — green left stripe, blue background):**
- ✅ **yanatest** + [Actions ▾] button + > chevron (drill-in)
- Activity Number: 765
- Progress: 100% + green progress bar + ✅ check icon
- Note: *(empty)*
- Start Time: 2026-07-06 12:22:48

**Row 2:**
- ✅ **Validate Instance** + [Actions ▾] + >
- Activity Number: 426
- Progress: 100% + green bar + ✅
- Note: *(empty)*
- Start Time: 2026-07-02 14:57:49

**Row 3:**
- ✅ **Validate System** + [Actions ▾] + >
- Activity Number: 425
- Progress: 100% + green bar + ✅
- Note: *(empty)*
- Start Time: *(partially visible, cut off)*

→ SAP components:
- `DynamicPage` with `DynamicPageTitle` heading="Activities View"
- `Panel` (filter): `Label` "Name" + `Input` "String" + `Label` "Status" + `Select` "Select Value" + filter icon buttons
- `Panel` "Activities (6)": 3 nested row-`Panel`s each containing:
  - `ObjectStatus` (state=Success, icon=sys-enter-2, text=activity name)
  - `MenuButton` "Actions ▾"
  - `Label` rows (Activity Number, Progress, Note, Start Time)
  - `ProgressIndicator` (percentValue=100, displayValue="100%", state=Success)

---

### Region D · Column 2 — yanatest Activity Detail (detail column, ~28% width)

**Sub-region D1 · Column title area:**
- **"yanatest"** (bold H1)
- "Activity | Activity Number 765" (grey subtitle)
- ⋯ overflow icon

**Sub-region D2 · Tab bar:**
- **General** tab (inactive, grey text)
- **Steps** tab *(active — blue text, blue underline)*

**Sub-region D3 · Steps filter section:**
Toolbar: "**Steps (1)**" (bold) + ∇ Hide Filters (funnel icon) + ↑↓ sort + ⚙ settings
- "Status" label → Select "Select Value" (full width)
- "Operation" label → Input "String" + Fx clear + F+ add icons

**Sub-region D4 · Operation section:**
Section header: "**Operation**" (bold)

**Row 1 (selected — green left stripe, light blue background):**
- ✅ **Validate System** + > chevron
- ID:  1
- Next:  *(empty)*
- Previous:  *(empty)*
- Hook for ID:  *(empty)*

→ SAP components:
- `DynamicPage` with `DynamicPageTitle` heading="yanatest"
- `IconTabBar` with `IconTabFilter` items: `label="General"` (key=general) + `label="Steps"` (key=steps, selectedKey=steps)
- `Panel` "Steps (1)": `Select` "Select Value" + `Input` "String" + filter icons
- `Panel` "Operation": `ObjectStatus` (state=Success, text="Validate System") + `Label` rows (ID: 1, Next, Previous, Hook for ID)

---

### Region E · Column 3 — Validate System Step Detail (sub-detail column, ~44% width)

**Sub-region E1 · Column title area:**
- **"Validate System"** (bold H1)
- "Step | ID 1 | Activity Number 765" (grey subtitle)
- **"Hide Filters"** with funnel icon (toggle button)
- ⛶ fullscreen expand icon
- ✕ close icon

**Sub-region E2 · Filter row:**
- "Message" label (grey) → Input "String" (white, bordered, full-width half)
- "Severity" label (grey) → Select "Select Value" with ∨ chevron (white, bordered)
- Fx clear-filter icon · F+ add-filter icon (right-aligned)

**Sub-region E3 · Messages panel:**
Toolbar: "**Messages (10)**" (bold H2) + **[Plain Text]** **[List]** segmented toggle (List has blue outline = selected) + ↑↓ sort + ⚙ settings

**Message Card 1:**
- [**Trace**] chip (pink/lavender background) | "Message Code: LVM"
- Time: 2026-07-06 12:22:48 (blue)
- "Serialized Trace ID: 5edcc166deea460e93545f658a867055$db6024539ac749c2"
  "Trace: 5edcc166deea460e93545f658a867055 and"
  "Span: db6024539ac749c2"

**Message Card 2:**
- [**Debug**] chip (light purple background) | "Message Code: LVM"
- Time: 2026-07-06 12:22:48 (blue)
- "Cluster integration is not enabled. No cluster related checks necessary."

**Message Card 3:**
- [**Trace**] chip | "Message Code: ValSchedule"
- Time: 2026-07-06 12:22:48 (blue)
- "Scheduling validation for SystemID.A00.SystemHost.simdba00"

**Message Card 4:**
- [**Trace**] chip | "Message Code: LVM"
- Time: 2026-07-06 12:22:48 (blue)
- "Scheduled validation for SystemID.A00.SystemHost.simdba00 on all validators"

**Message Card 5:**
- [**Information**] chip (blue background) | "Message Code: LVM"
- Time: 2026-07-06 12:22:48 (blue)
- "The validations for entity with id "SystemID.A00.SystemHost.simdba00" with validatorId: "ALL" have been triggered."

**Message Card 6:**
- [**Trace**] chip | "Message Code: LVM"
- Time: 2026-07-06 12:22:49 (blue)
- "Validations for validator 'Solution Manager Assignment' have not been executed yet."

**Message Card 7:**
- [**Trace**] chip | "Message Code: LVM"
- Time: 2026-07-06 12:22:49 (blue)
- "Validations for validator 'Validate System Version' have not been executed yet."

*(Cards 8–10 below fold, scroll to see)*

→ SAP components:
- `DynamicPage` with `DynamicPageTitle` heading="Validate System" + empty `breadcrumbs=[]` + empty `actions=[]`
- `Panel` (filter): `Label` "Message" + `Input` "String" + `Label` "Severity" + `Select` "Select Value" + filter icons
- `Panel` "Messages (10)": `SegmentedButton` ([Plain Text][List]; selectedKey=list) + sort icon + settings icon
- 7× nested `Panel` each containing:
  - `ObjectStatus` (severity chip: Trace=Information, Debug=None, Information=Success · icon + text)
  - `Label` "Message Code: LVM/ValSchedule"
  - `Label` "Time: 2026-07-06 12:22:4X"
  - `Text` (body message)

---

## Summary of what this analysis produced

| Region | SAP Container | Key children |
|---|---|---|
| A | ShellBar | title, secondaryTitle, search, notifications |
| B | SideNavigation | 8 NavigationItem groups, Monitoring expanded, Activities selected |
| C | DynamicPage (master) | Filter Panel + Activities Panel(3 rows) |
| D | DynamicPage (detail) | IconTabBar(General/Steps) + Steps filter + Operation Panel |
| E | DynamicPage (sub-detail) | Filter Panel + Messages(10) Panel(7 cards) |
| — | FlexibleColumnLayout | Contains C, D, E as beginColumnPages/midColumnPages/endColumnPages |
| — | MessageStrip(Warning) | "⚠ Active System User · Refresh · Working Set · OPU..." below A |

---

*Canonical reference: added 2026-07-08. Source reference images: SAP Landscape Management — Activities Monitoring. Methodology formally registered as RULE 17 in `skill/SYSTEM_PROMPT.md`. Operationally embedded in Step 0.5 of `skill/SKILL.md`.*
