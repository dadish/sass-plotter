sass-plotter
============

Create sass dependency plot from your scss files or your wicked mind.

The module allows you to create a scss dependency graph just like [sass-graph][sass-graph].
The difference is that it does not depend on actual files on your machine.
This allows you to create dependency graph with virtual files like [vinyl][vinyl], you can
`add()` or `remove()` files, you can set default prepend of a `_base.scss` on each
file and so on.

##Usage
```js
var SassPlotter = require('sass-plotter');

// Create an empty plotter object
var plot = new SassPlotter();

// Or if you want to start from your existing files
var plot = new SassPlotter('/path/to/your/scss/files/');
```


##API

###Constructor
```js
var plot = new SassPlotter([path], [options]);
```
#####path
The full path to the directory with your scss files.
#####options
...

###Set
Adds the file into the scss dependency plot. Or overwrites the existing if
there is already a file with same filepath in the plot.
```js
plot.set(file, [content]);
```
#####file
The path of the scss file or a vinyl object.
#####content
The optional content of your file. If the `file` argument is vinyl then this
argument is ignored and the content is taken from vinyl object instead.

###Unset
Removes the file from the plot.
```js
plot.unset(file);
```
#####file
The path of the scss file or a vinyl object.

###Dependents
Returns the filepaths that are affected by a given file. Say you change the content
of the `example.scss` it will return all files that has directly or indirectly
imported it and thus depend on `example.scss`.
```js
plot.dependents(file);
```
#####file
The path of the scss file or a vinyl object.



##Test
```
npm test
```

##License
[MIT][license]

[sass-graph]: http://npmjs.org/package/sass-graph
[vinyl]: http://npmjs.org/package/vinyl
[license]: https://raw.githubusercontent.com/dadish/sass-plotter/master/LICENSE