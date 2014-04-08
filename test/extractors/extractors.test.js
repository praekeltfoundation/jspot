var _ = require('underscore');
var assert = require('assert');

var jspot = require('../../lib');


describe("jspot.extractors", function() {
    beforeEach(function() {
        jspot.extractors.unsupport('a');
    });

    describe(".support", function() {
        it("should ensure the extractor uses default options", function(done) {
            jspot.extractors.support('a', function(opts) {
                assert.deepEqual(opts, _.extend({}, jspot.defaults.extract, {
                    source: 'foo'
                }));

                done();
            });

            jspot.extractors.get('a')({source: 'foo'});
        });

        it("should add the extractor to the registry", function() {
            assert(!('a' in jspot.extractors.registry));
            jspot.extractors.support('a', function() {});
            assert('a' in jspot.extractors.registry);
        });
    });

    describe("unsupport", function() {
        it("should remove an extractor from the registry", function() {
        it("should add the extractor to the registry", function() {
            jspot.extractors.support('a', function() {});
            assert('a' in jspot.extractors.registry);

            jspot.extractors.unsupport('a', function() {});
            assert(!('a' in jspot.extractors.registry));
        });
        });
    });

    describe(".get", function() {
        it("should get an extractor using the given extension", function() {
            jspot.extractors.support('a', function() {
                return 'foo';
            });

            assert.equal(jspot.extractors.get('a')(), 'foo');
        });
    });

    describe(".get.by_filename", function() {
        it("should get an extractor using the given filename", function() {
            jspot.extractors.support('a', function() {
                return 'foo';
            });

            assert.equal(jspot.extractors.get.by_filename('ham.a')(), 'foo');
            assert(_.isUndefined(jspot.extractors.get('spam.ham.a')));
        });
    });
});
