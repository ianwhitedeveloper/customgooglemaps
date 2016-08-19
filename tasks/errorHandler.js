let gutil = require('gulp-util');

module.exports = function errorHandler(err) {
    console.log(err.message, err.codeFrame);
    gutil.beep();
    this.emit('end');
}