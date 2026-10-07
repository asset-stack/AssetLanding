import React, { useEffect, useId, useRef, useState } from 'react';

// ─── Sample portfolio ──────────────────────────────────────────────────────
// Illustrative data only — every panel on /Buildings renders from this, so
// numbers stay consistent across the page. Not a real customer.

export const COND = {
  1: { label: 'Excellent', color: 'var(--bx-c1)' },
  2: { label: 'Good', color: 'var(--bx-c2)' },
  3: { label: 'Fair', color: 'var(--bx-c3)' },
  4: { label: 'Poor', color: 'var(--bx-c4)' },
  5: { label: 'Failed', color: 'var(--bx-c5)' },
};

export const BUILDINGS = [
  { id: 'AQU-03', name: 'Aquatic Centre', type: 'Recreation', cond: 4, risk: 86, x: 612, y: 248, gfa: '6,420 m²' },
  { id: 'HAL-05', name: 'Eastside Community Hall', type: 'Community', cond: 4, risk: 72, x: 668, y: 128, gfa: '940 m²' },
  { id: 'DEP-04', name: 'Works Depot', type: 'Operational', cond: 3, risk: 61, x: 182, y: 368, gfa: '3,100 m²' },
  { id: 'CIV-01', name: 'Civic Centre', type: 'Administration', cond: 3, risk: 58, x: 404, y: 214, gfa: '8,860 m²' },
  { id: 'REC-08', name: 'Leisure Centre', type: 'Recreation', cond: 3, risk: 49, x: 286, y: 118, gfa: '4,210 m²' },
  { id: 'LIB-02', name: 'Central Library', type: 'Cultural', cond: 2, risk: 34, x: 452, y: 318, gfa: '3,740 m²' },
  { id: 'CCC-06', name: 'Childcare Centre', type: 'Community', cond: 2, risk: 28, x: 532, y: 408, gfa: '760 m²' },
  { id: 'GAL-07', name: 'Regional Gallery', type: 'Cultural', cond: 1, risk: 12, x: 352, y: 412, gfa: '2,050 m²' },
];

export const PORTFOLIO = {
  name: 'Sample council portfolio',
  buildings: 48,
  components: '6,212',
  avgCond: '2.9',
  critical: 14,
  fwp: '$86.4M',
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
      <CondDot c={c} /> C{c}
    </span>
  );
}

export function Kpi({ label, value, delta, tone, className = '' }) {
  return (
    <div className={`tile p-3.5 ${className}`}>
      <div className="eyebrow !text-[10px]">{label}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[26px] font-light tracking-[-0.03em] leading-none">{value}</span>
        {delta && (
          <span className="mono text-[10.5px]" style={{ color: tone || 'var(--bx-mute)' }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

// Window chrome for a mocked platform screen.
export function Screen({ title, meta, children, className = '' }) {
  return (
    <Glass className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b hair">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5">
            <span className="dot !w-[7px] !h-[7px] bg-white/15" />
            <span className="dot !w-[7px] !h-[7px] bg-white/10" />
            <span className="dot !w-[7px] !h-[7px] bg-white/[0.06]" />
          </div>
          <span className="text-[13px] tracking-[-0.01em] truncate">{title}</span>
        </div>
        {meta && <span className="mono text-[10.5px] dim truncate hidden sm:block">{meta}</span>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </Glass>
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
    <div className={`relative overflow-hidden rounded-[14px] border hair bg-[#09090b] ${className}`}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 block w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="mapVignette" cx="50%" cy="45%" r="70%">
            <stop offset="0.55" stopColor="#09090b" stopOpacity="0" />
            <stop offset="1" stopColor="#050506" stopOpacity="0.95" />
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
                  fontFamily="Inter Tight, sans-serif"
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
            <CondDot c={c} /> C{c}
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
