'use strict';

var B2D = require('Box2D');
var BodyDef = B2D.b2BodyDef;
var Vec2 = B2D.b2Vec2;

var tVec = new Vec2();

var getRelative, parseAnimationTarget, doFn;

module.exports.mainOrNewDef = function(bodyConfig, mainDef){
  if(bodyConfig.main){
    return mainDef;
  }

  var bd = new BodyDef();
  bd.set_type(B2D.b2_dynamicBody);
  bd.set_fixedRotation(false);
  return bd;
};

module.exports.bodyDefParser = function(curDef, bodyConfig, ownerBody, allDefs){
  var relative;

  if(bodyConfig.angle){
    var rotConfig = bodyConfig.angle;
    var angle = 0;
    relative = getRelative(rotConfig.relative, ownerBody, allDefs);
    if(rotConfig.relative === 'owner')
      angle = relative.GetAngle();
    else
      angle = relative.get_angle();

    if(rotConfig.offset){
      angle += Math.PI * rotConfig.offset;
    }

    curDef.set_angle(angle);

  }else{
    curDef.set_angle(ownerBody.GetAngle());
  }

  if(bodyConfig.position){
    var posConfig = bodyConfig.position;
    var position = new Vec2();
    relative = getRelative(posConfig.relative, ownerBody, allDefs);
    if(posConfig.relative === 'owner'){
      position.set(relative.GetPosition());
    }else
      position.set(relative.get_position());

    if(posConfig.offset){
      if(typeof posConfig.offset === 'number'){
        tVec.setAngle(curDef.get_angle());
        position.add(tVec.mul(posConfig.offset));
      }else{
        if(posConfig.offset.x){
          position.add(posConfig.offset.x, 0);
        }

        if(posConfig.offset.y){
          position.add(0, posConfig.offset.y);
        }
      }
    }

    curDef.set_position(position);
  }else{
    curDef.set_position(ownerBody.GetPosition());
  }

  return curDef;
};

var PrismaticJointDef = B2D.b2PrismaticJointDef;
var PrismaticJoint = B2D.b2PrismaticJoint;
var RevoluteJointDef = B2D.b2RevoluteJointDef;
var RevoluteJoint = B2D.b2RevoluteJoint;
var WeldJointDef = B2D.b2WeldJointDef;
var WeldJoint = B2D.b2WeldJoint;

module.exports.jointParser = function(jointConfig, world, ownerBody, allBodies){

  var bA = getRelative(jointConfig.bodies[0], ownerBody, allBodies);
  var bB = getRelative(jointConfig.bodies[1], ownerBody, allBodies);
  var def, dist;
  switch(jointConfig.type.toLowerCase()){
    case 'weld':
      def = new WeldJointDef();
      def.Initialize(bA, bB, this.owner.body.GetWorldCenter());
      return B2D.wrapPointer(
        world.CreateJoint(def).ptr,
        WeldJoint
      );
    case 'revolute':
      def = new RevoluteJointDef();
      def.set_bodyA(bA);
      def.set_bodyB(bB);
      dist = 2 * Math.PI;
      if(jointConfig.limit){
        jointConfig.limit[0] *= Math.PI;
        jointConfig.limit[1] *= Math.PI;
        def.set_enableLimit(true);
        def.set_upperAngle(jointConfig.limit[0]);
        def.set_lowerAngle(jointConfig.limit[1]);
        dist = jointConfig.limit[0] - jointConfig.limit[1];
      }

      if(jointConfig.controlled){
        def.set_enableMotor(true);
        def.set_maxMotorTorque(
          dist *
          (bA.GetMass() + bB.GetMass()) *
          60
        );
      }

      return B2D.wrapPointer(
        world.CreateJoint(def).ptr,
        RevoluteJoint
      );

    case 'prismatic':
      tVec.set(0, 1);
      def = new PrismaticJointDef();
      def.set_bodyA(bA);
      def.set_bodyB(bB);

      dist = 5;

      if(jointConfig.limit){
        def.set_enableLimit(true);
        def.set_upperTranslation(jointConfig.limit[0]);
        def.set_lowerTranslation(jointConfig.limit[1]);
        dist = jointConfig.limit[0] - jointConfig.limit[1];
      }

      if(jointConfig.angle){
        tVec.setAngle(jointConfig.angle);
        def.set_localAxisA(tVec);
      }

      if(jointConfig.controlled){
        def.set_enableMotor(true);
        def.set_maxMotorForce(
          dist *
          (bA.GetMass() + bB.GetMass()) *
          60
        );
      }

      return B2D.wrapPointer(
        world.CreateJoint(def).ptr,
        PrismaticJoint
      );
  }
  throw new Error('cannot create joint of type ' + jointConfig.type);
};

module.exports.animParser = function(config, joints, bodies){
  var counter = 0;
  if(!config.targets){
    if(!config.time){
      return function(){ return !config.always; };
    }

    return function(){
      if(counter++ >= config.time){
        return !config.always;
      }
    };
  }

  var fns = config.targets.map(
    parseAnimationTarget.bind(void 0, joints, bodies)
  );

  if(config.always){
    return fns.forEach.bind(fns, function(fn){ fn(); });
  }

  if(config.time){
    return function(){
      fns.forEach(function(fn){ fn(config.time - counter); });

      if(counter++ >= config.time){
        return true;
      }
    };
  }

  return fns.reduce.bind(fns, function(boo, fn){ return boo && fn(); }, true);
};

parseAnimationTarget = function(joints, bodies, target){
  if('joint' in target){
    var joint = joints[target.joint];
    if('offset' in target){
      var des = target.offset * (joint.GetJointAngle?Math.PI:1);
      return function(timeleft){
        var cur = joint.GetJointAngle?
          joint.GetJointAngle():
          joint.GetJointTranslation();
        var diff = (des - cur);
        if(Math.abs(diff) - 0.1 <= 1) return true;
        diff = timeleft?diff / timeleft:diff;
        joint.SetMotorSpeed(diff);
      };
    }else if('speed' in target){
      var speed = target.speed;
      return function(){
        joint.SetMotorSpeed(speed * (joint.GetJointAngle?Math.PI:1));
        return true;
      };
    }
  }

  /*
  if('body' in target){
    if(target)
    if(target.angle){

    }
  }
  */

  throw new Error('cannot animate non body non joint');
};

module.exports.getRelative = getRelative = function(relative, owner, all){
  if(!relative){
    return owner;
  }

  if(relative === 'owner'){
    return owner;
  }else if(!(relative in all)){
    throw new Error('relative[' + relative + '] does not exist');
  }else{
    return all[relative];
  }
};

doFn = function(counter, boo, fn){ return boo && fn(counter); };
