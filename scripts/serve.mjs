import { createServer } from 'node:http';
import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { spawn } from 'node:child_process';

const live = process.argv.includes('--watch');
const root = resolve('dist');
const clients = new Set();
const watchers = [];
let revision = 0;
let timer;
let building = false;
let pending = false;
let child;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

// Each build gets a fresh module cache, including imported profile data.
function build() {
  return new Promise((resolveBuild, reject) => {
    child = spawn(process.execPath, ['scripts/build.mjs'], {
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code) => {
      child = undefined;
      if (code === 0) resolveBuild();
      else reject(new Error(`Build exited with code ${code}`));
    });
  });
}

async function rebuild() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  do {
    pending = false;
    try {
      await build();
      revision += 1;
      for (const client of clients) client.write(`data: ${revision}\n\n`);
    } catch (error) {
      console.error(`${error.message}. Fix the source and save to retry.`);
    }
  } while (pending);
  building = false;
}

// Debounce editor saves and serialize builds so they cannot overlap.
function scheduleBuild() {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 100);
}

const reloadScript = `<script>
(() => {
  let revision;
  const updates = new EventSource('/__dev/events');
  updates.onmessage = ({ data }) => {
    if (revision !== undefined && revision !== data) location.reload();
    revision = data;
  };
  window.addEventListener('pagehide', () => updates.close(), { once: true });
})();
</script>`;

await build();

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (live && pathname === '/__dev/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write(`retry: 1000\ndata: ${revision}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  try {
    let file = resolve(root, '.' + decodeURIComponent(pathname));
    if (!file.startsWith(root + '/') && file !== root) {
      throw Error('Invalid path');
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const content = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(
      live && extname(file) === '.html'
        ? content.toString().replace('</body>', `${reloadScript}</body>`)
        : content,
    );
  } catch {
    res.writeHead(404, {
      'Content-Type': types['.html'],
      'Cache-Control': 'no-store',
    });
    const html = await readFile(resolve(root, '404.html'));
    res.end(
      live
        ? html.toString().replace('</body>', `${reloadScript}</body>`)
        : html,
    );
  }
});

if (live) {
  for (const directory of ['src', 'public', 'scripts']) {
    const watcher = watch(directory, { recursive: true }, scheduleBuild);
    watcher.on('error', (error) => {
      console.error(`Could not watch ${directory}: ${error.message}`);
    });
    watchers.push(watcher);
  }
}

// Keep long-lived event streams alive through idle connection timeouts.
const heartbeat = live
  ? setInterval(() => {
      for (const client of clients) client.write(': heartbeat\n\n');
    }, 15000)
  : undefined;

function shutdown() {
  clearTimeout(timer);
  clearInterval(heartbeat);
  for (const watcher of watchers) watcher.close();
  for (const client of clients) client.end();
  child?.kill();
  server.close();
  server.closeAllConnections();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
server.on('error', (error) => {
  console.error(`Could not start preview: ${error.message}`);
  process.exitCode = 1;
  shutdown();
});
server.listen(Number(process.env.PORT || 4321), '0.0.0.0', () => {
  console.log('Local: http://localhost:' + server.address().port);
  if (live)
    console.log('Watching for changes. Save a file to rebuild and refresh.');
});
