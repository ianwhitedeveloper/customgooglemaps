module.exports = function loadBoundariesFromGeoJson(geoDataJson, geoDataJsonLayer) {
	let myBoundaries = {};
	initializeDataLayer();
	if (geoDataJson.type === "FeatureCollection") { //we have a collection of boundaries in geojson format
		if (geoDataJson.features) {
			for (var i = 0; i < geoDataJson.features.length; i++) {
				var boundary_id = i + 1;
				var new_boundary = {};
				if (!geoDataJson.features[i].properties) { 
					geoDataJson.features[i].properties = {};
				}
				geoDataJson.features[i].properties.boundary_id = boundary_id; //we will use this id to identify boundary later when clicking on it
				geoDataJsonLayer.addGeoJson(geoDataJson.features[i], {idPropertyName: 'boundary_id'});
				new_boundary.feature = geoDataJsonLayer.getFeatureById(boundary_id);
				if (geoDataJson.features[i].properties.name) {
					new_boundary.name = geoDataJson.features[i].properties.name;
				}
				if (geoDataJson.features[i].properties.NAME) {
					new_boundary.name = geoDataJson.features[i].properties.NAME;
				}
				myBoundaries[boundary_id] = new_boundary;
			}
		}
	}

	return myBoundaries;
}