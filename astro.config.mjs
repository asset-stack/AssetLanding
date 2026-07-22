import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

// Static marketing site for assetstackai.com.
// Every page is prerendered to plain HTML; React runs only inside
// client:* islands (nav, interactive sections).
export default defineConfig({
  site: 'https://assetstackai.com',
  output: 'static',
  // Old Base44 route aliases — keep inbound links working.
  redirects: {
    '/Landing': '/',
  },
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // Ported components import from react-router-dom; on a static
        // multi-page site that collapses to plain <a> tags.
        'react-router-dom': fileURLToPath(new URL('./src/lib/router-shim.jsx', import.meta.url)),
      },
    },
  },
});
