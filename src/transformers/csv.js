'use strict'

const Grid = require( '@mojule/grid' )

const Csv = () => {
  const csv = str => {
    const grid = Grid( str )

    const columnNames = grid.getColumnNames()
    const rows = grid.getRows()
    const nameValueRows = rows.map( row =>
      row.map( ( value, index ) => ({ name: columnNames[ index ], value }) )
    )
    // should possibly be mapped via mojule/flatten/expand
    const models = grid.models()

    return { columnNames, rows, nameValueRows, models }
  }

  return csv
}

module.exports = Csv
