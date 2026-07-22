#!/usr/bin/env node
/**
 * record-reuse-decision.js — Write .claude/.reuse-declared from a scored build.
 * Usage: node build/record-reuse-decision.js --level 3 --score 63.3 --base "750:174786"
 * This is the LEGITIMATE write path for the reuse marker (not agent self-echo).
 * The agent should run score-canonical.js first, then call this with the result.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const get = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i+1] : null; };
const level = parseInt(get('--level') || '5', 10);
const score = parseFloat(get('--score') || '0');
const base  = get('--base') || 'none';
const delta = get('--delta') || null;
const decision = { level, score, baseCanonical: base, deltaSpec: delta };
const out = path.join(ROOT, '.claude', '.reuse-declared');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(decision));
console.log('✓ reuse decision recorded:', JSON.stringify(decision));
