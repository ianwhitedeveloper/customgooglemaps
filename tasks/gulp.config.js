'use strict';

module.exports = {
	lint: [
		'./gulpfile.js',
		'./test/**/*.js',
		'./client/scripts/**/*.js'
	],
	views: {
		src: './client/views/*.jade',
    watch: './client/views/**/*.jade',
		dest: './public/'
	},
	styles: {
		src: './client/styles/*.styl',
    watch: './client/styles/**/*.styl',
		dest: './public/styles/'
	},
	scripts: {
		src: './client/scripts/app.js',
		dest: './public/scripts/'
	},
	images: {
		src: './client/imgs/*',
		dest: './public/imgs/'
	},
	sprites: {
		src: './client/imgs/*.png',
		dest: './public/imgs/sprites/'
	},
	clean: {
		src: './public'
	},
	browserSync: require('browser-sync').create(),
  browserSyncOptions: {
    server: {
      baseDir: './public'
    },
    notify: false,
    reloadDelay: 100,
    open: require('yargs').argv.open
  }
};
