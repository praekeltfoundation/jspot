module.exports = {
    extract: {
        target: '.',
        filename: '',
        keyword: 'gettext'
    },
    json: {
        target: '.'
    },
    pot: {
        charset: 'utf-8',
        headers: {
            'project-id-version': 'PACKAGE VERSION',
            'language-team': 'LANGUAGE <LL@li.org>',
            'language': '',
            'mime-version': '1.0',
            'content-type': 'text/plain; charset=utf-8',
            'content-transfer-encoding': '8bit',

            // NOTE: this value is intentionally stubby, and should be written to
            // the .pot file this way. Translation tools should set this date when
            // the .po files are created.
            'po-revision-date': 'YEAR-MO-DA HO:MI+ZONE'
        }
    }
};
