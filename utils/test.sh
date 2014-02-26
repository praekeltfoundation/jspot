#!/bin/bash -e
./node_modules/.bin/jshint `find lib/ test/ -name "*.js"`
./node_modules/.bin/mocha `find "$@" -name "*.test.js"`
