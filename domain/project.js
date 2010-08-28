/**
 * A project is a collection of handlers
**/
var Project = exports.Project = function(name, author) {
    this.name = name;
    this.author = author;
    this.handlers = {};
    this.handlers.length = 0;
};

Project.prototype.addHandler = function(handler) {
    this.handlers[handler.id] = handler;
    this.handlers.length++;
    this.handlers.lastHandler = handler;
};

Project.prototype.removeHandler = function(handler) {
    delete this.handlers[handler.id];
    this.handlers.length--;
};

Project.prototype.toString = function() {
    return this.name;
};

Object.defineProperty(Project.prototype, "id", {
    get: function() {
        return this.toString();
    }
});
