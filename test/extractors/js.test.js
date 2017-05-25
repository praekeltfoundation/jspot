var assert = require('assert');
var jspot = require('../../lib');


describe("jspot.extractors:js", function() {
    var extractor = jspot.extractors.get('js');

    it("should work with concatenated strings", function() {
        assert.deepEqual(
            extractor({
                filename: 'foo.js',
                source: "gettext('foo' + 'bar');"
            }),
            [{
                key: 'foobar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 1,
                filename: 'foo.js'
            }]);
    });

    it("should work with array joined strings", function() {
        assert.deepEqual(
            extractor({
                filename: 'foo.js',
                source: "gettext(['foo', 'bar'].join(' '));"
            }),
            [{
                key: 'foo bar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 1,
                filename: 'foo.js'
            }]);
    });

    it("should show line numbers in errors", function() {
        assert.throws(function() {
            extractor({
                filename: 'foo.js',
                source: [
                    "function palpatine() {",
                    "    gettext(null);",
                    "}"
                ].join('\n'),
            });
        },
        /on line 2 of file 'foo.js'/);
    });

    it("throw error with identifier instead of singular string key", function() {
        assert.throws(function() {
            extractor({
                filename: 'foo.js',
                source: [
                    "function palpatine() {",
                    "    gettext(foo);",
                    "}"
                ].join('\n')
            });
        },
        /on line 2 of file 'foo.js'/);
    });

    it("should allow a different keyword to be used", function() {
        assert.deepEqual(
            extractor({
                keyword: '_',
                filename: 'foo.js',
                source: [
                    "function luke() {",
                    "    _('foo');",
                    "    _.gettext('bar');",
                    "    thing._('baz');",
                    "    thing.subthing._('qux');",
                    "    thing.subthing._.gettext('corge');",
                    "}"
                ].join('\n')
            }),
            [{
                key: 'foo',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 2,
                filename: 'foo.js'
            }, {
                key: 'bar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 3,
                filename: 'foo.js'
            }, {
                key: 'baz',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 4,
                filename: 'foo.js'
            }, {
                key: 'qux',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 5,
                filename: 'foo.js'
            }, {
                key: 'corge',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 6,
                filename: 'foo.js',
            }]);
    });

    it("should ignore context arguments", function() {
        assert.deepEqual(
            extractor({
                filename: 'foo.js',
                source: [
                    "function luke() {",
                    "    thing.gettext.call(ignore_me, 'foo');",
                    "    thing.gettext.apply(ignore_me, ['bar']);",
                    "}"
                ].join('\n')
            }),
            [{
                key: 'foo',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 2,
                filename: 'foo.js'
            }, {
                key: 'bar',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 3,
                filename: 'foo.js'
            }]);
    });

    it("should work with es2015 syntax", function() {
        assert.deepEqual(
            extractor({
                filename: 'foo.js',
                source: "class Foo {bar() { gettext('baz'); }}"
            }),
            [{
                key: 'baz',
                plural: null,
                domain: 'messages',
                context: '',
                category: null,
                line: 1,
                filename: 'foo.js'
            }]);
    });

    it("should not try to eval template literal", function() {
        assert.deepEqual(
            extractor({
                filename: 'foo.js',
                source: "var msg = gettext.ngettext(`${count} mississippi`, `${count} mississippis`, count);"
            }), [{
                key: '${count} mississippi',
                plural: '${count} mississippis',
                domain: 'messages',
                context: '',
                category: null,
                line: 1,
                filename: 'foo.js',
            }]);
    });

    it("should work allow overriding parser options", function() {
        var testOptions = {
            filename: 'foo.js',
            source: "gettext('foobar');"
        };

        extractor(testOptions);

        assert.deepEqual(testOptions.parserOptions, {
            locations: true
        });

        testOptions.parserOptions = {
            ecmaVersion: 5,
            hello: 'world'
        };

        extractor(testOptions);

        assert.deepEqual(testOptions.parserOptions, {
            ecmaVersion: 5,
            locations: true,
            hello: 'world'
        });
    });

    describe("gettext", function() {
        it("should extract member calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                        "    this.gettext('foo');",
                        "    thing.gettext('bar');",
                        "    thing.gettext.call(null, 'baz');",
                        "    thing.gettext.apply(null, ['qux']);",
                        "    thing.subthing.gettext('corge');",
                        "    thing.subthing.gettext.call(null, 'grault');",
                        "    thing.subthing.gettext.apply(null, ['garply']);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }, {
                    key: 'baz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: 'foo.js'
                }, {
                    key: 'qux',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: 'foo.js'
                }, {
                    key: 'corge',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js'
                }, {
                    key: 'grault',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: 'foo.js'
                }, {
                    key: 'garply',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js'
                }]);
        });

        it("should extract direct calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                            "gettext('foo');",
                            "gettext('bar');",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }]);
        });

        it("should extract '.call' calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                            "gettext.call(null, 'foo');",
                            "gettext.call(null, 'bar');",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }]);
        });

        it("should extract '.apply' calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                            "gettext.apply(null, ['foo']);",
                            "gettext.apply(null, ['bar']);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }]);
        });
    });

    describe("gettext.gettext", function() {
        it("should extract member calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                        "    this.gettext.gettext('foo');",
                        "    thing.gettext.gettext('bar');",
                        "    thing.gettext.gettext.call(null, 'baz');",
                        "    thing.gettext.gettext.apply(null, ['qux']);",
                        "    thing.subthing.gettext.gettext('corge');",
                        "    thing.subthing.gettext.gettext.call(null, 'grault');",
                        "    thing.subthing.gettext.gettext.apply(null, ['garply']);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }, {
                    key: 'baz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: 'foo.js',
                }, {
                    key: 'qux',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: 'foo.js',
                }, {
                    key: 'corge',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js',
                }, {
                    key: 'grault',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: 'foo.js',
                }, {
                    key: 'garply',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js',
                }]);
        });

        it("should extract direct calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                            "gettext.gettext('foo');",
                            "gettext.gettext('bar');",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]);
        });

        it("should extract '.call' calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                            "gettext.gettext.call(null, 'foo');",
                            "gettext.gettext.call(null, 'bar');",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]);
        });

        it("should extract '.apply' calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                            "gettext.gettext.apply(null, ['foo']);",
                            "gettext.gettext.apply(null, ['bar']);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]);
        });
    });

    describe("gettext.ngettext", function() {
        it("should extract member calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                        "    this.gettext.ngettext('foo', 'foos', 6);",
                        "    thing.gettext.ngettext('bar', 'bars', 6);",
                        "    thing.gettext.ngettext.call(null, 'baz', 'bazs', 6);",
                        "    thing.gettext.ngettext.apply(null, ['qux', 'quxs', 6]);",
                        "    thing.subthing.gettext.ngettext('corge', 'corges', 6);",
                        "    thing.subthing.gettext.ngettext.call(null, 'grault', 'graults', 6);",
                        "    thing.subthing.gettext.ngettext.apply(null, ['garply', 'garplies', 6]);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: 'foos',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: 'bars',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }, {
                    key: 'baz',
                    plural: 'bazs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: 'foo.js',
                }, {
                    key: 'qux',
                    plural: 'quxs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: 'foo.js',
                }, {
                    key: 'corge',
                    plural: 'corges',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js',
                }, {
                    key: 'grault',
                    plural: 'graults',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: 'foo.js',
                }, {
                    key: 'garply',
                    plural: 'garplies',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js',
                }]);
        });

        it("should extract even if value is a variable", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                        "    this.gettext.ngettext('foo', 'foos', length);",
                        "    thing.gettext.ngettext('bar', 'bars', length);",
                        "    thing.gettext.ngettext.call(null, 'baz', 'bazs', length);",
                        "    thing.gettext.ngettext.apply(null, ['qux', 'quxs', length]);",
                        "    thing.subthing.gettext.ngettext('corge', 'corges', length);",
                        "    thing.subthing.gettext.ngettext.call(null, 'grault', 'graults', length);",
                        "    thing.subthing.gettext.ngettext.apply(null, ['garply', 'garplies', length]);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: 'foos',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: 'bars',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }, {
                    key: 'baz',
                    plural: 'bazs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: 'foo.js',
                }, {
                    key: 'qux',
                    plural: 'quxs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: 'foo.js',
                }, {
                    key: 'corge',
                    plural: 'corges',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js',
                }, {
                    key: 'grault',
                    plural: 'graults',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: 'foo.js',
                }, {
                    key: 'garply',
                    plural: 'garplies',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js',
                }]);
        });

        it("should extract even if value is a member expression", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                        "    this.gettext.ngettext('foo', 'foos', foo.length);",
                        "    thing.gettext.ngettext('bar', 'bars', foo.bar.length);",
                        "    thing.gettext.ngettext.call(null, 'baz', 'bazs', foo.length);",
                        "    thing.gettext.ngettext.apply(null, ['qux', 'quxs', foo.bar.length]);",
                        "    thing.subthing.gettext.ngettext('corge', 'corges', foo.length);",
                        "    thing.subthing.gettext.ngettext.call(null, 'grault', 'graults', foo.bar.length);",
                        "    thing.subthing.gettext.ngettext.apply(null, ['garply', 'garplies', foo.length]);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: 'foos',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: 'bars',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }, {
                    key: 'baz',
                    plural: 'bazs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: 'foo.js',
                }, {
                    key: 'qux',
                    plural: 'quxs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: 'foo.js',
                }, {
                    key: 'corge',
                    plural: 'corges',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js',
                }, {
                    key: 'grault',
                    plural: 'graults',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: 'foo.js',
                }, {
                    key: 'garply',
                    plural: 'garplies',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js',
                }]);
        });

        it("should extract even if value is a call expression", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "function luke() {",
                        "    this.gettext.ngettext('foo', 'foos', this.getCount(foo));",
                        "    thing.gettext.ngettext('bar', 'bars', this.getCount(foo));",
                        "    thing.gettext.ngettext.call(null, 'baz', 'bazs', ext.getCount(foo));",
                        "    thing.gettext.ngettext.apply(null, ['qux', 'quxs', ext.getCount(foo.bar)]);",
                        "    thing.subthing.gettext.ngettext('corge', 'corges', this.getCount(foo));",
                        "    thing.subthing.gettext.ngettext.call(null, 'grault', 'graults', ext.getCount(foo.bar));",
                        "    thing.subthing.gettext.ngettext.apply(null, ['garply', 'garplies', this.getCount(foo)]);",
                        "}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: 'foos',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js',
                }, {
                    key: 'bar',
                    plural: 'bars',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js',
                }, {
                    key: 'baz',
                    plural: 'bazs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 4,
                    filename: 'foo.js',
                }, {
                    key: 'qux',
                    plural: 'quxs',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 5,
                    filename: 'foo.js',
                }, {
                    key: 'corge',
                    plural: 'corges',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js',
                }, {
                    key: 'grault',
                    plural: 'graults',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 7,
                    filename: 'foo.js',
                }, {
                    key: 'garply',
                    plural: 'garplies',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js',
                }]);
        });
    });
});
