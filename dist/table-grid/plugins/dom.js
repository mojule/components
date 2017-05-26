'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Vdom = require('@mojule/vdom');
var markdown = require('commonmark');
var is = require('@mojule/is');
var formatNumbers = require('./format-numbers');
var formatString = require('./format-string');

var dom = function dom(grid) {
  return {
    dom: function dom() {
      return rowsToTable(grid);
    }
  };
};

var mdReader = new markdown.Parser();
var mdWriter = new markdown.HtmlRenderer();

var _Vdom$h = Vdom.h,
    table = _Vdom$h.table,
    tr = _Vdom$h.tr,
    th = _Vdom$h.th,
    td = _Vdom$h.td,
    text = _Vdom$h.text;


var strToDom = function strToDom(str) {
  return Vdom.parse(str, { removeWhitespace: true });
};

var renderCell = function renderCell(value) {
  var fragment = Vdom.createDocumentFragment();

  var el = strToDom(mdWriter.render(mdReader.parse(value)));

  fragment.append(el);
  el.unwrap();

  return fragment;
};

var rowsToTable = function rowsToTable(grid) {
  var schema = grid.schema();
  var columnNames = grid.columnNames();

  Object.keys(schema.properties).forEach(function (propertyName) {
    var property = schema.properties[propertyName];
    var mapper = property.type === 'number' ? formatNumbers : formatString;

    grid.mutateColumn(propertyName, mapper);
  });

  var rows = grid.rows();

  var $headerRow = tr.apply(undefined, _toConsumableArray(columnNames.map(function (name) {
    var type = schema.properties[name].type;

    var $th = th(renderCell(name));

    if (type === 'number') $th.addClass('table__cell--number');

    return $th;
  })));

  var $trs = rows.map(function (row) {
    var $tds = columnNames.map(function (name, i) {
      var type = schema.properties[name].type;

      var value = row[i];
      var $td = td(renderCell(value));

      $td.setAttr('title', name);

      if (type === 'number' || type === 'integer') $td.addClass('table__cell--number');

      return $td;
    });

    return tr.apply(undefined, _toConsumableArray($tds));
  });

  var $table = table.apply(undefined, [{ class: 'table' }, $headerRow].concat(_toConsumableArray($trs)));

  return $table;
};

module.exports = dom;