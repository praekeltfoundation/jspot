var vm = require('vm');
var falafel = require('falafel');
var gettext = require('../gettext');


function extract(opts) {
    var src = yoink_members(opts.source, opts);

    return gather(src, opts).map(function(node) {
        return run(cleanup(node), opts);
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


function cleanup(node) {
    // perform all clean
    clean_identifier_arg(node);

    return node;
}

function clean_identifier_arg(node) {
    node.src = falafel(node.src, function(childnode) {
        // find & wrap identifier or member expression in arguments or array
        // into a pass-through function
        if (childnode.type === 'Identifier' || childnode.type === 'MemberExpression') {
            var args;

            if (childnode.parent.type === 'CallExpression') {
                args = childnode.parent.arguments;
            } else if (childnode.parent.type === 'ArrayExpression' && childnode.parent.parent.type === 'CallExpression') {
                args = childnode.parent.elements;
            }

            if (args && args.length && args.indexOf(childnode) > -1) {
                childnode.update('function() { return ' + childnode.source() + '; }');
            }

        }

    }).toString();
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
    }).toString();
}


function gather(src, opts) {
    var matches = [];

    falafel(src, {loc: true}, function(node) {
        if (match(node, opts)) {
            matches.push({
                line: node.loc.start.line,
                src: node.source()
            });
        }
    });

    return matches;
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
