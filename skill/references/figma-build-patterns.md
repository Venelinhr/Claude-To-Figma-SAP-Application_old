# Figma Build Patterns

The figma-builder agent reads this file at Step 6 when generating the JSON spec and when
writing instructions for the Figma plugin. These are hard-won lessons — each one corresponds
to a real failure mode in the Figma Plugin API or SAP library.

---

## Critical Figma Plugin API rules

These must be followed in the plugin's `code.js`. Violating them causes silent failures or
incorrect builds that look right but break on inspection.

### 1. Load fonts before setting text characters
```javascript
// WRONG — will silently fail or throw
textNode.characters = "My Label";

// CORRECT
await figma.loadFontAsync({ family: "72", style: "Regular" });
textNode.characters = "My Label";
```
The SAP Fiori kit uses the "72" font family. Load it before any `.characters` assignment.
For multiple text nodes, load all fonts in parallel before any assignment:
```javascript
await Promise.all([
  figma.loadFontAsync({ family: "72", style: "Regular" }),
  figma.loadFontAsync({ family: "72", style: "Bold" }),
  figma.loadFontAsync({ family: "72", style: "Semi Bold" }), // ← space required, not "SemiBold"
]);
```

### 2. Set auto layout sizing AFTER appending children
```javascript
// WRONG — sizing mode set before children exist
frame.layoutSizingHorizontal = "HUG";
frame.appendChild(child);

// CORRECT
frame.appendChild(child);
frame.layoutSizingHorizontal = "HUG"; // now it has content to hug
```
Apply `layoutSizingHorizontal` and `layoutSizingVertical` only after all children are appended.

### 3. Variable binding returns a new paint — never mutate in place
```javascript
// WRONG — mutation, the binding is lost
node.fills[0] = figma.variables.setBoundVariableForPaint(node.fills[0], 'color', variable);

// CORRECT — replace the entire fills array
node.fills = node.fills.map(paint =>
  figma.variables.setBoundVariableForPaint(paint, 'color', variable)
);
```

### 4. Set placeholder fill BEFORE binding a variable
```javascript
// WRONG — binding to a node with no fill
figma.variables.setBoundVariableForPaint(...);

// CORRECT — set a placeholder fill first, then bind
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.fills = node.fills.map(p => figma.variables.setBoundVariableForPaint(p, 'color', variable));
```

### 5. Disable layoutMode BEFORE repositioning component sets
```javascript
// WRONG — repositioning inside auto layout has no effect
componentSet.x = 100;

// CORRECT
componentSet.layoutMode = "NONE";
componentSet.x = 100;
componentSet.y = 200;
```

### 6. Focus rings: override the state layer, never detach
When a library component's focus ring appears incorrectly:
- Select the instance → right-click → "Edit component" is wrong
- Correct: select the instance → in the right panel find the boolean/state property → set `Focused: true`
- Never detach an instance to fix visual states — you lose library updates

### 7. Build top-down, not bottom-up
```
1. Create root frame (1440 × 900px for desktop)
2. Insert ShellBar (always first, always at root level)
3. Insert DynamicPage (always second)
4. Insert DynamicPageTitle into title slot
5. Insert DynamicPageHeader into header slot (if List Report)
6. Insert FilterBar into DynamicPageHeader (if List Report)
7. Insert Table into content slot
8. Insert OverflowToolbar into table headerToolbar slot
9. Insert columns, items last
```
Building bottom-up (columns before table, table before page) creates layout calculation errors.

### 8. Duplicate rows, don't regenerate
When building table rows with `repeat`:
```javascript
// WRONG — regenerate from scratch each time (slow, font reload required)
for (let i = 0; i < repeat; i++) { createRowFromScratch(i); }

// CORRECT — create one row, clone it, update content
const firstRow = await buildNode(rowSpec, screenConfig);
for (let i = 1; i < repeat; i++) {
  const clone = firstRow.clone();
  applySampleData(clone, rowSpec.sampleData, i);
  tableFrame.appendChild(clone);
}
```

---

## Canonical frame dimensions

| Viewport | Frame width | Frame height | ShellBar height |
|---|---|---|---|
| Desktop | 1440px | 900px | 44px |
| Tablet | 1024px | 768px | 44px |
| Mobile | 375px | 812px | 44px |

ShellBar height is **always 44px** — it does not change with density.

## Control heights by density

| Control type | Cozy | Compact |
|---|---|---|
| Input, Select, Button | 44px | 26px |
| Table row | 48px | 32px |
| Toolbar / OverflowToolbar | 44px | 36px |
| FilterBar | 48px (1 row) | 36px (1 row) |

## Content margins by breakpoint

| Breakpoint | Horizontal margin | Applied by |
|---|---|---|
| Desktop (≥1024px) | 2rem (32px) | DynamicPage automatically |
| Tablet (600–1023px) | 1rem (16px) | DynamicPage automatically |
| Mobile (<600px) | 0.5rem (8px) | DynamicPage automatically |

DynamicPage handles content margins automatically. Do not set manual padding on content frames.

---

## SAP spacing steps

Only use these values for spacing — never arbitrary pixel values:

`4px · 8px · 16px · 32px · 48px`

In the JSON spec, spacing is expressed semantically (density mode), not as pixel values.
The plugin resolves spacing from the connected SAP library tokens.

---

## Realistic content rules

**Never use:**
- Lorem ipsum text
- "Test", "Sample", "Example" as field values
- Sequential numbers (1, 2, 3) for IDs
- `user@email.com` as a sample email

**Always use:**
- PO numbers: `4500012345` format (10 digits, starts with 4 or 5)
- Supplier names: real-sounding German/European company names (`Müller GmbH`, `TechCorp AG`)
- Amounts: realistic EUR values with 2 decimal places (`1,250.00 EUR`)
- Dates: recent realistic dates in the right format for the locale
- Status values: a mix that shows the semantic range (`Pending`, `Approved`, `Rejected`)
- Names: diverse, realistic (`Maria Schmidt`, `James Park`, `Priya Nair`)

---

## Fallback: precise creation plan format

When the Figma plugin is unavailable or the library is not connected,
the figma-builder agent delivers this structured creation plan instead of a JSON spec:

```markdown
## Figma Creation Plan — [Screen Name]

**Frame:** 1440 × 900px, Fill: sapBackgroundColor

**Layer 1 — ShellBar**
- Library instance: Shell Bar/Default
- Props: productName="[App Name]", showNotifications=true
- Position: x=0, y=0, width=1440, height=44

**Layer 2 — DynamicPage**
- Library instance: Dynamic Page/Default
- Position: x=0, y=44, width=1440, height=856
- [continue for each layer...]

**Data to fill:**
- Table row 1: PO "4500012345", Supplier "Müller GmbH", Amount "1,250.00 EUR", Status "Pending" (Warning)
- Table row 2: ...
```

This plan format is human-executable in Figma and machine-parseable for future automation.
