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
        'po-revision-date': 'YEAR-MO-DA HO:MI+ZONE',
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

    var translation = translations[text.key];
    if (!translation) {
        translations[text.key] = new_translation(text);
    }
    else {
        add_to_translation(translation, text);
    }
}


function new_pot() {
    return {
        charset: potter.defaults.charset,
        headers: _(potter.defaults.headers).clone(),
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
