'use strict';

module.exports = {
  Rooms: {
    ExampleDroppableRoom: require('./Rooms/ExampleDroppableRoom'),
    ExampleMinionRoom: require('./Rooms/ExampleMinionRoom')
  },
  Weapons: {
    BasicSensor: require('./Weapons/BasicSensor.js'),
    Hammer: require('./Weapons/Hammer.js')
  },
  Armor: {
    BasicMinus: require('./Armor/BasicMinus.js')
  }
};
