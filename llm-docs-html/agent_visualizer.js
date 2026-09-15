/**
 * agent_visualizer.js
 * Interactive widgets for the Agent Engineering pages.
 *
 * Usage: <div class="viz" data-viz="agent-loop"></div>
 * Each widget is self-contained vanilla JS. No dependencies.
 */

(function () {
    'use strict';

    // ---------------------------------------------------------------- styles
    const CSS = `
.viz{border:1px solid #d1d5da;border-radius:8px;background:#fff;margin:1.4em 0;overflow:hidden}
.viz-head{background:#f6f8fa;border-bottom:1px solid #e1e4e8;padding:9px 14px;font-weight:600;font-size:.92em;
  display:flex;justify-content:space-between;align-items:center;gap:10px}
.viz-head .viz-hint{font-weight:400;color:#57606a;font-size:.88em}
.viz-body{padding:14px}
.viz-ctl{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:12px;
  padding-bottom:12px;border-bottom:1px dashed #e1e4e8}
.viz-ctl label{font-size:.85em;color:#24292f;display:flex;align-items:center;gap:6px}
.viz-ctl input[type=range]{width:110px;vertical-align:middle}
.viz-btn{background:#3366cc;color:#fff;border:0;border-radius:5px;padding:6px 13px;
  font-size:.86em;cursor:pointer;font-weight:600}
.viz-btn:hover{opacity:.88}
.viz-btn[disabled]{background:#c7ccd1;cursor:not-allowed}
.viz-btn.ghost{background:#fff;color:#3366cc;border:1px solid #adb9c5}
.viz-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid #e1e4e8;
  border-radius:6px;margin-bottom:6px;font-size:.87em;background:#fff;transition:all .25s}
.viz-row .grow{flex:1}
.viz-tag{font-size:.75em;padding:1px 7px;border-radius:10px;font-weight:600;white-space:nowrap}
.t-stable{background:#dbf0e0;color:#1a7f37}
.t-vol{background:#ffe9e0;color:#bc4c00}
.t-ok{background:#dbf0e0;color:#1a7f37}
.t-amb{background:#fff3cd;color:#8a6100}
.t-bad{background:#ffe0e0;color:#b42318}
.viz-cached{background:#f0f9f2;border-color:#9fd6ad}
.viz-billed{background:#fff8f5;border-color:#f0c2ad}
.viz-stat{display:flex;flex-wrap:wrap;gap:18px;padding:10px 12px;background:#f6f8fa;
  border-radius:6px;margin-top:10px;font-size:.87em}
.viz-stat b{display:block;font-size:1.25em;color:#24292f;font-weight:700;line-height:1.3}
.viz-stat span{color:#57606a;font-size:.85em}
.viz-note{font-size:.85em;color:#57606a;margin-top:10px;line-height:1.5}
.viz-note.good{color:#1a7f37}
.viz-note.bad{color:#b42318}
.viz-bar{height:9px;border-radius:5px;background:#e8eaed;overflow:hidden;margin-top:5px}
.viz-bar i{display:block;height:100%;background:#3366cc;transition:width .35s}
.viz-bar i.warn{background:#e0a800}
.viz-bar i.bad{background:#d1242f}
.viz-mini{font-size:.78em;color:#57606a}
.viz-stage{display:flex;align-items:center;gap:9px;margin-bottom:5px;font-size:.85em}
.viz-stage .nm{width:170px;flex-shrink:0}
.viz-stage .ct{width:88px;text-align:right;font-variant-numeric:tabular-nums;flex-shrink:0}
.viz-stage .cost{width:74px;text-align:right;color:#57606a;font-variant-numeric:tabular-nums;flex-shrink:0}
.viz-stage.off{opacity:.38}
.viz-pill{display:inline-block;padding:2px 9px;border-radius:11px;font-size:.8em;font-weight:600}
.viz-path{padding:9px 12px;border-radius:6px;font-size:.88em;margin-top:9px;font-weight:600}
.p-auto{background:#dbf0e0;color:#1a7f37}
.p-appr{background:#fff3cd;color:#8a6100}
.p-block{background:#ffe0e0;color:#b42318}
.viz-tl{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:9px}
.viz-ev{padding:4px 9px;border-radius:5px;font-size:.78em;border:1px solid #e1e4e8;background:#fff;white-space:nowrap}
.viz-ev.done{background:#eef6ff;border-color:#9dc4f0}
.viz-ev.replay{background:#fff8e6;border-color:#e0c26a}
.viz-ev.now{background:#3366cc;color:#fff;border-color:#3366cc}
.viz-ev.dead{background:#ffe0e0;border-color:#f0a0a0;text-decoration:line-through}
@media (max-width:640px){.viz-stage .nm{width:110px}.viz-ctl{gap:9px}}
`;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const $ = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
    const money = (n) => '$' + (n < 1 ? n.toFixed(4) : n.toFixed(2));
    const num = (n) => n.toLocaleString('en-US');

    function shell(el, title, hint) {
        el.classList.add('viz');
        el.innerHTML = `<div class="viz-head"><span>${title}</span><span class="viz-hint">${hint}</span></div>
      <div class="viz-body"></div>`;
        return el.querySelector('.viz-body');
    }

    // ============================================== 1. prompt order + caching
    function promptCache(el) {
        const body = shell(el, 'Prompt ordering and the prefix cache',
            'Move blocks. Watch the cache boundary.');
        let blocks = [
            { n: 'Retrieved evidence', t: 6000, vol: true },
            { n: 'Instructions', t: 800, vol: false },
            { n: 'Tool schemas', t: 600, vol: false },
            { n: 'Resources (schema snapshot)', t: 1200, vol: false },
            { n: 'Skill body (loaded on trigger)', t: 1500, vol: true }
        ];
        const IN = 3.0 / 1e6, CACHE = 0.30 / 1e6;  // per-token, read price is ~10%

        body.innerHTML = `<div class="viz-ctl">
        <button class="viz-btn ghost" data-a="best">Sort by volatility</button>
        <button class="viz-btn ghost" data-a="worst">Worst order</button>
      </div><div class="rows"></div><div class="viz-stat"></div><div class="viz-note"></div>`;

        function render() {
            let firstVol = blocks.findIndex(b => b.vol);
            if (firstVol === -1) firstVol = blocks.length;
            const rows = body.querySelector('.rows');
            rows.innerHTML = '';
            blocks.forEach((b, i) => {
                const cached = i < firstVol;
                const r = $(`<div class="viz-row ${cached ? 'viz-cached' : 'viz-billed'}">
          <span class="viz-tag ${b.vol ? 't-vol' : 't-stable'}">${b.vol ? 'volatile' : 'stable'}</span>
          <span class="grow">${b.n}</span>
          <span class="viz-mini">${num(b.t)} tok</span>
          <span class="viz-mini">${cached ? '✓ cached' : 'full price'}</span>
          <button class="viz-btn ghost" data-up="${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button class="viz-btn ghost" data-dn="${i}" ${i === blocks.length - 1 ? 'disabled' : ''}>↓</button>
        </div>`);
                rows.appendChild(r);
            });

            const cachedTok = blocks.slice(0, firstVol).reduce((s, b) => s + b.t, 0);
            const fullTok = blocks.slice(firstVol).reduce((s, b) => s + b.t, 0);
            const total = cachedTok + fullTok;
            const cost = cachedTok * CACHE + fullTok * IN;
            const worst = total * IN;
            const pct = Math.round(cachedTok / total * 100);

            body.querySelector('.viz-stat').innerHTML = `
        <div><b>${pct}%</b><span>of prompt cached</span></div>
        <div><b>${num(cachedTok)}</b><span>cached tokens</span></div>
        <div><b>${num(fullTok)}</b><span>billed in full</span></div>
        <div><b>${money(cost * 1000)}</b><span>per 1,000 calls</span></div>
        <div><b>${money((worst - cost) * 1000)}</b><span>saved vs worst order</span></div>`;

            // Best achievable = every stable block above every volatile one.
            const bestTok = blocks.filter(b => !b.vol).reduce((s, b) => s + b.t, 0);
            const note = body.querySelector('.viz-note');
            if (cachedTok === 0) {
                note.className = 'viz-note bad';
                note.textContent = 'A volatile block sits at the top, so nothing below it can be cached. The prefix must match byte for byte.';
            } else if (cachedTok === bestTok) {
                note.className = 'viz-note good';
                note.textContent = `Optimal. Every stable block sits above the first volatile one, so all ${num(bestTok)} of them are reused across calls. This is the most this prompt can cache.`;
            } else {
                note.className = 'viz-note';
                note.textContent = `Better, but ${num(bestTok - cachedTok)} stable tokens are still stranded below a volatile block. The cache boundary sits at the first volatile block.`;
            }
        }

        body.addEventListener('click', e => {
            const t = e.target;
            if (t.dataset.up !== undefined) { const i = +t.dataset.up;[blocks[i - 1], blocks[i]] = [blocks[i], blocks[i - 1]]; render(); }
            if (t.dataset.dn !== undefined) { const i = +t.dataset.dn;[blocks[i + 1], blocks[i]] = [blocks[i], blocks[i + 1]]; render(); }
            if (t.dataset.a === 'best') { blocks.sort((a, b) => a.vol - b.vol); render(); }
            if (t.dataset.a === 'worst') { blocks.sort((a, b) => b.vol - a.vol); render(); }
        });
        render();
    }

    // ================================================== 2. bounded agent loop
    function agentLoop(el) {
        const body = shell(el, 'The diagnosis loop', 'Step through it. Watch which exit fires.');
        const SOURCES = ['search_logs', 'search_docs', 'load_skill', 'recall_similar_failures'];
        // Fixed scenario so the lesson is repeatable; reshuffle changes it.
        let scenario, iter, kept, seen, calls, stopped, reason;

        function build(seedShift) {
            const grades = [
                ['correct', 'ambiguous', 'incorrect'],
                ['ambiguous', 'ambiguous', 'incorrect'],
                ['correct', 'correct', 'ambiguous'],
                ['incorrect', 'incorrect', 'incorrect']
            ];
            scenario = grades.map((g, i) => ({
                src: SOURCES[(i + seedShift) % 4],
                items: g.map((gr, j) => ({ id: `e${i}${j}`, grade: gr }))
            }));
        }
        function reset() { iter = 0; kept = []; seen = new Set(); calls = 0; stopped = false; reason = ''; render(); }

        body.innerHTML = `<div class="viz-ctl">
        <label>max iterations <input type="range" min="1" max="4" value="4" data-k="mi"><b data-v="mi">4</b></label>
        <label>stop at correct <input type="range" min="1" max="4" value="3" data-k="mc"><b data-v="mc">3</b></label>
        <button class="viz-btn" data-a="step">Next iteration</button>
        <button class="viz-btn ghost" data-a="run">Run to end</button>
        <button class="viz-btn ghost" data-a="reset">Reset</button>
        <button class="viz-btn ghost" data-a="shuffle">New failure</button>
      </div><div class="viz-tl"></div><div class="rows"></div>
      <div class="viz-stat"></div><div class="viz-note"></div>`;

        const getMI = () => +body.querySelector('[data-k=mi]').value;
        const getMC = () => +body.querySelector('[data-k=mc]').value;

        function step() {
            if (stopped) return;
            const MI = getMI(), MC = getMC();
            if (iter >= MI) { stopped = true; reason = `Hit the iteration cap (${MI}).`; return render(); }
            const batch = scenario[iter % scenario.length];
            const fresh = batch.items.filter(i => !seen.has(i.id));
            calls += 1;                                   // tool-choice call
            if (!fresh.length) { stopped = true; reason = 'No new evidence. The corpora have nothing more.'; return render(); }
            fresh.forEach(i => seen.add(i.id));
            calls += 1;                                   // one batched grade call
            kept.push(...fresh.filter(i => i.grade !== 'incorrect').map(i => ({ ...i, src: batch.src })));
            iter++;
            const nCorrect = kept.filter(k => k.grade === 'correct').length;
            if (nCorrect >= MC) { stopped = true; reason = `Sufficiency: ${nCorrect} item${nCorrect === 1 ? '' : 's'} graded correct.`; }
            else if (iter >= MI) { stopped = true; reason = `Hit the iteration cap (${MI}).`; }
            render();
        }

        function render() {
            const MI = getMI(), MC = getMC();
            body.querySelector('[data-v=mi]').textContent = MI;
            body.querySelector('[data-v=mc]').textContent = MC;

            const tl = body.querySelector('.viz-tl'); tl.innerHTML = '';
            for (let i = 0; i < MI; i++) {
                const cls = i < iter ? 'done' : (i === iter && !stopped ? 'now' : '');
                tl.appendChild($(`<span class="viz-ev ${cls}">iter ${i + 1}</span>`));
            }
            if (stopped) tl.appendChild($(`<span class="viz-ev done">propose</span>`));

            const rows = body.querySelector('.rows'); rows.innerHTML = '';
            if (!kept.length) rows.innerHTML = '<div class="viz-mini">No evidence kept yet.</div>';
            kept.forEach(k => rows.appendChild($(`<div class="viz-row">
        <span class="viz-tag ${k.grade === 'correct' ? 't-ok' : 't-amb'}">${k.grade}</span>
        <span class="grow"><code>${k.src}</code></span><span class="viz-mini">${k.id}</span></div>`)));

            const nCorrect = kept.filter(k => k.grade === 'correct').length;
            const totalCalls = calls + (stopped ? 1 : 0);
            const cost = totalCalls * 0.0055;
            body.querySelector('.viz-stat').innerHTML = `
        <div><b>${iter}/${MI}</b><span>iterations</span></div>
        <div><b>${nCorrect}/${MC}</b><span>correct, needed</span></div>
        <div><b>${totalCalls}</b><span>LLM calls (ceiling ${MI * 2 + 1})</span></div>
        <div><b>${money(cost)}</b><span>cost so far</span></div>`;

            const note = body.querySelector('.viz-note');
            if (!stopped) { note.className = 'viz-note'; note.textContent = 'Running. Three exits compete: enough correct evidence, no new evidence, or the cap.'; }
            else if (!kept.length) { note.className = 'viz-note bad'; note.textContent = reason + ' Nothing was kept, so the loop returns a typed ESCALATE — not a guess.'; }
            else { note.className = 'viz-note good'; note.textContent = reason + ' The loop proposes one typed action and returns.'; }

            body.querySelector('[data-a=step]').disabled = stopped;
            body.querySelector('[data-a=run]').disabled = stopped;
        }

        body.addEventListener('click', e => {
            const a = e.target.dataset.a;
            if (a === 'step') step();
            if (a === 'run') { let g = 0; while (!stopped && g++ < 20) step(); }
            if (a === 'reset') reset();
            if (a === 'shuffle') { build(Math.floor(Math.random() * 4)); reset(); }
        });
        body.addEventListener('input', e => { if (e.target.dataset.k) reset(); });
        build(0); reset();
    }

    // ============================================ 3. durable replay + retries
    function durableReplay(el) {
        const body = shell(el, 'Crash, replay, and the duplicate solve',
            'Kill the worker mid-run. Toggle idempotency.');
        const STEPS = [
            { n: 'plan_run', cost: 0 },
            { n: 'execute_step(mesh)', cost: 0 },
            { n: 'poll_method_state', cost: 0 },
            { n: 'execute_step(solve)', cost: 1, solver: true },
            { n: 'poll_method_state', cost: 0 },
            { n: 'write_memory', cost: 0 }
        ];
        let at, killedAt, replaying, solverHours, note;

        function reset() { at = 0; killedAt = -1; replaying = false; solverHours = 0; note = ''; render(); }

        body.innerHTML = `<div class="viz-ctl">
        <label><input type="checkbox" data-k="idem" checked> idempotency key</label>
        <button class="viz-btn" data-a="step">Advance</button>
        <button class="viz-btn ghost" data-a="kill">💥 Kill worker</button>
        <button class="viz-btn ghost" data-a="reset">Reset</button>
      </div><div class="viz-tl"></div><div class="viz-stat"></div><div class="viz-note"></div>`;

        function render() {
            const tl = body.querySelector('.viz-tl'); tl.innerHTML = '';
            STEPS.forEach((s, i) => {
                let cls = '';
                if (killedAt >= 0 && i < killedAt) cls = replaying ? 'replay' : 'done';
                else if (i < at) cls = 'done';
                if (i === at && killedAt < 0) cls = 'now';
                if (i === killedAt) cls = 'dead';
                tl.appendChild($(`<span class="viz-ev ${cls}">${s.n}</span>`));
            });
            body.querySelector('.viz-stat').innerHTML = `
        <div><b>${Math.min(at, STEPS.length)}/${STEPS.length}</b><span>activities complete</span></div>
        <div><b>${solverHours.toFixed(1)}</b><span>solver-hours charged</span></div>
        <div><b>${killedAt >= 0 ? 'yes' : 'no'}</b><span>crashed this run</span></div>`;
            const n = body.querySelector('.viz-note');
            n.className = 'viz-note' + (note.startsWith('⚠') ? ' bad' : note ? ' good' : '');
            n.innerHTML = note || 'Advance a few steps, then kill the worker while the solve is running.';
            body.querySelector('[data-a=step]').disabled = at >= STEPS.length;
        }

        body.addEventListener('click', e => {
            const a = e.target.dataset.a;
            const idem = body.querySelector('[data-k=idem]').checked;
            if (a === 'step') {
                if (at < STEPS.length) { if (STEPS[at].solver) solverHours += 1; at++; }
                render();
            }
            if (a === 'kill') {
                if (at === 0 || at > STEPS.length) return;
                killedAt = at - 1; replaying = true;
                const wasSolver = STEPS[killedAt].solver;
                if (wasSolver && !idem) {
                    solverHours += 1;
                    note = '⚠ Replay re-ran the solve. Without an idempotency key the engine cannot tell it already happened, so the cluster is <b>charged twice</b>.';
                } else if (wasSolver && idem) {
                    note = '✓ Replay hit the idempotency ledger, found the recorded handle, and <b>resumed</b> instead of resubmitting. No double charge.';
                } else {
                    note = '✓ A new worker replayed the recorded history and landed exactly where the dead one stopped. Plan, cursor and budget intact.';
                }
                setTimeout(() => { replaying = false; killedAt = -1; render(); }, 1400);
                render();
            }
            if (a === 'reset') reset();
        });
        reset();
    }

    // ================================================== 4. token cost levers
    function tokenLevers(el) {
        const body = shell(el, 'Token levers', 'Toggle each one. Watch the bill.');
        const LEVERS = [
            { k: 'log', n: 'Structure-aware log chunks + residual summary', from: 26000, to: 2400, tier: 'Architectural' },
            { k: 'funnel', n: 'Retrieval funnel on docs (120k → 6 chunks)', from: 16000, to: 4800, tier: 'Architectural' },
            { k: 'graph', n: 'Graph + ontology instead of 20 narratives', from: 12000, to: 150, tier: 'Architectural' },
            { k: 'cache', n: 'Order by volatility (prefix cache on 800 tok)', from: 800, to: 80, tier: 'Assembly' }
        ];
        const ROUTE = { opus: 15 / 1e6, sonnet: 3 / 1e6, haiku: 0.8 / 1e6 };

        body.innerHTML = `<div class="viz-ctl">
        <label>model <select data-k="m">
          <option value="sonnet">Sonnet (mid)</option><option value="opus">Opus (strong)</option>
          <option value="haiku">Haiku (small)</option></select></label>
        <label>diagnoses / month <input type="range" min="100" max="5000" step="100" value="2000" data-k="vol"><b data-v="vol">2,000</b></label>
        <button class="viz-btn ghost" data-a="all">Enable all</button>
        <button class="viz-btn ghost" data-a="none">Disable all</button>
      </div><div class="rows"></div><div class="viz-stat"></div><div class="viz-note"></div>`;

        const on = {}; LEVERS.forEach(l => on[l.k] = false);

        function render() {
            const rows = body.querySelector('.rows'); rows.innerHTML = '';
            LEVERS.forEach(l => {
                const saved = l.from - l.to;
                rows.appendChild($(`<div class="viz-row">
          <input type="checkbox" data-t="${l.k}" ${on[l.k] ? 'checked' : ''}>
          <span class="viz-tag ${l.tier === 'Architectural' ? 't-ok' : 't-amb'}">${l.tier}</span>
          <span class="grow">${l.n}</span>
          <span class="viz-mini">${num(l.from)} → ${num(l.to)}</span>
          <span class="viz-mini"><b>−${num(saved)}</b></span></div>`));
            });

            const price = ROUTE[body.querySelector('[data-k=m]').value];
            const vol = +body.querySelector('[data-k=vol]').value;
            body.querySelector('[data-v=vol]').textContent = num(vol);

            let tok = 0;
            LEVERS.forEach(l => tok += on[l.k] ? l.to : l.from);
            const base = LEVERS.reduce((s, l) => s + l.from, 0);
            const perCall = tok * price, basePer = base * price;
            const pct = Math.round((1 - tok / base) * 100);

            body.querySelector('.viz-stat').innerHTML = `
        <div><b>${num(tok)}</b><span>input tokens / call</span></div>
        <div><b>${pct}%</b><span>smaller than baseline</span></div>
        <div><b>${money(perCall)}</b><span>per diagnosis</span></div>
        <div><b>${money(perCall * vol)}</b><span>per month</span></div>
        <div><b>${money((basePer - perCall) * vol)}</b><span>saved / month</span></div>`;

            const bar = Math.max(2, Math.round(tok / base * 100));
            body.querySelector('.viz-note').innerHTML =
                `<div class="viz-bar"><i class="${bar > 66 ? 'bad' : bar > 33 ? 'warn' : ''}" style="width:${bar}%"></i></div>
         <div style="margin-top:7px">The three architectural levers remove ~${num(base - LEVERS.filter(l => l.tier === 'Architectural').reduce((s, l) => s + l.to, 0) - 800)} tokens between them. Switching model changes the price per token, never the count.</div>`;
        }

        body.addEventListener('change', e => {
            if (e.target.dataset.t) on[e.target.dataset.t] = e.target.checked;
            render();
        });
        body.addEventListener('input', render);
        body.addEventListener('click', e => {
            if (e.target.dataset.a === 'all') { LEVERS.forEach(l => on[l.k] = true); render(); }
            if (e.target.dataset.a === 'none') { LEVERS.forEach(l => on[l.k] = false); render(); }
        });
        render();
    }

    // ==================================================== 5. guardrail router
    function guardrailGate(el) {
        const body = shell(el, 'Which gate fires?', 'Change the action class and confidence.');
        body.innerHTML = `<div class="viz-ctl">
        <label>action class <select data-k="cls">
          <option value="read_only">read_only</option><option value="mutating" selected>mutating</option>
          <option value="expensive">expensive</option><option value="destructive">destructive</option>
          <option value="ip_sensitive">ip_sensitive</option></select></label>
        <label>confidence <input type="range" min="0" max="100" value="80" data-k="conf"><b data-v="conf">0.80</b></label>
        <label><input type="checkbox" data-k="allow" checked> kind is allow-listed</label>
      </div><div class="rows"></div><div class="viz-path"></div><div class="viz-note"></div>`;

        function render() {
            const cls = body.querySelector('[data-k=cls]').value;
            const conf = +body.querySelector('[data-k=conf]').value / 100;
            const allow = body.querySelector('[data-k=allow]').checked;
            body.querySelector('[data-v=conf]').textContent = conf.toFixed(2);

            const checks = [
                { n: 'Bound to RemediationKind enum', pass: true, why: 'always — the type forbids anything else' },
                { n: 'On the allow-list', pass: allow, why: allow ? 'permitted for this role' : 'blocked before any gate' },
                { n: 'Budget remaining', pass: true, why: 'checked before the call' }
            ];
            const rows = body.querySelector('.rows'); rows.innerHTML = '';
            checks.forEach(c => rows.appendChild($(`<div class="viz-row">
        <span class="viz-tag ${c.pass ? 't-ok' : 't-bad'}">${c.pass ? 'pass' : 'fail'}</span>
        <span class="grow">${c.n}</span><span class="viz-mini">${c.why}</span></div>`)));

            const path = body.querySelector('.viz-path');
            const note = body.querySelector('.viz-note');
            if (!allow) {
                path.className = 'viz-path p-block'; path.textContent = '⛔ Blocked by the allow-list. It never reaches a gate.';
                note.textContent = 'The allow-list runs before confidence is even considered. Default posture is deny.';
            } else if (cls === 'read_only') {
                path.className = 'viz-path p-auto'; path.textContent = '▶ Executes immediately. No gate.';
                note.textContent = 'Read-only actions are not gated at all, whatever the confidence.';
            } else if (cls === 'mutating') {
                if (conf >= 0.75) { path.className = 'viz-path p-auto'; path.textContent = '▶ Auto-executes — mutating, allow-listed, confidence ≥ 0.75.'; }
                else { path.className = 'viz-path p-appr'; path.textContent = '⏸ Waits for approval — confidence below 0.75.'; }
                note.textContent = 'Mutating is the only class where confidence changes the outcome.';
            } else {
                const t = { expensive: '4 h', destructive: '2 h', ip_sensitive: '1 h' }[cls];
                path.className = 'viz-path p-appr';
                path.textContent = `⏸ Always requires approval (${t}, then escalate once, then reject).`;
                note.textContent = 'Raise confidence to 1.00 — nothing changes. The class decides, not the model’s self-assessment. On timeout it fails closed; a destructive action is never auto-approved.';
            }
        }
        body.addEventListener('input', render);
        body.addEventListener('change', render);
        render();
    }

    // ==================================================== 6. retrieval funnel
    function retrievalFunnel(el) {
        const body = shell(el, 'The retrieval funnel', 'Change the scope. See when the reranker stops earning its place.');
        // Scope decides how many candidates survive the free metadata pre-filter.
        const SCOPES = {
            docs: { label: 'Whole docs corpus', corpus: 120000, afterFilter: 8000 },
            solver: { label: 'One solver + version', corpus: 120000, afterFilter: 900 },
            run: { label: 'One run + step (logs)', corpus: 120000, afterFilter: 22 }
        };
        let scope = 'docs';

        body.innerHTML = `<div class="viz-ctl">
        <span style="font-size:.85em">scope:</span>
        ${Object.entries(SCOPES).map(([k, v]) =>
            `<button class="viz-btn ghost" data-s="${k}">${v.label}</button>`).join('')}
        <label>top-k <input type="range" min="3" max="20" value="8" data-k="k"><b data-v="k"></b></label>
        <label><input type="checkbox" data-k="rr" checked> cross-encoder rerank</label>
      </div><div class="rows"></div><div class="viz-stat"></div><div class="viz-note"></div>`;

        function render() {
            const sc = SCOPES[scope];
            const k = +body.querySelector('[data-k=k]').value;
            const rr = body.querySelector('[data-k=rr]').checked;
            body.querySelector('[data-v=k]').textContent = k;
            body.querySelectorAll('[data-s]').forEach(b => {
                const on = b.dataset.s === scope;
                b.style.background = on ? '#3366cc' : '#fff';
                b.style.color = on ? '#fff' : '#3366cc';
            });

            const afterFilter = sc.afterFilter;
            const afterHybrid = Math.min(200, afterFilter);
            const pool = Math.min(50, afterHybrid);          // fused candidate pool
            const graded = Math.min(k, pool);

            const cRR = rr && pool > graded ? 0.002 : 0;
            const cGrade = graded * 0.0021;
            const cAnswer = 0.027;
            const total = cRR + cGrade + cAnswer;

            const stages = [
                ['1 · metadata pre-filter', afterFilter, 0, true],
                ['2 · BM25 + vector', afterHybrid, 0, true],
                ['3 · rank fusion (RRF)', pool, 0, true],
                ['4 · cross-encoder rerank', rr ? graded : pool, cRR, rr],
                ['5 · LLM grade', graded, cGrade, true],
                ['6 · assemble and answer', 1, cAnswer, true]
            ];
            const rows = body.querySelector('.rows'); rows.innerHTML = '';
            const top = Math.max(afterFilter, 1);
            stages.forEach(([n, c, cc, on]) => rows.appendChild($(`<div class="viz-stage ${on ? '' : 'off'}">
        <span class="nm">${n}</span><span class="ct">${num(c)}</span>
        <span class="cost">${cc ? money(cc) : '~$0'}</span>
        <span class="grow"><span class="viz-bar"><i style="width:${Math.max(2, Math.round(Math.log10(c + 1) / Math.log10(top + 1) * 100))}%"></i></span></span></div>`)));

            body.querySelector('.viz-stat').innerHTML = `
        <div><b>${num(sc.corpus)} → ${graded}</b><span>corpus in, graded out</span></div>
        <div><b>${num(pool)}</b><span>pool before rerank</span></div>
        <div><b>${money(total)}</b><span>per query</span></div>
        <div><b>${money(total * 2000)}</b><span>per 2,000 queries</span></div>`;

            const note = body.querySelector('.viz-note');
            const worthIt = pool > 3 * k;
            if (rr && !worthIt) {
                note.className = 'viz-note bad';
                note.textContent = `The pool is ${pool} for a top-${k}, under 3×. The reranker has almost no ordering left to buy, and you still pay its latency and rate limit. Turn it off for this scope.`;
            } else if (!rr && worthIt) {
                note.className = 'viz-note bad';
                note.textContent = `The pool is ${pool} for a top-${k}, well over 3×. Without a reranker the grader sees a worse slate — and grading is the stage that costs real money.`;
            } else if (rr) {
                note.className = 'viz-note good';
                note.textContent = `Pool ${pool} for a top-${k} is over 3×, so reranking buys real ordering before the expensive grading stage.`;
            } else {
                note.className = 'viz-note good';
                note.textContent = `Pre-filtering already narrowed to ${pool} candidates — close to the answer width. Skipping the rerank hop is free here.`;
            }
        }

        body.addEventListener('click', e => {
            if (e.target.dataset.s) { scope = e.target.dataset.s; render(); }
        });
        body.addEventListener('input', render);
        body.addEventListener('change', render);
        render();
    }

    // ------------------------------------------------------------- registry
    const WIDGETS = {
        'prompt-cache': promptCache,
        'agent-loop': agentLoop,
        'durable-replay': durableReplay,
        'token-levers': tokenLevers,
        'guardrail-gate': guardrailGate,
        'retrieval-funnel': retrievalFunnel
    };

    function mountAll() {
        document.querySelectorAll('[data-viz]').forEach(el => {
            if (el.dataset.vizMounted) return;
            const fn = WIDGETS[el.dataset.viz];
            if (!fn) return;
            try { fn(el); el.dataset.vizMounted = '1'; }
            catch (err) { console.error('viz failed:', el.dataset.viz, err); }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
    else mountAll();
})();
