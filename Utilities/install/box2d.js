'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var url = require('url');

var dir = path.resolve(__dirname, '../..', 'web_modules');
var nm = path.resolve(__dirname, '../..', 'node_modules');

if(!fs.existsSync(dir)) fs.mkdirSync(dir);

var rawHost = 'https://raw.githubusercontent.com/';

var location = path.join(dir, 'Box2D_v2.3.1_debug.js');

request(
  url.resolve(rawHost, 'kripken/box2d.js/master/build/Box2D_v2.3.1_debug.js')
).pipe(fs.createWriteStream(location));

location = path.join(dir, 'Box2D_v2.3.1_min.js');

request(
  url.resolve(rawHost, 'kripken/box2d.js/master/build/Box2D_v2.3.1_min.js')
).pipe(fs.createWriteStream(location));

fs.symlinkSync(location, path.join(nm, 'Box2D.js'));
