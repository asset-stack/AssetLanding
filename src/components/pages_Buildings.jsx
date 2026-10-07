import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { PLATFORM_URL } from '@/config/site';
import { Eyebrow, Glass, Reveal, CityMap, PORTFOLIO } from '@/components/buildings/kit';
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

const HERO_IMG = '/media/buildings/map-aerial-angled.webp';
const CLOSE_IMG = '/media/buildings/map-topdown-estuary.webp';
const BAND_IMG = '/media/21e58ce44_abstract-ceiling-of-the-daxing-airport-2026-01-07-07-14-49-utc.webp';

const GROUPS = [
  {
    id: 'overview',
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
    n: '02',
    label: 'Condition assessment',
    title: 'Know the condition of every component.',
    intro: 'From a roof membrane to a fire panel — rated, photographed, mapped to the building and rolled into a 20-year plan.',
    features: [
      { k: 'Condition overview', d: 'IPWEA C1–C5 ratings across every component, with photo evidence and element-level averages.', P: ConditionPanel },
      { k: '20-year FWP', d: 'A forward works program built from condition and remaining life — by year, by trade, against budget.', P: FwpPanel },
      { k: 'Asset tree', d: 'Site → building → system → component. Drill to the smallest replaceable part and its history.', P: AssetTreePanel },
      { k: 'Digital twin', d: 'Walk the building remotely. Hotspots tie defects, sensors and findings to the exact location.', P: TwinPanel },
      { k: 'Equipment', d: 'A single register of plant and equipment — install year, condition and replacement value.', P: EquipmentPanel },
      { k: 'Sensors', d: 'BMS, MQTT, BACnet or CSV. Live readings with threshold rules and anomaly alerts.', P: SensorsPanel },
    ],
  },
  {
    id: 'operations',
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

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      <img
        src={HERO_IMG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(0.35) brightness(0.55) contrast(1.1)' }}
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050506]/70 via-[#050506]/30 to-[#050506]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050506]/80 via-transparent to-transparent" />
      <div className="glow w-[520px] h-[520px] -right-40 top-10" style={{ background: '#1e36ee', opacity: 0.22 }} />
      <div className="grain" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 pt-36 pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-12 items-end">
          <div>
            <Reveal>
              <Eyebrow className="flex items-center gap-2">
                <span className="dot pulse" style={{ background: 'var(--bx-signal)', color: 'var(--bx-signal)' }} />
                AssetStack · Buildings &amp; Facilities
              </Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display text-[44px] sm:text-[68px] lg:text-[84px] mt-6">
                Every building.
                <br />
                <span className="text-white/45">One quiet signal.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[520px] text-[16px] sm:text-[17px] leading-[1.6] mute">
                Condition, maintenance, risk and capital — for every building, plant room and component you own. AssetStack
                turns inspections, sensors and work history into one program you can defend.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-9 flex flex-wrap gap-2.5">
              <a href="/Contact" className="btn btn-light">
                Book a demo <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#overview" className="btn btn-ghost">
                Explore the platform
              </a>
            </Reveal>
          </div>

          <Reveal delay={320} className="hidden md:block">
            <Glass className="p-4">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="text-[13px]">Portfolio</span>
                <span className="mono text-[10.5px] dim">{PORTFOLIO.buildings} buildings · live</span>
              </div>
              <CityMap compact className="aspect-[16/10]" selected="AQU-03" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  ['Avg condition', PORTFOLIO.avgCond],
                  ['Critical', PORTFOLIO.critical],
                  ['20-yr FWP', PORTFOLIO.fwp],
                ].map(([k, v]) => (
                  <div key={k} className="tile px-3 py-2.5">
                    <div className="mono text-[9.5px] dim uppercase tracking-[0.12em]">{k}</div>
                    <div className="text-[20px] font-light tracking-[-0.03em] mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </Glass>
          </Reveal>
        </div>

        <Reveal delay={400} className="mt-16 sm:mt-24 grid grid-cols-2 sm:grid-cols-5 border-t hair">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="group pt-4 pr-4 pb-2">
              <span className="mono text-[10.5px] dim">{g.n}</span>
              <span className="block mt-1 text-[14px] mute group-hover:text-white transition-colors">{g.label}</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Feature group ─────────────────────────────────────────────────────────

function Group({ g }) {
  const [i, setI] = useState(0);
  const F = g.features[i];
  const single = g.features.length === 1;
  return (
    <section id={g.id} className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal className="flex items-baseline gap-4 border-t hair pt-6">
          <span className="mono text-[11px] dim">{g.n}</span>
          <Eyebrow>{g.label}</Eyebrow>
        </Reveal>
        <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] gap-10 lg:gap-14">
          <div className="lg:sticky lg:top-28 self-start">
            <Reveal>
              <h2 className="display text-[34px] sm:text-[44px]">{g.title}</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-5 text-[15px] leading-[1.65] mute max-w-[420px]">{g.intro}</p>
            </Reveal>
            {!single && (
              <Reveal delay={140} className="mt-8 hidden lg:block" role="tablist" aria-label={`${g.label} features`}>
                {g.features.map((f, k) => (
                  <button key={f.k} type="button" role="tab" aria-selected={i === k} onClick={() => setI(k)} className="feat">
                    <span className="flex items-center justify-between text-[15px] tracking-[-0.01em]">
                      {f.k}
                      <span className="mono text-[10px] dim">0{k + 1}</span>
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
    ['C1–C5', 'IPWEA-aligned condition ratings on every component'],
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
        style={{ filter: 'grayscale(1) brightness(0.28) contrast(1.2)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#050506]/40 to-[#050506]" />
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <h2 className="display text-[34px] sm:text-[52px] max-w-[820px]">
            Built for the people who keep public buildings open.
          </h2>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(([k, d], i) => (
            <Reveal key={k} delay={i * 70}>
              <Glass className="p-6 h-full">
                <div className="text-[30px] font-light tracking-[-0.03em]">{k}</div>
                <div className="mt-3 text-[13.5px] leading-[1.55] mute">{d}</div>
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
        style={{ filter: 'grayscale(0.6) brightness(0.32)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#050506]/50 to-[#050506]" />
      <div className="glow w-[640px] h-[360px] left-1/2 -translate-x-1/2 top-1/3" style={{ background: '#1e36ee', opacity: 0.25 }} />
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 text-center">
        <Reveal>
          <img src="/media/buildings/as-icon-white.webp" alt="" width="40" height="40" className="w-10 h-10 mx-auto opacity-90" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display text-[40px] sm:text-[64px] mt-8">
            See your buildings
            <br />
            <span className="text-white/45">the way we do.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 text-[15px] mute max-w-[460px] mx-auto leading-[1.65]">
            Bring a register, a condition report or a single building. We’ll show you its 20-year program in the first session.
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-10 flex flex-wrap justify-center gap-2.5">
          <a href="/Contact" className="btn btn-light">
            Book a demo <ArrowRight className="w-4 h-4" />
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
