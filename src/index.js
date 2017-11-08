'use strict'

const ReadComponents = require( './read-components' )
const TransformComponents = require( './transform-components' )
const Render = require( '@mojule/render-components' )
const getValues = require( '@mojule/render-components/src/get-values' )

const Components = ( components, options ) => {
  const render = Render( components, options )
  const api = Object.assign( getValues( components ), { render } )

  return api
}

Object.assign( Components, { ReadComponents, TransformComponents } )

module.exports = Components
