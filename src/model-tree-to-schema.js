'use strict'

const normalizeSchema = require( './normalize-schema' )
const SchemaTree = require( '@mojule/schema-tree' )

const modelTreeToSchema = ( tree, components ) => {
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

  const name = tree.getValue( 'name' )
  const schema = normalizeSchema( components, name, true )

  const value = {
    meta: {
      componentName: name,
      transform: !!getTransform( name )
    }
  }

  schema.assign( value )

  if( schema.getValue( 'type' ) === 'any' ){
    schema.setValue( 'type', 'object' )
    schema.setValue( 'title', name )
  }

  const model = Object.assign( {}, getModel( name ), tree.getValue( 'model' ) )

  schema.setValue( 'default', model )

  if( tree.hasChildren() ){
    const children = SchemaTree({
      title: 'Component Children',
      type: 'object',
      propertyName: '_children'
    })

    schema.append( children )

    tree.getChildren().forEach( ( child, i ) => {
      const childSchema = modelTreeToSchema( child, components )

      childSchema.setValue( 'propertyName', i.toString() )

      children.append( childSchema )
    })
  }

  return schema
}

module.exports = modelTreeToSchema
