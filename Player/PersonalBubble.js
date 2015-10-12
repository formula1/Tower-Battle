'use strict';

var FixtureHelper = require('../Helpers/box2d/Fixture');

var PersonalBubble = module.exports = function(player, radius){
  this.radius = radius;
  this.player = player;
  this.activity = 0;
};

PersonalBubble.prototype.spawn = function(){
  var sensor = FixtureHelper.circle(this.radius);
  sensor.set_isSensor(true);
  sensor.personalBubble = this;
  this.fixture = this.player.body.CreateFixture(sensor);
  this.player.onContactStart(this.fixture, this.startImpact.bind(this));
  this.player.onContactStart(this.fixture, this.endImpact.bind(this));

};

PersonalBubble.prototype.startImpact = function(fix, contact, oFix){
  if(oFix.weapon){
    this.player.adrenaline += 2;
    return;
  }

  if(!oFix.personalBubble) return;
  this.activity++;
};

PersonalBubble.prototype.endImpact = function(fix, contact, oFix){
  if(oFix.weapon) return;
  if(!oFix.personalBubble) return;
  this.activity--;
};

