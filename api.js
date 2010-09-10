var User = require('./domain/user').User,
	Handler = require('./domain/handler').Handler,
	Project = require('./domain/project').Project,
	nStore = require('nStore'),
	sys = require('sys'),
	deployer = require('./deployer');

var users = nStore(process.env.HOME + '/.nodify.users.db');

// The router for the api requests.
var router = exports.router = function (app) {
	// Request for bootstrapping actions.
	app.get('/init', function (req, res, next) {
		var project, body, authToken, handler, user;
		authToken = req.cookies['_auth_nodify'];
		if (!authToken) {
		    console.log("No token, Creating new user...");
		    createNewUser(res);
		}
		else {
		    console.log("Token found, loading user...");
		    users.get(authToken, function(err, doc, meta) {
		        if (err && err.errno == 2) {
		            console.log("User not found, Creating new user...");
		            createNewUser(res);
		        }
		        else if (err) {
		            sendError(res, 500);
		            throw err;
		        }
		        else {
		            user = createUser(doc);
					if (user.lastProject) {
			            project = user.lastProject;
						body = JSON.stringify({'user': user, 'project': project.id});
						sendResult(res, body);
					} else {
						project = new Project('MyProject', user.username);
						project.addHandler(new Handler('GET', '/', 'var a=1;\nconsole.log(a);', user.username));
						user.addProject(project);
						users.save(user.username, user, function(err) {
							if (err) {
								sendError(res, 500);
								throw err;
							}
							body = JSON.stringify({'user': user, 'project': project.id});
							sendResult(res, body);
						});
					}
		        }
		    });
		}
	});
	// Create new project.
	app.post('/init', function(req, res, next) {
		var authToken = req.cookies['_auth_nodify'];
		if (!authToken)
		    sendError(res, 403);
		else {
		    users.get(authToken, function(err, doc, meta) {
		        var user, rename, create, project, p;
		        if (err && err.errno == 2) {
		            sendError(res, 404);
		            return;
		        }
		        else if (err) {
                    sendError(res, 500);
                    throw err;
		        }
	            user = createUser(doc);
	            req.body = req.body || {};
	            rename = req.body.rename;
	            create = req.body.create;
	            project = req.body.project;
	            if (!create && !(project && rename)) {
			        console.log("ERROR: project=" + project + ",create=" + create + ",rename=" + rename);
	                sendError(res, 400);
	                return;
	            }
	            if (rename && !user.projects[project]) {
	                sendError(res, 404);
	                return;
	            }
				if (create) {
					p = new Project(decodeURIComponent(create), user.username);
					p.addHandler(new Handler('GET', '/', '', user.username));
					user.addProject(p);
				} else {
					user.projects[project].name = decodeURIComponent(rename);
					user.lastProject = user.projects[project];
				}
	            users.save(user.username, user, function(err) {
	                if (err) {
	                    sendError(res, 500);
	                    throw err;
	                }
	                sendResult(res);
                });
		    });
		}
	});
	// Request to update the project contents.
	app.put('/init', function(req, res, next) {
		var authToken = req.cookies['_auth_nodify'];
		if (!authToken)
		    sendError(res, 403);
		else {
		    users.get(authToken, function(err, doc, meta) {
		        var user;
		        if (err && err.errno == 2) {
		            sendError(res, 404);
		            return;
		        }
		        else if (err) {
                    sendError(res, 500);
                    throw err;
		        }
	            user = createUser(doc);
	            req.body = req.body || {};
	            var code = req.body.code;
	            var uri = req.body.uri;
	            var method = req.body.method;
	            var project = req.body.project;
	            if (!code || !method || !uri || !project) {
			        console.log("ERROR: project=" + project + ",uri=" + uri + ",method=" + method + ",code=" + code);
	                sendError(res, 400);
	                return;
	            }
	            if (!user.projects[project] || !user.projects[project].handlers[method + " " + uri]) {
	                sendError(res, 404);
	                return;
	            }
	            user.projects[project].handlers[method + " " + uri].code = decodeURIComponent(code);
	            user.projects[project].lastHandler = user.projects[project].handlers[method + " " + uri];
	            user.lastProject = user.projects[project];
	            users.save(user.username, user, function(err) {
	                if (err) {
	                    sendError(res, 500);
	                    throw err;
	                }
	                console.log(sys.inspect(user.lastProject));
	                sendResult(res);
                });
		    });
	    }
	});
	// Request to delete the project.
	app.del('/init', function(req, res, next) {
		var authToken = req.cookies['_auth_nodify'];
		if (!authToken)
		    sendError(res, 403);
		else {
		    users.get(authToken, function(err, doc, meta) {
		        var user;
		        if (err && err.errno == 2) {
		            sendError(res, 404);
		            return;
		        }
		        else if (err) {
                    sendError(res, 500);
                    throw err;
		        }
	            user = createUser(doc);
	            req.body = req.body || {};
	            var project = req.body.project;
	            if (!project) {
			        console.log("ERROR: project=" + project);
	                sendError(res, 400);
	                return;
	            }
	            if (!user.projects[project]) {
	                sendError(res, 404);
	                return;
	            }
	            user.removeProject(user.projects[project]);
	            users.save(user.username, user, function(err) {
	                if (err) {
	                    sendError(res, 500);
	                    throw err;
	                }
	                sendResult(res);
                });
		    });
	    }
	});

	app.post('/deploy', function(req, res, next) {
		var authToken = req.cookies['_auth_nodify'];
		if (!authToken)
		    sendError(res, 403);
		else {
		    users.get(authToken, function(err, doc, meta) {
		        var user;
		        if (err && err.errno == 2) {
		            sendError(res, 404);
		            return;
		        }
		        else if (err) {
		            sendError(res, 500);
		            throw err;
		        }
	            user = createUser(doc);
	            req.body = req.body || {};
	            var project = req.body.project;
	            if (!project) {
			        console.log("ERROR: project=" + project);
	                sendError(res, 400);
	                return;
	            }
	            if (!user.projects[project] || !user.projects[project].handlers["GET /"]) {
	                sendError(res, 404);
	                return;
	            }
			    deployer.start(user.projects[project], function (pids) {
					pids.forEach(function(pid) {
						console.log("Spawned proccess " + pid);
					});
			        user.projects[project].pids = pids;
			        users.save(user.id, user, function (err) {
	                    if (err) {
	                        throw err;
	                    }
					});
			    }, function(stdout, stderr) {
				    sendResult(res, stdout+'\n'+stderr);
			    });
		    });
		}
	});

	app.post('/terminate', function(req, res, next) {
		var authToken = req.cookies['_auth_nodify'];
		if (!authToken)
		    sendError(res, 403);
		else {
		    users.get(authToken, function(err, doc, meta) {
		        var user;
		        if (err && err.errno == 2) {
		            sendError(res, 404);
		            return;
		        }
		        else if (err) {
		            sendError(res, 500);
		            throw err;
		        }
	            user = createUser(doc);
	            req.body = req.body || {};
	            var project = req.body.project;
	            if (!project) {
			        console.log("ERROR: project=" + project);
	                sendError(res, 400);
	                return;
	            }
	            if (!user.projects[project] || !user.projects[project].handlers["GET /"]) {
	                sendError(res, 404);
	                return;
	            }
	            if (user.projects[project].pids) {
			        deployer.stop(user.projects[project].pids);
					delete user.projects[project].pids;
					users.save(user.id, user, function (err) {
						if (err) throw err;
						sendResult(res);
					});
				}
		    });
		}
	});

	app.post('/debug', function(req, res, next) {
		var authToken = req.cookies['_auth_nodify'];
		if (!authToken)
		    sendError(res, 403);
		else {
		    users.get(authToken, function(err, doc, meta) {
		        var user;
		        if (err && err.errno == 2) {
		            sendError(res, 404);
		            return;
		        }
		        else if (err) {
		            sendError(res, 500);
		            throw err;
		        }
	            user = createUser(doc);
	            req.body = req.body || {};
	            var project = req.body.project;
	            if (!project) {
			        console.log("ERROR: project=" + project);
	                sendError(res, 400);
	                return;
	            }
	            if (!user.projects[project] || !user.projects[project].handlers["GET /"]) {
	                sendError(res, 404);
	                return;
	            }
			    deployer.debug(user.projects[project], function (pids) {
					pids.forEach(function(pid) {
						console.log("Spawned proccess " + pid);
					});
			        user.projects[project].pids = pids;
			        users.save(user.id, user, function (err) {
	                    if (err) throw err;
						sendResult(res);
					});
			    }, function(stdout, stderr) {
				    sendResult(res, stdout+'\n'+stderr);
			    });
		    });
		}
	});
};

// Helper function to send the result.
var sendResult = function (res, data, extraHeaders) {
    var headers = {'Content-Type': 'application/json'};
    if (extraHeaders)
        for (var h in extraHeaders)
            headers[h] = extraHeaders[h];
	res.writeHead(200, headers);
	if (data)
		res.end(data);
	else
		res.end();
};

// Helper function to send the result in error cases.
var sendError = function (res, status, data, extraHeaders) {
    var headers = {'Content-Type': 'text/plain'};
    if (extraHeaders)
        for (var h in extraHeaders)
            headers[h] = extraHeaders[h];
	res.writeHead(status, headers);
	if (data)
		res.end(data);
	else
		res.end();
};

var createUser = function(dbUser) {
    var lastP = dbUser.lastProject;
    var user = new User(dbUser.username);
    for (var p in dbUser.projects) {
        user.addProject(createProject(dbUser.projects[p]));
    }
    user.lastProject = lastP;
    return user;
};

var createProject = function(dbProject) {
    var lastH = dbProject.lastHandler;
    var proj = new Project(dbProject.name, dbProject.author);
    proj.pids = dbProject.pids;
    for (var h in dbProject.handlers) {
        proj.addHandler(createHandler(dbProject.handlers[h]));
    }
    proj.lastHandler = lastH;
    return proj;
};

var createHandler = function(dbHandler) {
    return new Handler(dbHandler.method, dbHandler.uri, dbHandler.code, dbHandler.author);
}

var generateAuthToken = function (callback) {
    var authToken = new Date().getTime();
    tokenExists(authToken, callback)
}

var tokenExists = function (token, callback) {
    users.get(token, function (err, doc, meta) {
        if (err && err.errno == 2) {
            callback(token);
        }
        else if (err)
            throw err;
        else {
            console.log('!!!! Unbelievably token ' + token + ' already exists. Try another one !!!!');
            generateAuthToken(callback);
        }
    });
}

var createNewUser = function (res) {
    generateAuthToken(function (token) {
        var authToken = token;
        var user = new User(authToken);
        if (user.projectsLength === 0) {
	        var project = new Project('MyProject', user.id);
	        user.addProject(project);
	        var handler = new Handler('GET', '/', 'var a = 1;\nconsole.log(a);', user.id);
	        project.addHandler(handler);
	        var headers = {'Set-Cookie':'_auth_nodify=' + authToken};
        }
        users.save(authToken, user, function(err) {
            if (err) {
                sendError(res, 500);
                throw err;
            }
    		var body = JSON.stringify({'user': user, 'project': project.id});
    		sendResult(res, body, headers);
        });
    });
}
