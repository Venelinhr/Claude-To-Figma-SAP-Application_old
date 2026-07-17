#!/usr/bin/env node
/**
 * score-canonical.js — Deterministic similarity scorer for the Canonical Pattern Library (RULE 31).
 *
 * Reads skill/references/canonical-index.json and scores a build request against every canonical.
 * Replaces hand-computed prose scoring with a reproducible number — same input, same output, every time.
 *
 * Scoring (authoritative — matches canonical-similarity-rubric.md + SYSTEM_PROMPT RULE 31):
 *   Floorplan match : 50  (exact floorplan = 50, adjacent variant = 30, different = 0)
 *   Region overlap  : 30  (matched_regions / total_request_regions × 30)
 *   Component overlap: 20  (shared_components / total_request_components × 20)
 *   Total = 0–100. Threshold: >=85 Level 1 (clone direct) · 60–84 Level 2/3 (clone + delta) · <60 Level 5 (new)
 *
 * Usage:
 *   node build/score-canonical.js --floorplan "List Report" --regions ShellBar,DynamicPageTitle,ResponsiveTable --components ShellBar,Button,ResponsiveTable,ObjectStatus
 *   node build/score-canonical.js --json '{"floorplan":"List Report","regions":[...],"components":[...]}'
 *
 * Output: ranked JSON of matches with score breakdown + recommended reuse level.
 */

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'skill', 'references', 'canonical-index.json');

// ── Floorplan adjacency map — which floorplans count as "adjacent variant" (30 pts) ──
const ADJACENCY = {
  'List Report':   ['Worklist', 'Analytical List Page', 'Object Page'],
  'Worklist':      ['List Report', 'Analytical List Page'],
  'Object Page':   ['List Report', 'Dialog'],
  'Dialog':        ['Object Page', 'Log Panel', 'Card', 'Wizard'],
  'Log Panel':     ['Dialog'],
  'FCL':           ['FCL + SideNav', 'Master-Detail'],
  'FCL + SideNav': ['FCL', 'Master-Detail'],
  'Card':          ['Dialog'],
  'Wizard':        ['Dialog'],
  'SideNavigation':['FCL + SideNav'],
};

function norm(s) { return String(s || '').trim().toLowerCase(); }

function floorplanScore(requestFp, canonicalFp) {
  const r = norm(requestFp), c = norm(canonicalFp);
  if (!r || !c) return 0;
  if (r === c) return 50;                                   // exact
  const adj = (ADJACENCY[requestFp] || []).map(norm);
  if (adj.includes(c)) return 30;                           // adjacent variant
  // symmetric check
  const adjC = (ADJACENCY[canonicalFp] || []).map(norm);
  if (adjC.includes(r)) return 30;
  return 0;                                                 // different
}

function overlapScore(requestArr, canonicalArr, weight) {
  const req = (requestArr || []).map(norm).filter(Boolean);
  if (req.length === 0) return 0;
  const can = new Set((canonicalArr || []).map(norm));
  const matched = req.filter(x => can.has(x)).length;
  return (matched / req.length) * weight;
}

function scoreCanonical(request, canonical) {
  const fp = floorplanScore(request.floorplan, canonical.floorplan);
  const rg = overlapScore(request.regions, canonical.regions, 30);
  const cp = overlapScore(request.components, canonical.keyComponents || canonical.components, 20);
  const total = Math.round((fp + rg + cp) * 10) / 10;
  return {
    id: canonical.id,
    name: canonical.name,
    figNode: canonical.figNode || canonical.figmaNode || null,
    floorplan: canonical.floorplan || null,
    score: total,
    breakdown: { floorplan: fp, regions: Math.round(rg * 10) / 10, components: Math.round(cp * 10) / 10 },
  };
}

function reuseLevel(score) {
  if (score >= 85) return { level: 1, action: 'clone directly, inject content only' };
  if (score >= 70) return { level: 2, action: 'clone + delta (similar screen)' };
  if (score >= 60) return { level: 3, action: 'clone + delta (floorplan reuse)' };
  return { level: 5, action: 'no strong match — build new (state explicitly)' };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') { return JSON.parse(argv[++i]); }
    if (a === '--floorplan') args.floorplan = argv[++i];
    else if (a === '--regions') args.regions = argv[++i].split(',').map(s => s.trim());
    else if (a === '--components') args.components = argv[++i].split(',').map(s => s.trim());
  }
  return args;
}

function main() {
  const request = parseArgs(process.argv);
  if (!request.floorplan && !request.regions && !request.components) {
    console.error('Usage: node build/score-canonical.js --floorplan "List Report" --regions R1,R2 --components C1,C2');
    console.error('   or: node build/score-canonical.js --json \'{"floorplan":"...","regions":[...],"components":[...]}\'');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));

  // Tier 1 ships in the tracked index. Tier 2 (personal, confirmed) lives in a gitignored
  // side file canonical-index-tier2.json — merge it when present.
  const tier1 = (index.tiers && index.tiers.tier1) || [];
  let tier2 = (index.tiers && index.tiers.tier2) || [];
  const TIER2_PATH = path.join(__dirname, '..', 'skill', 'references', 'canonical-index-tier2.json');
  if (tier2.length === 0 && fs.existsSync(TIER2_PATH)) {
    try {
      const t2 = JSON.parse(fs.readFileSync(TIER2_PATH, 'utf8'));
      tier2 = t2.tier2 || t2.tiers?.tier2 || [];
    } catch (e) { /* personal file optional */ }
  }

  // Tier 2 entries inherit fingerprint from their Tier 1 parent (inheritsFrom)
  const tier1ById = Object.fromEntries(tier1.map(c => [c.id, c]));
  const tier2Full = tier2.map(t2 => {
    const parent = tier1ById[t2.inheritsFrom] || {};
    return {
      id: t2.figmaNode || t2.id,
      name: t2.name,
      figmaNode: t2.figmaNode,
      floorplan: t2.floorplan || parent.floorplan,
      regions: t2.regions || parent.regions,
      keyComponents: t2.keyComponents || parent.keyComponents,
      tier: 2,
    };
  });

  const candidates = tier2Full.length ? tier2Full : tier1.map(c => ({ ...c, tier: 1 }));

  const scored = candidates
    .map(c => scoreCanonical(request, c))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 5);
  const best = top[0];
  const rec = best ? reuseLevel(best.score) : { level: 5, action: 'no canonicals available' };

  const result = {
    request,
    tierUsed: tier2Full.length ? 2 : 1,
    topMatches: top,
    recommendation: best ? {
      baseCanonical: best.id,
      baseCanonicalName: best.name,
      figNode: best.figNode,
      similarityScore: best.score,
      reuseLevel: rec.level,
      action: rec.action,
    } : null,
  };

  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();
module.exports = { scoreCanonical, floorplanScore, overlapScore, reuseLevel };
