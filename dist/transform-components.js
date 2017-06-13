'use strict';

var path = require('path');
var is = require('@mojule/is');
var Grid = require('@mojule/grid');
var Vdom = require('@mojule/vdom');
var markdown = require('commonmark');
var pify = require('pify');
var TableGrid = require('./table-grid');

var mdReader = new markdown.Parser();
var mdWriter = new markdown.HtmlRenderer();

var strToDom = function strToDom(str) {
  return Vdom.parse(str, { removeWhitespace: true }).get();
};

var transforms = {
  '.json': function json(str) {
    return JSON.parse(str);
  },
  '.html': strToDom,
  '.md': function md(str) {
    return strToDom(mdWriter.render(mdReader.parse(str)));
  },
  '.markdown': function markdown(str) {
    return transforms['.md'](str);
  },
  'content.csv': function contentCsv(str) {
    var grid = TableGrid(str);

    return grid.dom().get();
  },
  '.csv': function csv(str) {
    var grid = Grid(str);

    return grid.models();
  }
};

var transformComponents = function transformComponents(vfs) {
  var result = {};

  var files = vfs.findAll(function (current) {
    return current.nodeType() === 'file';
  });
  var rootPath = vfs.getPath();

  var getCategories = function getCategories(directory) {
    var directoryPath = directory.getPath();
    var relative = path.posix.relative(rootPath, directoryPath);
    var segs = relative.split(path.posix.sep);

    // discard last segment, it's the component name
    segs.pop();

    return segs;
  };

  files.forEach(function (file) {
    var directory = file.getParent();
    var name = directory.filename();
    var parsed = path.parse(file.filename());
    var ext = parsed.ext,
        base = parsed.base,
        type = parsed.name;

    var categories = getCategories(directory);

    var data = file.data();

    if (!result[name]) result[name] = { name: name, categories: categories };

    if (transforms[base]) {
      data = transforms[base](data);
    } else if (transforms[ext]) {
      data = transforms[ext](data);
    }

    result[name][type] = data;
  });

  return result;
};

module.exports = transformComponents;