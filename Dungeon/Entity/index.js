'use strict';

var B2d = require('Box2D');
var Vec2 = B2d.b2Vec2;
var BodyDef = B2d.b2BodyDef;
var ContactEmitter = require('../../General/Collision/ContactEmitter');

var Entity = module.exports = function(game, position){
  ContactEmitter.call(this);
  if(this.game && this.position && this.rng) return;
  if(!game) throw new Error('Need A Game Instance');
  this.position = position?position.clone():new Vec2();
  this.game = game;
  this.rng = game.rng;
};

Entity.prototype = Object.create(ContactEmitter.prototype);
Entity.prototype.constructor = Entity;

Entity.prototype.spawn = function(world, position){
  this.world = world;
  if(position) this.position.set(position);
  var bodyDef = new BodyDef();
  bodyDef.set_type(B2d.b2_dynamicBody);
  bodyDef.set_position(this.position);
  bodyDef.set_fixedRotation(false);
  this.emit('bodyDef', bodyDef);
  var body = this.body = world.CreateBody(bodyDef);
  body.entity = this;
  this.emit('body', body);
  body.SetFixedRotation(false);
  console.log('fixed: ', body.IsFixedRotation());
  this.emit('spawn', this);
};

Entity.prototype.destroy = function(world){
  this.emit('pre-destroy', this);
  world = this.world;
  this.position.set(this.body.GetWorldCenter());
  this.removeContact(this.body);
  world.DestroyBody(this.body);
  delete this.body;
  this.emit('destroy', this);
};
