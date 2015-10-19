'use strict';

var Equippable = require('../Equippable');
var FilterHelper = require('../../../Helpers/box2d/Filter');

var STATES = require('./STATES.json');

var Weapon = module.exports = function(game, damage, expense){
  Equippable.call(this, game);
  this.isWeapon = true;
  this.expense = expense;
  this.damage = damage;
  this.attackState = STATES.DORMANT;
  this.doTime = this.doTime.bind(this);
  this.doEquip = this.doEquip.bind(this);
  this.doUnequip = this.doUnequip.bind(this);
  this.handleSpawning = this.handleSpawning.bind(this);
  this.destroy = this.destroy.bind(this);
  this.on('equip', this.doEquip);
  this.on('unequip', this.doUnequip);

  this.on('body', function(body){
    if(!this.owner) return;
    this.emit('equip-body', body);
    this.onContactStart(body, function(fix, contact, ofix){
      if(!ofix.IsSensor() && !fix.damager) this.falter();
      else this.emit('impact', ofix);
    });
  }.bind(this));
  this.on('spawn', function(){
    if(!this.owner) return;
    FilterHelper.newGroup([this.body, this.owner.body]);
    FilterHelper.makeUncollidable(this.body);
  }.bind(this));
};

Weapon.prototype = Object.create(Equippable.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.doEquip = function(owner){
  this.game.on('time', this.doTime);
  if(owner.world){
    this.handleSpawning();
  }

  owner.on('spawn', this.handleSpawning);
  owner.on('destroy', this.destroy);
  this.idle();
};

Weapon.prototype.handleSpawning = function(){
  this.spawn(this.owner.game.world, this.owner.body.GetWorldCenter());
};

Weapon.prototype.doUnequip = function(me, owner){
  this.destroy();
  this.game.removeListener('time', this.doTime);
  FilterHelper.resetCollidable(this.body);
  FilterHelper.removeFromGroup(this.body);
  owner.removeListener('spawn', this.handleSpawning);
  owner.removeListener('destroy', this.destroy);
  this.dormant();
};

Weapon.prototype.doTime = function(){
  if(!this.current()) return;
  switch(this.attackState){
    case STATES.FALTER: this.idle(); return;
    case STATES.CANCEL: this.idle(); return;
    case STATES.ATTACK: this.cancel(); return;
  }
};

Weapon.prototype.attack = function(){
  switch(this.attackState){
    case STATES.ATTACK: this.cancel(); return;
    case STATES.CANCEL: this.falter(); return;
    case STATES.FALTER: this.falter(); return;
    case STATES.IDLE: this.attack(); return;
  }
  this.emit('attack', this);
  FilterHelper.resetCollidable(this.body);
  this.current = this.doAttack();
};

Weapon.prototype.cancel = function(){
  if(this.attackState === STATES.CANCEL) return this.falter();
  FilterHelper.makeUncollidable(this.body);
  this.current = this.doCancel();
};

Weapon.prototype.idle = function(){
  this.emit('finish');
  this.current = this.doIdle();
};

Weapon.prototype.dormant = function(){
  this.currentState = STATES.DORMANT;
};

Weapon.prototype.falter = function(){
  this.emit('falter');
  FilterHelper.makeUncollidable(this.body);
  this.current = this.doFalter();
};

Weapon.prototype.attachToOwner = function(){
  throw new Error('attachToOwner is abstract and needs to be implemented');
};

Weapon.prototype.getDamage = function(){
  return {value: this.damage};
};

Weapon.STATES = STATES;
