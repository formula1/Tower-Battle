'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');

var dir = path.resolve(__dirname, '../..', 'web_modules');
if(!fs.existsSync(dir)) fs.mkdirSync(dir);

async.each(fs.readdirSync(__dirname), function(file, next){
  if(file === 'index.js') return next();
  var ret = require(path.join(__dirname, file));
  if(typeof ret === 'function') return ret(next);
  if(ret instanceof Promise){
    ret.catch(next);
    ret.then(next.bind(void 0, void 0));
    return;
  }

  next();
}, function(e){
  if(e) throw e;
  require('../build');
});
