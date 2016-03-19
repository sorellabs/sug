#!/usr/bin/env node
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

var doc = "sug --- Sucks Markdown outta your source files.\n"
        + "\n"
        + "Usage:\n"
        + "  sug languages\n"
        + "  sug [options] convert <files>...\n"
        + "  sug -h | --help\n"
        + "  sug --version\n"
        + "\n"
        + "Options:\n"
        + "  -o --output=DIR            The output directory.\n"
        + "  -l --language=LANG         Forces use of language for all files.\n"
        + "  -d --doconly               Omits code sections from the output.\n"
        + "\n"

var fs     = require('fs')
var path   = require('path')
var pkg    = require('../package')
var docopt = require('docopt').docopt
var sug    = require('../')
var cli    = require('../cli')
var λ      = require('prelude-ls')

var read  = fs.readFileSync
var write = fs.writeFileSync

var args  = docopt(doc, { version: pkg.version })


  args.languages?  listLanguages()
: args.convert?    convertFiles(args['<files>'], args['--output']
                                               , args['--language']
                                               , args['--doconly'])
: /* otherwise */  printHelp()


function listLanguages() {
  var langs       = λ.values(sug.languages)
  var largestName = λ.maximum(langs.map(function(a){ return a.name.length })) + 6

  console.log('Available languages:\n')
  console.log(langs.map(function(a){
                var spacing = Array(largestName - a.name.length).join(' ')
                return ' - ' + a.name + spacing + a.friendlyName }).join('\n'))}


function convertFiles(xs, output, language, doconly) {
  output = output || '.'

  xs.forEach(function(x) {
    var filename = path.basename(x, path.extname(x))
    var outfile  = path.join(output, filename + '.md')
    try {
      fs.writeFileSync(outfile, cli.convert(x, language, doconly), 'utf-8')
      console.log('Successfully converted: ' + x) }
    catch (e) {
      if (e.name != 'ConversionError') throw e
      console.log('Error: ' + e.message) }
  })}

function printHelp() {
  console.log(doc)
  process.exit(1) }
