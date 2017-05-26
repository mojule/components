'use strict'

const is = require( '@mojule/is' )
const Templating = require( '@mojule/templating' )
const Tree = require( '@mojule/tree' )
const Vdom = require( '@mojule/vdom' )
const sass = require( 'node-sass' )

const ComponentsToDom = api => {
  const components = api.get()
  const componentNames = Object.keys( components )

  const { getContent, getTemplate, getConfig, getStyle } = api

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

    const addCss = name => {
      if( cssMap[ name ] ) return

      const style = getStyle( name )

      if( style )
        css += '\n' + style

      cssMap[ name ] = true
    }

    const templating = Templating( templates, { onInclude: addCss } )

    const nodeToDom = node => {
      let { name, model } = node.getValue()

      addCss( name )

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
        const model = node.getValue( 'model' )
        let { styles } = model

        if( !is.array( styles ) )
          styles = []

        css = sass.renderSync({ data: css }).css.toString()

        styles.push({
          text: css
        })

        model.styles = styles

        node.setValue( 'model', model )
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
