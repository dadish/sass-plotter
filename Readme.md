sass-plotter
============

Create sass dependency plot from scss files or your wicked mind.

[![Build Status](https://travis-ci.org/dadish/sass-plotter.svg?branch=master)](https://travis-ci.org/dadish/sass-plotter)

The module allows you to create a scss dependency graph just like [sass-graph][sass-graph].
The difference is that it does not depend on actual files on your machine.
This allows you to `set()`, `unset()` the files into the plot to manipulate the
graph for your needs.

## Installation
Install with [npm][npm]
```bash
$ npm install sass-import-resolve
```

##Usage
```js
var SassPlotter = require('sass-plotter');

// Create an empty plotter object
var plot = new SassPlotter();

// Or if you want to start from your existing files
var plot = new SassPlotter('/path/to/your/scss/files/');
```


##API

###constructor
```js
var plot = new SassPlotter([path[, options]]);
```
#####path
The full path to the directory with your scss files.
#####options
Set the default behavior in the constructor. The options are those of [sass-import-resolve][sass-import-resolve], 
see the [options][sass-import-resolve-options] section there for more details.

###set
Adds the file into the scss dependency plot. Or overwrites the existing if
there is already a file with same filepath in the plot.
```js
plot.set(file, [content[, options]]);
```
#####file
The path of the scss file.
#####content
The optional content of your file.
#####options
Options on how to parse the file. Passed to the [sass-import-resolve][sass-import-resolve].

###unset
Removes the file from the plot.
```js
plot.unset(file);
```
#####file
The path of the scss file.

###imports
Returns the filepaths that imports the file.
```js
plot.imports(file);
```
#####file
The path of the scss file.

###importedBy
Returns the filepaths that the file imports.
```js
plot.importedBy(file);
```
#####file
The path of the scss file.

###dependents
Returns the filepaths that are affected by a given file. Say you change the content
of the `example.scss` it will return all files that has directly or indirectly
imported and thus depend on `example.scss`.
```js
plot.dependents(file);
```
#####file
The path of the scss file.



##Test
```
$ npm install
$ npm test
```

##License
[MIT][license]

[sass-graph]: http://npmjs.org/package/sass-graph
[sass-import-resolve]: http://npmjs.org/package/sass-import-resolve
[sass-import-resolve-options]: http://npmjs.org/package/sass-import-resolve#options
[vinyl]: http://npmjs.org/package/vinyl
[license]: https://raw.githubusercontent.com/dadish/sass-plotter/master/LICENSE
[npm]: https://npmjs.org