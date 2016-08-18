let map = require('../lib/map');
let $ = require('jquery');

function geocoderInit(boundaryName='united states') {
	var geocoder = new google.maps.Geocoder();

	// Fade in a mask covering the map
	// to try to prevent janky flickering 'animation'
	// when Google maps zooms in
	$('#mask').css({backgroundColor: '#fff', zIndex: '10'});

	// The Google Maps Javascript API v3 is event based. 
	// You need to wait until the new zoom level takes effect before incrementing it by one.
	// Doing this because some states e.g. Texas, new york, have 
	// default zoom levels that are too wide
	google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
		let zoomLevel = map.getZoom();
		if (zoomLevel <= 7) {
			map.setZoom(zoomLevel + 1);
		}
	});

	// Fade out mask
	google.maps.event.addListenerOnce(map, 'idle', function() {
		$('#mask').css({backgroundColor: 'transparent', zIndex: '-1'});
	});

	geocoder.geocode({'address': `${boundaryName}`}, function (results, status) {
		var ne = results[0].geometry.viewport.getNorthEast();
		var sw = results[0].geometry.viewport.getSouthWest();

		map.fitBounds(results[0].geometry.viewport);               


		// DEBUG - Remove this for production
		var boundingBoxPoints = [
			ne, new google.maps.LatLng(ne.lat(), sw.lng()),
			sw, new google.maps.LatLng(sw.lat(), ne.lng()), ne
		];

		var boundingBox = new google.maps.Polyline({
			path: boundingBoxPoints,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		boundingBox.setMap(map);
	}); 
}

module.exports = geocoderInit;