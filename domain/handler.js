/**
 * A handler is the code that handles a particular uri for a particula method (GET, PUT, etc)
**/
var Handler = exports.Handler = function(method, uri, code, author) {
    this.author = author;
    this.method = method;
    this.code = code;
    this.uri = uri;
};

Handler.prototype.toString = function() {
    return this.method + " " + this.uri;
};

Object.defineProperty(Handler.prototype, "id", {
    get: function() {
        return this.toString();
    }
});
