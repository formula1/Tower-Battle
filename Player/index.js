'use strict';

var PersonalBubble = require('./PersonalBubble');
var Attacker = require('../Dungeon/Combat/Attacker');
var Damageable = require('../Dungeon/Combat/Damageable');
var Movable = require('../Dungeon/Entity/Moveable');

var FixtureHelper = require('../Helpers/box2d/Fixture');

var DirectMovement = require('../General/Movement/direct-control');

var Player = module.exports = function(game, controller, config){
  this.element = config.element;
  this.config = config;
  this.isPlayer = true;
  this.controller = controller;

  Movable.call(this, game, controller);
  Attacker.call(this, game, controller);
  Damageable.call(this, game, config.hp);

  controller.on('run', function(boo){
    this.isRunning = boo;
  }.bind(this));

  DirectMovement(this);
  this.personalBubble = new PersonalBubble(this, config.personalBubbleRadius);

  this.on('equippable', this.equip.bind(this));

};

Player.prototype = Object.create(Movable.prototype);

for(var name in Damageable.prototype){
  Player.prototype[name] = Damageable.prototype[name];
}

for(name in Attacker.prototype){
  Player.prototype[name] = Attacker.prototype[name];
}

Player.prototype.constructor = Player;

Player.prototype.getDamageableShape = function(){
  return FixtureHelper.circle(this.config.damageableRadius);
};

Player.prototype.equip = function(obj){
  if(obj.isWeapon) return this.useWeapon(obj);
  if(obj.isArmor) return this.useArmor(obj);
  throw new Error('Cannot equip non weapon, non Armor');
};
