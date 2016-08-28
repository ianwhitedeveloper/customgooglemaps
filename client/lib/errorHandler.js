let sElEvtEmitter = require('./globals').sElEvtEmitter;
let $ = require('jquery');
let notie = require('notie');
let colorKey = require('../lib/CONSTANTS').colorKey;

notie.setOptions({
	colorSuccess: '#57BF57',
	colorError: colorKey.red,
	colorText: '#FFFFFF',
	animationDelay: 1500
})

function generalError(errorMessage) {
	notie.alert(3, errorMessage, 2.5);
}

sElEvtEmitter.on('generalError', generalError);