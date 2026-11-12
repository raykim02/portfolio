// Sätteri hast plugin (Astro 7's default Markdown processor):
// make absolute http(s) links in Markdown open in a new tab.
import { defineHastPlugin } from 'satteri';

export default defineHastPlugin({
  name: 'external-links-new-tab',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = String(node.properties?.href ?? '');
      if (/^https?:\/\//i.test(href)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
      }
    },
  },
});
