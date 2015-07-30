var fs = require('fs');
var path = require('path');
var readDir = require('fs-readdir-recursive');
var sassImportResolve = require('sass-import-resolve');
var _ = require('underscore');

function SassPlotter (file, options) {

  this._settings = {
    cwd : process.cwd(),
    base : process.cwd()
  };

  this._settings = _.defaults(options || {}, this._settings);

  // the plot
  this._plot = {};

  if (file) setDir.apply(this, arguments);
}

SassPlotter.prototype.set = function(file, content, options) {

  if (!file) return this;

  options = _.defaults(options || {}, this._settings);

  content = content || getFileContent(file);
  
  this._plot[file] = {
    resolves : sassImportResolve(file, content, options)
  };

  return this;

};

function parseDir (dirPath) {
  dirPath = path.resolve(dirPath);
  return _(readDir(dirPath)).map(function (item) {
    return dirPath + '/' + item;
  });
}

function setDir (dirPath) {
  var files;
  files = parseDir(dirPath);

  _(files).each(function (item) {
    this.set(item, fs.readFileSync(item, {encoding : 'utf8'}));
  }, this);
}

SassPlotter.prototype.unset = function(file) {

  delete this._plot[file];

  return this;

};

function getFileContent (file) {
  var content;
  try {
    content = fs.readFileSync(file, {encoding : 'utf8'})
  } catch (e) {
    content = 'blank';
  }
  return content || 'blank';
};

SassPlotter.prototype.imports = function(file) {
  return _(this._plot).reduce(function (memo, item, key) {
    _(item.resolves).some(function (resolve) {
      if (resolve === file) {
        memo.push(key);
        return true;
      }
    });
    return memo;
  }, []);
};

SassPlotter.prototype.importedBy = function(file) {
  if (!this._plot[file]) return [];
  return _(this._plot[file].resolves).reduce(function (memo, item, key) {
    if(this._plot[item]) memo.push(item);
    return memo;
  }, [], this);
};

function getDependents (file, dependents, parsed) {
  parsed[file] = true;
  dependents.push(this.imports(file));
  dependents = _(dependents).flatten();
  _(dependents).each(function (item) {
    if (parsed[item]) return;
    dependents = getDependents.apply(this, [item, dependents, parsed]);
  }, this);
  
  return _(dependents).chain().flatten().unique().value();
}

SassPlotter.prototype.dependents = function(file) {
  return getDependents.apply(this, [file, [], {}]);
};

module.exports = SassPlotter;