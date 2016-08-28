let sElEvtEmitter = require('./globals').sElEvtEmitter;
let $ = require('jquery');
let notie = require('notie');

notie.setOptions({
	animationDelay: 1500
})

function generalError(errorMessage) {
	notie.alert(3, errorMessage, 2.5);
}

sElEvtEmitter.on('generalError', generalError);