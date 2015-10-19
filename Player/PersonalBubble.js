'use strict';

var FixtureHelper = require('../Helpers/box2d/Fixture');

var PersonalBubble = module.exports = function(player, radius){
  this.radius = radius;
  this.player = player;

  this.activity = 0;
  this.adrenaline = 0;
  this.energy = 0;

  this.startImpact = this.startImpact.bind(this);
  this.endImpact = this.endImpact.bind(this);
  player.on('body', this.spawn.bind(this));

  player.game.on('time', this.onTime.bind(this));

  player.on('weapon-attack', function(){
    this.energy -= player.weapon.expense;
  }.bind(this));

  player.post('damage', function(netDamage){
    this.adrenaline += this.energy - Math.pow(netDamage.value - this.energy, 2);
  }.bind(this));

  player.pre('movement', function(impulse){
    return impulse.mul(Math.max(1, this.adrenaline));
  }.bind(this));

};

PersonalBubble.prototype.onTime = function(){
  this.adrenaline--;
  this.adrenaline += this.activity;

  this.energy += this.isRunning?-4:1;
};

PersonalBubble.prototype.spawn = function(body){
  var sensor = FixtureHelper.circle(this.radius);
  sensor.set_isSensor(true);
  sensor.personalBubble = this;
  this.fixture = body.CreateFixture(sensor);
  this.player.onContactStart(this.fixture, this.startImpact.bind(this));
  this.player.onContactStart(this.fixture, this.endImpact.bind(this));
};

PersonalBubble.prototype.startImpact = function(fix, contact, oFix){
  if(oFix.damager){
    this.player.adrenaline += 2;
    return;
  }

  if(oFix.personalBubble) this.activity++;
  if(oFix.damageable && oFix.damageable.controller) this.activity++;
};

PersonalBubble.prototype.endImpact = function(fix, contact, oFix){
  if(oFix.damager) return;
  if(oFix.personalBubble) this.activity--;
  if(oFix.damageable && oFix.damageable.controller) this.activity--;
};

