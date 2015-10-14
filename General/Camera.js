'use strict';

var Camera = module.exports = function(ctx, dimensions, padding, controller){
  this.ctx = ctx;
  this.cur = dimensions.cur;
  this.min = {
    x: dimensions.cur.x * dimensions.min,
    y: dimensions.cur.y * dimensions.min
  };

  this.max = {
    x: dimensions.cur.x * dimensions.max,
    y: dimensions.cur.y * dimensions.max
  };

  this.padding = {
    x: dimensions.cur.x * padding,
    y: dimensions.cur.y * padding
  };

  this.lastPos = {x: 0, y: 0};
  this.lastDim = this.dim = {x: this.cur.x, y: this.cur.y};
  this.netScale = {x: 1, y: 1};
  ctx.translate(-this.cur.x / 2, -this.cur.y / 2);
  ctx.scale(1, -1);

  this.following = [];
  this.targets = [];
  if(controller){
    controller.on('zoom', function(io){
      this.padding.x += this.padding.x * io / 2;
      this.padding.y += this.padding.y * io / 2;
    }.bind(this));
  }
};

Camera.prototype.moveTo = function(x, y){
  this.ctx.translate(-x, -y);
  this.lastPos = {x: x, y: y};
};

Camera.prototype.setSize = function(x, y){
  var scale = {
    x: this.cur.x / x,
    y: this.cur.y / y
  };
  this.ctx.scale(scale.x, scale.y);
  this.lastDim = {x: x, y: y};
};

Camera.prototype.rotate = function(angle){
  this.ctx.rotate(angle);
};

Camera.prototype.step = function(timeStep){
  var padding = this.padding;

  var dims = {
    max: {
      x: Number.NEGATIVE_INFINITY,
      y: Number.NEGATIVE_INFINITY
    },
    min: {
      x: Number.POSITIVE_INFINITY,
      y: Number.POSITIVE_INFINITY
    }
  };

  this.following.forEach(function(body){
    var center = body.GetWorldCenter();
    dims.max.x = Math.max(dims.max.x, center.get_x() + padding.x);
    dims.max.y = Math.max(dims.max.y, center.get_y() + padding.y);
    dims.min.x = Math.min(dims.min.x, center.get_x() - padding.x);
    dims.min.y = Math.min(dims.min.y, center.get_y() - padding.y);
  });

  this.targets.forEach(function(target){
    var net = Math.min(1, timeStep / target.time);
    var pos;
    if(target.desiredPosition){
      target.currentPosition.x += net * (
        target.desiredPosition.x -
        target.currentPosition.x
      );
      target.currentPosition.y += net * (
        target.desiredPosition.y -
        target.currentPosition.y
      );
      pos = target.currentPosition;
    }else{
      pos = this.currentPosition;
    }

    var dim;
    if(target.desiredDim){
      target.currentDim.x += net * (target.desiredDim.x - target.currentDim.x);
      target.currentDim.y += net * (target.desiredDim.y - target.currentDim.y);
      dim = target.currentDim;
    }else{
      dim = this.currentPosition;
    }

    target.time = Math.max(0, target.time - timeStep);

    dims.max.x = Math.max(dims.x, pos.x + dim.x / 2);
    dims.max.y = Math.max(dims.y, pos.y + dim.y / 2);
    dims.min.x = Math.min(dims.x, pos.x - dim.x / 2);
    dims.min.y = Math.min(dims.y, pos.y - dim.y / 2);
  });

  var newDim = {
    x: Math.min(this.max.x, Math.max(this.min.x, dims.max.x - dims.min.x)),
    y: Math.min(this.max.y, Math.max(this.min.y, dims.max.y - dims.min.y))
  };
  var newMid = {
    x: (dims.max.x + dims.min.x) / 2,
    y: (dims.max.y + dims.min.y) / 2
  };
  if(
    newMid.x === this.lastPos.x &&
    newMid.y === this.lastPos.y &&
    newDim.x === this.lastDim.x &&
    newDim.y === this.lastDim.y
  ) return;

  this.ctx.setTransform(1, 0, 0, -1, this.cur.x / 2, this.cur.y / 2);

  // this.ctx.beginPath();
  // this.ctx.arc(0,0,20,0,Math.PI*2);
  // this.ctx.fillStyle = 'orange';
  // this.ctx.fill();

  this.setSize(newDim.x, newDim.y);
  this.moveTo(newMid.x, newMid.y);

};

Camera.prototype.follow = function(body){
  if(this.following.indexOf(body) !== -1)
    throw new Error('already following this body');
  this.following.push(body);
};

Camera.prototype.unfollow = function(body){
  var i = this.following.indexOf(body);
  if(i === -1) throw new Error('Not following this body anymore');
  this.following.splice(i, 1);
};

Camera.prototype.goToTarget = function(position, padding, time){
  if(!time) throw new Error('cannot resolve a transform over zero time');

  this.targets.push({
    currentPosition: this.lastPos,
    currentDim: this.lastDim,
    desiredPosition: position,
    desiredDim: padding,
    time: time
  });
};
