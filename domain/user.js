/**
 * A user of the application. A user contains projects
**/
var User = exports.User = function(username) {
    this.username = username;
    this.projects = {};
    this.projectsLength = 0;
};

User.prototype.addProject = function(project) {
    this.projects[project.id] = project;
    this.projectsLength++;
    this.lastProject = project;
};

User.prototype.removeProject = function(project) {
    delete this.projects[project.id];
    this.projectsLength--;
	self = this;
	Object.keys(this.projects).forEach(function (p) {
		self.lastProject = p;
	});
};

User.prototype.toString = function() {
    return this.username;
};

Object.defineProperty(User.prototype, "id", {
    get: function() {
        return this.toString();
    }
});

