'use strict';

var _require = require('@mojule/grid'),
    Factory = _require.Factory;

var plugins = require('./plugins');

var Grid = Factory(plugins);

module.exports = Grid;