var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var tmp = require('tmp');
var cli = require('../lib/cli');


describe('cli', function() {
    var now = _.now;
    var tmpdir;

    tmp.setGracefulCleanup();

    before(function() {
        _.now = _.constant(1393369106938);
    });

    after(function() {
        _.now = now;
    });

    beforeEach(function(done) {
        tmp.dir({
            unsafeCleanup: true,
            prefix: 'jspot-test-',
        }, function(err, dirname) {
            if (err) {
                done(err);
            }

            tmpdir = dirname;
            done();
        });
    });

    function assert_files_equal(actual_path, expected_path) {
        var actual = fs.readFileSync(path.resolve(actual_path));
        var expected = fs.readFileSync(path.resolve(expected_path));
        assert.equal(actual.toString(), expected.toString());
    }

    describe('extract', function() {
        it("should extract gettext strings from js files into pot files",
        function() {
            cli.parse([
                'extract',
                '-t', tmpdir,
                './test/fixtures/extract/simple/input/a.js',
                './test/fixtures/extract/simple/input/b.js'
            ]);

            assert_files_equal(
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

            assert_files_equal(
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

            assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/domains/output/messages.pot');

            assert_files_equal(
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

            assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/contexts/output/messages.pot');
        });

        it("should support configurable pot headers", function() {
            cli.parse([
                'extract',
                '--header=language:en',
                '--header=project-id-version:0.1.0',
                '-t', tmpdir,
                './test/fixtures/extract/headers/input/a.js',
            ]);

            assert_files_equal(
                path.join(tmpdir, 'messages.pot'),
                './test/fixtures/extract/headers/output/messages.pot');
        });
    });
});
