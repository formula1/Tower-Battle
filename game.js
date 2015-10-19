'use strict';

require('./Helpers/Override');
require('setimmediate');
var EE = require('events').EventEmitter;
var Random = require('mersenne-twister');
var Tower = require('./Dungeon/Tower');
var Player = require('./Player');
var Camera = require('./General/Camera');
var contactListener = require('./General/Collision/ContactListener');

var assets = require('./Assets');

console.log(assets);

var B2d = require('Box2D');
var Vec2 = B2d.b2Vec2;
var World = B2d.b2World;

var Game = module.exports = function(seed, draw, controller, size){
  EE.call(this);
  this.timeListeners = [];
  this.nextTime = this.nextTime.bind(this);

  this.on('newListener', function(type){
    console.trace(type);
  });

  var r = new Random(seed);
  this.rng = r.random.bind(r);

  this.world = new World(new Vec2());
  this.world.SetContactListener(contactListener);
  this.draw = draw;
  this.camera = new Camera(draw.context, {
    max: 10, cur: size, min: .5
  }, .1, controller);
  this.world.SetDebugDraw(draw);

  this.tower = new Tower(this, 8, assets.Rooms);

  this.player = new Player(this, controller, {
    hp: 30,
    damageableRadius: 3,
    personalBubbleRadius: 10,
    runSpeed: 20,
    walkSpeed: 10
  });
};

Game.prototype = Object.create(EE.prototype);
Game.prototype.constructor = Game;

Game.prototype.loop = function(){
  var timeStep = 1.0 / 60.0;

  var l = this.timeListeners.length;
  while(l--) this.once('time', this.timeListeners.pop());
  this.emit('time', timeStep);
  var iterations = 10;
  this.world.Step(timeStep, iterations);
  this.render(timeStep);
  setImmediate(this.loop.bind(this));
};

Game.prototype.render = function(timeStep){
  this.draw.clear();
  this.camera.step(timeStep);
  this.world.DrawDebugData();
  this.draw.flush();
};

Game.prototype.start = function(){
  console.log('starting');
  this.tower.setFloor(0);
  this.player.spawn(this.world, this.tower.getStart());
  this.camera.follow(this.player.body);
  console.log('spawned');
  setImmediate(this.loop.bind(this));
};

Game.prototype.nextTime = function(fn){
  this.timeListeners.push(fn);
};
