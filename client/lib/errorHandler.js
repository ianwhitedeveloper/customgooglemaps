let sElEvtEmitter = require('./globals').sElEvtEmitter;
let $ = require('jquery');

function generalError(e) {
	console.warn(e);
}

sElEvtEmitter.on('generalError', generalError);