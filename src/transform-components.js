'use strict'

const path = require( 'path' )
const is = require( '@mojule/is' )
const Vdom = require( '@mojule/vdom' )
const markdown = require( 'commonmark' )
const pify = require( 'pify' )
const TableGrid = require( './table-grid' )

const mdReader = new markdown.Parser()
const mdWriter = new markdown.HtmlRenderer()

const strToDom = str => Vdom.parse( str, { removeWhitespace: true } ).get()

const transforms = {
  '.json': str => JSON.parse( str ),
  '.html': strToDom,
  '.md': str => strToDom( mdWriter.render( mdReader.parse( str ) ) ),
  '.markdown': str => transforms[ '.md' ]( str ),
  '.csv': str => {
    const grid = TableGrid( str )

    return grid.dom().get()
  }
}

const transformComponents = vfs => {
  const result = {}

  const files = vfs.findAll( current => current.nodeType() === 'file' )
  const rootPath = vfs.getPath()

  const getCategories = directory => {
    const directoryPath = directory.getPath()
    const relative = path.posix.relative( rootPath, directoryPath )
    const segs = relative.split( path.posix.sep )

    // discard last segment, it's the component name
    segs.pop()

    return segs
  }

  files.forEach( file => {
    const directory = file.getParent()
    const name = directory.filename()
    const parsed = path.parse( file.filename() )
    const type = parsed.name
    const ext = parsed.ext
    const categories = getCategories( directory )

    let data = file.data()

    if( !result[ name ] )
      result[ name ] = { name, categories }

    if( transforms[ ext ] )
      data = transforms[ ext ]( data )

    result[ name ][ type ] = data
  })

  return result
}

module.exports = transformComponents
