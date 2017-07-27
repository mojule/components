'use strict'

const VFS = require( '@mojule/vfs' )
const pify = require( 'pify' )
const transformComponents = require( './transform-components' )

const virtualize = pify( VFS.virtualize )

const getComponents = ( filepath, callback ) =>
  virtualize( filepath )
  .then( transformComponents )
  .then( result => callback( null, result ) )
  .catch( callback )

module.exports = getComponents
