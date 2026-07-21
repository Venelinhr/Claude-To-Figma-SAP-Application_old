#!/usr/bin/env node
/**
 * check-manifest-sync.js — read-only drift checker for SAP_BUILD_MANIFEST.md
 *
 * The manifest is a DERIVED cache of two sources of truth:
 *   - knowledge/components/registry/<Component>.json  (figmaComponentId)
 *   - knowledge/guidelines/horizon-variable-keys.json (token hex)
 *
 * This checker re-reads those sources and diffs them against the manifest's
 * §3 (component keys) and §4 (token hexes).
 *
 *   - A §3 figmaComponentId mismatch is a HARD FAIL (exit 1) — a stale key
 *     breaks importComponentSetByKeyAsync at build time.
 *   - A §4 hex mismatch is a WARNING only — the plugin binds the variable by
 *     NAME at Bind time, so a stale hex is cosmetic (RGB-match hint only).
 *
 * Usage:  node build/check-manifest-sync.js
 * Exit:   0 = in sync (warnings allowed) · 1 = component-key drift
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'SAP_BUILD_MANIFEST.md');
const REGISTRY = path.join(ROOT, 'knowledge', 'components', 'registry');
const TOKENS = path.join(ROOT, 'knowledge', 'guidelines', 'horizon-variable-keys.json');

function fail(msg) { console.error('✗ ' + msg); }
function warn(msg) { console.warn('⚠ ' + msg); }
function ok(msg)   { console.log('✓ ' + msg); }

if (!fs.existsSync(MANIFEST)) { fail('SAP_BUILD_MANIFEST.md not found at ' + MANIFEST); process.exit(1); }
const md = fs.readFileSync(MANIFEST, 'utf8');

let hardFail = 0, warnCount = 0, checked = 0;

// ── §3 component keys ────────────────────────────────────────────────
// Rows look like:  | Button | `91805fa1...` | note |
// 40-char hex keys only (skip alias:/native:/empty).
const compRe = /^\|\s*([A-Za-z][A-Za-z0-9]+)\s*\|\s*`([0-9a-f]{40})`\s*\|/gm;
let m;
while ((m = compRe.exec(md)) !== null) {
  const [, comp, manifestKey] = m;
  const regFile = path.join(REGISTRY, comp + '.json');
  if (!fs.existsSync(regFile)) { warn(`§3 ${comp}: no registry/${comp}.json (curated/alias — skipped)`); continue; }
  let reg;
  try { reg = JSON.parse(fs.readFileSync(regFile, 'utf8')); }
  catch (e) { fail(`§3 ${comp}: registry JSON unparseable — ${e.message}`); hardFail++; continue; }
  const regKey = reg.figmaComponentId || '';
  checked++;
  if (regKey !== manifestKey) {
    fail(`§3 ${comp}: manifest key ${manifestKey.slice(0,10)}… ≠ registry ${(regKey||'(empty)').slice(0,10)}…`);
    hardFail++;
  }
}

// ── §4 token hexes ───────────────────────────────────────────────────
// Rows look like:  | sapBackgroundColor | `#F5F6F7` | use |
const tok = JSON.parse(fs.readFileSync(TOKENS, 'utf8')).tokens || {};
const tokRe = /^\|\s*(sap[A-Za-z0-9_]+)\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|/gm;
while ((m = tokRe.exec(md)) !== null) {
  const [, name, manifestHex] = m;
  const src = tok[name];
  if (!src || typeof src !== 'object') { warn(`§4 ${name}: not in horizon-variable-keys.json (curated alt — skipped)`); continue; }
  checked++;
  const srcHex = (src.hex || '').toUpperCase();
  if (srcHex && srcHex !== manifestHex.toUpperCase()) {
    warn(`§4 ${name}: manifest ${manifestHex} ≠ source ${srcHex} (cosmetic — plugin binds by name)`);
    warnCount++;
  }
}

// ── SYSTEM_PROMPT RULE 25 hex table cross-check ─────────────────────
// (added 2026-07-21 — audit fix #2). RULE 25 carries a SECOND hex table that
// agents are told to copy verbatim ("use ONLY the exact hex"). It was never
// diffed against source, so sapPositiveTextColor/sapCriticalTextColor forked to
// wrong greens/oranges invisibly. Diff every RULE 25 row token against the same
// horizon source. Rows are 3-col: | label | `sapToken` | `#HEX` |. A token not
// in source is skipped (curated alt); a present token with a different hex is a
// HARD FAIL (it produces a wrong-but-close fill on fallback / a bind mismatch).
const SYS_PROMPT = path.join(ROOT, 'skill', 'SYSTEM_PROMPT.md');
if (fs.existsSync(SYS_PROMPT)) {
  const sp = fs.readFileSync(SYS_PROMPT, 'utf8');
  const spRe = /^\|[^|]*\|\s*`(sap[A-Za-z0-9_]+)`\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|/gm;
  let sm; const seen = new Set();
  while ((sm = spRe.exec(sp)) !== null) {
    const [, name, spHex] = sm;
    if (seen.has(name + spHex)) continue; seen.add(name + spHex);
    const src = tok[name];
    if (!src || typeof src !== 'object') continue; // curated alt / not in source
    const srcHex = (src.hex || '').toUpperCase();
    if (srcHex && srcHex !== spHex.toUpperCase()) {
      fail(`RULE25 ${name}: SYSTEM_PROMPT ${spHex} ≠ source ${srcHex} — RULE 25 mandates the exact source hex; fix skill/SYSTEM_PROMPT.md.`);
      hardFail++;
    }
    checked++;
  }
}

// ── code.js leg ──────────────────────────────────────────────────────
// The plugin runtime reads SAP_KEYS + MANDATORY_TOKENS from code.js. A stale
// SAP_KEYS entry there hard-breaks importComponentSetByKeyAsync at build time,
// so diff it against the registry source. Hex drift in MANDATORY_TOKENS is
// cosmetic (binding is by name) → warn only.
const CODE_JS = path.join(ROOT, 'plugin', 'figma-builder', 'code.js');
if (fs.existsSync(CODE_JS)) {
  const code = fs.readFileSync(CODE_JS, 'utf8');

  // Parse SAP_KEYS { Name: '40-hex', ... } — only 40-char hex values (skip alias:/native:)
  const sapKeysBlock = code.match(/const SAP_KEYS\s*=\s*\{([\s\S]*?)\n\};/);
  if (sapKeysBlock) {
    const keyRe = /(\w+):\s*'([0-9a-f]{40})'/g;
    let km;
    while ((km = keyRe.exec(sapKeysBlock[1])) !== null) {
      const [, comp, codeKey] = km;
      const regFile = path.join(REGISTRY, comp + '.json');
      if (!fs.existsSync(regFile)) continue; // curated/kit-only name — skip
      let reg;
      try { reg = JSON.parse(fs.readFileSync(regFile, 'utf8')); } catch (e) { continue; }
      const regKey = reg.figmaComponentId || '';
      if (regKey.length === 40 && regKey !== codeKey) {
        fail(`code.js SAP_KEYS ${comp}: ${codeKey.slice(0,10)}… ≠ registry ${regKey.slice(0,10)}… — will break importComponentSetByKeyAsync`);
        hardFail++;
      }
      checked++;
    }
  }

  // Parse MANDATORY_TOKENS hex — HARD FAIL on drift (F6 fix 2026-07-18).
  // Previously warn-only ("plugin binds by name"), but the hex is what the plugin's RGB→token
  // reverse-lookup matches against, and a drifted hex is exactly how the sapList_TextColor
  // contradiction (#1D2D3E vs #131E29) slipped in. The source (horizon-variable-keys.json) is
  // authoritative; code.js MANDATORY_TOKENS must match it. Divergence now fails the build.
  const mtBlock = code.match(/const MANDATORY_TOKENS\s*=\s*\{([\s\S]*?)\n\};/);
  if (mtBlock) {
    const tRe = /'(sap[A-Za-z0-9_]+)':\s*\{[^}]*hex:\s*'(#[0-9A-Fa-f]{6})'/g;
    let tm;
    while ((tm = tRe.exec(mtBlock[1])) !== null) {
      const [, name, codeHex] = tm;
      const src = tok[name];
      if (!src || typeof src !== 'object' || !src.hex) continue;
      if (src.hex.toUpperCase() !== codeHex.toUpperCase()) {
        fail(`code.js MANDATORY_TOKENS ${name}: ${codeHex} ≠ source ${src.hex} — token hex drift (regenerate from horizon-variable-keys.json)`);
        hardFail++;
      }
      checked++;
    }
  }
}

console.log(`\n── manifest sync: ${checked} entries checked, ${hardFail} hard fail(s), ${warnCount} warning(s) ──`);

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT-VALUE GUARD (added 2026-07-21 — audit fix #1). The registry stores
// live Figma Web UI Kit variant values, NOT UI5 API vocabulary. UI5 tokens like
// "Emphasized"/"Transparent"/"Ghost"/"Default"/"Negative" are NOT valid kit
// variant values — setProperties() throws on them, silently producing non-SAP
// output. This scans EVERY registry component's supportedVariants and hard-fails
// on any forbidden UI5 token, so the Button.json-style drift cannot recur across
// the ~42 files that carry ui5Property variant lists. A component that genuinely
// needs one of these words can whitelist it via "figmaNote" containing
// "kit-verified:<Value>".
const FORBIDDEN_KIT_VARIANTS = ['Emphasized', 'Transparent', 'Ghost', 'Unstyled'];
let variantChecked = 0;
try {
  for (const f of fs.readdirSync(REGISTRY)) {
    if (!f.endsWith('.json')) continue;
    let reg; try { reg = JSON.parse(fs.readFileSync(path.join(REGISTRY, f), 'utf8')); } catch { continue; }
    const variants = Array.isArray(reg.supportedVariants) ? reg.supportedVariants : [];
    for (const v of variants) {
      const note = (v.figmaNote || '') + '';
      const vals = Array.isArray(v.values) ? v.values : [];
      for (const bad of FORBIDDEN_KIT_VARIANTS) {
        if (vals.includes(bad) && !note.includes('kit-verified:' + bad)) {
          fail(`variant ${f} · ${v.property}: "${bad}" is UI5 vocabulary, not a live-kit variant value — setProperties will throw. Replace with the kit value (see Button.json figmaNote) or add "kit-verified:${bad}" to figmaNote if genuinely present in the kit.`);
          hardFail++;
        }
      }
      variantChecked++;
    }
  }
  ok(`variant guard: ${variantChecked} variant group(s) scanned across registry`);
} catch (e) { warn(`variant guard skipped: ${e.message}`); }

// ─────────────────────────────────────────────────────────────────────────────
// MCP-MAPPING VOCAB GUARD (added 2026-07-21 — audit fix C3). The registry variant
// guard above scans only registry/*.json, but the application-analysis MCP's
// region→component mapping (region-patterns.js) also tells the agent which Button
// Type to use. It was emitting UI5 vocab (type="Emphasized"/"Transparent"/
// "Negative") that the registry now forbids — regenerating the exact drift from an
// unguarded upstream source. Scan any `type="..."` / `Type="..."` string in the MCP
// mapping files for the forbidden UI5 Button vocabulary.
const MCP_VOCAB_FILES = [
  path.join(ROOT, 'mcp-servers', 'application-analysis', 'region-patterns.js'),
];
const FORBIDDEN_BUTTON_VOCAB = ['Emphasized', 'Transparent', 'Ghost', 'Negative', 'Default'];
let mcpScanned = 0;
for (const file of MCP_VOCAB_FILES) {
  if (!fs.existsSync(file)) continue;
  const txt = fs.readFileSync(file, 'utf8');
  mcpScanned++;
  const typeRe = /\b[Tt]ype\s*=\s*["']([A-Za-z]+)["']/g;
  let tm;
  while ((tm = typeRe.exec(txt)) !== null) {
    if (FORBIDDEN_BUTTON_VOCAB.includes(tm[1])) {
      fail(`MCP vocab ${path.basename(file)}: type="${tm[1]}" is UI5 Button vocabulary, not a live-kit Type value — the mapping would feed the agent a value that setProperties rejects. Use kit Type (Primary/Secondary/Accept/Reject/Attention/Tertiary).`);
      hardFail++;
    }
  }
}
if (mcpScanned) ok(`MCP-mapping vocab guard: ${mcpScanned} mapping file(s) scanned`);

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY CROSS-CHECK (added 2026-07-21 — audit fix H4). SAP_BUILD_MANIFEST §5
// is the typo-size authority (verify-invariants.js enforces it ±1px). But
// knowledge/guidelines/typography-hierarchy.md carried its own sizes that drifted
// (toolbarTitle 15 vs 16, tableHeader 14 vs 13), misleading any human reader.
// Diff every role that BOTH files define; hard-fail on a size mismatch.
const TYPO_DOC = path.join(ROOT, 'knowledge', 'guidelines', 'typography-hierarchy.md');
if (fs.existsSync(TYPO_DOC)) {
  // Parse manifest §5 rows:  | role | size | weight |
  const manifestTypo = {};
  const mtRe = /^\|\s*([a-zA-Z]+)\s*\|\s*(\d{1,2})\s*\|/gm;
  let mt; while ((mt = mtRe.exec(md)) !== null) {
    const role = mt[1].toLowerCase(); const sz = parseInt(mt[2], 10);
    // only capture plausible typo roles (size 8–40) to avoid matching other tables
    if (sz >= 8 && sz <= 40 && !(role in manifestTypo)) manifestTypo[role] = sz;
  }
  const doc = fs.readFileSync(TYPO_DOC, 'utf8');
  // Parse doc rows:  | `role` | 72 | weight | 16px | ...
  const dtRe = /^\|\s*`([a-zA-Z]+)`\s*\|[^|]*\|[^|]*\|\s*(\d{1,2})px\s*\|/gm;
  let dt, typoChecked = 0;
  while ((dt = dtRe.exec(doc)) !== null) {
    const role = dt[1].toLowerCase(); const docSz = parseInt(dt[2], 10);
    if (role in manifestTypo) {
      typoChecked++;
      if (manifestTypo[role] !== docSz) {
        fail(`typography ${role}: typography-hierarchy.md says ${docSz}px but SAP_BUILD_MANIFEST §5 (the enforced authority) says ${manifestTypo[role]}px — conform the doc to the manifest.`);
        hardFail++;
      }
    }
  }
  ok(`typography cross-check: ${typoChecked} shared role(s) diffed against manifest §5`);
}

if (hardFail > 0) { fail('DRIFT: component-key / token-hex / variant-value / typography mismatch — regenerate SAP_BUILD_MANIFEST.md §3/§4/§5 + code.js MANDATORY_TOKENS from source.'); process.exit(1); }
ok('manifest in sync with registry + token sources');
process.exit(0);
