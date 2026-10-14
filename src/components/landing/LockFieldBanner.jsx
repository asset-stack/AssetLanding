import React, { useEffect, useRef } from 'react';

// Interactive "lock field" banner — after Aakash Nihalani's projection
// pieces: a floor of extruded AssetStack locks that sinks away under the
// cursor, opening a void whose walls are the locks' own front faces.
//
// Geometry is in units of W (front-face width) and follows the logo mark:
// a light-blue top/side, a dark front lip and a white slot. Each lock is
// modelled as an endless column; painting rows back-to-front lets the row
// in front hide all but a thin strip of the one behind, so lowering a
// lock's top reveals the columns behind it as tall walls.

// 'light' is the original white field; 'dark' sits on the black /Platform
// page, where the slot becomes negative space in the page colour.
const THEMES = {
  light: { top: '#1a32eb', side: '#1529d6', lip: '#0001cb', bg: '#ffffff' },
  dark: { top: '#1a32eb', side: '#1529d6', lip: '#0001cb', bg: '#0c0c0c' },
};

const D = 0.44; // depth offset of the top face (45° up-right)
const LIP = 0.44; // width of the dark lip; the rest of the front is the slot
const PITCH_X = 1.1; // horizontal spacing within a row
const ROW_DX = -0.6; // each row forward shifts left…
const ROW_DY = 0.58; // …and down
const R_A = 0.06; // top face, front-left corner
const R_B = 0.11; // top face, back-left corner
const R_C = 0.16; // top face, back-right corner
const R_LIP = 0.16;
const R_SLOT = 0.12;

const MAX_SINK = 2.6; // depth of the void, in W
const RADIUS = 2.4; // reach of the void, in W

// Fill a polygon with per-vertex corner radii.
function roundedPoly(ctx, pts, radii) {
  const n = pts.length;
  const last = pts[n - 1];
  ctx.moveTo((last[0] + pts[0][0]) / 2, (last[1] + pts[0][1]) / 2);
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    ctx.arcTo(p[0], p[1], q[0], q[1], radii[i]);
  }
  ctx.closePath();
}

function drawLock(ctx, x, y, w, len, P) {
  const d = D * w;

  // Top + side as one light shape (matches the logo mark)
  ctx.fillStyle = P.top;
  ctx.beginPath();
  roundedPoly(
    ctx,
    [
      [x, y],
      [x + d, y - d],
      [x + w + d, y - d],
      [x + w + d, y + len - d],
      [x + w, y + len],
      [x, y + len],
    ],
    [R_A * w, R_B * w, R_C * w, 0, 0, 0]
  );
  ctx.fill();

  // Side face, a touch darker so neighbouring locks read as separate
  ctx.fillStyle = P.side;
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + d, y - d + R_C * w);
  ctx.lineTo(x + w + d, y + len - d);
  ctx.lineTo(x + w, y + len);
  ctx.closePath();
  ctx.fill();

  // Dark lip — nudged left a hair so the light shape's anti-aliased edge
  // doesn't leave a pale fringe down the length of the column.
  ctx.fillStyle = P.lip;
  ctx.beginPath();
  ctx.roundRect(x - 0.75, y, LIP * w + 0.75, len, [R_LIP * w, 0, 0, 0]);
  ctx.fill();

  // Slot (background colour)
  ctx.fillStyle = P.bg;
  ctx.beginPath();
  ctx.roundRect(x + LIP * w, y, (1 - LIP) * w, len, [0, R_SLOT * w, 0, 0]);
  ctx.fill();
}

export default function LockFieldBanner({ theme = 'light' }) {
  const P = THEMES[theme] || THEMES.light;
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let w = 64; // tile size in CSS px
    let tiles = []; // { x, y, cx, cy, z, v }
    let raf = 0;
    let visible = false;
    let t0 = performance.now();

    const pointer = { x: 0, y: 0, active: false, lastMove: 0 };
    const focus = { x: -9999, y: -9999 };

    function layout() {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      w = Math.max(40, Math.min(84, width / 18));
      const pitch = PITCH_X * w;
      const rowDy = ROW_DY * w;
      const old = new Map(tiles.map((t) => [t.key, t]));
      tiles = [];
      // Start rows above the top edge so their columns fill it.
      for (let r = -3; r * rowDy < height + w; r++) {
        const y = r * rowDy + D * w;
        const shift = (((ROW_DX * w * r) % pitch) + pitch) % pitch;
        for (let c = -2; shift + c * pitch < width + w; c++) {
          const x = shift + c * pitch - D * w;
          const key = `${r}:${c}`;
          const prev = old.get(key);
          tiles.push({
            key,
            x,
            y,
            cx: x + (w + D * w) / 2,
            cy: y - (D * w) / 2,
            z: prev ? prev.z : 0,
            v: prev ? prev.v : 0,
          });
        }
      }
    }

    function draw() {
      ctx.fillStyle = P.bg;
      ctx.fillRect(0, 0, width, height);
      const len = (MAX_SINK + 3) * w;
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        drawLock(ctx, t.x, t.y + t.z, w, len, P);
      }
    }

    // When nobody is steering, the void drifts on a slow Lissajous path so
    // the banner still reads as alive (and works on touch screens).
    function autopilot(now) {
      const s = (now - t0) / 1000;
      return {
        x: width * (0.5 + 0.34 * Math.sin(s * 0.37)),
        y: height * (0.5 + 0.28 * Math.sin(s * 0.53 + 1.1)),
      };
    }

    function step(now) {
      raf = 0;
      if (!visible) return;

      const steering = pointer.active && now - pointer.lastMove < 2500;
      const target = steering ? pointer : autopilot(now);
      if (focus.x < -9000) {
        focus.x = target.x;
        focus.y = target.y;
      }
      const ease = steering ? 0.28 : 0.06;
      focus.x += (target.x - focus.x) * ease;
      focus.y += (target.y - focus.y) * ease;

      const reach = RADIUS * w;
      const sink = MAX_SINK * w;
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const dx = t.cx - focus.x;
        const dy = (t.cy - focus.y) * 1.25;
        const d = Math.sqrt(dx * dx + dy * dy) / reach;
        let goal = 0;
        if (d < 1) {
          const k = 1 - d;
          goal = sink * k * k * (3 - 2 * k); // smoothstep
        }
        // Underdamped spring: locks overshoot slightly as the void passes.
        t.v = (t.v + (goal - t.z) * 0.14) * 0.74;
        t.z += t.v;
      }

      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(step);
    }

    function onMove(e) {
      const rect = wrap.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      pointer.lastMove = performance.now();
    }
    function onLeave() {
      pointer.active = false;
      // Resume the drift from wherever the cursor left the void.
      t0 = performance.now();
    }

    layout();
    draw();

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(wrap);

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerdown', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerdown', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [P]);

  return (
    <section
      aria-label="AssetStack lock field"
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(360px, 46vw, 620px)', background: P.bg }}>
      <div ref={wrapRef} className="absolute inset-0" style={{ touchAction: 'pan-y' }}>
        <canvas ref={canvasRef} aria-hidden className="block w-full h-full" />
      </div>
      {theme === 'dark' && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: `linear-gradient(${P.bg}, transparent)` }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: `linear-gradient(transparent, ${P.bg})` }} />
        </>
      )}
    </section>
  );
}
