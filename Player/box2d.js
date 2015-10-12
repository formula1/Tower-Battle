'use strict';

var B2d = global.Box2D;
var BodyDef = B2d.b2BodyDef;
var FixtureHelper = require('../Helpers/box2d/Fixture');

var listener, damageReciever, adrenalineModifier;

module.exports = function(location){
  var bodyDef = new BodyDef();
  bodyDef.set_type(B2d.b2_dynamicBody);
  bodyDef.set_position(location);
  bodyDef.set_fixedRotation(false);
  var body = this.body = this.game.world.CreateBody(bodyDef);
  body.player = this;

  this.bodyFixture = body.CreateFixture(FixtureHelper.circle(4));
  this.bodyFixture.player = this;
  this.onContactStart(this.bodyFixture, listener.bind(this));

  this.personalBubble.spawn();
};

listener = function(fix, contact, ofix){
  if(!ofix.owner) return;
  if(!ofix.weapon) return;
  var impulse = contact.impulse.get_normalImpulses()[0];
  damageReciever.call(this, ofix.weapon, impulse);
  adrenalineModifier.call(this, ofix.weapon, impulse);
};

damageReciever = function(weapon, impulse){
  var threshhold = this.armor.impactThreshhold || 1;
  if(impulse < threshhold) return;
  this.hp -= this.armor.modifyDamage(weapon, impulse);
};

adrenalineModifier = function(weapon, impulse){
  var threshhold = this.armor.impactThreshhold || 1;
  this.adrenaline += threshhold - Math.pow(impulse - threshhold, 2);
};
