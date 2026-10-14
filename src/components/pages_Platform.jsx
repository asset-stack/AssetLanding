import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, ChevronUp, Menu, X } from 'lucide-react';
import { PLATFORM_URL } from '@/config/site';
import { Eyebrow, Glass, LensContext, NoisyChart, Num, Reveal, useLens, useSetLens } from '@/components/platform/kit';
import { CORE, LENSES, LENS_ORDER } from '@/components/platform/lenses';
import { DashboardPanel, ConditionPanel, FwpPanel, AssetTreePanel, TwinPanel, EquipmentPanel, SensorsPanel } from '@/components/platform/panelsCondition';
import { MaintenancePanel, PredictionsPanel, AnalyticsPanel, CascadePanel, CapitalPanel, FundingPanel } from '@/components/platform/panelsOps';
import { IngestPanel, ReadinessPanel, CompliancePanel } from '@/components/platform/panelsNew';
import { Demo, Faq, FirstWeek, Trusted } from '@/components/platform/sections';

// AssetStack — the platform story across five core industries, told as the
// data journey (ingest → understand → predict → act → prove). A sticky
// industry lens re-skins every platform view. All data is illustrative.

const M = '/media/buildings/';
const HERO_IMG = `${M}hero-drone-poster.webp`; // first frame of HERO_VIDEO
// Drone flyover of the same aerial shot, scrubbed by scroll. Empty → the
// still image stays as the hero background.
const HERO_VIDEO = '/media/platform-hero-drone'; // base path: .mp4 (H.264) first, .webm (VP9) fallback
const BAND_IMG = `${M}photo-worker.webp`;

const CHAPTERS = [
  {
    id: 'ingest',
    n: '01',
    label: 'Ingest',
    title: 'Pull in every source you already have.',
    intro: 'SCADA tags, sensor streams, work orders, registers, inspection photos and LiDAR scans — matched to the right asset and housed in one model.',
    features: [
      { k: 'Data sources', d: 'Every source connected and matched to one asset record, with the models that read it.', P: IngestPanel },
      { k: 'Portfolio view', d: 'Everything you own on one map, coloured by condition, with live alerts and an AssetMind summary.', P: DashboardPanel },
    ],
  },
  {
    id: 'understand',
    n: '02',
    label: 'Understand',
    title: 'Know the condition of everything you own.',
    intro: 'One defensible register, a 1 – 5 condition grade on every asset, a 20-year program and a digital twin to walk it remotely.',
    features: [
      { k: 'Asset register', d: 'Your own hierarchy, from site down to the smallest replaceable part, with history attached.', P: AssetTreePanel },
      { k: 'Condition assessment', d: 'A 1 – 5 grade on every asset, with photo evidence, rolled up by site.', P: ConditionPanel },
      { k: '20-year program', d: 'Forward works built from condition and remaining life, by year and by group, against budget.', P: FwpPanel },
      { k: 'Digital twin', d: 'LiDAR and 3D captures with hotspots that tie defects and sensors to the exact location.', P: TwinPanel },
      { k: 'Equipment', d: 'Every asset with install year, condition and replacement value. Filter, then export.', P: EquipmentPanel },
    ],
  },
  {
    id: 'predict',
    n: '03',
    label: 'Predict',
    title: 'See the failure before it happens.',
    intro: 'Predictive maintenance on the assets that matter most: remaining useful life, failure probability and the signals behind every prediction.',
    features: [
      { k: 'Predictive maintenance', d: 'Days to failure, failure risk and likely failure modes, with a confidence interval.', P: PredictionsPanel },
      { k: 'Sensors', d: 'Live readings from MQTT, REST or CSV, with threshold rules and anomaly alerts.', P: SensorsPanel },
      { k: 'Defect cascade', d: 'Model how one failure spreads, and what waiting really costs.', P: CascadePanel },
      { k: 'Analytics', d: 'Availability, backlog and risk intensity trended across every site.', P: AnalyticsPanel },
    ],
  },
  {
    id: 'act',
    n: '04',
    label: 'Act',
    title: 'Schedule the work. Ready the operation.',
    intro: 'Predictions become work orders, bundled into the possessions, shutdowns, outages and closures you already plan around.',
    features: [
      { k: 'Work scheduling', d: 'Planned, reactive and predictive work in one queue, packed into your access windows.', P: MaintenancePanel },
      { k: 'Operational readiness', d: 'Checklists, critical spares and availability against target before every restart, handback or peak.', P: ReadinessPanel },
    ],
  },
  {
    id: 'prove',
    n: '05',
    label: 'Prove',
    title: 'Prove compliance. Spend where it counts.',
    intro: 'Every obligation tracked with evidence, every capital decision compared on whole-of-life cost, every budget built for the most risk removed.',
    features: [
      { k: 'Compliance', d: 'Statutory and inspection obligations with due dates, evidence packs and an audit trail.', P: CompliancePanel },
      { k: 'Capital decision', d: 'Defer, repair, refurbish or replace, compared on 20-year cost and residual risk.', P: CapitalPanel },
      { k: 'Funding optimiser', d: 'Set a budget cap. The solver picks the project mix with the most risk reduced per dollar.', P: FundingPanel },
    ],
  },
];

// ─── Industry lens switcher ────────────────────────────────────────────────

function LensPills({ size = 'md' }) {
  const lens = useLens();
  const setLens = useSetLens();
  return (
    <div className="flex gap-1 p-1 rounded-full bg-black/40 border hair backdrop-blur-xl w-max" role="tablist" aria-label="Industry">
      {LENS_ORDER.map((id) => {
        const on = lens.id === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => setLens(id)}
            className={`rounded-full whitespace-nowrap transition-colors ${size === 'sm' ? 'px-3 h-8 text-[12.5px]' : 'px-4 h-9 text-[13px]'} ${
              on ? 'bg-[var(--bx-blue)] text-white' : 'mute hover:text-white'
            }`}
          >
            {LENSES[id].label}
          </button>
        );
      })}
    </div>
  );
}

function LensBar() {
  const lens = useLens();
  return (
    <div className="sticky top-[84px] z-40 pointer-events-none">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-2">
        <div className="pointer-events-auto flex items-center gap-3 scroll-x">
          <span className="hidden md:inline text-[12px] mute whitespace-nowrap">Viewing as</span>
          <LensPills size="sm" />
          <span className="hidden xl:inline text-[12px] dim whitespace-nowrap">{lens.lead}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4">
      <Glass
        className={`glass-pill mx-auto max-w-[1180px] flex items-center justify-between h-14 pl-5 pr-2 transition-[background] duration-500 ${
          scrolled ? '' : '!bg-transparent !shadow-none before:!opacity-0 !backdrop-blur-0'
        }`}
      >
        <a href="/Platform" className="flex items-center gap-2.5" aria-label="AssetStack platform">
          <img src="/media/buildings/as-symbol-colour.webp" alt="" width="20" height="20" className="w-5 h-5" />
          <img src="/media/buildings/as-wordmark-white.webp" alt="AssetStack" height="16" className="h-[15px] w-auto" />
          <span className="hidden sm:inline text-[11.5px] dim ml-1.5 pl-3 border-l hair">Platform</span>
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-[13px] mute">
          {CHAPTERS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="hover:text-white transition-colors">
              {g.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:block">
            <a href={PLATFORM_URL} className="btn !h-10 !px-4 mute hover:!text-white">
              Sign in
            </a>
          </span>
          <a href="#demo" className="btn btn-light !h-10 !px-4">
            Book a demo
          </a>
          <span className="lg:hidden">
            <button
              type="button"
              className="btn btn-ghost !h-10 !w-10 !p-0 justify-center"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </span>
        </div>
      </Glass>
      {open && (
        <Glass className="lg:hidden mx-auto max-w-[1180px] mt-2 p-2">
          {CHAPTERS.map((g) => (
            <a key={g.id} href={`#${g.id}`} onClick={() => setOpen(false)} className="flex justify-between px-4 py-3 rounded-[14px] hover:bg-white/5 text-[15px]">
              {g.label} <span className="mono text-[11px] dim">{g.n}</span>
            </a>
          ))}
          <a href={PLATFORM_URL} className="flex px-4 py-3 text-[15px] mute">
            Sign in
          </a>
        </Glass>
      )}
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

// Scroll position (0 – 1) at which each hero card pops in.
const POP = { health: 0.1, operational: 0.3, critical: 0.42, warning: 0.58 };

function pop(on, delay = 0) {
  return { className: `pop ${on ? 'in' : ''}`, style: { transitionDelay: on ? `${delay}ms` : '0ms' } };
}

function HeroCards({ p }) {
  const L = useLens();
  const C = L.heroCard;
  const health = pop(p >= POP.health);
  const op = pop(p >= POP.operational);
  const crit = pop(p >= POP.critical);
  const warn = pop(p >= POP.warning);
  return (
    <div key={L.id} className="relative h-[460px] hidden md:block">
      <Glass className={`absolute right-0 top-0 w-[330px] p-5 ${health.className}`} style={health.style}>
        <div className="flex items-start justify-between">
          <span className="text-[13px]">{C.healthLabel || 'Portfolio health'}</span>
          <ArrowUpRight className="w-4 h-4 mute" strokeWidth={1.5} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <Num v={C.health} className="text-[44px] leading-none" />
          <span className="text-[11px] mute">% · today</span>
        </div>
        <NoisyChart seed={L.id.length * 5 + 6} n={140} h={70} band={[0.66, 0.8]} className="mt-4" axis={false} />
        <div className="flex justify-between text-[10.5px] dim mt-2">
          <span>{L.portfolio.name}</span>
          <span>12 mo</span>
        </div>
      </Glass>
      <div className="absolute left-0 top-[200px] w-[190px] space-y-2.5">
        <Glass className={`glass-sm p-4 ${op.className}`} style={op.style}>
          <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--bx-ok)' }} strokeWidth={2} />
          <div className="mt-2 flex items-end justify-between">
            <span className="text-[13px] mute">Operational</span>
            <span className="fig text-[24px] leading-none">{C.operational}</span>
          </div>
        </Glass>
        <Glass className={`glass-sm p-4 ${crit.className}`} style={crit.style}>
          <AlertTriangle className="w-4 h-4" style={{ color: 'var(--bx-alert)' }} strokeWidth={2} />
          <div className="mt-2 flex items-end justify-between">
            <span className="text-[13px] mute">Critical</span>
            <span className="fig text-[24px] leading-none">{C.critical}</span>
          </div>
        </Glass>
      </div>
      <Glass className={`absolute right-0 bottom-0 w-[300px] p-4 ${warn.className}`} style={warn.style}>
        <div className="flex items-center justify-between text-[13px]">
          <span>Warning</span>
          <ChevronUp className="w-4 h-4 mute" />
        </div>
        <div className="mt-2 text-[12.5px] mute">Predicted failures ({C.warnCount} assets)</div>
        <div className="mt-3 rounded-[14px] p-3" style={{ background: 'rgba(255,69,69,0.12)' }}>
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="w-4 h-4 rounded-full grid place-items-center text-[9px] font-medium flex-none" style={{ background: 'var(--bx-alert)' }}>
              1
            </span>
            {C.asset}
          </div>
          <div className="mt-1 pl-6 text-[11.5px] mute">{C.detail}</div>
          <div className="mt-2.5 pl-6 border-l hair ml-2 text-[11.5px]">
            {C.site}
            <span className="block dim">{C.siteSub}</span>
          </div>
        </div>
      </Glass>
    </div>
  );
}

// Scroll progress through the pinned hero (0 at the top, 1 when it releases).
// Reduced motion → no pinning, cards shown at once.
function useHeroScroll() {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [p, setP] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      setP(1);
      return undefined;
    }
    let raf = 0;
    let shown = 0; // eased video time
    const tick = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const prog = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      setP(prog);
      const v = videoRef.current;
      if (v && v.duration) {
        const goal = prog * (v.duration - 0.05);
        shown += (goal - shown) * 0.25;
        if (Math.abs(goal - shown) < 0.01) shown = goal;
        if (!v.seeking && Math.abs(v.currentTime - shown) > 0.01) v.currentTime = shown;
        if (shown !== goal) raf = requestAnimationFrame(tick);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return { trackRef, videoRef, p, still };
}

function Hero() {
  const { trackRef, videoRef, p, still } = useHeroScroll();
  const bgStyle = { filter: 'saturate(0.55) brightness(0.62) contrast(1.05)' };
  return (
    <section ref={trackRef} className="relative" style={{ height: still ? 'auto' : '240svh' }}>
    <div className={`${still ? 'relative' : 'sticky top-0'} min-h-[100svh] flex flex-col justify-end overflow-hidden`}>
      <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" style={bgStyle} fetchpriority="high" />
      {HERO_VIDEO && !still && (
        <video ref={videoRef} poster={HERO_IMG} muted playsInline preload="auto" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={bgStyle}>
          <source src={`${HERO_VIDEO}.mp4`} type="video/mp4" />
          <source src={`${HERO_VIDEO}.webm`} type="video/webm" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/80 via-[#0c0c0c]/10 to-[#0c0c0c]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/85 via-[#0c0c0c]/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 pt-36 pb-14 sm:pb-16">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
          <div>
            <Reveal>
              <Eyebrow className="flex items-center gap-2">
                <span className="dot pulse" style={{ background: 'var(--bx-blue)', color: 'var(--bx-blue)' }} />
                AssetStack platform
              </Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display text-[42px] sm:text-[60px] lg:text-[60px] xl:text-[68px] mt-6">
                <span className="text-white/45 lg:whitespace-nowrap">The intelligence layer</span>
                <br />
                for all your data.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[520px] text-[16px] leading-[1.6] mute">
                AssetStack pulls in every source — SCADA, sensors, work orders, registers, inspections and scans — houses and
                understands it, and turns it into predictive maintenance across buildings, rail, mining, power and heavy civil
                infrastructure.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-9 flex flex-wrap gap-2.5">
              <a href="#demo" className="btn btn-light">
                Book a demo
              </a>
              <a href="#ingest" className="btn btn-ghost">
                See how it works <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
          <HeroCards p={p} />
        </div>

        <Reveal delay={400} className="mt-14 sm:mt-20 border-t hair pt-5">
          <div className="text-[12px] mute mb-3">Choose your industry — every view on this page follows it</div>
          <div className="-mx-4 px-4 scroll-x">
            <LensPills />
          </div>
        </Reveal>
      </div>
      {!still && (
        <div aria-hidden className="absolute bottom-5 right-6 hidden md:flex items-center gap-2 text-[11px] dim transition-opacity duration-500" style={{ opacity: p < 0.05 ? 1 : 0 }}>
          <span className="w-px h-6 bg-white/30" /> Scroll
        </div>
      )}
    </div>
    </section>
  );
}

// ─── Context ───────────────────────────────────────────────────────────────

const PROBLEMS = [
  ['00.1', 'Your data', 'is split across SCADA, spreadsheets, CMMS and PDFs that never meet.'],
  ['00.2', 'Maintenance', 'still runs on the calendar, so failures land between services.'],
  ['00.3', 'Capital plans', 'are set before anyone knows which assets carry the risk.'],
];

function Context() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <Reveal>
            <h2 className="display text-[36px] sm:text-[56px]">
              Most operators already have the data.
              <span className="text-white/40"> It just never meets.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="hidden lg:block">
            <svg viewBox="0 0 360 220" className="w-full" aria-hidden="true">
              {[30, 70, 110, 150, 190].map((y, i) => (
                <path key={y} d={`M10,${y} C120,${y} 150,110 230,110`} fill="none" stroke="#fff" strokeOpacity={0.18 + i * 0.08} strokeDasharray="2 5" className="flow" />
              ))}
              {[30, 70, 110, 150, 190].map((y) => (
                <circle key={y} cx="10" cy={y} r="3" fill="#ececec" />
              ))}
              <circle cx="250" cy="110" r="34" fill="none" stroke="#fff" strokeOpacity="0.25" strokeDasharray="2 4" />
              <circle cx="250" cy="110" r="12" fill="#1232f6" />
              <path d="M284,110 L350,110" stroke="#1232f6" strokeWidth="2" />
            </svg>
          </Reveal>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-3">
          {PROBLEMS.map(([n, k, d], i) => (
            <Reveal key={n} delay={i * 80}>
              <div className="card p-6 h-full overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 60% at 80% 0%, rgba(255,255,255,0.08), transparent 70%)' }} />
                <div className="relative flex items-start gap-1">
                  <span className="fig text-[44px] text-white/25 leading-none">{n}</span>
                  <span className="mt-1 w-[5px] h-[5px] rounded-full" style={{ background: 'var(--bx-blue)' }} />
                </div>
                <p className="relative mt-8 text-[15px] leading-[1.55]">
                  {k} <span className="mute">{d}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chapter ───────────────────────────────────────────────────────────────

function Plate({ p }) {
  const [img, title, sub, body, value] = p;
  return (
    <div className="plate h-full min-h-[360px] lg:min-h-[420px]">
      <img key={img} src={img} alt="" loading="lazy" className="animate-in fade-in duration-700" />
      <Glass className="absolute left-5 right-5 bottom-5 sm:left-auto sm:w-[290px] p-5 z-10">
        <div className="flex items-start justify-between">
          <span className="text-[14px]">{title}</span>
          <ArrowUpRight className="w-4 h-4 mute" strokeWidth={1.5} />
        </div>
        <div className="text-[12px] mute mt-0.5">{sub}</div>
        <p className="mt-3 text-[12px] leading-[1.5] text-white/70">{body}</p>
        <Num v={value} className="block mt-6 text-[46px] leading-none" />
      </Glass>
    </div>
  );
}

function CoreFor({ id }) {
  const lens = useLens();
  const setLens = useSetLens();
  const core = CORE[id];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11.5px] dim mr-1">{core.length === LENS_ORDER.length ? 'Core for every industry' : 'Core for'}</span>
      {core.length < LENS_ORDER.length &&
        core.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setLens(c)}
            className={`chip transition-colors ${lens.id === c ? '!bg-[var(--bx-blue)] !text-white !border-[var(--bx-blue)]' : 'hover:!text-white'}`}
          >
            {LENSES[c].short}
          </button>
        ))}
    </div>
  );
}

function Chapter({ g }) {
  const L = useLens();
  const [i, setI] = useState(0);
  const F = g.features[i];
  const [statLabel, statValue, statCaption] = L.chapters[g.id].stat;
  return (
    <section id={g.id} className="relative scroll-mt-32 py-20 sm:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t hair pt-6">
          <span className="flex items-baseline gap-4">
            <span className="text-[11px] dim tabular-nums">{g.n}</span>
            <Eyebrow>{g.label}</Eyebrow>
          </span>
          <CoreFor id={g.id} />
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-stretch">
          <div className="flex flex-col">
            <Reveal>
              <h2 className="display text-[36px] sm:text-[48px]">
                <span className="text-white/70">{g.title}</span>
              </h2>
            </Reveal>
            <Reveal delay={80} className="mt-10">
              <div key={L.id} className="animate-in fade-in duration-500">
                <div className="text-[13px] mute">
                  {statLabel} · <span className="text-white/80">{L.short}</span>
                </div>
                <Num v={statValue} className="block text-[60px] sm:text-[76px] leading-none mt-2" />
                <div className="text-[13px] mute mt-2">{statCaption}</div>
              </div>
            </Reveal>
            <Reveal delay={140} className="mt-auto pt-10">
              <span className="block w-10 h-[2px]" style={{ background: 'var(--bx-blue)' }} />
              <p className="mt-5 text-[15px] leading-[1.65] mute max-w-[440px]">{g.intro}</p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Plate p={L.chapters[g.id].plate} />
          </Reveal>
        </div>

        <div className="mt-14 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-10 lg:gap-12">
          <div className="lg:sticky lg:top-36 self-start">
            <Reveal className="hidden lg:block" role="tablist" aria-label={`${g.label} features`}>
              {g.features.map((f, k) => (
                <button key={f.k} type="button" role="tab" aria-selected={i === k} onClick={() => setI(k)} className="feat">
                  <span className="flex items-center justify-between text-[15px] tracking-[-0.01em]">
                    {f.k}
                    <span className="text-[10.5px] dim tabular-nums">0{k + 1}</span>
                  </span>
                  <span className="feat-body">
                    <span className="overflow-hidden">
                      <span className="block pt-2 text-[13px] leading-[1.55] mute pr-6">{f.d}</span>
                    </span>
                  </span>
                </button>
              ))}
            </Reveal>
          </div>
          <div className="min-w-0">
            <div className="lg:hidden -mx-4 px-4 mb-4 scroll-x flex gap-1.5" role="tablist">
              {g.features.map((f, k) => (
                <button
                  key={f.k}
                  type="button"
                  role="tab"
                  aria-selected={i === k}
                  onClick={() => setI(k)}
                  className={`btn !h-9 !px-4 !text-[13px] ${i === k ? 'btn-light' : 'btn-ghost'}`}
                >
                  {f.k}
                </button>
              ))}
            </div>
            <Reveal delay={120}>
              <div key={`${L.id}-${F.k}`} className="animate-in fade-in duration-500">
                <F.P />
              </div>
              <p className="lg:hidden mt-4 text-[13.5px] leading-[1.55] mute">{F.d}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Proof band ────────────────────────────────────────────────────────────

function Band() {
  const stats = [
    ['5', 'Core industries on one platform'],
    ['1 – 5', 'Condition grade on every asset, with photo evidence'],
    ['ISO 55000', 'Audit-ready asset management reporting'],
    ['AU', 'Australian data residency'],
  ];
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <img src={BAND_IMG} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.4) brightness(0.4) contrast(1.1)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/30 to-[#0c0c0c]" />
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <h2 className="display text-[36px] sm:text-[56px] max-w-[860px]">
            <span className="text-white/45">Built for the people who</span> keep critical infrastructure running.
          </h2>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(([k, d], i) => (
            <Reveal key={k} delay={i * 70}>
              <Glass className="p-6 h-full">
                <div className="fig text-[30px]">{k}</div>
                <div className="mt-3 text-[13px] leading-[1.55] text-white/65">{d}</div>
              </Glass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t hair">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/media/buildings/as-symbol-colour.webp" alt="" width="16" height="16" className="w-4 h-4" />
          <img src="/media/buildings/as-wordmark-white.webp" alt="AssetStack" className="h-3 w-auto" />
          <span className="mono text-[10.5px] dim ml-2">© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] mute">
          <a href="/" className="hover:text-white">assetstackai.com</a>
          <a href="/Product" className="hover:text-white">Product</a>
          <a href="/SecurityDocs" className="hover:text-white">Security</a>
          <a href="/Contact" className="hover:text-white">Contact</a>
        </nav>
      </div>
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pb-10 text-[11.5px] dim">Platform views show illustrative sample data for each industry.</div>
    </footer>
  );
}

export default function Platform() {
  const [lensId, setLensId] = useState('buildings');
  // deep link: /Platform#rail etc.
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (LENSES[h]) setLensId(h);
  }, []);
  const ctx = { lens: LENSES[lensId], setLens: setLensId };
  return (
    <LensContext.Provider value={ctx}>
      <div className="bx min-h-screen">
        <Nav />
        <main>
          <Hero />
          <Trusted />
          <Context />
          <div className="relative">
            <LensBar />
            {CHAPTERS.map((g) => (
              <Chapter key={g.id} g={g} />
            ))}
          </div>
          <FirstWeek />
          <Band />
          <Faq />
          <Demo />
        </main>
        <Footer />
      </div>
    </LensContext.Provider>
  );
}
