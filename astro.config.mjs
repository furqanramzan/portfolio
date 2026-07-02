import fs from 'node:fs';
import path from 'node:path';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import compress from 'astro-compress';
import preload from 'astro-preload';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';
import { color, isDev, name, shortName, siteUrl } from './src/utils/constants';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  prefetch: !isDev,
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
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,webp,ico}'],
        globIgnores: ['**/socials/*.{svg,png}'],
      },
    }),
    preload(),
    sitemap(),
    robotsTxt(),
    compress({ CSS: false }),
  ],
  vite: {
    plugins: [
      tailwind(),
      {
        name: 'fix-css-tree-patch',
        transform(code, id) {
          if (id.includes('css-tree') && id.includes('data-patch.')) {
            const patchPath = path.resolve(
              path.dirname(id),
              '../data/patch.json',
            );
            const patchContent = fs.readFileSync(patchPath, 'utf8');
            if (id.endsWith('.cjs')) {
              return {
                code: `module.exports = ${patchContent};`,
                map: null,
              };
            }
            return {
              code: `export default ${patchContent};`,
              map: null,
            };
          }
          if (
            (id.includes('css-tree') || id.includes('csso')) &&
            (id.endsWith('version.js') || id.endsWith('version.cjs'))
          ) {
            const packageJsonPath = path.resolve(
              path.dirname(id),
              '../package.json',
            );
            const packageJson = JSON.parse(
              fs.readFileSync(packageJsonPath, 'utf8'),
            );
            const version = packageJson.version;
            if (id.endsWith('.cjs')) {
              return {
                code: `'use strict';\nexports.version = "${version}";`,
                map: null,
              };
            }
            return {
              code: `export const version = "${version}";`,
              map: null,
            };
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        external: ['sharp'],
      },
    },
  },
});
