'use strict';

var Floor = require('./Floor');

var Tower = module.exports = function(game, numFloors, roles, filler){
  this.game = game;
  this.world = game.world;
  game.tower = this;
  if(!roles){
    roles = {};
  }

  if(!roles.End){
    roles.End = require('./Room/Roles/end');
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

  lastFloor.undoRole(roles.End);
  return floors;
};

Tower.prototype.nextFloor = function(){
  var oldFloor = this.currentFloor;
  this.currentFloor = oldFloor.nextFloor;
  oldFloor.destroy(this.world);
  this.currentFloor.spawn(this.world);
};

Tower.prototype.setFloor = function(num){
  if(this.currentFloor) this.currentFloor.destroy(this.world);
  this.currentFloor = this.floors[num];
  this.currentFloor.spawn(this.world);
};

Tower.prototype.getStart = function(){
  return this.currentFloor.roles.Start.getLocation();
};
