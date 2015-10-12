'use strict';

var PPEE = module.exports = function(){
  this._events = {};
};

PPEE.prototype.pre = function(event, fn){
  if(!(event in this._events)) this._events[event] = {pre: [], post: []};
  this._events[event].pre.push(fn);
};

PPEE.prototype.post = function(event, fn){
  if(!(event in this._events)) this._events[event] = {pre: [], post: []};
  this._events[event].post.push(fn);
};

PPEE.prototype.run = function(event, arg, fn){
  if(!(event in this._events)) return fn(arg);
  event = this._events[event];
  var pre = event.pre;
  var i, l;
  var val = arg;
  for(i = 0, l = pre.length; i < l; i++){
    val = pre[i](val);
  }
  var ret = fn(val);
  var post = event.post;
  for(i = 0, l = post.length; i < l; i++){
    ret = post[i](val, ret);
  }
  return ret;
};
