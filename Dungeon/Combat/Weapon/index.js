'use strict';

var Equippable = require('../Equippable');
var FilterHelper = require('../../../Helpers/box2d/Filter');

var STATES = require('./STATES.json');

var Weapon = module.exports = function(game, damage, expense){
  Equippable.call(this, game);
  this.expense = expense;
  this.damage = damage;
  this.attackState = STATES.DORMANT;
  this.doTime = this.doTime.bind(this);
  this.doEquip = this.doEquip.bind(this);
  this.doUnequip = this.doUnequip.bind(this);
  this.handlerSpawning = this.handleSpawning.bind(this);
  this.destroy = this.destroy.bind(this);
  this.on('equip', this.doEquip);
  this.on('unequip', this.doUnequip);

  this.on('body', function(body){
    if(!this.owner) return;
    this.addContactStart(body, function(fix, contact, ofix){
      if(!fix.damager) this.falter();
      else this.emit('impact', ofix);
    });
  }.bind(this));
};

Weapon.prototype = Object.create(Equippable.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.doEquip = function(){
  this.game.on('time', this.doTime);
  var owner = this.owner;
  if(owner.world){
    this.handleSpawning();
  }

  this.owner.on('spawn', this.handleSpawning);
  this.owner.on('destroy', this.destroy);
  this.idle();
};

Weapon.prototype.handleSpawning = function(){
  FilterHelper.newGroup([this.body, this.owner.body]);
  this.spawn(this.owner.world, this.owner.body.GetWorldCenter());
};

Weapon.prototype.doUnequip = function(me, owner){
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
  FilterHelper.resetCollidable(this.body);
  this.current = this.doAttack();
};

Weapon.prototype.cancel = function(){
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
  this.emit('problem');
  FilterHelper.makeUncollidable(this.body);
  this.current = this.doFalter();
};

Weapon.prototype.attachToOwner = function(){
  throw new Error('attachToOwner is abstract and needs to be implemented');
};

Weapon.STATES = STATES;
