import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro';
import preload from 'astro-preload';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import partytown from '@astrojs/partytown';
import { color, name, shortName, siteUrl } from './src/utils/constants';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [
    AstroPWA({
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name,
        short_name: shortName,
        theme_color: color,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,webp,ico}'],
        globIgnores: ['socials/'],
      },
    }),
    partytown(),
    tailwind(),
    preload(),
    sitemap(),
    robotsTxt(),
    compress(),
  ],
});
