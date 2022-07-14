import http from 'http';

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.writeHead(200);
  response.end(`{ "message": "hello world" }`);
})

server.listen(3002, () => {
  console.log('backend listening on port 3002')
})