let map = require('../lib/map');
let $ = require('jquery');
let deferred = $.Deferred();

function customDefaultZoom() {
	// The Google Maps Javascript API v3 is event based. 
	// You need to wait until the new zoom level takes effect before incrementing it by one.
	// Doing this because some states e.g. Texas, new york, have 
	// default zoom levels that are too wide
	/*google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
		let zoomLevel = map.getZoom();
		if (zoomLevel <= 7) {
			map.setZoom(zoomLevel + 1);
		}
	});*/
}

function geocoderInit(boundaryName) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}`}, deferred.resolve); 
	return deferred.promise();
}

deferred.done((results) => {
	map.fitBounds(results[0].geometry.viewport);               
});

module.exports = geocoderInit;