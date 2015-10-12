'use strict';

var B2d = global.Box2D;
var Vec2 = B2d.b2Vec2;
var ContactEmitter = require('../General/Collision/ContactEmitter');

var PersonalBubble = require('./PersonalBubble');
var UnEquippedWeapon = require('./Weapons/Unequipped');
var UnEquippedArmor = require('./Armor/Unequipped');

var impulse = new Vec2();

var Player = module.exports = function(
  element, hp, personalBubbleRadius, controller, game
){
  ContactEmitter.call(this);
  game.on('time', this.applyTime.bind(this));
  this.game = game;
  this.personalBubble = new PersonalBubble(this, personalBubbleRadius);
  this.hp = hp;
  this.element = element;
  this.weapon = new UnEquippedWeapon(this, game);
  this.armor = new UnEquippedArmor(this, game);

  controller.on('change-direction', this.changeDirection.bind(this));
  controller.on('run', this.run.bind(this));
  controller.on('attack', this.attack.bind(this));

  this.newDirection = new Vec2();
  this.oldDirection = new Vec2();

};

Player.prototype = Object.create(ContactEmitter.prototype);
Player.prototype.constructor = Player;

Object.defineProperty(Player.prototype, 'speed', {get: function(){
  return (this.isRunning?2:1.5) * this.adrenaline;
}});

Player.prototype.spawn = require('./box2d');

Player.prototype.applyTime = function(){
  this.doAdrenaline();
  this.doMovement();
};

Player.prototype.doAdrenaline = function(){
  this.adrenaline--;
  this.adrenaline += this.personalBubble.activity;
};

Player.prototype.doMovement = function(){
  this.energy += this.isRunning?-1:2;
  impulse.SetZero();
  impulse.set(this.newDirection);
  impulse.Normalize();
  impulse.mul(this.isRunning?20:10)
  .sub(this.body.GetLinearVelocity())
  .mul(this.body.GetMass());
  this.body.ApplyLinearImpulse(impulse, this.body.GetWorldCenter());
};

Player.prototype.changeDirection = function(vec2){
  this.newDirection.set(vec2.get_x(), vec2.get_y());
};

Player.prototype.run = function(boo){
  this.isRunning = boo;
};

Player.prototype.attack = function(){
  this.weapon.attemptAttack();
  this.energy -= this.weapon.expense;
};

Player.prototype.addAdrenaline = function(attack, impact){
  this.adrenaline += attack * impact - this.debt;
};

Player.prototype.useArmor = function(armor){
  this.armor.setPlayer(void 0);
  this.armor = armor;
  this.armor.setPlayer(this);
};

Player.prototype.useWeapon = function(weapon){
  this.weapon.setPlayer(void 0);
  this.weapon = weapon;
  this.weapon.setPlayer(this);
};

