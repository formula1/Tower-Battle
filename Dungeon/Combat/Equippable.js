'use strict';

var Entity = require('../Entity');

var FixtureHelper = require('../../Helpers/box2d/Fixture');

var Equippable = module.exports = function(game, position){
  Entity.call(this, game, position);
  this.owner = void 0;
  this.on('body', this.dungeonBody.bind(this));
};

Equippable.prototype = Object.create(Entity.prototype);
Equippable.prototype.constructor = Equippable;

Equippable.prototype.dungeonBody = function(body){
  if(this.owner) return;
  var circle = FixtureHelper.circle(3);
  circle.set_isSensor(true);
  var _this = this;
  var sensor = body.CreateFixture(circle);
  _this.onContactStart(sensor, function(fix, contact, oFix){
    if(oFix.IsSensor()) return;
    if(!oFix.collisionEmitter) return;
    var obj = oFix.collisionEmitter.emitter;
    if(obj instanceof Equippable) return;
    if(!(obj instanceof Entity)) return;
    Entity.emit('equippable', _this);
  });
};

Equippable.prototype.setOwner = function(newOwner){
  if(!this.owner && !newOwner){
    throw new Error(
      'need to either: ' +
      'equip to an existant new Owner or ' +
      'Unequipped from current Owner'
    );
  }

  if(!this.owner){
    if(this.body)
      this.destroy();
  }else{
    this.emit('unequip', this.owner, this);
  }

  if(!newOwner){
    if(this.owner.world)
      this.spawn(this.owner.world, this.owner.body.GetWorldCenter());
  }else{
    this.emit('equip', newOwner, this);
  }

  this.owner = newOwner;
};
