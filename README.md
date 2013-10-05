Sug!
====

[![Dependencies Status](https://david-dm.org/killdream/sug.png)](https://david-dm.org/killdream/sug.png)
[![NPM version](https://badge.fury.io/js/sug.png)](http://badge.fury.io/js/sug)
[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

Sucks Markdown outta yo source code, regardless of language.

Basically, it'll transform:

```js
// # Function identity(a)
// The identity function.
function identity(a){ return a }
```

Into:

    # Function identity(a)
    The identity function.

    ```js
    function identity(a) { return a }
    ```
    

## Installing

    $ npm install -g sug
    

## Basic usage

    $ sug convert your-file.js
    $ cat your-file.md

## sug(1)

    sug --- Sucks Markdown outta your source files.

    sug languages               Display supported languages
    sug convert <files...>      Converts files to Markdown
    sug -h | --help             Displays help text
    sug --version               Displays version number

    Options:
      -o --output=DIR           The output directory
      -l --language=LANG        Forces using language for all files


## Platform support

Sug will run sweetly on top of Node 0.10+, with the new Stream support.


## Licence

Copyright (c) 2013 Quildreen Motta.

Released under the [MIT licence](https://github.com/hifivejs/alright/blob/master/LICENCE).

