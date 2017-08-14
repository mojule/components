'use strict'

const domUtils = require( '@mojule/dom-utils' )
const markdown = require( 'commonmark' )

const { parse } = domUtils
const mdReader = new markdown.Parser()
const mdWriter = new markdown.HtmlRenderer()

const Markdown = options => {
  const { document } = options

  const markdown = str => {
    const parsed = mdReader.parse( str )
    /*
      could be faster to map the parsed nodes directly to DOM nodes - this would
      be a good starting point:
      https://github.com/commonmark/commonmark.js/blob/master/lib/render/html.js
    */
    const html = mdWriter.render( parsed )
    const dom = parse( document, html )

    return dom
  }

  return markdown
}

module.exports = Markdown
