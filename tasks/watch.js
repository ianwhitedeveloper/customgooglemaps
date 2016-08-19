'use strict';

let gulp = require('gulp');
let gulpConfig = require('./gulp.config.js');

gulp.task('watch', watchTask);

function watchTask() {
  gulp.watch(gulpConfig.views.watch, [
    'views',
    gulpConfig.browserSync.reload
  ]);

  gulp.watch(gulpConfig.styles.watch, ['styles']);

  gulp.watch(gulpConfig.scripts.watch, [
    'scripts',
    gulpConfig.browserSync.reload
  ]);
  // gulp.watch(gulpConfig.lint, ['lint']);
}
