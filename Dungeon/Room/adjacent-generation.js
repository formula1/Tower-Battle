'use strict';

var DIMS = ['x', 'y'];
var DIRS = ['-1', '1'];

var AdjacentGen = module.exports = function(location, floor){
  this.id = Math.random();
  this.location = {x: location.x || 0, y: location.y || 0};
  this.depth = Math.POSITIVE_INFINITY;
  this.floor = floor;
  this.adjacent = {
    y: {'-1': void 0, '1': void 0},
    x: {'-1': void 0, '1': void 0},
    length: 0
  };

  floor.applyAdjacents(this);
  if(this.depth === Math.POSITIVE_INFINITY){
    this.depth = 0;
  }
};

AdjacentGen.prototype.setDepth = function(newDepth){
  if(this.depth <= newDepth) return;
  this.depth = newDepth;
  this.iterateAdjacents(function(room){
    if(room) room.setDepth(newDepth + 1);
  });
};

AdjacentGen.prototype.setAdjacent = function(xy, dir, room){
  if(this.adjacent[xy][dir]){
    if(room === this.adjacent[xy][dir]) return;
    throw new Error('There are two different rooms at duplicate locations');
  }

  this.adjacent[xy][dir] = room;
  this.setDepth(room.depth + 1);
  this.adjacent.length++;
  room.setAdjacent(xy, dir * -1, this);
};

AdjacentGen.prototype.remove = function(){
  this.iterateAdjacents(function(room, dim, dir){
    if(room) room.removeAdjacent(dim, dir * -1);
  });

  this.floor.rooms.splice(this.floor.rooms.indexOf(this), 1);
};

AdjacentGen.prototype.removeAdjacent = function(dim, dir){
  var oldRoom = this.adjacent[dim][dir];
  delete this.adjacent[dim][dir];
  this.adjacent.length--;
  if(oldRoom.depth > this.depth){
    return;
  }

  var min = Number.POSITIVE_INFINITY;
  this.iterateAdjacents(function(room){
    if(room) min = Math.min(room.depth, min);
  });

  if(min > this.depth){
    throw new Error('This room is unreachable');
  }

  if(min < oldRoom.depth){
    throw new Error('This room depth should be the minimums depth + 1');
  }

  if(min === oldRoom.depth) return;
  this.depth = Number.POSITIVE_INFINITY;
  this.setDepth(min + 1);
};

AdjacentGen.prototype.iterateAdjacents = function(fn){
  var adj = this.adjacent;
  var l = DIMS.length;
  while(l--){
    var dim = DIMS[l];
    var ll = DIRS.length;
    while(ll--){
      var dir = DIRS[ll];
      fn(adj[dim][dir], dim, dir);
    }
  }
};
