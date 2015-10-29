'use strict';

var B2d = require('Box2D');
var FixDef = B2d.b2FixtureDef;
var CircleShape = B2d.b2CircleShape;
var PolygonShape = B2d.b2PolygonShape;
var Vec2 = B2d.b2Vec2;

var tVec = new Vec2();

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

module.exports.fromConfig = function(fixConfig){
  var fix;
  if(fixConfig.position){
    tVec.set(fixConfig.position.x, fixConfig.position.y);
  }else{
    tVec.set(0, 0);
  }

  switch(fixConfig.type.toLowerCase()){
    case 'circle':
      fix = this.circle(fixConfig.radius || 1, tVec);
      break;
    case 'rectangle':
      fix = this.rect(
        fixConfig.dimension.x || 1,
        fixConfig.dimension.y || 1,
        tVec, 0
      );
      break;
  }
  fix.set_isSensor(!!fixConfig.sensor);
  fix.set_density(fixConfig.density || 1);

  return fix;
};
