let map = require('../lib/map');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let returnCurrentMapZoomLevel = require('../lib/mapZoom').returnCurrentMapZoomLevel;
let stateMetaEl = require('../lib/CONSTANTS').stateMetaEl;

function geocoderInit(boundaryName) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}, united states`}, deferred.resolve);
	deferred.then(fitBounds);
	return deferred.promise();
}

function getStateNameFromGeoResults(results) {
	// http://stackoverflow.com/questions/6778205/google-maps-geocoder-to-return-state
	let stateName;
	for(let i=0; i < results[0].address_components.length; i++)
    {
        if (results[0].address_components[i].types[0] === "administrative_area_level_1")
        {
            stateName = results[0].address_components[i].short_name;
            sElEvtEmitter.emit('overrideGeoStyle', {boundaryName: stateName, style: {strokeColor: '#fff', fillOpacity: 0.3}});
            sElEvtEmitter.emit('updateStateMeta', stateName);
        }
    }
}

function fitBounds(results) {
	getStateNameFromGeoResults(results);
	map.fitBounds(results[0].geometry.viewport);
}


function updateStateMeta(stateName) {
	stateMetaEl.attr('content', stateName);
}

sElEvtEmitter.on('updateStateMeta', updateStateMeta);

module.exports = geocoderInit;