'use strict';

var is = require('@mojule/is');

var formatNumbers = function formatNumbers(column) {
  var decimalLength = column.reduce(function (length, value) {
    var decimals = value.toString().split('.')[1];

    return is.string(decimals) && decimals.length > length ? decimals.length : length;
  }, 0);

  return column.map(function (number) {
    return number.toFixed(decimalLength);
  });
};

module.exports = formatNumbers;