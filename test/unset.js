var SassPlotter = require('../');
var Assert = require('assert');
var Vinyl = require('vinyl');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

describe('unset', function () {
  var plot, file;
  
  it("should remove the file from the plot", function () {
    plot = new SassPlotter();
    file = path.resolve('test/scss/a.scss');
    plot.set(file);
    plot.unset(file);
    Assert.strictEqual(true, _.isUndefined(plot._plot[file]));
  });

  describe('if first argument is a vinyl', function () {

    beforeEach(function () {
      plot = new SassPlotter();
      file = path.resolve('test/scss/a.scss');
      plot.set(file);
      file = new Vinyl({
        cwd : process.cwd(),
        base : 'test/',
        path : file,
        contents : new Buffer(fs.readFileSync(file, {encoding : 'utf8'}))
      });
      plot.set(file);
    });
    
    it("should remove the file from the plot", function () {
      plot.unset(file);
      Assert.strictEqual(false, _.isUndefined(plot._plot));
      Assert.strictEqual(true, _.isUndefined(plot._plot[file.path]));
    });
  });

  describe('if the file does not exist', function () {
    
    beforeEach(function () {
      plot = new SassPlotter();
      file = 'it/does/not/exist.txt';
      plot.set(file);
    });

    it('should remove the file from the plot', function () {
      Assert.strictEqual(false, _.isUndefined(plot._plot[file]));
      plot.unset(file);
      Assert.strictEqual(true, _.isUndefined(plot._plot[file]));
    });    
  });

});