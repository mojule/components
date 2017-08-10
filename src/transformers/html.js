'use strict'

const domUtils = require( '@mojule/dom-utils' )

const { parse } = domUtils

const Html = options => {
  const { document } = options

  const html = str => {
    const node = parse( document, str )

    if( node.nodeName === '#document-fragment' )
      return node

    const fragment = document.createDocumentFragment()

    fragment.appendChild( node )

    return fragment
  }

  return html
}

module.exports = Html
