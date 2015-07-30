var Assert      = require('assert');
var SassPlotter = require('../');
var path        = require('path');
var fs          = require('fs');
var _           = require('underscore');

var plot, file_a, file_b, file_c, file_d, file_e;

file_a = path.resolve('test/scss/a.scss');
file_b = path.resolve('test/scss/b.scss');
file_c = path.resolve('test/scss/c.scss');
file_d = path.resolve('test/scss/d.scss');
file_e = path.resolve('test/scss/e.scss');


describe('set', function () {
  var plot;

  plot = new SassPlotter();

  it('should add a file to the plot', function () {
    var content;
    content = 'string';
    plot.set(file_a, content);
    Assert(_.isObject(plot._plot[file_a]));
  });

  it("should read the filepath and parse it's content", function () {
    plot.set(file_a);
    Assert.strictEqual(16, plot._plot[file_a].resolves.length);
  });

  it("if second argument is string then should parse that string as file's content", function () {
    var content;
    content = fs.readFileSync(file_a, {encoding : 'utf8'});
    plot.set(file_a, content);
    Assert.strictEqual(16, plot._plot[file_a].resolves.length);
  });

  it("should overwrite the file in the plot if it already exists there", function () {
    var content;
    content = fs.readFileSync(file_a, {encoding : 'utf8'});
    plot.set(file_a, content);
    Assert.strictEqual(16, plot._plot[file_a].resolves.length);

    content = fs.readFileSync(file_b, {encoding : 'utf8'});
    plot.set(file_a, content);
    Assert.strictEqual(4, plot._plot[file_a].resolves.length);
  });

  describe('if the file does not exist and content is not provided', function () {
    var file;
    file = '/does/not/exist.txt';

    it('should add a file to the plot', function () {
      plot.set(file);
      Assert(_.isObject(plot._plot[file]));
    });

    it('should have `0` resolves', function () {
      plot.set(file);
      Assert.strictEqual(0, plot._plot[file].resolves.length);
    });
  });

  describe('Options', function () {
    var plot;
    plot = new SassPlotter('', {
      resolveSass : false
    });

    it('should pass options to sass-import-resolve', function () {
      plot.set(file_a, null, {
        resolveScss : false
      });
      Assert.strictEqual(plot._plot[file_a].resolves.length, 0);
    });

    it('should overwrite options given into cunstructor', function () {
      plot.set(file_a, null, {
        resolveSass : true
      });
      Assert.strictEqual(plot._plot[file_a].resolves.length, 16);
    });
  });

});