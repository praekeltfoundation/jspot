#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var parser = require('gettext-parser');
var po2json = require('po2json');
var _ = require('underscore');

var extract = require('./extract');
var potter = require('./potter');
var cli = module.exports = require('nomnom');


cli.script('jspot');


cli
    .command('extract')
    .callback(function(opts) {
        commands.extract(opts);
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
        commands.json(opts);
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
        help: "Directory to write pot files to."
    });


var commands = {};

commands.extract = function(opts) {
    opts.headers = (opts.header || []).reduce(function(headers, header) {
        var name = _.first(header.split(':', 1));
        headers[name] = header.slice(name.length + 1);
        return headers;
    }, {});

    var extracts = opts.source.reduce(function(extracts, filename) {
        var src = fs.readFileSync(path.resolve(filename));

        return extracts.concat(extract(src.toString(), {
            keyword: opts.keyword,
            filename: filename
        }));
    }, []);

    var pots = potter(extracts, {
        headers: opts.headers
    });

    _(pots).each(function(pot, domain) {
        fs.writeFileSync(
            path.resolve(opts.target, domain + '.pot'),
            parser.po.compile(pot) + '\n');
    });
};


commands.json = function(opts) {
    opts.source.forEach(function(filename) {
        var name = path.basename(filename, path.extname(filename));
        var data = po2json.parseFileSync(path.resolve(filename));

        fs.writeFileSync(
            path.resolve(opts.target, name + '.json'),
            JSON.stringify(data, null, 4));
    });
};


if (require.main === module) {
    cli.nom();
}
