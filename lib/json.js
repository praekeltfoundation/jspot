var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var po2json = require('po2json');

var defaults = require('./defaults');


function json(opts) {
    _.defaults(opts, defaults.json);

    opts.source.forEach(function(filename) {
        var name = path.basename(filename, path.extname(filename));
        var data = po2json.parseFileSync(path.resolve(filename));

        fs.writeFileSync(
            path.resolve(opts.target, name + '.json'),
            JSON.stringify(data, null, 4));
    });
}


module.exports = json;
