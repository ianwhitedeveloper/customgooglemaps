var gulp = require('gulp');
var sftp = require('gulp-sftp');
 
gulp.task('sftp-internal', function () {
    return gulp.src('public/**/*')
        .pipe(sftp({
        	host: '10.1.1.168',
        	auth: 'privateKeyEncrypted',
        	remotePath: '/var/www/webserve/7-election.internal-l.thethinktank.com/results'
        }));
});

/*Create a file in root of folder named .ftppass with auth information

example:
{
  "privateKeyEncrypted": {
    "user": "username",
    "passphrase": "passphrase",
    "keyLocation": "~/.ssh/yourkey.pem"
  }
}*/