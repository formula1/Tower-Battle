'use strict';

var B2d = global.Box2D;
var Vec2 = B2d.b2Vec2;

var Controllable = require('./Controllable');

var impulse = new Vec2();

var Movable = module.exports = function(game, controller){
  Controllable.call(this, game, controller);

  controller.on('change-direction', function(vec2){
    this.newDirection.set(vec2.get_x(), vec2.get_y());
  }.bind(this));

  this.newDirection = new Vec2();
  this.oldDirection = new Vec2();

  this.doMovement = this.doMovement.bind(this);

  this.on('spawn', game.on.bind(game, 'time', this.doMovement));
  this.on('destroy', game.removeListener.bind(game, 'time', this.doMovement));

};

Movable.prototype = Object.create(Controllable.prototype);

Movable.prototype.constructor = Controllable;

Movable.prototype.doMovement = function(){
  if(!this.body) return;
  impulse.SetZero();
  impulse.set(this.newDirection);
  impulse.Normalize();
  var body = this.body;
  this.run('movement', impulse, function(modifiedImpulse){
    body.ApplyLinearImpulse(
      modifiedImpulse.clone().mul(body.GetMass()),
      body.GetWorldCenter()
    );

    return modifiedImpulse;
  });
};

Movable.prototype.useWeapon = function(weapon){
  this.weapon.setOwner(void 0);
  this.weapon = weapon;
  this.weapon.setOwner(this);
};

