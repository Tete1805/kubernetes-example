import fs from 'fs';
import http from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer((request, response) => {
  console.log('serving index');
  const index = fs.readFileSync(resolve(__dirname, 'index.html'));
  response.writeHead(200);
  response.end(index);
})

server.listen(3001, () => {
  console.log('frontend available on 3001')
})
