var Project = exports.Project = function(name, author) {
    this.name = name;
    this.author = author;
    this.handlers = {};
    this.handlers.length = 0;
};

Project.prototype.addHandler(handler) {
    this.handlers[handler.id] = handler;
    this.handlers.length++;
    this.handlers.lastHandler = handler;
};

Project.prototype.removeHandler(handler) {
    delete this.handlers[handler.id];
    this.handlers.length--;
};

Project.prototype.toString() {
    return this.name;
};

Object.defineProperty(Project.prototype, "id", {
    get: function() {
        return this.toString();
    }
});
