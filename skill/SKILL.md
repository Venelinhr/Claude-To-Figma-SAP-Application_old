# SAP Figma Design Agent

Transform a business requirement into a validated SAP Fiori screen spec by combining AI reasoning with live SAP documentation fetched from the official sources.

---

## The Pipeline

```
User describes business need
        ↓
Step 1: Claude reads and understands the requirement
        ↓
Step 2: Claude researches SAP sources (DemoKit API + Fiori Guidelines + Samples)
        ↓
Step 3: Claude presents proposed structure — asks questions, explains choices
        ↓
Step 4: User confirms, refines, or requests changes
        ↓
Step 5: Claude generates validated JSON spec
        ↓
User pastes JSON into Figma plugin → Build Screen
```

---

## Step 1 — Understand the Requirement

Read the user's message carefully. Extract:

- **Who** is the user (role, context)
- **What** they need to do (task, goal)
- **What data** they work with (entities, fields)
- **What actions** they take (approve, reject, search, create, edit)
- **Scale** (how many items, how often)
- **Context** (desktop/mobile, SAP system, density)

Do NOT jump to components yet. Understand the problem first.

---

## Step 2 — Research SAP Sources

For every component you are considering using, fetch live documentation before recommending it.

### Source A — UI5 API JSON (always fetch first, no browser needed)

```
sap.m controls:  https://ui5.sap.com/test-resources/sap/m/designtime/apiref/api.json
sap.f controls:  https://ui5.sap.com/test-resources/sap/f/designtime/apiref/api.json
sap.uxap:        https://ui5.sap.com/test-resources/sap/uxap/designtime/apiref/api.json
```

From each control's entry extract:
- `description` — what it does
- `properties` — all configurable options with defaults
- `aggregations` — what it contains (slots)
- `events` — what it fires
- `uxGuidelinesLink` — the Fiori guidelines URL (auto-discovered)

**Fetch script (use with Chrome MCP evaluate_script on ui5.sap.com):**
```javascript
const res = await fetch('https://ui5.sap.com/test-resources/sap/m/designtime/apiref/api.json');
const json = await res.json();
const ctrl = json.symbols.find(s => s.name === 'sap.m.Button');
return {
  name: ctrl.name,
  description: ctrl.description?.replace(/<[^>]+>/g, ''),
  uxGuidelinesLink: ctrl.uxGuidelinesLink,
  properties: (ctrl.properties||[]).map(p => ({ name: p.name, type: p.type, default: p.defaultValue })),
  aggregations: (ctrl.aggregations||[]).map(a => ({ name: a.name, type: a.type }))
};
```

### Source B — Fiori Design Guidelines (Chrome MCP, bypasses 403)

Use `uxGuidelinesLink` from Source A as the URL:
```
Chrome MCP:
  navigate_page(ctrl.uxGuidelinesLink)
  wait_for(['When to Use', 'Usage', 'Do', "Don't"])
  take_snapshot()  → full page text
```

Extract:
- Purpose (1-2 sentences)
- When to use (bullet list)
- When NOT to use (bullet list)
- Do / Don't
- Available variants
- Responsive behavior
- Accessibility notes

### Source C — UI5 DemoKit Samples (Chrome MCP)

```
navigate_page('https://ui5.sap.com/#/entity/sap.m.Button/samples')
take_snapshot()  → available sample names and descriptions
```

Use to understand real-world usage patterns.

### Cache results

After fetching, write a summary to `knowledge/guidelines/{slug}.md`.
Check this file first before fetching — if it exists, read it and skip the fetch.

### If Chrome MCP is unavailable

Fall back to:
1. `knowledge/schemas/{Component}.json` — local schemas with props, composition, a11y
2. `knowledge/guidelines/{slug}.md` — previously cached summaries
3. Training knowledge of SAP Fiori patterns

---

## Step 3 — Present Proposed Structure

Before generating anything, present your thinking to the user. Format:

```
Based on your requirement, here is what I propose:

FLOORPLAN: {Worklist / List Report / Object Page / ...}
WHY: {one sentence rationale}

COMPONENTS I PLAN TO USE:

ShellBar
  Why: Required on every SAP Fiori screen. Provides app navigation shell.
  Variant: Compact density, product name = "{app name}"
  Source: {uxGuidelinesLink}

DynamicPageTitle
  Why: Page header area with title and actions toolbar.
  Variant: No VariantManagement (Worklist pattern)
  Source: {uxGuidelinesLink}

OverflowToolbar
  Why: Houses the primary actions above the table.
  Contains: Button (Approve), Button (Reject) — one primary, one destructive
  Source: {uxGuidelinesLink}

Table (sap.m.Table)
  Why: Responsive table for list of items. MultiSelect for bulk actions.
  Columns: {list columns from requirement}
  Density: Compact (back-office)
  Source: {uxGuidelinesLink}

ObjectStatus
  Why: Semantic status display per row (Success/Warning/Error colors).
  Use for: {status field from requirement}
  Do: Use for state that has business meaning
  Don't: Use for decorative color only
  Source: {uxGuidelinesLink}

WHAT I AM NOT USING AND WHY:
  FilterBar — Worklist is pre-scoped by role, no user-defined filtering needed
  DynamicPageHeader — No collapsible header needed for this task queue

QUESTIONS BEFORE I GENERATE:
  1. Should the table support bulk selection (MultiSelect) or single row actions only?
  2. What is the app/product name for the ShellBar?
  3. Are there any additional status values beyond the ones you mentioned?
```

Wait for user confirmation before proceeding.

---

## Step 4 — Incorporate Feedback

The user may:
- **Confirm** → proceed to Step 5
- **Request changes** → "Add a FilterBar", "Remove the footer", "Use Cozy density"
- **Ask questions** → answer using the fetched guidelines
- **Suggest components** → validate against registry, explain if not possible

Always update your proposal before generating. Show what changed:
```
Updated: Added FilterBar as requested. Note: this changes the floorplan
from Worklist to List Report — the user now defines their own filter scope.
```

Ask follow-up questions if the change has implications:
```
Adding a FilterBar means the user controls which records they see.
Should I also add VariantManagement so they can save filter combinations?
```

---

## Step 5 — Generate JSON Spec

Only after explicit confirmation ("yes", "go ahead", "generate it", "looks good").

### Hard rules (never violate)

1. **Registry gate** — every component must have a file in `knowledge/schemas/`. No exceptions. Check before including.
2. **No invented components** — only verified SAP controls
3. **No invented properties** — only documented API properties
4. **Props = non-default values only** — never list props matching SAP defaults
5. **ShellBar first** — always the first item in `hierarchy[]`
6. **Slots for named aggregations** — DynamicPage, Table, Panel use `slots`, not `children`
7. **validationStatus = "pass"** — only after all checks pass

### Include in meta

```json
"meta": {
  "requirement": "...",
  "floorplan": "...",
  "floorplanRationale": "...",
  "rationale": "...",
  "validationStatus": "pass",
  "unverifiedComponents": [],
  "guidelinesChecked": [
    "https://experience.sap.com/fiori-design-web/button/",
    "https://experience.sap.com/fiori-design-web/responsive-table/"
  ],
  "samplesChecked": [
    "https://ui5.sap.com/#/entity/sap.m.Button/samples"
  ]
}
```

### Save and deliver

1. Save to `/Users/C5408360/Downloads/{screen-name}-spec.json`
2. Validate with `python3 -c "import json; json.load(open('...'))"` — must pass
3. Copy to clipboard with `pbcopy`
4. Tell the user: **"Spec saved and copied to clipboard. Paste into Figma plugin → Validate → Build Screen."**

---

## Entry Points

### "Build me a screen / I have a requirement"
→ Run the full pipeline above (Steps 1-5)

### "Guide me / Which component / Do/don't for..."
→ Route to `agents/component-guidance.md`
→ Fetch guidelines, explain, answer — no spec generated unless asked

### "Change the spec / Add X / Remove Y"
→ Load the last spec, apply the change, validate, save, copy to clipboard

---

## Floorplan Quick Reference

| Signal | Floorplan |
|---|---|
| Pre-scoped task queue, process own items, bulk actions | **Worklist** |
| Open dataset, user sets filters, search across all | **List Report** |
| Single business object, multiple detail sections | **Object Page** |
| Multiple KPIs and lists on one dashboard | **Overview Page** |
| List + detail side by side | **Master Detail** |
| Multi-step guided process | **Wizard** |

---

## Chrome MCP Quick Reference

```javascript
// List open pages
list_pages()

// Navigate to any URL including SPA # routes
navigate_page('https://ui5.sap.com/#/entity/sap.m.Table')

// Wait for content to load
wait_for(['When to Use', 'Properties', 'Samples'])

// Get full page text (accessibility tree — all visible text)
take_snapshot()

// Run JavaScript in the page (fetch API JSON)
evaluate_script(`
  const r = await fetch('https://ui5.sap.com/test-resources/sap/m/designtime/apiref/api.json');
  const j = await r.json();
  return j.symbols.find(s => s.name === 'sap.m.Button');
`)
```

**Stale lock fix (if Chrome MCP errors):**
```bash
rm -f ~/.cache/chrome-devtools-mcp/chrome-profile/Default/LOCK \
       ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock \
       ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonSocket \
       ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonCookie
```
