let geocoderInit = require('../lib/geocoderInit');
let map = require('../lib/map');
let dummyStateResults = require('../lib/dummyStateResults');
let stateDict = require('../lib/stateDict');
let $ = require('jquery');

let AddMapBoundaries = {
	myBoundaries: {},
	boundariesFromGeoJsonLayer: null,
	infoWindow: null,
	geoStyles: {
		// defaultFillColor: 'blue',
		defaultOpacity: 0.8
	},

	loadBoundariesFromGeoJson: function loadBoundariesFromGeoJson(boundariesFromGeoJson) {
		AddMapBoundaries.initializeDataLayer();
		if (boundariesFromGeoJson.type === "FeatureCollection") { //we have a collection of boundaries in geojson format
			if (boundariesFromGeoJson.features) {
				for (var i = 0; i < boundariesFromGeoJson.features.length; i++) {
					var boundaryId = i + 1;
					var new_boundary = {};
					var boundaryName = boundariesFromGeoJson.features[i].properties.NAME;

					if (!boundariesFromGeoJson.features[i].properties) { 
						boundariesFromGeoJson.features[i].properties = {};
					}

					boundariesFromGeoJson.features[i].properties.boundaryId = boundaryId; //we will use this id to identify boundary later when clicking on it
					AddMapBoundaries.boundariesFromGeoJsonLayer.addGeoJson(boundariesFromGeoJson.features[i], {idPropertyName: 'boundaryId'});
					new_boundary.feature = AddMapBoundaries.boundariesFromGeoJsonLayer.getFeatureById(boundaryId);
					AddMapBoundaries.myBoundaries[boundaryName] = new_boundary;

					if (boundaryName in stateDict) {
						AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(AddMapBoundaries.myBoundaries[boundaryName].feature, {
							strokeWeight: 1,
							strokeColor: '#fff',
							fillColor: dummyStateResults.states[stateDict[boundaryName]] ? dummyStateResults.states[stateDict[boundaryName]].winner : '',
							fillOpacity: 0.8
						});
					}

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
			// AddMapBoundaries.boundariesFromGeoJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
			// 	fillColor: '#ddd',
			// 	strokeWeight: 1,
			// 	fillOpacity: 1
			// });
			// AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
			// 	strokeWeight: 3,
			// 	strokeColor: '#ff0000',
			// 	fillColor: 'blue',
			// 	fillOpacity: 0.8
			// });
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('mouseover', function(e) {
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 3,
			});
			var boundaryId = e.feature.getProperty('boundaryId');
			var boundaryName = "NOT SET";
			if(boundaryId && 
				AddMapBoundaries.myBoundaries[boundaryId] && 
				AddMapBoundaries.myBoundaries[boundaryId].name
			) {
				boundaryName = AddMapBoundaries.myBoundaries[boundaryId].name;
			}
			$('#bname').html(boundaryName);
		});

		AddMapBoundaries.boundariesFromGeoJsonLayer.addListener('mouseout', function(e) {
			AddMapBoundaries.boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
				strokeWeight: 1,
				strokeColor: '#fff'
			});
			$('#bname').html('United States');
		});
	},

	boundTheMap: function boundTheMap(e) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundaryId'); we set when adding boundary to boundariesFromGeoJson layer
		var boundaryId = e.feature.f.NAME;

		if (
			e.feature &&
			boundaryId && 
			AddMapBoundaries.myBoundaries[boundaryId]
		) {
			if(AddMapBoundaries.infoWindow){
				AddMapBoundaries.infoWindow.setMap(null);
				AddMapBoundaries.infoWindow = null;
			}

			AddMapBoundaries.infoWindow = new google.maps.InfoWindow({
				content: '<div>You have clicked a boundary: <span style="color:red;">' + boundaryId + '</span></div>',
				size: new google.maps.Size(150,50),
				position: e.latLng, map: map
			});

			$(window).on('resize load', () => {
				geocoderInit(boundaryId);
			});
			geocoderInit(boundaryId);
		}
	}
}

module.exports = AddMapBoundaries;