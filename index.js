/* eslint-env browser, node */

'use strict';

var Game = require('./game');
var Draw = require('./General/Draw');
var Keyboard;
var keyboard;
var readyListener;
if (process.env.TARGET_ENV === 'browser'){
  readyListener = window.addEventListener.bind(window, 'load');
  Keyboard = require('./General/Controller/keyboard');
  keyboard = new Keyboard(window);
}else{
  readyListener = setImmediate;
  Keyboard = require('./General/Controller/stream');
  keyboard = new Keyboard(process.stdin);
}

var e_shapeBit = 0x0001;
var e_jointBit = 0x0002;

// var e_aabbBit = 0x0004;
// var e_pairBit = 0x0008;
var e_centerOfMassBit = 0x0010;

readyListener(function(){
  var ctx;
  var h, w;
  if (process.env.TARGET_ENV === 'browser'){
    var canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    w = parseInt(window.getComputedStyle(canvas).width.substring(-2));
    h = parseInt(window.getComputedStyle(canvas).height.substring(-2));
  }else{
    w = 100; h = 100;
    ctx = require('./General/LoggerContext');
  }

  var draw = Draw(ctx, w, h);
  var flags = 0;
  flags |= e_shapeBit;
  flags |= e_jointBit;

  //  flags |= e_aabbBit;
  //	flags |= e_pairBit;
  flags |= e_centerOfMassBit;
  draw.SetFlags(flags);

  var game = new Game(1234, draw, keyboard, {x: w, y: h});

  game.start();
});
