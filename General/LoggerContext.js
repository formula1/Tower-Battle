'use strict';

var context = module.exports = {};

var createSetter = function(label){
  Object.defineProperty(this, label, {
    set: function(v){
      console.log('setting', label, v);
    }
  });
};

[
  'fillStyle', 'strokeStyle', 'lineWidth'
].forEach(createSetter.bind(context));

var createMethod = function(label){
  this[label] = function(){
    console.log('doing', label, arguments);
  };
};

[
  'beginPath', 'moveTo', 'lineTo', 'closePath', 'arc',
  'stroke', 'fill',
  'save', 'clearRect', 'restore',
  'translate', 'scale', 'rotate', 'setTransform'
].forEach(createMethod.bind(context));
