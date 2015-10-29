'use strict';

var Entity = require('../Entity');

var FixtureHelper = require('../../Helpers/box2d/Fixture');

var Equippable = module.exports = function(game, position){
  Entity.call(this, game, position);
  this.owner = void 0;
  this.on('body', this.dungeonBody.bind(this));
  this.unEquip = this.setOwner.bind(this, void 0);
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
    if(obj === _this.oldOwner){
      return;
    }

    _this.game.nextTime(obj.emit.bind(obj, 'equippable', _this));
  });

  _this.onContactEnd(sensor, function(fix, contact, oFix){
    if(!oFix.collisionEmitter) return;
    var obj = oFix.collisionEmitter.emitter;
    if(obj !== _this.oldOwner) return;
    _this.oldOwner = void 0;
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

  var oldOwner = this.owner;
  this.owner = void 0;
  if(!oldOwner){
    var nCFL = newOwner.game.tower.currentFloor;
    if(nCFL) nCFL.removeEntity(this);
  }else{
    this.oldOwner = oldOwner;
    oldOwner.removeListener('die', this.unEquip);
    this.emit('unequip', oldOwner, this);
  }

  this.owner = newOwner;

  if(!newOwner){
    var oCFL = oldOwner.game.tower.currentFloor;
    if(oCFL) oCFL.addEntity(this, oldOwner.body.GetWorldCenter());
  }else{
    this.oldOwner = void 0;
    newOwner.on('die', this.unEquip);
    this.emit('equip', newOwner, this);
  }

};
