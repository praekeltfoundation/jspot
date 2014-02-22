var assert = require('assert');
var fn = require('../lib/fn');

describe("fn", function() {
    it("should proxy to .gettext when called directly", function() {
        assert.deepEqual(fn('foo'), {
            method: 'gettext',
            params: {message: 'foo'}
        });
    });

    describe(".gettext", function() {
        it("should throw an error if the message param is unusable",
        function() {
            assert.throws(
                function() { fn.gettext(null); },
                new RegExp([
                    "gettext was given a value of type 'object'",
                    "instead of a string or number for parameter",
                    "'message': null"
                ].join(' ')));
        });

        it("should return the method call's data", function() {
            assert.deepEqual(fn.gettext('foo'), {
                method: 'gettext',
                params: {message: 'foo'}
            });
        });
    });
});
