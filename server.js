'use strict';

var http = require('http');
var browserify = require('browserify');
var literalify = require('literalify');
var envify = require('envify/custom');
var fs = require('fs');
var open = require('open');
var path = require('path');

var b = browserify(path.join(__dirname, 'index.js'))
.transform(literalify.configure({
  './web_modules/Box2D_v2.3.1_debug.js': 'Module'
})).transform(envify({
  TARGET_ENV: 'browser'
}));

var server = new http.Server();

server.on('request', function(req, res){
  console.log('request: ',req.url);
  switch(req.url){
    case '':
    case '/':
    case '/index.html':
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./index.html').pipe(res);
      break;
    case '/Box2D.js':
      res.setHeader('Content-Type', 'application/javascript');
      fs.createReadStream('./web_modules/Box2D_v2.3.1_debug.js').pipe(res);
      break;
    case '/index.js':
      res.setHeader('Content-Type', 'application/javascript');
      b.bundle().pipe(res);
      break;
    default: res.end();
  }
});

server.listen(3000, function(){
  console.log('listening on ', 'http://localhost:3000');
  open('http://localhost:3000', 'chrome');
});
