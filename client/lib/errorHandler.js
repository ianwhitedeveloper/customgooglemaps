let sElEvtEmitter = require('./globals').sElEvtEmitter;
let $ = require('jquery');
let notie = require('notie');

notie.setOptions({
	animationDelay: 1500
})

function generalError(errorMessage) {
	notie.alert(3, errorMessage, 2.5);
}

function silentError(errorMessage) {
	console.warn(errorMessage);
}

sElEvtEmitter.on('generalError', generalError);
sElEvtEmitter.on('silentError', silentError);