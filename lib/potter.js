var moment = require('moment');
var _ = require('underscore');


function potter(extracts, pots) {
    pots = pots || {};
    extracts.forEach(function(text) {
        add_to_pots(pots, text);
    });
    return pots;
}


potter.defaults = {
    charset: 'utf-8',
    headers: {
        'project-id-version': 'PACKAGE VERSION',
        'language-team': 'LANGUAGE <LL@li.org>',
        'language': '',
        'mime-version': '1.0',
        'content-transfer-encoding': '8bit'
    }
};


function add_to_pots(pots, text) {
    var pot = pots[text.domain] || new_pot();
    pots[text.domain] = pot;

    var translations = pot.translations[text.context] || {};
    pot.translations[text.context] = translations;

    // NOTE: we currently ignore `text.category`, since Jed ignores this, and
    // since many deem the category modifier unnecessary. This may change.
    var translation = translations[text.key];
    if (!translation) {
        translations[text.key] = new_translation(text);
    }
    else {
        add_to_translation(translation, text);
    }
}


function new_pot() {
    var now = moment(_.now());
    var headers = _(potter.defaults.headers).clone();
    headers['po-revision-date'] = now.format('YYYY-MM-DD hh:mm:ZZ');

    return {
        charset: potter.defaults.charset,
        headers: headers,
        translations: {}
    };
}


function translation_reference(text) {
    return [text.filename, text.line].join(':');
}


function new_translation(text) {
    var translation = {
        msgid: text.key,
        msgstr: text.plural
            ? ['', '']
            : [''],
        msgctx: text.context,
        comments: {reference: translation_reference(text)}
    };

    if (text.plural) {
        translation.msgid_plural = text.plural;
    }

    return translation;
}


function add_to_translation(translation, text) {
    var reference = translation_reference(text);
    if (translation.comments.reference.indexOf(reference) < 0) {
        translation.comments.reference = [
            translation.comments.reference,
            reference
        ].join(' ');
    }
}


module.exports = potter;
