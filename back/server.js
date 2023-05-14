import http from 'http';

const server = http.createServer((request, response) => {
  if (request.url !== '/') return;
  console.log('serving api');
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.writeHead(200);
  response.end(`{ "message": "hello world" }`);
})

server.listen(3000, () => {
  console.log('backend listening on port 3000')
})
