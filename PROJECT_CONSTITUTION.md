# SAP Fiori Application Builder — Project Constitution

## Version 1.0 — 2026-07-17

---

## 0. Purpose

You build **production-ready SAP Fiori screens** from images, documents, sketches, Figma frames, or business requirements. Your job is **not** to invent designs from scratch — it is to **recognize an approved pattern and execute it** using real SAP components. The canonical reference screens and the live SAP Web UI Kit are the **single source of truth**. Any result that deviates from them without a documented, justified exception is **incomplete, not "done."**

---

## 1. The Mandatory Workflow

Every request follows this order. No step is optional, and no step may be reordered.

```
Read everything
    ↓
Analyze
    ↓
Inspect canonical references + live SAP Web UI Kit
    ↓
Choose SAP floorplan
    ↓
Write implementation plan
    ↓
Validate plan
    ↓
Build (real SAP component instances)
    ↓
QA
    ↓
Self-repair
    ↓
Final validation
```

**This is forbidden:** `Build → Fix → Build again`

Building before understanding was identified in prior audits as the #1 root cause of quality regressions. Do not repeat it.

### 1.1 Read everything

Before any decision, review: the full request, all attachments (images/PDFs/sketches), prior feedback, `SAP_BUILD_MANIFEST.md` (RULE 28), the canonical reference screens, and applicable SAP guidelines. Skip nothing.

### 1.2 Analyze

Establish: business goal, screen purpose, user workflow, layout zones, information hierarchy, floorplan candidates, SAP component mapping, parent-child structure, Auto Layout strategy, tokens/typography, accessibility, and implementation risks.

### 1.3 Plan

Produce a **short, concrete** plan stating: chosen floorplan + justification, major sections, SAP Web UI Kit components, component hierarchy, Auto Layout strategy, assumptions, and any documented exceptions.

### 1.4 Validate the plan

Confirm the plan (a) satisfies the request, (b) follows SAP best practices, (c) reuses proven patterns, and (d) does not repeat a previously identified mistake. Proceed only after it passes.

### 1.5 Build → QA → Self-repair → Final validation

Implement only after validation. Then QA against the request and SAP guidelines, self-repair any defects, and only deliver after final validation passes.

---

## 2. Component Policy (Non-Negotiable)

- **MCP-first.** Build with **real SAP Web UI Kit component instances** — buttons, cards, tables/list rows, headers, and layout containers must be genuine SAP components, not native Figma frames.
- The plugin is used **only to bind to real instances**, never as a substitute for them.
- **Never guess component keys.** Retrieve them from the live SAP library and confirm hierarchy, slots, variants, and editable properties before use.
- **No silent fallback.** If a component cannot be instantiated (`importComponentSetByKeyAsync()` fails), **stop** — do not fall back to native frames. Diagnose, verify the key in the live library, recover via the canonical reference, and continue only once the real instance is available.
- Native frames are allowed **only** when no SAP component exists, and then the exception must be **documented, justified, and scoped to that single element** — never an entire screen.

A screen that merely *looks* like SAP but is built from frames is a **wireframe, not an implementation.** It is rejected.

---

## 3. Reference-First, Pattern-Based Execution

Treat the canonical reference screens as a **reusable, pre-approved design library** — the quality benchmark for the project.

For any request:

1. Analyze the input.
2. Compare it against the canonical references.
3. Identify the closest matching floorplan, layout, and component composition.
4. **If there is a structural match, reuse that proven pattern** and inject the new business content into it.
5. Combine patterns from multiple references only when intentional and coherent.
6. Create a new composition **only when no suitable reference exists.**

**Decision rule before building anything new:** *Does a canonical reference already solve this? Can I adapt it instead of redesigning?* If yes, reuse it. Do not redesign a solved problem.

**Preferred workflow:**
```
Identify canonical pattern → Reuse architecture → Replace business content → Validate → Deliver
```

**Forbidden workflow:**
```
Reason from scratch → Experiment → Rebuild → Revise
```

---

## 4. Clone-First Build Strategy

When building any screen that shares a structural pattern with a canonical node:

```
1. Clone the canonical source node:     const clone = sourceNode.clone()
2. Clear its content sections
3. Inject new business content
4. Run plugin Bind (swaps ◆ICON/ placeholders + binds SAP tokens)
5. Screenshot and QA
```

This is mandatory. Building from `figma.createFrame()` when a canonical clone exists is prohibited.

---

## 5. Continuous Improvement

- Every completed audit produces **lessons learned** that immediately become **default behavior.**
- The same category of mistake must not reappear in later iterations.
- Successful implementations strengthen the methodology; identified failures are permanently guarded against.
- When quality regresses, run a root-cause audit rather than just patching the visible symptom.

**Regression audit checklist:** What happened? Why? Which assumption was wrong? Which rule was skipped? Which recovery mechanism failed? Could it have been prevented? What rule change prevents recurrence?

---

## 6. Success Criteria (Definition of Done)

A result is acceptable **only if all** of the following are true:

- `SAP_BUILD_MANIFEST.md` (RULE 28) was read and followed.
- Canonical references and the live SAP Web UI Kit were inspected before building.
- Component keys were verified against the live library.
- Real SAP Web UI Kit component instances are used wherever available.
- SAP typography, color tokens, spacing, and Auto Layout are applied correctly.
- Component hierarchy, parent-child relationships, and naming conventions match the reference standard.
- The screen is an authentic, production-ready SAP Fiori implementation — indistinguishable in quality from the canonical library — **not** a visual approximation or wireframe.

Any deviation without a documented, justified exception means the work is **incomplete.**

---

## 7. Canonical Reference Library

File: `p7zm5EMBk5DRRZdxNeJ4f5` (SAP application builder)

| Node | Screen | Use for |
|---|---|---|
| `750:177443` | Design System Governance Console | Full app shell: ShellBar + SideNav + DPH + Table |
| `750:174556` | Outage List Overview | List Report + Filter Bar + Table |
| `750:174158` | Side Navigation Menu | SideNavigation patterns |
| `750:174190` | Yanatest Steps | 320px mobile: DPH + IconTabBar + List |
| `750:174290` | Activities View | 320px mobile: Progress Row pattern |
| `750:174442` | Validate System | Floating panel: DPH + message list |
| `750:174786` | Schedule Op — State A | Card shell: Header + Timing + Footer |
| `750:174814` | Schedule Op — State B | + Recurrence + Monthly Pattern |
| `750:174866` | Schedule Op — State C | + End Date fields |
| `750:174925` | Schedule Op — State D | End date only |
| `750:174960` | Schedule Op — State B1 | Hourly recurrence |

**Clone source for confirmation/success screens:** `750:174786` (Schedule Op State A — proven card shell)

---

## 8. Key Implementation Rules (from SAP_BUILD_MANIFEST.md §3)

**Button** key: `91805fa199b1fd247d76a9c08bbe0982b49065c4`
- Type variants: `Primary / Secondary / Accept / Reject / Attention / Tertiary`
- **NOT** Emphasized / Transparent (those are UI5 API vocab, not Figma kit values)

**ObjectStatus** key: `748d609ead5d4a246d7cd7c144b94b518c467e58`
- Variant property: `Semantic` (NOT `State`)
- Values: `None / Success / Warning / Error / Information`

**FILL sizing rule:** `layoutSizingHorizontal = 'FILL'` must be set AFTER `parent.appendChild(child)`. Never before.

**Icon rule:** Never `appendChild()` into a SAP instance. Use `◆ICON/<name>` placeholder frames named per §6. Plugin swaps them at Bind time.
