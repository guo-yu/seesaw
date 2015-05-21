import url from 'url'
import http from 'http'
import path from 'path'
import express from 'express'
import request from 'request'

function ensureBody(body) {
  if (typeof(body) !== 'object') 
    return body

  try {
    return JSON.stringify(body)
  } catch (err) {
    return body.toString()
  }
}

function redirect(mockurl) {
  return (req, res, next) => {
    var isForm = req.headers['content-type'] === 'application/x-www-form-urlencoded' && req.method === 'POST'

    const target = {
      'method': req.method,
      'headers': req.headers,
      'url': url.resolve(mockurl, req.url),
      'query': req.query
    }

    target.method = req.method
    target.headers = req.headers
    target.url = url.resolve(mockurl, req.url)
    target.query = req.query

    if (req.files) 
      target.files = req.files

    if (!isForm && req.method !== 'GET') 
      target.body = ensureBody(req.body)

    if (isForm) 
      target.form = req.body

    request(target, (err, response, body) => {
      if (err) 
        return res.send(err)

      if (response.headers['content-type'] == 'application/json') 
        return res.json(JSON.parse(body))

      return res.send(body)
    })
  }
}

function Server(mockurl) {
  var app = express()
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser('seesaw'))
  app.use(app.router)

  if ('development' == app.get('env')) 
    app.use(express.errorHandler())

  app.use(redirect(mockurl))

  return app
}

function Seesaw(url) {
  this.url = url;
  this.app = new Server(url);
}

Seesaw.prototype.run = function(port) {
  var p = (port && !isNaN(parseInt(port))) ? parseInt(port) : 3333
  this.app.set('port', p)
  http.createServer(this.app).listen(this.app.get('port'))
}

exports.server = Seesaw
exports.redirect = redirect
