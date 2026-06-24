# ShellBar
<!-- sap.f.ShellBar -->

## Identity
- **UI5 class:** `sap.f.ShellBar`
- **Web Component tag:** `<ui5-shellbar>`
- **Figma library name:** `"Shell Bar/Default"`
- **Category:** layout / navigation shell
- **DemoKit:** https://ui5.sap.com/#/entity/sap.f.ShellBar
- **Design guidelines:** https://experience.sap.com/fiori-design-web/v1-145/ui-elements/shell-bar/
- **Web Components:** https://ui5.github.io/webcomponents/components/ShellBar/

## When to Use
Present on every SAP Fiori screen. The ShellBar is the top-level application shell — it contains the product name, navigation, search, notifications, and the user avatar. Every screen in every floorplan has exactly one ShellBar.

## When NOT to Use
Never omit it. Never replace it with a custom header. Never put the ShellBar inside a page content area — it belongs at the root level of the layout, above everything else.

## Required parent
None — ShellBar is the topmost element. In the JSON spec it is always the first item in `hierarchy[]`.

## Required / expected children
- `homeIcon` — product icon (URI, optional)
- `profile` — `sap.f.Avatar` or `sap.m.Avatar` for user menu
- `notificationsCount` — badge count (string)
- `searchManager` — `sap.f.SearchManager` when search is required

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `productName` | string | Always set — the app name shown in the bar |
| `showNotifications` | `true` / `false` | true when app has notification center |
| `showProductSwitcher` | `true` / `false` | true in multi-app enterprise portals |
| `showNavButton` | `true` / `false` | true only on detail screens, false on root screens |
| `homeIconTooltip` | string | Required when homeIcon is set (a11y) |

## States
| State | When | Notes |
|---|---|---|
| Default | Root page | No back button |
| With nav button | Detail page | `showNavButton="true"` |
| With search expanded | Search active | SearchManager slot required |

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Shell Bar/Default
Form Factor: Cozy  (ShellBar does not change height with density — always 44px)
State: Regular
showNotifications: false
showProductSwitcher: false
showNavButton: false
```

### Context-specific combinations
| Context | Variant settings | Notes |
|---|---|---|
| Root screen (home) | `showNavButton: false` | No back button on the first screen |
| Detail screen | `showNavButton: true` | Back navigation present |
| App with notifications | `showNotifications: true`, `notificationsNumber: "5"` | Bell icon with badge |
| Enterprise portal | `showProductSwitcher: true` | Grid icon for switching apps |

### Never combine
- Never set `showNavButton: true` on a root/home screen — there is nowhere to navigate back to
- Never omit `productName` — an empty ShellBar violates SAP Fiori brand guidelines

---

## Example hierarchy position

```json
{
  "$schema": "https://sap-fiori-ai-designer/spec-schema.json",
  "hierarchy": [
    {
      "id": "shell",
      "component": "ShellBar",
      "props": {
        "productName": "Purchase Orders",
        "showNotifications": true
      },
      "slots": {
        "profile": {
          "id": "user-avatar",
          "component": "Avatar"
        }
      }
    },
    {
      "id": "page",
      "component": "DynamicPage"
    }
  ]
}
```

ShellBar is **always the first item** in `hierarchy[]`. DynamicPage or FCL follows immediately after.

---

## States to document

| State | When it occurs | Figma variant setting | spec-schema `state` value |
|---|---|---|---|
| Default | Standard shell, root screen | `State: Regular`, `showNavButton: false` | `"default"` |
| With back nav | Detail screen | `showNavButton: true` | `"default"` (nav is a prop, not a state) |
| With notification badge | Unread notifications exist | `showNotifications: true`, `notificationsNumber: "N"` | `"default"` |

---


The Horizon ShellBar has a dark background by default (`sapShellColor`). Do not attempt to change this — it is a fixed SAP Fiori brand requirement. The Figma library component is `"Shell Bar/Default"` — do not use `"Header"` or `"App Bar"` which are not SAP components.

## Team conventions
- Always set `productName` — never leave it empty.
- `showNotifications: true` is the default for all enterprise apps in our portfolio.
- Use the SAP logo as `homeIcon` only if the app is SAP-branded. For custom apps use the product icon.

## Critical rules
- **One per screen** — exactly one ShellBar per Figma frame.
- **Never inside a Page** — ShellBar renders outside the Page/DynamicPage content area.
- **Never simulate with a custom frame** — must be a real SAP library instance.

## Common mistakes
- Placing ShellBar inside DynamicPage content instead of as a sibling at the root level.
- Using `sap.m.Bar` as a substitute — it does not provide the SAP shell semantics.
- Setting `showNavButton: true` on root/home screens where there is no back navigation.

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.f.ShellBar
- Guidelines: https://experience.sap.com/fiori-design-web/v1-145/ui-elements/shell-bar/
- Web Components: https://ui5.github.io/webcomponents/components/ShellBar/
