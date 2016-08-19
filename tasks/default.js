'use strict';

let gulp = require('gulp');

let tasks = [
	'views',
	'copy',
	'browser-sync',
	// 'sprites',
	// 'images',
	'styles',
	'scripts',
	// 'lint',
	// 'gulp-clean',
	'watch',
];

gulp.task('default', tasks);
