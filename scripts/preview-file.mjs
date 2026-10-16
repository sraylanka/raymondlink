import { readFile, writeFile } from 'node:fs/promises';
import { render } from '../src/site.mjs';
let html=render();
const css=await readFile('src/styles/site.css','utf8');
const js=await readFile('src/client.js','utf8');
html=html.replace('<link rel="stylesheet" href="/site.css">',`<style>${css}</style>`)
  .replace('<script src="/client.js" defer></script>','')
  .replace('href="/favicon.svg"','href="public/favicon.svg"')
  .replaceAll('href="/raymond-link-resume.pdf"','href="public/raymond-link-resume.pdf"')
  .replace('</body>',`<script>${js}</script></body>`);
await writeFile('preview.html',html);
console.log('Created preview.html — open directly in a browser.');
