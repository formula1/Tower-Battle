

var Tile;

module.exports = Tile = function(room){
  this.room = room;
};

Tile.prototype.createAtLocation = function(world, position){
  throw new Error('createAtLocation is abstract and needs to be overridden');
};
