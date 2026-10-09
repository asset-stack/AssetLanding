import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

// ─── Sample portfolio ──────────────────────────────────────────────────────
// Illustrative data only — every panel on /Buildings renders from this, so
// numbers stay consistent across the page. Not a real customer.

export const COND = {
  1: { label: 'Excellent', color: 'var(--bx-c1)' },
  2: { label: 'Good', color: 'var(--bx-c2)' },
  3: { label: 'Average', color: 'var(--bx-c3)' },
  4: { label: 'Poor', color: 'var(--bx-c4)' },
  5: { label: 'Very poor', color: 'var(--bx-c5)' },
};

export const BUILDINGS = [
  { id: 'AQU-03', name: 'Aquatic Centre', type: 'Recreation', cond: 4, risk: 86, x: 380, y: 236, gfa: '6,420 m²' },
  { id: 'HAL-05', name: 'Community Hall', type: 'Community', cond: 4, risk: 72, x: 470, y: 150, gfa: '940 m²' },
  { id: 'DEP-04', name: 'Works Depot', type: 'Operational', cond: 3, risk: 61, x: 560, y: 330, gfa: '3,100 m²' },
  { id: 'CIV-01', name: 'Council Chambers', type: 'Administration', cond: 3, risk: 58, x: 312, y: 170, gfa: '8,860 m²' },
  { id: 'REC-08', name: 'Sports Complex', type: 'Recreation', cond: 3, risk: 49, x: 640, y: 210, gfa: '4,210 m²' },
  { id: 'LIB-02', name: 'Library & Gallery', type: 'Cultural', cond: 2, risk: 34, x: 250, y: 300, gfa: '3,740 m²' },
  { id: 'CCC-06', name: 'Childcare Centre', type: 'Community', cond: 2, risk: 28, x: 470, y: 400, gfa: '760 m²' },
  { id: 'AIR-07', name: 'Airport Terminal', type: 'Transport', cond: 1, risk: 12, x: 700, y: 400, gfa: '2,050 m²' },
];

// Mirrors the AssetStack demo workspace (Dashboard + Asset Register views).
export const PORTFOLIO = {
  name: 'Sample council portfolio',
  buildings: 12,
  components: '4,108',
  rooms: 241,
  avgCond: '2.7',
  critical: 143,
  health: '57%',
  peakYear: 2052,
  remLife: '12.2',
  fwp: '$2.70M',
};

export const fmtM = (v) => `$${(v / 1e6).toFixed(v >= 1e7 ? 1 : 2)}M`;
export const fmtK = (v) => (v >= 1e6 ? fmtM(v) : `$${Math.round(v / 1000)}k`);

// deterministic PRNG so SSR markup and the hydrated island match
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ─── Primitives ────────────────────────────────────────────────────────────

export function Glass({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`glass ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

export function CondDot({ c, pulse = false, size = 6 }) {
  return (
    <span
      className={`dot ${pulse ? 'pulse' : ''}`}
      style={{ background: COND[c].color, color: COND[c].color, width: size, height: size }}
    />
  );
}

export function CondBadge({ c }) {
  return (
    <span className="inline-flex items-center gap-1.5 mono text-[11px]" style={{ color: COND[c].color }}>
      <CondDot c={c} /> {c} · {COND[c].label}
    </span>
  );
}

// VEXTO number styling: integer part bright, decimals/suffix dimmed.
export function Num({ v, className = '' }) {
  const str = String(v);
  const m = str.match(/^([^.\d]*[\d,]+)(\.\d+)?(.*)$/);
  if (!m) return <span className={`fig ${className}`}>{str}</span>;
  return (
    <span className={`fig ${className}`}>
      {m[1]}
      {m[2] && <span className="text-white/40">{m[2]}</span>}
      {m[3] && <span className="text-white/40 text-[0.55em] ml-0.5 tracking-normal">{m[3]}</span>}
    </span>
  );
}

export function Kpi({ label, value, delta, tone, className = '' }) {
  return (
    <div className={`tile p-3.5 ${className}`}>
      <div className="text-[11.5px] mute">{label}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <Num v={value} className="text-[26px] leading-none" />
        {delta && (
          <span className="text-[10.5px]" style={{ color: tone || 'var(--bx-mute)' }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

// A mocked platform view, styled as a VEXTO card: title, quiet meta, ↗.
export function Screen({ title, meta, children, className = '' }) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <div className="text-[15px] tracking-[-0.01em] truncate">{title}</div>
          {meta && <div className="text-[11.5px] dim truncate mt-0.5">{meta}</div>}
        </div>
        <ArrowUpRight className="w-4 h-4 mute flex-none mt-0.5" strokeWidth={1.5} />
      </div>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">{children}</div>
    </div>
  );
}

// VEXTO's signature chart: a dense, jittery line, a highlighted vertical
// band with two markers, and a dashed reference level.
export function NoisyChart({ seed = 3, n = 160, h = 120, band = [0.62, 0.74], trend = 0.5, accent = false, axis = true, className = '' }) {
  const W = 400;
  const r = rng(seed);
  const pts = [];
  let v = 0.3;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v += (r() - 0.5) * 0.09 + (trend * 0.6) / n;
    v = Math.max(0.05, Math.min(0.92, v + (t > band[0] && t < band[1] ? 0.012 : 0)));
    pts.push([t * W, h - v * h]);
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const bx0 = band[0] * W;
  const bx1 = band[1] * W;
  const i0 = Math.round(band[0] * (n - 1));
  const i1 = Math.round(band[1] * (n - 1));
  const ref = (pts[i0][1] + pts[i1][1]) / 2;
  const col = accent ? '#f08a3c' : '#ececec';
  return (
    <svg viewBox={`0 0 ${W} ${h + (axis ? 14 : 0)}`} className={`w-full overflow-visible ${className}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={h * g} y2={h * g} stroke="#fff" strokeOpacity="0.04" />
      ))}
      <rect x={bx0} y="0" width={bx1 - bx0} height={h} fill="#fff" fillOpacity="0.05" />
      <line x1="0" x2={W} y1={ref} y2={ref} stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={col} strokeOpacity="0.85" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[i0][0]} cy={pts[i0][1]} r="3" fill="#fff" />
      <circle cx={pts[i1][0]} cy={pts[i1][1]} r="3" fill="#fff" />
    </svg>
  );
}

export function Sparkline({ data, w = 120, h = 32, stroke = '#ededef', fill = true, className = '' }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 4) - 2]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const id = `sp${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" width="100%" height={h}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={stroke} stopOpacity="0.18" />
              <stop offset="1" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── Dark city map ─────────────────────────────────────────────────────────
// Graded satellite base with a faint vector street overlay and condition pins.

const MAP_W = 800;
const MAP_H = 500;

function buildStreets() {
  const r = rng(7);
  const minor = [];
  const major = [];
  // rotated grid
  for (let i = -6; i < 26; i++) {
    const off = i * 38 + r() * 10;
    minor.push(`M${off - 120},-20 L${off + 60},${MAP_H + 20}`);
  }
  for (let j = -2; j < 18; j++) {
    const off = j * 34 + r() * 8;
    minor.push(`M-20,${off} L${MAP_W + 20},${off + 150}`);
  }
  major.push(`M-20,${190} C200,170 420,250 ${MAP_W + 20},210`);
  major.push(`M240,-20 C260,140 300,320 340,${MAP_H + 20}`);
  major.push(`M500,-20 C520,200 600,340 760,${MAP_H + 20}`);
  return { minor, major };
}
const STREETS = buildStreets();

export function CityMap({ selected, onSelect, compact = false, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[14px] border hair bg-[#101010] ${className}`}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 block w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="mapVignette" cx="50%" cy="45%" r="70%">
            <stop offset="0.55" stopColor="#101010" stopOpacity="0" />
            <stop offset="1" stopColor="#0c0c0c" stopOpacity="0.95" />
          </radialGradient>
        </defs>
        {/* satellite base, graded down to sit behind the data */}
        <image
          href="/media/buildings/map-topdown-town.webp"
          x="-40"
          y="-20"
          width={MAP_W + 80}
          height={MAP_H + 40}
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: 'grayscale(0.55) brightness(0.5) contrast(1.15)' }}
        />
        <g stroke="#ffffff" strokeOpacity="0.035" strokeWidth="1" fill="none">
          {STREETS.minor.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" fill="none">
          {STREETS.major.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <rect width={MAP_W} height={MAP_H} fill="url(#mapVignette)" />

        {/* building pins */}
        {BUILDINGS.map((b) => {
          const on = selected === b.id;
          const col = COND[b.cond].color;
          return (
            <g
              key={b.id}
              transform={`translate(${b.x} ${b.y})`}
              onClick={onSelect ? () => onSelect(b.id) : undefined}
              onMouseEnter={onSelect ? () => onSelect(b.id) : undefined}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              <circle r="22" fill="transparent" />
              {b.cond >= 4 && (
                <circle r="6" fill="none" stroke={col} strokeOpacity="0.7">
                  <animate attributeName="r" values="6;20" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={on ? 7 : 5} fill={col} fillOpacity={on ? 1 : 0.9} />
              <circle r={on ? 12 : 0} fill="none" stroke="#fff" strokeOpacity="0.5" style={{ transition: 'r .3s' }} />
              {(!compact || on) && (
                <text
                  x="12"
                  y="4"
                  fill="#ededef"
                  fillOpacity={on ? 1 : 0.55}
                  fontSize="12"
                  fontFamily="Helvetica Neue, Inter Tight, sans-serif"
                  style={{ letterSpacing: '-0.01em', pointerEvents: 'none' }}
                >
                  {b.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute left-3 bottom-3 flex items-center gap-3 rounded-full px-3 py-1.5 bg-black/50 border hair backdrop-blur-md">
        {[1, 2, 3, 4, 5].map((c) => (
          <span key={c} className="inline-flex items-center gap-1 mono text-[10px] mute">
            <CondDot c={c} /> {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Reveal on scroll ──────────────────────────────────────────────────────

export function useInView(opts = { rootMargin: '0px 0px -12% 0px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
