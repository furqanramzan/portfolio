import type { Config } from 'tailwindcss';
import flowbite from 'flowbite/plugin';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js',
  ],
  plugins: [flowbite, scrollbar],
  darkMode: 'class',
};

export default config;
