var _ = require('underscore');
var path = require('path');

var cli = require('../lib/cli');
var helpers = require('./helpers');


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
            cli.parse([
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
            cli.parse([
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
            cli.parse([
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
            cli.parse([
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
            cli.parse([
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
    });

    describe('json', function() {
        it("should convert the po files to json files", function() {
            cli.parse([
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
