'use strict';

let gulp = require('gulp');
let imagemin = require('gulp-imagemin');
let plumber = require('gulp-plumber');
let config = require('./gulp.config.js');

gulp.task('images', () =>
    gulp.src(config.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(config.images.dest))
);