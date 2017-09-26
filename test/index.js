'use strict'

const assert = require( 'assert' )
const domUtils = require( '@mojule/dom-utils' )
const is = require( '@mojule/is' )
const Mmon = require( '@mojule/mmon' )
const Tree = require( '@mojule/tree' )
const jsdom = require( 'jsdom' )
const Components = require( '../src' )

const { stringify } = domUtils
const { ReadComponents } = Components

const { JSDOM } = jsdom
const dom = new JSDOM( '<!doctype>' )
const { document } = dom.window

const options = { document }

const readComponents = ReadComponents( options )

describe( 'Components', () => {
  let componentApi

  it( 'gets components', done => {
    readComponents( './test/fixtures/components', ( err, components ) => {
      if( err ) done( err )

      assert( is.object( components ) )
      assert( Object.keys( components ).length > 0 )

      componentApi = Components( components, document )

      done()
    })
  })

  it( 'gets dom', () => {
    const mmon = `
document>
  title: Home
  header>
    links[]
      {}
        title: Home
        uri: /
      {}
        title: "Contact Us"
        uri: /contact-us
  main>
  footer>
    `

    const modelTree = Tree.deserialize( Mmon.parse( mmon ) )
    const rendered = componentApi.render( modelTree )
    const html = stringify( rendered.node )

    assert( is.string( html ) && html.length > 0 )
  })

  it( 'getData miss', () => {
    assert.equal( componentApi.getTemplate( 'nope' ), undefined )
  })

  it( 'bad component path', done => {
    readComponents( 'nope', err => {
      assert( err )
      done()
    })
  })

  it( 'from model tree', () => {
    const mmon = `
document>
  styles[]
    {}
      text: body{}
    {}
      uri: /css
  main>
    `

    const parsed = Mmon.parse( mmon )
    const modelTree = Tree.deserialize( parsed )
    const rendered = componentApi.render( modelTree )
    const html = stringify( rendered.node )

    assert( is.string( html ) && html.length > 0 )
  })
})
