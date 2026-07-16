#!/usr/bin/env node
/**
 * lint-mcp-frame.js — headless RULE 25 (MCP-first) contract linter.
 *
 * The counterpart to validate-spec.js for the MCP-first path. It validates a
 * SERIALIZED frame tree (JSON exported from use_figma) against the RULE 25
 * build contract WITHOUT opening Figma — closing the determinism/CI gap that
 * currently blocks retiring the legacy JSON path.
 *
 * Usage:
 *   node build/lint-mcp-frame.js <frame.json>
 *
 * Expected input: JSON produced by serializing an MCP-built frame, e.g. via
 * use_figma:  root.findAll(()=>true) mapped to
 *   { name, type, fillHex, iconName? }  (+ include the root node)
 * A minimal node: { "name": "Save [sapButton_Emphasized_Background] [typo:buttonLabel]",
 *                   "type": "TEXT", "fillHex": "#0070f2" }
 *
 * Checks (RULE 25 contract):
 *   1. Root frame carries ◆SAP-UNBOUND/<name> marker
 *   2. Every [sapToken] tag names a real MANDATORY_TOKENS entry
 *   3. Every tagged fill's hex EXACTLY matches that token's whitelist hex
 *   4. Every [typo:role] names a real SAP_TYPOGRAPHY role
 *   5. Every ◆ICON/<name> names a real ICON_KEYS entry
 *   6. No raw off-whitelist hex on non-instance nodes (would be a bind leak)
 *
 * Exit 0 = pass, 1 = fail. Warnings do not fail.
 *
 * Added 2026-07-11 (audit P1 — headless MCP-path parity).
 */
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CODE_JS = path.join(PROJECT_ROOT, 'plugin', 'figma-builder', 'code.js');

// ── Load MANDATORY_TOKENS name→hex from code.js (single source of truth) ──
function loadTokenHexMap() {
  const code = fs.readFileSync(CODE_JS, 'utf8');
  const start = code.indexOf('const MANDATORY_TOKENS');
  const block = code.slice(start, code.indexOf('\n};', start));
  const re = /['"]([a-zA-Z_][a-zA-Z0-9_]+)['"]\s*:\s*\{[^}]*hex\s*:\s*['"](#[0-9A-Fa-f]{6})['"]/g;
  const map = {};
  let m;
  while ((m = re.exec(block))) map[m[1]] = m[2].toUpperCase();
  return map;
}

// ── Load SAP_TYPOGRAPHY role names from code.js ──
function loadTypoRoles() {
  const code = fs.readFileSync(CODE_JS, 'utf8');
  const start = code.indexOf('const SAP_TYPOGRAPHY');
  const block = code.slice(start, code.indexOf('\n};', start));
  const roles = new Set();
  let m; const re = /['"]?([a-zA-Z][a-zA-Z0-9]+)['"]?\s*:\s*\{/g;
  while ((m = re.exec(block))) roles.add(m[1]);
  return roles;
}

// ── Load ICON_KEYS names from code.js ──
function loadIconNames() {
  const code = fs.readFileSync(CODE_JS, 'utf8');
  const start = code.indexOf('const ICON_KEYS');
  const block = code.slice(start, code.indexOf('\n};', start));
  const names = new Set();
  let m; const re = /['"]([a-z0-9-]+)['"]\s*:\s*\{/g;
  while ((m = re.exec(block))) names.add(m[1]);
  return names;
}

const TOKEN_TAG = /\[(sap[a-zA-Z0-9_]+)\]/;
const TYPO_TAG  = /\[typo:([a-zA-Z][a-zA-Z0-9]*)\]/;
const ICON_PREFIX = '◆ICON/';
const UNBOUND_PREFIX = '◆SAP-UNBOUND/';

function main() {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node build/lint-mcp-frame.js <frame.json>'); process.exit(1); }
  let nodes;
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    nodes = Array.isArray(raw) ? raw : (raw.nodes || []);
  } catch (e) { console.error('✗ Cannot parse ' + file + ': ' + e.message); process.exit(1); }

  const tokenHex = loadTokenHexMap();
  const typoRoles = loadTypoRoles();
  const iconNames = loadIconNames();

  const errors = [];
  const warnings = [];

  // 1. Root marker
  const root = nodes[0];
  if (!root || !(root.name || '').includes(UNBOUND_PREFIX)) {
    warnings.push('Root frame missing ' + UNBOUND_PREFIX + ' marker — plugin scan relies on selection instead.');
  }

  for (const n of nodes) {
    const name = n.name || '';
    const type = n.type || '';
    const hex = (n.fillHex || '').toUpperCase();
    const isInstance = type === 'INSTANCE';

    // 2+3. token tag → real token + exact hex
    const tm = TOKEN_TAG.exec(name);
    if (tm) {
      const tok = tm[1];
      if (!tokenHex[tok]) {
        errors.push(`[${tok}] on "${name.slice(0,40)}" — not a MANDATORY_TOKENS entry`);
      } else if (hex && hex !== tokenHex[tok]) {
        errors.push(`"${name.slice(0,40)}" tagged [${tok}] but fill ${hex} ≠ token hex ${tokenHex[tok]} — would be a bind leak`);
      }
    }

    // 4. typo role valid
    const ym = TYPO_TAG.exec(name);
    if (ym && !typoRoles.has(ym[1])) {
      errors.push(`[typo:${ym[1]}] on "${name.slice(0,40)}" — not a SAP_TYPOGRAPHY role`);
    }

    // 5. icon name valid
    if (name.indexOf(ICON_PREFIX) === 0) {
      const icon = name.slice(ICON_PREFIX.length).trim().toLowerCase();
      if (!iconNames.has(icon)) {
        errors.push(`${ICON_PREFIX}${icon} — not in ICON_KEYS (add via Harvest Icon Keys)`);
      }
    }

    // 6. raw off-whitelist hex on non-instance nodes (icon placeholders exempt —
    //    they're swapped for real kit icons, not token-bound)
    const isIconPlaceholder = name.indexOf(ICON_PREFIX) === 0;
    if (hex && !isInstance && !tm && !isIconPlaceholder) {
      const known = Object.values(tokenHex).includes(hex);
      if (!known) {
        warnings.push(`"${name.slice(0,40)}" has untagged fill ${hex} not in whitelist — will be a raw-fill leak unless tagged`);
      } else {
        warnings.push(`"${name.slice(0,40)}" fill ${hex} matches a token but is UNTAGGED — add [sapToken] for unambiguous binding`);
      }
    }
  }

  // ── Report ──
  console.log('\n' + '─'.repeat(60));
  console.log('MCP-frame lint: ' + path.basename(file) + '  (' + nodes.length + ' nodes)');
  console.log('─'.repeat(60));
  if (errors.length) { console.log('ERRORS:'); errors.forEach(e => console.log('  ✗ ' + e)); }
  if (warnings.length) { console.log('WARNINGS:'); warnings.forEach(w => console.log('  ⚠ ' + w)); }
  if (!errors.length && !warnings.length) console.log('  ✓ clean — every tag valid, every tagged fill exact-hex');
  console.log('─'.repeat(60));
  console.log(errors.length ? `✗ FAIL — ${errors.length} error(s)` : `✅ PASS${warnings.length ? ' WITH WARNINGS ('+warnings.length+')' : ''}`);
  process.exit(errors.length ? 1 : 0);
}

main();
