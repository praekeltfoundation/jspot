var assert = require('assert');
var jspot = require('../lib');


describe("jspot.gettext", function() {
    it("should proxy to .gettext when called directly", function() {
        assert.deepEqual(jspot.gettext('key'), {
            key: 'key',
            plural: null,
            domain: 'messages',
            context: '',
            category: null
        });
    });

    describe(".gettext", function() {
        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.gettext(null);
                },
                new RegExp([
                    "gettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should return the gettext call's data", function() {
            assert.deepEqual(jspot.gettext.gettext('key'), {
                key: 'key',
                plural: null,
                domain: 'messages',
                context: '',
                category: null
            });
        });
    });

    describe(".dgettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dgettext(null, 'key');
                },
                new RegExp([
                    "dgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dgettext('domain', null);
                },
                new RegExp([
                    "dgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should return the dgettext call's data", function() {
            assert.deepEqual(jspot.gettext.dgettext('domain', 'key'), {
                key: 'key',
                plural: null,
                domain: 'domain',
                context: '',
                category: null
            });
        });
    });

    describe(".dcgettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcgettext(null, 'key', 'category');
                },
                new RegExp([
                    "dcgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dcgettext('domain', null, 'category');
                },
                new RegExp([
                    "dcgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the category param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcgettext('domain', 'key', null);
                },
                new RegExp([
                    "dcgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'category': null"
                ].join(' ')));
        });

        it("should return the dcgettext call's data", function() {
            assert.deepEqual(jspot.gettext.dcgettext('domain', 'key', 'category'), {
                key: 'key',
                plural: null,
                domain: 'domain',
                context: '',
                category: null
            });
        });
    });

    describe(".ngettext", function() {
        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.ngettext(null, 'plural', 'value');
                },
                new RegExp([
                    "ngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the plural param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.ngettext('key', null, 'value');
                },
                new RegExp([
                    "ngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'plural': null"
                ].join(' ')));
        });

        it("should return the ngettext call's data", function() {
            assert.deepEqual(jspot.gettext.ngettext('key', 'plural', 'value'), {
                key: 'key',
                plural: 'plural',
                domain: 'messages',
                context: '',
                category: null
            });
        });

        it("should return the ngettext call's data even if value is variable", function() {
            var length = 6;
            assert.deepEqual(jspot.gettext.ngettext('key', 'plural', length), {
                key: 'key',
                plural: 'plural',
                domain: 'messages',
                context: '',
                category: null
            });
        });
    });

    describe(".dngettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dngettext(null, 'key', 'plural', 'value');
                },
                new RegExp([
                    "dngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dngettext('domain', null, 'plural', 'value');
                },
                new RegExp([
                    "dngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the plural param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dngettext('domain', 'key', null, 'value');
                },
                new RegExp([
                    "dngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'plural': null"
                ].join(' ')));
        });

        it("should return the dngettext call's data", function() {
            assert.deepEqual(
                jspot.gettext.dngettext('domain', 'key', 'plural', 'value'),
                {
                    key: 'key',
                    plural: 'plural',
                    domain: 'domain',
                    context: '',
                    category: null
                });
        });
    });

    describe(".dcngettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcngettext(
                        null, 'key', 'plural', 'value', 'category');
                },
                new RegExp([
                    "dcngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dcngettext(
                        'domain', null, 'plural', 'value', 'category');
                },
                new RegExp([
                    "dcngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the plural param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcngettext(
                        'domain', 'key', null, 'value', 'category');
                },
                new RegExp([
                    "dcngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'plural': null"
                ].join(' ')));
        });

        it("should throw an error if the category param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcngettext(
                        'domain', 'key', 'plural', 'value', null);
                },
                new RegExp([
                    "dcngettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'category': null"
                ].join(' ')));
        });

        it("should return the dcngettext call's data", function() {
            assert.deepEqual(
                jspot.gettext.dcngettext(
                    'domain', 'key', 'plural', 'value', 'category'),
                {
                    key: 'key',
                    plural: 'plural',
                    domain: 'domain',
                    context: '',
                    category: null
                });
        });
    });

    describe(".pgettext", function() {
        it("should throw an error if the context param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.pgettext(null, 'key');
                },
                new RegExp([
                    "pgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'context': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.pgettext('context', null);
                },
                new RegExp([
                    "pgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should return the pgettext call's data", function() {
            assert.deepEqual(jspot.gettext.pgettext('context', 'key'), {
                key: 'key',
                plural: null,
                domain: 'messages',
                context: 'context',
                category: null
            });
        });
    });

    describe(".dpgettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dpgettext(null, 'context', 'key');
                },
                new RegExp([
                    "dpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the context param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dpgettext('domain', null, 'key');
                },
                new RegExp([
                    "dpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'context': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dpgettext('domain', 'context', null);
                },
                new RegExp([
                    "dpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should return the dpgettext call's data", function() {
            assert.deepEqual(jspot.gettext.dpgettext('domain', 'context', 'key'), {
                key: 'key',
                plural: null,
                domain: 'domain',
                context: 'context',
                category: null
            });
        });
    });

    describe(".npgettext", function() {
        it("should throw an error if the context param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.npgettext(null, 'key', 'plural', 'value');
                },
                new RegExp([
                    "npgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'context': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.npgettext('context', null, 'plural', 'value');
                },
                new RegExp([
                    "npgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the plural param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.npgettext('context', 'key', null, 'value');
                },
                new RegExp([
                    "npgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'plural': null"
                ].join(' ')));
        });

        it("should return the npgettext call's data", function() {
            assert.deepEqual(
                jspot.gettext.npgettext('context', 'key', 'plural', 'value'),
                {
                    key: 'key',
                    plural: 'plural',
                    domain: 'messages',
                    context: 'context',
                    category: null
                });
        });
    });

    describe(".dnpgettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dnpgettext(
                        null, 'context', 'key', 'plural', 'value');
                },
                new RegExp([
                    "dnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the context param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dnpgettext(
                        'domain', null, 'key', 'plural', 'value');
                },
                new RegExp([
                    "dnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'context': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dnpgettext(
                        'domain', 'context', null, 'plural', 'value');
                },
                new RegExp([
                    "dnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the plural param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dnpgettext(
                        'domain', 'context', 'key', null, 'value');
                },
                new RegExp([
                    "dnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'plural': null"
                ].join(' ')));
        });

        it("should return the dnpgettext call's data", function() {
            assert.deepEqual(
                jspot.gettext.dnpgettext(
                    'domain', 'context', 'key', 'plural', 'value'),
                {
                    key: 'key',
                    plural: 'plural',
                    domain: 'domain',
                    context: 'context',
                    category: null
                });
        });
    });

    describe(".dcnpgettext", function() {
        it("should throw an error if the domain param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcnpgettext(
                        null, 'context', 'key', 'plural', 'value', 'category');
                },
                new RegExp([
                    "dcnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'domain': null"
                ].join(' ')));
        });

        it("should throw an error if the context param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcnpgettext(
                        'domain', null, 'key', 'plural', 'value', 'category');
                },
                new RegExp([
                    "dcnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'context': null"
                ].join(' ')));
        });

        it("should throw an error if the key param is unusable", function() {
            assert.throws(
                function() {
                    jspot.gettext.dcnpgettext(
                        'domain', 'context', null, 'plural', 'value', 'category');
                },
                new RegExp([
                    "dcnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'key': null"
                ].join(' ')));
        });

        it("should throw an error if the plural param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcnpgettext(
                        'domain', 'context', 'key', null, 'value', 'category');
                },
                new RegExp([
                    "dcnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'plural': null"
                ].join(' ')));
        });

        it("should throw an error if the category param is unusable",
        function() {
            assert.throws(
                function() {
                    jspot.gettext.dcnpgettext(
                        'domain', 'context', 'key', 'plural', 'value', null);
                },
                new RegExp([
                    "dcnpgettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'category': null"
                ].join(' ')));
        });

        it("should return the dcnpgettext call's data", function() {
            assert.deepEqual(
                jspot.gettext.dcnpgettext(
                    'domain', 'context', 'key', 'plural', 'value', 'category'),
                {
                    key: 'key',
                    plural: 'plural',
                    domain: 'domain',
                    context: 'context',
                    category: null
                });
        });
    });
});
