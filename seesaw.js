var http = require('http'),
    express = require('express'),
    path = require('path'),
    request = require('request');

var fetch = function(target, callback) {
    // console.log(target);
    if (target.method == 'POST') {
        target['form'] = target.body;
    }
    delete target.body;
    request(target, function(err, res, body) {
        callback(err, res, body)
    });
}

var redirect = function(mockurl) {
    return function(req, response, next) {
        var target = {
            method: req.method,
            url: mockurl + req.url,
            query: req.query,
            body: req.body,
            files: req.files,
            headers: req.headers
        };
        fetch(target, function(err, res, body) {
            response.json(body);
        });
    }
}

var Server = function(mockurl) {

    var app = express();

    // all environments
    app.use(express.logger('dev'));
    app.use(express.bodyParser({
        keepExtensions: true,
        uploadDir: path.join(__dirname, '/uploads')
    }));
    app.use(express.methodOverride());
    app.use(express.cookieParser('seesaw'));
    app.use(app.router);

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.use(redirect(mockurl));

    return app;
}

var Seesaw = function(url) {
    this.url = url;
    this.app = new Server(url);
}

Seesaw.prototype.run = function(port) {
    var self = this;
    if (port && !isNaN(parseInt(port))) {
        self.app.set('port', parseInt(port));
    } else {
        self.app.set('port', 3333);
    }
    http.createServer(self.app).listen(self.app.get('port'));
}

exports.server = Seesaw;
exports.redirect = redirect;