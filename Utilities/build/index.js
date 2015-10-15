'use strict';

var browserify = require('browserify');

var UglifyJS = require('uglify-js');
var literalify = require('literalify');
var envify = require('envify/custom');
var fs = require('fs');
var path = require('path');

var inFile = path.resolve(__dirname, '../../index.js');
var outFile = path.join(__dirname, 'build.js');

console.log(inFile, outFile);
var b2dFile = path.resolve(
  __dirname, '../..',
  'web_modules/Box2D_v2.3.1_min.js'
);

browserify(inFile)
.transform(literalify.configure({
  Box2D: 'Module'
}))
.transform(require('bulkify'))
.transform(envify({
  TARGET_ENV: 'browser'
})).transform({
  global: true,
  sourcemap: false
}, 'uglifyify')
.on('error', function(err){
  console.log('build error', err);
}).bundle().on('error', function(err){
  console.log('build error', err.message);
}).pipe(fs.createWriteStream(outFile))
.on('finish', function(){
  fs.writeFileSync(path.join(__dirname, '/build.min.js'),
    UglifyJS.minify(
      [b2dFile, outFile],
    { compress: { unsafe: true } }).code
  );
  console.log('finished');
});
