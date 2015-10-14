'use strict';

var fs = require('fs');
var path = require('path');

var dir = path.resolve(__dirname, '../..', 'web_modules');
if(!fs.existsSync(dir)) fs.mkdirSync(dir);

fs.readdirSync(__dirname).forEach(function(file){
  if(file === 'index.js') return;
  require(path.join(__dirname, file));
});

require('../build');
