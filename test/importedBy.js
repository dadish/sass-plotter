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

describe('importedBy', function () {
  var plot;
  plot = new SassPlotter('test/scss'); 

  it("returns an `Array` object", function () {
    Assert(_.isArray(plot.importedBy(file_a)));
  });

  it("returns an `Array` of filepaths that are imported by target", function () {
    var importedBy;
    importedBy = plot.importedBy(file_a);
    Assert.strictEqual(4, importedBy.length);
    Assert(_(importedBy).indexOf(file_b) !== -1);
    Assert(_(importedBy).indexOf(file_c) !== -1);
    Assert(_(importedBy).indexOf(file_d) !== -1);
  });

  it("returns an empty `Array` if no file is imported by target", function () {
    Assert.strictEqual(0, plot.importedBy(file_e).length);
  });

  it("returns an empty `Array` if the target is not in the plot", function () {
    Assert.strictEqual(0, plot.importedBy('/is/not/in/the/plot.scss').length);
  });

  it("returned `Array` contains only unique values", function () {
    var importedBy;

    importedBy = plot.importedBy(file_a);
    Assert.strictEqual(importedBy.length, _(importedBy).unique().length);

    importedBy = plot.importedBy(file_b);
    Assert.strictEqual(importedBy.length, _(importedBy).unique().length);

    importedBy = plot.importedBy(file_c);
    Assert.strictEqual(importedBy.length, _(importedBy).unique().length);

    importedBy = plot.importedBy(file_d);
    Assert.strictEqual(importedBy.length, _(importedBy).unique().length);

    importedBy = plot.importedBy(file_e);
    Assert.strictEqual(importedBy.length, _(importedBy).unique().length);
  });

  describe('with all test/*.scss files added to the plot', function () {
    var plot;
    plot = new SassPlotter('test/scss');

    var importedBy_test;
    importedBy_test = {};
    importedBy_test[file_a] = [file_b, file_c, file_d, file_e];
    importedBy_test[file_b] = [file_a];
    importedBy_test[file_c] = [file_e];
    importedBy_test[file_d] = [file_b, file_c];
    importedBy_test[file_e] = [];
    importedBy_test[file_x] = [];

    _(importedBy_test).each(function (items, target) {
      
      _(items).each(function (item) {
        it(item + ' is imported by ' + target, function () {
          Assert(_(plot.importedBy(target)).indexOf(item) !== -1);
        });
      });

      it('there are exactly ' + items.length + ' items imported by ' + target, function () {
        Assert.strictEqual(items.length, plot.importedBy(target).length);
      });
    });
  })
  
});