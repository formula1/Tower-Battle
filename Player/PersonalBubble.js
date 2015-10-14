'use strict';

var FixtureHelper = require('../Helpers/box2d/Fixture');
var Player = require('./index');

var PersonalBubble = module.exports = function(player, radius){
  this.radius = radius;
  this.player = player;
  this.activity = 0;
  this.startImpact = this.startImpact.bind(this);
  this.endImpact = this.endImpact.bind(this);
  this.player.on('body', this.spawn.bind(this));
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
  if(oFix.damageable && oFix.damageable instanceof Player) this.activity++;
};

PersonalBubble.prototype.endImpact = function(fix, contact, oFix){
  if(oFix.damager) return;
  if(oFix.personalBubble) this.activity--;
  if(oFix.damageable && oFix.damageable instanceof Player) this.activity--;
};

