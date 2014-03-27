var fs = require('fs');
var path = require('path');
var parser = require('gettext-parser');
var po2json = require('po2json');
var _ = require('underscore');

var extract = require('./extract');
var jspot = module.exports;

jspot.defaults = require('./defaults');
jspot.gettext = require('./gettext');
jspot.pot = require('./pot');


jspot.extract = function(opts) {
    _.defaults(opts.headers, {});

    var extracts = opts.source.reduce(function(extracts, filename) {
        var src = fs.readFileSync(path.resolve(filename));

        return extracts.concat(extract(src.toString(), {
            keyword: opts.keyword,
            filename: filename
        }));
    }, []);

    var pots = jspot.pot(extracts, {
        headers: opts.headers
    });

    _(pots).each(function(pot, domain) {
        fs.writeFileSync(
            path.resolve(opts.target, domain + '.pot'),
            parser.po.compile(pot) + '\n');
    });
};


jspot.json = function(opts) {
    _.defaults(opts, jspot.defaults.json);

    opts.source.forEach(function(filename) {
        var name = path.basename(filename, path.extname(filename));
        var data = po2json.parseFileSync(path.resolve(filename));

        fs.writeFileSync(
            path.resolve(opts.target, name + '.json'),
            JSON.stringify(data, null, 4));
    });
};
