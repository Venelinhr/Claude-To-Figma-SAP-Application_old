#!/usr/bin/env node
/**
 * check-reuse-integrity.js — CI drift guard for the Canonical Pattern Library (RULE 31).
 *
 * Catches the failure the audit found: a confirmed build recorded in the ledger but NEVER added
 * to canonical-index.json Tier 2 ("Schedule Activated" was in the ledger, absent from the index —
 * the flywheel silently failed). Also catches node-ID disagreements across the sources.
 *
 * Checks:
 *   1. Every ledger row with a real base canonical + a node has a matching Tier-2 (or Tier-1) entry.
 *      (Level-5 "none" rows are exempt until confirmed — they represent new patterns not yet promoted.)
 *   2. canonical-index.json is valid JSON with tier1/tier2 arrays.
 *   3. No duplicate ids within a tier.
 *
 * Usage: node build/check-reuse-integrity.js
 * Exit 0 = consistent. Exit 1 = drift found (prints details). Wired into build/test-build.sh.
 */

const fs = require('fs');
const path = require('path');

const PROJ = path.join(__dirname, '..');
const INDEX = path.join(PROJ, 'skill', 'references', 'canonical-index.json');
const LEDGER = path.join(PROJ, '.claude', 'memory', 'reuse-outcomes-ledger.md');

function main() {
  const problems = [];

  // ── Load index ──
  let idx;
  try { idx = JSON.parse(fs.readFileSync(INDEX, 'utf8')); }
  catch (e) { console.error('✗ canonical-index.json invalid JSON:', e.message); process.exit(1); }

  const tier1 = (idx.tiers && idx.tiers.tier1) || [];
  let tier2 = (idx.tiers && idx.tiers.tier2) || [];
  // Tier 2 lives in the gitignored side file — merge when present
  const T2 = path.join(PROJ, 'skill', 'references', 'canonical-index-tier2.json');
  if (tier2.length === 0 && fs.existsSync(T2)) {
    try { const j = JSON.parse(fs.readFileSync(T2, 'utf8')); tier2 = j.tier2 || (j.tiers && j.tiers.tier2) || []; }
    catch (e) { /* optional */ }
  }

  // Duplicate id check
  for (const [name, arr] of [['tier1', tier1], ['tier2', tier2]]) {
    const seen = new Set();
    for (const e of arr) {
      if (seen.has(e.id)) problems.push(`Duplicate id "${e.id}" in ${name}`);
      seen.add(e.id);
    }
  }

  // Set of all known node IDs / ids for lookup
  const known = new Set();
  [...tier1, ...tier2].forEach(e => {
    if (e.id) known.add(e.id);
    if (e.figmaNode) known.add(e.figmaNode);
    if (e.figNode) known.add(e.figNode);
  });

  // ── Load ledger (optional — gitignored, may be absent on a fresh clone) ──
  if (fs.existsSync(LEDGER)) {
    const ledger = fs.readFileSync(LEDGER, 'utf8');
    const rows = ledger.split('\n').filter(l => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(l));
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim());
      // | date | screen | base canonical | level | score | outcome |
      const screen = cells[2] || '';
      const base = cells[3] || '';
      const level = cells[4] || '';
      // Level 5 / "none" rows are new patterns — exempt (they're promoted on next confirmation)
      if (level === '5' || /none/i.test(base)) continue;
      // Extract a node id from the base cell (e.g. "750:174925 (Outage List)" or "shipped-outage-list")
      const nodeMatch = base.match(/\d+:\d+/);
      const idToken = nodeMatch ? nodeMatch[0] : base.replace(/\s*\(.*\)\s*/, '').trim();
      if (idToken && !known.has(idToken)) {
        problems.push(`Ledger row "${screen}" cites base "${idToken}" which is NOT in canonical-index.json (Tier 1 or 2). The flywheel may have failed to record it.`);
      }
    }
  }

  if (problems.length) {
    console.error('✗ Reuse integrity drift found:');
    problems.forEach(p => console.error('  • ' + p));
    process.exit(1);
  }
  console.log(`✓ Reuse integrity OK — ${tier1.length} Tier-1 + ${tier2.length} Tier-2 canonicals, ledger consistent.`);
  process.exit(0);
}

if (require.main === module) main();
