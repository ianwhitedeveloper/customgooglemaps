let map = require('../lib/map');
let $ = require('jquery');
let debounce = require('es6-promise-debounce');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let Promise = require('es6-promise').Promise;

let debouncedFunction = debounce(function(center) {
    return new Promise(function(resolve) {
        resolve(center);
    });
}, 600);

map.addListener('center_changed', function debounceMapCenter() {
	debouncedFunction(map.getCenter())
	.then(center => { 
		let lat = center.lat(),
			lng = center.lng();
		sElEvtEmitter.emit('queryElectionAPI', {lat: lat, lng: lng})
	});
});
