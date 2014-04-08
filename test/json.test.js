var jspot = require('../lib');
var path = require('path');
var helpers = require('./helpers');


describe("jspot.json", function() {
    var tmpdir;

    beforeEach(function(done) {
        helpers.tmpdir(function(err, dirname) {
            tmpdir = dirname;
            done();
        });
    });

    it("should convert the po files to json files", function() {
        jspot.json({
            source: [
                './test/fixtures/json/simple/input/error.po',
                './test/fixtures/json/simple/input/messages.po'
            ],
            target: tmpdir
        });

        helpers.assert_files_equal(
            path.join(tmpdir, 'error.json'),
            './test/fixtures/json/simple/output/error.json');

        helpers.assert_files_equal(
            path.join(tmpdir, 'messages.json'),
            './test/fixtures/json/simple/output/messages.json');
    });
});
