'use strict';

var is = require('@mojule/is');

var formatString = function formatString(column) {
  return column.map(function (value) {
    return value.toString();
  });
};

module.exports = formatString;