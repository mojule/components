'use strict'

const ReadComponents = require( './read-components' )
const Render = require( './render' )
const getValues = require( './get-values' )

const Components = ( components, document ) => {
  const render = Render( components, document )
  const api = Object.assign( getValues( components ), { render } )

  return api
}

Object.assign( Components, { ReadComponents } )

module.exports = Components
