'use strict';

var FxH = require('../../../../Helpers/box2d/Fixture');
var TeamEmitter = require('../alliance-processers/team');

module.exports = function(minion, range){
  minion.on('body', function(body){
    var c = FxH.circle(range || 10);
    c.set_isSensor(true);
    var ear = body.CreateFixture(c);
    minion.onContactStart(ear, function(fix, contact, oFix){
      if(!oFix.collisionEmitter) return;
      var entity = oFix.collisionEmitter.emitter;
      if(!entity.isPlayer) return;
      TeamEmitter(minion, entity);
    });
  });
};
