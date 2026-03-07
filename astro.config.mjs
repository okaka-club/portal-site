// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://okaka-club.github.io",
  base: "/portal-site",
  output: "static",
  vite: {
    plugins: [tailwindcss()]
  }
});
