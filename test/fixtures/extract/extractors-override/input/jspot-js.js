var _extract = require('../../../../../lib/extractors/js');


function extract(opts) {
    var results = _extract(opts);

    results.forEach(function(d) {
        d.key += '!';
    });

    return results;
}


module.exports = extract;
