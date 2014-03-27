var vm = require('vm');
var _ = require('underscore');
var falafel = require('falafel');

var defaults = require('./defaults');
var gettext = require('./gettext');


function extract(src, opts) {
    opts = _(opts || {}).defaults(defaults.extract);
    src = yoink_members(src, opts).toString();

    return gather(src, opts).map(function(node) {
        return run(node, opts);
    });
}


function match(node, opts) {
    if (node.type !== 'CallExpression') {
        return false;
    }

    if (node.callee.type === 'Identifier') {
        return node.callee.name === opts.keyword;
    }

    if (node.callee.type !== 'MemberExpression') {
        return false;
    }

    if (node.callee.object.type === 'Identifier') {
        return node.callee.object.name === opts.keyword;
    }

    if (node.callee.object.type === 'MemberExpression') {
        return node.callee.object.object.name === opts.keyword;
    }

    return false;
}


function is_member(node, opts) {
    return node.type === 'Identifier'
        && node.name === opts.keyword
        && node.parent
        && node.parent.property === node
        && node.parent.type == 'MemberExpression';
}


function yoink_members(src, opts) {
    return falafel(src, function(node) {
        if (is_member(node, opts)) {
            node.parent.update(node.source());
        }
    });
}


function gather(src, opts) {
    var matches = [];

    falafel(src, {loc: true}, function(node) {
        if (match(node, opts)) {
            matches.push(node);
        }
    });

    return matches;
}


function run(node, opts) {
    var context = {};
    context[opts.keyword] = gettext;

    var result;
    try {
        result = vm.runInNewContext(node.source(), context);
    }
    catch (e) {
        throw new Error([
            "on line " + node.loc.start.line,
            "of file '" + opts.filename + "'",
            e.message].join(' '));
    }

    result.line = node.loc.start.line;
    result.filename = opts.filename;
    return result;
}


module.exports = extract;
