'use strict';

var Weapon = require('./index');

var STATES = Weapon.STATES;

var BasicSensor = module.exports = function(player){
  Weapon.call(this, player.game, player.element, 5, 5);
  this.player = player;
  this.frame = 0;
};

BasicSensor.prototype = Object.create(Weapon.prototype);
BasicSensor.prototype.constructor = BasicSensor;

BasicSensor.prototype.doIdle = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1) % 10;
  };
};

BasicSensor.prototype.doAttack = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};

BasicSensor.prototype.doCancel = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};

BasicSensor.prototype.doFalter = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};
