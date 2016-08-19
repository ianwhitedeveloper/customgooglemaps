'use strict';

let gulp = require('gulp');

let tasks = [
	'clean',
	'views-prod',
	'lint',
	'copy-prod',
	'images',
	'styles-prod',
	'scripts-prod',
];

gulp.task('build-prod', tasks);
