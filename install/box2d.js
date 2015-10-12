'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var url = require('url');

var dir = path.resolve(__dirname, '..', 'web_modules');
if(!fs.existsSync(dir)) fs.mkdirSync(dir);

var rawHost = 'https://raw.githubusercontent.com/';

request(url.join(rawHost, 'kripken/box2d.js/master/build/Box2D_v2.3.1_debug.js'))
.pipe(fs.createWriteStream(path.join(dir, 'Box2D_v2.3.1_debug.js')));
