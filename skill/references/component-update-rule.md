# The 3-Place Component Update Rule

When you add a new SAP component to this pipeline, **three places must be updated in lockstep**. Skipping any one creates a silent gap that surfaces hours later as either a build-time validator rejection or a runtime silent-drop.

This rule was learned on 2026-06-27 when adding `AvatarGroup` failed at validation despite having a working plugin renderer — the validator's allow-list hadn't been updated. The consistency checker (`build/check-component-consistency.py`) now enforces this rule on every build.

---

## The three places

### 1. Knowledge layer — registry entry
`knowledge/components/registry/<ComponentName>.json`

Must conform to `_schema.json` (21 required fields). The `figmaComponentId` field declares the rendering strategy:

| `figmaComponentId` value | Meaning | Plugin behavior |
|---|---|---|
| 40-char hex | Direct SAP Figma instance | `figma.importComponentByKeyAsync(<id>).createInstance()` |
| `"alias:OtherComponent"` | Renders as another component with variant override | Plugin uses the target's instance + setProperties |
| `"composed:Recipe"` | Built at plugin-time from multiple instances | Custom `buildTree` handler composes the result |
| `"native:text"` | Native Figma node with SAP-variable-bound fills | Custom handler creates `figma.createText()` etc. |

A matching `knowledge/guidelines/<ComponentName>.json` should exist with the design guidance (17 fields). The build script copies guidelines into `registry-bundle-full.json` for inspection but **does not** load them into the plugin bundle.

### 2. Plugin runtime path
`plugin/figma-builder/code.js`

At least one of these must exist:
- **A `buildTree` handler** — `if (comp === '<Name>') { ... return; }` — for components with custom layout/composition logic (handles `AvatarGroup`, `SapTableRow`, etc.)
- **A `SAP_KEYS` entry** — `<Name>: '<40-char-figma-id>'` — for direct SAP instances (lines 9-97)
- **A `KEY_MAP` alias** — `<SpecName>: '<CanonicalName>'` — for components that share a Figma instance with another (lines 108+)

If a component has NONE of these, the plugin will hit the catch-all leaf path, fail to resolve the name, and **silently drop the node**. This is the "ghost component" bug.

### 3. Validator allow-list
`plugin/figma-builder/code.js` — `validateSpec()` function (~line 5660) reads from a union of sets:

```js
const validator_allow = KEY_MAP ∪ LAYOUT_CONTAINERS ∪ NATIVE_RENDERERS
                      ∪ SKIP_SELF ∪ HORIZ_CONTAINERS ∪ VALIDATOR_EXPLICIT
```

If a component has a runtime path but NONE of the validator sets recognize it, the UI's **Validate button rejects the spec before Build can run** with `"Unknown components: <Name>"`. This was the AvatarGroup bug.

**For composed renderers and components without a direct Figma instance**, the right home is `NATIVE_RENDERERS` (~line 251). For aliases, add to `KEY_MAP`. For SKIP_SELF passthroughs (e.g. `DynamicPage`), add there.

---

## The decision tree

When you add a new component:

```
Is there a real SAP Figma instance for it?
├── YES → Add 40-char figmaComponentId to SAP_KEYS
│        ├── Spec name matches canonical? Just KEY_MAP self-entry
│        └── Spec name differs (alias)? KEY_MAP redirect to canonical
│        Registry entry: figmaComponentId = "<40-char-hex>"
│
└── NO  → Does it render as a variant of another SAP component?
         ├── YES → Registry entry: figmaComponentId = "alias:Target"
         │        KEY_MAP entry: SpecName: 'Target'
         │
         └── NO  → Custom composition needed
                  Registry entry: figmaComponentId = "composed:Recipe"
                  Plugin: add `if (comp === '<Name>') {...}` in buildTree
                  Plugin: add '<Name>' to NATIVE_RENDERERS set
```

After EVERY component addition, **before committing**:

```bash
node build/build-registry-bundle.js
python3 build/check-component-consistency.py    # MUST exit 0
```

The consistency checker enforces the rule. If it reports an issue:

- **"RUNTIME PATH BUT VALIDATOR REJECTS"** — add to `NATIVE_RENDERERS` (most common)
- **"VALIDATOR ACCEPTS BUT NO RUNTIME PATH"** — add a buildTree handler OR remove the validator entry
- **"IN REGISTRY BUT NOT IN PLUGIN"** — registry advertises a component the plugin won't render. Add the runtime path OR remove the registry entry.

---

## Example walk-through — AvatarGroup (2026-06-27)

What went wrong, and how the rule was applied to fix it:

| Step | What happened | Layer |
|---|---|---|
| Day 1 | Registry entry created with `figmaComponentId: "composed:Avatar[]"` | ✅ Layer 1 |
| Day 2 | Plugin handler added: `if (comp === 'AvatarGroup') { ... }` | ✅ Layer 2 |
| Day 2 | Bundle rebuilt; user reloads plugin | — |
| Day 2 | User pastes spec → clicks Validate → "**✗ Unknown components: AvatarGroup**" | ❌ Layer 3 missing |
| Day 2 | `NATIVE_RENDERERS.add('AvatarGroup')` | ✅ Layer 3 |
| Day 2 | Bundle rebuilt; re-Validate → ✓ passes | — |
| Day 2 | Wrote consistency checker, found 26 more latent gaps with same root cause | — |
| Day 2 | Bulk-fixed: 12 → `KEY_MAP`, 13 → `NATIVE_RENDERERS`, 1 ambiguous handled | ✅ All 3 layers |
| Day 2 | Checker reports `0 inconsistencies` across 148 component names | — |

## Anti-pattern: comments with apostrophes in NATIVE_RENDERERS

The checker regex `'([^']+)'` extracts entries from the Set literal. If a line comment inside the Set contains an apostrophe (`// the validator's allow-list`), the regex erroneously treats the apostrophe as a string delimiter and captures comment text as fake "entries". This makes real entries after that comment invisible.

**Fix**: comments in the Set literal must avoid apostrophes. Use `the validator allow-list` not `the validator's allow-list`. The checker also strips line comments before parsing, but defense-in-depth — both rules apply.

---

## Files in scope

| File | Role |
|---|---|
| `knowledge/components/registry/_schema.json` | Schema for registry entries (21 required fields) |
| `knowledge/components/registry/<X>.json` | Per-component registry entry |
| `knowledge/guidelines/<X>.json` | Per-component design guidance |
| `plugin/figma-builder/code.js` line 9-97 | `SAP_KEYS` — figma IDs |
| `plugin/figma-builder/code.js` line 108+ | `KEY_MAP` — spec name → canonical |
| `plugin/figma-builder/code.js` line 251+ | `NATIVE_RENDERERS` — composed renderers allowed by validator |
| `plugin/figma-builder/code.js` line ~5660 | `validateSpec()` — the gate that runs on Validate click |
| `build/build-registry-bundle.js` | Rebuilds bundle; should run after every change |
| `build/check-component-consistency.py` | Enforces the 3-place rule; should run after every bundle build |

## Suggested git pre-commit hook

```bash
#!/bin/sh
node build/build-registry-bundle.js > /dev/null 2>&1 || exit 1
python3 build/check-component-consistency.py || exit 1
```

This makes it impossible to commit a state where the three layers are out of sync.
