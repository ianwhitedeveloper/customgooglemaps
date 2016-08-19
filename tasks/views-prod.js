'use strict';

let gulp = require('gulp');
let gutil = require('gulp-util');
let jade = require('gulp-jade');
let config = require('./gulp.config.js');
let plumber = require('gulp-plumber');
let errorHandler = require('./errorHandler');

gulp.task('views-prod', ['clean'], viewsTask);

function viewsTask() {
  return gulp
    .src(config.views.src)
    .pipe(plumber({ errorHandler: errorHandler }))
    // remove pretty: true for future prod task
    .pipe(jade())
    .pipe(gulp.dest(config.views.dest));
}
