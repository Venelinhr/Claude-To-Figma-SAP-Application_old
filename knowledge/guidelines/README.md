# SAP Fiori Design Guidelines Cache

This directory stores fetched SAP Fiori Design Guidelines summaries per component.
Populated on-demand by the `component-guidance` skill when a designer asks for guidance.

## How it works

1. Designer asks Claude: "Guide me on which button to use in a form"
2. `component-guidance.md` skill runs
3. Claude fetches `https://experience.sap.com/fiori-design-web/button/` (or the redirected URL)
4. Extracts: purpose, when to use, when not to use, variants, do/don't, a11y, responsive
5. Writes summary here as `button.md`
6. Next session: reads cached file instead of re-fetching

## Fetch strategy

SAP design guidelines may redirect or block automated fetching. Try in order:
1. `https://www.sap.com/design-system/fiori-design-web/ui-elements/{slug}/`
2. `https://experience.sap.com/fiori-design-web/{slug}/`
3. `https://ui5.sap.com/#/entity/{SAPClass}` (DemoKit — JS SPA, may not load)
4. Knowledge from `knowledge/components/registry/{Component}.json` (fallback — always available)

## URL slug mapping

| Component | Slug |
|---|---|
| Button | `button` |
| Input | `input-field` |
| Select | `select` |
| Table | `responsive-table` |
| List | `list` |
| Form | `simple-form` |
| Dialog | `dialog` |
| MessageStrip | `message-strip` |
| ShellBar | `shell-bar` |
| DynamicPageHeader | `dynamic-page-header` |
| FilterBar | `filter-bar` |
| ObjectStatus | `object-status` |
| ObjectIdentifier | `object-identifier` |
| ObjectNumber | `object-number` |
| Panel | `panel` |
| CheckBox | `checkbox` |
| RadioButton | `radio-button` |
| Switch | `switch` |
| DatePicker | `date-picker` |
| TextArea | `text-area` |
| Label | `label` |
| Link | `link` |
| Breadcrumb | `breadcrumb` |
| IconTabBar | `icon-tab-bar` |
| Tree | `tree` |
| Toolbar | `toolbar` |
| OverflowToolbar | `overflow-toolbar` |
| Toast | `message-toast` |
| Popover | `popover` |
| Card | `cards` |
| ProgressIndicator | `progress-indicator` |
| Avatar | `avatar` |
| Tag | `tag` |
| SideNavigation | `side-navigation` |
| Notifications | `notifications` |
| IllustratedMessage | `illustrated-message` |
| Carousel | `carousel` |

---

## NEW: Structured JSON Cache (Section 1 MCP 1)

In addition to markdown summaries above, this directory now also stores **structured JSON cache entries** matching the `_schema.json` schema. These are consumed programmatically by MCP 1 (Fiori Guidelines server) and the AI layer.

### Structured cache files (46/46 ✓ Group A + Group B complete)

| Component | Status |
|---|---|
| **Group A (28)** | |
| `Button.json` | ✓ |
| `IconTabBar.json` | ✓ |
| `Input.json` | ✓ |
| `ShellBar.json` | ✓ |
| `SideNavigation.json` | ✓ |
| `NavigationItem.json` | ✓ |
| `IconButton.json` | ✓ |
| `MenuButton.json` | ✓ |
| `Select.json` | ✓ |
| `CheckBox.json` | ✓ |
| `RadioButton.json` | ✓ |
| `Switch.json` | ✓ |
| `Label.json` | ✓ |
| `Link.json` | ✓ |
| `Table.json` | ✓ |
| `Column.json` | ✓ |
| `ColumnListItem.json` | ✓ |
| `List.json` | ✓ |
| `StandardListItem.json` | ✓ |
| `IconTabFilter.json` | ✓ |
| `DynamicPage.json` | ✓ |
| `DynamicPageTitle.json` | ✓ |
| `DynamicPageHeader.json` | ✓ |
| `ObjectPageLayout.json` | ✓ |
| `FilterBar.json` | ✓ |
| `Form.json` | ✓ |
| `Panel.json` | ✓ |
| `Dialog.json` | ✓ |
| **Group B (18)** | |
| `MultiComboBox.json` | ✓ |
| `MultiInput.json` | ✓ |
| `DatePicker.json` | ✓ |
| `DateRangePicker.json` | ✓ |
| `DateTimePicker.json` | ✓ |
| `TimePicker.json` | ✓ |
| `StepInput.json` | ✓ |
| `Slider.json` | ✓ |
| `RangeSlider.json` | ✓ |
| `TextArea.json` | ✓ |
| `FileUploader.json` | ✓ |
| `Avatar.json` | ✓ |
| `Tag.json` | ✓ |
| `ObjectStatus.json` | ✓ |
| `ObjectIdentifier.json` | ✓ |
| `ObjectNumber.json` | ✓ |
| `MessageStrip.json` | ✓ |
| `BusyIndicator.json` | ✓ |

### Schema fields (per `_schema.json`)

`componentName`, `slug`, `sourceUrl`, `purpose`, `whenToUse[]`, `whenNotToUse[]`,
`doRules[]`, `dontRules[]`, `layoutGuidance{}`, `contentGuidance{}`,
`responsiveBehavior{XL,L,M,S}`, `accessibilityGuidance[]` (with WCAG refs),
`patterns[]`, `compatibility{}`, `exceptions[]`, `version`, `lastChecked`

### MCP 1 server contract (planned)

The Fiori Guidelines MCP server will expose:

- `getFioriGuideline(componentName)` → returns the cached JSON
- `refreshGuideline(componentName)` → re-scrapes and updates cache
- `searchGuidelines(query)` → fuzzy search across all entries
- `getPattern(patternName)` → returns components matching a pattern

### How the AI uses this

When generating a spec, the AI:
1. Reads `knowledge/components/registry/{name}.json` — technical (Figma keys, properties, variants)
2. Reads `knowledge/guidelines/{name}.json` — design (do/don't, when to use, accessibility)
3. Combines both to make spec decisions
4. Cites `sourceUrl` in `meta.rationale`

### File format

Each JSON file conforms to `_schema.json` — schema-validated.

---

## File format (markdown — legacy)

Each cached file follows this structure:

```markdown
# {Component} — SAP Fiori Design Guidelines
Source: {URL}
Fetched: {date}

## Purpose
{1-2 sentence description}

## When to Use
- {scenario 1}
- {scenario 2}

## When NOT to Use
- {anti-pattern 1}
- {anti-pattern 2}

## Variants
- {Variant 1} — {description}
- {Variant 2} — {description}

## Do ✓
- {do item 1}
- {do item 2}

## Don't ✗
- {dont item 1}
- {dont item 2}

## Responsive Behavior
{notes}

## Accessibility
- Role: {ARIA role}
- Keyboard: {keyboard support}
- {other a11y notes}

## Related Components
- {Component 1}: {when to use instead}
- {Component 2}: {when to use instead}
```

