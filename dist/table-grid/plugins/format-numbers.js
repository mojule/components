'use strict';

var is = require('@mojule/is');

var formatNumbers = function formatNumbers(column) {
  var decimalLength = column.reduce(function (length, value) {
    if (!is.number(value)) return length;

    var decimals = value.toString().split('.')[1];

    return is.string(decimals) && decimals.length > length ? decimals.length : length;
  }, 0);

  return column.map(function (number) {
    return is.number(number) ? number.toFixed(decimalLength) : number.toString();
  });
};

module.exports = formatNumbers;