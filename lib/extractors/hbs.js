var vm = require('vm');
var hbs = require('handlebars');
var gettext = require('../gettext');


function extract(opts) {
    return gather(opts.source, opts).map(function(node) {
        return run(node, opts);
    });
}


function gather(src, opts) {
    var nodes = [];
    handle_statements(hbs.parse(src).statements, opts, nodes);

    return nodes;
}


function handle_statements(statements, opts, nodes) {
    statements.forEach(function(statement) {
        if (statement.type === 'mustache' || statement.type === 'sexpr') {
            handle_mustache(statement, opts, nodes);

        } else if (statement.type === 'block') {
            handle_statements(statement.program.statements, opts, nodes);

            if (statement.program.inverse) {
                handle_statements(statement.program.inverse.statements, opts, nodes);
            }
        }
    });
}


function handle_mustache(mustache, opts, nodes) {
    // if mustache statement type contains a gettext node
    if ((mustache.id.string === opts.keyword || mustache.id.string.indexOf(opts.keyword + '.') === 0)
        && mustache.params.length >= 1) {
        var node = {line: mustache.firstLine, src: make_function(mustache.id, mustache.params)};
        nodes.push(node);
    }

    // recursive call for sub expression
    if (mustache.sexpr) {
        mustache.sexpr.params.forEach(function(statement) { handle_statements([statement], opts, nodes); });
    }
}


function make_function(id, params) {
    return id.string + '(' + params.map(function(p) { return '"' + p.string + '"'; }).join(', ') + ')';
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
