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
        // Entry point
        .pipe(source(config.scripts.src))
        // Convert to gulp pipeline
        .pipe(buffer())
        // Rename output from 'main.js' to 'bundle.js'
        .pipe(rename('app.js')) 
        // Strip inline source maps
        .pipe(sourceMaps.init()) 
        // Save source maps to their own directory
        .pipe(sourceMaps.write()) 
        // .pipe(uglify({mangle: false}))
        // Save 'bundle' to build/
        .pipe(plumber({errorHandler}))
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
 let message = new gutil.PluginError(err.plugin, err.message).toString();
 process.stderr.write(message + '\n');
 gutil.beep();
}
