'use strict'

const domUtils = require( '@mojule/dom-utils' )

const { parse } = domUtils

const Html = options => {
  const { document } = options

  const html = str => parse( document, str )

  return html
}

module.exports = Html
