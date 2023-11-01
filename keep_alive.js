const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('HEWWO FROM THE OTHER SIDEEEEE');
});
server.listen(3000);