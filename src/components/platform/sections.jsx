import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { CONTACT_URL, DEMO_URL, MAIN_SITE } from '@/config/site';
import { Eyebrow, Glass, Reveal } from './kit';

// ─── Breathing room ────────────────────────────────────────────────────────
// The client logo strip was removed from this page; its black space stays so
// the hero still settles before the story starts.

export function Trusted() {
  return <div aria-hidden="true" className="h-[220px] sm:h-[194px]" />;
}

// ─── First week ────────────────────────────────────────────────────────────
// Mirrors the homepage "Your first 7 days" deliverables.

const DAYS = [
  ['1', 'Asset register imported', 'Your Excel or CSV register mapped to your own hierarchy, with every site geocoded.'],
  ['2', 'Condition baseline', 'Photos and existing reports graded, so every component carries a 1 – 5 condition and remaining life.'],
  ['3', 'Predictions running', 'Risk scores and failure probability computed for critical plant.'],
  ['4', 'Funding plan optimised', 'A capital plan built against your budget, ranked by risk reduced per dollar.'],
  ['5', 'Compliance live', 'Inspection cycles scheduled, audit trail on, evidence packs generated.'],
  ['7', 'First savings logged', 'The first verified entry in your savings ledger.'],
];

export function FirstWeek() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-end">
          <Reveal>
            <Eyebrow className="flex items-center gap-2">
              <span className="dot" style={{ background: 'var(--bx-blue)' }} /> Onboarding
            </Eyebrow>
            <h2 className="display text-[36px] sm:text-[52px] mt-5">
              <span className="text-white/45">Your first</span> 7 days.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-[15px] leading-[1.65] mute max-w-[520px]">
              No vague onboarding. These are the things you will have in hand by the end of week one, built from the register
              and reports you already have.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAYS.map(([d, t, body], i) => (
            <Reveal key={d} delay={i * 60}>
              <div className="card p-6 h-full">
                <div className="flex items-center justify-between">
                  <span className="mono text-[12px]" style={{ color: 'var(--bx-blue-ink)' }}>
                    Day {d}
                  </span>
                  {i === DAYS.length - 1 && <Check className="w-4 h-4" style={{ color: 'var(--bx-ok)' }} />}
                </div>
                <div className="mt-8 text-[17px] font-medium tracking-[-0.01em]">{t}</div>
                <p className="mt-2 text-[13.5px] leading-[1.55] mute">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

const FAQS = [
  [
    'Which industries is AssetStack built for?',
    'Five core industries: buildings and facilities, rail infrastructure, mining, oil and gas, power and utilities, and heavy civil infrastructure. The platform is the same; the hierarchy, asset types and examples follow your operation. Use the industry switcher above to see each one.',
  ],
  [
    'How fast can we go live?',
    'A pilot typically runs in two to four weeks. We import your asset register, grade a representative sample and configure roles and workflows alongside your team, with hands-on onboarding throughout.',
  ],
  [
    'We already have a register and condition reports. Can we use them?',
    'Yes. AssetStack imports Excel and CSV registers, existing inspection data and work history, then organises everything into your own hierarchy: site, room, section, plant or structure. Nothing is re-collected unless it is missing.',
  ],
  [
    'Do we need sensors?',
    'No. Condition assessment, the 20-year program, compliance and capital planning all run from registers, inspection data and photos. Where you do have sensors or SCADA, readings are ingested by MQTT, REST or CSV and drive live predictions.',
  ],
  [
    'Does it work with our CMMS or finance system?',
    'AssetStack supports flat-file imports and a REST API for asset records, sensor data and work orders. Integrations with specific CMMS or ERP systems are scoped per engagement.',
  ],
  [
    'Is the reporting aligned to ISO 55000?',
    'Yes. Reports are audit-ready and aligned to ISO 55000 (and IPWEA for councils), so the same data supports your asset management plan, renewals forecast and regulatory reporting.',
  ],
  [
    'Where is our data stored?',
    'In Australia. See the security documentation for hosting, access control and compliance detail.',
  ],
  [
    'What does it cost?',
    'Pricing is shaped to your portfolio size, deployment and integration needs. After a short scoping call we will quote precisely.',
  ],
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16">
        <Reveal>
          <Eyebrow className="flex items-center gap-2">
            <span className="dot" style={{ background: 'var(--bx-blue)' }} /> FAQ
          </Eyebrow>
          <h2 className="display text-[36px] sm:text-[52px] mt-5">
            <span className="text-white/45">Questions,</span> answered.
          </h2>
          <p className="mt-6 text-[14px] mute">
            Something else?{' '}
            <a href={CONTACT_URL} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">
              Ask us directly
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={80}>
          <ul className="border-t hair">
            {FAQS.map(([q, a], i) => {
              const on = open === i;
              return (
                <li key={q} className="border-b hair">
                  <button
                    type="button"
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left text-[16px] sm:text-[17px] font-medium tracking-[-0.01em]"
                  >
                    {q}
                    <ChevronDown className={`w-4 h-4 flex-none mute transition-transform duration-300 ${on ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-10 text-[14.5px] leading-[1.65] mute">
                        {a}
                        {q.startsWith('Where') && (
                          <>
                            {' '}
                            <a href={`${MAIN_SITE}/SecurityDocs`} className="text-white underline underline-offset-4 decoration-white/30">
                              Security documentation
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Demo ──────────────────────────────────────────────────────────────────
// This page exists to send people to the core site, so the demo block links
// to assetstackai.com instead of collecting details itself.

export function Demo() {
  return (
    <section id="demo" className="relative scroll-mt-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1232f6 0%, #0a1ee0 45%, #0000d3 100%)' }}>
      <img
        src="/media/buildings/map-aerial-angled.webp"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(1) contrast(1.2)', mixBlendMode: 'multiply', opacity: 0.35 }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 15% 10%, rgba(255,255,255,0.14), transparent 60%)' }} />
      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 py-24 sm:py-32 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
        <Reveal>
          <img src="/media/buildings/as-icon-white.webp" alt="" width="44" height="44" className="w-11 h-11" />
          <h2 className="display text-[40px] sm:text-[60px] mt-8">
            <span className="text-white/60">Fewer surprises.</span>
            <br />
            Fewer call-outs.
            <br />
            One program.
          </h2>
          <span className="block w-12 h-[2px] bg-white mt-10" />
          <p className="mt-6 text-[16px] leading-[1.6] text-white/85 max-w-[460px]">
            Every source of asset data, one platform for predictive maintenance. Bring a register, a SCADA export or a single
            critical asset and we will show you what it is telling you in the first session.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <Glass className="p-6 sm:p-8 !bg-[rgba(0,0,40,0.28)]">
            <div className="text-[18px] font-medium">See it on your own data</div>
            <p className="mt-2 text-[14px] text-white/70 leading-[1.6]">
              Book a walkthrough with the team at assetstackai.com, or get in touch with a question first.
            </p>
            <div className="mt-7 space-y-3">
              <a
                href={DEMO_URL}
                className="w-full h-12 rounded-full bg-white text-[#0000d3] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
              >
                Book a demo <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_URL}
                className="w-full h-12 rounded-full border border-white/30 text-white text-[15px] inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                Contact us <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <a href={MAIN_SITE} className="mt-6 block text-center text-[12.5px] text-white/55 hover:text-white">
              Visit assetstackai.com
            </a>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}
