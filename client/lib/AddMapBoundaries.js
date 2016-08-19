let geocoderInit = require('../lib/geocoderInit');
let map = require('../lib/map');
let stateDict = require('../lib/stateDict');
let calcAndDisplayResults = require('../lib/calcAndDisplayResults');
let $ = require('jquery');

let myBoundaries = {};
let boundariesFromGeoJsonLayer = null;
let infoWindow = null;
let results = null;
let colorKey = {
	purple: '#4F2169',
	red: '#DA1F31',
	blue: '#0099DD'
};

function overrideGeoStyle({boundaryName, style={strokeWeight:1, strokeColor:'#fff',fillOpacity:1}}={}) {
	if (boundaryName in stateDict) {
		let boundaryWinner = results.states[stateDict[boundaryName]] ? results.states[stateDict[boundaryName]].winner : '';

		boundariesFromGeoJsonLayer.overrideStyle(myBoundaries[boundaryName].feature, {
			strokeWeight: style.strokeWeight,
			strokeColor: style.strokeColor,
			fillColor: colorKey[boundaryWinner],
			fillOpacity: style.fillOpacity
		});
	}
}

function init({bounds, results}={}) {
	setResults(results);
	initializeDataLayer();
	loadBoundariesFromGeoJson(bounds);
}

function setResults(r) {
	results = r;
}

function loadBoundariesFromGeoJson(boundariesFromGeoJson) {
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
				boundariesFromGeoJsonLayer.addGeoJson(boundariesFromGeoJson.features[i], {idPropertyName: 'boundaryId'});
				new_boundary.feature = boundariesFromGeoJsonLayer.getFeatureById(boundaryId);
				myBoundaries[boundaryName] = new_boundary;

				overrideGeoStyle({boundaryName: boundaryName, style: {strokeWeight: 1, strokeColor: '#fff', fillOpacity: 1}});

			}
		}
	}

	calcAndDisplayResults(results, "national");
}

function initializeDataLayer(){
	if(boundariesFromGeoJsonLayer){
		boundariesFromGeoJsonLayer.forEach(function(feature) {
			boundariesFromGeoJsonLayer.remove(feature);
		});
		boundariesFromGeoJsonLayer = null;
	}
	boundariesFromGeoJsonLayer = new google.maps.Data({map: map}); //initialize boundariesFromGeoJson layer which contains the boundaries. It's possible to have multiple boundariesFromGeoJson layers on one map

	boundariesFromGeoJsonLayer.addListener('click', boundTheMap);

	boundariesFromGeoJsonLayer.addListener('click', function(e) {
		calcAndDisplayResults(results, stateDict[e.feature.f.NAME], true);
		boundariesFromGeoJsonLayer.revertStyle();
		boundariesFromGeoJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
			fillColor: '#ddd',
			fillOpacity: 1
		});
		
		overrideGeoStyle({boundaryName: e.feature.f.NAME, style: {fillOpacity: 0.3}});
	});

	boundariesFromGeoJsonLayer.addListener('mouseover', function(e) {
		boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
			strokeWeight: 3,
		});

		var boundaryName = e.feature.f.NAME;
		

		if(boundaryName) {
			$('#bname').html(boundaryName);
		}
	});

	boundariesFromGeoJsonLayer.addListener('mouseout', function(e) {
		boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
			strokeWeight: 1
		});
		$('#bname').html('United States');
	});
}

function boundTheMap(e) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundaryId'); we set when adding boundary to boundariesFromGeoJson layer
	var boundaryId = e.feature.f.NAME;
	
	if (
		e.feature &&
		boundaryId && 
		myBoundaries[boundaryId]
	) {
		if(infoWindow){
			infoWindow.setMap(null);
			infoWindow = null;
		}

		infoWindow = new google.maps.InfoWindow({
			content: '<div>You have clicked a boundary: <span style="color:red;">' + boundaryId + '</span></div>',
			size: new google.maps.Size(150,50),
			position: e.latLng, map: map
		});

		$(window).on('resize load', () => {
			geocoderInit(`${boundaryId} State`);
		});
		geocoderInit(`${boundaryId} State`);
	}
}

module.exports = {
	init: init
}
