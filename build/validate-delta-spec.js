#!/usr/bin/env node
/**
 * validate-delta-spec.js — Validates a delta-spec JSON against delta-spec-schema.json (RULE 31).
 *
 * A delta-spec is the required build plan when reuse Level 1–4 is chosen. This checks it is
 * well-formed BEFORE a use_figma build proceeds: base canonical present, reuse level valid,
 * similarity score consistent with the level, and preserve/replace/add/remove all present.
 *
 * Usage:
 *   node build/validate-delta-spec.js path/to/delta-spec.json
 *   echo '{...}' | node build/validate-delta-spec.js -
 *
 * Exit 0 = valid. Exit 1 = invalid (prints reasons).
 */

const fs = require('fs');
const path = require('path');

const CANON_PATH = path.join(__dirname, '..', 'skill', 'references', 'canonical-index.json');

function readInput() {
  const arg = process.argv[2];
  if (!arg) { console.error('Usage: node build/validate-delta-spec.js <file.json | ->'); process.exit(1); }
  const raw = arg === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(arg, 'utf8');
  return JSON.parse(raw);
}

function validate(spec) {
  const errors = [];
  const warn = [];

  // Required fields
  for (const f of ['baseCanonical', 'reuseLevel', 'similarityScore', 'preserve', 'replace', 'add', 'remove']) {
    if (!(f in spec)) errors.push(`Missing required field: "${f}"`);
  }

  // Level validity
  if (typeof spec.reuseLevel !== 'number' || spec.reuseLevel < 1 || spec.reuseLevel > 5) {
    errors.push(`reuseLevel must be 1–5, got: ${spec.reuseLevel}`);
  }

  // Score validity
  if (typeof spec.similarityScore !== 'number' || spec.similarityScore < 0 || spec.similarityScore > 100) {
    errors.push(`similarityScore must be 0–100, got: ${spec.similarityScore}`);
  }

  // Level ↔ score consistency (matches score-canonical.js thresholds)
  if (typeof spec.similarityScore === 'number' && typeof spec.reuseLevel === 'number') {
    const s = spec.similarityScore, l = spec.reuseLevel;
    if (l === 1 && s < 85) errors.push(`Level 1 requires score ≥85, got ${s}. Use Level 2/3 or re-score.`);
    if (l === 5 && s >= 60) warn.push(`Level 5 (new build) but score ${s} ≥60 — a canonical may exist. Reconsider reuse.`);
    if ((l === 2 || l === 3) && (s < 60 || s >= 85)) warn.push(`Level ${l} expects score 60–84, got ${s}.`);
  }

  // Level 5 must declare baseCanonical "none"
  if (spec.reuseLevel === 5 && spec.baseCanonical && spec.baseCanonical !== 'none') {
    warn.push(`Level 5 is a new build but baseCanonical="${spec.baseCanonical}" — set to "none" for clarity.`);
  }

  // Base canonical exists in the index (for Level 1–4)
  if (spec.reuseLevel >= 1 && spec.reuseLevel <= 4 && spec.baseCanonical && spec.baseCanonical !== 'none') {
    try {
      const idx = JSON.parse(fs.readFileSync(CANON_PATH, 'utf8'));
      const all = [...(idx.tiers?.tier1 || []), ...(idx.tiers?.tier2 || [])];
      const found = all.some(c => c.id === spec.baseCanonical || c.figmaNode === spec.baseCanonical || c.figNode === spec.baseCanonical);
      if (!found) warn.push(`baseCanonical "${spec.baseCanonical}" not found in canonical-index.json — is it a personal Tier 2 node not yet recorded?`);
    } catch (e) { /* index missing is not fatal here */ }
  }

  // preserve/add/remove must be arrays; replace must be object
  if (spec.preserve && !Array.isArray(spec.preserve)) errors.push('preserve must be an array');
  if (spec.add && !Array.isArray(spec.add)) errors.push('add must be an array');
  if (spec.remove && !Array.isArray(spec.remove)) errors.push('remove must be an array');
  if (spec.replace && (typeof spec.replace !== 'object' || Array.isArray(spec.replace))) errors.push('replace must be an object');

  return { errors, warn };
}

function main() {
  let spec;
  try { spec = readInput(); }
  catch (e) { console.error('✗ Could not parse delta-spec JSON:', e.message); process.exit(1); }

  const { errors, warn } = validate(spec);

  warn.forEach(w => console.error('⚠  ' + w));
  if (errors.length) {
    console.error('\n✗ delta-spec INVALID:');
    errors.forEach(e => console.error('  • ' + e));
    process.exit(1);
  }
  console.log(`✓ delta-spec valid — Level ${spec.reuseLevel}, base ${spec.baseCanonical}, score ${spec.similarityScore}`);
  process.exit(0);
}

if (require.main === module) main();
module.exports = { validate };
