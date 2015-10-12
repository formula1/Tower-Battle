'use strict';

var FixtureHelper = require('../../../Helpers/box2d/Fixture');

var spawn;
module.exports = function(){
  this.name = 'end';
  this.once('spawn', spawn);
};

module.exports.undoFloor = function(floor){
  var rs = floor.rooms;
  for(var i = 0; i < rs.length; i++){
    if(rs[i].name === 'end') return this.undo(rs[i]);
  }
};

spawn = function(room){
  var body = room.body;
  var scale = room.floor.scale;
  var sensor = FixtureHelper.rect(scale / 4, scale / 4);
  sensor.set_isSensor(true);
  sensor = body.CreateFixture(sensor);
  room.endSensor = sensor;
  room.onContactStart(sensor, function(fix, contact, oFix){
    console.log('possible end', oFix, oFix.player);
    var player = oFix.player;
    if(!player || player.remote) return;
    var tower = room.floor.tower;
    setImmediate(tower.nextFloor.bind(tower));
    room.offContactStart(sensor);
  });
};

module.exports.undo = function(room){
  delete room.name;
  room.removeListener('spawn', spawn);
};

module.exports.roleName = 'end';
