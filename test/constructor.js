var Assert = require('assert');
var SassPlotter = require('../');
var _ = require('underscore');

describe('Constructor', function () {
  
  it('should have a `_plot` property object assigned', function () {
    var plotter;
    plotter = new SassPlotter();
    Assert(_.isObject(plotter._plot));
  });

  it('should parse given directory and build plot from it');

});