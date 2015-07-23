SassPlotter = require('../');
Assert = require('assert');
Vinyl = require('vinyl');
path = require('path');
fs = require('fs');
_ = require('underscore');

describe('imports', function () {
  var plot, file_a, file_b, file_c, file_d, file_x;

  file_a = path.resolve('test/scss/a.scss');
  file_b = path.resolve('test/scss/b.scss');
  file_c = path.resolve('test/scss/c.scss');
  file_d = path.resolve('test/scss/d.scss');
  file_x = path.resolve('test/scss/x.scss');

  beforeEach(function () {
    plot = new SassPlotter();
    plot
      .set(file_a)
      .set(file_b)
      .set(file_c)
      .set(file_d)
      .set(file_x);
  });

  it("returns an `Array` object", function () {
    Assert.strictEqual(true, _.isArray(plot.imports(file_b)));
  });

  it("returns filepaths that imports the target", function () {
    Assert.strictEqual(3, plot.imports(file_b).length);
  });

  describe('with all test/*.scss files added to the plot', function () {

    beforeEach(function () {
      plot = new SassPlotter();
      plot
        .set(file_a)
        .set(file_b)
        .set(file_c)
        .set(file_d)
        .set(file_x);
    });

    var imports_test;
    imports_test = {};
    imports_test[file_a] = [file_b];
    imports_test[file_b] = [file_a, file_c, file_d];
    imports_test[file_c] = [file_a, file_d];
    imports_test[file_d] = [file_a];
    imports_test[file_x] = [file_a];

    _(imports_test).each(function (value, key) {
      _(value).each(function (item) {
        describe(item + ' imports ', function () {
          it(key, function () {
            Assert.strictEqual(true, _(plot.imports(key)).some(function (item_imports) {
              return item === item_imports;
            }));
          });
        });
      });
    });
    
  });

  it("returns 0 if no file imports target", function () {
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

  it("supports vinyl objects", function () {
    file = new Vinyl({
      cwd : process.cwd(),
      base : 'test/',
      path : file_a,
      contents : new Buffer(fs.readFileSync(file_a, {encoding : 'utf8'}))
    });
    Assert.strictEqual(1, plot.imports(file).length);
  });
  
});