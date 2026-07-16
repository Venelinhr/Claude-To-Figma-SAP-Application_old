#!/usr/bin/env node
/**
 * validate-spec.js — CLI headless spec validator
 * Usage: node build/validate-spec.js <path-to-spec.json>
 *        node build/validate-spec.js output/warehouse-shipments-worklist-spec.json
 *
 * Runs all 4 validation layers without opening Figma:
 *   1. JSON parse
 *   2. Registry gate (every component must exist in knowledge/components/registry/)
 *   3. Composition rules (validParents, topLevelOnly, validChildren, mustExclude)
 *   4. Slot-name validation (every slot key must be declared in registry.slotNames[])
 *   5. Token whitelist (every sap* token reference in tokensUsed must be whitelisted)
 *   6. Raw hex check (no #hex values in spec body)
 *   7. ShellBar first check
 *   8. Density check
 *
 * Exit code 0 = pass, 1 = fail
 *
 * Added: 2026-07-09 as part of Tier 2 improvements
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const REGISTRY_DIR = path.join(PROJECT_ROOT, 'knowledge', 'components', 'registry');
const CODE_JS = path.join(PROJECT_ROOT, 'plugin', 'figma-builder', 'code.js');

// Plugin-internal component names — valid in specs but live in NATIVE_RENDERERS
// not in the user-facing registry. Skip registry gate for these.
const PLUGIN_INTERNAL = new Set([
  'NativeSideNav', 'NativeBreadcrumb', 'NativeTabBar', 'NativeHorizontalSplit',
  'ArtifactRow', 'ArtifactColHeader', 'DropdownItem', 'PackageHeader',
  'FigmaPageHeader', 'FigmaToolbar', 'FigmaTableHeader', 'FigmaTableRow',
  'FigmaResponsiveTable', 'Ref79PageHeader', 'Ref79Toolbar', 'Ref79ColHeader',
  'Ref79TableRow', 'SapColHeader', 'SapTableRow', 'SapFormSection',
]);

// ─── Load registry ──────────────────────────────────────────────────────────
function loadRegistry() {
  const reg = {};
  for (const f of fs.readdirSync(REGISTRY_DIR)) {
    if (!f.endsWith('.json') || f === '_schema.json') continue;
    try {
      reg[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(REGISTRY_DIR, f), 'utf8'));
    } catch(e) {
      console.error(`  ✗ Invalid JSON in registry/${f}: ${e.message}`);
    }
  }
  return reg;
}

// ─── Load MANDATORY_TOKENS from code.js ──────────────────────────────────────
function loadAllowedTokens() {
  const code = fs.readFileSync(CODE_JS, 'utf8');
  const m = code.match(/const MANDATORY_TOKENS\s*=\s*\{([\s\S]+?)^\};/m);
  if (!m) return new Set();
  const keys = [...m[1].matchAll(/^\s*['"]?([a-zA-Z_][a-zA-Z0-9_]+)['"]?\s*:/gm)];
  return new Set(keys.map(k => k[1]));
}

// ─── Collect all component pairs (comp, parent) ───────────────────────────
function collectPairs(nodes, parent, acc) {
  for (const n of (Array.isArray(nodes) ? nodes : (nodes ? [nodes] : []))) {
    if (!n || typeof n !== 'object' || !n.component) continue;
    acc.push({ comp: n.component, parent });
    if (n.slots) {
      for (const [slotName, slotVal] of Object.entries(n.slots)) {
        const children = Array.isArray(slotVal) ? slotVal : (slotVal ? [slotVal] : []);
        for (const child of children) {
          if (child && typeof child === 'object' && child.component) {
            acc.push({ comp: child.component, parent: n.component, slotName });
          }
          collectPairs(child, n.component, acc);
        }
      }
    }
    collectPairs(n.children, n.component, acc);
  }
}

// ─── Collect slot-name violations ────────────────────────────────────────
function collectSlotViolations(nodes, reg, acc) {
  for (const n of (Array.isArray(nodes) ? nodes : (nodes ? [nodes] : []))) {
    if (!n || typeof n !== 'object' || !n.component) continue;
    const entry = reg[n.component] || {};
    const declared = entry.slotNames;
    if (n.slots) {
      for (const [slotName, slotVal] of Object.entries(n.slots)) {
        if (declared && declared.length > 0 && !declared.includes(slotName)) {
          acc.push(`${n.component}.slots["${slotName}"] — not declared. Valid: ${declared.join(', ')}`);
        }
        collectSlotViolations(slotVal, reg, acc);
      }
    }
    collectSlotViolations(n.children, reg, acc);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────
function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error('Usage: node build/validate-spec.js <path-to-spec.json>');
    process.exit(1);
  }

  const absPath = path.resolve(specPath);
  console.log(`\nValidating: ${path.relative(PROJECT_ROOT, absPath)}\n${'─'.repeat(60)}`);

  // 1. JSON parse
  let spec;
  try {
    spec = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch(e) {
    console.error(`  ✗ JSON parse error: ${e.message}`);
    process.exit(1);
  }
  console.log(`  ✓ JSON valid`);

  const reg = loadRegistry();
  const allowedTokens = loadAllowedTokens();
  const errors = [];
  const warnings = [];

  // 1b. $schema envelope (P-013)
  if (!spec.$schema) {
    errors.push(`Missing required field: $schema (canonical: "https://sap-fiori-ai-designer/spec-schema.json")`);
  } else {
    console.log(`  ✓ $schema envelope present`);
  }

  // 1c. Required meta fields (P-014 added rationale check)
  const requiredMetaFields = ['requirement', 'rationale', 'floorplan', 'validationStatus'];
  const missingMeta = requiredMetaFields.filter(f => !spec.meta || !spec.meta[f]);
  if (missingMeta.length > 0) {
    for (const f of missingMeta) errors.push(`Missing meta field: meta.${f}`);
  } else {
    console.log(`  ✓ Required meta fields present (${requiredMetaFields.join(', ')})`);
  }

  // 2. Registry gate
  const pairs = [];
  collectPairs(spec.hierarchy, null, pairs);
  const usedComponents = [...new Set(pairs.map(p => p.comp))];
  const missing = usedComponents.filter(c => !reg[c] && !PLUGIN_INTERNAL.has(c));
  if (missing.length > 0) {
    for (const c of missing) errors.push(`Registry gate: "${c}" not found in registry`);
  } else {
    console.log(`  ✓ Registry gate: ${usedComponents.length} distinct components, all registered`);
  }

  // 3. Composition rules
  const compViols = [];
  for (const { comp, parent, slotName } of pairs) {
    if (!parent) continue;
    const entry = reg[comp] || {};
    const rule = entry.composition || {};
    const vp = rule.validParents || [];
    const tlo = rule.topLevelOnly === true;
    if (vp.length > 0 && !vp.includes('*') && !vp.includes(parent)) {
      compViols.push(`${comp} cannot be inside ${parent}. Valid parents: ${vp.slice(0,5).join(', ')}${vp.length>5?'...':''}`);
    } else if (tlo && vp.length === 0 && parent) {
      compViols.push(`${comp} (topLevelOnly) cannot be inside ${parent}`);
    }
    // mustExclude check on parent
    const parentRule = (reg[parent] || {}).composition || {};
    if (Array.isArray(parentRule.mustExclude) && parentRule.mustExclude.includes(comp)) {
      compViols.push(`${parent} must NOT contain ${comp} (mustExclude)`);
    }
  }
  if (compViols.length > 0) {
    for (const v of compViols) errors.push(`Composition: ${v}`);
  } else {
    console.log(`  ✓ Composition rules: 0 violations`);
  }

  // 4. Slot-name validation
  const slotViols = [];
  collectSlotViolations(spec.hierarchy, reg, slotViols);
  if (slotViols.length > 0) {
    for (const v of slotViols) errors.push(`Slot names: ${v}`);
  } else {
    console.log(`  ✓ Slot names: 0 violations`);
  }

  // 5. Token whitelist
  const tokensUsed = (spec.meta?.decisions?.tokensUsed || '')
    .match(/sap[A-Za-z_][A-Za-z0-9_]+/g) || [];
  const tokenMissing = [...new Set(tokensUsed)].filter(t => !allowedTokens.has(t));
  if (tokenMissing.length > 0) {
    for (const t of tokenMissing) errors.push(`Token not whitelisted: "${t}"`);
  } else if (tokensUsed.length > 0) {
    console.log(`  ✓ Token whitelist: ${new Set(tokensUsed).size} referenced tokens, all whitelisted`);
  }

  // 6. Raw hex check
  const specBody = JSON.stringify(spec.hierarchy);
  const hexMatches = specBody.match(/"#[0-9A-Fa-f]{3,6}"/g);
  if (hexMatches) {
    errors.push(`Raw hex values found: ${[...new Set(hexMatches)].join(', ')}`);
  } else {
    console.log(`  ✓ No raw hex values`);
  }

  // 7. ShellBar first
  const firstComp = spec.hierarchy?.[0]?.component;
  if (firstComp && firstComp !== 'ShellBar') {
    warnings.push(`First hierarchy component is "${firstComp}", not "ShellBar"`);
  } else if (firstComp === 'ShellBar') {
    console.log(`  ✓ ShellBar is first`);
  }

  // 8. Density
  const density = spec.screen?.density;
  if (density && density !== 'compact') {
    warnings.push(`Density is "${density}" — back-office screens should use "compact"`);
  } else if (density === 'compact') {
    console.log(`  ✓ Density: compact`);
  }

  // 9. validationStatus
  const vs = spec.meta?.validationStatus;
  if (vs === 'pass') {
    console.log(`  ✓ validationStatus: pass`);
  } else {
    warnings.push(`validationStatus is "${vs}" — should be "pass" before presenting`);
  }

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log(`✅ PASS — ${path.basename(absPath)}\n   ${usedComponents.length} distinct components · ${pairs.length} total instances`);
    process.exit(0);
  }
  if (errors.length === 0) {
    console.log(`⚠️  PASS WITH WARNINGS — ${path.basename(absPath)}`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
    process.exit(0);
  }
  console.log(`❌ FAIL — ${path.basename(absPath)}`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  if (warnings.length > 0) {
    console.log(`Warnings:`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }
  process.exit(1);
}

main();
