'use strict';

var Role = module.exports = function(SubRole){
  if(!SubRole.roleName)
    throw new Error(
      'When creating a Role Class You need to provide a name'
    );
  this.roleName = SubRole.roleName;
  this.spawnRole = SubRole.prototype.spawnRole.bind(this);
  this.destroyRole = SubRole.prototype.destroyRole.bind(this);
  this.once('spawn', this.spawnRole);
  this.once('destroy', this.destroyRole);
  this.undoRole = SubRole.prototype.undoRole.bind(this);
};

Role.prototype.undoRole = function(){
  delete this.roleName;
  this.removeListener('spawn', this.spawnRole);
  this.removeListener('destroy', this.destroyRole);
  delete this.spawnRole;
  delete this.destroyRole;
  delete this.undoRole;
};

Role.prototype.spawnRole = function(){
  throw new Error('spawn is an abstract function and needs to be overridden');
};

Role.prototype.destroyRole = function(){
  throw new Error('destroy is an abstract function and needs to be overridden');
};
