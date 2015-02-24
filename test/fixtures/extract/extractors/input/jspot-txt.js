function extract(opts) {
    return opts.source
        .split('\n')
        .reduce(function(results, line, i) {
            if (!line.length) return results;

            var lineResults = line
                .match(/gettext .*/g)
                .map(function(v) {
                    return {
                        key: v.substring('gettext '.length),
                        plural: null,
                        domain: 'messages',
                        context: '',
                        category: null,
                        line: i + 1,
                        filename: opts.filename
                    };
                });

            return results.concat(lineResults);
        }, []);
}


module.exports = extract;
