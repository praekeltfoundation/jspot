var _ = require('underscore');
var path = require('path');

var jspot = require('../lib');
var cli = require('../lib/cli');
var extract_js = require('../lib/extractors/js');
var helpers = require('./helpers');


function call_jspot(args) {
    return cli.parse(['/path/to/node', '/path/to/cli.js'].concat(args));
}

describe('cli', function() {
    var now = _.now;
    var tmpdir;

    before(function() {
        _.now = _.constant(1393369106938);
    });

    after(function() {
        _.now = now;
    });

    beforeEach(function(done) {
        helpers.tmpdir(function(err, dirname) {
            tmpdir = dirname;
            done();
        });
    });

    describe('extract', function() {
        it("should extract gettext strings from source files into pot files",
        function() {
            call_jspot([
                'extract',
                '-t', tmpdir,
                './test/fixtures/extract/simple/input/a.js',
                './test/fixtures/extract/simple/input/b.js'
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/simple/output/messages.pot');
        });

        it("should allow the keyword option to be configurable", function() {
            call_jspot([
                'extract',
                '-k', '_',
                '-t', tmpdir,
                './test/fixtures/extract/keyword/input/a.js',
                './test/fixtures/extract/keyword/input/b.js'
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/keyword/output/messages.pot');
        });

        it("should support multiple domains", function() {
            call_jspot([
                'extract',
                '-t', tmpdir,
                './test/fixtures/extract/domains/input/a.js',
                './test/fixtures/extract/domains/input/b.js'
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/domains/output/messages.pot');

            helpers.assert_files_equal(
                path.join(tmpdir, 'error.pot'),
                './test/fixtures/extract/domains/output/error.pot');
        });

        it("should support multiple contexts", function() {
            call_jspot([
                'extract',
                '-t', tmpdir,
                './test/fixtures/extract/contexts/input/a.js',
                './test/fixtures/extract/contexts/input/b.js'
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/contexts/output/messages.pot');
        });

        it("should support configurable pot headers", function() {
            call_jspot([
                'extract',
                '--header=language:en',
                '--header=project-id-version:0:1:0',
                '-t', tmpdir,
                './test/fixtures/extract/headers/input/a.js',
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/headers/output/messages.pot');
        });

        it("should support custom extractors", function() {
            call_jspot([
                'extract',
                '-t', tmpdir,
                '-e', 'txt:./test/fixtures/extract/extractors/input/jspot-txt',
                './test/fixtures/extract/extractors/input/a.txt',
                './test/fixtures/extract/extractors/input/b.txt',
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/extractors/output/messages.pot');
        });

        it("should allow custom extractors to override builtins", function() {
            call_jspot([
                'extract',
                '-t', tmpdir,
                '-e',
                'js:./test/fixtures/extract/extractors-override/input/jspot-js',
                './test/fixtures/extract/extractors-override/input/a.js',
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/extractors-override/output/messages.pot');

            // restore the original extractor
            jspot.extractors.support('js', extract_js);
        });
    });

    describe('json', function() {
        it("should convert the po files to json files", function() {
            call_jspot([
                'json',
                '-t', tmpdir,
                './test/fixtures/json/simple/input/error.po',
                './test/fixtures/json/simple/input/messages.po'
            ]);

            helpers.assert_files_equal(
                path.join(tmpdir, 'error.json'),
                './test/fixtures/json/simple/output/error.json');

            helpers.assert_files_equal(
                path.join(tmpdir, 'messages.json'),
                './test/fixtures/json/simple/output/messages.json');
        });
    });
});
