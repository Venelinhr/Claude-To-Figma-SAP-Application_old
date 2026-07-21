#!/usr/bin/env node
/*
 * generate-derived.js — SSOT "generate, don't duplicate" tool (audit permanent fix, 2026-07-21).
 *
 * PROBLEM it solves: the same facts (token hexes, typo sizes) were hand-maintained in
 * SAP_BUILD_MANIFEST.md AND in the authoritative sources, and drifted apart (the §4 hex
 * forks the drift audit found). Fixing prose but not data — or data but not prose — is the
 * recurring failure.
 *
 * WHAT IT DOES: pulls the AUTHORITATIVE values from source and writes them into the
 * hand-curated tables IN PLACE, touching ONLY the value column inside a
 * <!-- GENERATED:<id>:start --> … <!-- GENERATED:<id>:end --> fence. Role names, token
 * selection, Use/Weight columns, prose annotations — all hand-curated and PRESERVED.
 * The generator only syncs the one authoritative column.
 *
 *   §4  token Hex   ← knowledge/guidelines/horizon-variable-keys.json  (fence: hex4)
 *   §5  typo Size   ← build/verify-invariants.js TYPO_ROLES            (fence: typo5)
 *
 * Tables that carry data living in NO source (sap-screen TEXT-key hashes, canonical node
 * widths, RULE 24 vocab) are deliberately NOT generated here — they are LINT-only, guarded
 * by check-manifest-sync.js. Generating them would destroy hand-authored data (adversarial
 * review F1–F3).
 *
 * DETERMINISTIC: no timestamps, no Date, stable input order. `generate → generate` is a
 * no-op, which is what the CI drift gate (ci-drift-gate.sh: generate && git diff --exit-code)
 * depends on.
 *
 * USAGE:
 *   node build/generate-derived.js           # rewrite derived regions in place
 *   node build/generate-derived.js --check    # exit 1 if anything WOULD change (no write)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'SAP_BUILD_MANIFEST.md');
const HORIZON = path.join(ROOT, 'knowledge', 'guidelines', 'horizon-variable-keys.json');
const VERIFY = path.join(ROOT, 'build', 'verify-invariants.js');

const CHECK = process.argv.includes('--check');
let changed = 0;
const notes = [];

function loadHorizon() {
  const tokens = JSON.parse(fs.readFileSync(HORIZON, 'utf8')).tokens || {};
  const map = {};
  for (const [name, v] of Object.entries(tokens)) {
    if (name.startsWith('comment') || name.startsWith('_')) continue;
    if (v && typeof v === 'object' && v.hex) map[name] = String(v.hex).toUpperCase();
  }
  return map;
}

function loadTypoRoles() {
  // TYPO_ROLES is the enforced authority (verify-invariants.js). Parse its literal.
  const src = fs.readFileSync(VERIFY, 'utf8');
  const m = src.match(/TYPO_ROLES\s*=\s*\{([\s\S]*?)\};/);
  const map = {};
  if (m) {
    const re = /['"]?([a-zA-Z-]+)['"]?\s*:\s*(\d{1,2})/g;
    let r; while ((r = re.exec(m[1])) !== null) map[r[1].toLowerCase()] = parseInt(r[2], 10);
  }
  return map;
}

// Replace the value inside a fenced region, row by row, preserving everything else.
function syncFence(md, fenceId, rowFn) {
  const start = `<!-- GENERATED:${fenceId}:start`;
  const end = `<!-- GENERATED:${fenceId}:end -->`;
  const si = md.indexOf(start);
  const ei = md.indexOf(end);
  if (si === -1 || ei === -1) { notes.push(`⚠ fence ${fenceId} not found — skipped`); return md; }
  const blockStart = md.indexOf('\n', si) + 1;
  const before = md.slice(0, blockStart);
  const block = md.slice(blockStart, ei);
  const after = md.slice(ei);
  const newBlock = block.split('\n').map(rowFn).join('\n');
  if (newBlock !== block) changed++;
  return before + newBlock + after;
}

function run() {
  const horizon = loadHorizon();
  const typo = loadTypoRoles();
  let md = fs.readFileSync(MANIFEST, 'utf8');
  const orig = md;

  // §4 — sync the Hex column from horizon source. Row: | tokenName | `#HEX` | Use |
  md = syncFence(md, 'hex4', (line) => {
    const m = line.match(/^\|\s*(sap[A-Za-z0-9_]+)\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|(.*)$/);
    if (!m) return line;
    const [, name, curHex, rest] = m;
    const srcHex = horizon[name];
    if (!srcHex) return line; // curated token not in source (e.g. Element alias) — leave as-is
    if (srcHex.toUpperCase() === curHex.toUpperCase()) return line;
    notes.push(`§4 ${name}: ${curHex} → ${srcHex} (synced from horizon source)`);
    return `| ${name} | \`${srcHex}\` |${rest}`;
  });

  // §5 — sync the Size column from TYPO_ROLES. Row: | role | size | weight |
  //   Role names in the doc may be aliases ("body / bodyText"); map to a TYPO_ROLES key.
  const roleKey = (label) => {
    const first = label.split('/')[0].trim().toLowerCase().replace(/[^a-z]/g, '');
    return first in typo ? first : (label.replace(/[^a-z]/gi, '').toLowerCase() in typo ? label.replace(/[^a-z]/gi, '').toLowerCase() : null);
  };
  md = syncFence(md, 'typo5', (line) => {
    const m = line.match(/^\|\s*([a-zA-Z / ]+?)\s*\|\s*(\d{1,2})\s*\|(.*)$/);
    if (!m) return line;
    const [, role, curSize, rest] = m;
    const key = roleKey(role);
    if (!key) return line;
    const srcSize = typo[key];
    if (srcSize == null || String(srcSize) === curSize.trim()) return line;
    notes.push(`§5 ${role.trim()}: ${curSize} → ${srcSize} (synced from TYPO_ROLES)`);
    return `| ${role} | ${srcSize} |${rest}`;
  });

  if (md !== orig) {
    if (CHECK) {
      console.error('✗ DRIFT: derived tables are stale. Run: node build/generate-derived.js');
      notes.forEach(n => console.error('   ' + n));
      process.exit(1);
    }
    fs.writeFileSync(MANIFEST, md);
  }
  return md !== orig;
}

const didChange = run();
if (CHECK) {
  console.log('✓ derived tables in sync with sources (0 drift)');
} else if (didChange) {
  console.log(`✓ regenerated derived tables (${changed} region(s) updated):`);
  notes.forEach(n => console.log('   ' + n));
} else {
  console.log('✓ derived tables already in sync — nothing to regenerate');
}
process.exit(0);
