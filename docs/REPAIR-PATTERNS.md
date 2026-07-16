# Repair Patterns Library
## Persistent knowledge base for the QA Certification Self-Repair Engine
## Added: 2026-07-09 · Updated automatically after each successful repair session

This file is read at the **start of every QA Certification pass** (`skill/agents/qa-certification.md`).
When a pattern below matches a detected defect, apply the proven repair immediately — skip reasoning from scratch.
Memory entry: `reference_repair_patterns.md` in the auto-memory system.

---

## How to use this file

1. At the start of each QA pass, scan the detected failures against this library.
2. For every match: apply the proven repair directly (confidence = as documented below).
3. For every miss: reason from first principles, then **add the new pattern here** if the repair succeeds.
4. Patterns grow with every session — this file never shrinks.

---

## Pattern Format

```
Pattern ID:   P-NNN
Title:        Short description of the failure
Trigger:      What causes this to appear in the spec or build
Root cause:   Why it happens (plugin gap, spec vocabulary mismatch, etc.)
Category:     One of the 14 Root Cause categories
Repair type:  One of the 17 Targeted Repair types
Fix:          Exact change to make in the spec JSON
Confidence:   % certainty the fix works (confirmed session + date)
Exception?:   NO (defect) | SOMETIMES (context-dependent) | YES (intentional exception)
Notes:        Any caveats or alternatives
```

---

## Confirmed Patterns (session 2026-07-08 → 2026-07-09)

---

### P-001 · DynamicPageTitle shows "Page Title" after build

```
Trigger:    DynamicPageTitle.slots.heading child uses {component:"Title", props:{text:"X"}}
            instead of {component:"Title", label:"X"}
Root cause: Plugin reads h.label to inject the title text; h.props.text is ignored
            (RULE 11 rendering convention — plugin uses label not props.text for Title nodes)
Category:   Figma implementation (plugin rendering convention)
Repair type: Update slot key (change props.text → label)
Fix:        Change:  {"id":"heading","component":"Title","props":{"text":"My Title"}}
            To:      {"id":"heading","component":"Title","label":"My Title"}
Confidence: 100% (confirmed 2026-07-08, warehouse worklist spec)
Exception?: NO — always a defect
Notes:      Same applies to Title in DynamicPageTitle.slots.heading and any
            other heading slot. The label property is the canonical injection path.
```

---

### P-002 · ObjectStatus renders as blue Information regardless of state prop

```
Trigger:    spec uses state: "Positive" / "Critical" / "Negative" / "Informative"
            (old translation vocabulary from pre-2026-07-08 plugin versions)
Root cause: statusVariants() in plugin was translating SAP canonical state names
            to non-existent variant names in the SAP Web UI Kit Figma library.
            Correct SAP kit variant values are: Success / Warning / Error / Information / None
Category:   SAP component mapping (wrong variant vocabulary)
Repair type: Replace color with token (use canonical state name)
Fix:        Replace:  "state": "Positive"    →  "state": "Success"
                      "state": "Critical"    →  "state": "Warning"
                      "state": "Negative"    →  "state": "Error"
                      "state": "Informative" →  "state": "Information"
Confidence: 100% (confirmed 2026-07-08, statusVariants fix)
Exception?: NO — always a defect
Notes:      The plugin fix was applied 2026-07-08. Specs written before that date
            may use the old vocabulary and need this repair.
```

---

### P-003 · FlexibleColumnLayout columns render stacked vertically

```
Trigger:    FlexibleColumnLayout spec uses beginColumnPages / midColumnPages /
            endColumnPages slots correctly but columns stack instead of laying horizontal
Root cause: FCL renderColumn inner function had density param out of scope
            (JavaScript inner function scope bug — fixed in plugin 2026-07-09)
Category:   Plugin limitation (was a bug, now fixed)
Repair type: PLUGIN_LIMITATION (⚙) — no spec change needed after 2026-07-09
Fix:        Re-import the plugin (build 2026-07-09 or later) — the spec is correct.
            If plugin is older: workaround is HBox + 3 DynamicPage children with
            explicit widths (loses responsive behavior but renders horizontally).
Confidence: 100% (confirmed 2026-07-09, FCL density fix)
Exception?: SOMETIMES — if using old plugin, workaround applies; new plugin no fix needed
Notes:      Always check plugin build label first. If "2026-07-09" or later → spec is fine.
```

---

### P-004 · DynamicPageTitle shows "Parent item / 1st child item / Current item" breadcrumbs

```
Trigger:    spec does not provide slots.breadcrumbs, or provides it as undefined
Root cause: SAP kit's default DynamicPageTitle instance has placeholder breadcrumb text
            that passes through when slots.breadcrumbs is absent (Fix 3b, 2026-07-08)
Category:   Figma implementation (kit default content leaking)
Repair type: Update slot key (add explicit empty breadcrumbs slot)
Fix:        Add to DynamicPageTitle.slots:
            "breadcrumbs": []
            This triggers the plugin's breadcrumb-hide logic (Fix 3b).
Confidence: 100% (confirmed 2026-07-08, Fix 3b)
Exception?: NO — always a defect unless breadcrumbs are intentionally wanted
Notes:      Same applies to actions slot: "actions": [] suppresses the kit's
            default Edit/Copy/share/fullscreen/close action row.
```

---

### P-005 · Label in Column.children causes composition rule violation

```
Trigger:    Table column headers authored as nested Label children of Column:
            {"id":"col-1","component":"Column","children":[{"component":"Label",...}]}
Root cause: Label.validParents does not include Column — Label belongs in
            Form/Panel/etc., not directly inside a Column header
Category:   Component composition (wrong parent-child relationship)
Repair type: Fix validParents violation (move text to Column.props.text)
Fix:        Replace:  {"component":"Column","children":[{"component":"Label","props":{"text":"Name"}}]}
            With:     {"component":"Column","props":{"text":"Name","hAlign":"Begin"}}
Confidence: 100% (confirmed 2026-07-08, create-mcp-server-step3 spec fix)
Exception?: NO — always a defect
Notes:      Column headers belong on the Column's props.text, not as nested children.
            This is both a composition rule and a SAP API convention.
```

---

### P-006 · DynamicPageTitle action buttons (Edit/Copy/share/fullscreen/close) show through

```
Trigger:    spec does not provide slots.actions, or provides empty array
Root cause: SAP kit's default DynamicPageTitle has 5 action instances (Edit/Copy/share/
            fullscreen/close) that pass through when slots.actions is absent
Category:   Figma implementation (kit default content leaking)
Repair type: Update slot key (suppress or replace kit defaults)
Fix:        To suppress: add "actions": [] to DynamicPageTitle.slots
            To inject custom: add "actions": [{component:"Button",label:"X",...}]
Confidence: 100% (confirmed 2026-07-08, Fix 3b part 2 + DynamicPageTitle actions injection)
Exception?: NO for suppression; INTENTIONAL if custom actions provided
Notes:      Actions injection now works (build 2026-07-09). Real SAP Buttons are
            built from slots.actions and appended to the title area.
```

---

### P-007 · ProgressIndicator bar stuck at 60% regardless of percentValue prop

```
Trigger:    spec provides props.percentValue: 100 and props.displayValue: "100%"
            but rendered ProgressIndicator still shows 60%
Root cause: Old plugin versions ignored percentValue/displayValue (Fix 3c, 2026-07-08)
Category:   Plugin limitation (was a bug, fixed in build 2026-07-08)
Repair type: PLUGIN_LIMITATION (⚙) — no spec change needed after 2026-07-08
Fix:        Re-import the plugin (build 2026-07-08 or later).
            Spec should have: "props":{"percentValue":100,"displayValue":"100%","state":"Success"}
Confidence: 100% (confirmed 2026-07-08, Fix 3c)
Exception?: NO — always a defect in old plugin; correct spec syntax is above
Notes:      Fix 3c detaches the ProgressIndicator to inject displayValue and
            resize the bar fill frame proportionally.
```

---

### P-008 · IconTabBar tab labels show "Tab Text" instead of spec labels

```
Trigger:    spec places IconTabFilter items in slots.items but labels still show "Tab Text"
Root cause: Old plugin only read from nodeSpec.children, not nodeSpec.slots.items
            (Fix 3d, 2026-07-08 — IconTabBar now reads from both sources)
Category:   Plugin limitation (was a bug, fixed in build 2026-07-08)
Repair type: PLUGIN_LIMITATION (⚙) — no spec change needed after 2026-07-08
Fix:        Re-import plugin (build 2026-07-08+).
            Spec should use slots.items: [{component:"IconTabFilter",label:"X",props:{key:"x"}}]
            AND set selectedKey on the parent: {props:{selectedKey:"x"}}
Confidence: 100% (confirmed 2026-07-08, Fix 3d)
Exception?: NO — always a defect in old plugin
Notes:      selectedKey matching against props.key on children is now the
            canonical tab selection mechanism.
```

---

### P-009 · AvatarGroup causes composition violation inside DynamicPage

```
Trigger:    AvatarGroup placed inside DynamicPage directly (not inside Panel/Card)
Root cause: AvatarGroup.validParents did not include DynamicPage (fixed 2026-07-09)
Category:   Component composition (validParents missing entry)
Repair type: Correct composition (wrap in Panel, or update validParents)
Fix:        Option A: Wrap AvatarGroup in a Panel inside DynamicPage.content
            Option B: DynamicPage is now in AvatarGroup.validParents (2026-07-09)
            — spec is valid after registry fix, no spec change needed
Confidence: 100% (confirmed 2026-07-09, validation pass)
Exception?: NO — was a registry gap, now resolved
Notes:      DynamicPage, ObjectPageSection, ObjectPageSubSection are now valid
            parents for AvatarGroup.
```

---

### P-010 · ShellBar title still shows "Product Identifier" after build

```
Trigger:    spec uses props.title on ShellBar (correct) but build shows "Product Identifier"
Root cause: Old plugin only read props.productName, ignored props.title (Fix 3a, 2026-07-08)
Category:   Plugin limitation (was a bug, fixed in build 2026-07-08)
Repair type: PLUGIN_LIMITATION (⚙) — no spec change needed after 2026-07-08
Fix:        Re-import plugin (build 2026-07-08+).
            Spec should use: {"component":"ShellBar","props":{"title":"X","secondaryTitle":"Y"}}
Confidence: 100% (confirmed 2026-07-08, Fix 3a)
Exception?: NO — always a defect in old plugin
Notes:      Fix 3a accepts both props.title and props.productName.
            secondaryTitle injects into the tenant chip (e.g. "yana").
```

---

### P-011 · SideNavigation nested inside FlexibleColumnLayout

```
Trigger:    SideNavigation placed inside FCL.beginColumnPages
Root cause: SideNavigation.composition.topLevelOnly = true. It is meant as a
            root-level sibling of ShellBar/DynamicPage, not a page inside FCL.
            FCL's beginColumnPages accepts pages (DynamicPage/ObjectPageLayout/Page),
            not navigation rails.
Category:   Component composition (validParents / topLevelOnly)
Repair type: Repair parent-child relationship (hoist to root)
Fix:        Move SideNavigation from FCL.slots.beginColumnPages to top-level
            hierarchy[] as a sibling of ShellBar and DynamicPage.
            Canonical root pattern: [ShellBar, SideNavigation, DynamicPage]
            or [ShellBar, SideNavigation, FlexibleColumnLayout(if 3-column detail)]
Confidence: 100% (confirmed 2026-07-09, outage-list-overview spec)
Exception?: NO — always a defect
Notes:      Plugin renders top-level siblings side-by-side automatically.
            SideNavigation gets 200-240px width, DynamicPage fills remainder.
```

---

### P-012 · DynamicPageTitle.slots.subheading is not a valid slot

```
Trigger:    Spec uses DynamicPageTitle.slots.subheading for subtitle text
            (e.g. "10 records total" under a page title)
Root cause: DynamicPageTitle.slotNames does not include "subheading". Valid slots are:
            heading, snappedContent, expandedContent, actions, navigationActions, breadcrumbs
Category:   Update slot key (slotNames validation)
Repair type: Update slot key (move Text into heading slot as second child)
Fix:        Remove slots.subheading. Append the subtitle Text node into slots.heading
            AFTER the Title node:
              slots.heading: [ Title(main), Text(subtitle) ]
            SAP kit renders the second heading child as the "snapped subtitle" text.
Confidence: 100% (confirmed 2026-07-09, outage-list-overview spec)
Exception?: NO — always a defect
Notes:      For "expanded state" subtitles (only visible when header is not snapped),
            use slots.expandedContent with a Text or Label child instead.
```

---

### P-013 · Plugin rejects spec with "Missing required fields: $schema"

```
Trigger:    Spec JSON is generated without a top-level "$schema" property
Root cause: spec-schema.json requires "$schema" as a mandatory field.
            The CLI validator (build/validate-spec.js) does NOT check for this —
            it validates registry / composition / slots / tokens / hex but not
            the schema envelope. The plugin's runtime Validate button does.
Category:   Reference interpretation / spec envelope missing
Repair type: Update slot key (add missing top-level field)
Fix:        Add at the very top of the spec JSON:
            {
              "$schema": "https://sap-fiori-ai-designer/spec-schema.json",
              "meta": { ... },
              ...
            }
Confidence: 100% (confirmed 2026-07-09, outage-list-overview spec)
Exception?: NO — always required
Notes:      Also missing from CLI validator coverage. Follow-up: add $schema check
            to build/validate-spec.js so this is caught before the plugin Validate step.
            Canonical value: "https://sap-fiori-ai-designer/spec-schema.json"
```

---

### P-014 · Plugin rejects spec with "Missing meta fields: meta.rationale"

```
Trigger:    Spec has meta but meta.rationale is absent
Root cause: spec-schema.json requires meta.rationale as a mandatory field —
            a plain-English explanation of the design decisions.
            The CLI validator did NOT check this until 2026-07-09.
Category:   Reference interpretation / spec envelope missing
Repair type: Restore missing label (add mandatory meta field)
Fix:        Add to meta (after requirement, before floorplan for readability):
              "rationale": "..." (1-3 sentences explaining floorplan choice, key
              component decisions, RULE-16 exceptions, plugin-fix references)
Confidence: 100% (confirmed 2026-07-09, outage-list-overview spec)
Exception?: NO — always required
Notes:      Good rationale content: floorplan pick + why · notable component
            choices · which repair patterns were pre-applied · what's
            intentionally non-standard and why (RULE 16 exceptions).
            Follow-up: added meta.rationale check to build/validate-spec.js.
```

---

### P-015 · Plugin throws "ReferenceError: 'parentFrame' is not defined" building NativeSideNav

```
Trigger:    Spec has SideNavigation/NativeSideNav as a top-level sibling of ShellBar
            and DynamicPage (the correct P-011 pattern), plugin throws ReferenceError
            during build.
Root cause: Inside buildSapNode() the NativeSideNav handler called
            parentFrame.appendChild(rail) at line 2542, but buildSapNode's signature is
            (nodeSpec, density, width) — no parentFrame param. Every other handler in
            buildSapNode returns its node and lets the caller (buildTree) append.
            The stray parentFrame call worked before P-011 because SideNavigation used
            to be nested inside FCL where a different code path handled placement.
            Once SideNavigation was hoisted to top-level, buildSapNode became the
            direct construction path — and the phantom parentFrame reference triggered.
Category:   Figma implementation (plugin variable scope bug)
Repair type: PLUGIN_LIMITATION (⚙) — fixed in plugin build 2026-07-09 or later
Fix:        Removed the `parentFrame.appendChild(rail)` line. NativeSideNav now returns
            the rail; buildTree appends it to the correct parent like every other
            component. No spec change needed after plugin rebuild.
Confidence: 100% (confirmed 2026-07-09, outage-list-overview spec)
Exception?: NO — always a defect (was latent, exposed by P-011 top-level hoist pattern)
Notes:      Twin of P-003 (density scope bug in FCL renderColumn). Both are
            "inner function referencing an outer scope variable that isn't there".
            Fix pattern: don't call parent.appendChild inside a return-node function.
            Return the node, let the recursive caller place it.
```

---

### P-016 · Table renders empty — SAP kit instance shadows spec-driven builder

```
Trigger:    Spec has Table with slots.columns and slots.items populated (say 8 columns
            and 10 rows), but built canvas shows only the SAP kit's default table
            (a few columns, no data rows, "Sales Orders" placeholder content).
Root cause: Plugin has TWO Table handlers in code.js:
              Line 2745 (buildSapNode)  — imports the SAP kit Table instance and
                                          returns it. Kit ships with hardcoded demo
                                          content that Plugin API cannot override.
              Line 7389 (buildTree)     — builds a real table from spec-driven
                                          columns + items, correctly.
            The buildSapNode handler runs FIRST and returns the kit instance,
            short-circuiting before buildTree's spec-driven path is reached.
Category:   Figma implementation (handler ordering / shadowing bug)
Repair type: PLUGIN_LIMITATION (⚙) — fixed in plugin build 2026-07-09 or later
Fix:        In buildSapNode's Table handler, detect whether nodeSpec.slots.columns
            or nodeSpec.slots.items is populated. If yes → return null (fall through
            so buildTree's spec-driven Table path can construct the real table).
            If no → return the kit instance (existing behavior for simple usage).
Confidence: 100% (confirmed 2026-07-09, outage-list-overview spec)
Exception?: NO — always a defect for tables with spec-driven columns/items
Notes:      Twin of P-015 pattern: latent handler in early path masks the correct
            deep-path handler. Fix pattern: early handler must yield (return null)
            when the spec has content only the deep handler knows how to render.
```

---

### P-017 · ShellBar auto-renders phantom SideNavigation on the left

```
Trigger:    Spec has ShellBar at hierarchy[0] AND SideNavigation at hierarchy[1].
            Build shows TWO left rails — one thin blue SAP menu (from ShellBar's
            side-menu implementation) and one full SideNavigation.
Root cause: SAP kit's ShellBar instance auto-renders a collapsible side menu with
            placeholder items ("Overview", "Home", etc.) whenever it is placed.
            When user also has a proper SideNavigation, the two visually collide.
Category:   Figma implementation (kit-default content leaking)
Repair type: Replace with explicit design decision (either drop ShellBar entirely,
             or configure it to suppress the auto side menu)
Fix:        Option A (preferred if reference has no ShellBar): remove ShellBar from
            spec — SideNavigation as root becomes the primary chrome (RULE 16 flex).
            Option B (if ShellBar is required): set props.hideSideMenu=true (if
            supported), OR accept the visual collision as an intentional exception
            (RULE 16 — only if the reference actually shows both).
Confidence: 100% (confirmed 2026-07-09, outage-list-overview v1 build)
Exception?: SOMETIMES — depends on reference. If reference shows no ShellBar,
             always remove. If reference shows ShellBar without a side menu, hide.
Notes:      Always verify: does the reference image actually show a ShellBar?
            If unclear, ASK the user. Adding a ShellBar "just because" collides
            with any spec that also has a real SideNavigation.
```

---

### P-018 · SideNavigation renders as sibling instead of left rail

```
Trigger:    Spec has SideNavigation + DynamicPage as top-level siblings.
            Build stacks them vertically or floats SideNavigation in the middle —
            content appears as a vertical stack of components, not a proper
            "menu on left / content on right" layout.
Root cause: buildScreen() at code.js:7916 detects two-column layout via
            `spec.hierarchy.some(n => n.component === 'NativeSideNav')`.
            This ONLY recognizes the legacy NativeSideNav name — NOT the canonical
            SAP name "SideNavigation" that specs actually use. When SideNavigation
            is used, the two-column layout branch is skipped and everything falls
            through to the default vertical-stack path.
Category:   Figma implementation (layout dispatcher naming mismatch)
Repair type: PLUGIN_LIMITATION (⚙) — fixed in plugin build 2026-07-09 or later
Fix:        In code.js buildScreen():
              const isSideNavComponent = (name) =>
                name === 'NativeSideNav' || name === 'SideNavigation';
              const hasSideNav = spec.hierarchy.some(n => isSideNavComponent(n.component));
            Also update the sidebar-placement loop to check via isSideNavComponent().
Confidence: 100% (confirmed 2026-07-09, outage-list-overview v3 build)
Exception?: NO — always a defect; both names should trigger the two-column layout
Notes:      Root cause of the "reference doesn't look like reference image" complaint
            in the outage-list build. The reference image shows a proper 2-column
            app layout (menu left, content right). Without this fix, spec-authored
            SideNavigation renders as a floating stack item, not a persistent rail.
```

---

### P-019 · FilterBar renders as duplicate DynamicPageHeader chrome

```
Trigger:    Spec has FilterBar with slots.filterItems (SearchField + Selects +
            DatePickers). Build shows a full DynamicPageHeader placeholder with
            "Page Title" text, "Special 157.4M EUR" chip, "⿻ Header Area" slot,
            breadcrumbs "Parent item / 1st child item / Current item" —
            all the SAP kit's default page-header content — INSTEAD of a
            horizontal row of filter inputs.
Root cause: Two co-conspiring bugs:
              1. KEY_MAP had  FilterBar: 'DynamicPageHeader'  which aliased
                 FilterBar to the same SAP component as DynamicPageTitle.
              2. buildSapNode handler at code.js:2375 caught
                 `comp === 'DynamicPageHeader' || comp === 'FilterBar' || ...`
                 and imported a DynamicPageHeader instance for FilterBar too.
            Result: every FilterBar rendered a phantom second page-header chrome
            below the real DynamicPageTitle, with all the SAP placeholder text
            leaking through.
Category:   Figma implementation (wrong component alias)
Repair type: PLUGIN_LIMITATION (⚙) — fixed in plugin build 2026-07-09 or later
Fix:        1. Remove `FilterBar: 'DynamicPageHeader'` from KEY_MAP.
            2. Add a dedicated FilterBar handler that returns a native horizontal
               frame (16px padding, 8px gap, bottom border, sapPageHeader_Background)
               with buildTree recursing slots.filterItems as children.
            3. SAP Web UI Kit ships no FilterBar component — native rendering is
               correct (matches how the Fiori guideline shows FilterBar as a
               composed layout region, not a single component).
Confidence: 100% (confirmed 2026-07-09, outage-list-overview v4 build)
Exception?: NO — always a defect; FilterBar must never alias to DynamicPageHeader
Notes:      This is why every previous "the reference doesn't look right" report
            included "Page Title / Special 157.4M EUR / Parent item / Current item"
            placeholders visible on canvas. Those are the DynamicPageHeader kit
            defaults leaking through because FilterBar was rendering as a second
            header. Fix eliminates the entire phantom chrome.
```

---

### P-020 · FilterBar renders empty (children not recursed inside)

```
Trigger:    Spec has FilterBar with slots.filterItems containing SearchField +
            Select + DatePicker components. Build shows an empty FilterBar frame
            with no filter inputs inside.
Root cause: buildSapNode returns a native FilterBar frame, then buildTree's default
            path at code.js:7802 just calls parentFrame.appendChild(inst) — it does
            NOT recurse the spec's children into the returned frame. Only leaf
            components work with the default path; containers with children need
            explicit handlers in buildTree.
Category:   Figma implementation (default fallback path drops slot children)
Repair type: PLUGIN_LIMITATION (⚙) — fixed in plugin build 2026-07-09 or later
Fix:        Add explicit FilterBar handler in buildTree (not buildSapNode) that:
              1. Builds the native FilterBar frame with padding/gap/border
              2. Appends it to parentFrame FIRST
              3. Iterates spec.slots.filterItems and calls buildTree(item, fb, ...)
                 for each, recursing children INTO the frame
              4. Returns to prevent default path from running
Confidence: 100% (confirmed 2026-07-09, outage-list-overview v5 build)
Exception?: NO — always a defect for any spec-driven container returning a native
             frame with slot-based children
Notes:      Same pattern applies to any custom container: return a frame from
            buildTree and recurse children INTO it BEFORE returning. The default
            path is only correct for leaf SAP instances.
```

---

### P-021 · DynamicPageTitle actions render as kit-default Edit/Copy/share (not spec buttons)

```
Trigger:    Spec provides DynamicPageTitle.slots.actions with real Button specs
            (Manage Teams / Tool Registry / New Outage). Build shows the SAP kit's
            default action row (Edit / Copy / Share / Fullscreen / Close) instead.
Root cause: The actions-hide code searched inst.findOne(n => n.name === 'Actions')
            but the kit's actual structure is:
              DynamicPageHeader > Toolbar > slot "⿻ Actions Compact" > [1st Action,
              2nd Action, 3rd Action, ...]
            No frame is named "Actions" — the buttons are direct children named
            "1st Action" etc. Result: kit defaults never hide; the spec actBar
            appends but floats somewhere unintended (not inside the Toolbar slot).
Category:   Figma implementation (wrong node name in findOne search)
Repair type: PLUGIN_LIMITATION (⚙) — fixed in plugin build 2026-07-09 or later
Fix:        1. Locate the Toolbar frame/instance by name.
            2. Hide all child instances matching /^\d+(st|nd|rd|th)\s+Action$/i.
            3. Build the spec's actBar as before, but try to place it inside
               the ⿻ Actions Compact slot (search by n.name.indexOf('Actions')).
            4. Fallback to inst-level append if slot not found.
Confidence: 100% (confirmed 2026-07-09, outage-list-overview v5 build)
Exception?: NO — always a defect when kit-default action row leaks
Notes:      Twin of P-006 (breadcrumbs) — both are kit-default content leaking
            because the finder searched by outdated node names. Correct search
            follows the reference frame's actual node hierarchy.
```

---

### P-022 · "node does not exist" crash when calling findOne after setProperties

```
Trigger:    Plugin calls inst.setProperties({'Type':'Expanded'}) on a SAP instance,
            then immediately calls inst.findOne(n => n.name.includes('...')) — throws
            "in get_name: The node (instance sublayer or table cell) with id
            'I244:xxxxx;112533:14529' does not exist"
Root cause: setProperties() on a SAP instance INVALIDATES all sublayer node IDs.
            Any subsequent .name access on those invalidated references — even inside
            a try/catch predicate — throws at the Figma plugin API level, not at the
            JS level. The JS try/catch does NOT prevent it.
Category:   Figma implementation (plugin API constraint — setProperties invalidates IDs)
Repair type: PLUGIN_LIMITATION (⚙) — requires code pattern change, not spec change
Fix:        TRAVERSE (findOne/findAll) BEFORE calling setProperties.
            Never call findOne/findAll on a SAP instance AFTER setProperties.
            Pattern:
              1. Find the slot/text/child BEFORE setProperties (IDs valid here)
              2. Snapshot any references you need to mutate later
              3. THEN call setProperties (IDs now invalidated — don't traverse again)
              4. Mutate the snapshotted references (they still work after setProperties)
Confidence: 100% (confirmed 2026-07-09, SideNavigation Type:Expanded)
Exception?: NO — always a defect pattern; applies to ANY setProperties + traversal combo
Notes:      SUPERSEDED BY P-023 — the correct fix is safeFindOne/safeFindAll wrappers
            with per-node try/catch. See P-023 for the systematic remediation.
```

---

### P-023 · "node does not exist" crash — actual root cause: unwrapped arrow predicates

```
Trigger:    Console reports:
              Error: in get_name: The node ... with id "I247:32080;112533:14529"
              does not exist
                  at findOne (native)
                  at buildTree (...)
            Symptoms: Header Content Area not hidden, action buttons not injected,
            expand/collapse chevron visible, subtitle wrong, entire DPT block fails
            silently. Full-file rebuild appears to be "0 changes" because everything
            downstream of the crash line is skipped.
Root cause: Arrow-function predicates passed to findOne/findAll like
              inst.findOne(n => n.name === 'X')
              inst.findAll(n => n.type === 'TEXT')
            throw INSIDE the native traversal loop when they touch .name / .type on
            an invalidated sublayer (any sublayer whose parent instance had
            setProperties() called on it). The OUTER try/catch does catch the throw,
            but findOne aborts and returns undefined, so all downstream logic
            branches on a null result and the entire code block is effectively
            skipped. Fewer visible errors than a full crash, but produces the exact
            "nothing was fixed" symptom the user sees.
            P-022's "traverse before setProperties" advice is CORRECT but
            insufficient — many code paths inherit an already-mutated instance
            (e.g. DynamicPageTitle inherits inst from sapInstance() which calls
            setProperties internally), so the sublayer IDs are already stale by
            the time our code runs.
Category:   Figma implementation (plugin API constraint — arrow predicates unsafe)
Repair type: Global code pattern change — introduce safe traversal helpers
Fix:        Replace EVERY raw arrow predicate with a safe wrapper. Added helpers
            at code.js line ~1866:
              function safeFindOne(root, predicate) {
                if (!root || typeof root.findOne !== 'function') return null;
                try {
                  return root.findOne(function(n) {
                    try { return !!predicate(n); } catch (e) { return false; }
                  });
                } catch (e) { return null; }
              }
              function safeFindAll(root, predicate) { ... same shape ... }
              function safeName(n) { try { return (n && n.name) || ''; } catch (e) { return ''; } }
              function safeType(n) { try { return (n && n.type) || ''; } catch (e) { return ''; } }

            **ARCHITECTURAL UPGRADE (2026-07-09 second pass, after adversarial
            audit found 44 remaining unsafe sites):**
            Rather than fix each call site, install ONE canonical guard:
              function protectInstance(inst) {
                if (!inst || inst.__saPatched) return inst;
                const origFindOne = inst.findOne.bind(inst);
                const origFindAll = inst.findAll.bind(inst);
                inst.findOne = function(pred) {
                  try {
                    const r = origFindOne(function(n) {
                      try { return !!pred(n); } catch (e) { return false; }
                    });
                    return r ? protectInstance(r) : null;
                  } catch (e) { return null; }
                };
                inst.findAll = function(pred) {
                  try {
                    const rs = origFindAll(function(n) {
                      try { return !!pred(n); } catch (e) { return false; }
                    }) || [];
                    for (const r of rs) protectInstance(r);
                    return rs;
                  } catch (e) { return []; }
                };
                Object.defineProperty(inst, '__saPatched', { value: true });
                return inst;
              }

            Then wrap EVERY SAP instance origin site:
              - sapInstance() returns protectInstance(inst)
              - every direct .createInstance() call becomes
                protectInstance(X.createInstance())
              - protectInstance recursively wraps findOne/findAll returns so
                nested traversals (subnode.findOne(...)) inherit the guard
            One architectural change fixes ALL 44+ unsafe traversal sites.
Confidence: 100% (confirmed 2026-07-09 · repeated console error line 12129
            "findOne (native)" in bundle 165/167/171/173/175/177/179/181 all
            traced to unwrapped arrow predicate, all fixed with safe wrapper.
            Adversarial audit 2nd pass confirmed all 11 createInstance sites
            wrapped except Dialog fallback 5683 which was subsequently fixed.)
Exception?: NO — applies to every SAP instance handler that runs after
            setProperties. That is nearly every handler in buildTree.
Notes:      Do NOT write raw findOne(n => ...) or findAll(n => ...) anywhere in
            code.js from now on. Every predicate MUST use safeFindOne/safeFindAll.
            Reason the earlier "safeName" fixes only partially worked: they
            protected .name access AT THE CALL SITE, but the traversal itself
            was still running an unwrapped .type / .name check inside the arrow.
```

---

## Pattern Growth Notes

When you add a new pattern after a successful repair:
1. Assign the next P-NNN ID
2. Fill all fields — especially Exception? (helps future repair engine decide preserve vs. fix)
3. Set Confidence to the actual session/date confirmed
4. Commit a one-line summary to the memory system (`reference_repair_patterns.md`)

**Current count:** 28 patterns · Last updated: 2026-07-15

---

### P-024 · ObjectStatus semantic color never applies (always Information)

```
Trigger:    Spec sets ObjectStatus props.state = 'Success'/'Warning'/'Error' but
            every chip renders blue (Information) regardless. Labels are correct,
            only the color/icon stays default.
Root cause: statusVariants() returned { 'State': ... } but the LIVE SAP
            ObjectStatus component property is named 'Semantic' (VARIANT, options:
            None/Information/Success/Warning/Error). Setting a non-existent 'State'
            property is silently ignored by setProperties → default Information.
Category:   SAP component mapping (wrong variant property name)
Repair type: Fix variant property name
Fix:        statusVariants() now returns { 'Semantic': resolved, 'State': resolved }.
            The ObjectStatus handler passes 'Semantic' as the variant prop AND
            re-applies inst.setProperties({'Semantic': ...}) after creation as a
            belt-and-suspenders (covers detached instances too).
Confidence: 100% (confirmed 2026-07-09 via componentProperties inspection on the
            live kit — Semantic opts None/Information/Success/Warning/Error)
Exception?: NO — always a defect. Verify the REAL variant prop name via
            componentProperties before mapping any status/semantic component.
```

---

### P-025 · Button Type variant wrong — every button renders Primary

```
Trigger:    Spec sets Button props.type = 'Transparent'/'Emphasized' but every
            button renders as Primary (blue filled). Console shows
            "Button setProperties: Unable to find a variant with those property values".
Root cause: The live SAP Button 'Type' variant options are Primary / Secondary /
            Accept / Reject / Attention / Tertiary. There is NO 'Emphasized' or
            'Transparent' variant. Passing those failed setProperties atomically,
            so the button kept its default (Primary).
Category:   SAP component mapping (wrong variant option values)
Repair type: Fix variant option mapping
Fix:        typeMap in the DynamicPageTitle actions builder now maps:
              Emphasized/Primary  -> Primary
              Default/Secondary   -> Secondary
              Transparent/Ghost   -> Tertiary
              Negative/Reject     -> Reject
              Critical/Attention  -> Attention
              Accept              -> Accept
            Also: the disabled state prop is 'Interaction State':'Disabled'
            (options: Regular/Hover/Down/Disabled), NOT 'State':'Disabled'.
Confidence: 100% (confirmed 2026-07-09 via componentProperties inspection —
            Type opts Primary/Secondary/Accept/Reject/Attention/Tertiary)
Exception?: NO — always a defect. The spec vocabulary (Emphasized/Transparent from
            UI5) must be mapped to the KIT's actual variant option names.
```

---

### P-026 · SAP composite slot injection — clone-clear-repopulate method

```
Trigger:    Building a SAP composite screen (SideNavigation, Dialog, DynamicPageHeader,
            etc.) by constructing it from scratch via importComponentSetByKeyAsync +
            stacking results in missing slot frames, wrong nesting, or setProperties
            silently failing on all items.
Root cause: SAP composites have named slot frames (⿻ Navigation Items, ⿻ Content, etc.)
            that are created by the component's own internal structure. Building from
            scratch with createFrame or importComponentSetByKeyAsync produces instances
            without this slot structure, so injected children end up outside slots and
            setProperties on nested items fails silently.
Category:   SAP composite composition (wrong build method)
Repair type: Replace entire build approach — use clone-canonical method
Fix:        1. Find an existing correctly-built composite node on canvas
               (canonical refs: SideNavigation=699:37890, DPH=cloned from any working screen)
            2. ref.clone() — this preserves all slot frames and SAP token bindings
            3. Find the ⿻ slot frame inside the clone by name
            4. Save prototype references from the ORIGINAL ref (not the clone)
            5. slot children.forEach(n => n.remove()) — clear all existing items
            6. For each content item: clone matching prototype from original ref,
               slot.appendChild(inst), set layoutSizingHorizontal='FILL', setProperties
            7. Never source prototypes from the clone — prior overrides block writes
Confidence: 100% (confirmed 2026-07-15, SideNavigation RCA — 14 failed iterations
            before this method succeeded on first try)
Exception?: NO — always use this method for ANY SAP composite with named slots.
Notes:      General principle: the clone inherits all var(--sapXxx) fills and SAP
            font tokens automatically. Never use raw hex on a composite — clone from
            a canonical node and get correct tokens for free.
```

---

### P-027 · setProperties fails on slot items — nesting depth wrong

```
Trigger:    setProperties call runs without error but nothing changes in the rendered
            output. Items keep their default labels/icons despite the call.
Root cause: setProperties only works on DIRECT children of a slot frame. When items
            are double-nested (e.g. inside a composite that wraps another composite),
            the outer instance resists property writes silently.
Category:   Figma Plugin API constraint (setProperties depth)
Repair type: Fix call target — operate at correct nesting depth
Fix:        Before writing setProperties, log the item's parent chain to verify it is
            a direct child of the named slot frame (not grandchild or deeper).
            If double-nested: find the slot frame first, then call setProperties on
            that frame's direct children — not on deeper descendants.
            Use: slotFrame.children[i].setProperties({...}) not node.findAll(...)[i]
Confidence: 100% (confirmed 2026-07-15, SideNavigation RCA)
Exception?: NO — setProperties depth limit is a hard Figma API constraint.
```

---

### P-028 · Prototype source contamination — cloning from a prior clone

```
Trigger:    First slot item populates correctly; subsequent items have wrong content,
            carry over previous label/icon, or ignore setProperties calls entirely.
Root cause: Prototypes sourced from an already-modified clone carry inherited overrides.
            Each subsequent setProperties call partially or fully fails because the
            target instance is pre-overridden from the source clone.
Category:   Figma Plugin API constraint (clone override inheritance)
Repair type: Fix prototype source — always use unmodified original
Fix:        Save prototype references BEFORE any modifications:
              const proto = originalRef.findOne(n => n.name === 'Navigation Item');
            Then for each item: proto.clone() — fresh, no overrides.
            NEVER: clone.findOne(...) as a prototype source after you have already
            modified the clone's children.
Confidence: 100% (confirmed 2026-07-15, SideNavigation RCA)
Exception?: NO — always source from the unmodified original. This is a hard rule.
Notes:      Save all prototype references before the slot-clear step. Once you call
            n.remove() on slot children, those nodes are gone — harvest prototypes first.
```
