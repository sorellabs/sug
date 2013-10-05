// # Module: sug/cli
//
// Utilities for processing files for the command line.
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

var sug  = require('./index')
var fs   = require('fs')
var flaw = require('flaw')
var _    = require('prelude-ls')

var ConversionError = flaw('ConversionError')

function read(filename) {
  return fs.readFileSync(filename, 'utf-8') }

function languageForFile(filename) {
  return _.Obj.find(function(a) { return a.extension.test(filename) }, sug.languages) }

function languageFromName(name) {
  return name in sug.languages?  sug.languages[name]
  :      /* otherwise */         raise(ConversionError("Language <" + name + "> not supported.")) }

function raise(error) {
  throw error }

function convert(filename, languageName) {
  var language = languageName?    languageFromName(languageName)
               : /* otherwise */  languageForFile(filename)

  if (!language)  throw ConversionError("Does not know how to handle: " + filename)

  return sug.render(sug.parse(read(filename), language)) }

module.exports = { convert: convert
                 , languageFromName: languageFromName
                 , languageFromFile: languageForFile
                 }
