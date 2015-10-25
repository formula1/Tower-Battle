'use strict';

var B2d = require('Box2D');

var Vec2 = B2d.b2Vec2;
var BodyDef = B2d.b2BodyDef;

var FixtureHelper = require('../../../Helpers/box2d/Fixture');

var proto = module.exports;

proto.getLocation = function(){
  return new Vec2(this.location.x, this.location.y)
    .mul(this.floor.scale * 2);
};

proto.spawn = function(world){
  var scale = this.floor.scale;
  this.position = new Vec2(this.location.x, this.location.y);
  this.position.mul(scale * 2);

  var bodyDef = new BodyDef();
  bodyDef.set_position(this.position);
  bodyDef.set_type(B2d.b2_staticBody);
  this.body = world.CreateBody(bodyDef);
  this.body.SetUserData(this);
  this.iterateAdjacents(function(adj, xy, dir){
    dir = parseInt(dir);
    if(!adj) return this.createWall(xy, dir, scale);
    this.createDoor(xy, dir, scale);
  }.bind(this));
  this.emit('spawn', this);
};

proto.destroy = function(world){
  this.removeContact(this.body);
  world.DestroyBody(this.body);
  this.emit('destroy', this);
};

proto.createWall = function(xy, dir, scale){
  var pos = new Vec2();
  var w, h;
  if(xy === 'x'){
    pos.Set(dir * (scale - 1), 0);
    w = 1; h = scale;
  }else{
    pos.Set(0, dir * (scale - 1));
    w = scale; h = 1;
  }

  this.body.CreateFixture(FixtureHelper.rect(w, h, pos, 0));
};

proto.createDoor = function(xy, dir, scale){
  var posAri = [];
  var offset = scale / 6;
  var w, h;

  if(xy === 'x'){
    var x = dir * (scale - 1);
    posAri.push(new Vec2(x, offset - scale));
    posAri.push(new Vec2(x, scale - offset));
    w = 1; h = scale / 3;
  }else{
    var y = dir * (scale - 1);
    posAri.push(new Vec2(offset - scale, y));
    posAri.push(new Vec2(scale - offset, y));
    w = scale / 3; h = 1;
  }

  var body = this.body;
  posAri.forEach(function(pos){
    body.CreateFixture(FixtureHelper.rect(w, h, pos, 0));
  });
};
