var User = require('./domain/user').User,
	Handler = require('./domain/handler').Handler,
	Project = require('./domain/project').Project;
// The router for the api requests.
var router = exports.router = function (app) {
	// Request for bootstrapping actions.
	app.get('/init', function (req, res, next) {
		var user, project, handler;
		// TODO: find the current user and return his current project.
		user = new User(process.env.USER);
		// XXX: don't store the user in here when we have a proper data store.
		router.user = user;
		if (user.projects.length === 0) {
			project = new Project('MyProject', user.id);
			user.addProject(project);
			handler = new Handler('GET', '/', 'var a = 1;', user.id);
			project.addHandler(handler);
		}
		var body = JSON.stringify({'user': user, 'project': project.id});
		sendResult(res, body);
	});
	
	app.put('/init', function(req, res, next) {
	    // TODO: find the current user and update the requested handler.
	    var user = router.user;
	    req.params = req.params || {};
	    var code = req.params.code;
	    var uri = req.params.uri;
	    var method = req.params.method;
	    var project = req.params.project;
	    if (!code || !method || !uri || !project) {
	        sendError(400);
	        return;
	    }
	    if (!user.projects[project] || !user.projects[project].handlers[method + " " + uri]) {
	        sendError(404);
	        return;
	    }
	    user.projects[project].handlers[method + " " + uri].code = code;
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

