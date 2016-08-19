'use strict';

let gulp = require('gulp');
let config = require('./gulp.config.js');
let eslint = require('gulp-eslint');
let errorHandler = require('./errorHandler');

gulp.task('lint', ['clean'], lintTask);

function lintTask() {
  return gulp
    .src(config.lint)
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', errorHandler);
}
