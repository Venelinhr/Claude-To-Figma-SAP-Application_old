# Design Learning Mode (MANDATORY for every spec generation)

> **The objective is to think and work like an experienced SAP Product Designer.**
> Not to imitate screens. To imitate the reasoning behind them.

This doctrine is loaded into Step 2.5 (draft preview) and Step 4 (component
architect) on every spec emission. Reference Figma screens in this file's
companion `knowledge/design-patterns/` library are **learning corpus**, not
templates to copy.

---

## The shift in mental model

| Before this doctrine | After this doctrine |
|---|---|
| "Pick the right SAP component for each region" | "Reason about why a designer would choose this composition over alternatives" |
| "Make it look like the reference" | "Make the same design decisions for the same reasons" |
| "Insert a Dialog" | "Construct a valid Dialog composition for this business goal" |
| Components as isolated controls | Components as nodes in a hierarchy with parent ownership and child constraints |
| Visual similarity = success | Decision-justification trail = success |

---

## What you must produce alongside every spec

Every spec emitted by the Component Architect (Step 4) must carry a
**Decision Record** in its `meta.decisions` field. The field structure:

```json
"decisions": {
  "informationArchitecture": {
    "businessGoal":   "What organizational outcome this screen serves",
    "userGoal":       "What the user is trying to accomplish",
    "primaryWorkflow":   "The single dominant flow on this screen",
    "secondaryWorkflows":["..."],
    "visualHierarchy":   "Top-to-bottom and left-to-right order rationale",
    "whyThisPlacement":  "..."
  },
  "composition": {
    "floorplan":    "object-page | list-report | worklist | dialog | wizard | overview-page | form-based",
    "floorplanRationale": "Why this floorplan, not the others (must name ≥1 rejected alternative)",
    "containerComponent": "Top-level SAP component (Dialog, DynamicPage, etc.)",
    "containerRationale": "Why this container, not its alternatives",
    "compositionTree":    "Parent → children, listed by SAP component names",
    "childRationale":     ["Why each top-level child was added"]
  },
  "layout": {
    "autoLayoutDirection": "VERTICAL | HORIZONTAL — and why",
    "sizingStrategy":      "FILL/HUG/FIXED — and where each applies",
    "paddingRationale":    "Why 24/16/8/0px etc.",
    "groupingStrategy":    "Why these children sit together"
  },
  "patternsApplied": [
    {
      "pattern": "Form-in-Dialog | Wizard | Worklist-with-FilterBar | ...",
      "sapGuideline": "URL to SAP Fiori Design Guideline backing the choice"
    }
  ],
  "tokensUsed":     "Why these specific SAP tokens, not raw colors",
  "naming":         "Frame/component naming convention applied to mirror designer style"
}
```

Specs without a `meta.decisions` block are **incomplete** — they may render but
they don't establish that the designer reasoned through the choice.

---

## The five questions to ask before emitting any component

For every region in a draft preview AND every component in a hierarchy:

1. **Why this component?** Name the SAP component and the alternative you
   rejected. (e.g. "MenuButton because the action has 3+ variants — rejected
   Button because Button represents one action, rejected SplitButton because the
   default action isn't more prominent than the variants.")

2. **Why here?** What parent owns it, why this position in the parent's content
   order, what scan path the user follows to reach it.

3. **Why this size/spacing?** Cite the SAP layout token (e.g.
   `sapElement_Compact_Height`, 16px gutter from SAP grid). Never use raw px
   without naming the token.

4. **Why this variant/state?** Active vs visited vs default, primary vs
   secondary intent. Cite the user task that justifies the state.

5. **Which SAP guideline?** A URL to `experience.sap.com/fiori-design-web/...`
   or the SAP UX Pattern reference backing the choice.

If you can't answer all five for a component, you don't understand the design
decision yet — don't emit the spec until you do.

---

## Component composition as the unit of work

Every container that ships in SAP has a **composition contract**. The plugin's
registry encodes this in `composition.{validParents, validChildren, mustInclude,
mustExclude, commonSiblings}`. The AI layer must respect it:

- **Don't emit isolated containers** — emit complete compositions
- **Auto-fill `mustInclude` children** — Dialog without footer Buttons is invalid
- **Surface `commonSiblings` proactively** — Tables almost always include OverflowToolbar
- **Reject `mustExclude` parents** — Dialog never contains ShellBar

The `mustInclude` auto-fill in the plugin is a safety net, not the goal. The AI
should reason about complete compositions in Step 2.5 (draft preview) so the
spec emerges already complete.

---

## Designer naming convention (mirror in generated specs)

The reference designer files use this naming hierarchy:

```
Dialog                          ← outer wrapper FRAME, named after SAP component
├── Header                      ← real SAP instance
├── Wizard Page Header          ← real SAP instance
├── Wizard-Input Fields         ← mutable content FRAME
│   ├── Select Method           ← SAP composite instance
│   ├── Form Item               ← SAP composite instance
│   └── Table                   ← mutable nested FRAME
│       ├── Toolbar             ← SAP Toolbar with slots
│       └── Content             ← mutable rows FRAME
│           └── Row             ← mutable row FRAME
│               └── Table Cell 002  ← typed SAP instance
└── Footer                      ← real SAP instance
```

Rules:
1. **Names match SAP component names** — never generic ("Frame 1", "Container").
2. **Wrapper frames take the name of the component they represent** — even when
   they're plain frames.
3. **Content areas get domain-specific names** — `Wizard-Input Fields`,
   `Header Object`, `Main Content`, not `Container 2`.
4. **Composition frames inside instances stay named after their SAP role** —
   `Selector Container`, `Text Container`, `Trailing Icon Container`.

---

## The composition contract for each floorplan

These are the canonical compositions a SAP designer would build. The AI must
match this structure unless the user explicitly overrides.

### Dialog (Wizard variant)
```
Dialog (FRAME, 834px)
├── Header (INSTANCE)
├── Wizard Page Header (INSTANCE — embeds Object Header Title + Steps)
├── Wizard-Input Fields (FRAME)
│   └── one of: Select Method | Form (with Form Items) | List | Table
└── Footer (INSTANCE — embeds Previous + Next + Cancel)
```

### Dialog (Simple confirm/info variant)
```
Dialog (FRAME, 574px)
├── Header (INSTANCE — title + close)
├── Content Container (FRAME)
│   └── Text | MessageStrip | List
└── Footer (INSTANCE — primary + secondary action)
```

### Object Page (detail screen)
```
[FRAME named after object, e.g. "AKS_PKG"]
├── Shell Bar (INSTANCE)
└── Main (FRAME)
    ├── Side Navigation (INSTANCE)
    └── Main Content (FRAME)
        ├── Header Object (FRAME)
        │   ├── Header Section 1 (FRAME)
        │   │   ├── Title Object (FRAME — breadcrumb + title)
        │   │   └── Header Menu (FRAME — action buttons)
        │   └── Icon Tab Bar (INSTANCE — Overview/Artifacts/Documents/Tags)
        └── Table (INSTANCE) or content section
```

### List Report (queue)
```
DynamicPage (FRAME)
├── DynamicPageTitle (FRAME — breadcrumb + heading + actions)
├── DynamicPageHeader (FRAME — metadata band)
├── FilterBar (FRAME or INSTANCE — search + selects + variant management)
└── Table (FRAME with Toolbar + Content rows of Table Cells)
```

### Worklist (my-tasks)
Same as List Report but `FilterBar` is simpler (typically just SearchField) and
the Table rows emphasize status semantics.

### Form-based
```
DynamicPage (FRAME)
├── DynamicPageTitle
└── Form Section (FRAME)
    ├── Group Title
    └── Form Items (INSTANCES, one per field)
```

---

## What product-ready means

The designer files at `knowledge/design-patterns/<pattern>.md` are **the quality
benchmark**. A generated screen reaches that benchmark when:

- Every component is either a real SAP instance OR a frame named after the SAP
  component it represents
- Every color binds to a SAP variable (no raw hex)
- Every spacing uses a SAP token where one exists
- Every parent/child pair satisfies the composition contract
- Every variant state (active, selected, disabled) carries the user task that
  justifies it
- The layer panel reads like a SAP designer would have built it manually

---

## How this doctrine is enforced

| Pipeline step | What this doctrine adds |
|---|---|
| Step 1 — Parse requirement | Extract business goal + user goal in addition to data + actions |
| Step 2 — Floorplan selection | Must name ≥1 rejected alternative with reason |
| Step 2.5 — Draft preview | ASCII labels include `[ComponentName]` AND naming follows designer convention |
| Step 3 — Knowledge base | Read `knowledge/design-patterns/` reference records before spec emission |
| Step 4 — Architect | Emit `meta.decisions` block in every spec |
| Step 5 — Registry gate | Composition rules enforced (RULE 8) |
| Step 6 — Generate JSON | Spec validates against composition contract |
| Step 7 — Plugin build | Build follows designer naming convention; layer panel reads correctly |

---

## What the designer reference library teaches (high-level)

After studying 14 reference Figma frames, these patterns recur:

1. **The outer wrapper is always a FRAME named after the SAP component** — never
   the SAP instance itself. This is the only way to add custom content without
   hitting Plugin API instance-locked restrictions.

2. **Structural slots (Header / Wizard Page Header / Footer) are real SAP
   instances** placed as siblings inside the outer frame.

3. **The free content area between structural slots is a FRAME** with a
   domain-specific name (`Wizard-Input Fields`, `Main Content`, `Header Object`).

4. **SAP composite components are preferred over hand-built compositions** —
   use `Form Item` (Label+Input pre-composed) over native Label+Input pair.

5. **Tables are FRAME-of-FRAME-of-INSTANCE** — `Table` frame contains a `Toolbar`
   instance + a `Content` frame; `Content` contains `Row` frames; each `Row`
   contains typed `Table Cell` SAP instances (002 = checkbox, 003 = badge,
   etc.).

6. **Locked instance text is overlaid, not edited** — transparent frame on top
   with real text bound to SAP variables.

7. **Hidden children are intentional** — locked instances ship with `hidden=true`
   children that the designer wants suppressed. The plugin must preserve this
   pattern.

---

## Decision-first generation — the new Step 4 protocol

When the Component Architect emits a spec, the order of reasoning is:

1. **State the business goal** — one sentence
2. **State the user goal on this screen** — one sentence
3. **Pick the floorplan** — name it, name what was rejected and why
4. **Pick the top-level container** — name it, justify the choice
5. **List mandatory children** from `composition.mustInclude` + business logic
6. **List optional children** (`commonSiblings`) with rationale per item
7. **Decide layout** — Auto Layout direction, sizing strategy, padding token
8. **Decide variants** — active states, disabled states, with user-task justification
9. **Cite the SAP guideline URL** for each non-trivial decision
10. **Emit the spec** with full `meta.decisions` block

Step 10 is the only step that produces JSON. Steps 1–9 are reasoning that lives
in the spec's `meta` field so the user (and future Claude sessions) can audit
the decision trail.

---

## The continuous-learning contract

Every new product-ready SAP Figma reference contributed to this project gets:

1. **Fetched via `mcp__figma__get_metadata`** to extract the layer tree
2. **Analyzed** against the framework in this doctrine
3. **Distilled** into `knowledge/design-patterns/<pattern-name>.md` as a reusable
   decision record
4. **Indexed** into the Component Architect's knowledge base so the next spec
   emission considers it

The plugin should grow more correct over time as more designer references
accumulate. The doctrine in this file does not change — only the corpus does.

---

## The goal restated

The plugin must not recreate screens. It must reproduce the **decision-making
process** that creates them. If asked to design something the doctrine has never
seen, the AI should:

1. Identify the closest floorplan from the corpus
2. Apply the composition contract for that floorplan
3. Adapt the children to the user's specific requirement
4. Cite the SAP guideline backing each decision
5. Emit the spec with a full decisions block explaining the trail

This is the difference between **a component generator** and **an SAP
Application Architect**.

---

*This file is the canonical doctrine. Reference Figma frames teach. The doctrine
itself does not change without the user's explicit instruction.*
