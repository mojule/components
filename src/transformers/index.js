'use strict'

const Csv = require( './csv' )
const Html = require( './html' )
const Json = require( './json' )
const Markdown = require( './markdown' )

const Transformers = options => {
  const markdown = Markdown( options )

  const transformers = {
    '.json': Json( options ),
    '.html': Html( options ),
    '.md': markdown,
    '.markdown': markdown,
    '.csv': Csv( options )
  }

  return transformers
}

module.exports = Transformers
