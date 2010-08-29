var fs = require('fs'),
	sys = require('sys'),
    child_process = require('child_process');

var start = exports.start = function (project, callback) {
	var tempFile = __dirname + '/tmp/' + Math.random() + '.js';
	fs.writeFile(tempFile, project.lastHandler.code, function(err) {
		if (err) throw err;
		node = child_process.exec('node ' + tempFile, function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			fs.unlink(tempFile, function (err) {
				if (err)
					console.log("Unable to delete " + tempFile + ".");
				callback(stdout, stderr);
			});
		});
	});
}

var stop = exports.stop = function (project) {
	if (node.pid)
		node.kill('SIGKILL');
}

