var assert = require('assert');
var fs = require('fs');
var jspot = require('../lib');
var os = require('os');
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

    it('should ensure a newline at the end of the POSIX-standard file', function() {
        jspot.json({
            source: [
                './test/fixtures/json/simple/input/messages.po'
            ],
            target: tmpdir
        });

        lastCharacters = fs.readFileSync(path.join(tmpdir, 'messages.json'), 'utf8').slice(-2);
        assert.deepEqual(lastCharacters, '}' + os.EOL);
    });
});
