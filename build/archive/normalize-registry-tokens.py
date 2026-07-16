#!/usr/bin/env python3
"""
normalize-registry-tokens.py — bulk-rewrite registry colorTokenRules to use
canonical MANDATORY_TOKENS names from the plugin.

Run with `--dry-run` first to preview changes. Then run without to write.
"""
import json, os, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY = os.path.join(ROOT, 'knowledge', 'components', 'registry')

# Read MANDATORY_TOKENS from plugin to get the canonical whitelist
with open(os.path.join(ROOT, 'plugin', 'figma-builder', 'code.js')) as f:
    src = f.read()

def extract_keys(name):
    m = re.search(rf'const {name}\s*=\s*\{{(.+?)\n\}};', src, re.S)
    if not m: return set()
    keys = set()
    for line in m.group(1).split('\n'):
        line = re.sub(r'//.*$', '', line).strip()
        km = re.match(r"['\"]?([A-Za-z_][A-Za-z0-9_]*)['\"]?\s*:", line)
        if km: keys.add(km.group(1))
    return keys

mt_color = extract_keys('MANDATORY_TOKENS')
mt_space = extract_keys('MANDATORY_SPACING_TOKENS')
whitelist = mt_color | mt_space

# Map of legacy slash/prefix names → canonical whitelist names
# Strategy: take any token that ENDS with a known whitelist suffix and remap it.
# Add a manual map for synthetic legacy names ('Grey/Grey 2', 'grey/primary', etc.)
LEGACY_MAP = {
    # Slash-prefixed canonical → already-canonical
    'Button/Emphasized/sapButton_Emphasized_Background': 'sapButton_Emphasized_Background',
    'Button/Emphasized/sapButton_Emphasized_TextColor':  'sapButton_Emphasized_TextColor',
    'Input/Standard/sapField_BorderColor':               'sapField_BorderColor',
    'List/sapList_Background':                            'sapBackgroundColor',  # list rows are app bg
    'List/sapList_HeaderBackground':                      'sapShellColor',        # header is shell-style
    'List/sapList_TextColor':                             'sapList_TextColor',
    'Shell/Navigation/sapShell_Navigation_Background':    'sapShell_Background',
    'Shell/Navigation/sapShell_Navigation_SelectedColor': 'sapButton_Emphasized_Background',  # selected = brand blue
    'Shell/sapShell_Background':                          'sapShell_Background',
    'Shell/sapShell_TextColor':                           'sapShell_TextColor',
    'Text/sapContent_LabelColor':                         'sapContent_LabelColor',
    'Link/sapLinkColor':                                  'sapButton_TextColor',     # link color uses button text token
    'sapLinkColor':                                       'sapButton_TextColor',
    'Semantic/Text/sapNeutralTextColor':                  'sapList_TextColor',

    # Synthetic legacy palette names → semantic tokens
    'Grey/Grey 10':                                       'sapList_TextColor',         # very dark text
    'Grey/Grey 2':                                         'sapShell_BorderColor',      # light divider
    'Grey/Grey8':                                          'sapList_TextColor',          # dark text
    'grey/primary':                                        'sapList_TextColor',
    'grey/secondary':                                      'sapContent_LabelColor',
    'List':                                                'sapShell_BorderColor',      # 'List' alone = row divider

    # Already canonical (no change)
    'sapContent_LabelColor':                              'sapContent_LabelColor',
    'sapList_TextColor':                                  'sapList_TextColor',
    'sapTitleColor':                                      'sapTitleColor',
}

DRY_RUN = '--dry-run' in sys.argv

print(f"Whitelist size: {len(whitelist)}")
print(f"Legacy map size: {len(LEGACY_MAP)}")
print(f"Mode: {'DRY-RUN' if DRY_RUN else 'WRITE'}")
print()

changes_per_file = {}
unmapped_tokens = set()

for f in sorted(os.listdir(REGISTRY)):
    if not f.endswith('.json') or f.startswith('_'): continue
    path = os.path.join(REGISTRY, f)
    try:
        j = json.load(open(path))
    except: continue

    rules = j.get('colorTokenRules', [])
    if not rules: continue

    changed = []
    for r in rules:
        old = r.get('token', '')
        if not old: continue
        if old in whitelist:
            continue  # already canonical
        new = LEGACY_MAP.get(old)
        if new is None:
            unmapped_tokens.add(old)
            continue
        if new != old:
            changed.append((old, new))
            r['token'] = new

    if changed:
        changes_per_file[f] = changed
        if not DRY_RUN:
            with open(path, 'w') as out:
                json.dump(j, out, indent=2)
            # add newline at end
            with open(path, 'a') as out:
                out.write('\n')

print(f"Files changed: {len(changes_per_file)}")
for fn, chs in sorted(changes_per_file.items()):
    print(f"\n{fn}:")
    for old, new in chs:
        print(f"  {old!r}")
        print(f"  → {new!r}")

print(f"\n=== UNMAPPED TOKENS (need decision) ===")
for t in sorted(unmapped_tokens):
    print(f"  · {t}")
