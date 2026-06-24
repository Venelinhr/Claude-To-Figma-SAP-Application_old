# Figma Library Map — SAP Web UI Kit Verified Component Keys

**Library:** `SAP Web UI Kit` (team library)
**File:** `p7zm5EMBk5DRRZdxNeJ4f5` (SAP-application-builder)
**Verified:** 2026-06-22 via `search_design_system` MCP

These `componentKey` values are used by `figma.importComponentByKeyAsync(key)` in the plugin.

---

## Verified Component Keys

| SAP Component | Figma Set Name | componentKey |
|---|---|---|
| `ShellBar` | Shell Bar | `169cfd74c0be329c56b4c79b9404c978ff10cb60` |
| `Button` | Button | `91805fa199b1fd247d76a9c08bbe0982b49065c4` |
| `IconButton` | Icon Button | `c1ee1ca76974c720ecd4b1888e1e23ac8a36ec63` |
| `Table` | Table | `03ea321822c4e99c27de4d9c2524bdec9c6e0972` |
| `TableCell` | Table Cell | `e717737e98a40a8619e315ca1b4b04646b93b541` |
| `Input` | Input | `0f4366cb3065919e8f3deb0462f1a5a3633d6b50` |
| `Select` / `ComboBox` | Select | `5ce369ff7fb0cce28984eec8dd9973ccde82facb` |
| `Label` | Label | `b38ac753648ad298c1e2dd02d71417566dd6095c` |
| `Link` | Link | `2e67b5399e9f05950c6f6ea6f244a1a9736c8a56` |
| `Breadcrumb` / `Breadcrumbs` | Breadcrumb | `5743166bac11fdf110a54fd7d85436fed186d3b2` |
| `Toolbar` / `OverflowToolbar` | Toolbar | `58a258bf5813e59cec4dfc684c8cdb2a6ca6721f` |
| `ObjectStatus` | Object Status | `748d609ead5d4a246d7cd7c144b94b518c467e58` |
| `ObjectIdentifier` | Object Identifier | `8e1e45c5a89b540f6ec53542279c7711d4020d81` |
| `ObjectNumber` | Object Number | `7b67d22ed19f246b708dc4664808a45f314a7414` |
| `ObjectAttribute` | Object Attribute | `080ead216322befe153704bf8f11373158fea34a` |
| `MessageStrip` | Message Strip | `f0e77f8888796e35c0e791ddc0b38535eda6ec31` |
| `IllustratedMessage` | Illustrated Message | `eba579505df21536654910797f94b3784248807b` |
| `CheckBox` | Check Box | `23b4a2ca030e4bd2ff3bdd5b97b70f646ec09071` |
| `RadioButton` | Radio Button | `9308f27ef27fbb28bc7d167c52494aa41a21610f` |
| `Avatar` | Avatar | `71a3389ecbd47822b3184700766e30963fc2f220` |
| `Tag` | Tag | `9b55bf702befd73b2e28f800ee4d0033bc0e0e95` |
| `DynamicPageHeader` / `FilterBar` | Dynamic Page Header | `dc90c8dbf7714f165ed79357e9ba6ade5b3701ae` |
| `DatePicker` / `DateRangeSelection` | Date (Range) Picker | `ad1f84e6293671f80ff8dd174b1da0cbacf0fa48` |
| `TextArea` | Text Area | `bee4738dd5e5856a3b88eae341b47376a3269d87` |
| `List` | List | `4fb0a3e2fc56fb58d9904d68eb4ac58b9fb1bd25` |
| `StandardListItem` / `ListItem` | List Item | `f7bc6526a9f16608747a4141800146ebd3f4e835` |
| `Switch` | Switch | `c63509f642cdabbeb8c1878dd125ee006481631c` |

---

## Notes

- `DynamicPage` is a structural container — no single Figma component equivalent; built as a native frame
- `DynamicPageTitle` uses `DynamicPageHeader` as the closest Figma match
- `FilterBar` maps to `DynamicPageHeader` (same component in the kit)
- `ComboBox` / `MultiComboBox` map to `Select` (SAP kit description confirms this)
- Density: `Form Factor = Compact` for desktop back-office, `Form Factor = Cozy` for touch/mobile
- Button intent → Figma Type: `primary-action` → `Primary`, `secondary-action` → `Secondary`, `destructive` → `Negative`, `approval` → `Positive`, `ghost` → `Tertiary`
- ObjectStatus state → Figma State: `Success` → `Positive`, `Warning` → `Critical`, `Error` → `Negative`, `Information` → `Informative`

---

## How the Plugin Uses These Keys

```js
const comp = await figma.importComponentByKeyAsync(key);
const instance = comp.createInstance();
instance.setProperties({ 'Form Factor': 'Compact', 'Type': 'Primary' });
```

The plugin (`plugin/figma-builder/code.js`) imports and caches components on first use, then creates instances with variant properties derived from the JSON spec.
