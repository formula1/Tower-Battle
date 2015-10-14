
/*
  The Purpose of this is to allow a body to not have a physical form that
  effects combat nor anything else but still be hitable
*/

var Vec2 = global.B2D.b2Vec2;

var FixtureHelper = require('./Fixture');
module.exports.gravityBody = function(game, listener, body, radius){
  var circle = FixtureHelper.circle(radius);
  circle.set_isSensor(true);
  var grav = body.CreateFixture(circle);

  var netImpulse = new Vec2();
  var contacts = [];
  game.on('time', function(){
    netImpulse.set(0, 0);
    for(var i = 0, l = contacts.length; i < l; i++){
      var contact = contacts[i];
      var manifold = contact.GetManifold();
      var isFixA = contact.GetFixtureA() === grav;
      var point = manifold.get_localPoint().clone().mul(isFixA?1:-1);
    }

  });

  listener.addContactStart(grav, function(fix, contact, ofix){
    if(ofix.IsSensor()) return;
    contacts.push(contact);
  });

};
