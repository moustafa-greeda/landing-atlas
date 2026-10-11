const http = require('http');
const fs = require('fs');
const path = require('path');

const types = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const port = process.argv[2] ? Number(process.argv[2]) : 8080;

http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const full = path.join(__dirname, reqPath);
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + reqPath); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(full)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log(`Serving at http://localhost:${port}`));
