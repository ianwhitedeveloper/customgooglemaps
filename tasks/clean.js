'use strict';

let gulp = require('gulp');
let clean = require('gulp-clean');
let config = require('./gulp.config.js');
 
gulp.task('clean', function (cb) {
    return gulp.src(config.clean.src, {read: false})
        .pipe(clean());

        cb(error);
});