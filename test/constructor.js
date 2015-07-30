var SassPlotter = require('../');
var Assert = require('assert');
var path = require('path');
var _ = require('underscore');

var file_a = path.resolve('test/scss/a.scss');
var file_b = path.resolve('test/scss/b.scss');
var file_c = path.resolve('test/scss/c.scss');
var file_d = path.resolve('test/scss/d.scss');
var file_e = path.resolve('test/scss/e.scss');

describe('Constructor', function () {
  
  it('should have a `_plot` property object assigned', function () {
    var plotter;
    plotter = new SassPlotter();
    Assert(_.isObject(plotter._plot));
  });

  it('should parse given directory and build plot from it', function () {
    plot = new SassPlotter(path.resolve('test/scss'));
    Assert(_.isObject(plot._plot));
    Assert(!_.isEmpty(plot._plot));
  });

  describe('Options', function () {
    var plotWithOptions;
    it('should pass options to sass-import-resolve', function () {
      plot = new SassPlotter(path.resolve('test/scss'));
      plotWithOptions = new SassPlotter(path.resolve('test/scss'), {
        resolveScss : false
      });
      Assert.strictEqual(plot._plot[file_a].resolves.length / 2, plotWithOptions._plot[file_a].resolves.length);
      Assert.strictEqual(!!_(plot._plot[file_a].resolves).indexOf(file_b), _(plotWithOptions._plot[file_a].resolves).indexOf(file_b) === -1);
    });

  });

});