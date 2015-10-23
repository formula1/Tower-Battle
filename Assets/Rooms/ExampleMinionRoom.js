'use strict';

var B2D = require('Box2D');
var Vec2 = B2D.b2Vec2;
var Role = require('../../Dungeon/Room/Role');

var MINIONS = [
  require('../Minions/move-to-hear')
];

var ExampleMinionRoom = module.exports = function(){
  Role.call(this, ExampleMinionRoom);
  var floor = this.floor;
  var game = this.floor.tower.game;
  var rng = game.rng;
  var MinionClass = MINIONS[Math.floor(MINIONS.length * rng())];
  var minion = new MinionClass(game);
  var dlist = function(){
    if(floor.tower.currentFloor !== floor) return;
    floor.removeEntity(minion);
    minion.removeListener('destroy', dlist);
  };

  minion.on('destroy', dlist);

  console.log(this.location);
  floor.addEntity(
    minion,
    new Vec2(this.location.x, this.location.y)
      .mul(this.floor.scale * 2)
  );

};

ExampleMinionRoom.prototype = Object.create(Role.prototype);
ExampleMinionRoom.prototype.constructor = ExampleMinionRoom;
ExampleMinionRoom.roleName = 'ExampleMinionRoom';

ExampleMinionRoom.prototype.spawnRole = function(){};

ExampleMinionRoom.prototype.destroyRole = function(){};
