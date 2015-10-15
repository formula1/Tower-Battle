'use strict';

var B2D = require('Box2D');
var Vec2 = B2D.b2Vec2;
var Role = require('../../Dungeon/Room/Role');

var DROPPABLE = {
  Weapons: {
    BasicSensor: require('../Weapons/BasicSensor')
  },
  Armor: {
    BasicSensor: require('../Armor/BasicMinus')
  }
};

var D_CATEGORIES = Object.keys(DROPPABLE);

var ExampleDroppableRoom = module.exports = function(){
  Role.call(this, ExampleDroppableRoom);
  var game = this.floor.tower.game;
  var rng = game.rng;
  var cat = DROPPABLE[D_CATEGORIES[Math.floor(D_CATEGORIES.length * rng())]];
  var poss = Object.keys(cat);
  var Droppable = cat[poss[Math.floor(poss.length * rng())]];
  this.floor.addEntity(
    new Droppable(game),
    new Vec2(this.location.x - .5, this.location.y - .5)
      .mul(this.floor.scale)
  );
};

ExampleDroppableRoom.prototype = Object.create(Role.prototype);
ExampleDroppableRoom.prototype.constructor = ExampleDroppableRoom;
ExampleDroppableRoom.roleName = 'ExampleDroppableRoom';

ExampleDroppableRoom.prototype.spawnRole = function(){};

ExampleDroppableRoom.prototype.destroyRole = function(){};
