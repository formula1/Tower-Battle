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
  this.weapon.attack();
};

Attacker.prototype.idle = function(){
  this.weapon.idle();
};

Attacker.prototype.cancel = function(){
  this.weapon.cancel();
};

Attacker.prototype.falter = function(){
  this.weapon.falter();
};

Attacker.prototype.useWeapon = function(weapon){
  if(this.weapon){
    this.weapon.setOwner(void 0);
    this.weapon.removeAllListeners('impact');
    this.weapon.removeAllListeners('finish');
    this.weapon.removeAllListeners('problem');
  }

  this.weapon = weapon;
  this.weapon.setOwner(this);
  this.weapon.on('impact', this.emit.bind(this, 'weapon-impact'));
  this.weapon.on('finish', this.emit.bind(this, 'weapon-ready'));
  this.weapon.on('problem', this.emit.bind(this, 'weapon-problem'));
  this.weapon.on('attack', this.emit.bind(this, 'weapon-attack'));
};

