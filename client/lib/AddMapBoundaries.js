let boundariesFromGeoJson = require('../lib/boundariesFromGeoJson');
let map = require('../lib/map');
let $ = require('jquery');

let AddMapBoundaries = {
	myBoundaries: {},
	boundariesFromGeoJsonLayer: null,
	infoWindow: null,

	loadBoundariesFromGeoJson: function loadBoundariesFromGeoJson(boundariesFromGeoJson) {
		// AddMapBoundaries.initializeDataLayer();
		if (boundariesFromGeoJson.type === "FeatureCollection") { //we have a collection of boundaries in geojson format
			if (boundariesFromGeoJson.features) {
				for (var i = 0; i < boundariesFromGeoJson.features.length; i++) {
					var boundary_id = i + 1;
					var new_boundary = {};
					if (!boundariesFromGeoJson.features[i].properties) { 
						boundariesFromGeoJson.features[i].properties = {};
					}
					boundariesFromGeoJson.features[i].properties.boundary_id = boundary_id; //we will use this id to identify boundary later when clicking on it
					AddMapBoundaries.boundariesFromGeoJsonLayer.addGeoJson(boundariesFromGeoJson.features[i], {idPropertyName: 'boundary_id'});
					new_boundary.feature = AddMapBoundaries.boundariesFromGeoJsonLayer.getFeatureById(boundary_id);
					if (boundariesFromGeoJson.features[i].properties.name) {
						new_boundary.name = boundariesFromGeoJson.features[i].properties.name;
					}
					if (boundariesFromGeoJson.features[i].properties.NAME) {
						new_boundary.name = boundariesFromGeoJson.features[i].properties.NAME;
					}
					AddMapBoundaries.myBoundaries[boundary_id] = new_boundary;
				}
			}
		}
	},

	initializeDataLayer: function initializeDataLayer(){
		if(AddMapBoundaries.boundariesFromGeoJsonLayer){
			AddMapBoundaries.boundariesFromGeoJsonLayer.forEach(function(feature) {
				AddMapBoundaries.boundariesFromGeoJsonLayer.remove(feature);
			});
			AddMapBoundaries.boundariesFromGeoJsonLayer = null;
		}
		AddMapBoundaries.boundariesFromGeoJsonLayer = new google.maps.Data({map: map}); //initialize boundariesFromGeoJson layer which contains the boundaries. It's possible to have multiple boundariesFromGeoJson layers on one map
		AddMapBoundaries.boundariesFromGeoJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
			fillColor: 'blue',
			strokeWeight: 1,
			fillOpacity: 0.8
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('click', AddMapBoundaries.boundTheMap);

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('mouseover', function(e) {
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 3,
				strokeColor: '#ff0000'
			});
			var boundary_id = e.feature.getProperty('boundary_id');
			var boundary_name = "NOT SET";
			if(boundary_id && 
				AddMapBoundaries.myBoundaries[boundary_id] && 
				AddMapBoundaries.myBoundaries[boundary_id].name
			) {
				boundary_name = AddMapBoundaries.myBoundaries[boundary_id].name;
			}
			$('#bname').html(boundary_name);
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('mouseout', function(e) {
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 1,
				strokeColor: ''
			});
			$('#bname').html("");
		});
	},

	boundTheMap: function boundTheMap(e) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundary_id'); we set when adding boundary to boundariesFromGeoJson layer

		if (!e.feature) {

		}

		var boundary_id = e.feature.getProperty('boundary_id');
		var boundary_name = "NOT SET";
		var geocoder = new google.maps.Geocoder();


		if(boundary_id && 
			AddMapBoundaries.myBoundaries[boundary_id] && 
			AddMapBoundaries.myBoundaries[boundary_id].name
		) {
			boundary_name = AddMapBoundaries.myBoundaries[boundary_id].name;
		}

		if(AddMapBoundaries.infoWindow){
			AddMapBoundaries.infoWindow.setMap(null);
			AddMapBoundaries.infoWindow = null;
		}

		AddMapBoundaries.infoWindow = new google.maps.InfoWindow({
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
}

module.exports = AddMapBoundaries;