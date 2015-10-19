'use strict';

var NI = Number.NEGATIVE_INFINITY;
var PI = Number.POSITIVE_INFINITY;

module.exports.processEntity = function(self, other){
  var steam = self.team; var oteam = other.team;
  switch(steam){
    case NI: return this.emit('enemy', other);
    case PI: return this.emit('ally', other);
    case 0: return this.emit('neutral', other);
    case oteam: return this.emit('ally', other);
  }
  switch(oteam){
    case NI: return this.emit('enemy', other);
    case PI: return this.emit('ally', other);
    case 0: return this.emit('neutral', other);
  }
  return this.emit('enemy', other);
};

/*
  Overlord System
  - Overlords are allied with all underlings
  - underlings are neutral with other underlings
  - underlings are allied with Overlords

*/
