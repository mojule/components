'use strict';

var Vfs = require('@mojule/vfs');
var pify = require('pify');
var transformComponents = require('./transform-components');

var virtualize = pify(Vfs.virtualize);

var getComponents = function getComponents(filepath, callback) {
  return virtualize(filepath).then(transformComponents).then(function (result) {
    return callback(null, result);
  }).catch(callback);
};

module.exports = getComponents;