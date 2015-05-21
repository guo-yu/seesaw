'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _url = require('url');

var _url2 = _interopRequireWildcard(_url);

var _http = require('http');

var _http2 = _interopRequireWildcard(_http);

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _express = require('express');

var _express2 = _interopRequireWildcard(_express);

var _request = require('request');

var _request2 = _interopRequireWildcard(_request);

function ensureBody(body) {
  if (typeof body !== 'object') {
    return body;
  }try {
    return JSON.stringify(body);
  } catch (err) {
    return body.toString();
  }
}

function redirect(mockurl) {
  return function (req, res, next) {
    var isForm = req.headers['content-type'] === 'application/x-www-form-urlencoded' && req.method === 'POST';

    var target = {
      method: req.method,
      headers: req.headers,
      url: _url2['default'].resolve(mockurl, req.url),
      query: req.query
    };

    target.method = req.method;
    target.headers = req.headers;
    target.url = _url2['default'].resolve(mockurl, req.url);
    target.query = req.query;

    if (req.files) target.files = req.files;

    if (!isForm && req.method !== 'GET') target.body = ensureBody(req.body);

    if (isForm) target.form = req.body;

    _request2['default'](target, function (err, response, body) {
      if (err) return res.send(err);

      if (response.headers['content-type'] == 'application/json') return res.json(JSON.parse(body));

      return res.send(body);
    });
  };
}

function Server(mockurl) {
  var app = _express2['default']();
  app.use(_express2['default'].logger('dev'));
  app.use(_express2['default'].bodyParser());
  app.use(_express2['default'].methodOverride());
  app.use(_express2['default'].cookieParser('seesaw'));
  app.use(app.router);

  if ('development' == app.get('env')) app.use(_express2['default'].errorHandler());

  app.use(redirect(mockurl));

  return app;
}

function Seesaw(url) {
  this.url = url;
  this.app = new Server(url);
}

Seesaw.prototype.run = function (port) {
  var p = port && !isNaN(parseInt(port)) ? parseInt(port) : 3333;
  this.app.set('port', p);
  _http2['default'].createServer(this.app).listen(this.app.get('port'));
};

exports.server = Seesaw;
exports.redirect = redirect;
//# sourceMappingURL=seesaw.js.map