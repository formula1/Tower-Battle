'use strict';

var Weapon = require('./index');
var FiH = require('../../../Helpers/box2d/Filter');
var FxH = require('../../../Helpers/box2d/Fixture');
var parser = require('./parser');

var B2D = require('Box2D');
//var Joint = B2D.b2Joint;

var STATES = Weapon.STATES;

var ParsedWeapon = module.exports = function(config, game){
  Weapon.call(this, game, config.damage, 5);
  this.frame = 0;
  this.config = config;
  this.bodydefs = {};
  this.bodies = {};
  this.joints = {};
  this.isEquipped = false;
  var bodyKeys = Object.keys(config.bodies);
  var bodyKeysLength = bodyKeys.length;

  var jointKeys = Object.keys(config.joints);
  var jointKeysLength = jointKeys.length;

  this.on('bodyDef', function(bd){
    if(!this.owner) return;
    this.isEquipped = true;
    for(var keyi = 0; keyi < bodyKeysLength; keyi++){
      var key = bodyKeys[keyi];
      var curConfig = config.bodies[key];
      var curDef = parser.mainOrNewDef(curConfig, bd);
      parser.bodyDefParser(curDef, curConfig, this.owner.body, this.bodydefs);
      this.bodydefs[key] = curDef;
    }

  }.bind(this));

  this.on('body', function(body){
    if(!this.owner) return;
    for(var keyi = 0; keyi < bodyKeysLength; keyi++){
      var key = bodyKeys[keyi];
      var curConfig = config.bodies[key];
      var curBody;
      if(curConfig.main){
        curBody = body;
      }else{
        curBody = game.world.CreateBody(this.bodydefs[key]);
      }

      this.bodies[key] = curBody;

      if(!curConfig.fixtures || !curConfig.fixtures.length){
        throw new Error(
          'need to provide at least one fixture for body[' + key + ']'
        );
      }

      var curFixtures = curConfig.fixtures;
      var curFix;
      for(var i = 0, l = curFixtures.length; i < l; i++){
        curFix = curBody.CreateFixture(FxH.fromConfig(curFixtures[i]));
        if(curFixtures[i].damager){
          curFix.damager = this;
        }
      }
    }
  }.bind(this));

  this.on('spawn', function(){
    if(!this.owner) return;
    var bodiesMap = this.bodies;
    var bodies = bodyKeys.map(function(key){
      return bodiesMap[key];
    });

    FiH.newGroup([this.owner.body].concat(bodies));

    for(var keyi = 0; keyi < jointKeysLength; keyi++){
      var key = jointKeys[keyi];
      var curConfig = config.joints[key];
      this.joints[key] = parser.jointParser(
        curConfig, game.world, this.owner.body, this.bodies
      );
    }
  }.bind(this));

  this.on('pre-destroy', function(){
    // If we weren't equipped, forget it
    if(!this.isEquipped) return;

    var key;
    for(key in this.joints){
      var oldjoint = this.joints[key];
      delete this.joints[key];
      if(oldjoint.ptr === 0) continue;
      game.world.DestroyJoint(oldjoint.ptr);
    }

    for(key in this.bodies){
      if(config.bodies[key].main) continue;
      game.world.DestroyBody(this.bodies[key]);
      delete this.bodies[key];
      this.bodydefs[key].__destroy__();
      delete this.bodydefs[key];
    }

    // If we were equipped and still have an owner, forget it
    if(this.isEquipped && !this.owner){
      this.isEquipped = false;
    }
  }.bind(this));
};

ParsedWeapon.prototype = Object.create(Weapon.prototype);
ParsedWeapon.prototype.constructor = ParsedWeapon;

ParsedWeapon.prototype.doIdle = function(){
  var anim = this.config.animations.idle;
  return parser.animParser(anim, this.joints, this.bodies);
};

ParsedWeapon.prototype.doSetup = function(){
  var anim = this.config.animations.setup;
  return parser.animParser(anim, this.joints, this.bodies);
};

ParsedWeapon.prototype.doAttack = function(){
  var anim = this.config.animations.attack;
  return parser.animParser(anim, this.joints, this.bodies);
};

ParsedWeapon.prototype.doCancel = function(){
  var anim = this.config.animations.cancel;
  return parser.animParser(anim, this.joints, this.bodies);
};

ParsedWeapon.prototype.doFalter = function(){
  var anim = this.config.animations.falter;
  return parser.animParser(anim, this.joints, this.bodies);
};
