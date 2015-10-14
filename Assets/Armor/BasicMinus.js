'use strict';

var Armor = require('../../Dungeon/Combat/Armor');
var Element = require('../../Dungeon/Combat/Element');

var BasicMinus = module.exports = function(damageable){
  Armor.call(this, damageable.game);
  this.setOwner(damageable);
  this.element = damageable.element;
  this.minus = 1 + Math.floor(Math.sqrt(1 / damageable.game.rng()));
};

BasicMinus.prototype = Object.create(Armor.prototype);
BasicMinus.prototype.constructor = BasicMinus;

BasicMinus.prototype.modifyDamage = function(damage){
  return Math.max(0, Element.scaleDamage(this, damage) - this.minus);
};
