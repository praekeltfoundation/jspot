var vm = require('vm');
var hbs = require('handlebars');
var _ = require('underscore');
var gettext = require('../gettext');


function extract(opts) {
    // prevent undefined or empty opts.hbs and not defined options
    opts.hbs = _.defaults(opts.hbs || {}, {separator: '_'});
    // prevent not string separator
    if (!_.isString(opts.hbs.separator)) opts.hbs.separator = '_';

    return gather(opts.source, opts).map(function(node) {
        return run(node, opts);
    });
}


function gather(src, opts) {
    var nodes = [];
    handle_statements(hbs.parse(src).body, opts, nodes);

    return nodes;
}


function handle_statements(statements, opts, nodes) {
    statements.forEach(function(statement) {
        if (statement.type === 'MustacheStatement' || statement.type === 'SubExpression') {
            handle_mustache(statement, opts, nodes);

        } else if (statement.type === 'BlockStatement') {
            handle_statements(statement.program.body, opts, nodes);

            if (statement.inverse) {
                handle_statements(statement.inverse.body, opts, nodes);
            }
        }
    });
}


function handle_mustache(mustache, opts, nodes) {
    // if statement path type 'PathExpression' (helper) &&
    // if mustache statement is for gettext or gettext.xxx &&
    // has params
    if (mustache.path.type === 'PathExpression'
        && (mustache.path.original === opts.keyword || mustache.path.original.indexOf(opts.keyword + opts.hbs.separator) === 0)
        && mustache.params.length >= 1) {
        var node = {line: mustache.loc.start.line, src: make_function(mustache.path, mustache.params, opts)};
        nodes.push(node);
    }

    // recursive call for sub expression
    handle_statements(mustache.params.filter(function(param) {
        return param.type === 'SubExpression';
    }), opts, nodes);
}


function make_function(path, params, opts) {
    var buff = path.original === opts.keyword ? path.original : path.original.replace(opts.keyword + opts.hbs.separator, opts.keyword + '.');
    buff +=  '(';
    buff += params.map(function(p) {
        if (p.type === 'StringLiteral') {
            var quote = _get_delimiter_quote(p, opts);
            return quote + p.value + quote;
        }
        return 0;
    }).join(', ');
    buff += ')';

    return buff;
}


function _get_delimiter_quote(param, opts) {
    var contains_double = param.value.indexOf('"') !== -1;
    var contains_single = param.value.indexOf("'") !== -1;
    // I can not think of a use case where both get mixed up but he...
    if (contains_double && contains_single) {
        var msg = 'On line ' + param.loc.start.line + ' column ' + param.loc.start.column + ' of file ' + opts.filename + '.\n';
            msg += 'Your gettext string can not contains both single & double quote.';
        throw new Error(msg);
    }

    return contains_double ? "'" : '"';
}


function run(node, opts) {
    var context = {};
    context[opts.keyword] = gettext;

    var result;
    try {
        result = vm.runInNewContext(node.src, context);
    }
    catch (e) {
        throw new Error([
            "on line " + node.line,
            "of file '" + opts.filename + "'",
            e.message].join(' '));
    }

    result.line = node.line;
    result.filename = opts.filename;
    return result;
}


module.exports = extract;
