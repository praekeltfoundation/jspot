var assert = require('assert');
var jspot = require('../../lib');


describe("jspot.extractors:hbs", function() {
    var extractor = jspot.extractors.get('hbs');

    describe("call to jspot gettext", function() {
        it("should forward gettext calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<div>{{ gettext 'foo' }}</div>",
                        "<div>{{ gettext_gettext 'bar' }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }]
            );
        });

        it("should forward ngettext calls", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: "<div>{{ gettext_ngettext 'foo' 'fooz' 6 }}</div>"
                }),
                [{
                    key: 'foo',
                    plural: 'fooz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }]
            );
        });
    });


    describe("no results", function() {
        it("should have no result if no gettext call", function() {
            assert.equal(
                extractor({
                    filename: 'foo.js',
                    source: "<div>{{#if foo}}bla{{/if}}</div>"
                }).length,
                0
            );
        });

        it("should have no result when gettext is called without params", function() {
            assert.equal(
                extractor({
                    filename: 'foo.js',
                    source: "<div>{{gettext }}</div>"
                }).length,
                0
            );
        });
    });


    describe("hbs extractor options", function() {
        it("should allow a different keyword to be used", function() {
            assert.deepEqual(
                extractor({
                    keyword: '_',
                    filename: 'foo.js',
                    source: [
                        "<div>{{_ 'foo' }}</div>",
                        "<div>{{__gettext 'fooz' }}</div>",
                        "<div>{{__ngettext 'bar' 'barz' 2 }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'fooz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: 'barz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should allow a different separator to be used", function() {
            assert.deepEqual(
                extractor({
                    hbs: {
                        separator: ':'
                    },
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext 'foo' }}</div>",
                        "<div>{{gettext:gettext 'fooz' }}</div>",
                        "<div>{{gettext:ngettext 'bar' 'barz' 2 }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'fooz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: 'barz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should allow an empty separator to be used", function() {
            assert.deepEqual(
                extractor({
                    hbs: {
                        separator: ''
                    },
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext 'foo' }}</div>",
                        "<div>{{gettextgettext 'fooz' }}</div>",
                        "<div>{{gettextngettext 'bar' 'barz' 2 }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'fooz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: 'barz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should go with default options when no hbs options provide", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext 'foo' }}</div>",
                        "<div>{{gettext_gettext 'fooz' }}</div>",
                        "<div>{{gettext_ngettext 'bar' 'barz' 2 }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'fooz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: 'barz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should go with default options when hbs options is empty", function() {
            assert.deepEqual(
                extractor({
                    hbs: {},
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext 'foo' }}</div>",
                        "<div>{{gettext_gettext 'fooz' }}</div>",
                        "<div>{{gettext_ngettext 'bar' 'barz' 2 }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'fooz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: 'barz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should go with default separator when separator is not a string", function() {
            assert.deepEqual(
                extractor({
                    hbs: {
                        separator: {}
                    },
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext 'foo' }}</div>",
                        "<div>{{gettext_gettext 'fooz' }}</div>",
                        "<div>{{gettext_ngettext 'bar' 'barz' 2 }}</div>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'fooz',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: 'barz',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

    });


    describe("handlebars mustaches", function() {
        it("should work inside a safe string statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<p>{{{gettext 'foo' }}}</p>",
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work inside a block statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<ul>",
                        "{{#list items }}",
                        "<li>{{ name }} {{gettext 'foo' }}</li>",
                        "{{/list}}",
                        "</ul>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work with a block statement that uses private variable", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<ul>",
                        "{{#list items }}",
                        "<li>{{ @index }} {{ name }} {{gettext_ngettext '%s foo' '%s foos' @index }}</li>",
                        "{{/list}}",
                        "</ul>"
                    ].join('\n')
                }),
                [{
                    key: '%s foo',
                    plural: '%s foos',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work with a block statement that uses outside block variable", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<ul>",
                        "{{#list items }}",
                        "<li>{{ ../much }} {{ name }} {{gettext_ngettext '%s foo' '%s foos' ../much }}</li>",
                        "{{/list}}",
                        "</ul>"
                    ].join('\n')
                }),
                [{
                    key: '%s foo',
                    plural: '%s foos',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work inside a #if else statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "{{#if condition }}<div>{{gettext 'foo' }}</div>",
                        "{{else}}<div>{{gettext_gettext 'bar' }}</div>",
                        "{{/if}}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work inside a #unless else statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "{{#unless condition }}<div>{{gettext 'foo' }}</div>",
                        "{{else}}<div>{{gettext_gettext 'bar' }}</div>",
                        "{{/unless}}"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work inside a #each statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<ul>",
                        "{{#each items }}",
                        "<li>{{ name }} {{gettext 'foo' }}</li>",
                        "{{/each}}",
                        "</ul>"
                    ].join('\n')
                }),
                [{
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 3,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work inside a #with statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "{{#with item }}",
                        "<span>{{ name }} {{gettext 'foo' }}</span>",
                        "{{/with}}"
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
                }]
            );
        });

        it("should work inside a sub-expression statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<span>{{sprintf (gettext_ngettext '%d cat' '%d cats' much) much }}</span>",
                    ].join('\n')
                }),
                [{
                    key: '%d cat',
                    plural: '%d cats',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work with double quoted parameters", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        '<div>{{gettext \'<span class="bold">foo</span>\' }}</div>',
                    ].join('\n')
                }),
                [{
                    key: '<span class="bold">foo</span>',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }]
            );
        });

        it("should work with single quoted parameters", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext \"<span class='bold'>foo</span>\" }}</div>",
                    ].join('\n')
                }),
                [{
                    key: "<span class='bold'>foo</span>",
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 1,
                    filename: 'foo.js'
                }]
            );
        });

        it("throws an error if contains double & single quoted parameters", function() {
            assert.throws(function() {
                extractor({
                    filename: 'foo.js',
                    source: [
                        "<div>{{gettext \"<span id=\\\"id\\\" class='bold'>foo</span>\" }}</div>",
                    ].join('\n')
                });
            },
            'On line 1 column 15 of file foo.js.\nYour gettext string can not contains both single & double quote.');
        });

        it("should work inside a complicated statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "{{#with foo }}",
                        "{{sprintf (gettext_ngettext '%d cat' '%d cats' much) much }}",
                        "<ul>",
                        "{{#each users }}",
                        "{{#if firstname }}",
                        "<li>{{ firstname }} {{gettext 'foo' }} {{ ../much }}</li>",
                        "{{else}}",
                        "<li>{{gettext 'bar' }} {{ lastname }} {{ @index }}</li>",
                        "{{/if}}",
                        "{{/each}}",
                        "</ul>",
                        "{{/with}}"
                    ].join('\n')
                }),
                [{
                    key: '%d cat',
                    plural: '%d cats',
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 2,
                    filename: 'foo.js'
                }, {
                    key: 'foo',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 6,
                    filename: 'foo.js'
                }, {
                    key: 'bar',
                    plural: null,
                    domain: 'messages',
                    context: '',
                    category: null,
                    line: 8,
                    filename: 'foo.js'
                }]
            );
        });

    });

});
