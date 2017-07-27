'use strict'

const mutateColumn = ({ api }) => {
  api.mutateColumn = ( x = 0, mapper = col => col ) => {
    x = api.normalizeColumnIndex( x )

    return api.setColumn(
      mapper(
        api.getColumn( x ), api
      ),
      x
    )
  }
}

module.exports = mutateColumn
