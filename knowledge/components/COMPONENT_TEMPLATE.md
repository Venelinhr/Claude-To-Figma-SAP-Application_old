# ComponentName
<!-- Replace every instance of "ComponentName" with the real name (e.g. FilterBar, ShellBar) -->

---

## Identity

| Field | Value |
|---|---|
| **UI5 class** | `sap.m.ComponentName` |
| **Web Component tag** | `<ui5-component-name>` |
| **Figma library name** | `"Component Name/Cozy/Default"` ← exact string, plugin uses this |
| **Category** | layout \| form \| action \| display \| feedback |
| **DemoKit** | https://ui5.sap.com/#/entity/sap.m.ComponentName |
| **Design guidelines** | https://experience.sap.com/fiori-design-web/v1-145/ui-elements/component-name/ |
| **Web Components** | https://ui5.github.io/webcomponents/components/ComponentName/ |

---

## What it is

<!-- One paragraph written for an AI agent deciding whether to use this component.
     Answer: what problem does this component solve, what pattern does it enable,
     what makes it distinct from similar components. Be specific — agents need
     disambiguation, not marketing copy. -->

---

## When to use

<!-- Bullet list of concrete scenarios where this is the right choice.
     Each bullet should be one scenario, specific enough to match a requirement. -->

- 
- 

## When NOT to use

<!-- Table: competing component or scenario → why this component is wrong there.
     This is the most important section for preventing hallucination traps. -->

| Instead of using this | Use this | Because |
|---|---|---|
| `ComponentName` for X | `OtherComponent` | Reason |

---

## Required parent

<!-- What must wrap this component in the hierarchy.
     "None — can be used at any level" if it has no constraint.
     If it must be in a named slot, say which slot. -->

`ParentComponent` → slot name (if applicable)

## Required / expected children

<!-- Table: what this component contains.
     Required = pipeline stops if missing.
     Optional = can omit in simple cases. -->

| Child | Required? | Slot name | Purpose |
|---|---|---|---|
| `ChildComponent` | Required | `slotName` | What it does |
| `ChildComponent` | Optional | `children` | What it does |

---

## Key properties for design decisions

<!-- Only the 5–10 properties that require design reasoning.
     Skip properties that are always the same or self-evident.
     Column 3 must answer: what do I pick this value when? -->

| Property | Valid values | When to use which |
|---|---|---|
| `propName` | `Value1` / `Value2` | Use Value1 when..., Value2 when... |

---

## Figma variants and booleans

<!-- This section is used by the plugin to select the correct variant.
     List the Figma property names exactly as they appear in the SAP kit. -->

### Default state (what the plugin inserts by default)
```
Form Factor: Compact
State: Regular
[other default properties]
```

### Context-specific combinations
| Context | Variant settings | Notes |
|---|---|---|
| List Report | `FormFactor: Compact, Expanded: true` | Standard header usage |
| Worklist | *(not used)* | Never place on Worklist |

### Never combine
<!-- Things that look plausible but are wrong in the SAP kit -->
- Never set X + Y together — [what breaks]
- Never use variant Z for [scenario] — use [alternative] instead

---

## Example hierarchy position

<!-- Code block showing exactly where this component sits in a real screen tree.
     Use the spec-schema.json node format. Shows correct slot assignment. -->

```json
{
  "id": "page",
  "component": "DynamicPage",
  "slots": {
    "header": {
      "id": "page-header",
      "component": "DynamicPageHeader",
      "children": [
        {
          "id": "filter-bar",
          "component": "ComponentName",
          "props": { "showGoButton": true }
        }
      ]
    }
  }
}
```

---

## States to document

<!-- Table: every meaningful state this component can be in.
     "How to represent in Figma" = which variant setting to use in the plugin. -->

| State | When it occurs | Figma variant setting | spec-schema `state` value |
|---|---|---|---|
| Default | Normal display | `State: Regular` | `"default"` |
| Loading | Data fetching | `State: Loading` | `"loading"` |
| Error | Validation failure | `State: Error` | `"error"` |
| Empty | No data | IllustratedMessage as sibling | `"empty"` |
| Disabled | No permission | `State: Disabled` | `"disabled"` |

---

## Horizon-specific notes

<!-- What changed from Belize / Quartz → Horizon that a designer or agent must know.
     Also: Figma kit quirks, variant naming differences vs documentation, known issues. -->

- 
- 

---

## Team conventions

<!-- Decisions your team has made that override or extend SAP defaults.
     Source: internal wiki, design reviews, past incidents.
     These are rules that don't appear in any public SAP documentation. -->

- 
- 

---

## Critical rules

<!-- Short, imperative, no explanation needed. These are the hard stops.
     Format: "Never X" or "Always Y". -->

- Never …
- Always …
- Only use this component when …

---

## Common mistakes

<!-- Numbered list. Each item: what people do wrong → what to do instead.
     Focus on mistakes an AI agent would make, not just human designers. -->

1. **Mistake** — What goes wrong, and what to do instead.
2. **Mistake** — What goes wrong, and what to do instead.

---

## Public sources

<!-- Links only — agent fetches these at runtime. Do NOT copy content from these here. -->

- DemoKit: https://ui5.sap.com/#/entity/sap.m.ComponentName
- Guidelines: https://experience.sap.com/fiori-design-web/v1-145/ui-elements/component-name/
- Web Components: https://ui5.github.io/webcomponents/components/ComponentName/
