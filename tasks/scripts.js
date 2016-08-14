'use strict';

let gulp = require('gulp');
let gutil = require('gulp-util');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');
let config = require('./gulp.config.js');
let plumber = require('gulp-plumber');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let bower = require('bower-files')();
let browserify = require('gulp-browserify');

gulp.task('scripts', scriptsTask);

function scriptsTask() {
  
  return gulp
    .src(config.scripts.src)
    .pipe(plumber({errorHandler}))
    // .pipe(sourcemaps.init())
    .pipe(babel())
    // .pipe(concat('app.js'))
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    // .pipe(uglify({mangle: false}))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scripts.dest));
}

function errorHandler(err) {
	let message = new gutil.PluginError(err.plugin, err.message).toString();
	process.stderr.write(message + '\n');
	gutil.beep();
}
