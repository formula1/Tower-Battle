/* eslint-env browser, node */

'use strict';

var EE = require('events').EventEmitter;
var Vec2 = require('Box2D').b2Vec2;

var KeyBoard = module.exports = function(keyboard){
  EE.call(this);
  this.isOn = {
    A: false,
    S: false,
    D: false,
    W: false,
    P: false,
    L: false,
    38: false,
    40: false
  };

  this.vec2 = new Vec2();
  keyboard.addEventListener('keydown', function(e){
    var k = e.keyCode;
    var s = String.fromCharCode(e.keyCode);
    if(!(s in this.isOn)){
      if(!(k in this.isOn)) return;
      if(this.isOn[k]) return;
      this.isOn[k] = true;
      switch(k){
        case 38: this.zoomIn(); return;
        case 40: this.zoomOut(); return;
      }
    }

    if(this.isOn[s]) return;
    this.isOn[s] = true;
    switch(s){
      case 'A': this.move(-1, 0); return;
      case 'S': this.move(0, -1); return;
      case 'D': this.move(1, 0); return;
      case 'W': this.move(0, 1); return;
      case 'P': this.run(true); return;
      case 'L': this.attack(true); return;
    }
  }.bind(this));
  keyboard.addEventListener('keyup', function(e){
    var s = String.fromCharCode(e.keyCode);
    if(!(s in this.isOn)) return;
    this.isOn[s] = false;
    switch(s){
      case 'A': this.move(1, 0); return;
      case 'S': this.move(0, 1); return;
      case 'D': this.move(-1, 0); return;
      case 'W': this.move(0, -1); return;
      case 'P': this.run(false); return;
      case 'L': this.attack(false); return;
    }
  }.bind(this));
};

KeyBoard.prototype = Object.create(EE.prototype);
KeyBoard.prototype.constructor = KeyBoard;

KeyBoard.prototype.move = function(x, y){
  this.vec2.add(x, y);
  this.emit('change-direction', this.vec2);
};

KeyBoard.prototype.run = function(boo){
  this.emit('run', boo);
};

KeyBoard.prototype.zoomIn = function(){
  this.emit('zoom', 1);
};

KeyBoard.prototype.zoomOut = function(){
  this.emit('zoom', -1);
};

KeyBoard.prototype.attack = function(boo){
  if(boo) return this.emit('attack', boo);
};

KeyBoard.findKeyBoard = function(){
  return [document.body];
};
