var User = require('./domain/user').User,
	Handler = require('./domain/handler').Handler,
	Project = require('./domain/project').Project;
// The router for the api requests.
var router = exports.router = function (app) {
	// Request for bootstrapping actions.
	app.get('/init', function (req, res, next) {
	});
};

