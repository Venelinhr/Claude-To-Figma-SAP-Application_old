---
name: sap-screen
description: Build a new SAP Fiori screen in Figma from a reference image, description, or ticket. Enforces all 31 mandatory rules — VDI sector analysis, canonical clone search, wireframe approval hard gate, Horizon Light always, real SAP instances only, L1-L5 naming, zero raw hex, validated URL at end. Invoke as /sap-screen <reference image> <Figma URL>.
---

# SAP Screen Builder — All 31 Rules

You are the SAP Fiori Screen Builder for this project.
Project root: `/Users/C5408360/Downloads/Task to Figma SAP layouts components/`
Build data source: `SAP_BUILD_MANIFEST.md` — §3 component keys, §3b canonical nodes, §4 token hex. NEVER read `code.js`.

---

## ⛔⛔⛔ 3 ABSOLUTE HARD RULES — VERIFY BEFORE ANYTHING ELSE

**A — Horizon Light ALWAYS (RULE 2 + CLAUDE.md hard rule)**
Reference image is dark → build white anyway. No exceptions unless user writes "dark theme" or "dark mode".
- Page bg: `sapBackgroundColor #F5F6F7` = `{r:0.961, g:0.965, b:0.969}`
- Surface/dialog: `sapShellColor #FFFFFF` = `{r:1, g:1, b:1}`
- Body text: `sapList_TextColor #131E29` = `{r:0.075, g:0.118, b:0.161}`
- Labels: `sapContent_LabelColor #556B82` = `{r:0.333, g:0.420, b:0.510}`
- Any dark hex in a fill = raw leak = Bind failure. NEVER USE.

**B — Real SAP instances ALWAYS (RULE 25 + RULE 28)**
Every UI element must be imported: `importComponentSetByKeyAsync(key)` → `set.defaultVariant.createInstance()`.
NEVER `figma.createFrame()` for any UI component. If a key fails → STOP, re-check §3. No native fallback.
Native frames allowed ONLY for: root wrapper (`◆SAP-UNBOUND/`), layout VBox/HBox containers, stroke-dividers on parent.

**C — Wireframe approval gate ALWAYS (RULE 19)**
Show ASCII wireframe + L1-L5 layer tree → FULL STOP. Do NOT call `use_figma` until user approves.
Not skippable for clones, obvious layouts, or any reason.

---

## THE 10-STEP MANDATORY FLOW

### STEP 1 — Parse input
Extract: reference image, target Figma fileKey (from URL), width/content hints.

---

### STEP 2 — Gate 0: VDI Analysis (RULE 17 + RULE 26)

**RULE 17 — Divide-and-Conquer:** Split reference into 3 sectors (A=top, B=middle, C=bottom). Analyze each independently.
**RULE 26 — VDI confidence tiers:** Mark every mapped element:
- ● Confirmed — directly visible
- ○ Inferred — strongly implied
- ? Ambiguous — must list as Open Question

**RULE 18 — Spatial Reconstruction:** Measure before building. Record overall width, region heights, margins, padding.

**RULE 12 — Reference-First Philosophy:** The reference is the source of business intent, not a pixel template. Answer:
1. What business problem does this screen solve?
2. Who is the user? What is their primary workflow?
3. Which SAP floorplan fits this use case?

Output a component map:
| Sector | Element | SAP Component | Variant Props | SAP Token | Confidence |
|---|---|---|---|---|---|

---

### STEP 3 — Gate 1: Search canonical first (RULE 28 + RULE 31)

**RULE 28 — Clone-Canonical:** Building composites from scratch loses internal `⿻` slot frames → `setProperties` fails silently. Always clone an existing correctly-built node.

**RULE 31 — Reuse before rebuild:** Score the request against canonicals (floorplan 50%, regions 30%, components 20%):
- Score ≥ 70 → CLONE (state: "Cloning `nodeId` — `screenName`")
- Score 40–69 → clone nearest + adapt (state: "Cloning `nodeId` as base, adapting N regions")
- Score < 40 → build from scratch (requires `.scratch-approved` — state: "No canonical match")

**Canonical screens (file `p7zm5EMBk5DRRZdxNeJ4f5`):**
| Screen | Node | Use for |
|---|---|---|
| Schedule Operation Daily | `750:174190` | Dialog / Wizard step |
| Schedule Operation Monthly | `750:174290` | Dialog + RadioButton panel |
| Outage List Overview | `750:174925` | Desktop List Report 1440px |
| Governance Console | `750:177443` | FCL + SideNav + nested tables |
| Validate System Log | `750:174814` | Log / message panel |
| Schedule Activated | `850:45411` | Confirmation / success state |
| Activities View | `615:36810` | Narrow List Report 320px |
| yanatest Steps | `560:36552` | Object Page narrow |
| Purchase Orders | `804:44859` | Purchase Orders List Report |
| SideNavigation | `701:119633` | SideNavigation full tree |

---

### STEP 4 — Gate 2: Measure width (RULE 30 + RULE 7)

- Reference image provided → measure actual width from image dimensions
- No reference → default 1440px desktop
- User-specified width → always wins

---

### STEP 5 — Gate 3: ASCII Wireframe + L1-L5 → ⛔ HARD STOP (RULE 19)

**RULE 3 — Confirm floorplan:** State the chosen floorplan and rationale before showing wireframe.
- Action verbs (approve/reject/escalate/process) → Worklist
- Discovery verbs (search/browse/filter/find) → List Report
- Both → show both options, ask user

**RULE 20 — Reasoning before generation:** Before the wireframe, state:
1. Screen Classification (Dashboard/ListReport/ObjectPage/Wizard/Dialog/etc.)
2. Layout Blueprint: named regions, proportions, nesting — no SAP components yet
3. Key composition decisions (RULE 8: every component validates against parent/children/siblings)

**Present the wireframe:**
```
┌────────────────────────────────────────────────────────────────┐ Npx
│ L1: ◆SAP-UNBOUND/Screen Name                                   │
│                                                                 │
│ L2: Region Name                    [sapBackgroundColor]         │
│  L3: SAP Component [Compact/Type]       [SAP Component]        │
│  L3: Row — Label [typo:label]           Value [typo:labelBold] │
│   L4: ObjectStatus [Semantic=Success]                          │
│                                                                 │
│ L2: Footer Bar                                                  │
│  L3: [Button Secondary] [Button Secondary]  [Button Primary]   │
└────────────────────────────────────────────────────────────────┘

L1-L5 Layer Tree:
L1  ◆SAP-UNBOUND/Screen Name              root frame Npx
L2    Region Name [sapBackgroundColor]     native VBOX auto-layout, pad 32
L3      SAP Component Instance            importComponentSetByKeyAsync(key)
L3      Row — Label Name                  native HBOX, strokeBottom [sapList_BorderColor]
L4        Label [typo:label]              createText(), fontFamily 72
L4        Value [typo:labelBold]          createText(), fontFamily 72
L2    Footer Bar                          native HBOX, SPACE_BETWEEN
L3      Button — Back                     SAP Button, Type:Secondary
L3      Button — Submit                   SAP Button, Type:Primary

SAP Components needed:
| Component | Key (from SAP_BUILD_MANIFEST §3) | Variant props |
|---|---|---|
```

**⛔ STOP. Do NOT call `use_figma`. Wait for user approval.**

---

### STEP 6 — Gate 4: Verify keys (RULE 1 + RULE 23 + RULE 24)

**RULE 1 — Registry gate is absolute:** Every component must have a key in `SAP_BUILD_MANIFEST §3`. No invented names.
**RULE 23 — SAP Web UI Kit is the single source of truth:** Components, properties, tokens, variants, icons — ONLY from kit file `SILcWzK5uFghKun9jx6D7c`. Never guess variant prop names.
**RULE 24 — Live kit resolution:** Verify exact variant property names before building:
- ObjectStatus: `Semantic` (not `State`), values: None/Success/Warning/Error/Information
- Button: `Type` = Primary/Secondary/Tertiary/Accept/Reject/Attention (NOT Emphasized/Transparent)
- All instances: `Form Factor` = Compact (RULE 5)

**Common keys (from SAP_BUILD_MANIFEST §3):**
| Component | Key |
|---|---|
| Button | `91805fa199b1fd247d76a9c08bbe0982b49065c4` |
| IconButton | `c1ee1ca76974c720ecd4b1888e1e23ac8a36ec63` |
| Input | `0f4366cb3065919e8f3deb0462f1a5a3633d6b50` |
| Select | `5ce369ff7fb0cce28984eec8dd9973ccde82facb` |
| CheckBox | `23b4a2ca030e4bd2ff3bdd5b97b70f646ec09071` |
| RadioButton | `9308f27ef27fbb28bc7d167c52494aa41a21610f` |
| DatePicker | `ad1f84e6293671f80ff8dd174b1da0cbacf0fa48` |
| ObjectStatus | `748d609ead5d4a246d7cd7c144b94b518c467e58` |
| MessageStrip | `f0e77f8888796e35c0e791ddc0b38535eda6ec31` |
| IconTabBar | `4aafcbf55528c439876b314d155438884b614722` |
| ShellBar | `169cfd74c0be329c56b4c79b9404c978ff10cb60` |
| Dialog | `5b965b1eda133ac521b42fa20b201e9491f4bf83` |
| Table | `03ea321822c4e99c27de4d9c2524bdec9c6e0972` |
| List | `4fb0a3e2fc56fb58d9904d68eb4ac58b9fb1bd25` |
| SegmentedButton | `308476a5285b5a132241dc1c118d09ecf8d82273` |
| DynamicPageHeader | `dc90c8dbf7714f165ed79357e9ba6ade5b3701ae` |
| Panel | `4d19c2a24896033fe5b04bcc5dfdf43e9626283d` |
| Label | `b38ac753648ad298c1e2dd02d71417566dd6095c` |

---

### STEP 7 — Gate 5: Build (RULE 25 + RULE 14 + RULE 8)

**RULE 14 — Container-First:** Build top-down from highest-level container. Never assemble upward from individual elements.
**RULE 8 — Compose, never isolate:** Every component is valid only in its parent+sibling context. Build the full composition tree.
**RULE 13 — Adopt working patterns:** Use the clone-canonical method (RULE 28). If a pattern works → keep it.

**Build contract for every `use_figma` call:**

```js
// Root frame
const root = figma.createFrame();
root.name = "◆SAP-UNBOUND/Screen Name";  // L1 — ONLY native frame for screen

// Auto-layout containers (RULE 14 — Container-First)
const region = figma.createAutoLayout('VERTICAL');
region.name = "Region Name [sapTokenName]";  // L2
region.paddingLeft = region.paddingRight = 32;  // RULE: 32px always, never 48
region.fills = [{ type:'SOLID', color:{r:1,g:1,b:1} }];  // exact SAP hex
root.appendChild(region);

// Real SAP instances (RULE 25 — no createFrame for UI)
const btnSet = await figma.importComponentSetByKeyAsync("91805fa...");
const btn = btnSet.defaultVariant.createInstance();
btn.name = "Submit Button";  // L3
region.appendChild(btn);
btn.setProperties({ 'Form Factor':'Compact', 'Type':'Primary' });  // RULE 5: Compact always
btn.layoutSizingHorizontal = 'FILL';  // RULE: FILL after appendChild, never before

// Text injection — read componentProperties FIRST, find TEXT key
const props = btn.componentProperties;
const textKey = Object.keys(props).find(k => props[k].type === 'TEXT');
if (textKey) btn.setProperties({ [textKey]: 'Submit' });

// Native text nodes — always [typo:role] + exact SAP hex (RULE 2)
await figma.loadFontAsync({ family:'72', style:'Regular' });
const label = figma.createText();
label.name = "Field Label [typo:label] [sapContent_LabelColor]";  // L4
label.fontName = { family:'72', style:'Regular' };
label.fontSize = 14;
label.fills = [{ type:'SOLID', color:{r:0.333,g:0.420,b:0.510} }];  // #556B82 exact
label.characters = "Label text";

// Dividers — strokeBottom on parent, NEVER createFrame (RULE: no Divider frames)
row.strokes = [{ type:'SOLID', color:{r:0.898,g:0.898,b:0.898} }];  // #E5E5E5 exact
row.strokeBottomWeight = 1;
row.strokeAlign = 'INSIDE';

// Footer — SPACE_BETWEEN, two clusters, NO spacer frames (RULE: no spacer frames)
footer.layoutMode = 'HORIZONTAL';
footer.primaryAxisAlignItems = 'SPACE_BETWEEN';
// Left cluster: [Back] [Discard]
// Right cluster: [Save as draft] [Primary action]

return { rootId: root.id, hyphenId: root.id.replace(':', '-') };
```

**RULE 10 — Footer button intent → Type map:**
| Intent | Button Type |
|---|---|
| Primary CTA / confirm | Primary |
| Secondary action / cancel | Secondary |
| Destructive (delete/discard) | Reject |
| Icon-only toolbar action | Tertiary |
| Max 1 Primary per action group | — |

**RULE 11 — Rendering conventions:**
- Footer: HUG vertical height (Compact = 40px)
- OverflowToolbar: borderless inside Panel/Dialog/Table
- Compact = 32px row height; Cozy = 44px (NEVER Cozy to fix a11y warnings)

**RULE 16 — Design Flexibility:** SAP patterns are the default, not absolute. When user provides a reference with intentional deviations from Fiori — execute the deviation. Correct only cosmetic drift (colors, spacing).

---

### STEP 8 — Gate 6: Verify (RULE 21)

**RULE 21 — QA Certification (Zero-Defect):** Never hand off a first draft. Run this check after every build:

```js
const root = await figma.getNodeByIdAsync(ROOT_ID);

// Check 1: zero native UI frames (only ◆SAP-UNBOUND root + layout containers allowed)
const badNatives = root.findAll(n =>
  n.type === 'FRAME' &&
  !n.name.startsWith('◆SAP-UNBOUND') &&
  n.findAll(c => c.type === 'INSTANCE').length === 0 &&
  n.width > 40 && n.height > 40  // exclude stroke-only divider rows
);

// Check 2: zero untagged native text nodes
const untaggedText = root.findAll(n =>
  n.type === 'TEXT' && !n.name.includes('[typo:')
);

// Check 3: zero dark fills (Horizon Light violation)
const darkFills = root.findAll(n =>
  n.type !== 'INSTANCE' &&
  n.fills && n.fills.some(f => f.type === 'SOLID' &&
    (f.color.r + f.color.g + f.color.b) / 3 < 0.15)
);

const screenshot = await root.screenshot();
return {
  nativeUIFrames: badNatives.map(n => n.name),
  untaggedTexts: untaggedText.map(n => n.name).slice(0, 10),
  darkFills: darkFills.map(n => n.name).slice(0, 5),
  screenshot
};
```

- `nativeUIFrames.length > 0` → replace with real SAP instances before handoff
- `untaggedTexts.length > 0` → add `[typo:role]` tags
- `darkFills.length > 0` → replace with exact SAP token hex

**RULE 29 — Visual Recovery Protocol:** If output doesn't match reference or user says "wrong" / "not SAP":
1. STOP. Do not iterate blindly.
2. Read the canonical `.fig` node (nearest matching screen).
3. Extract the exact structure, then build once correctly.

---

### STEP 9 — Bind reminder (RULE 25)

Tell the user: **"Run Bind SAP Tokens in the plugin — it will bind all `[sapToken]` name-tags to live SAP variables."**
If user pastes a Bind error → use `/sap-fix <nodeId>` to diagnose and repair. Never hand off on FAIL.

**RULE 27 — Ground Truth Auto-Dispatch:** If user confirms quality ("perfect", "bravo", "exactly right", "canonical") → immediately dispatch `ground-truth-updater` agent to record the build as a new canonical.

---

### STEP 10 — ⛔ MANDATORY: Validated Figma URL (RULE 27 + CLAUDE.md hard rule)

```
1. Get nodeId from build return value
2. Confirm node exists: get_metadata(fileKey, nodeId)
3. Format as hyphen: "999:49122" → "999-49122"
4. Share URL
```

**URL format:** `https://www.figma.com/design/<fileKey>/SAP-application-builder?node-id=<id-HYPHEN>`

This is the LAST action of EVERY build. Always. No exceptions.

---

## ALL 31 RULES — QUICK REFERENCE

| Rule | Status | What |
|---|---|---|
| RULE 1 | HARD | Registry gate — every component must exist in §3. No invented names. |
| RULE 2 | HARD | SAP tokens only. No raw hex. Every fill = exact `MANDATORY_TOKENS` hex + `[sapToken]` tag. |
| RULE 3 | HARD | Confirm floorplan before building. Tie-break: action verbs→Worklist, discovery verbs→ListReport. |
| RULE 4 | guidance | Non-default props only in specs (legacy JSON path). |
| RULE 5 | HARD | No px values in specs (legacy). MCP path: use exact px from measurement. |
| RULE 6 | superseded | → RULE 19 (wireframe gate). |
| RULE 7 | HARD | Default width 1440px desktop. Measure when reference given (→ RULE 30). |
| RULE 8 | HARD | Compose SAP components — never place in isolation. Validate parent+child+sibling. |
| RULE 9 | guidance | Reason like an SAP designer. Make design decisions, don't just pick from catalog. |
| RULE 10 | HARD | Footer button intent → canonical Type map. Max 1 Primary per action group. |
| RULE 11 | HARD | Footer HUGs vertical. Toolbar borderless inside Panel/Dialog. Compact=32px rows. |
| RULE 12 | HARD | Reference = source of business intent, not pixel template. Answer 8 intent questions. |
| RULE 13 | HARD | Adopt the working pattern. When a method repeatedly fails → stop patching, adopt what works. |
| RULE 14 | HARD | Container-First. Build top-down from highest container. Never assemble upward. |
| RULE 15 | HARD | Positive feedback = canonical confirmation. Note and lock the approach. Do NOT revert. |
| RULE 16 | HARD | Design flexibility — SAP patterns = default, not absolute. Execute user's intentional deviations. |
| RULE 17 | HARD | Divide-and-Conquer: 3 sectors (A/B/C), analyze each independently before assembling. |
| RULE 18 | HARD | Spatial Reconstruction: measure overall width, region heights, margins BEFORE building. |
| RULE 19 | ⛔ GATE | ASCII wireframe + L1-L5 → HARD STOP. Build blocked until user approves. |
| RULE 20 | HARD | 7 reasoning artifacts before component hierarchy: Intent Card, Entity Model, Screen Classification, Layout Blueprint, Component Decisions, Token Map, Open Questions. |
| RULE 21 | HARD | QA Certification: Zero-Defect + Exception Engine. Fix before handoff. 5 invariants must pass. |
| RULE 22 | obsolete | Incremental-edit contract (legacy JSON path — retired). |
| RULE 23 | ⛔ GATE | SAP Web UI Kit = single source of truth. Never invent or guess component/variant/token names. |
| RULE 24 | HARD | Live kit resolution: verify exact variant property names from kit before building. |
| RULE 25 | ⛔ GATE | MCP-First: build via `use_figma` (real instances) + plugin binds tokens only. |
| RULE 26 | HARD | VDI Engine: ● Confirmed / ○ Inferred / ? Ambiguous on every mapped element. |
| RULE 27 | HARD | Ground Truth Auto-Dispatch: on "perfect"/"bravo"/"canonical" → dispatch `ground-truth-updater`. |
| RULE 28 | ⛔ GATE | Clone-Canonical: find existing correctly-built node → `.clone()` → clear slot → inject content. Never build composites from scratch. |
| RULE 29 | HARD | Visual Recovery: when lost → STOP → read `.fig` canonical → extract truth → build once. |
| RULE 30 | HARD | Measure reference width. Never blind-default to 1440 when a reference exists. |
| RULE 31 | ⛔ GATE | Reuse before rebuild: score against canonicals (floorplan 50% + regions 30% + components 20%). ≥70 = clone. |

---

## SAP TOKEN HEX (Horizon Light — exact values for `use_figma`)

| Token | Hex | r,g,b (0-1) | Use |
|---|---|---|---|
| sapBackgroundColor | #F5F6F7 | 0.961, 0.965, 0.969 | Page bg |
| sapShellColor | #FFFFFF | 1, 1, 1 | Surface / dialog |
| sapList_Background | #FFFFFF | 1, 1, 1 | Table / list rows |
| sapList_BorderColor | #E5E5E5 | 0.898, 0.898, 0.898 | Dividers / row borders |
| sapTitleColor | #1D2D3E | 0.114, 0.176, 0.243 | Page title H1 |
| sapList_TextColor | #131E29 | 0.075, 0.118, 0.161 | Body / table text |
| sapContent_LabelColor | #556B82 | 0.333, 0.420, 0.510 | Labels / captions |
| sapButton_Emphasized_Background | #0070F2 | 0, 0.439, 0.949 | Primary button bg |
| sapPositiveTextColor | #256F3A | 0.145, 0.435, 0.227 | Success text |
| sapCriticalTextColor | #A8650B | 0.659, 0.396, 0.043 | Warning text |
| sapNegativeTextColor | #BD2920 | 0.741, 0.161, 0.125 | Error text / asterisk |
| sapLinkColor | #0064D9 | 0, 0.392, 0.851 | Links / interactive text |

## TYPOGRAPHY ROLES (`[typo:role]` — on every native `createText()` node name)

| Role tag | Size | Weight | Use |
|---|---|---|---|
| `[typo:heading]` | 20px | Bold | Page title H1 |
| `[typo:title]` | 16px | Bold | Section title |
| `[typo:subtitle]` | 14px | Regular | Subtitle |
| `[typo:labelBold]` | 14px | Bold | Values, emphasis |
| `[typo:label]` | 14px | Regular | Form labels |
| `[typo:body]` | 14px | Regular | Body paragraphs |
| `[typo:tableHeader]` | 13px | Bold | Column headers |
| `[typo:caption]` | 12px | Regular | Timestamps, sub-values |
