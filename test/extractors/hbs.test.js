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
                        "<div>{{ gettext.gettext 'bar' }}</div>"
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
                    source: "<div>{{ gettext.ngettext 'foo' 'fooz' 6 }}</div>"
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


    it("should allow a different keyword to be used", function() {
        assert.deepEqual(
            extractor({
                keyword: '_',
                filename: 'foo.js',
                source: [
                    "<div>{{_ 'foo' }}</div>",
                    "<div>{{_.gettext 'fooz' }}</div>",
                    "<div>{{_.ngettext 'bar' 'barz' 2 }}</div>"
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
                        "<li>{{ @index }} {{ name }} {{gettext.ngettext '%s foo' '%s foos' @index }}</li>",
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
                        "<li>{{ ../much }} {{ name }} {{gettext.ngettext '%s foo' '%s foos' ../much }}</li>",
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
                        "{{else}}<div>{{gettext.gettext 'bar' }}</div>",
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
                        "{{else}}<div>{{gettext.gettext 'bar' }}</div>",
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
                        "<span>{{sprintf (gettext.ngettext '%d cat' '%d cats' much) much }}</span>",
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

        it("should work inside a complicated statement", function() {
            assert.deepEqual(
                extractor({
                    filename: 'foo.js',
                    source: [
                        "{{#with foo }}",
                        "{{sprintf (gettext.ngettext '%d cat' '%d cats' much) much }}",
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
