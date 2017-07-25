'use strict'

const is = require( '@mojule/is' )
const Templating = require( '@mojule/templating' )
const Tree = require( '@mojule/tree' )
const Vdom = require( '@mojule/vdom' )
const sass = require( 'node-sass' )

const ComponentsToDom = api => {
  const components = api.get()
  const componentNames = Object.keys( components )

  const {
    getContent, getTemplate, getConfig, getStyle, getClient, getModel
  } = api

  const templates = componentNames.reduce( ( t, name ) => {
    const template = getTemplate( name )

    if( template )
      t[ name ] = template

    return t
  }, {} )

  const componentsToDom = modelNode => {
    if( Tree.isNode( modelNode ) )
      modelNode = Tree( modelNode )

    let css = ''
    const cssMap = {}
    let js = ''
    const jsMap = {}

    const addCss = name => {
      if( cssMap[ name ] ) return

      const style = getStyle( name )

      if( style )
        css += '\n' + style

      cssMap[ name ] = true
    }

    const addJs = name => {
      if( jsMap[ name ] ) return

      const script = getClient( name )

      if( script )
        js += '\n' + script

      jsMap[ name ] = true
    }

    const onInclude = name => {
      addCss( name )
      addJs( name )
    }

    const templating = Templating( templates, { onInclude } )

    const nodeToDom = node => {
      let { name, model } = node.getValue()
      const defaultModel = getModel( name ) || {}

      model = Object.assign( {}, defaultModel, model )

      addCss( name )
      addJs( name )

      const content = getContent( name )

      if( content )
        return Vdom( content )

      const config = getConfig( name )

      let containerSelector = '[data-container]'

      if( config && config.containerSelector )
        containerSelector = config.containerSelector

      const fragment = Vdom.createDocumentFragment()

      if( node.hasChildren() )
        node.getChildren().forEach( child => {
          const domChild = nodeToDom( child )
          fragment.append( domChild )
        })

      if( name === 'document' ){
        let { styles, scripts } = model

        if( !is.array( styles ) )
          styles = []

        if( !is.array( scripts ) )
          scripts = []

        css = sass.renderSync({ data: css }).css.toString()

        styles.push({
          text: css
        })

        scripts.push({
          text: js
        })

        model.styles = styles
        model.scripts = scripts
      }

      const dom = templating( name, model )

      const target = dom.matches( containerSelector ) ?
        dom :
        dom.querySelector( containerSelector )

      if( target )
        target.append( fragment )

      return dom
    }

    return nodeToDom( modelNode )
  }

  return componentsToDom
}

module.exports = ComponentsToDom
