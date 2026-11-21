// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import externalLinksNewTab from './src/lib/external-links.mjs';

// Served from the custom domain https://raymondkim.dev (see public/CNAME).
export default defineConfig({
  site: 'https://raymondkim.dev',
  trailingSlash: 'ignore',
  // Old routes kept working after About merged into the home page and Other was renamed.
  redirects: {
    '/about': '/',
    '/other': '/certifications',
  },
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinksNewTab] }),
  },
});
