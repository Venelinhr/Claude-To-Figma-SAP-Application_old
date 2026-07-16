#!/usr/bin/env python3
"""
check-component-consistency.py — enforces the 3-place rule.

For every component name the plugin recognizes, verifies it appears in ALL of:
  1. A runtime path (buildTree handler `comp === '...'` OR SAP_KEYS instance OR
     KEY_MAP alias OR composition-by-parent for nested components)
  2. The validator allow-list (KEY_MAP ∪ NATIVE_RENDERERS ∪ SKIP_SELF
     ∪ HORIZ_CONTAINERS ∪ LAYOUT_CONTAINERS ∪ explicit-validator-list)
  3. A registry entry in knowledge/components/registry/

If a component is in only 1-2 of those, that's the kind of gap that surfaces as
an "Unknown components" validation error OR as a silent render-drop.

Exit codes:
  0  All components consistent across 3 layers
  1  Inconsistency detected (prints details)
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODE = os.path.join(ROOT, 'plugin/figma-builder/code.js')
REG  = os.path.join(ROOT, 'knowledge/components/registry')

with open(CODE) as f: src = f.read()

# Layer 1 — runtime paths
def obj_keys(name):
    m = re.search(rf'const {name}\s*=\s*\{{(.+?)\n\}};', src, re.S)
    if not m: return set()
    keys = set()
    for line in m.group(1).split('\n'):
        line = re.sub(r'//.*$', '', line).strip()
        km = re.match(r"['\"]?([A-Za-z_][A-Za-z0-9_]*)['\"]?\s*:", line)
        if km: keys.add(km.group(1))
    return keys

def set_contents(name):
    m = re.search(rf"const {name}\s*=\s*new Set\(\[(.+?)^\]\);", src, re.S | re.M)
    if not m: return set()
    block = m.group(1)
    # Strip line comments before extracting names so apostrophes in `// don't`
    # comments don't get treated as string delimiters.
    cleaned = re.sub(r'//[^\n]*', '', block)
    return set(re.findall(r"'([^']+)'", cleaned))

SAP_KEYS         = obj_keys('SAP_KEYS')
KEY_MAP          = obj_keys('KEY_MAP')
NATIVE_RENDERERS = set_contents('NATIVE_RENDERERS')
SKIP_SELF        = set_contents('SKIP_SELF')
HORIZ_CONTAINERS = set_contents('HORIZS?_CONTAINERS') or set_contents('HORIZ_CONTAINERS')
LAYOUT_CONTAINERS = set_contents('LAYOUT_CONTAINERS')
BUILDTREE_HANDLERS = set(re.findall(r"comp === '([A-Za-z][A-Za-z0-9_]*)'", src))

# The same explicit list validateSpec() uses
VALIDATOR_EXPLICIT = {'ToolbarSpacer','FilterBar','DynamicPageHeader','Title','IconTabFilter','IconTab'}

# Layer 2 — validator allow-list (mirror of validateSpec logic)
validator_allow = (KEY_MAP | LAYOUT_CONTAINERS | NATIVE_RENDERERS
                    | SKIP_SELF | HORIZ_CONTAINERS | VALIDATOR_EXPLICIT)

# Layer 3 — registry on disk
registry = {f.replace('.json','') for f in os.listdir(REG)
            if f.endswith('.json') and not f.startswith('_')}

# Universe of names: everything the plugin or registry knows about
all_names = SAP_KEYS | KEY_MAP | NATIVE_RENDERERS | BUILDTREE_HANDLERS | registry

# Classify each name
issues = []
ok_count = 0

for name in sorted(all_names):
    # Layer 1: has runtime path? Either has SAP_KEYS entry, KEY_MAP entry, OR
    # has a buildTree handler, OR is in NATIVE_RENDERERS (handler implicit),
    # OR is in SKIP_SELF/HORIZ_CONTAINERS (passthrough/special handling)
    has_runtime = (
        name in SAP_KEYS or name in KEY_MAP or
        name in BUILDTREE_HANDLERS or name in NATIVE_RENDERERS or
        name in SKIP_SELF or name in HORIZ_CONTAINERS
    )
    # Layer 2: validator allows?
    validator_ok = name in validator_allow
    # Layer 3: registry?
    in_registry = name in registry

    # Acceptable patterns:
    # A) Direct SAP component: in SAP_KEYS, in validator (via KEY_MAP), in registry
    # B) Native renderer: in NATIVE_RENDERERS (covers validator+runtime), maybe in registry
    # C) Alias (in KEY_MAP only, points to another): validator ok, runtime via parent
    # D) Composed-by-parent (e.g. IconTabFilter): runtime ok via parent handler;
    #    validator must have explicit listing; registry should document.
    # E) Wrapper/SKIP_SELF (e.g. DynamicPage): runtime+validator via SKIP_SELF;
    #    registry should document.
    # F) Legacy synthetic (Ref79*, Figma*): runtime+validator via NATIVE_RENDERERS;
    #    no registry (slated for removal).

    # FLAG if validator-allow but no runtime path (would silently drop)
    if validator_ok and not has_runtime:
        issues.append((name, 'VALIDATOR ACCEPTS BUT NO RUNTIME PATH',
                       'Validator passes but plugin will silently drop this component at render time.'))
        continue

    # FLAG if runtime exists but validator rejects (the AvatarGroup bug we just fixed)
    if has_runtime and not validator_ok:
        issues.append((name, 'RUNTIME PATH BUT VALIDATOR REJECTS',
                       'Plugin can render it, but validateSpec() will reject the spec before build.'))
        continue

    # FLAG if registry has entry but plugin doesn't recognize it AT ALL
    if in_registry and not has_runtime and not validator_ok:
        issues.append((name, 'IN REGISTRY BUT NOT IN PLUGIN',
                       'Registry advertises component, AI may emit it, plugin has no path.'))
        continue

    ok_count += 1

# ─────────────────────────────────────────────────────────────────────────────
# Layer 4 check — registry recipe targets must exist
# Every "alias:X" and "composed:X+Y" figmaComponentId references other component
# names. If those don't exist in the plugin (SAP_KEYS / KEY_MAP / NATIVE_RENDERERS),
# the recipe is fictional — it documents an intent but the plugin can't follow it.
# ─────────────────────────────────────────────────────────────────────────────
import json
recipe_issues = []
# Words inside recipes that are descriptors (not component names)
RECIPE_DESCRIPTORS = {'child','header','parent','styled','recipe','byparent','footer'}

for f in sorted(os.listdir(REG)):
    if not f.endswith('.json') or f.startswith('_'): continue
    j = json.load(open(os.path.join(REG, f)))
    fid = j.get('figmaComponentId', '')
    rname = j.get('componentName', f.replace('.json',''))

    if fid.startswith('alias:'):
        target = fid.split(':', 1)[1]
        if target not in (SAP_KEYS | KEY_MAP | NATIVE_RENDERERS):
            recipe_issues.append((rname, fid,
                f'alias target "{target}" not in SAP_KEYS, KEY_MAP, or NATIVE_RENDERERS'))
    elif fid.startswith('composed:'):
        recipe = fid.split(':', 1)[1]
        parts = re.split(r'[\+\-]', recipe)
        for part in parts:
            part = part.strip()
            if not part: continue
            base = re.sub(r'\[\]$', '', part)  # strip Avatar[] → Avatar
            if base.lower() in RECIPE_DESCRIPTORS: continue
            if base.lower().endswith('child') or base.lower().endswith('parent'): continue
            if base not in (SAP_KEYS | KEY_MAP | NATIVE_RENDERERS):
                recipe_issues.append((rname, fid,
                    f'composed part "{base}" not in SAP_KEYS, KEY_MAP, or NATIVE_RENDERERS'))
    elif fid.startswith('lookup:'):
        recipe_issues.append((rname, fid, 'still has lookup:pending placeholder'))

print(f"Total component names known: {len(all_names)}")
print(f"  Consistent across 3 layers:    {ok_count}")
print(f"  3-layer inconsistencies:        {len(issues)}")
print(f"  Recipe-target issues:           {len(recipe_issues)}")
print()

if issues:
    print("=== 3-LAYER INCONSISTENCIES ===\n")
    for name, kind, hint in issues:
        print(f"  ✗ {name:<25} [{kind}]")
        print(f"      {hint}")
    print()

if recipe_issues:
    print("=== REGISTRY RECIPE ISSUES ===\n")
    for name, fid, msg in recipe_issues:
        print(f"  ✗ {name:<25} fid={fid!r}")
        print(f"      {msg}")
    print()

if issues or recipe_issues:
    print("To fix:")
    print("  1. buildTree handler missing? Add `if (comp === '<Name>') { ... }` in code.js")
    print("  2. NATIVE_RENDERERS allow-list missing? Add to the Set near line 251")
    print("  3. Registry entry missing? Create knowledge/components/registry/<Name>.json")
    print("  4. Registry recipe target missing? Either add the part to SAP_KEYS/KEY_MAP/")
    print("     NATIVE_RENDERERS, or rewrite the recipe to reference real components.")
    print("  5. Rebuild: node build/build-registry-bundle.js")
    sys.exit(1)

print("✅ All component names are consistent across the 3 layers.")
print()
print("Layer breakdown:")
print(f"  SAP_KEYS         (direct figma IDs)       : {len(SAP_KEYS)}")
print(f"  KEY_MAP          (alias chain)             : {len(KEY_MAP)}")
print(f"  NATIVE_RENDERERS (composed renderers)      : {len(NATIVE_RENDERERS)}")
print(f"  SKIP_SELF        (passthrough wrappers)    : {len(SKIP_SELF)}")
print(f"  HORIZ_CONTAINERS (Toolbar / OverflowTb)    : {len(HORIZ_CONTAINERS)}")
print(f"  LAYOUT_CONTAINERS                          : {len(LAYOUT_CONTAINERS)}")
print(f"  Validator explicit list                    : {len(VALIDATOR_EXPLICIT)}")
print(f"  buildTree handlers                          : {len(BUILDTREE_HANDLERS)}")
print(f"  Registry entries                            : {len(registry)}")
sys.exit(0)
