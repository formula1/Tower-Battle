'use strict';

var roomProto = require('./room-setup');

var Floor = module.exports = function(lastFloor, tower, roles, filler){
  this.tower = tower;
  this.world = tower.world;
  this.rng = tower.rng; // At some point I may want to include a seed
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

  this.roles.start = this.unusedRooms.pop(); // remove the start;
  this.applyRoles(roles, filler);
};

for(var i in roomProto){
  Floor.prototype[i] = roomProto[i];
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

Floor.prototype.spawn = function(){
  var world = this.world;
  this.rooms.forEach(function(room){
    room.spawn(world);
  });
};

Floor.prototype.destroy = function(world){
  this.rooms.forEach(function(room){
    room.destroy(world);
  });
};
