var path = require('path');
var depcheck = require('depcheck');

var options = {
  withoutDev: true, // check against devDependencies
  ignoreBinPackage: false, // ignore the packages with bin entry
  ignoreDirs: [// folder with these names will be ignored
    'Utilities'
  ],
  ignoreDirs: [// folder with these names will be ignored
    'sandbox',
    'dist',
    'bower_components'
  ],
  ignoreMatches: [// ignore dependencies that matches these globs
    '.*',
    '*.md'
  ],
  parsers: {
    '*.js': depcheck.parser.es6
  },
  detectors: [// the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration
  ],
  specials: []
};

console.log(depcheck.parser.es6);

depcheck(__dirname + '/..', options, function(unused){
  // an array containing the unused dependencies
  console.log(unused.dependencies);

  // an array containing the unused devDependencies
  console.log(unused.devDependencies);
  console.log(unused.invalidFiles); // files that cannot access or parse
  console.log(unused.invalidDirs); // directories that cannot access
});
