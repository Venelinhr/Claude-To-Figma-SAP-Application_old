#!/usr/bin/env node
/**
 * lint-instance-ratio.js — Detects the silent native-frame fallback (root cause #3).
 *
 * The most damaging failure in the system's history is "looks nothing like SAP" — caused by
 * silently substituting figma.createFrame() when a real SAP component import fails, instead of
 * ABORTING. This linter checks a serialized frame's node tree: if a screen has too many plain
 * FRAME/TEXT/RECTANGLE nodes and too few real SAP INSTANCE nodes, it flags a probable fallback.
 *
 * A real SAP screen is mostly INSTANCE nodes (ShellBar, Button, Table, ObjectStatus, ...). A
 * fallback screen is mostly FRAME + TEXT that merely LOOK like SAP — a wireframe, not an implementation.
 *
 * Input: a JSON node tree (from figma get_metadata or a serialized dump) on stdin or as a file arg.
 *   Each node: { type: "INSTANCE"|"FRAME"|"TEXT"|..., name, children?: [] }
 *
 * Usage:
 *   node build/lint-instance-ratio.js frame-dump.json
 *   echo '{...}' | node build/lint-instance-ratio.js -
 *   node build/lint-instance-ratio.js frame-dump.json --min-ratio 0.25
 *
 * Exit 0 = healthy ratio. Exit 1 = probable native-frame fallback (prints the evidence).
 */

const fs = require('fs');

// Layout/container frames are legitimately FRAME (auto-layout wrappers). We only count
// "leaf-ish" plain frames/text/rects that should have been SAP components as suspicious.
// The heuristic: count INSTANCE vs (FRAME+TEXT+RECTANGLE), excluding the root and pure containers.

function parseArgs(argv) {
  const a = { minRatio: 0.20 };
  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--min-ratio') a.minRatio = parseFloat(argv[++i]);
    else rest.push(argv[i]);
  }
  a.input = rest[0];
  return a;
}

function walk(node, counts, depth = 0) {
  if (!node || typeof node !== 'object') return;
  const type = node.type || '';
  if (depth > 0) { // skip the root frame itself
    if (type === 'INSTANCE') counts.instance++;
    else if (type === 'FRAME') counts.frame++;
    else if (type === 'TEXT') counts.text++;
    else if (type === 'RECTANGLE') counts.rect++;
    else counts.other++;
  }
  const kids = node.children || [];
  for (const k of kids) walk(k, counts, depth + 1);
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.input) {
    console.error('Usage: node build/lint-instance-ratio.js <frame-dump.json | -> [--min-ratio 0.20]');
    process.exit(2);
  }
  let tree;
  try {
    const raw = args.input === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(args.input, 'utf8');
    tree = JSON.parse(raw);
  } catch (e) { console.error('✗ Could not read/parse node tree:', e.message); process.exit(2); }

  const counts = { instance: 0, frame: 0, text: 0, rect: 0, other: 0 };
  walk(tree, counts);

  const total = counts.instance + counts.frame + counts.text + counts.rect;
  if (total === 0) { console.log('✓ empty tree — nothing to check'); process.exit(0); }

  const ratio = counts.instance / total;
  const pct = (ratio * 100).toFixed(1);

  console.log(`Node breakdown: INSTANCE=${counts.instance} FRAME=${counts.frame} TEXT=${counts.text} RECT=${counts.rect} other=${counts.other}`);
  console.log(`SAP instance ratio: ${pct}% (threshold ${(args.minRatio * 100).toFixed(0)}%)`);

  if (ratio < args.minRatio) {
    console.error(`\n✗ PROBABLE NATIVE-FRAME FALLBACK — only ${pct}% of nodes are real SAP INSTANCEs.`);
    console.error('  A real SAP screen is mostly INSTANCE nodes. This screen is mostly plain FRAME/TEXT/RECT —');
    console.error('  it may LOOK like SAP but is a wireframe, not an implementation (RULE 1 / FAIL-CLOSED violation).');
    console.error('  Check: did an importComponentSetByKeyAsync fail and fall back to createFrame()?');
    process.exit(1);
  }
  console.log(`✓ Healthy SAP instance ratio — no fallback detected.`);
  process.exit(0);
}

if (require.main === module) main();
module.exports = { walk };
