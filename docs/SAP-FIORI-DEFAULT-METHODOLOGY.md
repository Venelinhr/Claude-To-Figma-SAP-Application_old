# SAP Fiori Default Methodology — Design Reasoning from Gold-Standard References

*Derived 2026-07-22 from six SAP-PM-approved AI Gateway reference sections in file `p7zm5EMBk5DRRZdxNeJ4f5`:*
*AI Gateway Grounding (219:111763), Proxification (219:114244), Multi-Source Selection (219:118721 & v2 219:120887), MCP HTTP (219:123053), MCP-over-MCP (219:126002).*
**Follow the reasoning; do not copy the pixels.** This is project doctrine for every new screen.

---

## 1. FLOORPLAN DECISION RULES

| Business task shape | Floorplan | Why | Demonstrated by |
|---|---|---|---|
| Persistent re-editable **object** with identity + many facets, over its lifecycle | **DynamicPage / Object Page** + IconTabBar | Header pins identity+status+global actions; body swaps per facet; supports view↔edit + versioning a wizard can't | MCP Server Overview (118721); Proxification editor (114244) |
| **Browse / filter / act on many** items | **List Report** (DynamicPage + Table + toolbar) | Scan-select-act; bulk actions; per-row nav | Artifact View (114244, 120887) |
| **Short, linear, decision-first creation** with conditional branches | **Wizard-in-a-Dialog** (numbered stepper) | Modal prevents wandering; steps gate on dependencies | Create API (114244); Create MCP Server (123053, 126002) |
| **Single discrete commit-or-cancel** action | **Dialog** (no stepper) | Blocking is correct; forces commit/cancel | Create Collection (112179) |
| Tuning one item **while keeping context visible** | **Docked Drawer/Panel** (not Dialog) | No modal context loss — edit a node while seeing the pipeline | Properties drawer (111763, 114244) |
| Scan-numbers-then-drill monitoring | **Analytical Overview** (KPI card grid) | Numbers-first, detail-on-click | Monitor (111906) |
| Config whose **meaning is order/flow** | **Graph/Flow editor** + docked property panel | Sequence/branching is content a form can't express | Orchestration flow (111763); Policies (123053, 126002) |

**Rule of thumb:** *Create = modal & linear. Edit = immersive & non-linear. Order matters → canvas. Numbers matter → cards.*

## 2. COMPONENT SELECTION RULES ("choose X not Y")
- **MultiComboBox not Select** — one artifact aggregates N sources; removable tokens for recall.
- **Select/ComboBox not radios** — single value from a closed, self-evident list.
- **RadioButton list not Select** — mutually-exclusive options each needing a descriptive byline for an infrequent, consequential choice.
- **Wizard not one long form** — creation has ordered dependencies.
- **IconTabBar not accordion** — facets are peer, frequently-revisited destinations.
- **Drawer not Dialog** — when surrounding context must stay visible.
- **ResponsiveTable grouped by origin** — rows inheriting from a parent selection keep provenance via group headers.
- **CheckBox/Input** — atomic single-value settings.
- **SegmentedButton** — small fixed option set inline, avoiding a dropdown click.

## 3. GROUPING & SEPARATION
- Separate **creation (modal) from editing (page)**.
- Separate **by mental model** — config (forms/tabs) vs governance (pipeline graph) get different tabs.
- **Two-tier tabs** — outer = object facets; inner = a domain's own taxonomy.
- **Actions ON the object** — contextual menu on the selected node, not a distant global toolbar.
- **Demote supporting metadata** — Created/Changed pushed to a low-contrast right-side card.
- **Group config under its node** — avoid one giant scrolling form.

## 4. LAYOUT & HIERARCHY STANDARDS
- **Shell:** ShellBar + 256px SideNavigation, reused verbatim across screens.
- **Content well:** ~32px inset; content column ~1452px desktop.
- **Cards on grey canvas** — whitespace + card boundary carry hierarchy, not dividers.
- **Rhythm:** 16px vertical; card padding 16px; card pitch ~200px; section bands ~220px; toolbars 44px; dialog header/footer 40px.
- **Typography scale:** bold H1 object title → 14px bold tab text → small right-aligned muted labels (~195px label column) with red required asterisks.
- **KPI:** ~63px numeral dominates; caption labels quietly.
- **Selection cue:** selected node/step gets a blue border.

## 5. INTERACTION & PROGRESSIVE DISCLOSURE
- Render only the selected facet/sub-tab; keep each state ≤ one screen height.
- Selection reveals context (node → docked panel + contextual menu).
- Conditional fields (State→Enabled; Well-Known-URL reveals dependents; Create/Upload swaps input sets).
- State-driven header actions (display: Edit/Deploy; edit: Save/Save-as-version/Deploy/Cancel).
- Edit/display field duality (MultiComboBox tokens ↔ comma-text = "SmartField").
- Prebuilt-hidden-rows state machine — toggle visibility, don't rebuild layout.
- Wizard steps gate Next until valid; modal dims background.

## 6. REUSABLE COMPOSITIONS (canonical library)
1. **App Shell** = ShellBar + 256px SideNav + DynamicPage
2. **Object-Header block** = breadcrumb + H1 + Status + resource URL + state-driven actions + IconTabBar
3. **Two-tier IconTabBar** (facet → sub-facet)
4. **Canvas + docked contextual config panel** (per-item IconTabBar)
5. **Step-card node** with hover-action overlay + required-asterisk
6. **Section-band header**
7. **KPI / Numeric-Tile grid** (label + 63px numeral + caption + trailing "+" add-tile)
8. **MultiComboBox + origin-grouped ResponsiveTable pair**
9. **Modal numbered-stepper Wizard** with radio-source-selector + Create/Upload toggle
10. **Right-docked audit-metadata card**
11. **Label(195) + Input + inline-action Form-Item row**

## 7. THE DEFAULT METHODOLOGY (ordered procedure for ANY new screen)
1. **Name the business task & user** — one sentence.
2. **Classify task shape → pick floorplan** (§1).
3. **Lay the shell** — ShellBar + 256px SideNav + content well. Never improvise chrome.
4. **Build the header** — identity + status + URL + state-driven action cluster.
5. **Structure facets** — IconTabBar; nest second tier only when a facet has its own taxonomy.
6. **Select components by decision rules** (§2), justify every "X not Y".
7. **Group & separate** (§3).
8. **Apply layout standards** (§4).
9. **Wire progressive disclosure** (§5).
10. **Verify against reusable compositions** (§6).

**Prime directive:** *Match the floorplan to the task shape, keep context visible, disclose progressively, and reuse the shell verbatim.*
