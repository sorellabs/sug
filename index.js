// # Module: sug
//
// Sucks Markdown outta your source files.
//
//
// Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// ## Dependencies
var Base = require('boo').Base


// ## Constants and aliases
var newlines = /\r\n|\r|\n/


// ## Core implementation

//- parse :: (String, Language) → [Token]
function parse(text, language) {
  return text.split(newlines)
             .map(parseLine(language))
             .reduce(assimilateSimilarTokens, []) }

//- render :: [Token] → String
function render(tokens) {
  return tokens.map(renderToken)
               .join('\n') }


// ## Languages
var languages = {}

languages.text = Base.derive({
  name: 'text',
  friendlyName: 'Plain text',
  extension: /\.txt$/,

  isEmpty:
  function _IsEmpty(a) {
    return /^\s*$/.test(a) }

, isComment:
  function _IsComment(a) {
    return true }

, parseComment:
  function _ParseComment(a) {
    return a }
})

languages.c = languages.text.derive({
  name: 'c'
, friendlyName: 'C'
, extension: /\.c$/

, isComment:
  function _IsComment(line) {
    return /^\s*\/\//.test(line) }

, parseComment:
  function _ParseComment(line) {
    return line.replace(/^\s*\/\/\s?/, '') }
})

languages.js = languages.c.derive({
  name: 'js',
  friendlyName: 'JavaScript',
  extension: /\.js$/
})

languages.java = languages.c.derive({
  name: 'java',
  friendlyName: 'Java',
  extension: /\.java$/
})

languages.bash = Base.derive({
  name: 'bash'
, friendlyName: 'Bash'
, extension: /\.sh$/

, isComment:
  function _IsComment(line) {
    return /^\s*\#/.test(line) }

, parseComment:
  function _ParseComment(line) {
    return line.replace(/^\s*\#\s?/, '') }
})

languages.ruby = languages.bash.derive({
  name: 'ruby',
  friendlyName: 'Ruby',
  extension: /\.rb$/
})

languages.python = languages.bash.derive({
  name: 'python',
  friendlyName: 'Python',
  extension: /\.py$/
})

languages.coffee = languages.bash.derive({
  name: 'coffee',
  friendlyName: 'CoffeeScript',
  extension: /\.coffee$/
})

languages.livescript = languages.bash.derive({
  name: 'ls',
  friendlyName: 'LiveScript',
  extension: /\.ls$/
})

// ## Helpes

function parseLine(language) { return function(line) {
  return language.isEmpty(line)?    Blank.make()
  :      language.isComment(line)?  Text.make(language.parseComment(line))
  :      /* otherwise */            Code.make(line, language.name) }}

function assimilateSimilarTokens(xs, a) {
  var b  = last(xs)
  var ys = butLast(xs)
  return !b?       [a]
  :      /* _ */   ys.concat( b.canAssimilate(a)?  [b.assimilate(a)]
                            : /* otherwise */      [b, a]) }

function renderToken(token) {
  return token.render() }

function last(xs) {
  return xs[xs.length - 1] }

function butLast(xs) {
  return xs.slice(0, -1) }


// ## Tokens
var Token = Base.derive({
  lastAssimilated: {}

, canAssimilate:
  function _CanAssimilate(other) {
    return this.type === other.type
    ||     other.type === 'Blank' }

, assimilate:
  function _Assimilate(other) {
    this.values.push.apply(this.values, other.values)
    return this }

, toString:
  function _ToString() {
    return '<' + this.type + ': ' + this.values.join('\n') + '>' }
})

var Blank = Token.derive({
  type: 'Blank'

, init:
  function _init() {
    this.values = [' '] }

, render:
  function _render() {
    return this.values.join('\n') }
})

var Text = Token.derive({
  type: 'Text'

, init:
  function _Init(value) {
    this.values = [value] }

, render:
  function _Render() {
    return this.values.join('\n') }
})

var Code = Token.derive({
  type: 'Code'

, init:
  function _Init(value, language) {
    this.values   = [value]
    this.language = language }

, render:
  function _Render() {
    return !this.values.length?  ''
    :      /* otherwise */       '\n```' + this.language + '\n'
                                 + this.values.filter(Boolean).join('\n')
                                 + '\n```\n' }
})


// ## Exports
module.exports = { parse     : parse
                 , render    : render
                 , languages : languages
                 , Token     : Token
                 , Text      : Text
                 , Code      : Code
                 }