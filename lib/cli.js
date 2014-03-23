#!/usr/bin/env node

var jspot = require('./api');
var cli = module.exports = require('nomnom');


cli.script('jspot');


cli
    .command('extract')
    .callback(function(opts) {
        jspot.extract(opts);
    })
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
        default: ".",
        help: "Directory to write pot files to."
    })
    .option('keyword', {
        abbr: 'k',
        metavar: 'WORD',
        default: 'gettext',
        help: 'Keyword to search for in source'
    })
    .option('header', {
        metavar: 'NAME:VALUE',
        list: true,
        help: 'Set a header for the written pot files'
    });


cli
    .command('json')
    .callback(function(opts) {
        jspot.json(opts);
    })
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
        default: ".",
        help: "Directory to write json files to."
    });


if (require.main === module) {
    cli.nom();
}
