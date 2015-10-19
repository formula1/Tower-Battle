'use strict';

var Weapon = require('../../Dungeon/Combat/Weapon');
var FxH = require('../../Helpers/box2d/Fixture');
var Vec2 = require('Box2D').b2Vec2;

var tVec = new Vec2();

var WeldJointDef = require('Box2D').b2WeldJointDef;

var STATES = Weapon.STATES;

var BasicSensor = module.exports = function(game){
  Weapon.call(this, game, 5, 5);
  console.log(this.isWeapon);
  this.frame = 0;
  this.joint = void 0;
  this.on('equip-body', function(body){
    if(!this.owner) return;
    var oAng = this.owner.body.GetAngle();
    tVec.set(Math.cos(oAng), Math.sin(oAng)).mul(5);
    var circle = FxH.circle(3, tVec);
    circle.set_isSensor(true);
    var fix = body.CreateFixture(circle);
    fix.damager = this;
  }.bind(this));

  this.on('spawn', function(){
    if(!this.owner) return;
    var keeper = new WeldJointDef();
    keeper.Initialize(
      this.owner.body,
      this.body,
      this.owner.body.GetWorldCenter()
    );
    this.joint = game.world.CreateJoint(keeper);
  }.bind(this));

  this.on('pre-destroy', function(){
    if(!this.joint) return;
    var oldjoint = this.joint;
    this.joint = void 0;
    if(oldjoint.ptr === 0) return;
    game.world.DestroyJoint(oldjoint);
  }.bind(this));
};

BasicSensor.prototype = Object.create(Weapon.prototype);
BasicSensor.prototype.constructor = BasicSensor;

BasicSensor.prototype.doIdle = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1) % 10;
  };
};

BasicSensor.prototype.doAttack = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 20) return true;
  };
};

BasicSensor.prototype.doCancel = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};

BasicSensor.prototype.doFalter = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};
