'use strict';

var mutateColumn = function mutateColumn(grid) {
  return {
    mutateColumn: function mutateColumn() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var mapper = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (col) {
        return col;
      };

      x = grid.normalizeColumnIndex(x);

      return grid.setColumn(mapper(grid.getColumn(x), grid), x);
    }
  };
};

module.exports = mutateColumn;