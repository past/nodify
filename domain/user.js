/**
 * A user of the application. A user contains projects
**/
var User = exports.User = function(username) {
    this.username = username;
    this.projects = {};
    this.projects.length = 0;
};

User.prototype.addProject = function(project) {
    this.projects[project.id] = project;
    this.projects.length++;
    this.projects.lastProject = project;
};

User.prototype.removeProject = function(project) {
    delete this.projects[project.id];
    this.projects.length--;
};

User.prototype.toString = function() {
    return this.username;
};

Object.defineProperty(User.prototype, "id", {
    get: function() {
        return this.toString();
    }
});

