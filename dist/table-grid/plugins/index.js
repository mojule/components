'use strict';

var mutateColumn = require('./mutate-column');
var dom = require('./dom');

var plugins = [mutateColumn, dom];

module.exports = plugins;