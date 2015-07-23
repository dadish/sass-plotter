var Assert      = require('assert');
var SassPlotter = require('../');
var Vinyl       = require('vinyl');
var path        = require('path');
var fs          = require('fs');
var _           = require('underscore');

describe('set', function () {
  var plot;

  plot = new SassPlotter();

  it('should add a file to the plot', function () {
    var file, content;
    file = path.resolve('scss/a.scss');
    content = 'string';
    plot.set(file, content);
    Assert(_.isObject(plot._plot[file]));
  });

  it("should read the filepath and parse it's content", function () {
    var file;
    file = path.resolve('test/scss/a.scss');
    plot.set(file);
    Assert.strictEqual(16, plot._plot[file].resolves.length);
  });

  it("if second argument is string then should parse that string as file's content", function () {
    var file, content;
    file = path.resolve('test/scss/a.scss');
    content = fs.readFileSync(file, {encoding : 'utf8'});
    plot.set(file, content);
    Assert.strictEqual(16, plot._plot[file].resolves.length);
  });

  it("should overwrite the file in the plot if it already exists there", function () {
    var file, content;
    file = path.resolve('test/scss/a.scss');
    content = fs.readFileSync(file, {encoding : 'utf8'});
    plot.set(file, content);
    Assert.strictEqual(16, plot._plot[file].resolves.length);

    // Overwrite and make sure resolves changed
    file = path.resolve('test/scss/b.scss');
    plot.set(file);
    Assert.strictEqual(4, plot._plot[file].resolves.length);
  });

  describe('if the file does not exist and content is not provided', function () {
    var file;
    file = '/does/not/exist.txt';

    it ('should add a file to the plot', function () {
      plot.set(file);
      Assert(_.isObject(plot._plot[file]));
    });

    it ('should have `0` resolves', function () {
      plot.set(file);
      Assert.strictEqual(0, plot._plot[file].resolves.length);
    });
  });

});