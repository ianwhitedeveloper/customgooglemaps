var gulp = require('gulp');
var sftp = require('gulp-sftp');
 
gulp.task('sftp-internal', function () {
    return gulp.src('public/**/*')
        .pipe(sftp());
});