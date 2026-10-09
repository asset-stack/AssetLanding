import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Mail, Phone } from 'lucide-react';
import { FORM_ENDPOINT, CONTACT_EMAILS } from '@/config/site';
import { Eyebrow, Glass, Reveal } from './kit';

// ─── Trusted by ────────────────────────────────────────────────────────────
// Same confirmed client list (and logo files) as the homepage LogoCloud.

const CLIENTS = [
  ['BHP', 'bhp.svg'],
  ['Acciona', 'acciona.svg'],
  ['Alstom', 'alstom.svg'],
  ['Cargill', 'cargill.svg'],
  ['DP World Logistics', 'dpworld.svg'],
  ['Pacific National', 'pacificnational.svg'],
  ['ARTC', 'artc.png'],
  ['Hutchison Ports Australia', 'hutchisonports.png'],
  ['Peabody Energy', 'peabody.png'],
  ['Whitehaven Coal', 'whitehaven.svg'],
  ['InfraBuild', 'infrabuild.webp'],
  ['VicTrack', 'victrack.png'],
  ['Port of Newcastle', 'portofnewcastle.svg'],
  ['Southern Ports', 'southernports.svg'],
  ['Lycopodium', 'lycopodium.svg'],
  ['Spotless', 'spotless.svg'],
  ['Baiada', 'baiada.svg'],
  ['Idemitsu Boggabri Coal', 'boggabri.png'],
  ['Newcastle Coal Infrastructure Group', 'ncig.svg'],
  ['SCT Logistics', 'sct.svg'],
  ['ACFS Port Logistics', 'acfs.svg'],
  ['Daracon Group', 'daracon.svg'],
  ['Malabar Resources', 'malabar.png'],
  ['Port of Portland', 'portofportland.svg'],
];

export function Trusted() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <section className="relative py-14 border-y hair overflow-hidden" aria-label="Clients">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 flex flex-wrap items-baseline justify-between gap-2">
        <Eyebrow>Trusted by operators of critical infrastructure across Australia</Eyebrow>
        <span className="mono text-[11px] dim">{CLIENTS.length} organisations</span>
      </div>
      <div className="mt-8 relative" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
        <div className="marquee flex w-max items-center gap-14">
          {row.map(([name, file], i) => (
            <img
              key={`${file}-${i}`}
              src={`/media/clients/${file}`}
              alt={i < CLIENTS.length ? name : ''}
              aria-hidden={i >= CLIENTS.length ? 'true' : undefined}
              loading="lazy"
              className="h-7 w-auto max-w-[140px] object-contain opacity-50 hover:opacity-90 transition-opacity"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── First week ────────────────────────────────────────────────────────────
// Mirrors the homepage "Your first 7 days" deliverables.

const DAYS = [
  ['1', 'Asset register imported', 'Your Excel or CSV register mapped to Location → Room → Asset, with every site geocoded.'],
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
    'How fast can we go live?',
    'A pilot typically runs in two to four weeks. We import your asset register, grade a representative sample and configure roles and workflows alongside your team, with hands-on onboarding throughout.',
  ],
  [
    'We already have a register and condition reports. Can we use them?',
    'Yes. AssetStack imports Excel and CSV registers and your existing inspection data, then organises everything by location, room and asset. Nothing is re-collected unless it is missing.',
  ],
  [
    'Do we need sensors?',
    'No. Condition assessment, the 20-year forward works program and capital planning all run from inspection data and photos. Where you do have sensors, readings can be ingested by MQTT, REST or CSV to drive live predictions.',
  ],
  [
    'Does it work with our CMMS or finance system?',
    'AssetStack supports flat-file imports and a REST API for asset records, sensor data and work orders. Integrations with specific CMMS or ERP systems are scoped per engagement.',
  ],
  [
    'Is the reporting aligned to ISO 55000?',
    'Yes. Reports are audit-ready and aligned to ISO 55000 and IPWEA reporting standards, so the same data supports your asset management plan, renewals forecast and council reporting.',
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
            <a href="#demo" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">
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
                            <a href="/SecurityDocs" className="text-white underline underline-offset-4 decoration-white/30">
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

// ─── Demo request ──────────────────────────────────────────────────────────
// Same delivery as the site's ContactSection: JSON POST to FORM_ENDPOINT,
// or a pre-filled mailto when no endpoint is configured (never fake success).

const SIZES = ['Under 10 buildings', '10 – 50 buildings', '50 – 200 buildings', '200+ buildings'];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-white/70 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full h-11 rounded-[12px] bg-white/[0.08] border border-white/15 px-3.5 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-white/60 focus:bg-white/[0.12] transition-colors';

export function Demo() {
  const [form, setForm] = useState({ name: '', email: '', org: '', size: SIZES[1], message: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email) return;
    const fields = {
      name: form.name,
      email: form.email,
      organisation: form.org,
      portfolio: form.size,
      message: form.message,
      source: 'Buildings & Facilities landing page',
    };
    if (!FORM_ENDPOINT) {
      const body = Object.entries(fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      window.location.href = `mailto:${CONTACT_EMAILS.join(',')}?subject=${encodeURIComponent('Demo request — Buildings & Facilities')}&body=${encodeURIComponent(body)}`;
      return;
    }
    setState('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
    } catch {
      setState('error');
    }
  };

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
            Condition, maintenance, risk and capital for every building you own, one platform. Bring a register, a condition
            report or a single building and we will show you its 20-year program in the first session.
          </p>
          <div className="mt-8 space-y-2.5 text-[14px] text-white/85">
            <a href="mailto:hello@assetstackai.com" className="flex items-center gap-3 hover:text-white">
              <Mail className="w-4 h-4 text-white/60" /> hello@assetstackai.com
            </a>
            <a href="tel:+61439032387" className="flex items-center gap-3 hover:text-white">
              <Phone className="w-4 h-4 text-white/60" /> +61 439 032 387
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Glass className="p-6 sm:p-8 !bg-[rgba(0,0,40,0.28)]">
            {state === 'sent' ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-white/15 grid place-items-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <div className="mt-5 text-[20px] font-medium">Thanks, we’ll be in touch.</div>
                <p className="mt-2 text-[14px] text-white/70">Someone from the team will reply within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="text-[18px] font-medium">Book a demo</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name">
                    <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Jane Doe" autoComplete="name" />
                  </Field>
                  <Field label="Work email">
                    <input className={inputCls} type="email" required value={form.email} onChange={set('email')} placeholder="jane@council.gov.au" autoComplete="email" />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Organisation">
                    <input className={inputCls} value={form.org} onChange={set('org')} placeholder="Council or organisation" autoComplete="organization" />
                  </Field>
                  <Field label="Portfolio size">
                    <select className={`${inputCls} appearance-none`} value={form.size} onChange={set('size')}>
                      {SIZES.map((s) => (
                        <option key={s} value={s} className="text-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="What would you like to see?">
                  <textarea
                    rows={3}
                    className={`${inputCls} h-auto py-3 resize-none`}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Condition reports, renewals backlog, a specific building…"
                  />
                </Field>
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="w-full h-12 rounded-full bg-white text-[#0000d3] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-60"
                >
                  {state === 'sending' ? 'Sending…' : (
                    <>
                      Request a demo <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                {state === 'error' && (
                  <p className="text-[12.5px] text-center text-white" role="alert">
                    Something went wrong. Please email us at {CONTACT_EMAILS[0]}.
                  </p>
                )}
                <p className="text-[11.5px] text-white/55 text-center">We’ll only use your details to contact you about AssetStack.</p>
              </form>
            )}
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}
