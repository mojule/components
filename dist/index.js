'use strict';

var utils = require('@mojule/utils');

var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var getComponents = require('./get-components');

var componentDataNames = ['config', 'model', 'schema', 'style', 'template', 'client', 'content'];

var Components = function Components(components) {
  var api = {
    get: function get() {
      return components;
    }
  };

  var getData = componentDataNames.reduce(function (getters, dataName) {
    var fname = 'get' + capitalizeFirstLetter(dataName);

    getters[fname] = function (name) {
      if (components[name]) return components[name][dataName];
    };

    return getters;
  }, {});

  Object.assign(api, getData);

  return api;
};

Object.assign(Components, {
  read: function read(filepath, callback) {
    getComponents(filepath, function (err, components) {
      if (err) return callback(err);

      callback(null, Components(components));
    });
  }
});

module.exports = Components;