import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [sitemap(), tailwind()],
  output: 'static',
  site: 'https://tetmfg.com',
  build: {
    inlineStylesheets: 'auto',
  },
});
