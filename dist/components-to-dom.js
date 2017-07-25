'use strict';

var is = require('@mojule/is');
var Templating = require('@mojule/templating');
var Tree = require('@mojule/tree');
var Vdom = require('@mojule/vdom');
var sass = require('node-sass');

var ComponentsToDom = function ComponentsToDom(api) {
  var components = api.get();
  var componentNames = Object.keys(components);

  var getContent = api.getContent,
      getTemplate = api.getTemplate,
      getConfig = api.getConfig,
      getStyle = api.getStyle,
      getClient = api.getClient,
      getModel = api.getModel;


  var templates = componentNames.reduce(function (t, name) {
    var template = getTemplate(name);

    if (template) t[name] = template;

    return t;
  }, {});

  var componentsToDom = function componentsToDom(modelNode) {
    if (Tree.isNode(modelNode)) modelNode = Tree(modelNode);

    var css = '';
    var cssMap = {};
    var js = '';
    var jsMap = {};

    var addCss = function addCss(name) {
      if (cssMap[name]) return;

      var style = getStyle(name);

      if (style) css += '\n' + style;

      cssMap[name] = true;
    };

    var addJs = function addJs(name) {
      if (jsMap[name]) return;

      var script = getClient(name);

      if (script) js += '\n' + script;

      jsMap[name] = true;
    };

    var onInclude = function onInclude(name) {
      addCss(name);
      addJs(name);
    };

    var templating = Templating(templates, { onInclude: onInclude });

    var nodeToDom = function nodeToDom(node) {
      var _node$getValue = node.getValue(),
          name = _node$getValue.name,
          model = _node$getValue.model;

      var defaultModel = getModel(name) || {};

      model = Object.assign({}, defaultModel, model);

      addCss(name);
      addJs(name);

      var content = getContent(name);

      if (content) return Vdom(content);

      var config = getConfig(name);

      var containerSelector = '[data-container]';

      if (config && config.containerSelector) containerSelector = config.containerSelector;

      var fragment = Vdom.createDocumentFragment();

      if (node.hasChildren()) node.getChildren().forEach(function (child) {
        var domChild = nodeToDom(child);
        fragment.append(domChild);
      });

      if (name === 'document') {
        var _model = model,
            styles = _model.styles,
            scripts = _model.scripts;


        if (!is.array(styles)) styles = [];

        if (!is.array(scripts)) scripts = [];

        css = sass.renderSync({ data: css }).css.toString();

        styles.push({
          text: css
        });

        scripts.push({
          text: js
        });

        model.styles = styles;
        model.scripts = scripts;
      }

      var dom = templating(name, model);

      var target = dom.matches(containerSelector) ? dom : dom.querySelector(containerSelector);

      if (target) target.append(fragment);

      return dom;
    };

    return nodeToDom(modelNode);
  };

  return componentsToDom;
};

module.exports = ComponentsToDom;