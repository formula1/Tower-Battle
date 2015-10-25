

var Tile = module.exports = function(){

};

Tile.prototype.createAtLocation = function(position){
  throw new Error('createAtLocation is abstract and needs to be overridden');
};