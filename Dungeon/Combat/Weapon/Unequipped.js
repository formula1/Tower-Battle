'use strict';

var Weapon = require('./index');

var Unequipped = module.exports = function(player){
  Weapon.call(this, player.game, 5, 5);
  this.element = player.element;
};

Unequipped.prototype = Object.create(Weapon.prototype);
Unequipped.prototype.constructor = Unequipped;

Unequipped.prototype.doIdle = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1) % 10;
  };
};

Unequipped.prototype.doAttack = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};

Unequipped.prototype.doCancel = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};

Unequipped.prototype.doFalter = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};
