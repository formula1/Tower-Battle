'use strict';

module.exports = function(tilemap, tileDictionary){
  var _this = this;
  tilemap.split('').forEach(function(char, index){
    switch(char){
      case '\n':
      case '0':
        return;
      case '-1':
        _this.on('spawn', createHole);

    }
  });
};

function indexToXY(index, rowLength){
  return {
    x: index % rowLength,
    y: Math.floor(index / rowLength)
  };
}
