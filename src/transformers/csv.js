'use strict'

const Grid = require( '@mojule/grid' )

const Csv = () => {
  const csv = str => {
    const grid = Grid( str )

    // map to expand?
    return grid.models()
  }

  return csv
}

module.exports = Csv
