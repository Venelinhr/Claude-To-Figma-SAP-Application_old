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
if (hardFail > 0) { fail('DRIFT: component-key or token-hex mismatch — regenerate SAP_BUILD_MANIFEST.md §3/§4 + code.js MANDATORY_TOKENS from source.'); process.exit(1); }
ok('manifest in sync with registry + token sources');
process.exit(0);
