'use strict';

var context = module.exports = {};

var createSetter = function(setting){
  var label = setting[0];
  var init = setting[1];
  Object.defineProperty(this, label, {
    get: function(){
      return init;
    },

    set: function(v){
      console.log('setting', label, v);
      if(v !== v) throw new Error('NAN Found');
      init = v;
    }
  });
};

[
  ['fillStyle', 'black'], ['strokeStyle', 'white'], ['lineWidth', 1]
].forEach(createSetter.bind(context));

var createMethod = function(label){
  this[label] = function(){
    console.log('doing', label, arguments);
    for(var i = 0, l = arguments.length; i < l; i++){
      if(arguments[i] !== arguments[i])
        throw new Error('NAN Found');
    }
  };
};

[
  'beginPath', 'moveTo', 'lineTo', 'closePath', 'arc',
  'stroke', 'fill',
  'save', 'clearRect', 'restore',
  'translate', 'scale', 'rotate', 'setTransform'
].forEach(createMethod.bind(context));
