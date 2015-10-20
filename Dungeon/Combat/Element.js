'use strict';

module.exports.scaleDamage = function(armor, damage){
  if(damage.element === armor.element) return damage;
  if(!damage.element){
    damage.value *= 0.75;
    return damage;
  }

  if(!armor.element){
    damage.value *= 1.25;
    return damage;
  }

  var te = armor.element, ae = damage.element;
  /*
  1 > 2 > 3 > 1
  2 - 1 = (1 + 3)%3 = 1
  3 - 2 = (1 + 3)%3 = 1
  1 - 3 = (-2 + 3)%3 = 1

  1 - 2 = (-1 + 3)%3 = 2
  3 - 2 = (-1 + 3)%3 = 2
  3 - 1 = (2 + 3)%3 = 2
  */
  var cmpr = (te - ae + 3) % 3;
  var scalar = cmpr === 0?1:cmpr === 1?2:cmpr === 2?0.5:0;
  damage.value *= scalar;
  return damage;
};
