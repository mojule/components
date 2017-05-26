'use strict'

const assert = require( 'assert' )
const is = require( '@mojule/is' )
const Mmon = require( '@mojule/mmon' )
const Tree = require( '@mojule/tree' )
const Components = require( '../src' )

describe( 'Components', () => {
  let componentApi

  it( 'gets components', done => {
    Components.read( './test/fixtures/components', ( err, api ) => {
      assert( !err )
      assert( is.object( api ) )

      componentApi = api

      const components = api.get()

      assert( is.object( components ) )
      assert( Object.keys( components ).length > 0 )

      done()
    })
  })

  it( 'gets dom', () => {
    const mmon = `
document>
  title: Home
  header>
  main>
    home>
    nutrition-comparison>
  footer>
    `

    const modelTree = Mmon.parse( mmon )
    const dom = componentApi.dom( modelTree )
    const html = dom.stringify()

    assert( is.string( html ) && html.length > 0 )
  })

  it( 'getData miss', () => {
    assert.equal( componentApi.getTemplate( 'nope' ), undefined )
  })

  it( 'bad component path', done => {
    Components.read( 'nope', err => {
      assert( err )
      done()
    })
  })

  it( 'from model tree', () => {
    const mmon = `
document>
  title: Home
  header>
    links[]
      {}
        title: Home
        uri: /home
      {}
        title: About
        uri: /about
  main>
    home>
    nutrition-comparison>
  footer>
    `

    const modelTree = Tree( Mmon.parse( mmon ) )
    const dom = componentApi.dom( modelTree )
    const html = dom.stringify()

    assert( is.string( html ) && html.length > 0 )
  })
})
