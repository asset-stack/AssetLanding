// Builds the one-page assetstack.org site from the normal `astro build`
// output: /Platform becomes the root page, and only the files it actually
// uses are copied into dist-platform/ (a separate Cloudflare Pages project).
//
//   npm run build:platform   →   dist-platform/
//
// Canonical/og:url stay on https://assetstackai.com/Platform, so search
// engines treat assetstackai.com as the one indexed copy.

import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OUT = 'dist-platform';

const html = fs.readFileSync(path.join(DIST, 'Platform.html'), 'utf8');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const copy = (rel) => {
  const from = path.join(DIST, rel);
  if (!fs.existsSync(from)) return false;
  const to = path.join(OUT, rel);
  if (fs.statSync(from).isDirectory()) {
    // A folder prefix like `${M}photo.webp` in the code: take the whole folder.
    fs.cpSync(from, to, { recursive: true });
    return true;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  return true;
};

// _astro chunks the page loads, followed through their imports.
const chunks = new Set();
const queue = [];
const addChunk = (f) => {
  if (!chunks.has(f) && fs.existsSync(path.join(DIST, '_astro', f))) {
    chunks.add(f);
    queue.push(f);
  }
};
for (const m of html.matchAll(/\/_astro\/([\w.\-]+)/g)) addChunk(m[1]);
while (queue.length) {
  const src = fs.readFileSync(path.join(DIST, '_astro', queue.pop()), 'utf8');
  for (const m of src.matchAll(/[\w\-]+\.[\w\-]+\.(?:js|css)/g)) addChunk(m[0]);
}

// /media files referenced by the page or its chunks. A path without an
// extension is a video base path (the hero adds .mp4 / .webm itself).
const media = new Set();
const scan = (text) => {
  for (const m of text.matchAll(/\/media\/([\w\-/.]+)/g)) media.add(m[1].replace(/\/$/, ''));
};
scan(html);
for (const f of chunks) scan(fs.readFileSync(path.join(DIST, '_astro', f), 'utf8'));

for (const f of chunks) copy(path.join('_astro', f));
let mediaCount = 0;
for (const m of media) {
  const rel = path.join('media', m);
  if (copy(rel)) mediaCount++;
  else for (const ext of ['.mp4', '.webm']) if (copy(rel + ext)) mediaCount++;
}
for (const f of ['favicon.png', 'assetstack-icon.png', 'og-platform.jpg', '_headers']) copy(f);

fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, '404.html'), html);
fs.writeFileSync(path.join(OUT, '_redirects'), '/Platform / 301\n/Buildings / 301\n');
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');

const size = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? size(path.join(dir, e.name)) : fs.statSync(path.join(dir, e.name)).size), 0);
console.log(`[platform-site] ${OUT}/: ${chunks.size} chunks, ${mediaCount} media files, ${(size(OUT) / 1e6).toFixed(1)} MB`);
