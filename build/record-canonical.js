#!/usr/bin/env node
/**
 * record-canonical.js — Library write-back for the Canonical Pattern Library (RULE 31 · Gap 4).
 *
 * When a build is confirmed ("perfect" / "bravo" / "exactly"), this makes the confirmation
 * MECHANICAL instead of prose: it appends a row to the reuse-outcomes-ledger AND adds a Tier 2
 * entry to canonical-index.json — so the library actually grows and the learning loop is real.
 *
 * Usage:
 *   node build/record-canonical.js \
 *     --node "804:44859" --name "Purchase Orders" --file "p7zm5EMBk5DRRZdxNeJ4f5" \
 *     --base "shipped-outage-list" --level 1 --score 94 --outcome "Bravo"
 *
 * Effects (idempotent — re-running with the same --node updates rather than duplicates):
 *   1. Adds/updates a Tier 2 entry in skill/references/canonical-index.json
 *   2. Appends a row to .claude/memory/reuse-outcomes-ledger.md
 *
 * Both files are gitignored (personal). Run after the user confirms a build.
 */

const fs = require('fs');
const path = require('path');

const PROJ = path.join(__dirname, '..');
const INDEX_PATH = path.join(PROJ, 'skill', 'references', 'canonical-index.json');
const LEDGER_PATH = path.join(PROJ, '.claude', 'memory', 'reuse-outcomes-ledger.md');

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) a[k.slice(2)] = argv[++i];
  }
  return a;
}

function requireArg(a, key) {
  if (!a[key]) { console.error(`Missing required --${key}`); process.exit(1); }
  return a[key];
}

function main() {
  const a = parseArgs(process.argv);
  const node = requireArg(a, 'node');
  const name = requireArg(a, 'name');
  const file = a.file || 'p7zm5EMBk5DRRZdxNeJ4f5';
  const base = a.base || null;
  const level = a.level || '?';
  const score = a.score || '—';
  const outcome = a.outcome || 'confirmed';
  const date = a.date || new Date().toISOString().slice(0, 10); // caller may pass --date to avoid nondeterminism

  // ── 1. Update canonical-index.json Tier 2 ──
  let idx;
  try { idx = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8')); }
  catch (e) { console.error('✗ Cannot read canonical-index.json:', e.message); process.exit(1); }
  idx.tiers = idx.tiers || {};
  idx.tiers.tier2 = idx.tiers.tier2 || [];

  const entry = {
    id: node,
    name,
    figmaNode: node,
    fileKey: file,
    approvedDate: date,
    confirmedBy: outcome,
    inheritsFrom: base,
  };

  const existingIdx = idx.tiers.tier2.findIndex(e => e.id === node || e.figmaNode === node);
  if (existingIdx >= 0) {
    idx.tiers.tier2[existingIdx] = { ...idx.tiers.tier2[existingIdx], ...entry };
    console.log(`• Updated existing Tier 2 entry: ${node}`);
  } else {
    idx.tiers.tier2.push(entry);
    console.log(`✓ Added Tier 2 canonical: ${name} (${node})`);
  }
  fs.writeFileSync(INDEX_PATH, JSON.stringify(idx, null, 2) + '\n');

  // ── 2. Append to reuse-outcomes-ledger.md ──
  let ledger = '';
  try { ledger = fs.readFileSync(LEDGER_PATH, 'utf8'); } catch (e) { /* create below */ }

  const row = `| ${date} | ${name} | ${base || 'none'} | ${level} | ${score}${typeof score === 'string' && score !== '—' && !score.includes('%') ? '%' : ''} | ✅ ${outcome} |`;

  if (ledger.includes('| Date | Screen Built |')) {
    // Insert after the last existing table row
    const lines = ledger.split('\n');
    let lastRow = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^\| \d{4}-\d{2}-\d{2} \|/.test(lines[i])) lastRow = i;
    }
    if (lastRow >= 0) { lines.splice(lastRow + 1, 0, row); }
    else { lines.push(row); }
    fs.writeFileSync(LEDGER_PATH, lines.join('\n'));
  } else {
    // Ledger missing table — append a minimal one
    fs.writeFileSync(LEDGER_PATH, ledger +
      '\n\n| Date | Screen Built | Base Canonical | Reuse Level | Similarity | Outcome |\n' +
      '|------|-------------|----------------|-------------|------------|---------|\n' + row + '\n');
  }
  console.log(`✓ Ledger row added: ${name} · Level ${level} · ${score} · ${outcome}`);
  console.log('\nLibrary grew — next similar request will score against this canonical.');
}

if (require.main === module) main();
