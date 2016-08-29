let map = require('../lib/map');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let returnCurrentMapZoomLevel = require('../lib/mapZoom').returnCurrentMapZoomLevel;
let stateMetaEl = require('../lib/CONSTANTS').stateMetaEl;
let getStateNameFromGeoResults = require('../lib/getStateNameFromGeoResults');

function geocoderInit(boundaryName) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}, united states`}, deferred.resolve);
	deferred.then(fitBounds);
	return deferred.promise();
}

function fitBounds(results) {
	getStateNameFromGeoResults(results)
	.then(stateName => {
        sElEvtEmitter.emit('updateStateMeta', stateName);
	});

	map.fitBounds(results[0].geometry.viewport);
}


function updateStateMeta(stateName) {
	stateMetaEl.attr('content', stateName);
}

sElEvtEmitter.on('updateStateMeta', updateStateMeta);

module.exports = {
	geocoderInit
};