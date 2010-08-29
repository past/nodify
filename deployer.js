var fs = require('fs'),
	sys = require('sys'),
    exec = require('child_process').exec;

var deployer = exports.deployer = function (project, callback) {
	var tempFile = __dirname + '/tmp/' + Math.random() + '.js';
	fs.writeFile(tempFile, project.lastHandler.code, function(err) {
		if (err) throw err;
		var options = {
		    encoding: 'utf-8',
            timeout: 60000,
            maxBuffer: 200*1024,
            killSignal: 'SIGKILL',
            cwd: null,
            env: null
		};
		var node = exec('node ' + tempFile, options, function (error, stdout, stderr) {
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

