'use strict';

let gulp = require('gulp');
let gutil = require('gulp-util');
let bower = require('bower-files')();
let dependencies = bower.relative(__dirname).ext('styl').files;
let inject = require('gulp-inject');
let util = require('util');
let stylus = require('gulp-stylus');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let config = require('./gulp.config.js');
let plumber = require('gulp-plumber');
let errorHandler = require('./errorHandler');

let injectTransform = {
	starttag: '/* inject:imports */',
	endtag: '/* endinject */',
  transform: filepath => `@import '{filepath}';`,
};

let injectConfig = {
	read: false,
	relative: false
};
let configPreprocessor = {
	compress: true,
    'include css': true,
    include: [
        './node_modules/../'      // Shortcut references possible everywhere, e.g. @import 'node_modules/bla'
        ]
    };

gulp.task('styles', stylesTask);

function stylesTask() {

  return gulp
    .src(config.styles.src)
    .pipe(inject(gulp.src(dependencies, injectConfig), injectTransform))
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(stylus(configPreprocessor))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write({sourceRoot: '/client/styles'}))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(config.browserSync.stream({match: '**/*.css'}));
}
