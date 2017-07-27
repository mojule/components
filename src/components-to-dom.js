'use strict'

const is = require( '@mojule/is' )
const Templating = require( '@mojule/templating' )
const Tree = require( '@mojule/tree' )
const VDOM = require( '@mojule/vdom' )
const sass = require( 'node-sass' )

const ComponentsToDom = api => {
  const components = api.get()
  const componentNames = Object.keys( components )

  const { getContent, getTemplate, getConfig, getStyle, getModel } = api

  const templates = componentNames.reduce( ( t, name ) => {
    const template = getTemplate( name )

    if( template )
      t[ name ] = template

    return t
  }, {} )

  const componentsToDom = modelNode => {
    if( !is.function( modelNode.serialize ) )
      modelNode = Tree.deserialize( modelNode )

    let css = ''
    const cssMap = {}

    const addCss = name => {
      if( cssMap[ name ] ) return

      const style = getStyle( name )

      if( style )
        css += '\n' + style

      cssMap[ name ] = true
    }

    const templating = Templating( templates, { onInclude: addCss } )

    const nodeToDom = node => {
      let { name, model } = node.value
      const defaultModel = getModel( name ) || {}

      model = Object.assign( {}, defaultModel, model )

      addCss( name )

      const content = getContent( name )

      if( content )
        return VDOM.deserialize( content )

      const config = getConfig( name )

      let containerSelector = '[data-container]'

      if( config && config.containerSelector )
        containerSelector = config.containerSelector

      const fragment = VDOM.createDocumentFragment()

      if( node.hasChildNodes() )
        node.childNodes.forEach( child => {
          const domChild = nodeToDom( child )

          fragment.appendChild( domChild )
        })

      if( name === 'document' ){
        let { styles } = model

        if( !is.array( styles ) )
          styles = []

        css = sass.renderSync({ data: css }).css.toString()

        styles.push({
          text: css
        })

        model.styles = styles
      }

      const dom = templating( name, model )
      const target = dom.select( containerSelector )

      if( target )
        target.appendChild( fragment )

      return dom
    }

    return nodeToDom( modelNode )
  }

  return componentsToDom
}

module.exports = ComponentsToDom
