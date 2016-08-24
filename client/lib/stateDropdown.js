let $ = require('jquery');
let stateSelectEl = require('../lib/CONSTANTS').stateSelectEl;
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let boundTheMap = require('../lib/AddMapBoundaries').boundTheMap;

stateSelectEl.on('change', function(e) {
	boundTheMap({boundaryId: this.value});
});

sElEvtEmitter.on('boundTheMap', updateDropdown);

function updateDropdown({scope}) {
	if (scope) {
		stateSelectEl
		.find('option:selected').removeAttr("selected");

		stateSelectEl
		.find(`option[value="${scope.split(" ")[0]}"]`)
		.prop('selected', true);
	}
}