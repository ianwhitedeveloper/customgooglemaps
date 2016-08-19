'use strict';

let gulp = require('gulp');
let gutil = require('gulp-util');
let jade = require('gulp-jade');
let config = require('./gulp.config.js');
let plumber = require('gulp-plumber');

gulp.task('views-prod', ['clean'], viewsTask);

function viewsTask() {
  return gulp
    .src(config.views.src)
    .pipe(plumber({ errorHandler: onError }))
    // remove pretty: true for future prod task
    .pipe(jade())
    .pipe(gulp.dest(config.views.dest));
}

function onError(err) {
	let message = new gutil.PluginError(err.plugin, err.message).toString();
  process.stderr.write(message + '\n');
	gutil.beep();
}
