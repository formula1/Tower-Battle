'use strict';

var STATES = {
  CANCEL: 'canceling',
  ATTACK: 'attacking',
  FALTER: 'faltering',
  IDLE: 'idleing',
  DORMANT: 'sleeping'
};

var PersonalBubble = require('../PersonalBubble');
var Player = require('../index.js');

function Weapon(element, damage, expense, game){
  this.element = element;
  this.expense = expense;
  this.damage = damage;
  this.game = game;
  this.current = this.setState(STATES.DORMANT);
}

Weapon.prototype.setPlayer = function(player){
  if(!this.player){
    this.game.removeFromEnvironment(this);
  }
  if(!player){
    this.game.addToEnvironment(this, this.player.location);
  }
  this.player = player;
  this.setState(player?STATES.FALTER:STATES.DORMANT);
};

Weapon.prototype.setState = function(newState){
  if(this.current) this.game.removeListener('time',this.current);
  this.state = newState;
  this.current = this.do(newState);
  if(this.current){
    this.current = this.current.bind(this);
    this.game.on('time',this.current);
  }
};

Weapon.prototype.attemptAttack = function(){
  var newState;
  switch(this.state){
    case STATES.ATTACK: newState = STATES.CANCEL; break;
    case STATES.CANCEL: newState = STATES.FALTER; break;
    case STATES.FALTER: newState = STATES.FALTER; break;
    case STATES.IDLE: newState = STATES.ATTACK;
  }
  this.setState(newState);
};

Weapon.prototype.hadImpact = function(other){
  if(other instanceof PersonalBubble){
    return this.player.addAdrenaline(this, 1.5);
  }
  if(other.Player){
    return this.player.addAdrenaline(this, 1);
  }
};

Weapon.STATES = STATES;

module.exports = Weapon;

