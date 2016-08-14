module.exports = function initializeDataLayer(myBoundaries){
	let geoDataJsonLayer;

	i/*f(geoDataJsonLayer){
		geoDataJsonLayer.forEach(function(feature) {
			geoDataJsonLayer.remove(feature);
		});
		geoDataJsonLayer = null;
	}*/
	geoDataJsonLayer = new google.maps.Data({map: map}); //initialize geoDataJson layer which contains the boundaries. It's possible to have multiple geoDataJson layers on one map
	geoDataJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
		fillColor: 'blue',
		strokeWeight: 1,
		fillOpacity: 0.8
	});

	geoDataJsonLayer.addListener('click', boundTheMap);

	geoDataJsonLayer.addListener('mouseover', function(e) {
		geoDataJsonLayer.overrideStyle(e.feature, {
			strokeWeight: 3,
			strokeColor: '#ff0000'
		});
		var boundary_id = e.feature.getProperty('boundary_id');
		var boundary_name = "NOT SET";
		if(boundary_id && 
			myBoundaries[boundary_id] && 
			myBoundaries[boundary_id].name
		) {
			boundary_name = myBoundaries[boundary_id].name;
		}
		$('#bname').html(boundary_name);
	});

	geoDataJsonLayer.addListener('mouseout', function(e) {
		geoDataJsonLayer.overrideStyle(e.feature, {
			strokeWeight: 1,
			strokeColor: ''
		});
		$('#bname').html("");
	});

	return geoDataJsonLayer;
}