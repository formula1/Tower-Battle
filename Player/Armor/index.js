'use strict';

var PPEE = require('../../Abstract/pre-post-ee');

var Armor = module.exports = function(element, game){
  PPEE.call(this);
  this.element = element;
  this.game = game;
};

Armor.prototype = Object.create(PPEE.prototype);
Armor.prototype.constructor = Armor;

Armor.prototype.setPlayer = function(player){
  if(!this.player){
    this.game.removeFromEnvironment(this);
  }

  if(!player){
    this.game.addToEnvironment(this, this.player.location);
  }

  this.player = player;
};

Armor.prototype.modifyDamage = function(attack){
  return this.run(
    'element-multiplier', attack.damage, this.applyScalar.bind(this, attack)
  );
};

Armor.prototype.appyScalar = function(attack, damage){
  var te = this.element, ae = attack.element;
  /*
  1 > 2 > 3 > 1
  2 - 1 = (1 + 3)%3 = 1
  3 - 2 = (1 + 3)%3 = 1
  1 - 3 = (-2 + 3)%3 = 1

  1 - 2 = (-1 + 3)%3 = 2
  3 - 2 = (-1 + 3)%3 = 2
  3 - 1 = (2 + 3)%3 = 2
  */
  var cmpr = (te - ae + 3) % 3;
  var scalar = cmpr === 0?1:cmpr === 1?2:cmpr === 2?0.5:0;
  return damage * scalar;
};
