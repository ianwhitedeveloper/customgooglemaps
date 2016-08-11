'use strict';

let gulp = require('gulp');

let tasks = [
	'vendorCSS',
	'vendorJS',
	'views',
	'browser-sync',
	// 'sprites',
	'images',
	'styles',
	'scripts',
	'lint',
	// 'gulp-clean',
	'watch'
];

gulp.task('default', tasks);
