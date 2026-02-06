const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = process.env.PORT || 8000;

const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let p = path.join(root, urlPath);
  fs.stat(p, (err, st) => {
    if (err) return res.statusCode = 404, res.end('Not found');
    if (st.isDirectory()) p = path.join(p, 'index.html');
    const ext = path.extname(p).toLowerCase();
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    const stream = fs.createReadStream(p);
    stream.on('error', () => res.statusCode = 404, res.end('Not found'));
    stream.pipe(res);
  });
});

server.listen(port, () => console.log(`Dev static server listening on http://localhost:${port} (root: ${root})`));

process.on('uncaughtException', (e) => {
  console.error('Uncaught', e && e.stack || e);
});
