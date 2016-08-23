let geocoderInit = require('../lib/geocoderInit');
let map = require('../lib/map');
let stateDict = require('../lib/stateDict');
let calcAndDisplayResults = require('../lib/calcAndDisplayResults');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;

let myBoundaries = {};
// initialize boundariesFromGeoJson layer which contains the boundaries. It's possible to have multiple boundariesFromGeoJson layers on one map
let boundariesFromGeoJsonLayer = new google.maps.Data({map: map});
let infoWindow = null;
let results = null;
let colorKey = {
	purple: '#4F2169',
	red: '#DA1F31',
	blue: '#0099DD'
};

function init({bounds, scope, results, boundaryId}={}) {
	setResults(results);
	initializeDataLayer();
	loadBoundariesFromGeoJson({boundariesFromGeoJson: bounds, scope: scope});
	boundTheMap({boundaryId: boundaryId});
	sElEvtEmitter.emit('updateBannerText', {bannerText: scope});
}

function setResults(r) {
	results = r;
}

function loadBoundariesFromGeoJson({boundariesFromGeoJson, scope} = {}) {
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

				overrideGeoStyle({boundaryName: boundaryName, style: {strokeWeight: 1, strokeColor: '#fff', fillOpacity: 0.3}});

			}
		}
	}

	calcAndDisplayResults({results: results, scope: scope});
}

function initializeDataLayer(){
	boundariesFromGeoJsonLayer.addListener('click', boundaryClick);
	boundariesFromGeoJsonLayer.addListener('mouseover', boundaryMouseOver);
	boundariesFromGeoJsonLayer.addListener('mouseout', boundaryMouseOut);
}

function boundTheMap({boundaryId} = {}) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundaryId'); we set when adding boundary to boundariesFromGeoJson layer
	try {
		/*This means we've found a state
		so now update state color
		and append 'State' to name
		because Google isn't smart enough 
		in certain situations e.g. new york will
		show NYC, not NY, the state*/
		if (myBoundaries[boundaryId]) {
			updateStateColor(boundaryId);
			boundaryId = `${boundaryId} State`
		}

		$(window).off('resize load');
		$(window).on('resize load', () => {
			geocoderInit(boundaryId);
		});
		geocoderInit(boundaryId);
	}
	catch (err) {
		console.warn(err);
	}
}


/////////////
// Helpers //
/////////////

function overrideGeoStyle({boundaryName, style={strokeWeight:1, strokeColor:'#fff',fillOpacity:0.2}}={}) {
	if (boundaryName in stateDict) {
		let boundaryWinner = results.states[boundaryName] ? results.states[boundaryName].winner : '';

		boundariesFromGeoJsonLayer.overrideStyle(myBoundaries[boundaryName].feature, {
			strokeWeight: style.strokeWeight,
			strokeColor: style.strokeColor,
			fillColor: colorKey[boundaryWinner],
			fillOpacity: style.fillOpacity
		});
	}
}

function updateStateColor(boundaryName) {
	/*boundariesFromGeoJsonLayer.revertStyle();
	boundariesFromGeoJsonLayer.setStyle({ //using set style we can set styles for all boundaries at once
		fillColor: '#ddd',
		fillOpacity: 1
	});*/
	overrideGeoStyle({boundaryName: boundaryName, style: {fillOpacity: 0.3}});
}

function boundaryClick(e) {
	boundTheMap({boundaryId: e.feature.f.NAME});
	calcAndDisplayResults({results: results, scope: e.feature.f.NAME});
	sElEvtEmitter.emit('updateBannerText', e.feature.f.NAME);
}

function boundaryMouseOver(e) {
	boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
		strokeWeight: 3,
	});

	var boundaryName = e.feature.f.NAME;
	
	if(boundaryName) {
		$('#bname').html(boundaryName);
	}
}

function boundaryMouseOut(e) {
	boundariesFromGeoJsonLayer.overrideStyle(e.feature, {
		strokeWeight: 1
	});
	$('#bname').html('United States');
}

module.exports = {
	init
}
