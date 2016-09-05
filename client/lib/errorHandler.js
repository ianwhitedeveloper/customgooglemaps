let sElEvtEmitter = require('./globals').sElEvtEmitter;
let $ = require('jquery');
let notie = require('notie');

notie.setOptions({
	animationDelay: 1500
})

function generalError(error) {
	notie.alert(3, error, 2.5);
	console.trace(error);
}

function silentError(error) {
	console.trace(error);
}

function fatalError(error) {
	$('#mask').css({background: 'rgba(230, 230, 230, 0.9)', zIndex: '999'});
	$('#mask .fatal_error').html(`<h1>Site temporarily down for maintenance</h1>`);
	console.trace(error);

}

sElEvtEmitter.on('generalError', generalError);
sElEvtEmitter.on('silentError', silentError);
sElEvtEmitter.on('fatalError', fatalError);