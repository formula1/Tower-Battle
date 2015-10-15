'use strict';

var Armor = require('../../Dungeon/Combat/Armor');
var Element = require('../../Dungeon/Combat/Element');

var BasicMinus = module.exports = function(game){
  Armor.call(this, game);
  this.minus = 1 + Math.floor(Math.sqrt(1 / game.rng()));
  this.element = 1 + Math.floor(game.rng() * 3);
};

BasicMinus.prototype = Object.create(Armor.prototype);
BasicMinus.prototype.constructor = BasicMinus;

BasicMinus.prototype.modifyDamage = function(damage){
  return Math.max(0, Element.scaleDamage(this, damage) - this.minus);
};
