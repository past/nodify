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
		createCallback(node.pid);
		node.stdout.on('data', function (data) {
		    console.log('Stdout data: ' + data);
		    aggrOut += data;
		});
		node.stderr.on('data', function (data) {
		    console.log('Stdout data: ' + data);
		    aggrErr += data;
		});
		node.on('exit', function (code) {
		    clearTimeout(timeoutId);
		    aggrOut += 'Exit code: ' + code;
		    fs.unlink(tempFile, function (err) {
		        if (err)
					console.log("Unable to delete " + tempFile + ".");
				exitCallback(aggrOut, aggrErr);
		    });
		});
		var timeoutCallback = function (child) {
		    if (child) {
		        console.log("Killing process " + child.pid);
		        child.kill('SIGKILL');
		    }
		};
		var timeoutId = setTimeout(timeoutCallback, 60000, node)
		return node.pid;
	});
}

var stop = exports.stop = function (pid) {
	if (pid) {
        console.log("Killing process " + pid);
        try {
		    process.kill(pid, 'SIGKILL');
		}
		catch(err) {
		    console.log(err);
		}
	}
}

