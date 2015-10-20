'use strict';

var Vec2 = require('Box2D').b2Vec2;
var tVec = new Vec2();
var PI2 = Math.PI * 2;
var preLinear, preAngular, preMovement;

module.exports = function(minion){
  minion.pre('movement', preMovement.bind(minion));
};

preMovement = function(dirs){
  // TODO: use work/energy equaton
  return {
    angular: preAngular.call(this, dirs.angular),
    linear: preLinear.call(this, dirs.linear)
  };
};

preLinear = function(impulse){

  if(impulse.Length() === 0)
    return impulse.sub(this.body.GetLinearVelocity());
  var curAng = this.body.GetAngle();

  // TODO: use work/energy equaton
  tVec.set(Math.cos(curAng), Math.sin(curAng));
  return tVec
    .add(impulse)
    .mul(1 / 2)
    .mul(this.isRunning?this.config.runSpeed:this.config.walkSpeed)
    .sub(this.body.GetLinearVelocity());
};

preAngular = function(angle){
  // TODO: use work/energy equaton
  var curAng = this.body.GetAngle() % PI2;

  var min = angle - curAng;

  var test = angle - curAng + PI2;
  if(Math.abs(test) < Math.abs(min)){
    min = angle - curAng + PI2;
  }

  test = angle - curAng - PI2;
  if(Math.abs(test) < Math.abs(min)){
    min = angle - curAng - PI2;
  }

  return min - this.body.GetAngularVelocity();
};
