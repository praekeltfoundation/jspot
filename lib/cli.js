#!/usr/bin/env node

var _ = require('underscore');
var path = require('path');
var jspot = require('./');
var commander = require('commander');


// If we use variadic option-args, which is the documented mechanism for
// multiple option values, we end up with ambiguity between opt-args and
// command args. Instead, we use a custom processing function and an empty
// array default value to build a list. (This also means we get to keep the
// existing behaviour from nomnom.)
function collect(val, vals) {
    vals.push(val);
    return vals;
}


// All sorts of state end up stashed on the command object while parsing, so
// make sure we use a fresh one every time.
function parse() {
    var cli = new commander.Command().name('jspot');

    cli
        .command('extract')
        .description('Extract source from javascript files into pot files')
        .argument('<source...>', 'The source files to extract from.')
        .option(
            '-t, --target <DIR>',
            'Directory to write pot files to.',
            jspot.defaults.extract.target)
        .option(
            '-k, --keyword <WORD>',
            'Keyword to search for in source',
            jspot.defaults.extract.keyword)
        .option(
            '--header <NAME:VALUE>',
            'Set a header for the written pot files',
            collect,
            [])
        .option(
            '-e, --extractor <EXTENSION:MODULE>',
            'Add a custom extractor',
            collect,
            [])
        .action(function(source, opts) {
            opts.source = source;
            return extract(opts);
        });

    cli
        .command('json')
        .description('Convert po files to Jed-compatible json files (using po2json)')
        .argument('<source...>', 'The po files to convert.')
        .option(
            '-t, --target <DIR>',
            'Directory to write json files to.',
            jspot.defaults.json.target)
        .action(function(source, opts) {
            opts.source = source;
            return json(opts);
        });

    return cli.parse(arguments[0]);
}

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
    parse();
}

module.exports = { parse: parse };
