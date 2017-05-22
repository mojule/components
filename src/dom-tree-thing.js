'use strict'

const Vdom = require( '@mojule/vdom' )

// can we walk the tree without schema?
const thing = ( modelNode, components ) => {
  const getSchema = name => {
    if( components[ name ] )
      return components[ name ].schema
  }

  const getModel = name => {
    if( components[ name ] )
      return components[ name ].model
  }

  const getTemplate = name => {
    if( components[ name ] )
      return components[ name ].template
  }

  const getTransform = name => {
    if( components[ name ] )
      return components[ name ].transform
  }

  const addIncludes = ( set, name ) => {
    const template = getTemplate( name )

    if( template ){
      const dom = Vdom( template )

      const includes = dom.querySelectorAll( '[data-include]' )

      includes.forEach( include => {
        const value = include.attr( 'data-include' )
        set.add( value )

        addIncludes( set, value )
      })
    }
  }

  modelNode.walk( ( current, parent, depth ) => {
    const indent = '  '.repeat( depth )
    const { name, model } = current.getValue()

    const template = getTemplate( name )

    if( template ){
      console.log( indent, name, 'template' )

      const values = new Set()

      addIncludes( values, name )

      console.log( indent, 'includes', JSON.stringify( [ ...values ] ) )
      console.log( indent, 'model', JSON.stringify( model ) )
    } else {
      console.log( indent, name, 'no template' )
    }

    console.log()
  })
}

module.exports = thing
