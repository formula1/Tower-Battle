'use strict';

var PPEE = require('../../../Abstract/pre-post-ee');
var Equippable = require('../Equippable');

var Armor = module.exports = function(game, element){
  Equippable.call(this, game);
  PPEE.call(this);
  this.element = element;
  this.game = game;
  this.modifyDamage = this.modifyDamage.bind(this);
  this.on('equip', function(damageable){
    damageable.pre('damage', this.modifyDamage);
  });

  this.on('unequip', function(damageable){
    damageable.unPre('damage', this.modifyDamage);
  });

};

Armor.prototype = Object.create(Equippable.prototype);

for(var i in PPEE){
  Armor.prototype[i] = PPEE.prototype[i];
}

Armor.prototype.constructor = Armor;

Armor.prototype.modifyDamage = function(){
  throw new Error('modifyDamage is Abstract and needs to be overridden');
};
