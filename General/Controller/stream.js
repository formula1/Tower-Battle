'use strict';

var EE = require('events').EventEmitter;
var Vec2 = global.Box2D.b2Vec2;

var Stream = module.exports = function(stream){
  EE.call(this);
  this.vec2 = new Vec2();
  stream.on('data',function(data){
    data.toString('utf8').split('').forEach(function(c){
      switch(c){
        case 'a': return this.move(-1, 0);
        case 's': return this.move(0, -1);
        case 'd': return this.move(1, 0);
        case 'w': return this.move(0, 1);
        case 'p': return this.run(true);
        case 'l': return this.attack(true);
      }
      switch(c.charCodeAt(0)){
        case 38: return this.zoomIn();
        case 40: return this.zoomOut();
      }
    });
  });
};

Stream.prototype = Object.create(EE.prototype);
Stream.prototype.constructor = Stream;

Stream.prototype.zoomIn = function(){
  this.emit('zoom', 1);
};

Stream.prototype.zoomOut = function(){
  this.emit('zoom', -1);
};

Stream.prototype.move = function(x, y){
  if(Math.abs(this.vec2.x + x) > 1) return;
  if(Math.abs(this.vec2.y + y) > 1) return;
  this.vec2.add(x, y);
  this.emit('change-direction', this.vec2);
};

Stream.prototype.run = function(boo){
  this.emit('run', boo);
};

Stream.prototype.attack = function(boo){
  if(boo) return this.emit('attack',boo);
};
