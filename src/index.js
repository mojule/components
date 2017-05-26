'use strict'

const utils = require( '@mojule/utils' )

const { capitalizeFirstLetter } = utils

const getComponents = require( './get-components' )
const ComponentsToDom = require( './components-to-dom' )

const componentDataNames = [
  'config', 'model', 'schema', 'style', 'template', 'client',
  'content'
]

const Components = components => {
  const api = {
    get: () => components,
    dom: modelTree => componentsToDom( modelTree )
  }

  const getData = componentDataNames.reduce( ( getters, dataName ) => {
    const fname = 'get' + capitalizeFirstLetter( dataName )

    getters[ fname ] = name => {
      if( components[ name ] )
        return components[ name ][ dataName ]
    }

    return getters
  }, {} )

  Object.assign( api, getData )

  const componentsToDom = ComponentsToDom( api )


  return api
}

Object.assign( Components, {
  read: ( filepath, callback ) => {
    getComponents( filepath, ( err, components ) => {
      if( err ) return callback( err )

      callback( null, Components( components ) )
    })
  }
})

module.exports = Components