'use strict';

var Vec2 = global.Box2D.b2Vec2;

Vec2.prototype.clone = function(){
  return new Vec2(this.get_x(), this.get_y());
};

Vec2.prototype.set = function(x, y){
  if(y === void 0){
    if(typeof x === 'object'){
      y = x.get_y();
      x = x.get_x();
    }else{
      y = x;
    }
  }

  this.Set(x, y);
  return this;
};

Vec2.prototype.add = function(x, y){
  if(y === void 0){
    if(typeof x === 'object'){
      y = x.get_y();
      x = x.get_x();
    }else{
      y = x;
    }
  }

  this.Set(this.get_x() + x, this.get_y() + y);
  return this;
};

Vec2.prototype.sub = function(x, y){
  if(y === void 0){
    if(typeof x === 'object'){
      y = x.get_y();
      x = x.get_x();
    }else{
      y = x;
    }
  }

  this.Set(this.get_x() - x, this.get_y() - y);
  return this;
};

Vec2.prototype.mul = function(x, y){
  if(y === void 0){
    if(typeof x === 'object'){
      y = x.get_y();
      x = x.get_x();
    }else{
      y = x;
    }
  }

  this.Set(this.get_x() * x, this.get_y() * y);
  return this;
};
