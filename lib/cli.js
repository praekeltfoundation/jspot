#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var parser = require('gettext-parser');
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


if (require.main === module) {
    cli.nom();
}
