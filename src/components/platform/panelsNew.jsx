import React from 'react';
import { AlertTriangle, Check, Circle, Database, FileCheck2, Box, Cpu, Image as ImageIcon, Map as MapIcon, Radio, ScanLine, Wrench } from 'lucide-react';
import { CondBadge, Kpi, Screen, useLens } from './kit';
import { SOURCES } from './lenses';

const TONE = { ok: 'var(--bx-ok)', warn: 'var(--bx-c4)', bad: 'var(--bx-alert)' };
const SRC_ICON = { scada: Cpu, iot: Radio, cmms: Wrench, register: Database, photos: ImageIcon, lidar: ScanLine, gis: MapIcon };

// ─── Ingest: every source into one asset record ────────────────────────────

const ROW = 46; // px per source row; the connector SVG uses the same pitch

export function IngestPanel() {
  const L = useLens();
  const on = new Set(L.sources);
  const R = L.record;
  const H = SOURCES.length * ROW;
  const mid = H / 2;
  return (
    <Screen title="Data ingestion" meta={`${L.sources.length} of ${SOURCES.length} source types connected · ${L.portfolio.name}`}>
      <div className="grid lg:grid-cols-[1fr_88px_1.05fr] gap-2.5 lg:gap-0 items-center">
        <ul className="tile p-2" style={{ minHeight: H + 16 }}>
          {SOURCES.map((s) => {
            const Icon = SRC_ICON[s.k];
            const live = on.has(s.k);
            return (
              <li key={s.k} className="flex items-center gap-3 px-2.5 rounded-[10px] transition-opacity duration-500" style={{ height: ROW, opacity: live ? 1 : 0.38 }}>
                <span className={`w-8 h-8 rounded-[9px] grid place-items-center flex-none ${live ? 'bg-[var(--bx-blue)] text-white' : 'bg-white/[0.05] mute'}`}>
                  <Icon className="w-4 h-4" strokeWidth={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] truncate">{s.t}</span>
                  <span className="block text-[11px] dim truncate">{s.d}</span>
                </span>
                <span className="text-[10.5px] flex-none" style={{ color: live ? 'var(--bx-ok)' : 'var(--bx-dim)' }}>
                  {live ? '● live' : 'available'}
                </span>
              </li>
            );
          })}
        </ul>

        <svg viewBox={`0 0 88 ${H + 16}`} className="hidden lg:block w-full" style={{ height: H + 16 }} preserveAspectRatio="none" aria-hidden="true">
          {SOURCES.map((s, i) => {
            const y = 8 + i * ROW + ROW / 2;
            const live = on.has(s.k);
            return (
              <path
                key={s.k}
                d={`M0,${y} C44,${y} 44,${mid + 8} 88,${mid + 8}`}
                fill="none"
                stroke={live ? '#1232f6' : '#ffffff'}
                strokeOpacity={live ? 0.9 : 0.08}
                strokeWidth={live ? 1.5 : 1}
                className={live ? 'flow' : ''}
              />
            );
          })}
        </svg>

        <div className="tile p-4 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(18,50,246,0.25)' }} />
          <div className="relative flex items-center gap-2 text-[11px] mute">
            <Box className="w-3.5 h-3.5" strokeWidth={1.6} /> One asset record
          </div>
          <div className="relative mt-3 flex items-baseline gap-2">
            <span className="mono text-[11px] dim">{R.id}</span>
            <span className="text-[17px] tracking-[-0.01em]">{R.name}</span>
          </div>
          <div className="relative text-[11.5px] dim mt-0.5">{R.path}</div>
          <dl className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
            {R.fields.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[11px] dim">{k}</dt>
                <dd className="mt-0.5 truncate">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="relative mt-4 pt-3 border-t hair">
            <div className="text-[11px] dim mb-2">Models applied</div>
            <div className="flex flex-wrap gap-1.5">
              {['Isolation Forest', 'LSTM autoencoder', 'Ensemble', 'Weibull'].map((m) => (
                <span key={m} className="chip !text-[10px]">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Operational readiness ─────────────────────────────────────────────────

const CHECK = {
  done: { Icon: Check, color: 'var(--bx-ok)', label: 'Done' },
  risk: { Icon: AlertTriangle, color: 'var(--bx-c4)', label: 'At risk' },
  todo: { Icon: Circle, color: 'var(--bx-dim)', label: 'Open' },
};

export function ReadinessPanel() {
  const L = useLens();
  const R = L.readiness;
  const done = R.checks.filter((c) => c[1] === 'done').length;
  const atRisk = R.checks.filter((c) => c[1] === 'risk').length;
  const short = R.spares.filter(([, have, need]) => have < need).length;
  const pct = (v) => `${((v - 80) / 20) * 100}%`; // gauge spans 80 – 100 %
  return (
    <Screen title={R.title} meta={R.meta}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Kpi label={R.event} value={`${R.inDays} days`} delta="to go" />
        <Kpi label="Checklist" value={`${done}/${R.checks.length}`} delta={`${atRisk} at risk`} tone={atRisk ? TONE.warn : TONE.ok} />
        <Kpi label="Critical spares" value={`${R.spares.length - short}/${R.spares.length}`} delta={short ? `${short} short` : 'all on hand'} tone={short ? TONE.bad : TONE.ok} />
        <Kpi label="Availability" value={`${R.availability}%`} delta={`target ${R.target}%`} tone={R.availability >= R.target ? TONE.ok : TONE.warn} />
      </div>
      <div className="tile p-4 mt-2.5">
        <div className="flex justify-between text-[11px] mute mb-2">
          <span>Availability vs target</span>
          <span className="mono">
            {R.availability}% / {R.target}%
          </span>
        </div>
        <div className="relative h-2.5 rounded-full bg-white/[0.06]">
          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: pct(R.availability), background: R.availability >= R.target ? 'var(--bx-ok)' : 'var(--bx-c4)' }} />
          <div className="absolute -top-1 -bottom-1 w-[2px] bg-white" style={{ left: pct(R.target) }} title="Target" />
        </div>
        <div className="flex justify-between mono text-[10px] dim mt-1.5">
          <span>80%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-2.5 mt-2.5">
        <div className="tile p-3">
          <div className="text-[11px] mute px-1 mb-2">Readiness checklist</div>
          <ul className="space-y-1.5">
            {R.checks.map(([t, st, ref]) => {
              const S = CHECK[st];
              return (
                <li key={t} className="flex items-center gap-3 rounded-[10px] bg-white/[0.03] px-3 py-2.5 text-[12.5px]">
                  <span className="w-5 h-5 rounded-full grid place-items-center flex-none" style={{ background: st === 'todo' ? 'transparent' : `color-mix(in srgb, ${S.color} 18%, transparent)`, border: st === 'todo' ? '1px solid rgba(255,255,255,.18)' : 'none' }}>
                    {st !== 'todo' && <S.Icon className="w-3 h-3" style={{ color: S.color }} strokeWidth={2.5} />}
                  </span>
                  <span className={`flex-1 min-w-0 ${st === 'done' ? 'mute line-through decoration-white/20' : ''}`}>{t}</span>
                  <span className="mono text-[10px] dim flex-none">{ref}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tile p-3">
          <div className="text-[11px] mute px-1 mb-2">Critical spares</div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-[10.5px] dim text-left">
                <th className="font-normal px-1 pb-2">Part</th>
                <th className="font-normal px-1 pb-2 text-right">On hand</th>
                <th className="font-normal px-1 pb-2 text-right">Needed</th>
              </tr>
            </thead>
            <tbody>
              {R.spares.map(([p, have, need]) => (
                <tr key={p} className="border-t hair">
                  <td className="px-1 py-2">{p}</td>
                  <td className="px-1 py-2 text-right mono" style={{ color: have < need ? 'var(--bx-alert)' : undefined }}>
                    {have}
                  </td>
                  <td className="px-1 py-2 text-right mono mute">{need}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11.5px] dim leading-snug">Shortfalls raise purchase requests against the work order.</p>
        </div>
      </div>
    </Screen>
  );
}

// ─── Compliance ────────────────────────────────────────────────────────────

const STATUS = {
  Overdue: { c: 'var(--bx-alert)', bg: 'rgba(255,69,69,.12)' },
  Due: { c: 'var(--bx-c4)', bg: 'rgba(240,138,60,.12)' },
  'Evidence ready': { c: 'var(--bx-blue-ink)', bg: 'rgba(18,50,246,.18)' },
  Compliant: { c: 'var(--bx-ok)', bg: 'rgba(95,210,122,.12)' },
};

export function CompliancePanel() {
  const L = useLens();
  const C = L.compliance;
  return (
    <Screen title="Compliance" meta={C.meta}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {C.kpis.map(([k, v, t]) => (
          <Kpi key={k} label={k} value={v} tone={TONE[t]} delta={t === 'bad' ? '● action' : undefined} />
        ))}
      </div>
      <div className="tile mt-2.5 overflow-x-auto">
        <table className="w-full text-[12.5px] min-w-[520px]">
          <thead>
            <tr className="text-left text-[11px] dim">
              <th className="font-normal px-4 py-3 border-b hair">Obligation</th>
              <th className="font-normal px-4 py-3 border-b hair">Asset / location</th>
              <th className="font-normal px-4 py-3 border-b hair">Due</th>
              <th className="font-normal px-4 py-3 border-b hair text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {C.items.map(([o, a, d, s]) => (
              <tr key={o}>
                <td className="px-4 py-2.5 border-b hair">{o}</td>
                <td className="px-4 py-2.5 border-b hair mute">{a}</td>
                <td className="px-4 py-2.5 border-b hair mono text-[11px] mute">{d}</td>
                <td className="px-4 py-2.5 border-b hair text-right">
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px]" style={{ color: STATUS[s].c, background: STATUS[s].bg }}>
                    {s}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2.5 grid sm:grid-cols-[1fr_auto] gap-2.5 items-stretch">
        <div className="tile p-4 flex items-start gap-3">
          <FileCheck2 className="w-5 h-5 flex-none mt-0.5" style={{ color: 'var(--bx-blue-ink)' }} strokeWidth={1.6} />
          <div className="text-[12.5px] leading-snug">
            Evidence packs
            <span className="block mute text-[12px] mt-1">Photos, readings and sign-offs attached to each obligation, with a full audit trail. Reporting aligned to ISO 55000.</span>
          </div>
        </div>
        <div className="tile p-4 flex flex-col justify-center">
          <div className="text-[11px] dim">Worst open item</div>
          <div className="mt-1.5 text-[13px]">{C.items.find((i) => i[3] === 'Overdue')?.[0]}</div>
          <div className="mt-1">
            <CondBadge c={5} />
          </div>
        </div>
      </div>
    </Screen>
  );
}
