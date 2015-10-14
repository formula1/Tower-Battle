'use strict';

var PPEE = module.exports = function(){
  if(this._pp_events) return;
  this._pp_events = {};
};

PPEE.prototype.pre = function(event, fn){
  if(!(event in this._pp_events)) this._pp_events[event] = {pre: [], post: []};
  this._pp_events[event].pre.push(fn);
};

PPEE.prototype.unPre = function(event, fn){
  if(!(event in this._pp_events)) return;
  var pre = this._pp_events[event].pre;
  if(pre.length === 0) return;
  var i = pre.indexOf(fn);
  if(i === -1) return;
  pre.splice(i, 1);
};

PPEE.prototype.unPost = function(event, fn){
  if(!(event in this._pp_events)) return;
  var post = this._pp_events[event].post;
  if(post.length === 0) return;
  var i = post.indexOf(fn);
  if(i === -1) return;
  post.splice(i, 1);
};

PPEE.prototype.post = function(event, fn){
  if(!(event in this._pp_events)) this._pp_events[event] = {pre: [], post: []};
  this._pp_events[event].post.push(fn);
};

PPEE.prototype.run = function(event, arg, fn){
  if(!(event in this._pp_events)) return fn(arg);
  event = this._pp_events[event];
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
