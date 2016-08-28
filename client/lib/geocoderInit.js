let map = require('../lib/map');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let returnCurrentMapZoomLevel = require('../lib/mapZoom').returnCurrentMapZoomLevel;

function geocoderInit(boundaryName) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}`}, deferred.resolve);
	deferred.then(fitBounds);
	return deferred.promise();
}

function fitBounds(results) {
	map.fitBounds(results[0].geometry.viewport);
};

module.exports = geocoderInit;