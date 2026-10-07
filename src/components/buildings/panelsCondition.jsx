import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search, Thermometer, Activity, Zap, Droplets } from 'lucide-react';
import { BUILDINGS, COND, PORTFOLIO, CityMap, CondBadge, CondDot, Kpi, Screen, Sparkline, rng, fmtM } from './kit';

// ─── Dashboard ─────────────────────────────────────────────────────────────

const HEALTH_TREND = [71, 72, 71, 73, 74, 73, 75, 76, 75, 77, 78, 78, 79, 81];

export function DashboardPanel() {
  const [sel, setSel] = useState('AQU-03');
  const b = BUILDINGS.find((x) => x.id === sel);
  return (
    <Screen title="Portfolio overview" meta={`${PORTFOLIO.name} · ${PORTFOLIO.buildings} buildings`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Kpi label="Portfolio health" value="81%" delta="▲ 3.2" tone="var(--bx-signal)" />
        <Kpi label="Avg condition" value={PORTFOLIO.avgCond} delta="C1–C5" />
        <Kpi label="Critical defects" value={PORTFOLIO.critical} delta="▼ 4 wk" tone="var(--bx-signal)" />
        <Kpi label="20-yr FWP" value={PORTFOLIO.fwp} delta="indexed" />
      </div>
      <div className="mt-2.5 grid lg:grid-cols-[1.6fr_1fr] gap-2.5">
        <CityMap selected={sel} onSelect={setSel} compact className="aspect-[16/10] lg:aspect-auto lg:min-h-[340px]" />
        <div className="flex flex-col gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow !text-[10px]">{b.id}</span>
              <CondBadge c={b.cond} />
            </div>
            <div className="mt-2 text-[17px] tracking-[-0.02em]">{b.name}</div>
            <div className="mono text-[11px] dim mt-0.5">
              {b.type} · {b.gfa}
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="eyebrow !text-[10px]">Risk score</div>
                <div className="text-[30px] font-light leading-none mt-1 tracking-[-0.03em]">{b.risk}</div>
              </div>
              <div className="w-1/2">
                <Sparkline data={HEALTH_TREND.map((v, i) => v - b.risk / 10 + Math.sin(i + b.risk) * 2)} h={36} />
              </div>
            </div>
          </div>
          <div className="tile p-4 flex-1">
            <div className="eyebrow !text-[10px] mb-3">Live alerts</div>
            <ul className="space-y-2.5 text-[12.5px]">
              {[
                [5, 'Aquatic Centre', 'Chiller compressor — vibration 4σ'],
                [4, 'Eastside Hall', 'Roof membrane — ingress reported'],
                [3, 'Works Depot', 'Switchboard thermal — +11 °C'],
              ].map(([c, n, t]) => (
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

// ─── Condition Assessment overview ─────────────────────────────────────────

const DIST = [
  { c: 1, n: 912 },
  { c: 2, n: 2140 },
  { c: 3, n: 1986 },
  { c: 4, n: 884 },
  { c: 5, n: 290 },
];
const ELEMENTS = [
  ['Roof & rainwater', 3.4],
  ['External fabric', 2.7],
  ['HVAC & mechanical', 3.6],
  ['Electrical', 2.9],
  ['Hydraulics', 3.1],
  ['Fire services', 2.2],
  ['Internal finishes', 2.5],
];

export function ConditionPanel() {
  const total = DIST.reduce((a, d) => a + d.n, 0);
  return (
    <Screen title="Condition assessment" meta="Sample portfolio · inspected Q3">
      <div className="grid sm:grid-cols-3 gap-2.5">
        <Kpi label="Components rated" value={PORTFOLIO.components} />
        <Kpi label="Avg condition" value={PORTFOLIO.avgCond} delta="▲ 0.1 yoy" tone="var(--bx-c4)" />
        <Kpi label="Photo evidence" value="94%" delta="AI-scored" />
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow !text-[10px]">Distribution · IPWEA C1–C5</span>
          <span className="mono text-[10.5px] dim">{total.toLocaleString()} components</span>
        </div>
        <div className="flex h-9 rounded-[8px] overflow-hidden gap-[2px]">
          {DIST.map((d) => (
            <div
              key={d.c}
              className="relative group"
              style={{ width: `${(d.n / total) * 100}%`, background: COND[d.c].color, opacity: 0.85 }}
              title={`C${d.c} ${COND[d.c].label}: ${d.n}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-5 mt-3 text-[11.5px]">
          {DIST.map((d) => (
            <div key={d.c}>
              <div className="flex items-center gap-1.5 mute">
                <CondDot c={d.c} /> C{d.c}
              </div>
              <div className="mt-0.5 tracking-[-0.01em]">{Math.round((d.n / total) * 100)}%</div>
            </div>
          ))}
        </div>
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="eyebrow !text-[10px] mb-3">Average condition by element</div>
        <div className="space-y-2.5">
          {ELEMENTS.map(([n, v]) => {
            const c = Math.min(5, Math.max(1, Math.round(v)));
            return (
              <div key={n} className="grid grid-cols-[1fr_2fr_auto] items-center gap-3 text-[12.5px]">
                <span className="mute truncate">{n}</span>
                <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(v / 5) * 100}%`, background: COND[c].color }} />
                </div>
                <span className="mono text-[11px] w-8 text-right">{v.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

// ─── 20-year Forward Works Program ─────────────────────────────────────────

const FWP_CATS = [
  { k: 'Roof', col: '#ededef' },
  { k: 'Mechanical', col: '#9aa3ff' },
  { k: 'Electrical', col: '#5a67e8' },
  { k: 'Fabric', col: '#6b6b74' },
  { k: 'Hydraulic', col: '#3a3a42' },
];

function buildFwp() {
  const r = rng(42);
  return Array.from({ length: 20 }, (_, i) => {
    const year = 2027 + i;
    const wave = 1 + 0.55 * Math.sin(i / 2.6) + (i === 6 || i === 13 ? 0.9 : 0);
    const parts = FWP_CATS.map((_, k) => (0.35 + r() * 0.9) * wave * (k === 1 ? 1.4 : 1) * 0.62e6);
    return { year, parts, total: parts.reduce((a, b) => a + b, 0) };
  });
}

export function FwpPanel() {
  const data = useMemo(buildFwp, []);
  const [hover, setHover] = useState(6);
  const max = Math.max(...data.map((d) => d.total));
  const budget = 4.2e6;
  const sum = data.reduce((a, d) => a + d.total, 0);
  const h = data[hover];
  return (
    <Screen title="20-year forward works program" meta="Renewals · 2027 – 2046 · real $">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label="20-yr total" value={fmtM(sum)} />
        <Kpi label="Peak year" value={data.reduce((a, d) => (d.total > a.total ? d : a)).year} />
        <Kpi label="Annual budget" value={fmtM(budget)} />
        <Kpi label="Selected" value={h.year} delta={fmtM(h.total)} />
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="relative h-[220px] flex items-end gap-[3px] sm:gap-[5px]" onMouseLeave={() => setHover(6)}>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-white/30 pointer-events-none"
            style={{ bottom: `${(budget / max) * 100}%` }}
          >
            <span className="absolute right-0 -top-5 mono text-[10px] mute">budget {fmtM(budget)}</span>
          </div>
          {data.map((d, i) => (
            <button
              key={d.year}
              type="button"
              aria-label={`${d.year}: ${fmtM(d.total)}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className="relative flex-1 h-full flex flex-col-reverse"
            >
              {d.parts.map((p, k) => (
                <span
                  key={k}
                  className="block w-full transition-opacity duration-300"
                  style={{
                    height: `${(p / max) * 100}%`,
                    background: FWP_CATS[k].col,
                    opacity: hover === i ? 1 : 0.42,
                    borderRadius: k === d.parts.length - 1 ? '3px 3px 0 0' : 0,
                    marginTop: 1,
                  }}
                />
              ))}
            </button>
          ))}
        </div>
        <div className="flex justify-between mono text-[10px] dim mt-2">
          <span>2027</span>
          <span>2031</span>
          <span>2036</span>
          <span>2041</span>
          <span>2046</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {FWP_CATS.map((c, k) => (
            <span key={c.k} className="inline-flex items-center gap-1.5 text-[11.5px] mute">
              <span className="w-2 h-2 rounded-[2px]" style={{ background: c.col }} />
              {c.k} <span className="mono text-[10.5px] dim">{fmtM(h.parts[k])}</span>
            </span>
          ))}
        </div>
      </div>
    </Screen>
  );
}

// ─── Asset tree ────────────────────────────────────────────────────────────

const TREE = {
  name: 'Sample council portfolio',
  meta: '48 sites',
  open: true,
  children: [
    {
      name: 'Aquatic Centre',
      meta: '412',
      cond: 4,
      open: true,
      children: [
        {
          name: 'Plant room',
          meta: '38',
          open: true,
          children: [
            { name: 'Chiller CH-01', cond: 5, tag: 'vibration 4σ' },
            { name: 'Pool filtration pump P-02', cond: 3 },
            { name: 'Boiler B-01', cond: 2 },
          ],
        },
        { name: 'Roof & envelope', meta: '24', children: [{ name: 'Membrane — Zone B', cond: 4 }] },
        { name: 'Electrical', meta: '61', children: [{ name: 'Main switchboard MSB', cond: 3 }] },
      ],
    },
    {
      name: 'Civic Centre',
      meta: '1,084',
      cond: 3,
      children: [
        { name: 'Lifts', meta: '3', children: [{ name: 'Passenger lift L1', cond: 3, tag: 'service due 4d' }] },
        { name: 'HVAC', meta: '46', children: [{ name: 'AHU-03', cond: 2 }] },
      ],
    },
    { name: 'Central Library', meta: '506', cond: 2, children: [{ name: 'Fire services', meta: '88', children: [] }] },
  ],
};

function TreeNode({ node, depth, onPick, picked }) {
  const [open, setOpen] = useState(!!node.open);
  const leaf = !node.children;
  const isPicked = picked === node.name;
  return (
    <li>
      <button
        type="button"
        onClick={() => (leaf ? onPick(node.name) : setOpen((o) => !o))}
        className={`w-full flex items-center gap-2 py-[7px] pr-2 rounded-[8px] text-left text-[12.5px] transition-colors ${
          isPicked ? 'bg-white/[0.07]' : 'hover:bg-white/[0.035]'
        }`}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        {leaf ? (
          <span className="w-3.5" />
        ) : (
          <ChevronRight className={`w-3.5 h-3.5 dim transition-transform ${open ? 'rotate-90' : ''}`} />
        )}
        {node.cond && <CondDot c={node.cond} pulse={node.cond === 5} />}
        <span className={leaf ? 'text-white/85' : ''}>{node.name}</span>
        {node.tag && <span className="chip !text-[9.5px] !py-[1px] ml-1">{node.tag}</span>}
        {node.meta && <span className="ml-auto mono text-[10.5px] dim">{node.meta}</span>}
      </button>
      {!leaf && open && node.children.length > 0 && (
        <ul>
          {node.children.map((c) => (
            <TreeNode key={c.name} node={c} depth={depth + 1} onPick={onPick} picked={picked} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function AssetTreePanel() {
  const [picked, setPicked] = useState('Chiller CH-01');
  return (
    <Screen title="Asset tree" meta="Site → building → system → component">
      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-2.5">
        <div className="tile p-2">
          <div className="flex items-center gap-2 px-2 py-2 mb-1 border-b hair">
            <Search className="w-3.5 h-3.5 dim" />
            <span className="text-[12px] dim">Search 6,212 components</span>
          </div>
          <ul>
            <TreeNode node={TREE} depth={0} onPick={setPicked} picked={picked} />
          </ul>
        </div>
        <div className="tile p-4 flex flex-col">
          <div className="eyebrow !text-[10px]">Component</div>
          <div className="mt-2 text-[17px] tracking-[-0.02em]">{picked}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
            {[
              ['Install year', '2009'],
              ['Useful life', '20 yrs'],
              ['Remaining', '3.2 yrs'],
              ['Replacement', '$184,000'],
              ['Criticality', 'High'],
              ['Last inspected', '14 days'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="dim text-[11px]">{k}</div>
                <div className="mt-0.5">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4">
            <div className="eyebrow !text-[10px] mb-2">Health · 90 days</div>
            <Sparkline data={[82, 81, 80, 80, 78, 77, 77, 74, 72, 70, 66, 63, 61]} h={44} stroke="#f59d4c" />
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Digital twin ──────────────────────────────────────────────────────────

const LEVELS = ['Roof', 'Level 1', 'Ground'];
const HOTSPOTS = {
  Roof: [
    { x: 0.32, y: 0.4, c: 4, t: 'Membrane — Zone B', d: 'Ponding + split seam · photo 14 d ago' },
    { x: 0.66, y: 0.58, c: 3, t: 'Rooftop AHU-03', d: 'Coil corrosion · C3' },
  ],
  'Level 1': [
    { x: 0.44, y: 0.5, c: 4, t: 'Ceiling — Room 1.12', d: 'Water staining below Zone B' },
    { x: 0.72, y: 0.36, c: 2, t: 'Lighting circuit DB-1A', d: 'Normal · sensor live' },
  ],
  Ground: [
    { x: 0.28, y: 0.62, c: 5, t: 'Chiller CH-01', d: 'Vibration 4.2 mm/s · 4σ anomaly' },
    { x: 0.6, y: 0.44, c: 3, t: 'Main switchboard', d: 'Thermal +11 °C at phase B' },
    { x: 0.8, y: 0.66, c: 2, t: 'Pool filtration P-02', d: 'Pressure nominal' },
  ],
};

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

export function TwinPanel() {
  const [lvl, setLvl] = useState('Ground');
  const [hs, setHs] = useState(0);
  const ys = { Roof: 90, 'Level 1': 170, Ground: 250 };
  const spots = HOTSPOTS[lvl];
  const spot = spots[Math.min(hs, spots.length - 1)];
  return (
    <Screen title="Digital twin — Aquatic Centre" meta="3D · plan · linked findings">
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-2.5">
        <div className="tile relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[340px]">
          <div className="absolute top-3 left-3 flex gap-1 rounded-full p-1 z-10 bg-black/50 border hair backdrop-blur-md">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLvl(l);
                  setHs(0);
                }}
                className={`px-3 py-1 rounded-full text-[11.5px] transition-colors ${
                  lvl === l ? 'bg-white text-black' : 'mute hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 400 340" className="absolute inset-0 w-full h-full">
            {/* vertical edges */}
            <g stroke="#fff" strokeOpacity="0.12" strokeDasharray="2 4">
              <line x1="50" y1="90" x2="50" y2="250" />
              <line x1="350" y1="90" x2="350" y2="250" />
              <line x1="200" y1="172" x2="200" y2="332" />
            </g>
            {['Ground', 'Level 1', 'Roof'].map((l) => (
              <IsoSlab key={l} y={ys[l]} active={l === lvl} />
            ))}
            {spots.map((s, i) => {
              // map unit square → iso diamond of the active level
              const cx = 200 + (s.x - s.y) * 150;
              const cy = ys[lvl] - 82 + (s.x + s.y) * 82;
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
            <div className="flex items-center justify-between">
              <span className="eyebrow !text-[10px]">Hotspot · {lvl}</span>
              <CondBadge c={spot.c} />
            </div>
            <div className="mt-2 text-[16px] tracking-[-0.02em]">{spot.t}</div>
            <div className="mt-1 text-[12.5px] mute">{spot.d}</div>
          </div>
          <div className="tile p-4 flex-1">
            <div className="eyebrow !text-[10px] mb-2">On this level</div>
            <ul className="space-y-1">
              {spots.map((s, i) => (
                <li key={s.t}>
                  <button
                    type="button"
                    onClick={() => setHs(i)}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] text-[12.5px] text-left ${
                      hs === i ? 'bg-white/[0.07]' : 'hover:bg-white/[0.035]'
                    }`}
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

const EQUIP = [
  ['CH-01', 'Chiller — centrifugal', 'Aquatic Centre', 'Mechanical', 2009, 5, '$184,000'],
  ['L1', 'Passenger lift', 'Civic Centre', 'Vertical transport', 2004, 3, '$212,000'],
  ['MSB', 'Main switchboard', 'Works Depot', 'Electrical', 1998, 3, '$96,000'],
  ['AHU-03', 'Air handling unit', 'Central Library', 'Mechanical', 2015, 2, '$64,500'],
  ['FIP-01', 'Fire indicator panel', 'Childcare Centre', 'Fire services', 2019, 1, '$18,200'],
  ['HWS-02', 'Hot water plant', 'Leisure Centre', 'Hydraulics', 2011, 3, '$41,000'],
  ['RF-B', 'Roof membrane Zone B', 'Eastside Hall', 'Envelope', 1996, 4, '$128,000'],
];
const DISC = ['All', 'Mechanical', 'Electrical', 'Hydraulics', 'Envelope'];

export function EquipmentPanel() {
  const [f, setF] = useState('All');
  const rows = EQUIP.filter((r) => f === 'All' || r[3] === f);
  return (
    <Screen title="Equipment register" meta="6,212 items · export CSV / XLSX">
      <div className="flex gap-1.5 mb-3 scroll-x">
        {DISC.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setF(d)}
            className={`chip transition-colors ${f === d ? '!bg-white !text-black !border-white' : 'hover:!text-white'}`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="tile overflow-x-auto">
        <table className="w-full text-[12.5px] min-w-[560px]">
          <thead>
            <tr className="text-left">
              {['ID', 'Equipment', 'Location', 'Installed', 'Cond.', 'Replacement'].map((h) => (
                <th key={h} className="eyebrow !text-[9.5px] font-normal px-3.5 py-3 border-b hair">
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

const SIGNALS = [
  { k: 'Vibration', unit: 'mm/s', icon: Activity, base: 3.6, amp: 0.6, warn: 4.0, src: 'Chiller CH-01' },
  { k: 'Supply air', unit: '°C', icon: Thermometer, base: 14.2, amp: 0.5, warn: 16, src: 'AHU-03' },
  { k: 'Current draw', unit: 'A', icon: Zap, base: 21.4, amp: 1.2, warn: 26, src: 'Pump P-02' },
  { k: 'Line pressure', unit: 'kPa', icon: Droplets, base: 310, amp: 9, warn: 340, src: 'Hydraulic riser' },
];

function useLive() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 900);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function SensorsPanel() {
  const t = useLive();
  const series = SIGNALS.map((s, k) =>
    Array.from({ length: 36 }, (_, i) => {
      const x = i + t;
      return s.base + Math.sin(x / 3 + k) * s.amp * 0.6 + Math.sin(x / 1.3 + k * 2) * s.amp * 0.3 + (k === 0 && i > 30 ? (i - 30) * 0.12 : 0);
    }),
  );
  return (
    <Screen title="Sensors" meta="MQTT · BACnet · REST · CSV — 312 streams">
      <div className="grid sm:grid-cols-2 gap-2.5">
        {SIGNALS.map((s, k) => {
          const v = series[k][series[k].length - 1];
          const hot = v > s.warn;
          const Icon = s.icon;
          return (
            <div key={s.k} className="tile p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[12.5px]">
                  <Icon className="w-3.5 h-3.5 mute" strokeWidth={1.5} /> {s.k}
                </span>
                <span className="inline-flex items-center gap-1.5 mono text-[10px] mute">
                  <span className="dot pulse" style={{ background: hot ? 'var(--bx-c5)' : 'var(--bx-signal)', color: hot ? 'var(--bx-c5)' : 'var(--bx-signal)' }} />
                  {hot ? 'threshold' : 'live'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[28px] font-light tracking-[-0.03em] leading-none tabular-nums">
                  {v.toFixed(s.base > 100 ? 0 : 1)}
                </span>
                <span className="mono text-[11px] dim">{s.unit}</span>
              </div>
              <div className="mt-3">
                <Sparkline data={series[k]} h={40} stroke={hot ? '#ff5f5f' : '#ededef'} />
              </div>
              <div className="mono text-[10px] dim mt-2">{s.src}</div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
