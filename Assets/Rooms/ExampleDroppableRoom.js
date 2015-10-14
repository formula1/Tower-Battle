'use strict';

var B2D = require('Box2D');
var Vec2 = B2D.b2Vec2;
var Role = require('../../Dungeon/Room/Role');
var includeFolder = require('include-folder');
var DROPPABLE = {
  Weapons: includeFolder('../Weapons'),
  Armor: includeFolder('../Armor')
};

var D_CATEGORIES = Object.keys(DROPPABLE);

var ExampleDroppableRoom = module.exports = function(){
  Role.call(this);
  var game = this.floor.tower.game;
  var rng = game.rng;
  var cat = D_CATEGORIES[D_CATEGORIES.length * rng()];
  var poss = Object.keys(DROPPABLE[cat]);
  var Droppable = poss[poss.length * rng()];
  this.floor.addEntity(
    new Droppable(
      game,
      new Vec2(this.location.x, this.location.y).mul(this.floor.scale)
    )
  );
};

ExampleDroppableRoom.prototype = Object.create(Role.prototype);
ExampleDroppableRoom.prototype.constructor = ExampleDroppableRoom;
ExampleDroppableRoom.roleName = 'ExampleDroppableRoom';

ExampleDroppableRoom.prototype.spawnRole = function(){};

ExampleDroppableRoom.prototype.destroyRole = function(){};
