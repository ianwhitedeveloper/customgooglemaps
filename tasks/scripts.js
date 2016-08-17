'use strict';

let babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sourceMaps = require('gulp-sourcemaps'),
    watchify   = require('watchify'),
    plumber = require('gulp-plumber'),
    config = require('./gulp.config.js');

function bundle(bundler) {

    // Add options to add to "base" bundler passed as parameter
    bundler
    // Start bundle
        .bundle()
        .on('error', errorHandler)
        // Entry point
        .pipe(source(config.scripts.src))
        // Convert to gulp pipeline
        .pipe(buffer())
        // Rename output from 'main.js' to 'bundle.js'
        .pipe(rename(config.scripts.outputFile)) 
        // Strip inline source maps
        .pipe(sourceMaps.init({ loadMaps : true }))
        // Save source maps to their own directory
        .pipe(sourceMaps.write(config.scripts.mapsDir))
        // .pipe(uglify({mangle: false}))
        // Save 'bundle' to build/
        .pipe(gulp.dest(config.scripts.dest));
}

gulp.task('scripts', function() {
    // Pass browserify the entry point
    var bundler = browserify(config.scripts.src)
        // Then, babelify, with ES2015 preset
        .transform(babelify, {
            presets: ['es2015']
        });
    // Chain other options -- sourcemaps, rename, etc.
    bundle(bundler);
});


function errorHandler(err) {
 console.log(err);
 gutil.beep();
 this.emit('end');
}
