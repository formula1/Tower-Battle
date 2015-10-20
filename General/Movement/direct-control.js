'use strict';

var preLinear, preAngular, preMovement;
var PI2 = Math.PI * 2;

module.exports = function(minion){
  minion.pre('movement', preMovement.bind(minion));
};

preMovement = function(dirs){
  // TODO: use work/energy equaton
  var magnitude = dirs.linear.Length();
  return {
    angular: preAngular.call(this, dirs.angular, magnitude),
    linear: preLinear.call(this, dirs.linear)
  };
};

preLinear = function(impulse){
  // TODO: use work/energy equaton
  return impulse
    .mul(this.isRunning?this.config.runSpeed:this.config.walkSpeed)
    .sub(this.body.GetLinearVelocity());
};

preAngular = function(angle, magnitude){
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

  return magnitude * min - this.body.GetAngularVelocity();
};
