var SassPlotter = require('../');
var Assert = require('assert');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var file_a = path.resolve('test/scss/a.scss');
var file_b = path.resolve('test/scss/b.scss');
var file_c = path.resolve('test/scss/c.scss');
var file_d = path.resolve('test/scss/d.scss');
var file_e = path.resolve('test/scss/e.scss');
var file_x = path.resolve('test/scss/x.scss');

describe('imports', function () {

  beforeEach(function () {
    plot = new SassPlotter();
    plot
      .set(file_a)
      .set(file_b)
      .set(file_c)
      .set(file_d)
      .set(file_e)
      .set(file_x);
  });

  it("returns an `Array` object", function () {
    Assert.strictEqual(true, _.isArray(plot.imports(file_b)));
  });

  it("returns filepaths that imports the target", function () {
    Assert.strictEqual(2, plot.imports(file_b).length);
  });

  describe('with all test/*.scss files added to the plot', function () {
    plot = new SassPlotter('test/scss');

    var imports_test;
    imports_test = {};
    imports_test[file_a] = [file_b];
    imports_test[file_b] = [file_a, file_d];
    imports_test[file_c] = [file_a, file_d];
    imports_test[file_d] = [file_a];
    imports_test[file_e] = [file_a, file_c];
    imports_test[file_x] = [];

    _(imports_test).each(function (items, target) {
      
      _(items).each(function (item) {
        it(item + ' imports ' + target, function () {
          Assert(_(plot.imports(target)).indexOf(item) !== -1);
        });
      });

      it('there are exactly ' + items.length + ' items imports ' + target, function () {
        Assert.strictEqual(items.length, plot.imports(target).length);
      });
      
    });
  });

  it("returns empty `Array` if no file imports target", function () {
    plot.unset(file_b);
    Assert.strictEqual(0, plot.imports(file_a).length);
  });

  it("returns empty `Array` if plot does not have the file", function () {
    Assert.strictEqual(0, plot.imports('/this/is/not/real/file.md').length);
  });

  it("returned `Array` contains only unique values", function () {
    var imports;
    imports = plot.imports(file_b);
    Assert.strictEqual(imports.length, _(imports).unique().length);
  });  
});