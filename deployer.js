var fs = require('fs'),
	sys = require('sys'),
    exec = require('child_process').exec;

var deployer = exports.deployer = function (project, callback) {
	var tempFile = __dirname + '/tmp/' + Math.random() + '.js';
	fs.writeFile(tempFile, project.lastHandler.code, function(err) {
		if (err) throw err;
		node = exec('node ' + tempFile, function (error, stdout, stderr) {
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

