'use strict';

var Entity = require('./index');
var PPEE = require('../../Abstract/pre-post-ee');

var Controllable = module.exports = function(game, controller){
  if(this.controller) return;
  Entity.call(this, game);
  PPEE.call(this);
  this.controller = controller;
};

Controllable.prototype = Object.create(Entity.prototype);

for(var i in PPEE){
  Controllable.prototype[i] = PPEE.prototype[i];
}

Controllable.prototype.constructor = Controllable;

