'use strict';

var roomProto = require('./room-setup');
var EntityGen = require('./entity-gen');

var Floor = module.exports = function(lastFloor, tower, roles, filler){
  this.tower = tower;
  this.rng = tower.game.rng; // At some point I may want to include a seed
  this.rooms = [];
  this.roles = {};
  this.lastFloor = lastFloor;
  if(lastFloor) lastFloor.nextFloor = this;

  // generate the rooms
  this.generateRooms(lastFloor);

  this.unusedRooms = this.rooms
  .map(function(r){return r; })
  .sort(function(a, b){
    return b.depth - a.depth;
  });

  this.roles.Start = this.unusedRooms.pop(); // remove the start;
  this.applyRoles(roles, filler);
  EntityGen.call(this);
};

for(var name in roomProto){
  Floor.prototype[name] = roomProto[name];
}

for(name in EntityGen.prototype){
  Floor.prototype[name] = EntityGen.prototype[name];
}

Floor.prototype.constructor = Floor;

Floor.prototype.applyRoles = function(roles, filler){
  var l = roles.length;
  while(l-- && this.unusedRooms.length){
    this.applyRole(roles[l]);
  }

  l = this.unusedRooms.length;
  while(l--){
    filler(this.unusedRooms.pop());
  }
};

Floor.prototype.applyRole = function(role){
  var roomIndex = Math.floor(this.unusedRooms.length * Math.pow(this.rng(), 2));
  var room = this.unusedRooms.splice(roomIndex, 1)[0];
  room.setRole(role);
  this.roles[role.roleName] = room;
};

Floor.prototype.spawn = function(world){
  this.world = world;
  this.rooms.forEach(function(room){
    room.spawn(world);
  });

  this.entities.forEach(function(entity){
    entity.spawn(world);
  });
};

Floor.prototype.destroy = function(){
  var world = this.world;
  delete this.world;
  this.rooms.forEach(function(room){
    room.destroy(world);
  });

  this.entities.forEach(function(entity){
    entity.destroy(world);
  });
};

Floor.prototype.undoRole = function(Role){
  var roleName = Role.roleName;
  var rs = this.rooms;
  for(var i = 0; i < rs.length; i++){
    if(rs[i].roleName === roleName) return rs[i].undoRole();
  }
};
