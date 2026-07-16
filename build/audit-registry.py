#!/usr/bin/env python3
"""
audit-registry.py — Build-time metrics report
==============================================

Runs at the tail of `node build/build-registry-bundle.js` (right after the
3-layer consistency check). Prints a compact per-build metrics block so drift
is visible on every rebuild, not just when someone remembers to look.

Metrics:
  1. Registry entry count
  2. Compact-schema count (entries missing supportedProperties OR typographyRules OR colorTokenRules)
  3. Missing-guideline count (registry entries with no knowledge/guidelines/{slug}.md OR .json)
  4. Duplicate SAP_KEYS count (parsed from plugin/figma-builder/code.js)
  5. Token whitelist size (MANDATORY_TOKENS)
  6. Guideline cache size

Written 2026-07-08 as part of Wave D (roadmap item D3).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from collections import Counter

# ─────────────────────────────────────────────────────────────────────────────
# Paths (script lives in build/, project root is parent)
# ─────────────────────────────────────────────────────────────────────────────
BUILD_DIR = Path(__file__).resolve().parent
ROOT = BUILD_DIR.parent
REGISTRY_DIR = ROOT / "knowledge" / "components" / "registry"
GUIDELINES_DIR = ROOT / "knowledge" / "guidelines"
CODE_JS = ROOT / "plugin" / "figma-builder" / "code.js"

# Compact-schema signal: presence of these three fields is what "enriched" means
ENRICHED_FIELDS = ("supportedProperties", "typographyRules", "colorTokenRules")


def load_registry():
    """Return list of (name, entry dict) for every registry file except _schema.json."""
    out = []
    if not REGISTRY_DIR.is_dir():
        return out
    for f in sorted(REGISTRY_DIR.glob("*.json")):
        if f.name == "_schema.json":
            continue
        try:
            entry = json.loads(f.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            # Corrupt entry — count it toward gaps but don't crash the build
            entry = {}
        out.append((f.stem, entry))
    return out


def count_compact_schemas(registry):
    """Count entries missing meaningful values in any of the enriched fields.

    Enriched means every field in ENRICHED_FIELDS is populated with at least
    one item — OR the entry declares that field is deliberately not applicable
    via `schemaNotes.{field}: "n/a"` (used for components that legitimately have
    no typography — icons, images, star ratings).
    """
    def missing(entry, field):
        val = entry.get(field)
        if val:  # non-empty list/dict/string
            return False
        # empty or absent — check for explicit n/a marker
        notes = entry.get("schemaNotes") or {}
        return notes.get(field) != "n/a"

    return sum(
        1
        for _, entry in registry
        if any(missing(entry, field) for field in ENRICHED_FIELDS)
    )


def count_missing_guidelines(registry):
    """Count registry entries with no matching knowledge/guidelines/{name}.{json|md}."""
    if not GUIDELINES_DIR.is_dir():
        return len(registry)
    cached = {
        p.stem for p in GUIDELINES_DIR.iterdir() if p.suffix in {".json", ".md"}
    }
    return sum(1 for name, _ in registry if name not in cached)


def parse_sap_keys(code_js_text: str) -> Counter:
    """Extract SAP_KEYS object keys and return a Counter (for duplicate detection)."""
    m = re.search(r"const SAP_KEYS\s*=\s*\{(.+?)^\};", code_js_text, re.DOTALL | re.MULTILINE)
    if not m:
        return Counter()
    body = m.group(1)
    keys = re.findall(r"^\s*['\"]?([A-Za-z][A-Za-z0-9_]+)['\"]?\s*:", body, re.MULTILINE)
    return Counter(keys)


def parse_mandatory_tokens_count(code_js_text: str) -> int:
    m = re.search(
        r"const MANDATORY_TOKENS\s*=\s*\{(.+?)^\};",
        code_js_text,
        re.DOTALL | re.MULTILINE,
    )
    if not m:
        return 0
    body = m.group(1)
    keys = re.findall(r"^\s*['\"]?([a-zA-Z_][a-zA-Z0-9_]+)['\"]?\s*:", body, re.MULTILINE)
    return len(keys)


def count_guidelines():
    if not GUIDELINES_DIR.is_dir():
        return 0
    return sum(
        1
        for p in GUIDELINES_DIR.iterdir()
        if p.suffix in {".json", ".md"} and p.stem != "_schema"
    )


def fmt_pct(part, total):
    if total == 0:
        return "n/a"
    return f"{100.0 * part / total:.1f}%"


def main() -> int:
    registry = load_registry()
    registry_count = len(registry)
    compact_count = count_compact_schemas(registry)
    enriched_count = registry_count - compact_count
    missing_guideline_count = count_missing_guidelines(registry)
    guidelines_count = count_guidelines()

    if CODE_JS.is_file():
        code_js_text = CODE_JS.read_text(encoding="utf-8")
        sap_keys = parse_sap_keys(code_js_text)
        duplicate_sap_keys = sum(v for v in sap_keys.values() if v > 1) - len(
            [k for k, v in sap_keys.items() if v > 1]
        )
        mandatory_tokens = parse_mandatory_tokens_count(code_js_text)
    else:
        duplicate_sap_keys = -1  # sentinel — file missing
        mandatory_tokens = -1

    # ─────────────────────────────────────────────────────────────────────────
    # Print report
    # ─────────────────────────────────────────────────────────────────────────
    print()
    print("─" * 62)
    print("Registry audit report (Wave D · D3)")
    print("─" * 62)
    print(f"  Registry entries                    : {registry_count}")
    print(
        f"  Enriched (full schema)              : "
        f"{enriched_count:3d}  ({fmt_pct(enriched_count, registry_count)})"
    )
    print(
        f"  Compact schema (missing fields)     : "
        f"{compact_count:3d}  ({fmt_pct(compact_count, registry_count)})"
    )
    print(f"  Guideline cache files               : {guidelines_count}")
    print(
        f"  Missing guideline JSONs             : "
        f"{missing_guideline_count:3d}  ({fmt_pct(missing_guideline_count, registry_count)})"
    )
    if mandatory_tokens >= 0:
        print(f"  MANDATORY_TOKENS whitelist          : {mandatory_tokens} tokens")
    if duplicate_sap_keys >= 0:
        marker = "✓" if duplicate_sap_keys == 0 else "⚠"
        print(f"  SAP_KEYS duplicates                 : {duplicate_sap_keys}  {marker}")
    print("─" * 62)

    # Highlight next-action items
    todos = []
    if compact_count:
        todos.append(f"Enrich {compact_count} compact-schema entries (Wave D · D1)")
    if missing_guideline_count:
        todos.append(
            f"Backfill {missing_guideline_count} missing guideline JSONs (Wave D · D2)"
        )
    if duplicate_sap_keys > 0:
        todos.append(f"Dedupe {duplicate_sap_keys} SAP_KEYS entries")
    if todos:
        print("  Follow-up:")
        for t in todos:
            print(f"    • {t}")
        print("─" * 62)

    return 0  # audit never fails the build — informational only


if __name__ == "__main__":
    sys.exit(main())
