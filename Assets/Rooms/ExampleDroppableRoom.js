'use strict';

var B2D = require('Box2D');
var Vec2 = B2D.b2Vec2;
var Role = require('../../Dungeon/Tower/Room/Role');

var ParsedWeapon = require('../../Dungeon/Combat/Weapon/parsed-weapon');

var DROPPABLE = {
  Weapons: {
    Hammer: ParsedWeapon.bind(void 0, require('../Weapons/Hammer.json')),
    BasicSensor: ParsedWeapon.bind(void 0, require('../Weapons/BasicSensor.json'))
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
  console.log(poss);
  var tnum = rng();
  console.log(tnum);
  tnum *= poss.length;
  console.log(tnum);
  tnum = Math.floor(tnum);
  console.log(tnum);
  var Droppable = cat[poss[tnum]];
  console.log(this.location);
  this.floor.addEntity(
    new Droppable(game),
    new Vec2(this.location.x, this.location.y)
      .mul(this.floor.scale * 2)
  );
};

ExampleDroppableRoom.prototype = Object.create(Role.prototype);
ExampleDroppableRoom.prototype.constructor = ExampleDroppableRoom;
ExampleDroppableRoom.roleName = 'ExampleDroppableRoom';

ExampleDroppableRoom.prototype.spawnRole = function(){};

ExampleDroppableRoom.prototype.destroyRole = function(){};
