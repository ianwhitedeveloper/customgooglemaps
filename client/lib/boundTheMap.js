module.exports = function boundTheMap(e, myBoundaries) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundary_id'); we set when adding boundary to geoDataJson layer
	if (!e.feature) {

	}

	var boundary_id = e.feature.getProperty('boundary_id');
	var boundary_name = "NOT SET";
	var geocoder = new google.maps.Geocoder();


	if(boundary_id && 
		myBoundaries[boundary_id] && 
		myBoundaries[boundary_id].name
	) {
		boundary_name = myBoundaries[boundary_id].name;
	}
	if(infoWindow){
		infoWindow.setMap(null);
		infoWindow = null;
	}

	infoWindow = new google.maps.InfoWindow({
		content: '<div>You have clicked a boundary: <span style="color:red;">' + boundary_name + '</span></div>',
		size: new google.maps.Size(150,50),
		position: e.latLng, map: map
	});


	geocoder.geocode({'address': boundary_name}, function (results, status) {
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