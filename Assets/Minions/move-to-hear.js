'use strict';

var Damageable = require('../../Dungeon/Combat/Damageable');
var Movable = require('../../Dungeon/Entity/Moveable');

var FixtureHelper = require('../../Helpers/box2d/Fixture');
var EarRangeAI = require(
  '../../Dungeon/Combat/AI/target-finders/ear-range'
);
var MoveToTarget = require(
  '../../Dungeon/Combat/AI/target-processors/move-to-target'
);

var EE = require('events').EventEmitter;
var defaultConfig;

var ExampleMinion = module.exports = function(game, config){
  var controller = new EE();
  config = config || defaultConfig;
  this.element = config.element;
  this.config = config;
  this.team = Number.NEGATIVE_INFINITY;
  this.isExampleMinion = true;
  this.controller = controller;

  Movable.call(this, game, controller);
  Damageable.call(this, game, config.hp);

  EarRangeAI(this);
  var moveToTarget = MoveToTarget(this);
  this.on('enemy', moveToTarget);

  this.pre('movement', function(impulse){
    // TODO: use work/energy equaton
    impulse.mul(10);
    return impulse.sub(this.body.GetLinearVelocity());
  }.bind(this));

  this.on('equippable', this.equip.bind(this));

};

ExampleMinion.prototype = Object.create(Movable.prototype);

for(var name in Damageable.prototype){
  ExampleMinion.prototype[name] = Damageable.prototype[name];
}

ExampleMinion.prototype.constructor = ExampleMinion;

ExampleMinion.prototype.getDamageableShape = function(){
  return FixtureHelper.circle(this.config.damageableRadius);
};

ExampleMinion.prototype.equip = function(obj){
  if(obj.isArmor) return this.useArmor(obj);
};

defaultConfig = {
  hp: 10,
  damageableRadius: 2,
  element: -1
};
