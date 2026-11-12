// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import externalLinksNewTab from './src/lib/external-links.mjs';

// Until a custom domain is set up, the site is served from the project repo
// at https://rayk1m02.github.io/portfolio/ — hence `base: '/portfolio'`.
// Once the domain is live: set `site` to it, delete `base`, and add public/CNAME.
export default defineConfig({
  site: 'https://rayk1m02.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinksNewTab] }),
  },
});
