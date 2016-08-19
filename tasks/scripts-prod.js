'use strict';

let babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    uglify     = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    config = require('./gulp.config.js'),
// add custom browserify options here
    opts = {
        entries: [config.scripts.src]
    },
    errorHandler = require('./errorHandler'),
    bundler = browserify(opts);

// add transformations here
// i.e. b.transform(coffeeify);
bundler
.transform(babelify, {
    presets: ['es2015']
});

function bundle() {

    // Add options to add to "base" bundler passed as parameter
    return bundler
    // Start bundle
        .bundle()
        .on('error', errorHandler)
        // Entry point
        .pipe(source(config.scripts.src))
        // Convert to gulp pipeline
        .pipe(buffer())
        // Rename output from 'main.js' to 'bundle.js'
        .pipe(rename(config.scripts.outputFile)) 
        .pipe(uglify({mangle: true}))
        // Save 'bundle' to build/
        .pipe(gulp.dest(config.scripts.dest));
}

gulp.task('scripts-prod', ['clean'], bundle);
