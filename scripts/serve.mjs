import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import './build.mjs';
const root = resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.pdf':'application/pdf', '.txt':'text/plain', '.xml':'application/xml' };
const server = createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + '/') && file !== root) throw Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file,'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(resolve(root,'404.html')));
  }
});
server.on('error', error => { console.error(`Could not start preview: ${error.message}`); process.exitCode=1; });
server.listen(Number(process.env.PORT || 4321), '0.0.0.0', () => console.log('Local: http://localhost:' + server.address().port));
