'use strict';

let gulp = require('gulp');
let clean = require('gulp-clean');
let config = require('./gulp.config.js');
let errorHandler = require('./errorHandler');
 
gulp.task('clean', function (cb) {
    return gulp.src(config.clean.src, {read: false})
        .on('error', errorHandler)
        .pipe(clean());
});