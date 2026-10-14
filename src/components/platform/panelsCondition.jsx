import React, { useEffect, useMemo, useState } from 'react';
import { Thermometer, Activity, Zap, Gauge } from 'lucide-react';
import { COND, CityMap, CondBadge, CondDot, Kpi, NoisyChart, Num, Screen, Sparkline, rng, fmtK, fmtM, useLens } from './kit';

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function DashboardPanel() {
  const L = useLens();
  const P = L.portfolio;
  const [sel, setSel] = useState(L.sites[0].id);
  const b = L.sites.find((x) => x.id === sel) || L.sites[0];
  const healthN = parseFloat(P.health);
  const status = healthN >= 65 ? ['Good', 'var(--bx-ok)'] : healthN >= 55 ? ['Moderate', 'var(--bx-orange)'] : ['At risk', 'var(--bx-alert)'];
  return (
    <Screen title="Portfolio view" meta={`${P.name} · ${P.sitesN} ${P.sitesLabel.toLowerCase()} · ${P.assets} assets`}>
      <div className="tile p-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-16 w-64 h-40 rounded-full blur-3xl" style={{ background: 'rgba(18,50,246,0.22)' }} />
        <div className="relative flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-[11.5px] mute">AssetMind insight</div>
          <span className="chip">Updated 4 min ago</span>
        </div>
        <div className="relative mt-2 text-[19px] tracking-[-0.02em]">
          Portfolio status: <span style={{ color: status[1] }}>{status[0]}</span>
          <span className="mute"> · {P.health} avg health</span>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-[12px]">
          {[
            ['Peak renewal year', P.peakYear],
            ['Avg remaining life', `${P.remLife} yrs`],
            ['Critical priority', P.critical],
            ['Assessment coverage', '100%'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="dim text-[11px]">{k}</div>
              <Num v={v} className="block mt-1 text-[20px]" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2.5 grid lg:grid-cols-[1.6fr_1fr] gap-2.5">
        <CityMap selected={b.id} onSelect={setSel} compact className="aspect-[16/10] lg:aspect-auto lg:min-h-[320px]" />
        <div className="flex flex-col gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] mute truncate">{b.type}</span>
              <CondBadge c={b.cond} />
            </div>
            <div className="mt-2 text-[17px] tracking-[-0.02em]">{b.name}</div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-[11px] dim">Risk score</div>
                <div className="fig text-[30px] leading-none mt-1">{b.risk}</div>
              </div>
              <div className="w-1/2">
                <NoisyChart seed={b.risk} n={60} h={40} axis={false} band={[0.7, 0.82]} />
              </div>
            </div>
          </div>
          <div className="tile p-4 flex-1">
            <div className="text-[11.5px] mute mb-3">Alerts</div>
            <ul className="space-y-2.5 text-[12.5px]">
              {L.alerts.map(([c, n, t]) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-1.5">
                    <CondDot c={c} pulse={c === 5} />
                  </span>
                  <span>
                    <span className="text-white/90">{n}</span>
                    <span className="block mute">{t}</span>
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

// ─── Condition assessment overview ─────────────────────────────────────────

export function ConditionPanel() {
  const L = useLens();
  const C = L.condition;
  const total = C.dist.reduce((a, n) => a + n, 0);
  const peak = Math.max(...C.dist);
  return (
    <Screen title="Condition assessment" meta={C.meta}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label={C.unit[0].toUpperCase() + C.unit.slice(1)} value={total.toLocaleString()} />
        <Kpi label="Avg condition grade" value={L.portfolio.avgCond} delta="1 Excellent – 5 Very poor" />
        <Kpi label="Replacement cost" value={C.replacement} />
        <Kpi label="20-yr program" value={C.program} delta="escalated" />
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11.5px] mute">Condition distribution</span>
          <span className="text-[11px] dim">
            {total.toLocaleString()} {C.unit}
          </span>
        </div>
        <div className="space-y-2">
          {C.dist.map((n, i) => {
            const c = i + 1;
            return (
              <div key={c} className="grid grid-cols-[110px_1fr_48px] items-center gap-3 text-[12px]">
                <span className="flex items-center gap-2 mute">
                  <CondDot c={c} /> {c} · {COND[c].label}
                </span>
                <div className="h-[6px] rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(n / peak) * 100}%`, background: COND[c].color }} />
                </div>
                <span className="text-right tabular-nums">{n.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="tile mt-2.5 overflow-x-auto">
        <table className="w-full text-[12.5px] min-w-[480px]">
          <thead>
            <tr className="text-left text-[11px] dim">
              <th className="font-normal px-4 py-3 border-b hair">{L.portfolio.sitesLabel.replace(/s$/, '')}</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">Assets</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">Avg grade</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">20-yr forecast</th>
            </tr>
          </thead>
          <tbody>
            {C.byLoc.map(([n, a, g, f]) => (
              <tr key={n}>
                <td className="px-4 py-2.5 border-b hair">{n}</td>
                <td className="px-4 py-2.5 border-b hair text-right mute tabular-nums">{a.toLocaleString()}</td>
                <td className="px-4 py-2.5 border-b hair text-right tabular-nums" style={{ color: g >= 3 ? 'var(--bx-orange)' : undefined }}>
                  {g.toFixed(1)}
                </td>
                <td className="px-4 py-2.5 border-b hair text-right tabular-nums">{f}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Screen>
  );
}

// ─── 20-year forward works program ─────────────────────────────────────────

const GROUP_COLS = ['#ececec', '#f08a3c', '#9a9a9a', '#5e5e5e', '#3a3a3a'];
const PROGRAMS = { 'Must do': 0.62, Balanced: 1, Premium: 1.32 };

function buildFwp(seed) {
  const r = rng(seed);
  // lumpy renewal profile: a few big years, a long quiet tail
  const spikes = { 1: 1.6, 6: 2.6, 13: 1.8, 18: 3.4 };
  return Array.from({ length: 20 }, (_, i) => {
    const base = 0.25 + r() * 0.5 + (spikes[i] || 0);
    const parts = GROUP_COLS.map((_, k) => base * (0.4 + r() * (k === 1 ? 1.2 : 0.8)));
    return { year: 2027 + i, parts };
  });
}

export function FwpPanel() {
  const L = useLens();
  const F = L.fwp;
  const total = F.rows.reduce((a, r) => a + r[2], 0);
  const raw = useMemo(() => buildFwp(L.id.length * 7 + 35), [L.id]);
  const [prog, setProg] = useState('Balanced');
  const [hover, setHover] = useState(18);
  const scale = PROGRAMS[prog];
  const rawSum = raw.reduce((a, d) => a + d.parts.reduce((x, y) => x + y, 0), 0);
  const k = (total * scale) / rawSum;
  const data = raw.map((d) => ({ ...d, parts: d.parts.map((p) => p * k), total: d.parts.reduce((x, y) => x + y, 0) * k }));
  const max = (Math.max(...raw.map((d) => d.parts.reduce((x, y) => x + y, 0))) * (total * PROGRAMS.Premium)) / rawSum;
  const h = data[hover];
  const rowMax = Math.max(...F.rows.map((r) => r[2]));
  return (
    <Screen title="20-year forward works program" meta={F.meta}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11.5px] mute">20-yr program · {prog}</div>
          <Num v={fmtM(total * scale)} className="block text-[34px] leading-none mt-1.5" />
        </div>
        <div className="flex gap-1 p-1 rounded-full bg-white/[0.04] border hair">
          {Object.keys(PROGRAMS).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProg(p)}
              className={`px-3 py-1 rounded-full text-[12px] transition-colors ${prog === p ? 'bg-[var(--bx-blue)] text-white' : 'mute hover:text-white'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-2.5 mt-4">
        <div className="tile p-4">
          <div className="flex justify-between text-[11.5px] mb-3">
            <span className="mute">Annual cost by group</span>
            <span>
              {h.year} · <span className="tabular-nums">{fmtK(h.total)}</span>
            </span>
          </div>
          <div className="relative h-[200px] flex items-end gap-[3px]">
            {data.map((d, i) => (
              <button
                key={d.year}
                type="button"
                aria-label={`${d.year}: ${fmtK(d.total)}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onClick={() => setHover(i)}
                className="relative flex-1 h-full flex flex-col-reverse"
              >
                {i === hover && <span className="absolute inset-x-[-2px] top-0 bottom-0 bg-white/[0.05] rounded-[3px]" />}
                {d.parts.map((p, j) => (
                  <span
                    key={j}
                    className="relative block w-full transition-all duration-500"
                    style={{
                      height: `${(p / max) * 100}%`,
                      background: GROUP_COLS[j],
                      opacity: hover === i ? 1 : 0.55,
                      borderRadius: j === d.parts.length - 1 ? '2px 2px 0 0' : 0,
                      marginTop: 1,
                    }}
                  />
                ))}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10.5px] dim mt-2 tabular-nums">
            <span>2027</span>
            <span>2032</span>
            <span>2037</span>
            <span>2042</span>
            <span>2046</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
            {F.groups.map((g, j) => (
              <span key={g} className="inline-flex items-center gap-1.5 text-[11.5px] mute">
                <span className="w-2 h-2 rounded-[2px]" style={{ background: GROUP_COLS[j] }} />
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="tile p-4">
          <div className="text-[11.5px] mute mb-3">{F.unitLabel}</div>
          <ul className="space-y-2">
            {F.rows.slice(0, 7).map(([id, n, v], i) => (
              <li key={id} className="text-[12px]">
                <div className="flex justify-between gap-2">
                  <span className="truncate">
                    <span className="dim mr-1.5 mono text-[10.5px]">{id}</span>
                    {n}
                  </span>
                  <span className="tabular-nums">{fmtK(v * scale)}</span>
                </div>
                <div className="h-[2px] mt-1.5 bg-white/[0.05] rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${(v / rowMax) * 100}%`, background: i === 0 ? 'var(--bx-orange)' : 'rgba(236,236,236,.6)' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Screen>
  );
}

// ─── Asset register graph ──────────────────────────────────────────────────

function shortNames(names) {
  const first = names.map((n) => n.split(' ')[0]);
  return names.map((n, i) => {
    const w = n.split(' ');
    const clash = first.filter((f) => f === first[i]).length > 1;
    return clash ? w[w.length - 1] : w[0];
  });
}

export function AssetTreePanel() {
  const L = useLens();
  const P = L.portfolio;
  const LOCS = L.tree.locs;
  const [li, setLi] = useState(0);
  const [ri, setRi] = useState(0);
  const W = 640;
  const loc = LOCS[li];
  const names = shortNames(LOCS.map((l) => l.n));
  const lx = (i) => 40 + (i * (W - 80)) / (LOCS.length - 1);
  const rx = (i) => 110 + (i * (W - 220)) / (loc.subs.length - 1);
  const font = 'Inter Tight, sans-serif';
  return (
    <Screen title="Asset register" meta={`Every asset organised by ${P.hierarchy}, in one defensible register`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label="Total assets" value={P.assets} />
        <Kpi label={P.sitesLabel} value={P.sitesN} />
        <Kpi label={P.subLabel} value={P.subN} />
        <Kpi label="Critical" value={P.critical} tone="var(--bx-alert)" delta="● flagged" />
      </div>
      <div className="grid gap-2.5 mt-2.5">
        <div className="tile p-2 overflow-x-auto">
          <svg viewBox={`0 0 ${W} 330`} className="w-full min-w-[540px]">
            {LOCS.map((l, i) => (
              <path key={l.n} d={`M${W / 2},52 C${W / 2},100 ${lx(i)},90 ${lx(i)},138`} fill="none" stroke="#fff" strokeOpacity={i === li ? 0.55 : 0.12} />
            ))}
            {loc.subs.map((r, i) => (
              <path
                key={r}
                d={`M${lx(li)},158 C${lx(li)},210 ${rx(i)},200 ${rx(i)},248`}
                fill="none"
                stroke="#fff"
                strokeOpacity={i === ri ? 0.55 : 0.14}
                className={i === ri ? 'flow' : ''}
              />
            ))}
            <g transform={`translate(${W / 2} 38)`}>
              <circle r="16" fill="#1b1b1b" stroke="#fff" strokeOpacity="0.6" />
              <circle r="4" fill="#ececec" />
              <text y="34" textAnchor="middle" fill="#ececec" fontSize="11" fontFamily={font}>
                {P.name}
              </text>
            </g>
            {LOCS.map((l, i) => (
              <g
                key={l.n}
                transform={`translate(${lx(i)} 148)`}
                onClick={() => {
                  setLi(i);
                  setRi(0);
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle r="20" fill="transparent" />
                <circle r="11" fill={i === li ? '#ececec' : '#1b1b1b'} stroke="#fff" strokeOpacity={i === li ? 1 : 0.35} />
                {l.crit > 20 && <circle cx="8" cy="-8" r="3.5" fill="#ff4545" />}
                <text y="28" textAnchor="middle" fill="#ececec" fillOpacity={i === li ? 1 : 0.5} fontSize="10" fontFamily={font}>
                  {names[i]}
                </text>
              </g>
            ))}
            {loc.subs.map((r, i) => (
              <g key={r} transform={`translate(${rx(i)} 258)`} onClick={() => setRi(i)} style={{ cursor: 'pointer' }}>
                <circle r="18" fill="transparent" />
                <rect x="-8" y="-8" width="16" height="16" rx="5" fill={i === ri ? '#1232f6' : '#1b1b1b'} stroke="#fff" strokeOpacity={i === ri ? 0 : 0.3} />
                <text y="26" textAnchor="middle" fill="#ececec" fillOpacity={i === ri ? 1 : 0.5} fontSize="10" fontFamily={font}>
                  {r}
                </text>
              </g>
            ))}
          </svg>
          <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 pb-2 text-[11px] mute">
            {[
              ['Operational', 'var(--bx-c1)'],
              ['Degraded', 'var(--bx-c3)'],
              ['Critical', 'var(--bx-alert)'],
              ['Maintenance', 'var(--bx-orange)'],
            ].map(([k, c]) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="dot" style={{ background: c }} /> {k}
              </span>
            ))}
          </div>
        </div>
        <div className="tile p-4 grid sm:grid-cols-[1.4fr_1fr] gap-5">
          <div>
            <div className="text-[11.5px] mute">
              {loc.n} · {loc.subs[ri]}
            </div>
            <div className="mt-1 text-[12px] dim">
              {loc.a.toLocaleString()} assets · {loc.crit} critical
            </div>
            <ul className="mt-4 space-y-1.5">
              {L.tree.assets.map(([n, c, g]) => (
                <li key={n} className="flex items-center gap-2.5 rounded-[10px] bg-white/[0.03] px-3 py-2 text-[12px]">
                  <CondDot c={c} pulse={c === 5} />
                  <span className="flex-1 min-w-0 truncate">{n}</span>
                  <span className="dim text-[11px]">{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-end">
            <div className="text-[11px] dim mb-2">Condition · last 90 days</div>
            <NoisyChart seed={li * 7 + ri + 2} n={70} h={44} axis={false} band={[0.55, 0.7]} />
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Digital twin ──────────────────────────────────────────────────────────

function IsoSlab({ y, active }) {
  // isometric rectangle centred at (200, y)
  const w = 150;
  const d = 82;
  const pts = `${200},${y - d} ${200 + w},${y} ${200},${y + d} ${200 - w},${y}`;
  return (
    <g style={{ transition: 'opacity .4s' }} opacity={active ? 1 : 0.28}>
      <polygon points={pts} fill={active ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.015)'} stroke="#fff" strokeOpacity={active ? 0.5 : 0.18} />
      {active &&
        Array.from({ length: 5 }, (_, i) => {
          const t = (i + 1) / 6;
          return (
            <g key={i} stroke="#fff" strokeOpacity="0.09">
              <line x1={200 - w + w * t} y1={y - d * t} x2={200 + w * t} y2={y + d - d * t} />
              <line x1={200 - w * t} y1={y - d + d * t} x2={200 + w - w * t} y2={y + d * t} />
            </g>
          );
        })}
    </g>
  );
}

const SLAB_Y = [90, 170, 250];

export function TwinPanel() {
  const L = useLens();
  const T = L.twin;
  // open on the level holding the worst hotspot
  const worst = T.spots.map((s) => Math.max(...s.map((x) => x.c)));
  const [lvl, setLvl] = useState(worst.indexOf(Math.max(...worst)));
  const [hs, setHs] = useState(0);
  const spots = T.spots[lvl];
  const spot = spots[Math.min(hs, spots.length - 1)];
  return (
    <Screen title="Digital twin" meta={T.meta}>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-2.5">
        <div className="tile relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[340px]">
          <div className="absolute top-3 left-3 flex gap-1 rounded-full p-1 z-10 bg-black/50 border hair backdrop-blur-md">
            {T.levels.map((l, i) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLvl(i);
                  setHs(0);
                }}
                className={`px-3 py-1 rounded-full text-[11.5px] transition-colors ${lvl === i ? 'bg-[var(--bx-blue)] text-white' : 'mute hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 400 340" className="absolute inset-0 w-full h-full">
            <g stroke="#fff" strokeOpacity="0.12" strokeDasharray="2 4">
              <line x1="50" y1="90" x2="50" y2="250" />
              <line x1="350" y1="90" x2="350" y2="250" />
              <line x1="200" y1="172" x2="200" y2="332" />
            </g>
            {[2, 1, 0].map((i) => (
              <IsoSlab key={i} y={SLAB_Y[i]} active={i === lvl} />
            ))}
            {spots.map((s, i) => {
              const cx = 200 + (s.x - s.y) * 150;
              const cy = SLAB_Y[lvl] - 82 + (s.x + s.y) * 82;
              const col = COND[s.c].color;
              return (
                <g key={s.t} transform={`translate(${cx} ${cy})`} onMouseEnter={() => setHs(i)} onClick={() => setHs(i)} style={{ cursor: 'pointer' }}>
                  <line y1="0" y2="-26" stroke={col} strokeOpacity="0.6" />
                  <circle r="14" fill="transparent" />
                  <circle cy="-26" r={hs === i ? 6 : 4.5} fill={col} />
                  {s.c >= 4 && (
                    <circle cy="-26" r="5" fill="none" stroke={col}>
                      <animate attributeName="r" values="5;16" dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <ellipse rx="10" ry="5" fill={col} fillOpacity="0.18" />
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] dim">Hotspot · {T.levels[lvl]}</span>
              <CondBadge c={spot.c} />
            </div>
            <div className="mt-2 text-[16px] tracking-[-0.02em]">{spot.t}</div>
            <div className="mt-1 text-[12.5px] mute">{spot.d}</div>
          </div>
          <div className="tile p-4 flex-1">
            <div className="text-[11px] dim mb-2">On this level</div>
            <ul className="space-y-1">
              {spots.map((s, i) => (
                <li key={s.t}>
                  <button
                    type="button"
                    onClick={() => setHs(i)}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] text-[12.5px] text-left ${hs === i ? 'bg-white/[0.07]' : 'hover:bg-white/[0.035]'}`}
                  >
                    <CondDot c={s.c} /> {s.t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Equipment register ────────────────────────────────────────────────────

export function EquipmentPanel() {
  const L = useLens();
  const E = L.equip;
  const [f, setF] = useState('All');
  const rows = E.rows.filter((r) => f === 'All' || r[3] === f);
  return (
    <Screen title="Equipment register" meta={E.meta}>
      <div className="flex gap-1.5 mb-3 scroll-x">
        {E.disc.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setF(d)}
            className={`chip transition-colors ${f === d ? '!bg-[var(--bx-blue)] !text-white !border-[var(--bx-blue)]' : 'hover:!text-white'}`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="tile overflow-x-auto">
        <table className="w-full text-[12.5px] min-w-[560px]">
          <thead>
            <tr className="text-left">
              {['ID', 'Asset', 'Location', 'Installed', 'Cond.', 'Replacement'].map((h) => (
                <th key={h} className="text-[11px] dim font-normal px-3.5 py-3 border-b hair">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-3.5 py-2.5 border-b hair mono text-[11px] mute">{r[0]}</td>
                <td className="px-3.5 py-2.5 border-b hair">{r[1]}</td>
                <td className="px-3.5 py-2.5 border-b hair mute">{r[2]}</td>
                <td className="px-3.5 py-2.5 border-b hair mono text-[11px] mute">{r[4]}</td>
                <td className="px-3.5 py-2.5 border-b hair">
                  <CondBadge c={r[5]} />
                </td>
                <td className="px-3.5 py-2.5 border-b hair mono text-[11px] text-right">{r[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Screen>
  );
}

// ─── Sensors ───────────────────────────────────────────────────────────────

const ICONS = { vib: Activity, temp: Thermometer, amp: Zap, press: Gauge };

function useLive() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 900);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function SensorsPanel() {
  const L = useLens();
  const t = useLive();
  const series = L.signals.map((s, k) =>
    Array.from({ length: 36 }, (_, i) => {
      const x = i + t;
      // the first signal drifts towards its limit at the end of the window
      const drift = k === 0 && i > 30 ? (i - 30) * s.amp * 0.2 * (s.warnBelow ? -1 : 1) : 0;
      return s.base + Math.sin(x / 3 + k) * s.amp * 0.6 + Math.sin(x / 1.3 + k * 2) * s.amp * 0.3 + drift;
    }),
  );
  return (
    <Screen title="Sensors" meta="MQTT · REST · CSV · live streams">
      <div className="grid sm:grid-cols-2 gap-2.5">
        {L.signals.map((s, k) => {
          const v = series[k][series[k].length - 1];
          const hot = s.warnBelow ? v < s.warn : v > s.warn;
          const Icon = ICONS[s.icon] || Activity;
          const dp = Math.abs(s.base) >= 100 ? 0 : 1;
          return (
            <div key={s.k} className="tile p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[12.5px] min-w-0">
                  <Icon className="w-3.5 h-3.5 mute flex-none" strokeWidth={1.5} /> <span className="truncate">{s.k}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10.5px] mute flex-none">
                  <span className="dot pulse" style={{ background: hot ? 'var(--bx-c5)' : 'var(--bx-ok)', color: hot ? 'var(--bx-c5)' : 'var(--bx-ok)' }} />
                  {hot ? 'threshold' : 'live'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="fig text-[28px] leading-none">{v.toFixed(dp)}</span>
                <span className="mono text-[11px] dim">{s.unit}</span>
              </div>
              <div className="mt-3">
                <Sparkline data={series[k]} h={40} stroke={hot ? '#ff4545' : '#ededef'} />
              </div>
              <div className="text-[11px] dim mt-2">{s.src}</div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
