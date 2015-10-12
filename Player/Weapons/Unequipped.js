'use strict';

var Weapon = require('./index');

var STATES = Weapon.STATES;

var Unequipped = module.exports = function(player, game){
  Weapon.call(this,player.element,5,5,game);
  this.player = player;
  this.setState(STATES.IDLE);
  this.frame = 0;
};

Unequipped.prototype = Object.create(Weapon.prototype);
Unequipped.prototype.constructor = Unequipped;

var idle, attack, cancel, falter;

Unequipped.prototype.do = function(state){
  switch(state){
    case STATES.IDLE: return idle;
    case STATES.ATTACK: return attack;
    case STATES.CANCEL: return cancel;
    case STATES.FALTER: return falter;
  }
};

idle = function(){

};

attack = function(){

};

cancel = function(){

};

falter = function(){

};
