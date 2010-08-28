/**
 * A project is a collection of handlers
**/
var Project = exports.Project = function(name, author) {
    this.name = name;
    this.author = author;
    this.handlers = {};
    this.handlersLength = 0;
};

Project.prototype.addHandler = function(handler) {
    this.handlers[handler.id] = handler;
    this.handlersLength++;
    this.lastHandler = handler;
};

Project.prototype.removeHandler = function(handler) {
    delete this.handlers[handler.id];
    this.handlersLength--;
};

Project.prototype.toString = function() {
    return this.name;
};

Object.defineProperty(Project.prototype, "id", {
    get: function() {
        return this.toString();
    }
});
