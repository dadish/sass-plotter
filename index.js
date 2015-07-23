var fs = require('fs');
var path = require('path');
var Vinyl = require('vinyl');
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

  file = this.vinylIt(file, content);
  
  this._plot[file.path] = {
    resolves : sassImportResolve(file.path, file.contents.toString())
  };

  return this;

};

SassPlotter.prototype.setDir = function(file) {
  
};

SassPlotter.prototype.unset = function(file) {

  if (file instanceof Vinyl) file = file.path;

  delete this._plot[file];

  return this;

};

SassPlotter.prototype.vinylIt = function(file, content) {
  if (file instanceof Vinyl) return file;

  content = content || this.getFileContent(file);

  return new Vinyl({
    cwd : this.cwd,
    base : this.base,
    path : file,
    contents : new Buffer(content)
  });
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
  file = this.vinylIt(file);

  imports = _(this._plot).reduce(function (memo, item, key) {
    _(item.resolves).some(function (resolve) {
      if (resolve === file.path) {
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