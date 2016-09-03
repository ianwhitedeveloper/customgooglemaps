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

map.addListener('center_changed', function debounceMapCenter() {
	if (map.getZoom() > STATE_ZOOM_LVL) {

		debouncedFunction(map.getCenter())
		.then(center => { 
			let lat = center.lat(),
				lng = center.lng();
			sElEvtEmitter.emit('queryElectionAPI', {lat: lat, lng: lng})
		});
	}
});


map.addListener('bounds_changed', function debounceMapCenter() {
	if (map.getZoom() > STATE_ZOOM_LVL) {
		debouncedFunction(map.getCenter())
		.then(center => { 
			let lat = center.lat(),
				lng = center.lng();
			sElEvtEmitter.emit('queryElectionAPI', {lat: lat, lng: lng})
		});
	}
});

map.addListener('bounds_changed', function() {
	if (map.getZoom() < RESULTS_ZOOM_LVL) {
        sElEvtEmitter.emit('clearCityMeta');
	}
});
