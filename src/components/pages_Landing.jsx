import React, { Suspense } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import ScrollProgressBar from '@/components/landing/ScrollProgressBar';
import SectionFallback from '@/components/landing/SectionFallback';
import StickyCTA from '@/components/landing/StickyCTA';
import LandingFooter from '@/components/landing/LandingFooter';
import { SECTION_REGISTRY } from '@/components/landing/sectionRegistry';
import { SECTION_ORDER } from '@/config/site';

// Section order is static config (src/config/site.js) — the old runtime
// fetch of the Base44 LandingLayout entity is gone. Title/meta are set by
// the Astro page shell, not client-side.
export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-primary/15 antialiased">
      <ScrollProgressBar />
      <LandingNav />
      <StickyCTA />

      <main>
        {SECTION_ORDER.map((key) => {
          const entry = SECTION_REGISTRY[key];
          if (!entry) return null;
          const SectionComponent = entry.component;
          if (entry.lazy) {
            return (
              <Suspense key={key} fallback={<SectionFallback minHeight={entry.fallbackHeight} />}>
                <SectionComponent />
              </Suspense>
            );
          }
          return <SectionComponent key={key} />;
        })}
      </main>

      <Suspense fallback={<SectionFallback minHeight={280} />}>
        <LandingFooter />
      </Suspense>
    </div>
  );
}
