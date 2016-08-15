let map = require('../lib/map');

function geocoderInit(boundaryName='united states') {
	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({'address': boundaryName}, function (results, status) {
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