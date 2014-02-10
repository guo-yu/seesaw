var url = require('url'),
    http = require('http'),
    path = require('path'),
    express = require('express'),
    request = require('request');

var ensureBody = function(body) {
    if (typeof(body) !== 'object') return body;
    try {
        return JSON.stringify(body);
    } catch (err) {
        return body.toString();
    }
}

var redirect = function(mockurl) {
    return function(req, res, next) {
        var target = {};
        var isForm = req.headers['content-type'] === 'application/x-www-form-urlencoded' && req.method === 'POST';
        target.method = req.method;
        target.headers = req.headers;
        target.url = url.resolve(mockurl, req.url);
        target.query = req.query;
        if (req.files) target.files = req.files;
        if (!isForm && req.method !== 'GET') target.body = ensureBody(req.body);
        if (isForm) target.form = req.body;
        request(target, function(err, response, body) {
            if (err) return res.send(err);
            if (response.headers['content-type'] == 'application/json') return res.json(JSON.parse(body));
            return res.send(body);
        });
    }
}

var Server = function(mockurl) {
    var app = express();
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('seesaw'));
    app.use(app.router);
    if ('development' == app.get('env')) app.use(express.errorHandler());
    app.use(redirect(mockurl));
    return app;
}

var Seesaw = function(url) {
    this.url = url;
    this.app = new Server(url);
}

Seesaw.prototype.run = function(port) {
    var p = (port && !isNaN(parseInt(port))) ? parseInt(port) : 3333;
    this.app.set('port', p);
    http.createServer(this.app).listen(this.app.get('port'));
}

exports.server = Seesaw;
exports.redirect = redirect;