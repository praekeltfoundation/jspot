var fs = require('fs');
var os = require('os');
var path = require('path');
var _ = require('underscore');
var po2json = require('po2json');

var defaults = require('./defaults');


function json(opts) {
    _.defaults(opts, defaults.json);

    (opts.source || []).forEach(function(filename) {
        var name = path.basename(filename, path.extname(filename));
        var data = po2json.parseFileSync(path.resolve(filename));
        var jsonData = JSON.stringify(data, null, 4) + os.EOL;

        fs.writeFileSync(
            path.resolve(opts.target, name + '.json'),
            jsonData);
    });
}


module.exports = json;
