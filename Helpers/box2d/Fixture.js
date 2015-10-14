'use strict';

var B2d = require('Box2D');
var FixDef = B2d.b2FixtureDef;
var CircleShape = B2d.b2CircleShape;
var PolygonShape = B2d.b2PolygonShape;

module.exports.circle = function(r, offset){
  var ret = new CircleShape();
  ret.set_m_radius(r);
  if(offset) ret.set_m_p(offset);
  return this.createFixture(ret);
};

module.exports.rect = function(){
  var ret = new PolygonShape();
  ret.SetAsBox.apply(ret, arguments);
  return this.createFixture(ret);
};

module.exports.polygon = function(){

};

module.exports.createFixture = function(shape){
  var ret = new FixDef();
  ret.set_shape(shape);
  ret.set_friction(0.3);
  return ret;
};
