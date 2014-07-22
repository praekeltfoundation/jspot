var _ = require('underscore');
var assert = require('assert');
var jspot = require('../lib');


describe("jspot.pot", function() {
    var now = _.now;

    before(function() {
        _.now = _.constant(1393369106938);
    });

    after(function() {
        _.now = now;
    });

    it("should create a new domain pot if none currently exists", function() {
        var pots = {error: {}};

        jspot.pot({
            pots: pots,
            extracts: [{
                key: 'foo',
                plural: null,
                context: '',
                domain: 'messages',
                line: 1,
                filename: 'ham.js'
            }, {
                key: 'bar',
                plural: null,
                context: '',
                domain: 'lerps',
                line: 2,
                filename: 'spam.js'
            }],
        });

        assert('translations' in pots.messages);
        assert.equal(pots.messages.charset, 'utf-8');
        assert.deepEqual(pots.messages.headers, {
            'project-id-version': 'PACKAGE VERSION',
            'language-team': 'LANGUAGE <LL@li.org>',
            'po-revision-date': 'YEAR-MO-DA HO:MI+ZONE',
            'pot-creation-date': '2014-02-25 10:58:+0000',
            'language': '',
            'mime-version': '1.0',
            'content-type': 'text/plain; charset=utf-8',
            'content-transfer-encoding': '8bit'
        });

        assert('translations' in pots.lerps);
        assert.equal(pots.lerps.charset, 'utf-8');
        assert.deepEqual(pots.lerps.headers, {
            'project-id-version': 'PACKAGE VERSION',
            'language-team': 'LANGUAGE <LL@li.org>',
            'po-revision-date': 'YEAR-MO-DA HO:MI+ZONE',
            'pot-creation-date': '2014-02-25 10:58:+0000',
            'language': '',
            'mime-version': '1.0',
            'content-type': 'text/plain; charset=utf-8',
            'content-transfer-encoding': '8bit'
        });
    });

    it("should allow the new pots' headers to be configurable", function() {
        var pots = jspot.pot({
            headers: {
                'language': 'en',
                'project-id-version': '0.1.0'
            },
            extracts: [{
                key: 'foo',
                plural: null,
                context: '',
                domain: 'messages',
                line: 1,
                filename: 'ham.js'
            }]
        });

        assert.deepEqual(pots.messages.headers.language, 'en');
        assert.deepEqual(pots.messages.headers['project-id-version'], '0.1.0');
    });

    it("should create a new context if none currently exists", function() {
        var pots = jspot.pot({
            extracts: [{
                key: 'foo',
                plural: null,
                context: '',
                domain: 'messages',
                line: 1,
                filename: 'ham.js'
            }, {
                key: 'bar',
                plural: null,
                context: 'lark',
                domain: 'lerps',
                line: 2,
                filename: 'spam.js'
            }]
        });

        assert('' in pots.messages.translations);
        assert('lark' in pots.lerps.translations);
    });

    it("should create a new translation if none currently exists", function() {
        var pots = jspot.pot({
            extracts: [{
                key: 'foo',
                plural: null,
                context: '',
                domain: 'messages',
                line: 1,
                filename: 'ham.js'
            }, {
                key: 'bar',
                plural: 'bars',
                context: 'lark',
                domain: 'lerps',
                line: 2,
                filename: 'spam.js'
            }]
        });

        assert.deepEqual(pots.messages.translations[''].foo, {
            msgid: 'foo',
            msgstr: [''],
            msgctxt: '',
            comments: {reference: 'ham.js:1'}
        });

        assert.deepEqual(pots.lerps.translations.lark.bar, {
            msgid: 'bar',
            msgid_plural: 'bars',
            msgstr: ['', ''],
            msgctxt: 'lark',
            comments: {reference: 'spam.js:2'}
        });
    });

    it("should append to a translation if one already exists", function() {
        var pots = {
            messages: {
                translations: {
                    '': {
                        foo: {
                            msgid: 'foo',
                            msgstr: [''],
                            msgctxt: '',
                            comments: {reference: 'lamb.js:3'}
                        }
                    },
                }
            },
            lerps: {
                translations: {
                    lark: {
                        bar: {
                            msgid: 'bar',
                            msgid_plural: 'bars',
                            msgstr: ['', ''],
                            msgctxt: 'lark',
                            comments: {reference: 'ram.js:4'}
                        }
                    }
                }
            }
        };

        jspot.pot({
            pots: pots,
            extracts: [{
                key: 'foo',
                plural: null,
                context: '',
                domain: 'messages',
                line: 1,
                filename: 'ham.js'
            }, {
                key: 'bar',
                plural: 'bars',
                context: 'lark',
                domain: 'lerps',
                line: 2,
                filename: 'spam.js'
            }]
        });

        assert.deepEqual(pots.messages.translations[''].foo, {
            msgid: 'foo',
            msgstr: [''],
            msgctxt: '',
            comments: {reference: 'lamb.js:3 ham.js:1'}
        });

        assert.deepEqual(pots.lerps.translations.lark.bar, {
            msgid: 'bar',
            msgid_plural: 'bars',
            msgstr: ['', ''],
            msgctxt: 'lark',
            comments: {reference: 'ram.js:4 spam.js:2'}
        });
    });

    it("should not append to a translation if its reference exists", function() {
        var pots = {
            messages: {
                translations: {
                    '': {
                        foo: {
                            msgid: 'foo',
                            msgstr: [''],
                            msgctxt: '',
                            comments: {reference: 'lamb.js:3 ham.js:1'}
                        }
                    },
                }
            }
        };

        jspot.pot({
            pots:pots,
            extracts: [{
                key: 'foo',
                plural: null,
                context: '',
                domain: 'messages',
                line: 1,
                filename: 'ham.js'
            }]
        });

        assert.deepEqual(pots.messages.translations[''].foo, {
            msgid: 'foo',
            msgstr: [''],
            msgctxt: '',
            comments: {reference: 'lamb.js:3 ham.js:1'}
        });
    });
});
