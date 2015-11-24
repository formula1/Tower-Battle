
var Tile = require('./index');
var Box2D = require('Box2D');
var BodyDef = Box2D.BodyDef;
var MouseJointDef = Box2D

var ParsedTile;

module.exports = ParsedTile = function(room, config){
  Tile.call(this, room);
  this.config = config;
  this.isDestroyed = false;
};

ParsedTile.prototype.createAtLocation = function(){
  if(this.isDestroyed) return;
  var bd = new BodyDef();
};
