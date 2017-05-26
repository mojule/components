'use strict'

const Vfs = require( '@mojule/vfs' )
const pify = require( 'pify' )
const transformComponents = require( './transform-components' )

const virtualize = pify( Vfs.virtualize )

const getComponents = ( filepath, callback ) =>
  virtualize( filepath )
  .then( transformComponents )
  .then( result => callback( null, result ) )
  .catch( callback )

module.exports = getComponents
