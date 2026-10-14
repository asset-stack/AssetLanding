import React, { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { COND, CondBadge, Kpi, Num, Screen, fmtK, fmtM, useLens } from './kit';

const TONE = { ok: 'var(--bx-ok)', warn: 'var(--bx-c4)', bad: 'var(--bx-alert)' };
const kpi = ([label, value, delta, tone]) => <Kpi key={label} label={label} value={value} delta={delta} tone={TONE[tone]} />;
const FONT = 'Inter Tight, sans-serif';

// ─── Work scheduling ───────────────────────────────────────────────────────

export function MaintenancePanel() {
  const L = useLens();
  const W = L.work;
  const total = W.cols.reduce((a, [, items]) => a + items.length, 0);
  return (
    <Screen title={W.title} meta={W.meta}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">{W.kpis.map(kpi)}</div>
      <div className="mt-2.5 grid md:grid-cols-3 gap-2.5">
        {W.cols.map(([name, items]) => (
          <div key={name} className="tile p-3">
            <div className="flex items-center justify-between px-1 mb-2 gap-2">
              <span className="text-[11px] mute truncate">{name}</span>
              <span className="mono text-[10.5px] dim">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(([id, t, site, c, kind]) => (
                <div key={id} className={`rounded-[10px] border p-3 ${c === 5 ? 'border-[rgba(255,69,69,.4)] bg-[rgba(255,69,69,.08)]' : 'hair bg-white/[0.035]'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="mono text-[10px] dim">{id}</span>
                    <CondBadge c={c} />
                  </div>
                  <div className="mt-1.5 text-[12.5px] leading-snug">{t}</div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px] mute">
                    <span className="truncate">{site}</span>
                    <span className="chip !text-[9.5px] !py-0">{kind}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-[11px] mute">{W.loadLabel}</span>
          <span className="text-[10.5px] dim">{total} jobs · auto-balanced</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {W.days.map((d, i) => (
            <div key={d}>
              <div className="h-16 rounded-[6px] bg-white/[0.04] flex items-end overflow-hidden">
                <div
                  className="w-full rounded-[6px] transition-all duration-500"
                  style={{ height: `${W.load[i]}%`, background: W.load[i] > 85 ? 'var(--bx-c4)' : 'rgba(237,237,239,0.75)' }}
                />
              </div>
              <div className="text-[10px] dim mt-1.5 text-center truncate">{d}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t hair text-[12px] mute flex items-start gap-2">
          <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-none" /> {W.window}
        </div>
      </div>
    </Screen>
  );
}

// ─── Predictions ───────────────────────────────────────────────────────────

export function PredictionsPanel() {
  const L = useLens();
  const Hr = L.hero;
  // 90-day history + 60-day forecast of a health index; the forecast
  // crosses the failure threshold at the asset's predicted RUL.
  const W = 560;
  const H = 200;
  const thr = 45;
  const hist = Array.from({ length: 30 }, (_, i) => 88 - i * 0.55 - (i > 20 ? (i - 20) * 0.9 : 0) + Math.sin(i * 1.7 + Hr.rul) * 1.4);
  const last = hist[hist.length - 1];
  const failAt = Math.max(1, Hr.rul / 3); // forecast points are 3 days apart
  const slope = (last - thr) / failAt;
  // past the failure point the decline flattens instead of falling off the chart
  const fc = Array.from({ length: 21 }, (_, i) => (i <= failAt ? last - slope * i : thr - (i - failAt) * 1.1));
  const N = hist.length + fc.length - 1;
  const x = (i) => (i / N) * W;
  const y = (v) => H - ((v - 15) / 85) * H;
  const histD = hist.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const fcD = fc.map((v, i) => `${i ? 'L' : 'M'}${x(i + hist.length - 1)},${y(v)}`).join(' ');
  const band =
    fc.map((v, i) => `${i ? 'L' : 'M'}${x(i + hist.length - 1)},${y(Math.min(98, v + i * 0.55))}`).join(' ') +
    ' ' +
    fc
      .map((v, i) => [x(i + hist.length - 1), y(Math.max(16, v - i * 0.55))])
      .reverse()
      .map(([a, b]) => `L${a},${b}`)
      .join(' ') +
    ' Z';
  const fx = x(hist.length - 1 + failAt);
  return (
    <Screen title="Predictive maintenance" meta={`${Hr.name} · ${Hr.meta}`}>
      <div className="grid gap-2.5">
        <div className="tile p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ['Days to failure', String(Hr.rul), null],
              ['Failure risk', `${Hr.risk}%`, 'var(--bx-orange)'],
              [Hr.hoursLabel, Hr.hours, null],
              ['Anomaly score', Hr.anomaly, null],
            ].map(([k, v, c]) => (
              <div key={k}>
                <div className="text-[11.5px] mute">{k}</div>
                <div className="mt-1.5 text-[30px] leading-none" style={{ color: c || undefined }}>
                  <Num v={v} />
                </div>
              </div>
            ))}
          </div>
          <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full mt-4 overflow-visible">
            {[40, 60, 80].map((g) => (
              <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="#fff" strokeOpacity="0.05" />
            ))}
            <line x1="0" x2={W} y1={y(thr)} y2={y(thr)} stroke="#ff4545" strokeOpacity="0.5" strokeDasharray="3 4" />
            <text x="2" y={y(thr) - 6} fill="#ff4545" fillOpacity="0.85" fontSize="10" fontFamily={FONT}>
              failure threshold
            </text>
            <path d={band} fill="#f08a3c" fillOpacity="0.16" />
            <path d={histD} fill="none" stroke="#ededef" strokeWidth="1.5" />
            <path d={fcD} fill="none" stroke="#f08a3c" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1={x(hist.length - 1)} x2={x(hist.length - 1)} y1="0" y2={H} stroke="#fff" strokeOpacity="0.15" />
            <text x={x(hist.length - 1) + 6} y="12" fill="#8b8b94" fontSize="10" fontFamily={FONT}>
              today
            </text>
            <g transform={`translate(${fx} ${y(thr)})`}>
              <circle r="4" fill="#ff4545" />
              <circle r="4" fill="none" stroke="#ff4545">
                <animate attributeName="r" values="4;14" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <text y="22" textAnchor="middle" fill="#ededef" fontSize="10" fontFamily={FONT}>
                day {Hr.rul}
              </text>
            </g>
            <text x="0" y={H + 16} fill="#5a5a63" fontSize="10" fontFamily={FONT}>
              −90 d
            </text>
            <text x={W} y={H + 16} textAnchor="end" fill="#5a5a63" fontSize="10" fontFamily={FONT}>
              +60 d
            </text>
          </svg>
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] mute">Likely failure modes</span>
              <span className="chip !text-[var(--bx-orange)] !border-[rgba(240,138,60,.35)]">{Hr.risk >= 75 ? 'Critical' : 'High risk'}</span>
            </div>
            <div className="space-y-2.5">
              {Hr.modes.map(([k, v], i) => (
                <div key={k} className="text-[12px]">
                  <div className="flex justify-between gap-2">
                    <span className={i ? 'mute' : ''}>{k}</span>
                    <span className="tabular-nums">{v}%</span>
                  </div>
                  <div className="h-[2px] mt-1.5 bg-white/[0.06] rounded-full">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${v}%`, background: i ? 'rgba(236,236,236,.55)' : 'var(--bx-orange)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t hair text-[11.5px] mute">
              90% confidence interval · <span className="text-white">{Hr.ci}</span>
            </div>
          </div>
          <div className="tile p-4">
            <div className="text-[11.5px] mute mb-2">Watchlist</div>
            <ul className="text-[12px] divide-y divide-white/[0.06]">
              {Hr.watch.map(([n, s, p, t]) => (
                <li key={n} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate">{n}</span>
                    <span className="block dim text-[11px] truncate">{s}</span>
                  </span>
                  <span className="text-right mono text-[10.5px] flex-none" style={{ color: p >= 75 ? 'var(--bx-alert)' : undefined }}>
                    {p}%<span className="block dim">{t}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Analytics ─────────────────────────────────────────────────────────────

const MONTHS = ['N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O'];

export function AnalyticsPanel() {
  const L = useLens();
  const A = L.analytics;
  const grid = useMemo(
    () =>
      L.sites.map((b, r) =>
        MONTHS.map((_, c) => {
          const v = b.risk / 100 + Math.sin(r * 1.3 + c * 0.7) * 0.18 + (c > 8 && b.cond >= 4 ? 0.12 : 0);
          return Math.max(0.04, Math.min(1, v));
        }),
      ),
    [L.id],
  );
  return (
    <Screen title="Analytics" meta={A.meta}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">{A.kpis.map(kpi)}</div>
      <div className="tile p-4 mt-2.5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3 min-w-[480px]">
          <span className="text-[11px] mute">Risk intensity · {A.rowLabel} × month</span>
          <span className="flex items-center gap-2 text-[10px] dim">
            low
            <span className="w-20 h-[6px] rounded-full" style={{ background: 'linear-gradient(90deg, rgba(237,237,239,.06), rgba(240,138,60,.5), rgba(255,95,95,.7))' }} />
            high
          </span>
        </div>
        <div className="min-w-[480px]">
          {grid.map((row, r) => (
            <div key={L.sites[r].id} className="grid grid-cols-[160px_repeat(12,1fr)] gap-[3px] mb-[3px] items-center">
              <span className="text-[11.5px] mute truncate pr-2">{L.sites[r].name}</span>
              {row.map((v, c) => (
                <span
                  key={c}
                  className="h-[18px] rounded-[3px]"
                  style={{
                    background:
                      v > 0.7 ? `rgba(255,95,95,${0.3 + (v - 0.7) * 1.4})` : v > 0.35 ? `rgba(240,138,60,${0.12 + (v - 0.35) * 0.9})` : `rgba(237,237,239,${0.03 + v * 0.15})`,
                  }}
                  title={`${L.sites[r].name} · ${Math.round(v * 100)}`}
                />
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[160px_repeat(12,1fr)] gap-[3px] mt-1">
            <span />
            {MONTHS.map((m, i) => (
              <span key={i} className="mono text-[9.5px] dim text-center">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Defect cascade ────────────────────────────────────────────────────────

const NODE_XY = [
  [70, 150],
  [260, 80],
  [260, 220],
  [450, 50],
  [450, 150],
  [450, 250],
];
const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [1, 5],
];
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function CascadePanel() {
  const L = useLens();
  const C = L.cascade;
  const nodes = C.nodes.map(([t, s, c, cost], i) => ({ t, s, c, cost, x: NODE_XY[i][0], y: NODE_XY[i][1], i }));
  const [deferred, setDeferred] = useState(24);
  // nodes "activate" progressively as deferral grows
  const active = (n) => n.i === 0 || (n.x <= 260 ? deferred >= 6 : deferred >= 15);
  const cost = nodes.filter(active).reduce((a, n) => a + n.cost, 0) * 1000;
  return (
    <Screen title="Defect cascade" meta={C.meta}>
      <div className="tile p-4 overflow-x-auto">
        <svg viewBox="0 0 560 300" className="w-full min-w-[480px]">
          {EDGES.map(([f, t]) => {
            const A = nodes[f];
            const B = nodes[t];
            const on = active(A) && active(B);
            return (
              <path
                key={`${f}${t}`}
                d={`M${A.x + 80},${A.y} C${(A.x + B.x) / 2 + 40},${A.y} ${(A.x + B.x) / 2 + 40},${B.y} ${B.x - 8},${B.y}`}
                fill="none"
                stroke="#ededef"
                strokeOpacity={on ? 0.45 : 0.08}
                className={on ? 'flow' : ''}
              />
            );
          })}
          {nodes.map((n) => {
            const on = active(n);
            return (
              <g key={n.t} transform={`translate(${n.x - 8} ${n.y - 22})`} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .5s' }}>
                <rect width="104" height="44" rx="10" fill="rgba(255,255,255,0.04)" stroke="#fff" strokeOpacity={on ? 0.2 : 0.08} />
                <circle cx="12" cy="15" r="3.5" fill={COND[n.c].color} />
                <text x="22" y="19" fill="#ededef" fontSize="10.5" fontFamily={FONT}>
                  {clip(n.t, 15)}
                </text>
                <text x="12" y="34" fill="#8b8b94" fontSize="9" fontFamily={FONT}>
                  {clip(n.s, 18)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="grid sm:grid-cols-[1.4fr_1fr] gap-2.5 mt-2.5">
        <div className="tile p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] mute">If deferred</span>
            <span className="mono text-[12px]">{deferred} months</span>
          </div>
          <input
            type="range"
            min="0"
            max="36"
            step="1"
            value={deferred}
            onChange={(e) => setDeferred(+e.target.value)}
            style={{ '--p': `${(deferred / 36) * 100}%` }}
            className="mt-3"
            aria-label="Months deferred"
          />
          <div className="flex justify-between text-[10px] dim mt-1">
            <span>fix now</span>
            <span>36 mo</span>
          </div>
        </div>
        <div className="tile p-4">
          <div className="text-[11px] mute">Total exposure</div>
          <div className="fig mt-2 text-[30px] leading-none">{fmtK(cost)}</div>
          <div className="text-[11px] mute mt-1.5">vs. ${C.today}k to fix today</div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Capital decision ──────────────────────────────────────────────────────

export function CapitalPanel() {
  const L = useLens();
  const OPTIONS = L.capital.options;
  const [sel, setSel] = useState(OPTIONS.findIndex((o) => o.best));
  const max = Math.max(...OPTIONS.map((o) => o.wolc));
  const o = OPTIONS[sel];
  return (
    <Screen title={`Capital decision — ${L.capital.asset}`} meta="Whole-of-life cost · 20 yrs · NPV @ 4%">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {OPTIONS.map((op, i) => (
          <button
            key={op.k}
            type="button"
            onClick={() => setSel(i)}
            className={`tile p-3.5 text-left transition-colors ${sel === i ? '!bg-white/[0.08] !border-white/25' : 'hover:!bg-white/[0.045]'}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-[13px]">{op.k}</span>
              {op.best && <span className="chip !text-[9px] !py-0 !text-[var(--bx-ok)] !border-[rgba(95,210,122,.4)]">Recommended</span>}
            </div>
            <div className="mono text-[10.5px] mute mt-1.5">capex {op.capex ? fmtK(op.capex) : '$0'}</div>
          </button>
        ))}
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="text-[11px] mute mb-3">20-year whole-of-life cost</div>
        <div className="space-y-2.5">
          {OPTIONS.map((op, i) => (
            <div key={op.k} className="grid grid-cols-[96px_1fr_70px] items-center gap-3 text-[12px]">
              <span className={`truncate ${sel === i ? '' : 'mute'}`}>{op.k}</span>
              <div className="h-[8px] rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(op.wolc / max) * 100}%`, background: sel === i ? '#ededef' : 'rgba(237,237,239,0.22)' }} />
              </div>
              <span className="mono text-[11px] text-right">{fmtK(op.wolc)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2.5">
        <Kpi label="Residual risk" value={o.risk} tone={o.risk > 60 ? 'var(--bx-c5)' : 'var(--bx-ok)'} delta={o.risk > 60 ? 'high' : 'low'} />
        <Kpi label="Life extension" value={o.life} />
        <Kpi label="vs. defer" value={sel === 0 ? '—' : `−${fmtK(OPTIONS[0].wolc - o.wolc)}`} />
      </div>
      <div className="mt-3 text-[12.5px] mute flex items-center gap-2">
        <ArrowRight className="w-3.5 h-3.5 flex-none" /> {o.note}
      </div>
    </Screen>
  );
}

// ─── Funding optimiser ─────────────────────────────────────────────────────

// 0/1 knapsack on $1k units: maximise risk reduction under the cap.
function optimise(projects, capK) {
  const n = projects.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capK + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const [, , w, v] = projects[i - 1];
    for (let c = 0; c <= capK; c++) {
      dp[i][c] = dp[i - 1][c];
      if (w <= c && dp[i - 1][c - w] + v > dp[i][c]) dp[i][c] = dp[i - 1][c - w] + v;
    }
  }
  const picked = new Set();
  let c = capK;
  for (let i = n; i > 0; i--) {
    if (dp[i][c] !== dp[i - 1][c]) {
      picked.add(i - 1);
      c -= projects[i - 1][2];
    }
  }
  return picked;
}

const roundTo = (v, step) => Math.max(step, Math.round(v / step) * step);

export function FundingPanel() {
  const L = useLens();
  const PROJECTS = L.funding.projects;
  const TOTAL_RISK = PROJECTS.reduce((a, p) => a + p[3], 0);
  const TOTAL_COST = PROJECTS.reduce((a, p) => a + p[2], 0);
  const min = roundTo(TOTAL_COST * 0.05, 10);
  const max = roundTo(TOTAL_COST, 10);
  const [cap, setCap] = useState(roundTo(TOTAL_COST * 0.33, 10));
  const picked = useMemo(() => optimise(PROJECTS, cap), [PROJECTS, cap]);
  const spent = [...picked].reduce((a, i) => a + PROJECTS[i][2], 0);
  const reduced = [...picked].reduce((a, i) => a + PROJECTS[i][3], 0);
  const frontier = useMemo(() => {
    const pts = [];
    for (let b = 0; b <= 20; b++) {
      const s = optimise(PROJECTS, Math.round((TOTAL_COST * b) / 20));
      pts.push([b * 10, 80 - ([...s].reduce((a, i) => a + PROJECTS[i][3], 0) / TOTAL_RISK) * 76]);
    }
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  }, [PROJECTS]);
  const mx = (cap / TOTAL_COST) * 200;
  return (
    <Screen title="Funding optimiser" meta={L.funding.meta}>
      <div className="grid lg:grid-cols-[1fr_1.25fr] gap-2.5">
        <div className="flex flex-col gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] mute">Budget cap</span>
              <span className="fig text-[22px]">{fmtM(cap * 1000)}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step="10"
              value={cap}
              onChange={(e) => setCap(+e.target.value)}
              style={{ '--p': `${((cap - min) / (max - min)) * 100}%` }}
              className="mt-3"
              aria-label="Budget cap"
            />
            <div className="flex justify-between mono text-[10px] dim mt-1">
              <span>{fmtM(min * 1000)}</span>
              <span>{fmtM(max * 1000)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Kpi label="Risk reduced" value={`${Math.round((reduced / TOTAL_RISK) * 100)}%`} tone="var(--bx-ok)" delta={`${reduced} pts`} />
            <Kpi label="Allocated" value={fmtM(spent * 1000)} delta={`${picked.size} projects`} />
          </div>
          <div className="tile p-4 flex-1">
            <div className="text-[11px] mute mb-3">Risk reduced per $</div>
            <div className="relative h-24">
              <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                <path d={`${frontier} L200,80 L0,80 Z`} fill="#1232f6" fillOpacity="0.18" />
                <path d={frontier} fill="none" stroke="#ededef" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                <line x1={mx} x2={mx} y1="0" y2="80" stroke="#1232f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div className="flex justify-between mono text-[10px] dim mt-1">
              <span>$0</span>
              <span>{fmtM(TOTAL_COST * 1000)}</span>
            </div>
          </div>
        </div>
        <div className="tile p-2">
          <ul>
            {PROJECTS.map(([n, s, w, v], i) => {
              const on = picked.has(i);
              return (
                <li key={n} className={`flex items-center gap-3 px-2.5 py-2 rounded-[8px] text-[12.5px] transition-colors duration-300 ${on ? 'bg-white/[0.05]' : ''}`}>
                  <span className={`w-4 h-4 rounded-[5px] flex items-center justify-center flex-none transition-colors ${on ? 'bg-[var(--bx-blue)] text-white' : 'border border-white/15'}`}>
                    {on && <Check className="w-3 h-3" strokeWidth={2.5} />}
                  </span>
                  <span className={`flex-1 min-w-0 ${on ? '' : 'dim'}`}>
                    <span className="block truncate">{n}</span>
                    <span className="block text-[10.5px] dim truncate">{s}</span>
                  </span>
                  <span className={`mono text-[10.5px] text-right ${on ? 'mute' : 'dim'}`}>
                    {fmtK(w * 1000)}
                    <span className="block">−{v} risk</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Screen>
  );
}
