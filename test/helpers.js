var fs = require('fs');
var path = require('path');
var assert = require('assert');

var tmp = require('tmp');
tmp.setGracefulCleanup();


var helpers = exports;


helpers.assert_files_equal = function(actual_path, expected_path) {
    var actual = fs.readFileSync(path.resolve(actual_path));
    var expected = fs.readFileSync(path.resolve(expected_path));
    assert.equal(actual.toString(), expected.toString());
};


helpers.tmpdir = function(done) {
    tmp.dir({
        unsafeCleanup: true,
        prefix: 'jspot-test-',
    }, function(err, dirname) {
        if (err) {
            done(err);
        }

        done(null, dirname);
    });
};
