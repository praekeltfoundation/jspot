var fs = require('fs');
var util = require('util');
var path = require('path');
var _ = require('underscore');
var parser = require('gettext-parser');

var defaults = require('./defaults');
var extractors = require('./extractors');
var pot = require('./pot');


function extract(opts) {
    opts = _.defaults(opts || {}, defaults.extract);

    var extracts = (opts.source || []).reduce(function(results, filename) {
        var extractor = extractors.get.by_filename(filename);

        if (!extractor) {
            throw new Error(util.format(
                "No extractor found for file '%s'", filename));
        }

        return results.concat(extractor(_.extend({}, opts, {
            filename: filename,
            source: fs
                .readFileSync(path.resolve(filename))
                .toString()
        })));
    }, []);

    var pots = pot({
        extracts: extracts,
        headers: opts.headers
    });

    _.each(pots, function(pot, domain) {
        fs.writeFileSync(
            path.resolve(opts.target, domain + '.pot'),
            parser.po.compile(pot) + '\n');
    });
}


module.exports = extract;
