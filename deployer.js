var fs = require('fs'),
	sys = require('sys'),
    exec = require('child_process').exec;

var deployer = exports.deployer = function (project, callback) {
	var tempFile = __dirname + '/tmp/' + Math.random() + '.js';
	fs.writeFile(tempFile, project.lastHandler.code, function(err) {
		if (err) throw err;
		console.log(sys.inspect('node '+tempFile));
		node = exec('node '+tempFile, function (error, stdout, stderr) {
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			callback(stdout, stderr);
		});
	});

}

