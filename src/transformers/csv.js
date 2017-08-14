'use strict'

const Grid = require( '@mojule/grid' )
const flatten = require( '@mojule/flatten' )

const { expand } = flatten

const gridToTableModel = grid => {
  const columnNames = grid.getColumnNames().map( name => ({ name }))

  const cell = ( value, index ) => ({ name: columnNames[ index ], value })
  const row = value => ({ cells: value.map( cell ) })

  const rows = grid.getRows().map( row )

  return { columnNames, rows }
}

const Csv = () => {
  const csv = str => {
    const grid = Grid( str )

    const table = gridToTableModel( grid )
    const models = grid.models().map( model => expand( model ) )

    return { table, models }
  }

  return csv
}

module.exports = Csv
