var assert = require('assert');
var gettext = require('../lib/gettext');

describe("gettext", function() {
    it("should proxy to .gettext when called directly", function() {
        assert.deepEqual(gettext('foo'), {
            singular: 'foo',
            plural: null,
            domain: 'messages'
        });
    });

    describe(".gettext", function() {
        it("should throw an error if the message param is unusable",
        function() {
            assert.throws(
                function() { gettext.gettext(null); },
                new RegExp([
                    "gettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'message': null"
                ].join(' ')));
        });

        it("should return the method call's data", function() {
            assert.deepEqual(gettext.gettext('foo'), {
                singular: 'foo',
                plural: null,
                domain: 'messages'
            });
        });
    });
});
