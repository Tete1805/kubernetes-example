import fs from 'fs';
import http from 'http';

const server = http.createServer((request, response) => {
  const index = fs.readFileSync('./index.html');
  response.writeHead(200);
  response.end(index);
})

server.listen(3001, () => {
  console.log('frontend available on 3001')
})