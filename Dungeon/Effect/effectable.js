'use strict';

var PPEE = require('../../Abstract/pre-post-ee');

var Effectable;

/*
  Not all Effects Watch for time step
  Some effects watch for value modification

  So.
  - Aura Effects may increase the longer the player is in contact with the aura
  - Some effects don't stack linearlly
  - Some effects do stack linearlly
  - effects (when stacked) can be individually removed
  - Some effects use an internal resource
  - Some effects override an internal resource

  Effects need to be able to add arbitrary listeners
  - most importantly is
    - Aura listeners
    - Time Listeners
    - Modification Listeners
*/

module.exports = Effectable = function(game){
  PPEE.call(this);
  this.effects = new Map();
  this.resources = {};
  this.doEffects = this.doEffects.bind(this);
  game.on('time', this.doEffects);
};

Effectable.prototype.addEffect = function(effect){

};

Effectable.prototype.removeEffect = function(effect){
  this.effects.push(effect);
};

Effectable.prototype.doEffects = function(){
  var effects = this.effects;
  for(var i = 0, l = effects.length; i < l; i++){
    effect[i].applyEffect(this);
  }
};


