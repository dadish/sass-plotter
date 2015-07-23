var fs = require('fs');
var readDir = require('fs-readdir-recursive');
var sassImportResolve = require('sass-import-resolve');
var _ = require('underscore');

var defaultOptions = {
  cwd : process.cwd()
};

function SassPlotter (file, options) {

  options = _.defaults(defaultOptions, options);

  this.cwd = options.cwd;

  this.base = options.base || options.cwd;
  
  // the plot
  this._plot = {};

  if (file) this.setDir(file);
}

SassPlotter.prototype.set = function(file, content) {

  if (!file) return;

  content = content || this.getFileContent(file);
  
  this._plot[file] = {
    resolves : sassImportResolve(file, content)
  };

  return this;

};

SassPlotter.prototype.setDir = function(file) {
  
};

SassPlotter.prototype.unset = function(file) {

  delete this._plot[file];

  return this;

};

SassPlotter.prototype.getFileContent = function(file) {
  var content;
  try {
    content = fs.readFileSync(file, {encoding : 'utf8'})
  } catch (e) {
    content = 'blank';
  }
  return content || 'blank';
};

SassPlotter.prototype.imports = function(file) {
  var imports;
  imports = [];

  imports = _(this._plot).reduce(function (memo, item, key) {
    _(item.resolves).some(function (resolve) {
      if (resolve === file) {
        memo.push(key);
        return true;
      }
    });
    return memo;
  }, []);

  return imports;
};

SassPlotter.prototype.importedBy = function(file) {
  
};

module.exports = SassPlotter;