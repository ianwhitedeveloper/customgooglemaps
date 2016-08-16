let map = require('../lib/map');
let $ = require('jquery');

function geocoderInit(boundaryName='united states') {
	var geocoder = new google.maps.Geocoder();
	$('#mask').css({backgroundColor: '#fff', zIndex: '10'});

	// The Google Maps Javascript API v3 is event based. You need to wait until the new zoom level takes effect before incrementing it by one.
	google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
		let zoomLevel = map.getZoom();
		if (zoomLevel <= 7) {
			map.setZoom(zoomLevel + 1);
		}
	});

	google.maps.event.addListenerOnce(map, 'idle', function() {
		$('#mask').css({backgroundColor: 'transparent', zIndex: '-1'});
	});

	geocoder.geocode({'address': `${boundaryName} State`}, function (results, status) {
		var ne = results[0].geometry.viewport.getNorthEast();
		var sw = results[0].geometry.viewport.getSouthWest();

		map.fitBounds(results[0].geometry.viewport);               

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