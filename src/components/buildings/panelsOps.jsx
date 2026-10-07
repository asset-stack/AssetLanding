import React, { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { BUILDINGS, COND, CondBadge, Kpi, Num, Screen, fmtK, fmtM } from './kit';

// ─── Maintenance ───────────────────────────────────────────────────────────

const WO_COLS = [
  {
    k: 'Open',
    items: [
      ['WO-4821', 'Roof membrane — Zone B make-safe', 'Community Hall', 4, 'Reactive'],
      ['WO-4819', 'Lift L1 door sensor fault', 'Council Chambers', 3, 'Reactive'],
    ],
  },
  {
    k: 'Scheduled',
    items: [
      ['PM-2210', 'Chiller CH-01 vibration analysis', 'Aquatic Centre', 5, 'Predictive'],
      ['PM-2204', 'Quarterly AHU filter change', 'Library & Gallery', 2, 'Planned'],
      ['PM-2198', 'Annual fire panel test', 'Childcare Centre', 1, 'Compliance'],
    ],
  },
  {
    k: 'In progress',
    items: [['WO-4802', 'Switchboard thermal re-torque', 'Works Depot', 3, 'Predictive']],
  },
];
const LOAD = [62, 78, 91, 70, 48];

export function MaintenancePanel() {
  return (
    <Screen title="Maintenance" meta="Work orders · this week · 38 active">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label="Planned : reactive" value="71:29" delta="▲ 9 pts" tone="var(--bx-signal)" />
        <Kpi label="Mean time to repair" value="3.4d" delta="▼ 1.1d" tone="var(--bx-signal)" />
        <Kpi label="Compliance due" value="12" delta="30 days" />
        <Kpi label="Spend MTD" value="$148k" delta="of $210k" />
      </div>
      <div className="mt-2.5 grid md:grid-cols-3 gap-2.5">
        {WO_COLS.map((col) => (
          <div key={col.k} className="tile p-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="eyebrow !text-[10px]">{col.k}</span>
              <span className="mono text-[10.5px] dim">{col.items.length}</span>
            </div>
            <div className="space-y-2">
              {col.items.map(([id, t, site, c, kind]) => (
                <div key={id} className="rounded-[10px] bg-white/[0.035] border hair p-3">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] dim">{id}</span>
                    <CondBadge c={c} />
                  </div>
                  <div className="mt-1.5 text-[12.5px] leading-snug">{t}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] mute">
                    <span>{site}</span>
                    <span className="chip !text-[9px] !py-0">{kind}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow !text-[10px]">Crew load · Mon – Fri</span>
          <span className="mono text-[10.5px] dim">auto-balanced</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
            <div key={d}>
              <div className="h-16 rounded-[6px] bg-white/[0.04] flex items-end overflow-hidden">
                <div
                  className="w-full rounded-[6px]"
                  style={{ height: `${LOAD[i]}%`, background: LOAD[i] > 85 ? 'var(--bx-c4)' : 'rgba(237,237,239,0.75)' }}
                />
              </div>
              <div className="mono text-[10px] dim mt-1.5 text-center">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

// ─── Predictions ───────────────────────────────────────────────────────────

const FAILURE_MODES = [
  ['Bearing wear', 62],
  ['Seal leakage', 21],
  ['Impeller cavitation', 11],
  ['Motor winding fault', 6],
];
const AT_RISK = [
  ['Pool Circulation Pump 2', 'Aquatic Centre', 0.58, '47 d'],
  ['Chiller CH-01', 'Aquatic Centre', 0.49, '3 mo'],
  ['Roof membrane B', 'Community Hall', 0.64, '4 mo'],
  ['Lift L1 drive', 'Council Chambers', 0.41, '7 mo'],
];

export function PredictionsPanel() {
  // 90-day history + 60-day forecast of a health index
  const W = 560;
  const H = 200;
  const hist = Array.from({ length: 30 }, (_, i) => 88 - i * 0.55 - (i > 20 ? (i - 20) * 0.9 : 0) + Math.sin(i * 1.7) * 1.4);
  const last = hist[hist.length - 1];
  const fc = Array.from({ length: 21 }, (_, i) => last - i * 1.55 - i * i * 0.025);
  const N = hist.length + fc.length - 1;
  const x = (i) => (i / N) * W;
  const y = (v) => H - ((v - 20) / 80) * H;
  const histD = hist.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const fcD = fc.map((v, i) => `${i ? 'L' : 'M'}${x(i + hist.length - 1)},${y(v)}`).join(' ');
  const band =
    fc.map((v, i) => `${i ? 'L' : 'M'}${x(i + hist.length - 1)},${y(v + i * 0.55)}`).join(' ') +
    ' ' +
    fc
      .map((v, i) => [x(i + hist.length - 1), y(v - i * 0.55)])
      .reverse()
      .map(([a, b]) => `L${a},${b}`)
      .join(' ') +
    ' Z';
  const thr = 45;
  const failIdx = fc.findIndex((v) => v < thr);
  const fx = x(failIdx + hist.length - 1);

  return (
    <Screen title="Predictive analytics" meta="Pool Circulation Pump 2 · centrifugal pump · Aquatic Centre · Plant Room">
      <div className="grid gap-2.5">
        <div className="tile p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ['Days RUL', '47', null],
              ['Failure risk', '58%', 'var(--bx-orange)'],
              ['Operating hours', '31,240', null],
              ['Anomaly score', '74.2/100', null],
            ].map(([k, v, c]) => (
              <div key={k}>
                <div className="text-[11.5px] mute">{k}</div>
                <div className="mt-1.5 text-[30px] font-light leading-none tracking-[-0.03em]" style={{ color: c || undefined }}>
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
            <text x={W} y={y(thr) - 6} textAnchor="end" fill="#ff4545" fillOpacity="0.8" fontSize="10" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
              failure threshold
            </text>
            <path d={band} fill="#f08a3c" fillOpacity="0.14" />
            <path d={histD} fill="none" stroke="#ededef" strokeWidth="1.5" />
            <path d={fcD} fill="none" stroke="#bdbdbd" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1={x(hist.length - 1)} x2={x(hist.length - 1)} y1="0" y2={H} stroke="#fff" strokeOpacity="0.15" />
            <text x={x(hist.length - 1) + 6} y="12" fill="#8b8b94" fontSize="10" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
              today
            </text>
            {failIdx > 0 && (
              <g transform={`translate(${fx} ${y(thr)})`}>
                <circle r="4" fill="#ff4545" />
                <circle r="4" fill="none" stroke="#ff4545">
                  <animate attributeName="r" values="4;14" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            <text x="0" y={H + 16} fill="#5a5a63" fontSize="10" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
              −90 d
            </text>
            <text x={W} y={H + 16} textAnchor="end" fill="#5a5a63" fontSize="10" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
              +60 d
            </text>
          </svg>
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] mute">Likely failure modes</span>
              <span className="chip !text-[var(--bx-orange)] !border-[rgba(240,138,60,.35)]">High risk</span>
            </div>
            <div className="space-y-2.5">
              {FAILURE_MODES.map(([k, v], i) => (
                <div key={k} className="text-[12px]">
                  <div className="flex justify-between">
                    <span className={i ? 'mute' : ''}>{k}</span>
                    <span className="tabular-nums">{v}%</span>
                  </div>
                  <div className="h-[2px] mt-1.5 bg-white/[0.06] rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${v}%`, background: i ? 'rgba(236,236,236,.55)' : 'var(--bx-orange)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t hair text-[11.5px] mute">
              RUL 90% confidence interval · <span className="text-white">29 – 58 days</span>
            </div>
          </div>
          <div className="tile p-4">
            <div className="eyebrow !text-[10px] mb-2">Portfolio watchlist</div>
            <ul className="text-[12px] divide-y divide-white/[0.06]">
              {AT_RISK.map(([n, s, p, t]) => (
                <li key={n} className="flex items-center justify-between py-2">
                  <span>
                    {n}
                    <span className="block dim text-[11px]">{s}</span>
                  </span>
                  <span className="text-right mono text-[10.5px]">
                    {Math.round(p * 100)}%<span className="block dim">{t}</span>
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
  const grid = useMemo(
    () =>
      BUILDINGS.map((b, r) =>
        MONTHS.map((_, c) => {
          const v = b.risk / 100 + Math.sin(r * 1.3 + c * 0.7) * 0.18 + (c > 8 && b.cond >= 4 ? 0.12 : 0);
          return Math.max(0.04, Math.min(1, v));
        }),
      ),
    [],
  );
  return (
    <Screen title="Analytics" meta="Portfolio · rolling 12 months">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label="Cost / m² / yr" value="$42" delta="▼ 6%" tone="var(--bx-signal)" />
        <Kpi label="Backlog" value="$11.8M" delta="▼ $1.4M" tone="var(--bx-signal)" />
        <Kpi label="Asset consumption" value="0.61" delta="ratio" />
        <Kpi label="Renewal funding" value="0.84" delta="ratio" tone="var(--bx-c3)" />
      </div>
      <div className="tile p-4 mt-2.5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3 min-w-[480px]">
          <span className="eyebrow !text-[10px]">Risk intensity · building × month</span>
          <span className="flex items-center gap-2 mono text-[10px] dim">
            low
            <span className="w-20 h-[6px] rounded-full" style={{ background: 'linear-gradient(90deg, rgba(237,237,239,.06), rgba(240,138,60,.5), rgba(255,95,95,.7))' }} />
            high
          </span>
        </div>
        <div className="min-w-[480px]">
          {grid.map((row, r) => (
            <div key={BUILDINGS[r].id} className="grid grid-cols-[150px_repeat(12,1fr)] gap-[3px] mb-[3px] items-center">
              <span className="text-[11.5px] mute truncate pr-2">{BUILDINGS[r].name}</span>
              {row.map((v, c) => (
                <span
                  key={c}
                  className="h-[18px] rounded-[3px]"
                  style={{
                    background:
                      v > 0.7 ? `rgba(255,95,95,${0.3 + (v - 0.7) * 1.4})` : v > 0.35 ? `rgba(240,138,60,${0.12 + (v - 0.35) * 0.9})` : `rgba(237,237,239,${0.03 + v * 0.15})`,
                  }}
                  title={`${BUILDINGS[r].name} · ${Math.round(v * 100)}`}
                />
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[150px_repeat(12,1fr)] gap-[3px] mt-1">
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

const CASCADE = [
  { id: 'a', x: 70, y: 150, t: 'Roof membrane split', s: 'Zone B · C4', c: 4, cost: 18 },
  { id: 'b', x: 260, y: 80, t: 'Water ingress', s: 'Level 1 ceiling void', c: 4, cost: 9 },
  { id: 'c', x: 260, y: 220, t: 'Insulation saturation', s: 'Thermal loss +14%', c: 3, cost: 22 },
  { id: 'd', x: 450, y: 50, t: 'Lighting circuit fault', s: 'DB-1A · RCD trips', c: 4, cost: 31 },
  { id: 'e', x: 450, y: 150, t: 'Ceiling collapse risk', s: 'Room 1.12 · WHS', c: 5, cost: 26 },
  { id: 'f', x: 450, y: 250, t: 'Mould / air quality', s: 'Occupant health', c: 4, cost: 36 },
];
const EDGES = [
  ['a', 'b'],
  ['a', 'c'],
  ['b', 'd'],
  ['b', 'e'],
  ['c', 'f'],
  ['b', 'f'],
];

export function CascadePanel() {
  const [deferred, setDeferred] = useState(24);
  const byId = Object.fromEntries(CASCADE.map((n) => [n.id, n]));
  // nodes "activate" progressively as deferral grows
  const active = (n) => n.id === 'a' || (n.x <= 260 ? deferred >= 6 : deferred >= 15);
  const cost = CASCADE.filter(active).reduce((a, n) => a + n.cost, 0) * 1000;
  return (
    <Screen title="Defect cascade" meta="Roof membrane — Community Hall">
      <div className="tile p-4 overflow-x-auto">
        <svg viewBox="0 0 560 300" className="w-full min-w-[480px]">
          {EDGES.map(([f, t]) => {
            const A = byId[f];
            const B = byId[t];
            const on = active(A) && active(B);
            return (
              <path
                key={f + t}
                d={`M${A.x + 80},${A.y} C${(A.x + B.x) / 2 + 40},${A.y} ${(A.x + B.x) / 2 + 40},${B.y} ${B.x - 8},${B.y}`}
                fill="none"
                stroke={on ? '#ededef' : '#ffffff'}
                strokeOpacity={on ? 0.45 : 0.08}
                className={on ? 'flow' : ''}
              />
            );
          })}
          {CASCADE.map((n) => {
            const on = active(n);
            return (
              <g key={n.id} transform={`translate(${n.x - 8} ${n.y - 22})`} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .5s' }}>
                <rect width="104" height="44" rx="10" fill="rgba(255,255,255,0.04)" stroke="#fff" strokeOpacity={on ? 0.2 : 0.08} />
                <circle cx="12" cy="15" r="3.5" fill={COND[n.c].color} />
                <text x="22" y="19" fill="#ededef" fontSize="10.5" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
                  {n.t.length > 15 ? `${n.t.slice(0, 14)}…` : n.t}
                </text>
                <text x="12" y="34" fill="#8b8b94" fontSize="9" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
                  {n.s.length > 18 ? `${n.s.slice(0, 17)}…` : n.s}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="grid sm:grid-cols-[1.4fr_1fr] gap-2.5 mt-2.5">
        <div className="tile p-4">
          <div className="flex items-center justify-between">
            <span className="eyebrow !text-[10px]">If deferred</span>
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
          <div className="flex justify-between mono text-[10px] dim mt-1">
            <span>fix now</span>
            <span>36 mo</span>
          </div>
        </div>
        <div className="tile p-4">
          <div className="eyebrow !text-[10px]">Total exposure</div>
          <div className="mt-2 text-[30px] font-light leading-none tracking-[-0.03em]">{fmtK(cost)}</div>
          <div className="mono text-[10.5px] mute mt-1.5">vs. $18k to repair today</div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Capital decision ──────────────────────────────────────────────────────

const OPTIONS = [
  { k: 'Defer', capex: 0, wolc: 412000, risk: 92, life: '—', note: '38% chance of unplanned failure in 12 months' },
  { k: 'Repair', capex: 38000, wolc: 356000, risk: 64, life: '+3 yrs', note: 'Bearing + compressor rebuild; efficiency unchanged' },
  { k: 'Refurbish', capex: 96000, wolc: 318000, risk: 41, life: '+8 yrs', note: 'Major overhaul, new controls' },
  { k: 'Replace', capex: 184000, wolc: 271000, risk: 12, life: '+20 yrs', note: 'High-efficiency unit · saves $14k / yr in energy', best: true },
];

export function CapitalPanel() {
  const [sel, setSel] = useState(3);
  const max = Math.max(...OPTIONS.map((o) => o.wolc));
  const o = OPTIONS[sel];
  return (
    <Screen title="Capital decision — Chiller CH-01" meta="Whole-of-life cost · 20 yrs · NPV @ 4%">
      <div className="grid sm:grid-cols-4 gap-2">
        {OPTIONS.map((op, i) => (
          <button
            key={op.k}
            type="button"
            onClick={() => setSel(i)}
            className={`tile p-3.5 text-left transition-colors ${sel === i ? '!bg-white/[0.08] !border-white/25' : 'hover:!bg-white/[0.045]'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px]">{op.k}</span>
              {op.best && <span className="chip !text-[9px] !py-0 !text-[var(--bx-signal)] !border-[rgba(200,242,90,.35)]">Recommended</span>}
            </div>
            <div className="mono text-[10.5px] mute mt-1.5">capex {op.capex ? fmtK(op.capex) : '$0'}</div>
          </button>
        ))}
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="eyebrow !text-[10px] mb-3">20-year whole-of-life cost</div>
        <div className="space-y-2.5">
          {OPTIONS.map((op, i) => (
            <div key={op.k} className="grid grid-cols-[80px_1fr_70px] items-center gap-3 text-[12px]">
              <span className={sel === i ? '' : 'mute'}>{op.k}</span>
              <div className="h-[8px] rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(op.wolc / max) * 100}%`, background: sel === i ? '#ededef' : 'rgba(237,237,239,0.22)' }}
                />
              </div>
              <span className="mono text-[11px] text-right">{fmtK(op.wolc)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2.5">
        <Kpi label="Residual risk" value={o.risk} tone={o.risk > 60 ? 'var(--bx-c5)' : 'var(--bx-signal)'} delta={o.risk > 60 ? 'high' : 'low'} />
        <Kpi label="Life extension" value={o.life} />
        <Kpi label="vs. defer" value={o.k === 'Defer' ? '—' : `−${fmtK(OPTIONS[0].wolc - o.wolc)}`} />
      </div>
      <div className="mt-3 text-[12.5px] mute flex items-center gap-2">
        <ArrowRight className="w-3.5 h-3.5" /> {o.note}
      </div>
    </Screen>
  );
}

// ─── Funding optimiser ─────────────────────────────────────────────────────

const PROJECTS = [
  ['Chiller CH-01 replacement', 'Aquatic Centre', 184, 24],
  ['Roof membrane Zone B', 'Community Hall', 128, 18],
  ['Main switchboard upgrade', 'Works Depot', 96, 12],
  ['Lift L1 modernisation', 'Council Chambers', 212, 14],
  ['Fire panel upgrades ×4', 'Various', 86, 11],
  ['Pool filtration P-02', 'Aquatic Centre', 58, 6],
  ['AHU-03 coil renewal', 'Library & Gallery', 64, 5],
  ['Hot water plant HWS-02', 'Sports Complex', 41, 5],
  ['Façade re-seal', 'Council Chambers', 310, 9],
  ['Accessible amenities', 'Community Hall', 140, 7],
  ['Carpark lighting LED', 'Works Depot', 72, 3],
  ['Solar + BMS integration', 'Sports Complex', 420, 8],
];
const TOTAL_RISK = PROJECTS.reduce((a, p) => a + p[3], 0);
const TOTAL_COST = PROJECTS.reduce((a, p) => a + p[2], 0);

// 0/1 knapsack on $1k units: maximise risk reduction under the cap.
function optimise(capK) {
  const n = PROJECTS.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capK + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const [, , w, v] = PROJECTS[i - 1];
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
      c -= PROJECTS[i - 1][2];
    }
  }
  return picked;
}

export function FundingPanel() {
  const [cap, setCap] = useState(600);
  const picked = useMemo(() => optimise(cap), [cap]);
  const spent = [...picked].reduce((a, i) => a + PROJECTS[i][2], 0);
  const reduced = [...picked].reduce((a, i) => a + PROJECTS[i][3], 0);
  const min = 100;
  const max = 1800;
  return (
    <Screen title="Funding optimiser" meta="FY27 renewals · 12 candidate projects">
      <div className="grid lg:grid-cols-[1fr_1.25fr] gap-2.5">
        <div className="flex flex-col gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow !text-[10px]">Budget cap</span>
              <span className="text-[22px] font-light tracking-[-0.03em]">{fmtM(cap * 1000)}</span>
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
            <Kpi label="Risk reduced" value={`${Math.round((reduced / TOTAL_RISK) * 100)}%`} tone="var(--bx-signal)" delta={`${reduced} pts`} />
            <Kpi label="Allocated" value={fmtM(spent * 1000)} delta={`${picked.size} projects`} />
          </div>
          <div className="tile p-4 flex-1">
            <div className="eyebrow !text-[10px] mb-3">Risk reduced per $</div>
            <div className="relative h-24">
              <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                {(() => {
                  // efficiency frontier across the budget range
                  const pts = [];
                  for (let b = 0; b <= 20; b++) {
                    const k = Math.round((TOTAL_COST * b) / 20);
                    const s = optimise(k);
                    pts.push([b * 10, 80 - ([...s].reduce((a, i) => a + PROJECTS[i][3], 0) / TOTAL_RISK) * 76]);
                  }
                  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
                  const mx = (cap / TOTAL_COST) * 200;
                  return (
                    <>
                      <path d={`${d} L200,80 L0,80 Z`} fill="#f08a3c" fillOpacity="0.12" />
                      <path d={d} fill="none" stroke="#ededef" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                      <line x1={mx} x2={mx} y1="0" y2="80" stroke="#f08a3c" strokeOpacity="0.8" vectorEffect="non-scaling-stroke" />
                    </>
                  );
                })()}
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
                <li
                  key={n}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-[8px] text-[12.5px] transition-colors duration-300 ${on ? 'bg-white/[0.05]' : ''}`}
                >
                  <span
                    className={`w-4 h-4 rounded-[5px] flex items-center justify-center flex-none transition-colors ${
                      on ? 'bg-white text-black' : 'border border-white/15'
                    }`}
                  >
                    {on && <Check className="w-3 h-3" strokeWidth={2.5} />}
                  </span>
                  <span className={`flex-1 min-w-0 ${on ? '' : 'dim'}`}>
                    <span className="block truncate">{n}</span>
                    <span className="block text-[10.5px] dim truncate">{s}</span>
                  </span>
                  <span className={`mono text-[10.5px] text-right ${on ? 'mute' : 'dim'}`}>
                    ${w}k<span className="block">−{v} risk</span>
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
