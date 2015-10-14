'use strict';
var EE = require('events').EventEmitter;
var Box2D = global.Box2D;
var b2Body = Box2D.b2Body;
var b2Fixture = Box2D.b2Fixture;

var ContactEmitter = module.exports = function(){
  if(this._events) return;
  EE.call(this);
};

ContactEmitter.prototype = Object.create(EE.prototype);
ContactEmitter.prototype.constructor = ContactEmitter;

ContactEmitter.prototype.onContactStart = function(entity, fn){
  this.appendContact(entity, fn, '-on');
};

ContactEmitter.prototype.onContactEnd = function(entity, fn){
  this.appendContact(entity, fn, '-off');
};

ContactEmitter.prototype.appendContact = function(entity, fn, onoff){
  if(typeof fn !== 'function')
    throw new Error('the second argument is expected to be a function');
  if(entity instanceof b2Body){
    var fix = entity.GetFixtureList();
    var ret = [];
    while(fix.ptr){
      ret.push(this.appendContact(fix, fn, onoff));
      fix = fix.GetNext();
    }

    return ret;
  }

  if(!(entity instanceof b2Fixture)){
    throw new Error('Can only listen to a body or a fixture');
  }

  if(!entity.collisionEmitter){
    entity.collisionEmitter = {
      uid: Date.now(),
      emitter: this
    };
  }

  return this.on(entity.collisionEmitter.uid + onoff, fn);
};

ContactEmitter.prototype.offContactStart = function(entity, fn){
  this.removeContact(entity, fn, '-on');
};

ContactEmitter.prototype.offContactEnd = function(entity, fn){
  this.removeContact(entity, fn, '-off');
};

ContactEmitter.prototype.removeContact = function(entity, fn, onoff){
  if(entity instanceof b2Body){
    var fix = entity.GetFixtureList();
    var ret = [];
    while(fix.ptr){
      ret.push(this.removeContact(fix, fn, onoff));
      fix = fix.GetNext();
    }

    return ret;
  }

  if(!(entity instanceof b2Fixture)){
    throw new Error('Can only listen to a body or a fixture');
  }

  if(!entity.collisionEmitter){ return void 0; }

  if(!onoff){
    this.removeAllListeners(entity.collisionEmitter.uid + 'on');
    return this.removeAllListeners(entity.collisionEmitter.uid + 'off');
  }

  if(!fn) return this.removeAllListeners(entity.collisionEmitter.uid + onoff);
  return this.removeListener(entity.collisionEmitter.uid + onoff, fn);
};

ContactEmitter.attemptContact = function(c){
  var contact = c.contact;
  var impulse = c.impulse;
  var sensor = c.isSensor;
  var fix = contact.GetFixtureA();
  var oFix = contact.GetFixtureB();

  var ev = (impulse || sensor)?'-on':'-off';

  if(fix.collisionEmitter){
    fix.collisionEmitter.emitter.emit(
      fix.collisionEmitter.uid + ev, fix, c, oFix
    );
  }

  if(oFix.collisionEmitter){
    oFix.collisionEmitter.emitter.emit(
      oFix.collisionEmitter.uid + ev, oFix, c, fix
    );
  }

};
