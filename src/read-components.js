'use strict'

const VFS = require( '@mojule/vfs' )
const pify = require( 'pify' )
const TransformComponents = require( './transform-components' )

const virtualize = pify( VFS.virtualize )

const ReadComponents = options => {
  const transformComponents = TransformComponents( options )

  const readComponents = ( filepath, callback ) =>
    virtualize( filepath )
    .then( transformComponents )
    .then( result => callback( null, result ) )
    .catch( callback )

  return readComponents
}

module.exports = ReadComponents
