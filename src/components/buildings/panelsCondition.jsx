import React, { useEffect, useMemo, useState } from 'react';
import { Thermometer, Activity, Zap, Droplets } from 'lucide-react';
import { BUILDINGS, COND, PORTFOLIO, CityMap, CondBadge, CondDot, Kpi, NoisyChart, Num, Screen, Sparkline, rng, fmtK, fmtM } from './kit';

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function DashboardPanel() {
  const [sel, setSel] = useState('AQU-03');
  const b = BUILDINGS.find((x) => x.id === sel);
  return (
    <Screen title="Dashboard" meta={`${PORTFOLIO.name} · ${PORTFOLIO.buildings} locations · ${PORTFOLIO.components} assets`}>
      <div className="tile p-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-16 w-64 h-40 rounded-full blur-3xl" style={{ background: 'rgba(240,138,60,0.18)' }} />
        <div className="relative flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-[11.5px] mute">AssetMind insight</div>
          <span className="chip">Updated 4 min ago</span>
        </div>
        <div className="relative mt-2 text-[19px] font-light tracking-[-0.02em]">
          Portfolio status: <span style={{ color: 'var(--bx-orange)' }}>Moderate</span>
          <span className="mute"> · {PORTFOLIO.health} avg health</span>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-[12px]">
          {[
            ['Peak renewal year', PORTFOLIO.peakYear],
            ['Avg remaining life', `${PORTFOLIO.remLife} yrs`],
            ['Critical priority', PORTFOLIO.critical],
            ['Assessment coverage', '100%'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="dim text-[11px]">{k}</div>
              <Num v={v} className="block mt-1 text-[20px] font-light tracking-[-0.02em]" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2.5 grid lg:grid-cols-[1.6fr_1fr] gap-2.5">
        <CityMap selected={sel} onSelect={setSel} compact className="aspect-[16/10] lg:aspect-auto lg:min-h-[320px]" />
        <div className="flex flex-col gap-2.5">
          <div className="tile p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] mute">{b.type}</span>
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
              {[
                [5, 'Aquatic Centre', 'Pool Circulation Pump 2 · 47 days RUL'],
                [4, 'Community Hall', 'Roof membrane · ingress reported'],
                [3, 'Works Depot', 'Switchboard thermal · +11 °C'],
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

// ─── Condition assessment overview ─────────────────────────────────────────

const DIST = [
  { c: 1, n: 612 },
  { c: 2, n: 1384 },
  { c: 3, n: 1290 },
  { c: 4, n: 679 },
  { c: 5, n: 143 },
];
const BY_LOCATION = [
  ['Aquatic Centre', 412, 2.9, '$2.70M'],
  ['Council Chambers & Administration', 1084, 2.6, '$1.92M'],
  ['Library & Gallery', 506, 2.3, '$0.88M'],
  ['Sports Complex', 638, 2.8, '$1.41M'],
  ['Community Hall', 274, 3.3, '$0.61M'],
];

export function ConditionPanel() {
  const total = DIST.reduce((a, d) => a + d.n, 0);
  return (
    <Screen title="Condition assessment" meta="Building condition assessment · 7 locations combined">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label="Components" value={PORTFOLIO.components} />
        <Kpi label="Avg condition grade" value={PORTFOLIO.avgCond} delta="1 Excellent – 5 Very poor" />
        <Kpi label="Replacement cost" value="$7.52M" />
        <Kpi label="20-yr program" value="$4.11M" delta="escalated" />
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11.5px] mute">Condition distribution</span>
          <span className="text-[11px] dim">{total.toLocaleString()} components</span>
        </div>
        <div className="space-y-2">
          {DIST.map((d) => (
            <div key={d.c} className="grid grid-cols-[110px_1fr_48px] items-center gap-3 text-[12px]">
              <span className="flex items-center gap-2 mute">
                <CondDot c={d.c} /> {d.c} · {COND[d.c].label}
              </span>
              <div className="h-[6px] rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(d.n / 1400) * 100}%`, background: COND[d.c].color }} />
              </div>
              <span className="text-right tabular-nums">{d.n}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="tile mt-2.5 overflow-x-auto">
        <table className="w-full text-[12.5px] min-w-[480px]">
          <thead>
            <tr className="text-left text-[11px] dim">
              <th className="font-normal px-4 py-3 border-b hair">Location</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">Assets</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">Avg grade</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">20-yr forecast</th>
            </tr>
          </thead>
          <tbody>
            {BY_LOCATION.map(([n, a, g, f]) => (
              <tr key={n}>
                <td className="px-4 py-2.5 border-b hair">{n}</td>
                <td className="px-4 py-2.5 border-b hair text-right mute tabular-nums">{a}</td>
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

// ─── 20-year Forward Works Program ─────────────────────────────────────────
// Mirrors the platform's "Program by Room" + "Sum of annual cost by group"
// views for one building (Aquatic Centre, $2,703,471 over 20 years).

const ROOMS = [
  ['R01', '25m Pool Hall', 1593509],
  ['R02', 'Leisure Pool Area', 300417],
  ['R08', 'External & Carpark', 340357],
  ['R03', 'Plant Room', 165225],
  ['R04', 'Male Change Rooms', 87889],
  ['R05', 'Female Change Rooms', 73641],
  ['R06', 'Reception & Foyer', 71764],
  ['R07', 'Kiosk & Seating', 49095],
  ['R09', 'Amenities & Store', 11612],
  ['R10', 'First Aid & Office', 9962],
];
const FWP_TOTAL = ROOMS.reduce((a, r) => a + r[2], 0);
const GROUPS = [
  { k: 'Roof', col: '#ececec' },
  { k: 'Mechanical', col: '#f08a3c' },
  { k: 'Electrical', col: '#9a9a9a' },
  { k: 'Finishes', col: '#5e5e5e' },
  { k: 'Hydraulic', col: '#3a3a3a' },
];
const PROGRAMS = { 'Must do': 0.62, Balanced: 1, Premium: 1.32 };

function buildFwp() {
  const r = rng(42);
  // lumpy renewal profile: a few big years, a long quiet tail
  const spikes = { 1: 1.6, 6: 2.6, 13: 1.8, 18: 3.4 };
  return Array.from({ length: 20 }, (_, i) => {
    const base = 0.25 + r() * 0.5 + (spikes[i] || 0);
    const parts = GROUPS.map((_, k) => base * (0.4 + r() * (k === 1 ? 1.2 : 0.8)));
    return { year: 2027 + i, parts };
  });
}

export function FwpPanel() {
  const raw = useMemo(buildFwp, []);
  const [prog, setProg] = useState('Balanced');
  const [hover, setHover] = useState(18);
  const scale = PROGRAMS[prog];
  const rawSum = raw.reduce((a, d) => a + d.parts.reduce((x, y) => x + y, 0), 0);
  const k = (FWP_TOTAL * scale) / rawSum;
  const data = raw.map((d) => ({ ...d, parts: d.parts.map((p) => p * k), total: d.parts.reduce((x, y) => x + y, 0) * k }));
  const max = Math.max(...raw.map((d) => d.parts.reduce((x, y) => x + y, 0))) * (FWP_TOTAL * PROGRAMS.Premium) / rawSum;
  const h = data[hover];
  const roomMax = ROOMS[0][2];
  return (
    <Screen title="20-year forward works program" meta="Aquatic Centre · 10 rooms · escalated at 3% p.a.">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11.5px] mute">20-yr program · {prog}</div>
          <Num v={fmtM(FWP_TOTAL * scale)} className="block text-[34px] font-light tracking-[-0.03em] leading-none mt-1.5" />
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
                      background: GROUPS[j].col,
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
            {GROUPS.map((c) => (
              <span key={c.k} className="inline-flex items-center gap-1.5 text-[11.5px] mute">
                <span className="w-2 h-2 rounded-[2px]" style={{ background: c.col }} />
                {c.k}
              </span>
            ))}
          </div>
        </div>
        <div className="tile p-4">
          <div className="text-[11.5px] mute mb-3">Program by room</div>
          <ul className="space-y-2">
            {ROOMS.slice(0, 7).map(([id, n, v]) => (
              <li key={id} className="text-[12px]">
                <div className="flex justify-between gap-2">
                  <span className="truncate">
                    <span className="dim mr-1.5">{id}</span>
                    {n}
                  </span>
                  <span className="tabular-nums">{fmtK(v * scale)}</span>
                </div>
                <div className="h-[2px] mt-1.5 bg-white/[0.05] rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${(v / roomMax) * 100}%`, background: id === 'R01' ? 'var(--bx-orange)' : 'rgba(236,236,236,.6)' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Screen>
  );
}

// ─── Asset tree ────────────────────────────────────────────────────────────
// The platform's register graph: All locations → location → room → asset.

const LOCS = [
  { n: 'Aquatic Centre', a: 412, crit: 31, rooms: ['25m Pool Hall', 'Leisure Pool', 'Plant Room', 'Change Rooms', 'Reception'] },
  { n: 'Council Chambers', a: 1084, crit: 24, rooms: ['Chamber', 'Offices L1', 'Offices L2', 'Lifts', 'Plant'] },
  { n: 'Library & Gallery', a: 506, crit: 9, rooms: ['Reading Room', 'Gallery', 'Archive', 'Amenities', 'Roof'] },
  { n: 'Sports Complex', a: 638, crit: 18, rooms: ['Courts', 'Gym', 'Change Rooms', 'Kiosk', 'Plant'] },
  { n: 'Community Hall', a: 274, crit: 14, rooms: ['Main Hall', 'Kitchen', 'Stage', 'Amenities', 'Roof'] },
  { n: 'Works Depot', a: 690, crit: 21, rooms: ['Workshop', 'Wash Bay', 'Stores', 'Offices', 'Yard'] },
  { n: 'Airport Terminal', a: 504, crit: 26, rooms: ['Departures', 'Arrivals', 'Baggage', 'Kiosk', 'Plant'] },
];
const ROOM_ASSETS = [
  ['Floor / wall tiles (inc. splashback)', 1, 'Bathroom'],
  ['Circulation pump P-02', 5, 'Mechanical'],
  ['Ceiling panels', 3, 'Ceiling'],
  ['LED high-bay lighting', 2, 'Electrical'],
];

export function AssetTreePanel() {
  const [li, setLi] = useState(0);
  const [ri, setRi] = useState(2);
  const W = 640;
  const loc = LOCS[li];
  const lx = (i) => 40 + (i * (W - 80)) / (LOCS.length - 1);
  const rx = (i) => 110 + (i * (W - 220)) / (loc.rooms.length - 1);
  return (
    <Screen title="Asset register" meta="Every asset organised by Location → Room → Asset — one defensible register">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label="Total assets" value={PORTFOLIO.components} />
        <Kpi label="Locations" value={PORTFOLIO.buildings} />
        <Kpi label="Rooms" value={PORTFOLIO.rooms} />
        <Kpi label="Critical" value={PORTFOLIO.critical} tone="var(--bx-alert)" delta="● flagged" />
      </div>
      <div className="grid gap-2.5 mt-2.5">
        <div className="tile p-2 overflow-x-auto">
          <svg viewBox={`0 0 ${W} 330`} className="w-full min-w-[540px]">
            {/* root */}
            {LOCS.map((l, i) => (
              <path
                key={l.n}
                d={`M${W / 2},52 C${W / 2},100 ${lx(i)},90 ${lx(i)},138`}
                fill="none"
                stroke="#fff"
                strokeOpacity={i === li ? 0.55 : 0.12}
              />
            ))}
            {loc.rooms.map((r, i) => (
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
              <text y="34" textAnchor="middle" fill="#ececec" fontSize="11" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
                All locations
              </text>
            </g>
            {LOCS.map((l, i) => (
              <g key={l.n} transform={`translate(${lx(i)} 148)`} onClick={() => { setLi(i); setRi(0); }} style={{ cursor: 'pointer' }}>
                <circle r="20" fill="transparent" />
                <circle r="11" fill={i === li ? '#ececec' : '#1b1b1b'} stroke="#fff" strokeOpacity={i === li ? 1 : 0.35} />
                {l.crit > 20 && <circle cx="8" cy="-8" r="3.5" fill="#ff4545" />}
                <text y="28" textAnchor="middle" fill="#ececec" fillOpacity={i === li ? 1 : 0.5} fontSize="10" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
                  {l.n.split(' ')[0]}
                </text>
              </g>
            ))}
            {loc.rooms.map((r, i) => (
              <g key={r} transform={`translate(${rx(i)} 258)`} onClick={() => setRi(i)} style={{ cursor: 'pointer' }}>
                <circle r="18" fill="transparent" />
                <rect x="-8" y="-8" width="16" height="16" rx="5" fill={i === ri ? '#1232f6' : '#1b1b1b'} stroke="#fff" strokeOpacity={i === ri ? 0 : 0.3} />
                <text y="26" textAnchor="middle" fill="#ececec" fillOpacity={i === ri ? 1 : 0.5} fontSize="10" fontFamily="Helvetica Neue, Inter Tight, sans-serif">
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
            {loc.n} · {loc.rooms[ri]}
          </div>
          <div className="mt-1 text-[12px] dim">
            {loc.a} assets · {loc.crit} critical
          </div>
          <ul className="mt-4 space-y-1.5">
            {ROOM_ASSETS.map(([n, c, g]) => (
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
    <Screen title="Digital twins" meta="Aquatic Centre · Matterport 3D tour · 12 of 12 locations captured">
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
                  lvl === l ? 'bg-[var(--bx-blue)] text-white' : 'mute hover:text-white'
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
  ['L1', 'Passenger lift', 'Council Chambers', 'Vertical transport', 2004, 3, '$212,000'],
  ['MSB', 'Main switchboard', 'Works Depot', 'Electrical', 1998, 3, '$96,000'],
  ['AHU-03', 'Air handling unit', 'Library & Gallery', 'Mechanical', 2015, 2, '$64,500'],
  ['FIP-01', 'Fire indicator panel', 'Childcare Centre', 'Fire services', 2019, 1, '$18,200'],
  ['HWS-02', 'Hot water plant', 'Sports Complex', 'Hydraulics', 2011, 3, '$41,000'],
  ['RF-B', 'Roof membrane Zone B', 'Community Hall', 'Envelope', 1996, 4, '$128,000'],
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
    <Screen title="Sensors" meta="MQTT · REST · CSV — 312 streams">
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
                <span className="fig text-[28px] leading-none">
                  {v.toFixed(s.base > 100 ? 0 : 1)}
                </span>
                <span className="mono text-[11px] dim">{s.unit}</span>
              </div>
              <div className="mt-3">
                <Sparkline data={series[k]} h={40} stroke={hot ? '#ff4545' : '#ededef'} />
              </div>
              <div className="mono text-[10px] dim mt-2">{s.src}</div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
