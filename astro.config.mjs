// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://agecalculates.com',
  redirects: { '/age-calculator': { status: 301, destination: '/' } },
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/age-calculator') })],
  vite: { plugins: [tailwindcss()] },
});
