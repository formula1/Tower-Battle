'use strict';

var ContactEmitter = require('./ContactEmitter');
var Box2D = global.Box2D;
var listener = module.exports = new Box2D.JSContactListener();

var curContacts = {};

listener.BeginContact = function(contact){
  var c = curContacts[contact] = {
    contact: Box2D.wrapPointer(contact, Box2D.b2Contact)
  };
  c.isSensor = (
    c.contact.GetFixtureA().IsSensor() ||
    c.contact.GetFixtureB().IsSensor()
  );

  if(c.isSensor) ContactEmitter.attemptContact(c);
};

listener.PreSolve = function(){};

listener.PostSolve = function(contact, impulse){
  var c = curContacts[contact];
  var oldImpulse = c.impulse;
  c.impulse = impulse;
  if(!oldImpulse) ContactEmitter.attemptContact(c);
};

listener.EndContact = function(contact, impulse){
  console.log(typeof contact, typeof impulse);
  var c = curContacts[contact];
  delete curContacts[contact];
  delete c.impulse;
  ContactEmitter.attemptContact(c);
};
