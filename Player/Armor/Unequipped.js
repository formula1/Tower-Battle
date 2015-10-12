'use strict';

var Armor = require('./index');

var Unequipped = module.exports = function(player, game){
  Armor.call(this,player.element,game);
  this.player = player;
};

Unequipped.prototype = Object.create(Armor.prototype);
Unequipped.prototype.constructor = Unequipped;
