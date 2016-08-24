let $ = require('jquery');
let stateSelectEl = require('../lib/CONSTANTS').stateSelectEl;
let sElEvtEmitter = require('./globals').sElEvtEmitter;

stateSelectEl.on('change', (e) => {
	console.log('hi');
});

sElEvtEmitter.on('boundTheMap', updateDropdown);

function updateDropdown({scope}) {
	stateSelectEl
	.find('option:selected').removeAttr("selected");

	stateSelectEl
	.find(`option[value="${scope.split(" ")[0]}"]`)
	.prop('selected', true);
}