'use strict';

var STATES = require('./Weapon/STATES.json');

var UnEquippedWeapon = require('./Weapon/Unequipped');
var Controllable = require('../Entity/Controllable');

var Attacker = module.exports = function(game, controller, weapon){
  Controllable.call(this, game, controller);
  controller.on('attack', this.attack.bind(this));
  this.game = game;
  this.weapon = new UnEquippedWeapon(this);
  this.attackState = STATES.DORMANT;
  this.cancel = this.cancel.bind(this);
  this.idle = this.idle.bind(this);
  this.falter = this.falter.bind(this);
  if(weapon) this.useWeapon(weapon);
};

Attacker.prototype = Object.create(Controllable.prototype);
Attacker.prototype.constructor = Attacker;

Attacker.prototype.attack = function(){
  switch(this.attackState){
    case STATES.ATTACK: this.cancel(); return;
    case STATES.CANCEL: this.falter(); return;
    case STATES.FALTER: this.falter(); return;
    case STATES.IDLE: this.attack(); return;
  }
};

Attacker.prototype.idle = function(){
  this.attackState = STATES.IDLE;
  this.weapon.idle();
};

Attacker.prototype.cancel = function(){
  if(this.attackState === STATES.CANCEL) return this.falter();
  this.attackState = STATES.CANCEL;
  this.weapon.cancel();
};

Attacker.prototype.falter = function(){
  this.attackState = STATES.FALTER;
  this.weapon.falter();
};

Attacker.prototype.useWeapon = function(weapon){
  this.weapon.setOwner(void 0);
  this.weapon.removeListener('impact', this.cancel);
  this.weapon.removeListener('finish', this.idle);
  this.weapon.removeListener('problem', this.falter);
  this.weapon = weapon;
  this.weapon.setOwner(this);
  this.attackState = STATES.FALTER;
  this.weapon.on('impact', this.cancel);
  this.weapon.on('finish', this.idle);
  this.weapon.on('problem', this.falter);
};

