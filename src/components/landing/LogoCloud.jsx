import React from 'react';

// Confirmed platform clients, with logo-use permission. Order follows the
// client's own ranking. Each links to the client's own site — their
// dedicated asset-management page where one exists, otherwise the homepage
// (checked individually; only one, ARTC, had a page and it was about
// third-party rail access, not asset management, so it also points home).
const CLIENTS = [
  { name: 'BHP', logo: '/media/clients/bhp.svg', url: 'https://www.bhp.com' },
  { name: 'Acciona', logo: '/media/clients/acciona.svg', url: 'https://www.acciona.com' },
  { name: 'Alstom', logo: '/media/clients/alstom.svg', url: 'https://www.alstom.com' },
  { name: 'Cargill', logo: '/media/clients/cargill.svg', url: 'https://www.cargill.com' },
  { name: 'DP World Logistics', logo: '/media/clients/dpworld.svg', url: 'https://www.dpworld.com' },
  { name: 'Pacific National', logo: '/media/clients/pacificnational.svg', url: 'https://www.pacificnational.com.au' },
  { name: 'ARTC', logo: '/media/clients/artc.png', url: 'https://www.artc.com.au', dark: true },
  { name: 'Hutchison Ports Australia', logo: '/media/clients/hutchisonports.png', url: 'https://www.hutchisonports.com.au' },
  { name: 'Peabody Energy', logo: '/media/clients/peabody.png', url: 'https://www.peabodyenergy.com' },
  { name: 'Whitehaven Coal', logo: '/media/clients/whitehaven.svg', url: 'https://www.whitehavencoal.com.au' },
  { name: 'InfraBuild', logo: '/media/clients/infrabuild.webp', url: 'https://www.infrabuild.com' },
  { name: 'VicTrack', logo: '/media/clients/victrack.png', url: 'https://www.victrack.com.au' },
  { name: 'Port of Newcastle', logo: '/media/clients/portofnewcastle.svg', url: 'https://www.portofnewcastle.com.au', dark: true },
  { name: 'Southern Ports', logo: '/media/clients/southernports.svg', url: 'https://www.southernports.com.au' },
  { name: 'Lycopodium', logo: '/media/clients/lycopodium.svg', url: 'https://www.lycopodium.com' },
  { name: 'Spotless', logo: '/media/clients/spotless.svg', url: 'https://www.spotless.com' },
  { name: 'Baiada', logo: '/media/clients/baiada.svg', url: 'https://www.baiada.com.au', dark: true },
  { name: 'Idemitsu Boggabri Coal', logo: '/media/clients/boggabri.png', url: 'https://www.idemitsu.com.au' },
  { name: 'Newcastle Coal Infrastructure Group', logo: '/media/clients/ncig.svg', url: 'https://www.ncig.com.au', dark: true },
  { name: 'SCT Logistics', logo: '/media/clients/sct.svg', url: 'https://www.sctlogistics.com.au', dark: true },
  { name: 'ACFS Port Logistics', logo: '/media/clients/acfs.svg', url: 'https://www.acfs.com.au' },
  { name: 'Daracon Group', logo: '/media/clients/daracon.svg', url: 'https://www.daracon.com.au', dark: true },
  { name: 'Malabar Resources', logo: '/media/clients/malabar.png', url: 'https://www.malabarcoal.com.au' },
  { name: 'Port of Portland', logo: '/media/clients/portofportland.svg', url: 'https://www.portofportland.com.au' },
];

function LogoTile({ client }) {
  return (
    <a
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      title={client.name}
      className="group mx-4 flex h-16 w-40 shrink-0 items-center justify-center md:mx-6 md:w-48"
    >
      <div
        className={`flex h-12 w-full items-center justify-center rounded-lg transition-colors ${
          client.dark ? 'bg-slate-900 px-4 py-2 group-hover:bg-primary' : ''
        }`}
      >
        <img
          src={client.logo}
          alt={client.name}
          loading="lazy"
          className={`max-h-8 max-w-full object-contain transition-all duration-300 md:max-h-9 ${
            client.dark
              ? 'opacity-90 group-hover:opacity-100'
              : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
          }`}
        />
      </div>
    </a>
  );
}

export default function LogoCloud() {
  // Two independent rows, opposite directions, seamless loop (each row's
  // content is duplicated so the CSS animation can run edge-to-edge with
  // no visible seam or reset).
  const half = Math.ceil(CLIENTS.length / 2);
  const rowA = CLIENTS.slice(0, half);
  const rowB = CLIENTS.slice(half);

  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-5 text-center md:px-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          Trusted by
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900 md:text-3xl">
          Running on critical infrastructure across{' '}
          <span className="font-serif italic font-medium text-primary">Australia.</span>
        </h2>
      </div>

      <div className="mt-10 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:mt-12">
        <div className="marquee-row flex w-max">
          {[...rowA, ...rowA].map((c, i) => (
            <LogoTile key={`a-${c.name}-${i}`} client={c} />
          ))}
        </div>
        <div className="marquee-row marquee-row--reverse flex w-max">
          {[...rowB, ...rowB].map((c, i) => (
            <LogoTile key={`b-${c.name}-${i}`} client={c} />
          ))}
        </div>
      </div>

      <style>{`
        .marquee-row {
          animation: marquee-scroll 60s linear infinite;
        }
        .marquee-row--reverse {
          animation-name: marquee-scroll-reverse;
          animation-duration: 68s;
        }
        .marquee-row:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-row {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
