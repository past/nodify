var User = require('./domain/user').User,
	Handler = require('./domain/handler').Handler,
	Project = require('./domain/project').Project;
// The router for the api requests.
var router = exports.router = function (app) {
	// Request for bootstrapping actions.
	app.get('/init', function (req, res, next) {
		var user, project, handler;
		// TODO: find the current user and return his current project.
		if (!router.user) {
			user = new User(process.env.USER);
			// XXX: don't store the user in here when we have a proper data store.
			router.user = user;
		} else
			user = router.user;
		if (user.projects.length === 0) {
			project = new Project('MyProject', user.username);
			user.addProject(project);
			handler = new Handler('GET', '/', 'var a = 1;', user.username);
			project.addHandler(handler);
		} else
			project = user.projects.lastProject;
		var body = JSON.stringify({'user': user, 'project': project.name});
		sendResult(res, body);
	});
	// Request to store the contents.
	app.put('/init', function(req, res, next) {
	    // TODO: find the current user and update the requested handler.
	    var user = router.user;
	    req.body = req.body || {};
	    var code = req.body.code;
	    var uri = req.body.uri;
	    var method = req.body.method;
	    var project = req.body.project;
	    if (!code || !method || !uri || !project) {
			console.log("ERROR: project="+project+",uri="+uri+",method="+method+",code="+code);
	        sendError(res, 400);
	        return;
	    }
	    if (!user.projects[project] || !user.projects[project].handlers[method + " " + uri]) {
	        sendError(res, 404);
	        return;
	    }
	    router.user.projects[project].handlers[method + " " + uri].code = decodeURIComponent(code);
	    sendResult(res);
	});
};

// Helper function to send the result.
var sendResult = function (res, data) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	if (data)
		res.end(data);
	else
		res.end();
};

// Helper function to send the result in error cases.
var sendError = function (res, status, data) {
	res.writeHead(status, {'Content-Type': 'text/plain'});
	if (data)
		res.end(data);
	else
		res.end();
};

