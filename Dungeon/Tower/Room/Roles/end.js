'use strict';

var FixtureHelper = require('../../../../Helpers/box2d/Fixture');
var Role = require('../Role');

var End = module.exports = function(){
  Role.call(this, End);
};

End.prototype = Object.create(Role.prototype);
End.prototype.constructor = End;
End.roleName = 'End';

End.prototype.spawnRole = function(){
  var room = this;
  var body = room.body;
  var scale = room.floor.scale;
  var sensor = FixtureHelper.rect(scale / 4, scale / 4);
  sensor.set_isSensor(true);
  sensor = body.CreateFixture(sensor);
  room.endSensor = sensor;
  room.onContactStart(sensor, function(fix, contact, oFix){
    var player = oFix.damageable;
    if(!player || !player.isPlayer) return;
    var tower = room.floor.tower;
    tower.game.once('time', tower.nextFloor.bind(tower));
    room.offContactStart(sensor);
  });
};

End.prototype.destroyRole = function(){
  delete this.endSensor;
};
