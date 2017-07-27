'use strict'

const VDOM = require( '@mojule/vdom' )
const markdown = require( 'commonmark' )
const is = require( '@mojule/is' )
const formatNumbers = require( './format-numbers' )
const formatString = require( './format-string' )

const dom = ({ api }) => {
  api.dom = () => rowsToTable( api )
}

const mdReader = new markdown.Parser()
const mdWriter = new markdown.HtmlRenderer()

const { table, tr, th, td, text } = VDOM.h

const strToDom = str => VDOM.parse( str, { removeWhitespace: true } )

const renderCell = value => {
  const fragment = VDOM.createDocumentFragment()

  const el = strToDom( mdWriter.render( mdReader.parse( value ) ) )

  fragment.appendChild( el )
  el.unwrap()

  return fragment
}

const rowsToTable = grid => {
  const schema = grid.schema()
  const columnNames = grid.columnNames()

  Object.keys( schema.properties ).forEach( propertyName => {
    const property = schema.properties[ propertyName ]
    const mapper = property.type === 'number' ? formatNumbers : formatString

    grid.mutateColumn( propertyName, mapper )
  })

  const rows = grid.rows()

  const $headerRow = tr( ...columnNames.map( name => {
    const { type } = schema.properties[ name ]
    const $th = th( renderCell( name ) )

    if( type === 'number' )
      $th.classList.add( 'table__cell--number' )

    return $th
  }))

  const $trs = rows.map( row => {
    const $tds = columnNames.map( ( name, i ) => {
      const { type } = schema.properties[ name ]
      const value = row[ i ]
      const $td = td( renderCell( value ) )

      $td.setAttribute( 'title', name )

      if( type === 'number' || type === 'integer' )
        $td.classList.add( 'table__cell--number' )

      return $td
    })

    return tr( ...$tds )
  })

  const $table = table(
    { class: 'table' },
    $headerRow,
    ...$trs
  )

  return $table
}

module.exports = dom
