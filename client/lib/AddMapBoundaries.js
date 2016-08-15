let boundariesFromGeoJson = require('../lib/boundariesFromGeoJson');
let geocoderInit = require('../lib/geocoderInit');
let map = require('../lib/map');
let $ = require('jquery');

let AddMapBoundaries = {
	myBoundaries: {},
	boundariesFromGeoJsonLayer: null,
	infoWindow: null,
	geoStyles: {
		defaultFillColor: 'blue',
		defaultOpacity: 0.8
	},

	loadBoundariesFromGeoJson: function loadBoundariesFromGeoJson(boundariesFromGeoJson) {
		AddMapBoundaries.initializeDataLayer();
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
			fillColor: this.geoStyles.defaultFillColor,
			strokeWeight: 1,
			fillOpacity: this.geoStyles.defaultOpacity
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('click', AddMapBoundaries.boundTheMap);
		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('click', function(e) {
			/*TODO: clean up
			Crude attempt to Show zoomed into the state in the visual (other states should either not be visible or maybe greyed out if possible)*/
			AddMapBoundaries.boundariesFromGeoJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
				fillColor: '#ddd',
				strokeWeight: 1,
				fillOpacity: 1
			});
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 3,
				strokeColor: '#ff0000',
				fillColor: 'blue',
				fillOpacity: 0.8
			});
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('mouseover', function(e) {
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 3,
				strokeColor: '#ff0000'
			});
			var boundary_id = e.feature.getProperty('boundary_id');
			var boundaryName = "NOT SET";
			if(boundary_id && 
				AddMapBoundaries.myBoundaries[boundary_id] && 
				AddMapBoundaries.myBoundaries[boundary_id].name
			) {
				boundaryName = AddMapBoundaries.myBoundaries[boundary_id].name;
			}
			$('#bname').html(boundaryName);
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('mouseout', function(e) {
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 1,
				strokeColor: '#000'
			});
			$('#bname').html('United States');
		});
	},

	boundTheMap: function boundTheMap(e) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundary_id'); we set when adding boundary to boundariesFromGeoJson layer

		if (!e.feature) {
			return;
		}

		var boundary_id = e.feature.getProperty('boundary_id');
		var boundaryName = null;


		if(boundary_id && 
			AddMapBoundaries.myBoundaries[boundary_id] && 
			AddMapBoundaries.myBoundaries[boundary_id].name
		) {
			boundaryName = AddMapBoundaries.myBoundaries[boundary_id].name;
		}

		if(AddMapBoundaries.infoWindow){
			AddMapBoundaries.infoWindow.setMap(null);
			AddMapBoundaries.infoWindow = null;
		}

		AddMapBoundaries.infoWindow = new google.maps.InfoWindow({
			content: '<div>You have clicked a boundary: <span style="color:red;">' + boundaryName + '</span></div>',
			size: new google.maps.Size(150,50),
			position: e.latLng, map: map
		});

		$(window).on('resize load', () => {
			geocoderInit(boundaryName);
		});
		geocoderInit(boundaryName);

	}
}

module.exports = AddMapBoundaries;