var _ = require('underscore');


function text(opts) {
    return _(opts).defaults({
        plural: null,
        domain: 'messages',
        context: ''
    });
}


function check(method, name, param) {
    if (typeof param != 'string' && typeof param != 'number') {
        throw new Error([
            method + " was given a value of type '" + typeof param + "'",
            "instead of a string or number for parameter",
            "'" + name + "': " + param
        ].join(' '));
    }
}


function gettext() {
    return gettext.gettext.apply(this, arguments);
}


gettext.gettext = function(message) {
    check('gettext', 'message', message);
    return text({key: message});
};


module.exports = gettext;
