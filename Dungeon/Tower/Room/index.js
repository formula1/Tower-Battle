'use strict';

var ContactEmitter = require('../../../General/Collision/ContactEmitter');
var AdjGen = require('./adjacent-generation');

var Room = module.exports = function(location, floor){
  if(!location) throw new Error('Rooms require a location');
  ContactEmitter.call(this);
  AdjGen.call(this, location, floor);
};

Room.prototype = Object.create(ContactEmitter.prototype);
Room.prototype.constructor = Room;

Room.prototype.setRole = function(role){
  role.call(this);
};

for(var i in AdjGen.prototype){
  Room.prototype[i] = AdjGen.prototype[i];
}

var box2d = require('./box2d');

for(i in box2d){
  Room.prototype[i] = box2d[i];
}
