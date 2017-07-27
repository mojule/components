'use strict'

const mutateColumn = require( './mutate-column' )
const dom = require( './dom' )

const plugins = { api: [ mutateColumn, dom ] }

module.exports = plugins
