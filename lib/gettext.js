var _ = require('underscore');


function gettext() {
    return gettext.gettext.apply(this, arguments);
}


gettext.gettext = function(key) {
    check('gettext', 'key', key);
    return text({key: key});
};


gettext.dgettext = function(domain, key) {
    check('dgettext', 'domain', domain);
    check('dgettext', 'key', key);

    return text({
        key: key,
        domain: domain
    });
};


gettext.dcgettext = function(domain, key, category) {
    check('dcgettext', 'domain', domain);
    check('dcgettext', 'key', key);
    check('dcgettext', 'category', category);

    return text({
        key: key,
        domain: domain
    });
};


gettext.ngettext = function(key, plural, value) {
    check('ngettext', 'key', key);
    check('ngettext', 'plural', plural);

    return text({
        key: key,
        plural: plural
    });
};


gettext.dngettext = function(domain, key, plural, value) {
    check('dngettext', 'domain', domain);
    check('dngettext', 'key', key);
    check('dngettext', 'plural', plural);

    return text({
        key: key,
        plural: plural,
        domain: domain
    });
};


gettext.dcngettext = function(domain, key, plural, value, category) {
    check('dcngettext', 'domain', domain);
    check('dcngettext', 'key', key);
    check('dcngettext', 'plural', plural);
    check('dcngettext', 'category', category);

    return text({
        key: key,
        plural: plural,
        domain: domain
    });
};


gettext.pgettext = function(context, key) {
    check('pgettext', 'context', context);
    check('pgettext', 'key', key);

    return text({
        key: key,
        context: context
    });
};


gettext.dpgettext = function(domain, context, key) {
    check('dpgettext', 'domain', domain);
    check('dpgettext', 'context', context);
    check('dpgettext', 'key', key);

    return text({
        key: key,
        domain: domain,
        context: context
    });
};


gettext.npgettext = function(context, key, plural, value) {
    check('npgettext', 'context', context);
    check('npgettext', 'key', key);
    check('npgettext', 'plural', plural);

    return text({
        key: key,
        plural: plural,
        context: context
    });
};


gettext.dnpgettext = function(domain, context, key, plural, value) {
    check('dnpgettext', 'domain', domain);
    check('dnpgettext', 'context', context);
    check('dnpgettext', 'key', key);
    check('dnpgettext', 'plural', plural);

    return text({
        key: key,
        plural: plural,
        domain: domain,
        context: context
    });
};


gettext.dcnpgettext = function(domain, context, key, plural, value, category) {
    check('dcnpgettext', 'domain', domain);
    check('dcnpgettext', 'context', context);
    check('dcnpgettext', 'key', key);
    check('dcnpgettext', 'plural', plural);
    check('dcnpgettext', 'category', category);

    return text({
        key: key,
        plural: plural,
        domain: domain,
        context: context
    });
};


function text(opts) {
    return _(opts).defaults({
        plural: null,
        domain: 'messages',
        context: '',
        category: null
    });
}


function check(method, name, param) {
    if (_.isFunction(param)) {
        param = param();
    }

    if (typeof param != 'string' && typeof param != 'number') {
        throw new Error([
            method + " was given a value of type '" + typeof param + "'",
            "instead of a string or number for parameter",
            "'" + name + "': " + param
        ].join(' '));
    }
}


module.exports = gettext;
