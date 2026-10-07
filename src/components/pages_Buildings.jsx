import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, ChevronUp, Menu, X } from 'lucide-react';
import { PLATFORM_URL } from '@/config/site';
import { Eyebrow, Glass, NoisyChart, Num, Reveal, PORTFOLIO } from '@/components/buildings/kit';
import {
  DashboardPanel,
  ConditionPanel,
  FwpPanel,
  AssetTreePanel,
  TwinPanel,
  EquipmentPanel,
  SensorsPanel,
} from '@/components/buildings/panelsCondition';
import {
  MaintenancePanel,
  PredictionsPanel,
  AnalyticsPanel,
  CascadePanel,
  CapitalPanel,
  FundingPanel,
} from '@/components/buildings/panelsOps';

// AssetStack — Buildings & Facilities. A deliberately quiet, black,
// liquid-glass take on the platform, used to test a different design cue
// with the facilities market. All data shown is illustrative.

const M = '/media/buildings/';
const HERO_IMG = `${M}map-aerial-angled.webp`;
const CLOSE_IMG = `${M}map-topdown-estuary.webp`;
const BAND_IMG = `${M}photo-park.webp`;

const GROUPS = [
  {
    id: 'overview',
    stat: { label: 'Portfolio', value: '57%', caption: 'average health' },
    plate: { img: `${M}map-topdown-estuary.webp`, title: 'Portfolio status', sub: 'Moderate', body: 'AssetMind reads every inspection, sensor and work order and tells you where the portfolio stands this morning.', value: '57%' },
    n: '01',
    label: 'Dashboard',
    title: 'The whole portfolio, in one calm view.',
    intro: 'Condition, risk, live alerts and the long-range works program — for every building you own, on a single map.',
    features: [
      {
        k: 'Dashboard',
        d: 'Portfolio health, critical defects and the 20-year program, with a live map of every site coloured by condition.',
        P: DashboardPanel,
      },
    ],
  },
  {
    id: 'condition',
    stat: { label: 'Condition', value: '4,108', caption: 'components rated' },
    plate: { img: `${M}photo-atrium.webp`, title: 'Avg condition grade', sub: 'Average · 1 – 5 scale', body: 'Every component rated, photographed and mapped to its room.', value: '2.7' },
    n: '02',
    label: 'Condition assessment',
    title: 'Know the condition of every component.',
    intro: 'From a roof membrane to a fire panel — rated, photographed, mapped to the building and rolled into a 20-year plan.',
    features: [
      { k: 'Condition overview', d: 'A 1 – 5 condition grade on every component, with photo evidence, rolled up by location.', P: ConditionPanel },
      { k: '20-year FWP', d: 'A forward works program built from condition and remaining life — by year, by trade, against budget.', P: FwpPanel },
      { k: 'Asset tree', d: 'Site → building → system → component. Drill to the smallest replaceable part and its history.', P: AssetTreePanel },
      { k: 'Digital twin', d: 'Walk the building remotely. Hotspots tie defects, sensors and findings to the exact location.', P: TwinPanel },
      { k: 'Equipment', d: 'A single register of plant and equipment — install year, condition and replacement value.', P: EquipmentPanel },
      { k: 'Sensors', d: 'BMS, MQTT, BACnet or CSV. Live readings with threshold rules and anomaly alerts.', P: SensorsPanel },
    ],
  },
  {
    id: 'operations',
    stat: { label: 'Days to failure', value: '47', caption: 'Pool Circulation Pump 2' },
    plate: { img: `${M}photo-worker.webp`, title: 'Work order WO-4821', sub: 'Pump P-02 · bearing replacement', body: 'Raised automatically from the prediction and booked inside the failure window.', value: '9 days' },
    n: '03',
    label: 'Operations',
    title: 'Maintain on evidence, not on habit.',
    intro: 'Planned, reactive and predictive work in one queue — prioritised by what will fail, not by who asked loudest.',
    features: [
      { k: 'Maintenance', d: 'Work orders, compliance schedules and crew load — every job tracked end to end.', P: MaintenancePanel },
      { k: 'Predictions', d: 'Failure probability and remaining useful life for critical plant, with the signals that drive it.', P: PredictionsPanel },
    ],
  },
  {
    id: 'intelligence',
    stat: { label: 'Cost of waiting', value: '$142k', caption: 'vs $18k to fix today' },
    plate: { img: `${M}photo-library-stair.webp`, title: 'Defect cascade', sub: 'Roof membrane · 24 mo', body: 'One small defect, modelled through the building it sits in.', value: '×7.9' },
    n: '04',
    label: 'Intelligence',
    title: 'See what a defect becomes.',
    intro: 'Portfolio analytics and cascade modelling show how today’s small defect turns into tomorrow’s capital problem.',
    features: [
      { k: 'Analytics', d: 'Cost per m², backlog, consumption and renewal ratios — trended across the portfolio.', P: AnalyticsPanel },
      { k: 'Defect cascade', d: 'Model how one failure propagates through a building, and what deferral really costs.', P: CascadePanel },
    ],
  },
  {
    id: 'finance',
    stat: { label: 'Risk reduced', value: '62%', caption: 'on a $0.6M budget' },
    plate: { img: `${M}photo-office-team.webp`, title: 'Funding optimiser', sub: 'FY27 renewals', body: 'The project mix that removes the most risk for every dollar.', value: '$0.59M' },
    n: '05',
    label: 'Finance',
    title: 'Spend each dollar where it removes the most risk.',
    intro: 'Whole-of-life comparisons for every decision, and an optimiser that builds the renewal program for any budget.',
    features: [
      { k: 'Capital decision', d: 'Defer, repair, refurbish or replace — compared on 20-year whole-of-life cost and residual risk.', P: CapitalPanel },
      { k: 'Funding optimiser', d: 'Set a budget cap. The solver picks the project mix with the greatest risk reduction per dollar.', P: FundingPanel },
    ],
  },
];

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
        <a href="/Buildings" className="flex items-center gap-2.5" aria-label="AssetStack — Buildings & Facilities">
          <img src="/media/buildings/as-icon-white.webp" alt="" width="20" height="20" className="w-5 h-5" />
          <img src="/media/buildings/as-wordmark-white.webp" alt="AssetStack" height="16" className="h-[15px] w-auto" />
          <span className="hidden sm:inline mono text-[10.5px] dim ml-1.5 pl-3 border-l hair">Buildings &amp; Facilities</span>
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-[13px] mute">
          {GROUPS.map((g) => (
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
          <a href="/Contact" className="btn btn-light !h-10 !px-4">
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
          {GROUPS.map((g) => (
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

function HeroCards() {
  return (
    <div className="relative h-[460px] hidden md:block">
      <Glass className="absolute right-0 top-0 w-[330px] p-5">
        <div className="flex items-start justify-between">
          <span className="text-[13px]">Portfolio health</span>
          <ArrowUpRight className="w-4 h-4 mute" strokeWidth={1.5} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <Num v="57.4" className="text-[44px] font-light tracking-[-0.04em] leading-none" />
          <span className="text-[11px] mute">% · today</span>
        </div>
        <NoisyChart seed={11} n={140} h={70} band={[0.66, 0.8]} className="mt-4" axis={false} />
        <div className="flex justify-between text-[10.5px] dim mt-2">
          <span>2025</span>
          <span>2026</span>
        </div>
      </Glass>
      <div className="absolute left-0 top-[200px] w-[190px] space-y-2.5">
        <Glass className="glass-sm p-4">
          <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--bx-ok)' }} strokeWidth={2} />
          <div className="mt-2 flex items-end justify-between">
            <span className="text-[13px] mute">Operational</span>
            <span className="text-[24px] font-light leading-none tracking-[-0.02em]">3,965</span>
          </div>
        </Glass>
        <Glass className="glass-sm p-4">
          <AlertTriangle className="w-4 h-4" style={{ color: 'var(--bx-alert)' }} strokeWidth={2} />
          <div className="mt-2 flex items-end justify-between">
            <span className="text-[13px] mute">Critical</span>
            <span className="text-[24px] font-light leading-none tracking-[-0.02em]">143</span>
          </div>
        </Glass>
      </div>
      <Glass className="absolute right-0 bottom-0 w-[300px] p-4">
        <div className="flex items-center justify-between text-[13px]">
          <span>Warning</span>
          <ChevronUp className="w-4 h-4 mute" />
        </div>
        <div className="mt-2 text-[12.5px] mute">Predicted failures (3 assets)</div>
        <div className="mt-3 rounded-[14px] p-3" style={{ background: 'rgba(255,69,69,0.12)' }}>
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="w-4 h-4 rounded-full grid place-items-center text-[9px] font-medium" style={{ background: 'var(--bx-alert)' }}>
              1
            </span>
            Pool Circulation Pump 2
          </div>
          <div className="mt-1 pl-6 text-[11.5px] mute">47 days RUL · bearing wear</div>
          <div className="mt-2.5 pl-6 border-l hair ml-2 text-[11.5px]">
            Aquatic Centre
            <span className="block dim">Plant Room · work order raised</span>
          </div>
        </div>
      </Glass>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      <img
        src={HERO_IMG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(0.55) brightness(0.62) contrast(1.05)' }}
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/80 via-[#0c0c0c]/10 to-[#0c0c0c]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/85 via-[#0c0c0c]/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 pt-36 pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
          <div>
            <Reveal>
              <Eyebrow className="flex items-center gap-2">
                <span className="dot pulse" style={{ background: 'var(--bx-orange)', color: 'var(--bx-orange)' }} />
                AssetStack · Buildings &amp; Facilities
              </Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display text-[46px] sm:text-[70px] lg:text-[84px] mt-6">
                <span className="text-white/45">Every building.</span>
                <br />
                One quiet signal.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[500px] text-[16px] leading-[1.6] mute">
                Condition, maintenance, risk and capital for every building, room and component you own — read from your
                inspections, sensors and work history, and turned into one program you can defend.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-9 flex flex-wrap gap-2.5">
              <a href="/Contact" className="btn btn-light">
                Book a demo
              </a>
              <a href="#overview" className="btn btn-ghost">
                Explore the platform <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
          <Reveal delay={320}>
            <HeroCards />
          </Reveal>
        </div>

        <Reveal delay={400} className="mt-16 sm:mt-24 grid grid-cols-2 sm:grid-cols-5 border-t hair">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="group pt-4 pr-4 pb-2">
              <span className="text-[11px] dim tabular-nums">{g.n}</span>
              <span className="block mt-1 text-[14px] mute group-hover:text-white transition-colors">{g.label}</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Context: the problem, VEXTO "00.x" style ──────────────────────────────

const PROBLEMS = [
  ['00.1', 'Condition reports', 'live in PDFs that nobody re-reads once the budget is set.'],
  ['00.2', 'Renewal budgets', 'get fixed before anyone knows which assets carry the risk.'],
  ['00.3', 'Small defects', 'are deferred until they become capital works.'],
];

function Context() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <Reveal>
            <h2 className="display text-[36px] sm:text-[56px]">
              Most portfolios are managed from
              <span className="text-white/40"> spreadsheets, PDFs and memory.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="hidden lg:block">
            <svg viewBox="0 0 360 220" className="w-full">
              <path
                d="M10,30 C60,20 70,80 120,90 S190,60 210,120 S260,200 350,190"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.55"
                strokeDasharray="2 5"
                className="flow"
              />
              <circle cx="210" cy="120" r="30" fill="none" stroke="#fff" strokeOpacity="0.25" strokeDasharray="2 4" />
              <circle cx="210" cy="120" r="9" fill="#ececec" />
              <circle cx="120" cy="90" r="3" fill="#f08a3c" />
              <circle cx="350" cy="190" r="3" fill="#ececec" />
            </svg>
          </Reveal>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-3">
          {PROBLEMS.map(([n, k, d], i) => (
            <Reveal key={n} delay={i * 80}>
              <div className="card p-6 h-full overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(80% 60% at 80% 0%, rgba(255,255,255,0.08), transparent 70%)' }}
                />
                <div className="relative flex items-start gap-1">
                  <span className="text-[44px] font-extralight tracking-[-0.04em] text-white/25 leading-none">{n}</span>
                  <span className="mt-1 w-[3px] h-[3px] rounded-full" style={{ background: 'var(--bx-orange)' }} />
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

// ─── Feature group ─────────────────────────────────────────────────────────

function Plate({ p }) {
  return (
    <div className="plate h-full min-h-[360px] lg:min-h-[420px]">
      <img src={p.img} alt="" loading="lazy" />
      <Glass className="absolute left-5 right-5 bottom-5 sm:left-auto sm:w-[290px] p-5 z-10">
        <div className="flex items-start justify-between">
          <span className="text-[14px]">{p.title}</span>
          <ArrowUpRight className="w-4 h-4 mute" strokeWidth={1.5} />
        </div>
        <div className="text-[12px] mute mt-0.5">{p.sub}</div>
        <p className="mt-3 text-[12px] leading-[1.5] text-white/70">{p.body}</p>
        <Num v={p.value} className="block mt-6 text-[46px] font-extralight tracking-[-0.04em] leading-none" />
      </Glass>
    </div>
  );
}

function Group({ g }) {
  const [i, setI] = useState(0);
  const F = g.features[i];
  const single = g.features.length === 1;
  return (
    <section id={g.id} className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal className="flex items-baseline gap-4 border-t hair pt-6">
          <span className="text-[11px] dim tabular-nums">{g.n}</span>
          <Eyebrow>{g.label}</Eyebrow>
        </Reveal>

        {/* intro: two-tone headline + figure, photo plate with glass stat */}
        <div className="mt-10 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-stretch">
          <div className="flex flex-col">
            <Reveal>
              <h2 className="display text-[36px] sm:text-[48px]">
                <span className="text-white/45">{g.title}</span>
              </h2>
            </Reveal>
            <Reveal delay={80} className="mt-10">
              <div className="text-[13px] mute">{g.stat.label}</div>
              <Num v={g.stat.value} className="block text-[64px] sm:text-[80px] font-extralight tracking-[-0.05em] leading-none mt-2" />
              <div className="text-[13px] mute mt-2">{g.stat.caption}</div>
            </Reveal>
            <Reveal delay={140} className="mt-auto pt-10">
              <span className="block w-10 h-px" style={{ background: 'var(--bx-orange)' }} />
              <p className="mt-5 text-[15px] leading-[1.65] mute max-w-[440px]">{g.intro}</p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Plate p={g.plate} />
          </Reveal>
        </div>

        {/* the platform view */}
        <div className="mt-14 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-10 lg:gap-12">
          <div className="lg:sticky lg:top-28 self-start">
            {single ? (
              <Reveal>
                <div className="text-[15px]">{F.k}</div>
                <p className="mt-2 text-[13.5px] leading-[1.6] mute">{F.d}</p>
              </Reveal>
            ) : (
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
            )}
          </div>
          <div className="min-w-0">
            {!single && (
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
            )}
            <Reveal delay={120}>
              <div key={F.k} className="animate-in fade-in duration-500">
                <F.P />
              </div>
              {!single && <p className="lg:hidden mt-4 text-[13.5px] leading-[1.55] mute">{F.d}</p>}
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
    ['1 – 5', 'Condition grade on every component, with photo evidence'],
    ['20 yrs', 'Forward works program, regenerated as conditions change'],
    ['ISO 55000', 'Audit-ready asset management reporting'],
    ['AU', 'Australian data residency'],
  ];
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <img
        src={BAND_IMG}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(0.4) brightness(0.4) contrast(1.1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/30 to-[#0c0c0c]" />
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <h2 className="display text-[36px] sm:text-[56px] max-w-[820px]">
            <span className="text-white/45">Built for the people who</span> keep public buildings open.
          </h2>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(([k, d], i) => (
            <Reveal key={k} delay={i * 70}>
              <Glass className="p-6 h-full">
                <div className="text-[32px] font-extralight tracking-[-0.03em]">{k}</div>
                <div className="mt-3 text-[13px] leading-[1.55] text-white/65">{d}</div>
              </Glass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing ───────────────────────────────────────────────────────────────

function Closing() {
  return (
    <section className="relative py-28 sm:py-40 overflow-hidden">
      <img
        src={CLOSE_IMG}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(0.5) brightness(0.38)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/40 to-[#0c0c0c]" />
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 text-center">
        <Reveal>
          <img src="/media/buildings/as-icon-white.webp" alt="" width="40" height="40" className="w-10 h-10 mx-auto opacity-90" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display text-[42px] sm:text-[68px] mt-8">
            <span className="text-white/45">See your buildings</span>
            <br />
            the way we do.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 text-[15px] mute max-w-[460px] mx-auto leading-[1.65]">
            Bring a register, a condition report or a single building. We’ll show you its 20-year program in the first session.
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-10 flex flex-wrap justify-center gap-2.5">
          <a href="/Contact" className="btn btn-light">
            Book a demo
          </a>
          <a href="/Product" className="btn btn-ghost">
            Full platform <ArrowUpRight className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t hair">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/media/buildings/as-icon-white.webp" alt="" width="16" height="16" className="w-4 h-4" />
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
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pb-10 mono text-[10.5px] dim">
        Platform views show an illustrative sample portfolio.
      </div>
    </footer>
  );
}

export default function Buildings() {
  return (
    <div className="bx min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Context />
        {GROUPS.map((g) => (
          <Group key={g.id} g={g} />
        ))}
        <Band />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
