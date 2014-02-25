var cli = module.exports = require('nomnom');


cli.script('jspot');


var extract = cli
    .command('extract')
    .callback(extract)
    .help('Extract source from javascript files into pot files')
    .option('source', {
        position: 0,
        required: true,
        list: true,
        help: 'The source files to extract from.'
    })
    .option('target', {
        abbr: 't',
        metavar: 'DIR',
        default: ".",
        help: "Directory to write pot files to."
    })
    .option('keyword', {
        abbr: 'k',
        metavar: 'WORD',
        default: 'gettext',
        help: 'Keyword to search for in source'
    });


extract.callback(function() {
});


if (require.main === module) {
    cli.nom();
}
