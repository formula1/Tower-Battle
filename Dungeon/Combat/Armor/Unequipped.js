'use strict';

var Armor = require('./index');
var Element = require('../Element');

var Unequipped = module.exports = function(damageable){
  Armor.call(this, damageable.game);
  this.setOwner(damageable);
  this.element = damageable.element;
};

Unequipped.prototype = Object.create(Armor.prototype);
Unequipped.prototype.constructor = Unequipped;

Unequipped.prototype.modifyDamage = function(damage){
  return Element.scaleDamage(this, damage);
};
