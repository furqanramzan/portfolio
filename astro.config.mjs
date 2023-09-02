import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    AstroPWA({
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,webp,ico}'],
      },
    }),
  ],
});
