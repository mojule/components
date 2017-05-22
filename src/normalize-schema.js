'use strict'

const SchemaTree = require( '@mojule/schema-tree' )
const utils = require( '@mojule/utils' )

const { clone } = utils

const normalize = ( components, name, asTree = false ) => {
  const getSchema = name => {
    if( components[ name ] )
      return components[ name ].schema
  }

  const getModel = name => {
    if( components[ name ] )
      return components[ name ].model
  }

  const getTransform = name => {
    if( components[ name ] )
      return components[ name ].transform
  }

  const schemas = Object.keys( components ).reduce( ( obj, key ) => {
    const schema = getSchema( key )

    if( schema ) obj[ key ] = schema

    return obj
  }, {} )

  const schemaNames = Object.keys( schemas )
  const schema = clone( schemas[ name ] )
  const schemaTree = SchemaTree( schema )

  const refNodes = findRefNodes( schemaTree )

  refNodes.forEach( refNode => {
    const replaceWithName = refNode.value().$ref
    const replaceWithNode = normalize( components, replaceWithName, true )

    const refNodeValue = refNode.value()

    refNodeValue.meta = {
      componentName: refNodeValue.$ref,
      transform: !!getTransform( refNodeValue.$ref )
    }

    delete refNodeValue.$ref

    refNode.value( refNodeValue )

    extendSchema( refNode, replaceWithNode )
  })

  const allOfNodes = findAllOfNodes( schemaTree )

  allOfNodes.forEach( allOfNode => {
    const parentNode = allOfNode.getParent()

    const allOfValue = allOfNode.value()
    delete allOfValue.allOf
    allOfNode.value( allOfValue )

    extendSchema( parentNode, allOfNode )

    allOfNode.remove()
  })

  return asTree ? schemaTree : schemaTree.toSchema()
}

const findRefNodes = schemaNode =>
  schemaNode.findAll( n => '$ref' in n.value() )

const findAllOfNodes = schemaNode =>
  schemaNode.findAll( n => n.value().allOf )

const skipProperties = [ "id", "title", "meta" ]

const extendSchema = ( baseNode, extendNode ) => {
  const baseNodeValue = baseNode.value()
  const extendNodeValue = extendNode.value()

  Object.keys( extendNodeValue ).forEach( propertyName => {
    if( propertyName === 'required' ){
      if( !Array.isArray( baseNodeValue.required ) )
        baseNodeValue.required = []

      baseNodeValue.required.push( ...extendNodeValue.required )

      return
    }

    if( skipProperties.includes( propertyName ) )
      return

    baseNodeValue[ propertyName ] = extendNodeValue[ propertyName ]
  })

  extendNode.getChildren().forEach( childNode => {
    baseNode.append( childNode )
  })

  baseNode.value( baseNodeValue )
}

module.exports = normalize
