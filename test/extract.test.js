var assert = require('assert');
var extract = require('../lib/extract');

describe("extract", function() {
    it("should work with concatenated strings", function() {
        assert.deepEqual(
            extract("gettext('foo' + 'bar');"),
            [{
                key: 'foobar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 1,
                filename: ''
            }]);
    });

    it("should work with array joined strings", function() {
        assert.deepEqual(
            extract("gettext(['foo', 'bar'].join(' '));"),
            [{
                key: 'foo bar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 1,
                filename: ''
            }]);
    });

    it("should show line numbers in errors", function() {
        assert.throws(function() {
            extract([
                "function palpatine() {",
                "    gettext(null);",
                "}"
            ].join('\n'),
            {filename: 'foo.js'});
        },
        /on line 2 of file 'foo.js'/);
    });

    it("should allow a different keyword to be used", function() {
        assert.deepEqual(
            extract([
                "function luke() {",
                "    _('foo');",
                "    _.gettext('bar');",
                "    thing._('baz');",
                "    thing.subthing._('qux');",
                "    thing.subthing._.gettext('corge');",
                "}"
            ].join('\n'),
            {keyword: '_'}),
            [{
                key: 'foo',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 2,
                filename: ''
            }, {
                key: 'bar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 3,
                filename: ''
            }, {
                key: 'baz',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 4,
                filename: ''
            }, {
                key: 'qux',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 5,
                filename: ''
            }, {
                key: 'corge',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 6,
                filename: '',
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: ''
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: ''
                }, {
                    key: 'baz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: ''
                }, {
                    key: 'qux',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: ''
                }, {
                    key: 'corge',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: ''
                }, {
                    key: 'grault',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: ''
                }, {
                    key: 'garply',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: ''
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: '',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: '',
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: '',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: '',
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: '',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: '',
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: '',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: '',
                }, {
                    key: 'baz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: '',
                }, {
                    key: 'qux',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: '',
                }, {
                    key: 'corge',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: '',
                }, {
                    key: 'grault',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: '',
                }, {
                    key: 'garply',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: '',
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: ''
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: ''
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: ''
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: ''
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
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: ''
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: ''
                }]);
        });
    });
});
