'use strict'

const Mmon = require( '@mojule/mmon' )
const getComponents = require( './src/get-components' )
const modelTreeToSchema = require( './src/model-tree-to-schema' )
const Tree = require( '@mojule/tree' )

const thing = require( './src/dom-tree-thing' )

const mmon = `
document>
  title: Home
  header>
  main>
    home>
    nutrition-comparison>
  footer>
`

const treeData = Mmon.parse( mmon )
const modelTree = Tree( treeData )

//console.log( JSON.stringify( treeData, null, 2 ) )

const document = modelTree.find( current => current.getValue( 'name' ) === 'document' )
const header = modelTree.find( current => current.getValue( 'name' ) === 'header' )

const documentValue = document.getValue()
const headerValue = header.getValue()

Object.assign( documentValue.model, { styles: [ { text: 'body{ font-family: sans-serif; }' } ] } )
document.setValue( documentValue )

Object.assign( headerValue.model, {
  links: [
    {
      title: 'Home',
      uri: '/'
    },
    {
      title: 'About',
      uri: '/about'
    }
  ]
})
header.setValue( headerValue )

getComponents( './components', ( err, components ) => {
  thing( modelTree, components )
  //const schema = modelTreeToSchema( modelTree, components )

  //console.log( JSON.stringify( schema.get(), null, 2 ) )
  //console.log( JSON.stringify( schema.toSchema(), null, 2 ) )
})
