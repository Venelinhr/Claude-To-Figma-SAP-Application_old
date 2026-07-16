#!/usr/bin/env node
/**
 * build-registry-bundle.js
 *
 * Reads knowledge/components/registry/*.json and produces TWO outputs:
 *
 *   1. registry-bundle.js  — standalone bundle (for inspection/debug)
 *   2. code.bundled.js     — registry-bundle.js + code.js + override shim
 *                            This is what manifest.json should point to.
 *
 * The override shim merges SAP_KEYS_FROM_REGISTRY over the hardcoded SAP_KEYS
 * at runtime, so:
 *   - Registry edits → re-run this script → no code.js changes needed
 *   - Bundle missing/corrupt → falls back to hardcoded SAP_KEYS (no regression)
 *
 * Usage:
 *   node build-registry-bundle.js
 *
 * After running:
 *   - Update manifest.json "main": "code.bundled.js" (one-time)
 *   - Re-import plugin in Figma to pick up changes
 */

const { readFileSync, readdirSync, writeFileSync, existsSync } = require('node:fs');
const { join, resolve } = require('node:path');

const REGISTRY_DIR = resolve(__dirname, '..', 'knowledge', 'components', 'registry');
const PLUGIN_DIR   = resolve(__dirname, '..', 'plugin', 'figma-builder');
const BUNDLE_FILE  = resolve(PLUGIN_DIR, 'registry-bundle.js');
const SOURCE_FILE  = resolve(PLUGIN_DIR, 'code.js');
const OUTPUT_FILE  = resolve(PLUGIN_DIR, 'code.bundled.js');

// ────────────────────────────────────────────────────────────────────────────
// 1. LOAD REGISTRY
// ────────────────────────────────────────────────────────────────────────────

console.log(`Loading registry from ${REGISTRY_DIR}`);

const files = readdirSync(REGISTRY_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))
  .sort();

if (files.length === 0) {
  console.error('No registry files found. Aborting.');
  process.exit(1);
}

const registry = {};
let missingKeys = 0;
let validatedTokens = new Set();

for (const file of files) {
  const path = join(REGISTRY_DIR, file);
  let entry;
  try {
    entry = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.error(`  ✗ ${file}: parse error — ${e.message}`);
    process.exit(2);
  }

  const name = entry.componentName;
  if (!name) {
    console.error(`  ✗ ${file}: missing componentName`);
    process.exit(2);
  }
  if (!entry.figmaComponentId) {
    missingKeys++;
  }

  if (Array.isArray(entry.colorTokenRules)) {
    entry.colorTokenRules.forEach(r => {
      if (r.token) validatedTokens.add(r.token);
    });
  }

  // Bundle MINIMAL data — only fields the plugin runtime actually reads.
  // Audit 2026-06-26 confirmed that code.js consumes ZERO fields from SAP_REGISTRY
  // beyond figmaComponentId (via the override shim). All other documentation
  // fields (colorTokenRules, supportedVariants, accessibilityRules, etc.) are
  // pure registry docs — kept on disk but stripped from the bundle. This drops
  // the bundle size by ~70% (from ~120KB to ~3KB) and forces honest claims:
  // anything in the bundle IS read at runtime.
  //
  // For human inspection of the full registry data, see knowledge/components/registry/*.json
  // (always the source of truth) or registry-bundle-full.json (auto-generated below).
  const bundled = {
    componentName: entry.componentName,
    figmaComponentId: entry.figmaComponentId,
  };
  // Bundle composition rules when present — the plugin's CompositionValidator
  // reads these at build time to validate parent/child relationships.
  if (entry.composition) {
    bundled.composition = entry.composition;
  }
  registry[name] = bundled;
}

console.log(`  Loaded ${files.length} components.`);
if (missingKeys > 0) {
  console.log(`  ⚠ ${missingKeys} components missing figmaComponentId (nested/layout-wrapper).`);
}

// ────────────────────────────────────────────────────────────────────────────
// 2. DERIVE SAP_KEYS_FROM_REGISTRY
// ────────────────────────────────────────────────────────────────────────────

const sapKeys = {};
for (const name in registry) {
  const id = registry[name].figmaComponentId;
  if (id) sapKeys[name] = id;
}

console.log(`  ${Object.keys(sapKeys).length} components have figmaComponentId.`);
console.log(`  ${validatedTokens.size} unique tokens referenced.`);

// ────────────────────────────────────────────────────────────────────────────
// 3. WRITE registry-bundle.js (standalone, for inspection)
// ────────────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

// Load horizon variable keys from knowledge/guidelines/horizon-variable-keys.json
// These are baked into the bundle as HORIZON_VARIABLE_KEYS for the fallback path in getVariable().
let horizonVarKeys = {};
try {
  const hvkPath = resolve(__dirname, '..', 'knowledge', 'guidelines', 'horizon-variable-keys.json');
  const hvkData = JSON.parse(readFileSync(hvkPath, 'utf8'));
  // Flatten: token short name + figmaName tail → key (skip comment entries)
  for (const [name, entry] of Object.entries(hvkData.tokens || {})) {
    if (typeof entry !== 'object' || !entry.key) continue;
    horizonVarKeys[name] = { key: entry.key };
    // Also add by lowercase tail of figmaName (e.g. "Shell/sapShellColor" → "sapshellcolor")
    if (entry.figmaName) {
      const tail = entry.figmaName.split('/').pop().toLowerCase();
      if (!horizonVarKeys[tail]) horizonVarKeys[tail] = { key: entry.key };
    }
  }
  console.log(`  ${Object.keys(horizonVarKeys).length} Horizon variable keys baked into bundle.`);
} catch (e) {
  console.warn('  ⚠ Could not load horizon-variable-keys.json: ' + e.message);
}

const bundleContent = `// AUTO-GENERATED by build/build-registry-bundle.js — do not edit by hand.
// Source: knowledge/components/registry/*.json (${files.length} files)
// Generated: ${today}
// To regenerate: cd build && node build-registry-bundle.js

const SAP_REGISTRY = ${JSON.stringify(registry, null, 2)};

const SAP_KEYS_FROM_REGISTRY = ${JSON.stringify(sapKeys, null, 2)};

const SAP_REGISTRY_VERSION = ${JSON.stringify(today)};

// Horizon variable keys harvested from SAP Web UI Kit (knowledge/guidelines/horizon-variable-keys.json)
// Used as fallback in getVariable() when library name-based lookup fails.
const HORIZON_VARIABLE_KEYS = ${JSON.stringify(horizonVarKeys, null, 2)};
`;

writeFileSync(BUNDLE_FILE, bundleContent);
console.log(`✓ Wrote ${BUNDLE_FILE}`);

// Also write the FULL registry as a separate inspection-only JSON file.
// Plugin does not read this file — it's purely a human reference of every
// field in every registry entry, useful for the documentation site and for
// debugging without trawling 53 individual .json files.
const fullRegistry = {};
for (const file of files) {
  const path = join(REGISTRY_DIR, file);
  try {
    const entry = JSON.parse(readFileSync(path, 'utf8'));
    fullRegistry[entry.componentName] = entry;
  } catch (e) { /* skip */ }
}
const FULL_BUNDLE_FILE = resolve(PLUGIN_DIR, 'registry-bundle-full.json');
writeFileSync(FULL_BUNDLE_FILE, JSON.stringify({
  generatedAt: today,
  componentCount: Object.keys(fullRegistry).length,
  components: fullRegistry,
}, null, 2));
const fullKb = (JSON.stringify(fullRegistry).length / 1024).toFixed(1);
console.log(`✓ Wrote ${FULL_BUNDLE_FILE} (${fullKb}KB · human-readable, not loaded by plugin)`);

// ────────────────────────────────────────────────────────────────────────────
// 4. WRITE code.bundled.js (bundle + code.js + override shim)
// ────────────────────────────────────────────────────────────────────────────

if (!existsSync(SOURCE_FILE)) {
  console.error(`Source ${SOURCE_FILE} not found. Aborting bundled output.`);
  process.exit(3);
}

const sourceCode = readFileSync(SOURCE_FILE, 'utf8');

const overrideShim = `

// ────────────────────────────────────────────────────────────────────────────
// REGISTRY OVERRIDE SHIM (injected by build-registry-bundle.js)
// Merges SAP_KEYS_FROM_REGISTRY over the hardcoded SAP_KEYS map below.
// If you edited a registry JSON and re-ran the build script, the new value
// wins. If you reverted code.js to hardcoded values, those still work as
// fallback for anything not in the registry.
// ────────────────────────────────────────────────────────────────────────────
try {
  if (typeof SAP_KEYS_FROM_REGISTRY === 'object' && SAP_KEYS_FROM_REGISTRY) {
    for (var __regName in SAP_KEYS_FROM_REGISTRY) {
      if (SAP_KEYS_FROM_REGISTRY[__regName]) {
        SAP_KEYS[__regName] = SAP_KEYS_FROM_REGISTRY[__regName];
      }
    }
    if (typeof console !== 'undefined' && console.log) {
      console.log('[SAP Plugin] Registry bundle loaded — ' +
        Object.keys(SAP_KEYS_FROM_REGISTRY).length + ' keys override hardcoded SAP_KEYS. ' +
        'Bundle version: ' + SAP_REGISTRY_VERSION);
    }
  }
} catch (e) {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('[SAP Plugin] Registry override shim failed: ' + e.message + ' — using hardcoded SAP_KEYS.');
  }
}
`;

const bundledOutput = bundleContent + '\n\n' + sourceCode + overrideShim;
writeFileSync(OUTPUT_FILE, bundledOutput);

const sizeKb = (bundledOutput.length / 1024).toFixed(1);
console.log(`✓ Wrote ${OUTPUT_FILE} (${sizeKb}KB)`);

// ────────────────────────────────────────────────────────────────────────────
// 5. CHECK MANIFEST POINTS TO BUNDLED FILE
// ────────────────────────────────────────────────────────────────────────────

const manifestPath = resolve(PLUGIN_DIR, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.main !== 'code.bundled.js') {
  console.log(`\n⚠ manifest.json "main" is currently "${manifest.main}".`);
  console.log(`   To use the bundle: update manifest.json "main" to "code.bundled.js"`);
  console.log(`   Then re-import the plugin in Figma.`);
} else {
  console.log(`\n✓ manifest.json already points to code.bundled.js`);
}

console.log(`\nBundle build complete. Re-import plugin in Figma to pick up changes.`);

// ────────────────────────────────────────────────────────────────────────────
// 6. AUTO-RUN CONSISTENCY CHECKER
// Enforces the 3-place component update rule. If a component is in only
// some of the layers (registry / runtime path / validator allow-list), the
// next Validate click in Figma will silently reject it. See
// skill/references/component-update-rule.md
// ────────────────────────────────────────────────────────────────────────────
const { spawnSync } = require('node:child_process');
console.log('\nRunning consistency checker (3-place rule)...');
const check = spawnSync('python3', [resolve(__dirname, 'check-component-consistency.py')],
                        { stdio: 'inherit' });
if (check.status !== 0) {
  console.error('\n❌ Consistency check failed — see output above.');
  console.error('   Bundle is still written but the plugin will reject some components.');
  console.error('   Fix per skill/references/component-update-rule.md, then re-run.');
  process.exit(check.status);
}

// ────────────────────────────────────────────────────────────────────────────
// 7. WAVE D · D3 — REGISTRY AUDIT (informational, never fails the build)
// Emits per-build metrics: registry count, compact-schema count, missing
// guideline count, SAP_KEYS duplicates, MANDATORY_TOKENS whitelist size.
// ────────────────────────────────────────────────────────────────────────────
spawnSync('python3', [resolve(__dirname, 'audit-registry.py')], { stdio: 'inherit' });

// ────────────────────────────────────────────────────────────────────────────
// 8. KNOWLEDGE DATABASE GENERATOR (2026-07-10)
// Regenerates the two cross-component reference files from the registry:
//   - knowledge/guidelines/component-property-reference.json (151 components)
//   - knowledge/guidelines/component-dependency-graph.json   (151 components)
// These files are used by Claude (RULE 24) for live kit resolution without
// reading 153 individual registry files.
// ────────────────────────────────────────────────────────────────────────────
console.log('\nGenerating knowledge database reference files...');
const genRef = spawnSync('node', [resolve(__dirname, 'generate-property-reference.js')],
                         { stdio: 'inherit' });
if (genRef.status !== 0) {
  console.warn('\n⚠ Knowledge database generation failed (non-blocking). Fix generate-property-reference.js.');
}

// ────────────────────────────────────────────────────────────────────────────
// 9. AUTO BUILD-STAMP (2026-07-11)
// Rewrite the <span id="build-stamp"> in ui.html with the current date, code.js
// line count, and short git SHA — so the plugin header ALWAYS shows which
// version is loaded. Runs on every bundle build; never fails the build.
// ────────────────────────────────────────────────────────────────────────────
try {
  const UI_FILE = resolve(PLUGIN_DIR, 'ui.html');
  if (existsSync(UI_FILE)) {
    const d = new Date();
    const date = d.getFullYear() + '-' +
                 String(d.getMonth() + 1).padStart(2, '0') + '-' +
                 String(d.getDate()).padStart(2, '0');
    const loc = readFileSync(SOURCE_FILE, 'utf8').split('\n').length;
    let sha = '';
    try {
      const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: resolve(__dirname, '..') });
      if (r.status === 0) sha = ' · ' + String(r.stdout).trim();
    } catch (e) {}
    const stamp = `build ${date} · ${loc.toLocaleString()} LOC${sha}`;
    let ui = readFileSync(UI_FILE, 'utf8');
    const re = /(<span id="build-stamp"[^>]*>)[\s\S]*?(<\/span>)/;
    if (re.test(ui)) {
      ui = ui.replace(re, `$1${stamp}$2`);
      writeFileSync(UI_FILE, ui);
      console.log(`\nBuild-stamped ui.html → "${stamp}"`);
    } else {
      console.warn('\n⚠ build-stamp span not found in ui.html — header not updated.');
    }
  }
} catch (e) {
  console.warn('\n⚠ Build-stamp step failed (non-blocking): ' + (e && e.message));
}


