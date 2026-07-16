# Designer Composition Pattern — Reference Architecture · 2026-06-27

Analysis of how the human product designer composes SAP Fiori screens in Figma,
extracted from 8 reference frames in the project file (nodes 138-17384 through
138-31760). This is the **canonical model the plugin must converge toward**.

## The single most important insight

**The Plugin API forbids `appendChild` into any descendant of an instance.** Period.
This rule trips up every attempt to "use the SAP Dialog as a container". You cannot
import the SAP Dialog instance, detach it, and then push content into its internal
Wizard-Input Fields frame — because that frame's parent chain still has the
detached Dialog at the top, and Figma classifies its descendants as instance-locked.

**The designer's solution**: they build a **mutable outer frame** named "Dialog"
and place SAP component instances as **sibling children** of that frame — not as
children of a detached Dialog instance. The visual result is the same; the layer
tree is completely different.

## The designer's layer model

```
[FRAME: "Dialog" — outer wrapper, mutable, 834×632]
│
├── [INSTANCE: "Header"]                  ← SAP component, 834×40, locked
├── [INSTANCE: "Wizard Page Header"]      ← SAP component, 834×72, locked
├── [FRAME: "Wizard-Input Fields"]        ← mutable content area, 770×variable
│   │
│   ├── [INSTANCE: "Select Method"]       ← SAP form-section instance
│   ├── [INSTANCE: "Text"]
│   ├── [INSTANCE: "Form Item"]           ← SAP composite Label+Input row
│   ├── [INSTANCE: "Form Item"]
│   └── [FRAME: "Table"]                  ← mutable table frame
│       ├── [INSTANCE: "Toolbar"]         ← SAP Toolbar with ⿻ slots
│       └── [FRAME: "Content"]            ← mutable rows container
│           └── [FRAME: "Row"]            ← mutable row
│               ├── [INSTANCE: "Table Cell 002"]   ← typed SAP cells
│               ├── [INSTANCE: "Table Cell 003"]
│               ├── [INSTANCE: "Table Cell 014"]
│               │   └── [INSTANCE: "Tag"]          ← nested SAP instance
│               └── [INSTANCE: "Table Cell 005"]
│
├── [INSTANCE: "Footer"]                  ← SAP component, 834×40, locked
└── [FRAME: "Wizard Page Header" overlay] ← optional: overlay frame for editable
                                            text on top of the locked instance
```

## Six rules the designer follows

### 1. The outermost wrapper is always a FRAME, never a detached instance
The frame is named after the SAP component it represents (`Dialog`, `Card`,
`Toolbar`) but is itself a mutable frame. This gives the plugin freedom to add
or remove children at any time.

### 2. Each "structural slot" of a SAP component is a real INSTANCE
A Dialog has three structural slots that ship as SAP components:
- `Header` (the title bar with close button) — `5b965b1eda133ac521b42fa20b201e9491f4bf83` variant
- `Wizard Page Header` (the steps row) — different SAP component
- `Footer` (the action button bar) — different SAP component

These ride as siblings in the outer Dialog frame. Each retains its purple-diamond
instance icon in the layer panel and is variant-swappable via `setProperties`.

### 3. The content area BETWEEN structural slots is a FRAME
Named like `Wizard-Input Fields`, `Content Container`, `Main Content`. This
frame is fully mutable — the plugin can append any children. This is where the
form, list, table, or panel goes.

### 4. Inside the content frame, drop more SAP instances
Real SAP instances for `Form Item`, `Select Method`, `Toolbar`, `Table Cell`, `Tag`,
`Radio Button`, `Text`, `Input`. Each shows as a purple diamond.

### 5. Tables are FRAMES of FRAMES of INSTANCES
A `Table` frame contains a SAP `Toolbar` instance + a `Content` frame.
The `Content` frame holds `Row` frames. Each `Row` frame holds typed
`Table Cell 002/003/004/005/010` SAP instances. The cells themselves
are pre-composed SAP components that contain text, tags, buttons.

### 6. Locked instance text is overlaid, not edited
When a SAP instance ships with text (e.g. the bake-in step labels in
`Wizard Page Header`), the designer DOES NOT try to edit that text directly
(the Plugin API forbids it). Instead, they drop a **transparent overlay frame**
at the same x/y/width/height with a text node containing the real label.
The overlay sits visually on top, hiding the underlying locked text.

## How this maps to the plugin

The plugin's current Dialog renderer builds a mostly-correct outer frame
composition but:
1. Uses **native frames** for Header, Wizard Steps, and Footer — should be **real SAP instances**
2. Builds Wizard Steps as native circles+labels — should overlay a SAP
   `Wizard Page Header` instance with editable step text overlays
3. Builds Table rows as native frames — should use SAP `Table Cell` typed instances

## Implementation plan (incremental — no breaking changes)

### Phase 1 — Replace native structural frames with SAP instances
- Find SAP_KEYS componentKeys for:
  - `Header` (Dialog header bar component)
  - `Wizard Page Header` (Dialog wizard steps component)
  - `Footer` (Dialog footer bar component)
  - `Form Item` (Label + Input row composite)
  - `Table Cell` variants (002, 003, 004, 005, 010, 092)
- Add them to `SAP_KEYS` and `KEY_MAP`
- Use them as siblings inside the outer Dialog frame

### Phase 2 — Wire title/footer text overlay pattern
- After placing the `Header` instance, drop a same-size transparent frame
  on top with a text node bound to `sapTitleColor` and the user's title
- After placing `Footer`, drop overlay frames with Button instances at the
  right positions for Previous/Next/Cancel

### Phase 3 — Use SAP Form Item / Table Cell composite components
- For each form row, place a `Form Item` SAP instance instead of native
  Label+Input pair. Set its label/value via the Form Item variant properties
  if exposed; otherwise overlay text on top of the locked positions.
- For each table row, build a `Row` frame containing typed `Table Cell` instances
  (002 = checkbox, 003 = badge column, 004 = text column, 005 = number column,
  010 = action column)

## What this costs

- Looking up ~10 more SAP componentKeys via `figma.search_design_system`
- Adding them to the registry + SAP_KEYS
- Refactoring the Dialog handler to compose siblings instead of injecting into instances
- Same pattern then applies to Card, Panel, Wizard, Table renderers
- **No more `appendChild` errors** — the rule is: only appendChild to FRAMES we created ourselves

## What this gains

- Layer panel shows real SAP component instances (purple diamonds)
- Variant overrides work via `setProperties` on the placed instances
- Designer can swap an entire row by replacing the SAP instance variant
- Plugin output matches what a human SAP designer would build in Figma manually
- SAP republishes (component key rotation) flow through automatically

---

This document is the architectural target. Captured 2026-06-27. Status: pattern
understood and documented; phased implementation pending.
