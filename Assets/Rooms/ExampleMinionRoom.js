'use strict';

var B2D = require('Box2D');
var Vec2 = B2D.b2Vec2;
var Role = require('../../Dungeon/Room/Role');

var MINIONS = [
  require('../Minions/move-to-hear')
];

var ExampleMinionRoom = module.exports = function(){
  Role.call(this, ExampleMinionRoom);
  var game = this.floor.tower.game;
  var rng = game.rng;
  var Minion = MINIONS[Math.floor(MINIONS.length * rng())];
  this.floor.addEntity(
    new Minion(game),
    new Vec2(this.location.x - .5, this.location.y - .5)
      .mul(this.floor.scale)
  );
};

ExampleMinionRoom.prototype = Object.create(Role.prototype);
ExampleMinionRoom.prototype.constructor = ExampleMinionRoom;
ExampleMinionRoom.roleName = 'ExampleMinionRoom';

ExampleMinionRoom.prototype.spawnRole = function(){};

ExampleMinionRoom.prototype.destroyRole = function(){};
