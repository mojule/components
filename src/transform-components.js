'use strict'

let path = require( 'path' )
const Transformers = require( './transformers' )

// browserify just exports path, but it's equivalent
path = path.posix || path

const defaultOptions = {
  Transformers
}

const TransformComponents = options => {
  options = Object.assign( {}, defaultOptions, options )

  const { Transformers } = options
  const transforms = Transformers( options )

  const transformComponents = vfs => {
    options.getStyle = name => {
      const file = vfs.subNodes.find( current =>{
        if( current.nodeName === '#directory' ) return false

        const directory = current.parentNode
        const parsed = path.parse( current.filename )

        return parsed.name === 'style' && directory.filename === name
      })

      if( file )
        return file.data
    }

    const result = {}

    const files = vfs.subNodes.filter( current => current.nodeName === '#file' )
    const rootPath = vfs.getPath()

    const getCategories = directory => {
      const directoryPath = directory.getPath()
      const relative = path.relative( rootPath, directoryPath )
      const segs = relative.split( path.sep )

      // discard last segment, it's the component name
      segs.pop()

      return segs
    }

    files.forEach( file => {
      const directory = file.parentNode
      let name = directory.filename
      const parsed = path.parse( file.filename )
      let { ext, base, name: type } = parsed
      const categories = getCategories( directory )

      let data = file.data

      if( !result[ name ] )
        result[ name ] = { name, categories }

      if( transforms[ base ] ){
        data = transforms[ base ]( data )
      } else if( transforms[ ext ] ){
        data = transforms[ ext ]( data )
      }

      result[ name ][ type ] = data
    })

    return result
  }

  return transformComponents
}

module.exports = TransformComponents
