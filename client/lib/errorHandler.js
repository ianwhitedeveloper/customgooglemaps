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

function fatalError(errorMessage) {
	$('#mask').css({background: 'rgba(230, 230, 230, 0.9)', zIndex: '999'});
	$('#mask .fatal_error').html(`<h1>Site temporarily down for maintenance</h1>`);
	console.warn(errorMessage);

}

sElEvtEmitter.on('generalError', generalError);
sElEvtEmitter.on('silentError', silentError);
sElEvtEmitter.on('fatalError', fatalError);