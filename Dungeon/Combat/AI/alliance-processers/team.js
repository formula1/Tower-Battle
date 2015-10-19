'use strict';

var NI = Number.NEGATIVE_INFINITY;
var PI = Number.POSITIVE_INFINITY;

module.exports = function(self, other){
  var steam = self.team; var oteam = other.team;
  switch(steam){
    case NI: return self.emit('enemy', other);
    case PI: return self.emit('ally', other);
    case 0: return self.emit('neutral', other);
    case void 0: return self.emit('neutral', other);
    case oteam: return self.emit('ally', other);
  }
  switch(oteam){
    case NI: return self.emit('enemy', other);
    case PI: return self.emit('ally', other);
    case 0: return self.emit('neutral', other);
    case void 0: return self.emit('neutral', other);
  }
  return self.emit('enemy', other);
};
