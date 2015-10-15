'use strict';

var PersonalBubble = require('./PersonalBubble');
var Attacker = require('../Dungeon/Combat/Attacker');
var Damageable = require('../Dungeon/Combat/Damageable');
var Movable = require('../Dungeon/Entity/Moveable');

var FixtureHelper = require('../Helpers/box2d/Fixture');

var Player = module.exports = function(game, controller, config){
  this.element = config.element;
  this.config = config;
  this.isPlayer = true;

  Movable.call(this, game, controller);
  Attacker.call(this, game, controller);
  Damageable.call(this, game, config.hp);
  this.personalBubble = new PersonalBubble(this, config.personalBubbleRadius);

  this.adrenaline = 0;
  this.energy = 0;

  game.on('time', function(){
    this.adrenaline--;
    this.adrenaline += this.personalBubble.activity;

    this.energy += this.isRunning?-4:1;
  }.bind(this));

  this.controller.on('attack', function(){
    this.energy -= this.weapon.expense;
  }.bind(this));

  this.post('damage', function(netDamage){
    this.adrenaline += this.energy - Math.pow(netDamage.value - this.energy, 2);
  }.bind(this));

  controller.on('run', function(boo){
    console.log(boo);
    this.isRunning = boo;
  }.bind(this));

  this.pre('movement', function(impulse){
    // TODO: use work/energy equaton
    return impulse
      .mul(this.isRunning?config.runSpeed:config.walkSpeed)
      .mul(Math.max(1, this.adrenaline))
      .sub(this.body.GetLinearVelocity());
  }.bind(this));

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
  console.error(obj);
  throw new Error('Cannot equip non weapon, non Armor');
};
