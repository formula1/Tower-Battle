'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var url = require('url');

var dir = path.resolve(__dirname, '../..', 'web_modules');
var nm = path.resolve(__dirname, '../..', 'node_modules');

var rawHost = 'https://raw.githubusercontent.com/';

var location = path.join(dir, 'Box2D_v2.3.1_debug.js');

module.exports = new Promise(function(res, rej){
  var counter = 0;
  var finished = function(){
    counter++;
    if(counter === 2) res();
  };

  request(
    url.resolve(rawHost, 'kripken/box2d.js/master/build/Box2D_v2.3.1_debug.js')
  ).pipe(fs.createWriteStream(location))
    .on('finish', finished)
    .on('error', rej);

  location = path.join(dir, 'Box2D_v2.3.1_min.js');

  request(
    url.resolve(rawHost, 'kripken/box2d.js/master/build/Box2D_v2.3.1_min.js')
  ).pipe(fs.createWriteStream(location))
    .on('finish', finished)
    .on('error', rej);

}).then(function(){
  var b2dLoc = path.join(nm, 'Box2D.js');
  if(!fs.existsSync(b2dLoc)) fs.symlinkSync(location, b2dLoc);
  console.log('finished with box2d');
  return true;
});
