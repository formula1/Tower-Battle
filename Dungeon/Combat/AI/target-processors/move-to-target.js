'use strict';

var Vec2 = require('Box2D').b2Vec2;
var b2Body = require('Box2D').b2Body;
var Entity = require('../../../Entity');

module.exports = function(minion){
  var game = minion.game;
  var controller = minion.controller;
  var currentDir = new Vec2();
  var currentTarget = void 0;
  var isPersistant = false;
  var onTime = function(){
    if(currentTarget === void 0) return;
    var worldCenter = minion.body.GetWorldCenter();
    if(!isPersistant && currentTarget.equals(worldCenter)){
      currentTarget = void 0;
      return;
    }

    currentDir.set(currentTarget);
    controller.emit('change-direction',
      minion.run('movement-target', currentDir, function(dir){
        dir.sub(worldCenter).Normalize();
        return dir;
      })
    );
  };

  var resetTarget = function(){
    currentTarget = void 0;
  };

  minion.on('spawn', game.on.bind(game, 'time', onTime));
  minion.on('destroy', function(){
    resetTarget();
    game.removeListener('time', onTime);
  });

  return function(unknown, persistant){
    isPersistant = persistant;
    if(unknown instanceof b2Body){
      currentTarget = unknown.body.GetWorldCenter();
      return;
    }

    if(unknown instanceof Entity){
      currentTarget = unknown.body.GetWorldCenter();
      unknown.once('destroy', resetTarget);
      return;
    }

    if(unknown instanceof Vec2){
      currentTarget = Vec2;
      return;
    }
  };
};
