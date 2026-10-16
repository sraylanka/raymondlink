import { mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { render } from '../src/site.mjs';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src/styles/site.css', 'dist/site.css');
await cp('src/client.js', 'dist/client.js');
await writeFile('dist/index.html', render());
await writeFile('dist/404.html', (await readFile('src/404.html','utf8')));
console.log('Built raymondlink → dist/');
