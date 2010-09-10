var fs = require('fs'),
	sys = require('sys'),
    child_process = require('child_process');

var start = exports.start = function (project, createCallback, exitCallback) {
	var tempFile = __dirname + '/tmp/' + Math.random() + '.js';
	fs.writeFile(tempFile, project.lastHandler.code, function(err) {
		if (err)
		    throw err;
		var aggrOut = '';
		var aggrErr = '';
		var node = child_process.spawn('node', [tempFile]);
		createCallback([node.pid]);
		node.stdout.on('data', function (data) {
		    console.log('Stdout data: ' + data);
		    aggrOut += data;
		});
		node.stderr.on('data', function (data) {
		    console.log('Stderr data: ' + data);
		    aggrErr += data;
		});
		node.on('exit', function (code) {
		    aggrOut += '\nExit code: ' + code;
		    fs.unlink(tempFile, function (err) {
		        if (err)
					console.log("Unable to delete " + tempFile + ".");
				exitCallback(aggrOut, aggrErr);
		    });
		});
	});
}

var stop = exports.stop = function (pids) {
	pids.forEach(function(pid) {
        console.log("Killing process " + pid);
        try {
		    process.kill(pid, 'SIGKILL');
		} catch (err) {
		    console.log(err);
		}
	});
}

var debug = exports.debug = function (project, createCallback, exitCallback) {
	var tempFile = __dirname + '/tmp/' + Math.random() + '.js';
	fs.writeFile(tempFile, project.lastHandler.code, function(err) {
		if (err) throw err;
		var aggrOut = '';
		var aggrErr = '';
		var inspector = child_process.spawn('node-inspector');
		inspector.stdout.on('data', function (data) {
		    console.log('Stdout data: ' + data);
		    aggrOut += data;
			var node = child_process.spawn('node', ['--debug', tempFile]);
			createCallback([node.pid, inspector.pid]);
			node.stdout.on('data', function (data) {
				console.log('Stdout data: ' + data);
				aggrOut += data;
			});
			node.stderr.on('data', function (data) {
				console.log('Stderr data: ' + data);
				aggrErr += data;
			});
			node.on('exit', function (code) {
				aggrOut += '\nExit code: ' + code;
				fs.unlink(tempFile, function (err) {
					if (err)
						console.log("Unable to delete " + tempFile + ".");
				});
				exitCallback(aggrOut, aggrErr);
			});
		});
		inspector.stderr.on('data', function (data) {
			console.log('Stderr data: ' + data);
			aggrErr += data;
		});
		inspector.on('exit', function (code) {
			aggrOut += '\nExit code: ' + code;
		});
	});
}

