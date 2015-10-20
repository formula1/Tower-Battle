'use strict';

var Entity = require('../Entity');
var PPEE = require('../../Abstract/pre-post-ee');

var UnEquippedArmor = require('./Armor/Unequipped');

var Damageable = module.exports = function(game, hp, armor){
  Entity.call(this, game);
  PPEE.call(this);

  this.hp = hp;
  this.armor = new UnEquippedArmor(this);

  this.applyDamage = this.applyDamage.bind(this);

  this.on('body', function(body){
    var fix = this.getDamageableShape();
    fix.set_density(1.0);
    this.damageableFixture = body.CreateFixture(fix);
    this.damageableFixture.damageable = this;
    this.onContactStart(this.damageableFixture, this.applyDamage);
  }.bind(this));

  if(armor) this.useArmor(armor);
};

Damageable.prototype = Object.create(Entity.prototype);

for(var i in PPEE.prototype){
  Damageable.prototype[i] = PPEE.prototype[i];
}

Damageable.prototype.constructor = Damageable;

Damageable.prototype.getDamageableShape = function(){
  throw new Error(
    'getDamageableFixture is abstract and needs to be overridden'
  );
};

Damageable.prototype.applyDamage = function(fix, contact, ofix){
  if(!ofix.damager) return;
  if(contact.impulse){
    var impulse = contact.impulse.get_normalImpulses()[0];
    var threshhold = this.armor.impactThreshhold || 1;
    if(impulse <= threshhold) return;
  }

  var hp = this.hp;
  this.run('damage', ofix.damager.getDamage(), function(damage){
    hp -= damage.value;
    return damage;
  });

  this.hp = hp;
  if(this.hp <= 0) this.game.nextTime(this.checkIsDead.bind(this));
};

Damageable.prototype.checkIsDead = function(){
  if(this.hp > 0) return;
  this.destroy();
};

Damageable.prototype.useArmor = function(armor){
  this.armor.setOwner(void 0);
  this.armor = armor;
  this.armor.setOwner(this);
};
