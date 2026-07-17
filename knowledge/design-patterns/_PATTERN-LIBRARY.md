# SAP Design Pattern Library — Distilled Rules from Reference Study

> Generated 2026-06-27 from analysis of 14 reference Figma frames across multiple
> SAP product surfaces (AI Gateway, MCP Server Config, AI Orchestration, Purchase
> Order, AKS_PKG). These are the cross-cutting rules an experienced SAP designer
> follows. Each rule is backed by reference evidence (Figma node IDs) so a
> future Claude session can re-verify against the live file.

---

## RULE A — Frame-wrap-around-SAP-instances is the universal composition model

**Evidence**: All 14 references. The outermost wrapper is a plain FRAME named
after the SAP component it represents (`Dialog`, `MCP Server Config`,
`AI - Orchestration`, `Popovers`). SAP component instances ride INSIDE that
frame as children, never as the frame itself.

**Why**: The Plugin API forbids `appendChild` to instance descendants. Wrapping
in a frame is the only way to combine real SAP instances + custom content +
mutable layout.

**Implication for plugin**:
- Never call `figma.createInstance('Dialog')` as the outer container
- Always create a FRAME, name it after the SAP component, and place instances
  as direct children of that frame

---

## RULE B — Three-tier visual hierarchy on detail screens

**Evidence**: `138-27580` (AKS_PKG), `138-116170` (MCP HTTP), `138-132462` (Proxification),
`138:94519` (MCP Server Overview)

**The structure**:
```
Tier 1 — Shell  (52px tall, full width)
Tier 2 — Side Navigation + Main Content (gutter 2px between)
   ├── Side Navigation (256px wide, full height below Shell)
   └── Main Content (remaining width × full height)
        ├── Header Object (53–205px tall — varies by content)
        │   ├── Header Section 1 (breadcrumb + title + actions, 53px)
        │   └── Header Section 2 (status / metadata strip, optional)
        ├── Icon Tab Bar (60px when present at page level)
        └── Content Region (everything below)
Tier 3 — Within Content Region, sections stack vertically
```

**Why this hierarchy**: SAP Fiori 3 visual hierarchy. The user's eye follows
top → left-rail → page-header → tabs → content. Skipping a tier breaks the
mental model.

---

## RULE C — Action groups always go top-right of their scope

**Evidence**: All detail-screen references position Save/Cancel/Delete clusters
at the **top-right of the section they apply to** — page-level actions go
top-right of the page header, dialog-level actions go bottom-right of the
dialog footer, row-level actions go right end of the table row.

**The pattern**:
- Primary action is **rightmost** (closest to the user's mouse for confirm)
- Secondary actions sit to its **left**
- Destructive actions (Delete) sit **furthest left** of the cluster — needs
  the most mouse travel to confirm

**Counter-example from references**: Footer in Dialog has **Previous → Add → Cancel**
arrangement, NOT Add at rightmost. Cancel is rightmost because it's the safe
escape; Add (primary) is the middle position with most visual emphasis.

**Why**: SAP's design system optimizes for **error recovery** — making the safe
action (Cancel) easy to reach and the primary action visually emphasized.

---

## RULE D — Tabs scope the content below them

**Evidence**: `138-25278` (Resources with IconTabBar), `138-27595` (AKS_PKG IconTabBar),
`138-94513`, `138-104657` (Inner Tab Bars in MCP Server Config)

**The pattern**:
- Page-level Icon Tab Bar (60px tall) scopes the entire content region
- Inner Tab Bar (44px tall, no shadow) scopes a section within the page
- Tab selection persists in URL/state — refreshing keeps the user on their tab

**Why nested tabs are valid here but not always**: The MCP Server Config uses
inner tabs because the user has TWO orthogonal axes of navigation: WHICH source
(API/DB/Vector) × WHICH config (which depends on the source). Nesting reflects
the data model.

**When NOT to nest tabs**: If the second axis can be reduced to a Select or
SegmentedButton, prefer that over inner tabs. Two levels of tabs is the
**maximum**; three nested tab bars is a signal the floorplan is wrong.

---

## RULE E — Form Items are pre-composed SAP instances, not Label+Input pairs

**Evidence**: `138-17392`, `138-28424..28430` ("Form Item" instances)

**The pattern**: The designer uses SAP `Form Item` (a single pre-composed
component with Label + Input baked in) over a hand-built Label + Input pair.

**Why**:
- Form Item handles label-to-input vertical alignment automatically
- Form Item enforces consistent 706px row width inside Wizard-Input Fields
- Form Item ships a required-asterisk indicator as part of the component
- Variant overrides (compact vs cozy, required vs optional, disabled vs editable)
  are first-class via setProperties

**Implication for plugin**: We should be importing `Form Item` componentKey
(somewhere inside the SAP Form component_set) and using it for every form field
emission. The current SimpleForm renderer builds Label + Input pairs natively;
designer would use Form Item instances.

**Open question**: The Form Item key was not found in my recent search. It
probably lives nested inside the SAP Form component set. Need to inspect via
get_metadata on the Form node to extract.

---

## RULE F — Tables are FRAMES of FRAMES of typed SAP Cell INSTANCES

**Evidence**: `138-29060..29202` (MCP Server Config table), `138-31770..31813`
(MCP Server Overview table), `138-29050` (Table with Toolbar slot)

**The structure**:
```
Table (FRAME)
├── Toolbar (INSTANCE with ⿻ Left Area slot + ⿻ Actions Compact slot)
└── Content (FRAME)
    └── Row (FRAME, 32px tall in compact)
        ├── Table Cell 002 (INSTANCE — checkbox cell, 32×32 or 38×32)
        ├── Table Cell 014 (INSTANCE — badge/tag cell, 86×32)
        ├── Table Cell 21  (INSTANCE — text cell, ~300px wide, growable)
        ├── Table Cell 015 (INSTANCE — second text cell)
        ├── Table Cell 092 (INSTANCE — selection highlight cell, 32×32)
        └── Table Cell 010 (INSTANCE — action overflow cell, 32×32)
```

**Why typed cells**: Each `Table Cell NNN` is a SAP-published variant. Cell 002
is the row-select checkbox. Cell 014 hosts a Tag. Cell 21 is plain text. Cell
092 is the "highlight" indicator (used for row state). These ship pre-styled,
spaced, and aligned — using them keeps the table consistent with thousands of
other SAP tables.

**Hidden cells are intentional**: The designer files show many
`Table Cell 017/018/019` as `hidden=true` — they're placeholder slots in the
master variant that this specific row doesn't need. Plugin must respect this:
when emitting a Row, only include the cells that are present, but the row's
total cell-set must align across rows for column consistency.

**Implication for plugin**: Our SapTableRow renderer should map column types to
specific Table Cell variants:
- `id: 'cb'` → Cell 002 (checkbox)
- `id: 'rt'` (badge/HTTP method) → Cell 014 (tag-bearing cell)
- `id: 'name'` (text, growable) → Cell 21
- `id: 'type'` / `id: 'ver'` → Cell 015
- `id: 'act'` (actions) → Cell 010

The Tag inside Cell 014 is itself a real SAP `Tag` instance — that's how the
designer gets colored HTTP-method pills.

---

## RULE G — Side Navigation is consistent across all detail screens

**Evidence**: 6 of 6 detail-screen references include the same SAP
`Side Navigation` instance at exactly 256px wide.

**Why constant**: SAP applications maintain navigation context across screens.
Reloading Side Navigation per page would break user spatial memory. The
designer treats it as part of the app shell (along with ShellBar).

**Implication**: The plugin's `NativeSideNav` rendering is correct in concept
but currently uses a synthesized frame. **Should be**: import the real SAP
`Side Navigation` instance and override its `items` via setProperties (if
exposed) or via overlay frames.

---

## RULE H — Status is communicated via color-tinted Tag pills with semantic tokens

**Evidence**: HTTP method badges in `138-17389` (Wizard pages — GET/POST/PUT/DELETE),
status tags in table rows

**The pattern**: A SAP `Tag` instance with **State variant** (Information /
Success / Warning / Error). Each state binds the Tag's fill to a semantic SAP
token: `sapInformationTextColor` (blue) / `sapPositiveTextColor` (green) /
`sapCriticalTextColor` (amber) / `sapNegativeTextColor` (red).

**Why not native color**: The designer never sets raw hex on a Tag. State
variants give automatic dark-mode + accessibility-mode adaptation.

**Implication for plugin**: We already render HTTP badges as Tag instances with
state-mapped tokens — this is correct. Lesson: **state variants are how SAP
encodes semantic status**, not arbitrary colors.

---

## RULE I — Naming convention: SAP component name OR semantic role

**Evidence**: Frame names across all references

**The rules**:
1. **A frame that wraps a SAP component takes the component's name**: `Dialog`,
   `Popovers`, `Card`, `Form Item`
2. **A frame that wraps a domain-specific area takes the domain name**:
   `Wizard-Input Fields`, `Main Content`, `Header Object`, `Properties Drawer`,
   `Title Object`, `Action Wrapper`
3. **A purely-mechanical layout frame can be generic-numbered**: `Frame
   2018776267` — but ONLY if it has no semantic role beyond holding children
4. **Component instances always carry their SAP component name** as the layer
   label — never "Frame 5" for an instance

**Why this hierarchy**:
- Layer-1 names (component or domain) make the layer panel scannable
- Layer-2 names (numbered frames) are the layout-only middle layers
- SAP instance names provide the canonical SAP vocabulary anchor

**Implication for plugin**: When emitting frames, name them by **role**
(`Wizard-Input Fields`, `Action Wrapper`, `Title Object`) — these are
domain-specific composite names. Don't name generic things ("Container").

---

## RULE J — Hidden children are part of the design language

**Evidence**: Every SAP instance shows multiple `hidden=true` children in the
metadata — placeholder/sample children that the designer's specific instance
doesn't want.

**The pattern**:
- The SAP component_set ships with a maximal child set (e.g. Toolbar with 13
  potential action slots: 1st through 13th Action)
- The designer USES some, HIDES the rest
- Hidden children remain in the layer tree — they're not deleted; they're
  invisible

**Why**: Allowing the designer to UN-hide a child later without re-importing
the master. The master variant carries every possible feature.

**Implication for plugin**: When importing a SAP instance with `sapInstanceDetached`,
the resulting frame has many `hidden=true` children. The plugin should preserve
them as-is (don't delete) when injecting overlay content alongside.

---

## RULE K — Composition wraps cross multiple frame layers — not flat

**Evidence**: Almost every reference shows 3–5 layers of nested frames between
the screen root and the actual SAP instances:

```
MCP Server Overview (FRAME — outer)
└── Container (FRAME — body wrapper)
    └── Frame 2018776313 (FRAME — main column)
        └── Frame 2018776314 (FRAME — page header zone)
            └── Frame 2018776271 (FRAME — header section 1)
                └── Frame 2018776270 (FRAME — title group)
                    └── Title Text (FRAME — title typography wrapper)
                        └── Title (TEXT)
```

**Why so many layers**:
- Each layer is an Auto Layout container with one specific responsibility
  (vertical stack vs horizontal row vs padding application)
- Auto Layout doesn't compose well — having 7 properties on one frame is harder
  than nesting 7 single-purpose frames
- Each frame can independently respond to viewport changes

**Implication for plugin**: Don't try to flatten the composition into one
giant frame with complex Auto Layout settings. Build the same kind of nested
hierarchy. Each native frame should do **one thing** (apply padding, stack
vertically, group siblings, host one instance).

---

## What the plugin needs to converge toward

**Currently the plugin does well** (matches the designer):
- Dialog backdrop wrapping (outer FRAME named "Dialog")
- ShellBar and Side Navigation as real instances at the screen root
- Button / Input / Select / CheckBox as real SAP instances inside content frames
- Token-bound fills and strokes everywhere

**Currently the plugin diverges** (doesn't match the designer):
- Wizard step circles built as native frames — designer uses SAP `Wizard Step` instances
- Form Label + Input pairs built natively — designer uses SAP `Form Item` instances
- Table cells built natively in SapTableRow — designer uses typed `Table Cell NNN` instances
- Side Navigation is a NativeSideNav synthesized frame — designer uses SAP `Side Navigation` instance
- Header / Footer in Dialog are native frames — designer uses SAP `Header` / `Footer` instances

**Priority for closing the gap** (in order of user-visible impact):
1. **Wizard steps**: replace native circle+label composition with SAP `Wizard Step` instances overlaid for editable text → fixes the wizard-step appearance the user has flagged twice
2. **Table cells**: import typed `Table Cell 002/014/21/015/010` componentKeys and use them in SapTableRow → tables become inspectable in layer panel as SAP cells
3. **Form Item**: import `Form Item` componentKey from inside the Form component_set; replace SimpleForm's Label+Input pairs → form layouts become inspectable
4. **Side Navigation**: import SAP `Side Navigation` componentKey directly → matches every other detail screen

Each of these requires one componentKey lookup + one renderer update. They're
the natural next session's work.

---

## How to use this library

**For the AI layer (Step 4 component architect)**:
1. Before emitting a spec, identify the closest pattern in this library
2. Use that pattern's composition tree as the starting structure
3. Adapt children to the user's specific requirement
4. Cite the pattern's SAP guideline in `meta.decisions.patternsApplied[]`

**For future continuous learning**:
- When a new product-ready reference is shared, fetch its metadata
- Identify whether it confirms an existing rule (A-K) or surfaces a new one
- If new: add the rule to this file with reference node IDs
- If confirming: append the new node ID to the existing rule's evidence list

This file grows over time. The rules don't change without explicit instruction.

<!-- part of the SAP Fiori knowledge base -->
