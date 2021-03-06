'use strict';

var EntityGen = module.exports = function(){
  this.entities = [];
};

EntityGen.prototype.addEntity = function(entity, position){
  var i = this.entities.indexOf(entity);
  if(i > -1) throw new Error('this entity already exists on this floor');
  this.entities.push(entity);
  entity.position.set(position);
  if(this.world){
    entity.spawn(this.world);
  }
};

EntityGen.prototype.removeEntity = function(entity){
  var i = this.entities.indexOf(entity);
  if(i === -1) throw new Error('this entity doesn\'t exist on this floor');
  this.entities.splice(i, 1);
  if(this.world && entity.body){
    entity.destroy(this.world);
  }
};
