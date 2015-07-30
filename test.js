var SassPlotter = require('./');
var path = require('path');

plot = new SassPlotter(path.resolve('scss'));

console.log(plot._plot);