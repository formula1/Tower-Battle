'use strict';

var DIMS = ['x', 'y'];
var DIRS = [-1, 1];

var Room = require('../Room');

var prototype = module.exports = {};

prototype.generateRooms = function(lastFloor){
  this.generateStack = [];
  this.maxDepth = 10;
  this.maxRooms = 30;
  this.maxRoomLocation = {x: 10, y: 10};

  this.scale = 20;
  this.stackLength = 0;
  var start = lastFloor?lastFloor.roles.end.location:{x: 0, y: 0};
  console.log('start location', start);
  this.roles.start = this.createRoom(start);
  this.roles.start.name = 'start';
  while(this.stackLength){
    this.stackLength--;
    this.generateStack.pop()();
  }
};

prototype.createRoom = function(location){
  var newRoom = new Room(location, this);
  this.rooms.push(newRoom);

  // Add the next rooms to the stack
  if(newRoom.depth === this.maxDepth) return newRoom;
  newRoom.iterateAdjacents(function(room, dim, dir){
    if(room) return;
    var odim = dim === DIMS[0]?DIMS[1]:DIMS[0];
    var loc = {};
    loc[dim] = newRoom.location[dim];
    loc[odim] = newRoom.location[odim] + parseInt(dir);
    if(this.maxRoomLocation[odim] < loc[odim]) return;
    this.stackRoom(newRoom.depth + 1, loc);
  }.bind(this));
  return newRoom;

};

prototype.stackRoom = function(depth, loc){
  if(this.rooms.length === this.maxRooms) return;

  this.stackLength++;
  var r = Math.round(this.generateStack.length * this.rng());
  if(r === this.generateStack.length){
    this.generateStack.push(this.attemptRoom.bind(this, depth, loc));
  }else if(r === 0){
    this.generateStack.unshift(this.attemptRoom.bind(this, depth, loc));
  }else{
    this.generateStack.splice(r, 0, this.attemptRoom.bind(this, depth, loc));
  }
};

prototype.attemptRoom = function(depth, loc){
  if(this.hasRoomAt(loc)) return;

  // We want to weight this based on the number of rooms we can do
  // as room numbers increase, likelyhood decreases
  var r = (this.maxRooms - this.rooms.length);

  //As it moves outward, likelyhood decreases
  r *= (
    (this.maxRoomLocation.x - Math.abs(loc.x)) +
    (this.maxRoomLocation.y - Math.abs(loc.y))
  ) / 2;

  // If this is the last room that can happen, we also need to worry about that
  r /= (this.stackLength * this.stackLength + 1);

  if(this.rng() > r) return;

  var mindepth = Number.POSITIVE_INFINITY;
  var depths = this.getDepths(loc);
  var founddepths = [];
  for(var i = 0, l = depths.length; i < l; i++){
    var cur = depths[i];
    if(founddepths.indexOf(cur) > -1) return;
    if(cur - 1 === depth) return;
    founddepths.push(cur);
    mindepth = Math.min(mindepth, cur);
  }

  if(mindepth >= depth) return;
  this.createRoom(loc);
};

prototype.hasRoomAt = function(location){
  return this.rooms.some(function(room){
    return room.location.x === location.x && room.location.y === location.y;
  });
};

var checkAdjacent;
prototype.getDepths = function(rl){
  return this.rooms.filter(function(room){
    var ol = room.location;
    if(rl.x === ol.x){
      if(checkAdjacent(rl, ol, 'y')){
        return true;
      }
    }else if(rl.y === ol.y){
      if(checkAdjacent(rl, ol, 'x')){
        return true;
      }
    }

    return false;
  }).map(function(r){return r.depth; });
};

prototype.applyAdjacents = function(room){
  var rooms = this.rooms;
  var l = rooms.length;
  var rl = room.location;
  var dir;
  while(l--){
    if(rooms[l] === room) continue;
    var ol = rooms[l].location;

    // If they are on the same x axis, maybe we have north or south
    if(ol.y === rl.y && ol.x === rl.x){
      throw new Error('We should never have two rooms with same x, y');
    }

    if(rl.x === ol.x){
      dir = checkAdjacent(rl, ol, 'y');
      if(dir){
        room.setAdjacent('y', dir, rooms[l]);
      }
    }else if(rl.y === ol.y){
      dir = checkAdjacent(rl, ol, 'x');
      if(dir){
        room.setAdjacent('x', dir, rooms[l]);
      }
    }
  }
};

checkAdjacent = function(rl, ol, xy){
  var ll = DIRS.length;
  while(ll--){
    if(ol[xy] === rl[xy] + DIRS[ll]){
      return DIRS[ll];
    }
  }

  return false;
};
