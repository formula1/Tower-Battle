'use strict';
var Box2D = require('Box2D');
var b2Filter = Box2D.b2Filter;
var b2Body = Box2D.b2Body;
var b2Fixture = Box2D.b2Fixture;

var GROUP_COUNTER = 1;

module.exports.resetCollidable = function(v){
  if(v instanceof b2Fixture){
    if(!v.lastFilterValue && !v.lastGroupValue) return;
    var fdata = v.GetFilterData();
    if(v.lastFilterValue !== void 0) fdata.set_maskBits(v.lastFilterValue);
    if(v.lastGroupValue !== void 0) fdata.set_groupIndex(v.lastGroupValue);
    v.SetFilterData(fdata);
    return;
  }

  if(v instanceof b2Body){
    var fix = v.GetFixtureList();
    while(fix.ptr){
      this.resetCollidable(fix);
      fix = fix.GetNext();
    }
  }
};

module.exports.makeUncollidable = function(v){
  if(v instanceof b2Fixture){
    var fdata = v.GetFilterData();
    v.lastFilterValue = fdata.get_maskBits() || v.lastFilterValue;
    v.lastGroupValue = fdata.get_groupIndex() || v.lastGroupValue;
    fdata.set_maskBits(0);
    fdata.set_groupIndex(0);
    return;
  }

  if(v instanceof b2Body){
    var fix = v.GetFixtureList();
    while(fix.ptr){
      this.makeUncollidable(fix);
      fix = fix.GetNext();
    }
  }
};

module.exports.newGroup = function(bodies, collide){
  var currentGroup, i, l;
  for(i = 0, l = bodies.length; i < l; i++){
    if(!bodies[i].currentGroup) continue;
    if(currentGroup && currentGroup !== bodies[i].currentGroup){
      throw new Error(
        'We have two bodies with different groups ' +
        'changing those groups may produce undesirable results'
      );
    }

    if(collide && bodies[i].currentGroup < 1){
      throw new Error(
        'When a body already has a collidable/uncollidable group, ' +
        'setting it to the opposite may produce undesireable results'
      );
    }

    currentGroup = bodies[i].currentGroup;
  }

  if(!currentGroup){
    currentGroup = GROUP_COUNTER * (collide?1:-1);
    GROUP_COUNTER *= 2;
  }

  for(i = 0, l = bodies.length; i < l; i++){
    this.addToGroup(bodies[i], currentGroup);
  }

};

module.exports.addToGroup = function(v, group){
  if(v instanceof b2Fixture){
    var fdata = v.GetFilterData();
    fdata.set_groupIndex(group);
    v.SetFilterData(fdata);
    return;
  }

  if(v instanceof b2Body){
    var fix = v.GetFixtureList();
    while(fix.ptr){
      this.addToGroup(fix, group);
      fix = fix.GetNext();
    }

    v.currentGroup = group;
  }
};

module.exports.removeFromGroup = function(v, group){
  if(v instanceof b2Fixture){
    var fdata = v.GetFilterData();
    fdata.set_groupIndex(0);
    v.SetFilterData(fdata);
    return;
  }

  if(v instanceof b2Body){
    var fix = v.GetFixtureList();
    while(fix.ptr){
      this.removeFromGroup(fix);
      fix = fix.GetNext();
    }

    v.currentGroup = group;
  }
};

