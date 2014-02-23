var assert = require('assert');
var extract = require('../lib/extract');

describe("extract", function() {
    it("should work with concatenated strings", function() {
        assert.deepEqual(
            extract("gettext('foo' + 'bar');"),
            [{
                method: 'gettext',
                params: {message: 'foobar'}
            }]);
    });

    it("should work with array joined strings", function() {
        assert.deepEqual(
            extract("gettext(['foo', 'bar'].join(' '));"),
            [{
                method: 'gettext',
                params: {message: 'foo bar'}
            }]);
    });

    describe("gettext", function() {
        it("should extract member calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                    "    this.gettext('foo');",
                    "    thing.gettext('bar');",
                    "    thing.gettext.call(null, 'baz');",
                    "    thing.gettext.apply(null, ['qux']);",
                    "    thing.subthing.gettext('corge');",
                    "    thing.subthing.gettext.call(null, 'grault');",
                    "    thing.subthing.gettext.apply(null, ['garply']);",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }, {
                    method: 'gettext',
                    params: {message: 'baz'}
                }, {
                    method: 'gettext',
                    params: {message: 'qux'}
                }, {
                    method: 'gettext',
                    params: {message: 'corge'}
                }, {
                    method: 'gettext',
                    params: {message: 'grault'}
                }, {
                    method: 'gettext',
                    params: {message: 'garply'}
                }]);
        });

        it("should extract direct calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                        "gettext('foo');",
                        "gettext('bar');",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }]);
        });

        it("should extract '.call' calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                        "gettext.call(null, 'foo');",
                        "gettext.call(null, 'bar');",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }]);
        });

        it("should extract '.apply' calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                        "gettext.apply(null, ['foo']);",
                        "gettext.apply(null, ['bar']);",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }]);
        });
    });

    describe("gettext.gettext", function() {
        it("should extract member calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                    "    this.gettext.gettext('foo');",
                    "    thing.gettext.gettext('bar');",
                    "    thing.gettext.gettext.call(null, 'baz');",
                    "    thing.gettext.gettext.apply(null, ['qux']);",
                    "    thing.subthing.gettext.gettext('corge');",
                    "    thing.subthing.gettext.gettext.call(null, 'grault');",
                    "    thing.subthing.gettext.gettext.apply(null, ['garply']);",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }, {
                    method: 'gettext',
                    params: {message: 'baz'}
                }, {
                    method: 'gettext',
                    params: {message: 'qux'}
                }, {
                    method: 'gettext',
                    params: {message: 'corge'}
                }, {
                    method: 'gettext',
                    params: {message: 'grault'}
                }, {
                    method: 'gettext',
                    params: {message: 'garply'}
                }]);
        });

        it("should extract direct calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                        "gettext.gettext('foo');",
                        "gettext.gettext('bar');",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }]);
        });

        it("should extract '.call' calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                        "gettext.gettext.call(null, 'foo');",
                        "gettext.gettext.call(null, 'bar');",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }]);
        });

        it("should extract '.apply' calls", function() {
            assert.deepEqual(
                extract([
                    "function luke() {",
                        "gettext.gettext.apply(null, ['foo']);",
                        "gettext.gettext.apply(null, ['bar']);",
                    "}"
                ].join('\n')),
                [{
                    method: 'gettext',
                    params: {message: 'foo'}
                }, {
                    method: 'gettext',
                    params: {message: 'bar'}
                }]);
        });
    });
});
