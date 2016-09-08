let map = require('../lib/map');
let $ = require('jquery');
let debounce = require('es6-promise-debounce');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let Promise = require('es6-promise').Promise;
let STATE_ZOOM_LVL = require('./CONSTANTS').STATE_ZOOM_LVL;
let RESULTS_ZOOM_LVL = require('./CONSTANTS').RESULTS_ZOOM_LVL;

let debouncedFunction = debounce(function(center) {
    return new Promise(function(resolve) {
        resolve(center);
    });
}, 600);

map.addListener('center_changed', queryApiAndGeocoder);

map.addListener('bounds_changed', queryApiAndGeocoder);

function queryApiAndGeocoder() {
	if (map.getZoom() > STATE_ZOOM_LVL) {
		debouncedFunction(map.getCenter())
		.then(center => {
			let lat = center.lat(),
				lng = center.lng();
			sElEvtEmitter.emit('queryElectionAPI', {lat: lat, lng: lng});
			geocoderQuery({lat: lat, lng: lng})
			.then(getCityNameAndUpdateMeta);
		});
	}
}

function getCityNameAndUpdateMeta(results) {
	if (results[0].address_components.length) {
		results[0].address_components.forEach(r => {
			if (r.types.indexOf('locality') > -1) {
				if (r.long_name.toLowerCase() !== 'lyndon') {
				 	sElEvtEmitter.emit('updateCityMeta', r.long_name);
			 	}
			}
		})
	}
}

function geocoderQuery(query) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({location: query, region: 'US'}, deferred.resolve);
	return deferred.promise();
}

map.addListener('bounds_changed', function() {
	if (map.getZoom() < RESULTS_ZOOM_LVL) {
        sElEvtEmitter.emit('clearCityMeta');
	}
});
