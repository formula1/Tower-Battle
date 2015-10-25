'use strict';

var Weapon = require('../../Dungeon/Combat/Weapon');
var FxH = require('../../Helpers/box2d/Fixture');
var Vec2 = require('Box2D').b2Vec2;
var B2D = require('Box2D');
var BodyDef = B2D.b2BodyDef;
var PrismaticJointDef = B2D.b2PrismaticJointDef;
var RevoluteJointDef = B2D.b2RevoluteJointDef;
var PrismaticJoint = B2D.b2PrismaticJoint;
var RevoluteJoint = B2D.b2RevoluteJoint;

var tVec = new Vec2();

var STATES = Weapon.STATES;

var Hammer = module.exports = function(game){
  Weapon.call(this, game, 5, 5);
  this.frame = 0;
  this.handJoint = void 0;
  this.staffPositionJoint = void 0;
  this.handBody = void 0;
  this.staffMass = void 0;

  this.on('body', function(body){
    if(!this.owner) return;
    tVec.set(2, 0);

    var rock = FxH.rect(2, 4, tVec, 0);
    rock.set_density(4.0);
    var fix = body.CreateFixture(rock);
    fix.damager = this;

    tVec.set(-4, 0);
    var staff = FxH.rect(8, 1, tVec, 0);
    staff.set_density(1.0);
    body.CreateFixture(staff);

    var handBodyDef = new BodyDef();
    handBodyDef.set_type(B2D.b2_dynamicBody);
    handBodyDef.set_position(this.position);
    handBodyDef.set_fixedRotation(false);
    this.handBody = game.world.CreateBody(handBodyDef);
    var hand = FxH.circle(3, tVec);
    hand.set_isSensor(true);
    hand.set_density(0.3);
    this.handBody.CreateFixture(hand);

    var staffPosJoint = new PrismaticJointDef();
    staffPosJoint.set_bodyA(hand);
    staffPosJoint.set_bodyB(this.staffBody);
    staffPosJoint.set_enableLimit(true);
    staffPosJoint.set_upperTranslation(0);
    staffPosJoint.set_lowerTranslation(-9);
    staffPosJoint.set_enableMotor(true);
    staffPosJoint.set_collideConnected(false);
    this.staffPositionJoint = game.world.CreateJoint(staffPosJoint);

  }.bind(this));

  this.on('spawn', function(){
    if(!this.owner) return;
    var handJoint = new RevoluteJointDef();
    handJoint.set_bodyA(this.handBody);
    handJoint.set_bodyB(this.owner.body);
    handJoint.set_enableLimit(true);
    handJoint.set_lowerAngle(-195);
    handJoint.set_upperAngle(15);
    handJoint.set_collideConnected(false);
    handJoint.set_enableMotor(true);
    this.handJoint = game.world.CreateJoint(handJoint);
  }.bind(this));

  this.on('pre-destroy', function(){
    if(!this.handJoint) return;
    var oldjoint = this.handJoint;
    this.handJoint = void 0;
    if(oldjoint.ptr === 0) return;
    game.world.DestroyJoint(oldjoint);

    oldjoint = this.staffPositionJoint;
    this.staffPositionJoint = void 0;
    if(oldjoint.ptr === 0) return;
    game.world.DestroyJoint(oldjoint);

    game.world.DestroyBody(this.handBody);
    this.handBody = void 0;
  }.bind(this));
};

Hammer.prototype = Object.create(Weapon.prototype);
Hammer.prototype.constructor = Hammer;

Hammer.prototype.doIdle = function(){
  return function(){

    /*
    At some point I'd like to get the actual center of mass and keep it on
    The hand
    var currentpos = this.staffMass.get_center();
    var desiredpos = this.handBody.GetWorldCenter();

    var diff = desiredpos.sub(currentpos);
    */
    console.log(this.staffPositionJoint);

    var currentTranslation = PrismaticJoint.prototype.GetJointTranslation.call(
      this.staffPositionJoint
    );
    PrismaticJoint.prototype.SetMotorSpeed.call(
      this.staffPositionJoint, -currentTranslation
    );
    var currentRotation = RevoluteJoint.prototype.GetJointAngle.call(
      this.handJoint
    );
    RevoluteJoint.prototype.SetMotorSpeed.call(
      this.handJoint, -currentRotation
    );
  }.bind(this);
};

Hammer.prototype.doAttack = function(){
  var charging = true;
  var desT, curT, diffT, desA, curA, diffA;
  return function(){
    if(charging){
      desT = this.staffPositionJoint.GetLowerLimit();
      curT = this.staffPositionJoint.GetJointTranslation();
      diffT = desT - curT;
      this.staffPositionJoint.SetMotorSpeed(diffT);
      curA = this.handJoint.GetJointAngle();
      desA = this.handJoint.GetUpperLimit();
      diffA = desA - curA;
      this.handJoint.SetMotorSpeed(diffA);
      if(Math.abs(diffT) - .1 <= 0 && Math.abs(diffA) - .1 <= 0){
        charging = false;
      }
    }else{
      desA = this.handJoint.GetLowerLimit();
      var oriA = this.handJoint.GetUpperLimit();
      this.handJoint.SetMotorSpeed(desA - oriA);
      curA = this.handJoint.GetJointAngle();
      if(Math.abs(desA - curA) - .1 <= 0){
        return true;
      }
    }
  }.bind(this);
};

Hammer.prototype.doCancel = function(){
  var curT, desT, diffT, curA, desA, diffA;
  return function(){
    curT = this.staffPositionJoint.GetJointTranslation();
    desT = 0;
    diffT = desT - curT;
    this.staffPositionJoint.SetMotorSpeed(diffT);
    curA = this.handJoint.GetJointAngle();
    desA = 0;
    diffA = desA - curA;
    this.handJoint.SetMotorSpeed(diffA);
    if(Math.abs(diffT) - .1 <= 0 && Math.abs(diffA) - .1 <= 0){
      return true;
    }
  }.bind(this);
};

Hammer.prototype.doFalter = function(){
  var animcounter = 0;
  return function(){
    animcounter = (animcounter + 1);
    if(animcounter === 10) return true;
  };
};
