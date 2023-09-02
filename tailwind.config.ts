import type { Config } from 'tailwindcss';
import { amber } from 'tailwindcss/colors';
import flowbite from 'flowbite/plugin';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js',
  ],
  plugins: [flowbite],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: amber,
      },
    },
  },
};

export default config;
