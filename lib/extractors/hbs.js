var vm = require('vm');
var hbs = require('handlebars');
var gettext = require('../gettext');


function extract(opts) {
    return gather(opts.source, opts).map(function(node) {
        return run(node, opts);
    });
}


function gather(src, opts) {
    return handle_statements(hbs.parse(src).statements, opts);
}


function handle_statements(statements, opts) {
    var nodes = [];

    statements.forEach(function(statement) {
        if (statement.type === 'mustache') {
            var node = handle_mustache(statement, opts);
            if (node) nodes.push(node);

        } else if (statement.type === 'block') {
            nodes = nodes.concat(handle_statements(statement.program.statements, opts));

            if (statement.program.inverse) {
                nodes = nodes.concat(handle_statements(statement.program.inverse.statements, opts));
            }
        }
    });

    return nodes;
}


function handle_mustache(mustache, opts) {
    if ((mustache.id.string === opts.keyword || mustache.id.string.indexOf(opts.keyword + '.') === 0)
        && mustache.params.length >= 1) {
        return {line: mustache.firstLine, src: make_function(mustache.id, mustache.params)};
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
