// Regenerates public/og-default.png (1200x630 shared-link preview).
// Reads the light-mode --accent from src/styles/global.css, so run this after changing the accent:
//   node scripts/make-og.mjs
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const accent = css.match(/--accent:\s*(#[0-9a-fA-F]{6})/)?.[1];
if (!accent) throw new Error('Could not find --accent in global.css');

const font = 'Verdana, Geneva, Tahoma, sans-serif';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="96" y="232" width="10" height="166" fill="${accent}"/>
  <text x="140" y="314" font-family="${font}" font-size="76" font-weight="700" fill="#1a1a1a">Raymond Kim</text>
  <text x="142" y="380" font-family="${font}" font-size="34" fill="#5f5f5f">Data Engineering</text>
</svg>`;

const info = await sharp(Buffer.from(svg)).png().toFile(new URL('../public/og-default.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log(`og-default.png written (${info.width}x${info.height}, accent ${accent})`);
