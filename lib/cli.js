#!/usr/bin/env node

var _ = require('underscore');
var path = require('path');
var jspot = require('./');
var cli = module.exports = require('nomnom');


cli.script('jspot');


cli
    .command('extract')
    .callback(extract)
    .help('Extract source from javascript files into pot files')
    .option('source', {
        position: 1,
        required: true,
        list: true,
        help: 'The source files to extract from.'
    })
    .option('target', {
        abbr: 't',
        metavar: 'DIR',
        default: jspot.defaults.extract.target,
        help: "Directory to write pot files to."
    })
    .option('keyword', {
        abbr: 'k',
        metavar: 'WORD',
        default: jspot.defaults.extract.keyword,
        help: 'Keyword to search for in source'
    })
    .option('header', {
        metavar: 'NAME:VALUE',
        list: true,
        help: 'Set a header for the written pot files'
    })
    .option('extractor', {
      abbr: 'e',
      metavar: 'EXTENSION:MODULE',
      list: true,
      help: 'Add a custom extractor'
    });


cli
    .command('json')
    .callback(json)
    .help('Convert po files to Jed-compatible json files (using po2json)')
    .option('source', {
        position: 1,
        required: true,
        list: true,
        help: 'The po files to convert.'
    })
    .option('target', {
        abbr: 't',
        metavar: 'DIR',
        default: jspot.defaults.json.target,
        help: "Directory to write json files to."
    });


function extract(opts) {
    opts.headers = (opts.header || []).reduce(function(headers, header) {
        var name = _.first(header.split(':', 1));
        headers[name] = header.slice(name.length + 1);
        return headers;
    }, {});

    (opts.extractor || []).forEach(function(e) {
        var pair = e.split(':');
        var ending = pair[0];
        var module_name = pair[1];
        var extractor;

        try {
            extractor = require(module_name);
        } catch (e) {
            extractor = require(path.resolve(module_name));
        }

        jspot.extractors.support(ending, extractor);
    });

    jspot.extract(opts);
}


function json(opts) {
    return jspot.json(opts);
}


if (require.main === module) {
    cli.nom();
}
