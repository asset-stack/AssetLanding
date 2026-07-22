import React from 'react';

/**
 * Static dithered banner background for the MechanismSection.
 */
export default function MechanismBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <img
        src="/media/de94d1985_Screenshot2026-05-25at124049PM.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover brightness-[0.55] saturate-150"
        aria-hidden="true"
      />
      {/* Brand-tinted darkening overlay */}
      <div className="absolute inset-0 bg-[#1925aa] mix-blend-multiply opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/50" />
    </div>
  );
}