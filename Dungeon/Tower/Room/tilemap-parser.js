'use strict';

module.exports = function(tilemap, tileDictionary){
  var _this = this;
  tilemap.split('').forEach(function(char, index){
    switch(char.toLowerCase()){
      case '\n':
      case '0':
        return;
      case '-':
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
