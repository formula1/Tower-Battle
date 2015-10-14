'use strict';

var Box2D = require('Box2D');
var DebugDraw = Box2D.JSDraw;
var Vec2 = Box2D.b2Vec2;
var proto = {};

var tempV = new Vec2();
var tempV2 = new Vec2();

module.exports = function(context, width, height){
  var dd = new DebugDraw();
  for(var i in proto){
    dd[i] = proto[i];
  }

  dd.width = width;
  dd.height = height;
  dd.context = context;
  return dd;
};

proto.flush = function(){
  if(this.context._canvas) this.context._canvas.frame();
};

proto.setColorFromDebugDrawCallback = function(color){
  var context = this.context;
  var col = Box2D.wrapPointer(color, Box2D.b2Color);
  var red = (col.get_r() * 255) | 0;
  var green = (col.get_g() * 255) | 0;
  var blue = (col.get_b() * 255) | 0;
  var colStr = red + ',' + green + ',' + blue;
  context.fillStyle = 'rgba(' + colStr + ',0.5)';
  context.strokeStyle = 'rgb(' + colStr + ')';
};

proto.DrawSegment = function(vert1, vert2, color){
  var context = this.context;
  this.setColorFromDebugDrawCallback(color);
  var vert1V = Box2D.wrapPointer(vert1, Box2D.b2Vec2);
  var vert2V = Box2D.wrapPointer(vert2, Box2D.b2Vec2);
  context.beginPath();
  context.moveTo(vert1V.get_x(), vert1V.get_y());
  context.lineTo(vert2V.get_x(), vert2V.get_y());
  context.stroke();
};

proto.DrawPolygon = function(vertices, vertexCount, color){
  this.setColorFromDebugDrawCallback(color);
  this.polygon(vertices, vertexCount, false);
};

proto.DrawSolidPolygon = function(vertices, vertexCount, color){
  this.setColorFromDebugDrawCallback(color);
  this.polygon(vertices, vertexCount, true);
};

proto.polygon = function(vertices, vertexCount, fill){
  var context = this.context;
  context.beginPath();
  for(var tmpI = 0; tmpI < vertexCount; tmpI++){
    var vert = Box2D.wrapPointer(vertices + (tmpI * 8), Box2D.b2Vec2);
    if(tmpI === 0)
        context.moveTo(vert.get_x(), vert.get_y());
    else
        context.lineTo(vert.get_x(), vert.get_y());
  }

  context.closePath();
  if(fill) context.fill();
  context.stroke();
};

proto.DrawCircle = function(center, radius, color){
  this.setColorFromDebugDrawCallback(color);
  var dummyAxis = Box2D.b2Vec2(0, 0);
  this.circle(center, radius, dummyAxis, false);
};

proto.DrawSolidCircle = function(center, radius, axis, color){
  this.setColorFromDebugDrawCallback(color);
  this.circle(center, radius, axis, true);
};

proto.circle = function drawCircle(center, radius, axis, fill){
  var context = this.context;
  var centerV = Box2D.wrapPointer(center, Box2D.b2Vec2);
  var axisV = Box2D.wrapPointer(axis, Box2D.b2Vec2);

  context.beginPath();
  context.arc(centerV.get_x(), centerV.get_y(), radius, 0, 2 * Math.PI, false);
  if(fill) context.fill();
  context.stroke();

  if(fill){
    //render axis marker
    tempV.set(centerV).op_add(
       tempV2.set(axisV).mul(radius)
    );
    context.beginPath();
    context.moveTo(centerV.get_x(), centerV.get_y());
    context.lineTo(tempV.get_x(), tempV.get_y());
    context.stroke();
  }
};

proto.DrawTransform = function(transform){
  var context = this.context;
  var trans = Box2D.wrapPointer(transform, Box2D.b2Transform);
  var pos = trans.get_p();
  var rot = trans.get_q();

  context.save();
  context.translate(pos.get_x(), pos.get_y());
  context.rotate(rot.GetAngle());
  context.lineWidth *= 2;
  this.axis();
  context.restore();
};

proto.axis = function(){
  var context = this.context;
  context.strokeStyle = 'rgb(192,0,0)';
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(1, 0);
  context.stroke();
  context.strokeStyle = 'rgb(0,192,0)';
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 1);
  context.stroke();
};

proto.clear = function(){
  var context = this.context;

  // Store the current transformation matrix
  context.save();

  // Use the identity matrix while clearing the canvas
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, this.width, this.height);

  // Restore the transform
  context.restore();
};
