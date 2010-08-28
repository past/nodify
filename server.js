var connect = require('connect'),
	port = parseInt(process.env.PORT) || 8080;

var server = connect.createServer(
	connect.logger({ format: ':method :url' }),
	connect.errorHandler({ dumpExceptions: true, showStack: true })
);
// Serve static resources.
server.use("/",
    connect.conditionalGet(),
    connect.cache(),
    connect.gzip(),
	connect.staticProvider(__dirname + '/public')
);
server.listen(port);
console.log('Nodify server running at http://127.0.0.1:8080/');

process.addListener('uncaughtException', function (err) {
	console.log(err.stack);
});

