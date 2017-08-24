'use strict'

const Grid = require( '@mojule/grid' )
const flatten = require( '@mojule/flatten' )
const is = require( '@mojule/is' )
const markdown = require( 'commonmark' )

const mdReader = new markdown.Parser()
const mdWriter = new markdown.HtmlRenderer()

const { expand } = flatten

const gridToTableModel = grid => {
  const columnNames = grid.getColumnNames().map( name => ({ name }))

  const cell = ( value, index ) => ({ name: columnNames[ index ], value })
  const row = value => ({ cells: value.map( cell ) })

  const rows = grid.getRows().map( row )

  return { columnNames, rows }
}

const markdownStrings = values => values.map( value => {
  if( is.string( value ) ){
    const parsed = mdReader.parse( value )
    const html = mdWriter.render( parsed )

    return html
  }

  return value
})

const maxPlaces = numbers => numbers.reduce( ( max, value ) => {
  const currentPlaces = places( value )

  if( currentPlaces > max ) return currentPlaces

  return max
}, 0 )

const places = number => {
  const segs = String( number ).split( '.' )

  if( segs.length > 1 )
    return segs[ 1 ].length

  return 0
}

const paddedNumberString = ( number, places ) => {
  const str = String( number )

  if( places === 0 )
    return str

  const segs = String( number ).split( '.' )

  if( segs.length === 1 )
    segs.push( '' )

  while( segs[ 1 ].length < places )
    segs[ 1 ] += '0'

  return segs.join( '.' )
}

const formatNumberRows = grid => {
  const schema = grid.schema()
  const { properties } = schema
  const propertyNames = Object.keys( properties )
  const numberColumnHeaders = propertyNames.filter( name => properties[ name ].type === 'number' )

  numberColumnHeaders.forEach( headerName => {
    const column = grid.getColumn( headerName )
    const max = maxPlaces( column )
    const paddedColumn = column.map( value => paddedNumberString( value, max ) )

    grid.setColumn( paddedColumn, headerName )
  })
}

const Csv = () => {
  const csv = str => {
    const grid = Grid( str )
    const models = grid.models().map( model => expand( model ) )
    const values = grid.getValues()

    /*
      only transform markdown and format numbers for the table, the models
      should be left as is, hence why we get them first
    */
    grid.setValues( markdownStrings( values ) )
    formatNumberRows( grid )

    const table = gridToTableModel( grid )

    return { table, models }
  }

  return csv
}

module.exports = Csv
