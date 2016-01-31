var moment = require('moment');
var defaults = require('./defaults');
var _ = require('underscore');


function pot(opts) {
    opts = _.defaults(opts || {}, {
        extracts: [],
        pots: {},
        headers: {}
    }, defaults.pot);

    _.defaults(opts.headers, defaults.pot.headers);

    opts.extracts.forEach(function(text) {
        add_to_pots(opts.pots, text, opts);
    });

    return opts.pots;
}


function add_to_pots(pots, text, opts) {
    var pot = pots[text.domain] || new_pot(opts);
    pots[text.domain] = pot;

    var translations = pot.translations[text.context] || {};
    pot.translations[text.context] = translations;

    add_to_translations(translations, text, opts);
}


function add_to_translations(translations, text, opts) {
    // NOTE: we currently ignore `text.category`, since Jed ignores this, and
    // since many deem the category modifier unnecessary. This may change.
    var translation = translations[text.key];

    if (!translation) {
        translations[text.key] = new_translation(text, opts);
    }
    else if (!translation.msgid_plural && text.plural) {
        translations[text.key] = replace_translation(translation, text, opts);
    }
    else {
        add_translation_reference(translation, translation_reference(text));
    }
}


function new_pot(opts) {
    var now = moment.utc(_.now()).format('YYYY-MM-DD hh:mm:ZZ');
    var headers = {'pot-creation-date': now};
    _(headers).defaults(opts.headers);

    return {
        charset: opts.charset,
        headers: headers,
        translations: {}
    };
}


function translation_reference(text, opts) {
    return [text.filename, text.line].join(':');
}


function new_translation(text, opts) {
    var translation = {
        msgid: text.key,
        msgstr: text.plural
            ? ['', '']
            : [''],
        msgctxt: text.context,
        comments: {reference: translation_reference(text)}
    };

    if (text.plural) {
        translation.msgid_plural = text.plural;
    }

    return translation;
}


function replace_translation(old, text, opts) {
    var translation = new_translation(text, opts);
    clear_translation_reference(translation);
    add_translation_reference(translation, old.comments.reference);
    add_translation_reference(translation, translation_reference(text));
    return translation;
}


function clear_translation_reference(translation) {
    translation.comments.reference = '';
}


function add_translation_reference(translation, reference) {
    if (translation.comments.reference.indexOf(reference) < 0) {
        translation.comments.reference = [
            translation.comments.reference,
            reference
        ]
        .join(' ')
        .trim();
    }
}


module.exports = pot;
