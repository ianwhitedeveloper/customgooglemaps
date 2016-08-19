let gulp = require('gulp'),
	config = require('./gulp.config.js');

gulp.task('copy-prod', ['clean'], function () {
	gulp
	.src(config.copy.src)
	.pipe(gulp.dest(config.copy.dest));
});