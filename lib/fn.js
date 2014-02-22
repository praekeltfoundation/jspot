function check(method, name, param) {
    if (typeof param != 'string' && typeof param != 'number') {
        throw new Error([
            method + " was given a value of type '" + typeof param + "'",
            "instead of a string or number: " + param
        ].join(' '));
    }
}


function fn() {
    return fn.gettext.apply(this, arguments);
}


fn.gettext = function(message) {
    check('gettext', 'message', message);

    return {
        method: 'gettext',
        params: {message: message}
    };
};


module.exports = fn;
