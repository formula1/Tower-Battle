'use strict';

var Floor = require('./Floor');

var Tower = module.exports = function(numFloors, game, roles, filler){
  this.rng = game.rng;
  this.world = game.world;
  if(!roles){
    roles = [];
  }

  if(
    !roles.some(function(r){ return r.name === 'end'; })
  ){
    roles.end = require('./Room/Roles/end');
    roles.push(roles.end);
  }

  if(!filler){
    filler = function(){};
  }

  this.floors = this.createFloors(numFloors, roles, filler);
};

Tower.prototype.createFloors = function(numFloors, roles, filler){
  var lastFloor;
  var floors = [];
  for(var i = 0; i < numFloors; i++){
    var curFloor = new Floor(lastFloor, this, roles, filler);
    floors.push(curFloor);
    lastFloor = curFloor;
  }

  roles.end.undoFloor(lastFloor);
  return floors;
};

Tower.prototype.nextFloor = function(){
  if(this.currentFloor) this.currentFloor.destroy(this.world);
  this.currentFloor = this.currentFloor.nextFloor;
  this.currentFloor.spawn();
};

Tower.prototype.setFloor = function(num){
  if(this.currentFloor) this.currentFloor.destroy(this.world);
  this.currentFloor = this.floors[num];
  this.currentFloor.spawn();
};

Tower.prototype.getStart = function(){
  return this.currentFloor.roles.start.location;
};
