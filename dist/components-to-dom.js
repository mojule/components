'use strict';

var is = require('@mojule/is');
var Templating = require('@mojule/templating');
var Vdom = require('@mojule/vdom');
var sass = require('node-sass');

var ComponentsToDom = function ComponentsToDom(components) {
  var componentNames = Object.keys(components);

  var getContent = function getContent(name) {
    if (components[name]) return components[name].content;
  };

  var getTemplate = function getTemplate(name) {
    if (components[name]) return components[name].template;
  };

  var getConfig = function getConfig(name) {
    if (components[name]) return components[name].config;
  };

  var getStyle = function getStyle(name) {
    if (components[name]) return components[name].style;
  };

  var templates = componentNames.reduce(function (t, name) {
    var template = getTemplate(name);

    if (template) t[name] = Vdom(template);

    return t;
  }, {});

  var templating = Templating(templates);

  var componentsToDom = function componentsToDom(root) {
    var css = '';
    var cssMap = {};

    root.walk(function (current) {
      var name = current.getValue('name');

      if (!cssMap[name]) {
        var style = getStyle(name);

        if (style) css += '\n' + style;

        cssMap[name] = true;
      }
    });

    var document = root.find(function (current) {
      var _current$getValue = current.getValue(),
          name = _current$getValue.name;

      return name === 'document';
    });

    if (document) {
      var model = document.getValue('model');
      var styles = model.styles;


      if (!is.array(styles)) styles = [];

      css = sass.renderSync({ data: css }).css.toString();

      styles.push({
        text: css
      });

      model.styles = styles;

      document.setValue('model', model);
    }

    var nodeToDom = function nodeToDom(node) {
      var _node$getValue = node.getValue(),
          name = _node$getValue.name,
          model = _node$getValue.model;

      var content = getContent(name);

      if (content) return Vdom(content);

      var dom = templating(name, model);
      var config = getConfig(name);

      var containerSelector = '[data-container]';

      if (config && config.containerSelector) containerSelector = config.containerSelector;

      var target = dom.matches(containerSelector) ? dom : dom.querySelector(containerSelector);

      if (target) node.getChildren().forEach(function (child) {
        var domChild = nodeToDom(child);
        target.append(domChild);
      });

      return dom;
    };

    return nodeToDom(root);
  };

  return componentsToDom;
};

module.exports = ComponentsToDom;