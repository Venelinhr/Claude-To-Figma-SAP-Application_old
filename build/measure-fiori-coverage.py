#!/usr/bin/env python3
"""
measure-fiori-coverage.py — reusable validation script.

Measures coverage of the SAP Fiori for Web component catalog against
the current registry + plugin recognition + out-of-scope documentation.

Run with: python3 build/measure-fiori-coverage.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The canonical SAP Fiori for Web catalog — 141 components in 11 categories
SAP_FIORI_WEB_CATALOG = {
    "App Shell & Navigation": [
        "ShellBar","ToolHeader","SideNavigation","NavigationList","NavigationListItem",
        "Breadcrumbs","Tabs","IconTabBar","IconTabFilter","IconTabSeparator",
        "IconTabHeader","ProductSwitch","UserMenu","NotificationListItem","Notifications",
    ],
    "Page Layout": [
        "DynamicPage","DynamicPageTitle","DynamicPageHeader","ObjectPageLayout",
        "ObjectPageSection","ObjectPageSubSection","ObjectPageHeader","FlexibleColumnLayout",
        "Page","App","SplitContainer","Shell",
    ],
    "Buttons & Actions": [
        "Button","ToggleButton","MenuButton","SplitButton","SegmentedButton",
        "IconButton","OverflowToolbar","Toolbar","ToolbarSpacer","ToolbarSeparator",
    ],
    "Inputs": [
        "Input","TextArea","MaskedInput","Select","ComboBox","MultiComboBox","MultiInput",
        "DatePicker","DateTimePicker","DateRangePicker","TimePicker","StepInput","Slider",
        "RangeSlider","Switch","RadioButton","RadioButtonGroup","CheckBox","FileUploader",
        "ColorPicker","RatingIndicator","FeedInput","SearchField","Token","Tokenizer",
    ],
    "Forms": [
        "Form","SimpleForm","FormContainer","FormElement","FilterBar","Label","FormattedText",
    ],
    "Lists & Tables": [
        "List","Table","GridTable","AnalyticalTable","TreeTable","ResponsiveTable",
        "Column","ColumnListItem","StandardListItem","InputListItem","FeedListItem",
        "ActionListItem","GroupHeaderListItem","Tree","TreeItem",
    ],
    "Object Display": [
        "Avatar","AvatarGroup","ObjectIdentifier","ObjectStatus","ObjectNumber",
        "ObjectAttribute","ObjectHeader","ObjectListItem","ObjectMarker","Tag",
        "Title","Text","InfoLabel","Link",
    ],
    "Feedback & Status": [
        "MessageStrip","MessageToast","MessageBox","MessagePopover","MessageView",
        "BusyIndicator","BusyDialog","ProgressIndicator","IllustratedMessage","Toast",
    ],
    "Overlays & Containers": [
        "Dialog","Popover","QuickView","QuickViewCard","Menu","Panel","Card","Carousel",
        "ScrollContainer","FlexBox","HBox","VBox","Grid","ResponsiveGridLayout","Splitter",
    ],
    "Charts & Visualization": [
        "MicroChart","AreaMicroChart","BulletMicroChart","ColumnMicroChart",
        "ComparisonMicroChart","DeltaMicroChart","LineMicroChart","RadialMicroChart",
        "InteractiveBarChart","InteractiveLineChart","InteractiveDonutChart",
        "HarveyBallMicroChart","StackedBarMicroChart",
    ],
    "Process Patterns": [
        "Wizard","WizardStep","Timeline","TimelineItem","ProgressStep",
    ],
}

# Aliases: catalog name → equivalent name in registry/plugin
ALIASES = {
    'Breadcrumb': 'Breadcrumbs',         # catalog uses plural
    'NavigationItem': 'NavigationListItem',
}

# Components documented as out-of-scope (must match out-of-scope-components.md)
OUT_OF_SCOPE = {
    # Charts (13)
    'MicroChart','AreaMicroChart','BulletMicroChart','ColumnMicroChart',
    'ComparisonMicroChart','DeltaMicroChart','LineMicroChart','RadialMicroChart',
    'InteractiveBarChart','InteractiveLineChart','InteractiveDonutChart',
    'HarveyBallMicroChart','StackedBarMicroChart',
    # Heavyweight tables (3)
    'GridTable','AnalyticalTable','TreeTable',
    # Runtime/framework (8)
    'App','Shell','Page','SplitContainer','FlexibleColumnLayout','MessageView',
    'ScrollContainer','Splitter',
    # Layout primitives (6)
    'FlexBox','HBox','VBox','Grid','ResponsiveGridLayout','ToolbarSeparator',
}

def main():
    registry = {f.replace('.json','') for f in os.listdir(os.path.join(ROOT, 'knowledge/components/registry'))
                if f.endswith('.json') and not f.startswith('_')}
    with open(os.path.join(ROOT, 'plugin/figma-builder/code.js')) as f:
        src = f.read()
    def ekeys(name):
        m = re.search(rf'const {name}\s*=\s*\{{(.+?)\n\}};', src, re.S)
        if not m: return set()
        keys = set()
        for line in m.group(1).split('\n'):
            line = re.sub(r'//.*$', '', line).strip()
            km = re.match(r"['\"]?([A-Za-z_][A-Za-z0-9_]*)['\"]?\s*:", line)
            if km: keys.add(km.group(1))
        return keys
    plugin = ekeys('SAP_KEYS') | ekeys('KEY_MAP')

    fiori_all = set()
    for comps in SAP_FIORI_WEB_CATALOG.values(): fiori_all.update(comps)

    print("=" * 90)
    print(f"{'Category':<28} {'Total':<7} {'Covered':<9} {'Out-of-scope':<14} {'GAP':<6} {'%'}")
    print("=" * 90)

    grand_cov = grand_out = grand_gap = 0
    real_gaps = []
    for cat, comps in SAP_FIORI_WEB_CATALOG.items():
        cov = out = gap = 0
        for c in comps:
            norm = ALIASES.get(c, c)
            if c in registry or c in plugin or norm in registry or norm in plugin:
                cov += 1
            elif c in OUT_OF_SCOPE:
                out += 1
            else:
                gap += 1
                real_gaps.append(c)
        grand_cov += cov; grand_out += out; grand_gap += gap
        total = len(comps); eff = cov + out
        pct = 100*eff/total if total else 0
        print(f"{cat:<28} {total:<7} {cov:<9} {out:<14} {gap:<6} {pct:>5.1f}%")

    print("=" * 90)
    eff_total = grand_cov + grand_out
    print(f"{'TOTAL':<28} {len(fiori_all):<7} {grand_cov:<9} {grand_out:<14} {grand_gap:<6} {100*eff_total/len(fiori_all):>5.1f}%")
    print()
    if grand_gap == 0:
        print("✓ ZERO TRUE GAPS — every SAP Fiori for Web component is either covered or documented.")
        return 0
    else:
        print(f"REMAINING TRUE GAPS ({grand_gap}):")
        for g in real_gaps: print(f"  · {g}")
        return 1

if __name__ == '__main__':
    import sys
    sys.exit(main())
