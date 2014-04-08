var _ = require('underscore');
var path = require('path');
var helpers = require('./helpers');

var jspot = require('../lib');


describe("jspot.extract", function() {
    var tmpdir;
    var now;

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

    it("should extract gettext strings from source files into pot files",
    function() {
        jspot.extract({
            target: tmpdir,
            source: [
                './test/fixtures/extract/simple/input/a.js',
                './test/fixtures/extract/simple/input/b.js']
        });

        helpers.assert_files_equal(
            path.join(tmpdir, 'messages.pot'),
            './test/fixtures/extract/simple/output/messages.pot');
    });

    it("should allow the keyword option to be configurable", function() {
        jspot.extract({
            keyword: '_',
            target: tmpdir,
            source: [
                './test/fixtures/extract/keyword/input/a.js',
                './test/fixtures/extract/keyword/input/b.js']
        });

        helpers.assert_files_equal(
            path.join(tmpdir, 'messages.pot'),
            './test/fixtures/extract/keyword/output/messages.pot');
    });

    it("should support multiple domains", function() {
        jspot.extract({
            target: tmpdir,
            source: [
                './test/fixtures/extract/domains/input/a.js',
                './test/fixtures/extract/domains/input/b.js']
        });

        helpers.assert_files_equal(
            path.join(tmpdir, 'messages.pot'),
            './test/fixtures/extract/domains/output/messages.pot');

        helpers.assert_files_equal(
            path.join(tmpdir, 'error.pot'),
            './test/fixtures/extract/domains/output/error.pot');
    });

    it("should support multiple contexts", function() {
        jspot.extract({
            target: tmpdir,
            source: [
                './test/fixtures/extract/contexts/input/a.js',
                './test/fixtures/extract/contexts/input/b.js']
        });

        helpers.assert_files_equal(
            path.join(tmpdir, 'messages.pot'),
            './test/fixtures/extract/contexts/output/messages.pot');
    });

    it("should support configurable pot headers", function() {
        jspot.extract({
            headers: {
                'language': 'en',
                'project-id-version': '0:1:0'
            },
            target: tmpdir,
            source: ['./test/fixtures/extract/headers/input/a.js']
        });

        helpers.assert_files_equal(
            path.join(tmpdir, 'messages.pot'),
            './test/fixtures/extract/headers/output/messages.pot');
    });
});
