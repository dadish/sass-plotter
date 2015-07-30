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

describe('dependents', function () {
  var plot;
  plot = new SassPlotter('test/scss'); 
  
  it("returns an `Array` object", function () {
    Assert(_.isArray(plot.dependents(file_a)));
  });

  it("returns filepaths that are directly dependent on target", function () {
    Assert(_(plot.dependents(file_a)).indexOf(file_b) !== -1);
    Assert(_(plot.dependents(file_c)).indexOf(file_d) !== -1);
    Assert(_(plot.dependents(file_c)).indexOf(file_a) !== -1);
    Assert(_(plot.dependents(file_e)).indexOf(file_a) !== -1);
  });

  it("returns filepaths that are indirectly dependent on target", function () {
    Assert(_(plot.dependents(file_a)).indexOf(file_d) !== -1);
    Assert(_(plot.dependents(file_e)).indexOf(file_b) !== -1);
    Assert(_(plot.dependents(file_e)).indexOf(file_d) !== -1);
  });

  describe('with all test/*.scss files added to the plot', function () {
    var plot, dependents_test;
    plot = new SassPlotter('test/scss'); 
    dependents_test = {};

    dependents_test[file_a] = [file_b, file_d, file_a];
    dependents_test[file_b] = [file_d, file_a, file_b];
    dependents_test[file_c] = [file_a, file_b, file_d];
    dependents_test[file_d] = [file_a, file_b, file_d];
    dependents_test[file_e] = [file_c, file_d, file_a, file_b];

    _(dependents_test).each(function (items, target) {
      
      _(items).each(function (item) {
        it(item + ' is depends upon ' + target, function () {
          Assert(_(plot.dependents(target)).indexOf(item) !== -1);
        });
      });

      it('there are exactly ' + items.length + ' items that depend upon ' + target, function () {
        Assert.strictEqual(items.length, plot.dependents(target).length);
      });

    });
  });

  it("returns empty `Array` if there isn't any dependents", function () {
    Assert.strictEqual(0, plot.dependents(file_x).length);
  });

  it("returns empty `Array` if plot does not have the file", function () {
    Assert.strictEqual(0, plot.dependents('/file/does/not/exists.scss').length);
  });

  it("returns unique strings in an `Array`", function () {
    var dependents;
    dependents = plot.dependents(file_b);
    Assert.strictEqual(dependents.length, _(dependents).flatten().length);
  });

});