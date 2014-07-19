var path = require('path');
var _ = require('underscore');

var defaults = require('../defaults');
var extractors = exports;


extractors.registry = {};


extractors.support = function(ext, extractor) {
    extractors.registry[ext] = function(opts) {
        opts = _.defaults(opts || {}, defaults.extract);
        return extractor(opts);
    };

    return extractors;
};


extractors.unsupport = function(ext) {
    delete extractors.registry[ext];
};


extractors.get = function(ext) {
    return extractors.registry[ext];
};


extractors.get.by_filename = function(filename) {
    var ext = path.extname(filename).slice(1);
    return extractors.get(ext);
};


extractors.support('js', require('./js'));
extractors.support('hbs', require('./hbs'));
