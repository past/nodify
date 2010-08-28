var http = require('http'),
	port = parseInt(process.env.PORT) || 8080;

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello world\n");
});

server.listen(port);

