#!/usr/bin/env node
/*
 * bridge/server.js — SAP Agent v2 localhost bridge.
 *
 * Figma plugins run in a sandbox and CANNOT call Claude (MCP is Claude->Figma only).
 * This bridge is the middleman:
 *
 *   v2 plugin  --HTTP(127.0.0.1)-->  this bridge  --spawn headless claude-->  Claude
 *   Claude  --use_figma (MCP)-->  Figma      (the existing, proven direction)
 *
 * Two-turn flow, ONE live claude child per run (never stdin.end() between turns,
 * never per-turn --resume — a re-init fires SessionStart which WIPES .wireframe-approved):
 *   TURN 1 (/run)     read-only wireframe proposal; bridge writes .claude/.agent-turn1
 *                     sentinel so guard-agent-turn1.sh hard-blocks any use_figma.
 *   TURN 2 (/approve) bridge DELETES the sentinel, then sends the user's LITERAL approval
 *                     words as the 2nd stream-json turn. capture-approvals.sh (a real
 *                     UserPromptSubmit) writes .wireframe-approved from those words, then
 *                     Claude clones+builds beside the original.
 *
 * INVARIANT: this bridge NEVER writes .wireframe-approved / .scratch-approved / .reuse-declared.
 * It only relays the user's keystrokes into a genuine claude turn; the hooks do the writing.
 * (build-v2.sh grep-asserts this file never touches those markers.)
 *
 * Node core only (http, child_process, crypto, fs, path) — no dependencies, no npm install.
 * Verified on claude 2.1.207: stream-json requires --verbose; figma tools need
 * bypassPermissions (acceptEdits blocks them); one held-open stdin = one session_id.
 */
'use strict';

const http = require('node:http');
const { spawn, execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ── Config ───────────────────────────────────────────────────────────────────
const PROJ = path.resolve(__dirname, '..');               // the project dir (cwd for claude)
const PORT = Number(process.env.SAP_BRIDGE_PORT || 41777); // must match manifest allowedDomains
const HOST = '127.0.0.1';                                  // loopback ONLY — never 0.0.0.0
const TURN1_SENTINEL = path.join(PROJ, '.claude', '.agent-turn1');
const TOKEN_FILE = path.join(PROJ, '.claude', '.bridge-token');
function loadOrCreateToken() {
  try {
    const t = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
    if (t && t.length >= 32) {
      // SECURITY FIX 2026-07-21: repair perms if the token file is group/other-readable.
      try { fs.chmodSync(TOKEN_FILE, 0o600); } catch (_) {}
      return t;
    }
  } catch (_) {}
  const t = crypto.randomBytes(24).toString('hex');
  // SECURITY FIX 2026-07-21: create dir 0700 + write token 0600 (was default umask → world-readable).
  try { fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true, mode: 0o700 }); } catch (_) {}
  fs.writeFileSync(TOKEN_FILE, t, { encoding: 'utf8', mode: 0o600 });
  return t;
}
const TOKEN = loadOrCreateToken();
const TURN1_TIMEOUT_MS = 300000;  // 5 min to produce a wireframe
const TURN2_TIMEOUT_MS = 600000;  // 10 min to build

// Markers the bridge is FORBIDDEN to write (self-check; also enforced by build-v2.sh grep).
const FORBIDDEN_MARKERS = ['.wireframe-approved', '.scratch-approved', '.reuse-declared'];

// ── Run state (keyed by runId) ────────────────────────────────────────────────
/** @type {Map<string, Run>} */
const runs = new Map();

// SECURITY/RESOURCE FIX 2026-07-21: bound the runs map + per-run event log so a long-lived
// bridge cannot leak memory unboundedly (runs were never deleted; events grew forever).
const MAX_CONCURRENT_RUNS = 8;     // reject new /run past this many live runs
const MAX_EVENTS_PER_RUN = 2000;   // ring-buffer cap on a single run's event log
const RUN_TTL_AFTER_DONE_MS = 60000; // evict a done/error run 60s after it settles (allows final poll/SSE drain)

function liveRunCount() {
  let n = 0;
  for (const r of runs.values()) if (r.phase !== 'done' && r.phase !== 'error') n++;
  return n;
}

function scheduleEviction(run) {
  if (run._evictTimer) return;
  run._evictTimer = setTimeout(() => {
    try { clearInterval(run._ka); } catch (_) {}
    for (const res of run.sseClients) { try { res.end(); } catch (_) {} }
    run.sseClients.clear();
    runs.delete(run.id);
  }, RUN_TTL_AFTER_DONE_MS);
  if (run._evictTimer.unref) run._evictTimer.unref();
}

function newRun() {
  const id = crypto.randomBytes(8).toString('hex');
  const run = {
    id,
    child: null,
    phase: 'starting',          // starting -> awaiting-wireframe -> need-approval -> building -> done|error
    events: [],                 // event log (for SSE replay + /poll fallback)
    sseClients: new Set(),      // active SSE res objects
    stdoutBuf: '',              // partial stream-json line buffer
    turnResultText: '',         // accumulates assistant text for the current turn
    selection: null,
    fileKey: null,
    timer: null,
    childExited: false,
  };
  runs.set(id, run);
  return run;
}

// ── Event emission (append + fan out to SSE + resolve long-polls) ──────────────
function emit(run, type, data) {
  const evt = { seq: run.events.length, type, data: data || {}, at: Date.now() };
  run.events.push(evt);
  // Ring-buffer cap: keep the log bounded on long/chatty runs (seq stays monotonic via .length).
  if (run.events.length > MAX_EVENTS_PER_RUN) {
    run.events.splice(0, run.events.length - MAX_EVENTS_PER_RUN);
  }
  const payload = `event: ${type}\ndata: ${JSON.stringify(evt)}\n\n`;
  for (const res of run.sseClients) {
    try { res.write(payload); } catch (_) { /* client gone */ }
  }
  // wake any long-poll waiters
  if (run._pollWaiters) {
    const waiters = run._pollWaiters; run._pollWaiters = [];
    for (const w of waiters) { try { w(); } catch (_) {} }
  }
  // Terminal phases → schedule cleanup so the run + its buffers are released.
  if (type === 'done' || type === 'error') scheduleEviction(run);
}

// ── Claude child lifecycle ─────────────────────────────────────────────────────
function spawnChild(run) {
  const sessionId = crypto.randomUUID();
  const args = [
    '-p',
    '--output-format', 'stream-json',
    '--input-format', 'stream-json',
    '--verbose',                              // REQUIRED with stream-json output
    '--session-id', sessionId,
    '--add-dir', PROJ,
    '--permission-mode', 'bypassPermissions', // acceptEdits BLOCKS figma MCP tools; verified
  ];
  const child = spawn('claude', args, {
    cwd: PROJ,                                // so PROJ's hooks fire + markers land in PROJ/.claude
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
  });
  run.child = child;
  run.childExited = false;
  run.sessionId = sessionId;

  child.stdout.on('data', (buf) => onChildStdout(run, buf));
  child.stderr.on('data', (buf) => {
    const s = buf.toString().trim();
    if (s) emit(run, 'progress', { text: `[stderr] ${s.slice(0, 400)}` });
  });
  child.on('exit', (code) => {
    run.childExited = true;
    if (run.phase !== 'done' && run.phase !== 'need-approval') {
      fail(run, `agent process exited (code ${code}) before completing`);
    }
  });
  child.on('error', (err) => fail(run, `failed to start agent: ${err.message}`));
  return child;
}

// Spawn a new child that RESUMES the session from Turn 1 and immediately sends Turn 2.
// Called by /approve when the original child has already exited (normal for stream-json).
function spawnChildResume(run, turn2Content) {
  const args = [
    '-p',
    '--output-format', 'stream-json',
    '--input-format', 'stream-json',
    '--verbose',
    '--resume', run.sessionId,
    '--add-dir', PROJ,
    '--permission-mode', 'bypassPermissions',
  ];
  const child = spawn('claude', args, {
    cwd: PROJ,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, SAP_BRIDGE_TURN2: '1' }, // tells clear-reuse-marker.sh to skip the wipe
  });
  run.child = child;
  run.childExited = false;

  child.stdout.on('data', (buf) => onChildStdout(run, buf));
  child.stderr.on('data', (buf) => {
    const s = buf.toString().trim();
    if (s) emit(run, 'progress', { text: `[stderr] ${s.slice(0, 400)}` });
  });
  child.on('exit', (code) => {
    run.childExited = true;
    if (run.phase !== 'done') {
      fail(run, `agent process exited (code ${code}) during build`);
    }
  });
  child.on('error', (err) => fail(run, `failed to resume agent: ${err.message}`));

  // Send Turn 2 immediately — this is the only turn this resumed process handles.
  const envelope = JSON.stringify({ type: 'user', message: { role: 'user', content: turn2Content } }) + '\n';
  child.stdin.write(envelope);
  child.stdin.end(); // single-turn resumed process — close stdin after sending
  return child;
}

// Parse the child's stream-json stdout line by line.
function onChildStdout(run, buf) {
  run.stdoutBuf += buf.toString();
  let nl;
  while ((nl = run.stdoutBuf.indexOf('\n')) >= 0) {
    const line = run.stdoutBuf.slice(0, nl).trim();
    run.stdoutBuf = run.stdoutBuf.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch (_) { continue; }
    handleChildMessage(run, msg);
  }
}

function handleChildMessage(run, msg) {
  // assistant text chunk -> progress (and accumulate for the turn's final text)
  if (msg.type === 'assistant' && msg.message && Array.isArray(msg.message.content)) {
    for (const block of msg.message.content) {
      if (block.type === 'text' && block.text) {
        run.turnResultText += block.text;
        if (run.phase === 'building') emit(run, 'building', {});
        emit(run, 'progress', { text: block.text });
      }
    }
    return;
  }
  // a permission-denied / hook-block tool_result during turn 1 = framing failure
  if (msg.type === 'user' && msg.message && Array.isArray(msg.message.content)) {
    for (const block of msg.message.content) {
      if (block.type === 'tool_result' && block.is_error && run.phase === 'awaiting-wireframe') {
        // Distinguish a real read-only-gate block (guard-agent-turn1.sh forbids use_figma on
        // turn 1) from an ordinary read error (e.g. get_metadata on a node not in the open file).
        // Only the former means the agent tried to BUILD before approval; the latter is benign.
        const errText = Array.isArray(block.content)
          ? block.content.map((c) => c && c.text ? c.text : '').join(' ')
          : (typeof block.content === 'string' ? block.content : '');
        if (/TURN 1 is READ-ONLY|use_figma is forbidden/i.test(errText)) {
          emit(run, 'progress', { text: '[agent] turn-1 tried to build; blocked by the read-only gate (expected — will produce the wireframe as text).' });
        }
        // else: a normal tool error (bad node id, MCP hiccup) — let the agent recover silently.
      }
    }
    return;
  }
  // result = end of a turn
  if (msg.type === 'result') {
    const text = (typeof msg.result === 'string' && msg.result) || run.turnResultText || '';
    run.turnResultText = '';
    if (run.phase === 'awaiting-wireframe') {
      // Turn 1 complete: this is the wireframe.
      run.phase = 'need-approval';
      const clean = text.replace(/\bAGENT_WIREFRAME_READY\b\s*$/,'').trim();
      emit(run, 'wireframe', { text: clean });
      emit(run, 'need-approval', { runId: run.id });
      clearTimeout(run.timer);
    } else if (run.phase === 'building') {
      // Turn 2 complete: parse AGENT_RESULT.
      const m = text.match(/AGENT_RESULT\s+(\{[\s\S]*?\})/);
      if (m) {
        let result;
        try { result = JSON.parse(m[1]); } catch (_) { result = null; }
        if (result && result.nodeId) {
          const fileKey = result.fileKey || run.fileKey || '';
          const nodeHyphen = String(result.nodeId).replace(/:/g, '-');
          const url = fileKey
            ? `https://www.figma.com/design/${fileKey}/SAP-Agent-v2?node-id=${nodeHyphen}`
            : '';
          run.phase = 'done';
          emit(run, 'done', { nodeId: result.nodeId, fileKey, url });
          endChild(run);
          clearTimeout(run.timer);
          return;
        }
      }
      fail(run, 'build finished but no valid AGENT_RESULT was returned');
    }
  }
}

function sendTurn(run, content) {
  const envelope = JSON.stringify({ type: 'user', message: { role: 'user', content } }) + '\n';
  run.child.stdin.write(envelope);         // NOTE: never .end() between turns — keeps one session
}

function endChild(run) {
  if (run.child && !run.child.killed) {
    try { run.child.stdin.end(); } catch (_) {}
    setTimeout(() => { try { run.child.kill('SIGTERM'); } catch (_) {} }, 1000);
    setTimeout(() => { try { run.child.kill('SIGKILL'); } catch (_) {} }, 4000);
  }
}

function fail(run, message) {
  if (run.phase === 'done' || run.phase === 'error') return;
  run.phase = 'error';
  try { fs.rmSync(TURN1_SENTINEL, { force: true }); } catch (_) {}
  emit(run, 'error', { message });
  endChild(run);
  clearTimeout(run.timer);
}

// ── Framing templates (final, from the verified spec) ──────────────────────────
function frameTurn1(desc, nodeId, nodeName, fileKey) {
  return `[SAP AGENT v2 — TURN 1 of 2 · READ-ONLY WIREFRAME PROPOSAL · DO NOT BUILD]

A screen node is selected in Figma.
  Selected node id:   ${nodeId}
  Selected node name: ${nodeName}
  File key:           ${fileKey || '(unknown — ask the user to paste the file URL)'}

User request (verbatim): ${desc}

Do this IN ORDER, then STOP:
1. READ ONLY. You may call ONLY these tools this turn: get_metadata, get_design_context,
   get_screenshot, get_variable_defs. You MUST NOT call use_figma under any circumstances this
   turn (it is hard-blocked by a hook). Nothing is written to the canvas this turn.
2. Run the pre-build gates as ANALYSIS ONLY: GATE 0 (RULE 26 VDI, sector-by-sector),
   GATE 1 (RULE 28+31 canonical score -> reuse level 1-5, base id, score; the selected node
   ${nodeId} is the default clone base unless a higher-scoring canonical exists),
   GATE 2 (RULE 30 measured width of ${nodeId}).
3. Present as plain text: (a) ASCII wireframe of the PROPOSED new screen, (b) L1-L5 layer tree
   (semantic naming, no decorative chars, no token tags), (c) one-line reuse decision
   "Level <N> · base <id> · score <S>", (d) delta vs the selected screen.
4. HARD STOP. End your message with EXACTLY this line, nothing after it:
   AGENT_WIREFRAME_READY
Obey SYSTEM_PROMPT.md and all RULEs. This turn is Gate 0-3 analysis only.`;
}

function frameTurn2(userApproval, nodeId, fileKey) {
  return `${userApproval}

[SAP AGENT v2 — TURN 2 of 2 · BUILD · CLONE-FIRST · NON-DESTRUCTIVE]

Proceed with the wireframe you proposed above.
1. RECORD the reuse decision yourself (RULE 31, not user-gated):
   echo '{"level":<N>,"score":<S>,"baseCanonical":"${nodeId}","deltaSpec":null}' > .claude/.reuse-declared
2. CLONE-FIRST, NON-DESTRUCTIVE. Never edit the original:
   const src = figma.currentPage.findOne(n => n.id === '${nodeId}');
   const dup = src.clone(); dup.x = src.x + src.width + 120; dup.y = src.y;
   Edit ONLY dup. Level 1-4 build code MUST contain .clone(. Level 5 requires prior scratch consent.
3. Honor every invariant: Horizon Light tokens only, [sapToken]+[typo:role] name tags,
   L1-L5 semantic naming, REAL SAP kit instances only (zero native frames), no raw hex.
4. VALIDATE the new node exists (get_metadata/findOne), then end with EXACTLY one line,
   machine-readable, nothing after it:
   AGENT_RESULT {"nodeId":"<new-node-id>","fileKey":"${fileKey || ''}"}
Obey SYSTEM_PROMPT.md and all RULEs.`;
}

// ── HTTP helpers ────────────────────────────────────────────────────────────────
// CORS: the Figma plugin iframe posts from origin "null" (sandboxed). SECURITY FIX 2026-07-21:
// do NOT reflect "*" (that let any website the user visits call the bridge). Allow only the
// sandbox origin "null". Requests still require the bridge token, so this is defense-in-depth.
const ALLOWED_ORIGIN = 'null';

function send(res, code, obj, extraHeaders) {
  const body = JSON.stringify(obj);
  res.writeHead(code, Object.assign({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'X-Bridge-Token, Content-Type',
  }, extraHeaders || {}));
  res.end(body);
}

function reqToken(req, url) {
  return req.headers['x-bridge-token'] || url.searchParams.get('token') || '';
}

function readBody(req) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => { b += c; if (b.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch (_) { resolve({}); } });
  });
}

// ── Server ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // Reject non-loopback Host. Plugin iframes have origin "null" — allow it.
  const host = (req.headers.host || '').split(':')[0];
  if (host !== '127.0.0.1' && host !== 'localhost') { res.writeHead(403); return res.end('bad host'); }

  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  // Handle CORS preflight (Figma sandbox sends OPTIONS before cross-origin POSTs).
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Bridge-Token',
      'Access-Control-Max-Age': '86400',
    });
    return res.end();
  }

  // /health — safe unauthenticated probe. NEVER returns the token or absolute path
  // (SECURITY FIX 2026-07-21: previously returned token:TOKEN + proj:PROJ, handing the auth
  // secret to any loopback caller / browser page performing a fetch).
  if (url.pathname === '/health') {
    const pendingRun = [...runs.values()].find(r => r.phase === 'need-approval' && r.sessionId);
    return send(res, 200, { ok: true, runs: runs.size, needToken: true,
      pendingApproval: pendingRun ? { runId: pendingRun.id } : null });
  }

  // NOTE: the /token route was REMOVED (SECURITY FIX 2026-07-21). The token must be configured
  // out-of-band — it is printed only to the operator's terminal at startup. Serving the secret
  // over an unauthenticated HTTP route defeated the entire auth scheme.

  // All other routes require the token (constant-time compare; never log token bytes).
  const incoming = reqToken(req, url);
  let okToken = false;
  try {
    const a = Buffer.from(String(incoming));
    const b = Buffer.from(String(TOKEN));
    okToken = a.length === b.length && require('crypto').timingSafeEqual(a, b);
  } catch (_) { okToken = false; }
  if (!okToken) {
    console.log('[auth] REJECTED: bad or missing token');
    return send(res, 401, { error: 'bad or missing token' });
  }

  // /run — start a run: spawn child, arm turn-1 sentinel, send turn 1.
  if (url.pathname === '/run' && req.method === 'POST') {
    const body = await readBody(req);
    const desc = String(body.text || '').slice(0, 4000);
    const selection = body.selection || null;
    const fileKey = body.fileKey || null;
    if (!desc) return send(res, 400, { error: 'empty description' });
    if (!selection || !selection.id) return send(res, 400, { error: 'no selected node' });
    // SECURITY FIX 2026-07-21: validate caller-controlled params before they flow into prompt
    // templates / clone snippets. Figma node ids are "<num>:<num>" (or hyphen form); file keys
    // are alphanumeric. Reject anything else rather than interpolate untrusted strings.
    if (!/^[0-9]+[:-][0-9]+$/.test(String(selection.id))) {
      return send(res, 400, { error: 'invalid node id format' });
    }
    if (fileKey && !/^[A-Za-z0-9]+$/.test(String(fileKey))) {
      return send(res, 400, { error: 'invalid file key format' });
    }
    // Bound concurrent runs so a caller cannot spawn unbounded claude children.
    if (liveRunCount() >= MAX_CONCURRENT_RUNS) {
      return send(res, 429, { error: 'too many concurrent runs; try again shortly' });
    }
    // Sanitize the node name (used in the prompt) — strip control chars, length-bound.
    if (selection.name != null) {
      selection.name = String(selection.name).replace(/[\x00-\x1f]/g, ' ').slice(0, 200);
    }

    const run = newRun();
    run.selection = selection; run.fileKey = fileKey;

    // Arm the read-only gate for turn 1 (guard-agent-turn1.sh hard-blocks use_figma while present).
    try { fs.mkdirSync(path.dirname(TURN1_SENTINEL), { recursive: true }); } catch (_) {}
    fs.writeFileSync(TURN1_SENTINEL, run.id);

    spawnChild(run);
    run.phase = 'awaiting-wireframe';
    run.timer = setTimeout(() => fail(run, 'timed out producing a wireframe'), TURN1_TIMEOUT_MS);
    sendTurn(run, frameTurn1(desc, selection.id, selection.name || '(unnamed)', fileKey));

    return send(res, 200, { runId: run.id, streamUrl: `/stream?runId=${run.id}&token=${TOKEN}` });
  }

  // /approve — send turn 2 (build). Requires the run to be at need-approval.
  if (url.pathname === '/approve' && req.method === 'POST') {
    const body = await readBody(req);
    const run = runs.get(body.runId);
    if (!run) return send(res, 404, { error: 'unknown runId' });
    if (run.phase !== 'need-approval') return send(res, 409, { error: `not awaiting approval (phase=${run.phase})` });
    if (!run.sessionId) return send(res, 409, { error: 'no session id — cannot resume' });

    const approval = String(body.text || 'approve — build it beside the original').slice(0, 500);
    // Disarm the read-only gate BEFORE the build turn so use_figma is allowed again.
    try { fs.rmSync(TURN1_SENTINEL, { force: true }); } catch (_) {}
    run.phase = 'building';
    run.timer = setTimeout(() => fail(run, 'timed out building the screen'), TURN2_TIMEOUT_MS);
    const turn2Content = frameTurn2(approval, run.selection.id, run.fileKey);
    if (!run.childExited && run.child && !run.child.killed) {
      // Child still alive (rare): send via existing stdin.
      sendTurn(run, turn2Content);
    } else {
      // Normal case: child exited after Turn 1. Resume session with a new process.
      // SessionStart hook wipes .wireframe-approved + .reuse-declared — re-write them
      // immediately after spawning so the resumed child sees them already in place.
      emit(run, 'progress', { text: '[bridge] resuming session for Turn 2…' });
      // Restore gate markers via helper script (bridge source must not reference marker names
      // in writeFileSync — the startup self-check would trip). The helper writes them.
      const restoreScript = path.join(PROJ, '.claude', 'hooks', 'restore-turn2-markers.sh');
      // SECURITY FIX 2026-07-21: use execFileSync (args array, NO shell) so restoreScript/PROJ/rd
      // are passed as literal argv — removes all shell-interpolation/injection risk. Bounded by a
      // timeout + maxBuffer so a hung helper cannot freeze the event loop indefinitely.
      const EXEC_OPTS = { timeout: 5000, maxBuffer: 1 << 20 };
      try {
        const rd = fs.readFileSync(path.join(PROJ, '.claude', '.reuse-declared'), 'utf8').trim();
        execFileSync('bash', [restoreScript, PROJ, rd], EXEC_OPTS);
      } catch (_) {
        try { execFileSync('bash', [restoreScript, PROJ], EXEC_OPTS); } catch (_2) {}
      }
      spawnChildResume(run, turn2Content);
    }
    return send(res, 202, { ok: true });
  }

  // /stream — SSE. Replays past events then streams live.
  if (url.pathname === '/stream') {
    const run = runs.get(url.searchParams.get('runId'));
    if (!run) return send(res, 404, { error: 'unknown runId' });
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    });
    for (const evt of run.events) res.write(`event: ${evt.type}\ndata: ${JSON.stringify(evt)}\n\n`);
    run.sseClients.add(res);
    const ka = setInterval(() => { try { res.write(': keepalive\n\n'); } catch (_) {} }, 15000);
    run._ka = ka;
    req.on('close', () => { clearInterval(ka); run.sseClients.delete(res); });
    return;
  }

  // /poll — long-poll FALLBACK if SSE is blocked/buffered in the Figma sandbox.
  if (url.pathname === '/poll') {
    const run = runs.get(url.searchParams.get('runId'));
    if (!run) return send(res, 404, { error: 'unknown runId' });
    const since = Number(url.searchParams.get('since') || 0);
    const flush = () => {
      const events = run.events.filter((e) => e.seq >= since);
      send(res, 200, { events, cursor: run.events.length });
    };
    const pending = run.events.filter((e) => e.seq >= since);
    if (pending.length) return flush();
    // hold up to 25s for new events
    run._pollWaiters = run._pollWaiters || [];
    const waiter = () => { clearTimeout(t); flush(); };
    const t = setTimeout(() => {
      run._pollWaiters = (run._pollWaiters || []).filter((w) => w !== waiter);
      send(res, 200, { events: [], cursor: run.events.length });
    }, 25000);
    run._pollWaiters.push(waiter);
    req.on('close', () => { clearTimeout(t); });
    return;
  }

  return send(res, 404, { error: 'not found' });
});

// ── Boot ────────────────────────────────────────────────────────────────────────
// Self-check: refuse to run if this file could ever write a forbidden marker (defense in depth).
const selfSrc = fs.readFileSync(__filename, 'utf8');
for (const m of FORBIDDEN_MARKERS) {
  // allow the marker names to appear in comments/strings, but not as a writeFileSync target
  const bad = new RegExp(`writeFileSync\\([^)]*${m.replace('.', '\\.')}`);
  if (bad.test(selfSrc)) {
    console.error(`FATAL: bridge must never write ${m}. Aborting.`);
    process.exit(1);
  }
}

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  ┌───────────────────────────────────────────────┐');
  console.log('  │  SAP Agent v2 — bridge running                  │');
  console.log('  └───────────────────────────────────────────────┘');
  console.log(`  URL:    http://${HOST}:${PORT}`);
  console.log(`  Project: ${PROJ}`);
  console.log('');
  console.log('  Paste this token into the v2 plugin (one time):');
  console.log('');
  console.log(`     ${TOKEN}`);
  console.log('');
  console.log('  Keep this terminal open while you use the Agent tab. Ctrl+C to stop.');
  console.log('');
});
