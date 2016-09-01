// let geocoderInit = require('../lib/geocoderInit').geocoderInit;
let map = require('../lib/map');
let stateDict = require('../lib/stateDict');
let calcAndDisplayResults = require('../lib/calcAndDisplayResults');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let colorKey = require('../lib/CONSTANTS').colorKey;
let returnCurrentMapZoomLevel = require('../lib/mapZoom').returnCurrentMapZoomLevel;
let stateMetaEl = require('../lib/CONSTANTS').stateMetaEl;
let getStateNameFromGeoResults = require('../lib/getStateNameFromGeoResults');
let myBoundaries = {};
let stateBlacklist = {};
// initialize boundariesFromGeoJson layer which contains the boundaries. It's possible to have multiple boundariesFromGeoJson layers on one map
let boundariesFromGeoJsonLayer = new google.maps.Data({map: map});
let infoWindow = null;
let globalResults = null;


function init({bounds, scope, results, boundaryId}={}) {
	setResults(results);
	initializeDataLayer();
	// loadBoundariesFromGeoJson({boundariesFromGeoJson: bounds, scope: scope});
	loadBoundariesFromGeoJson({boundariesFromGeoJson: bounds});
	// boundTheMap({boundaryId: boundaryId, scope: scope});
}

function setResults(r) {
	globalResults = r;
}

function loadBoundariesFromGeoJson({boundariesFromGeoJson, scope} = {}) {
	//we have a collection of boundaries in geojson format
	if (boundariesFromGeoJson.type === "FeatureCollection") { 
		if (boundariesFromGeoJson.features) {
			for (var i = 0; i < boundariesFromGeoJson.features.length; i++) {
				var boundaryId = i + 1;
				var new_boundary = {};
				var boundaryName = boundariesFromGeoJson.features[i].properties.NAME;

				if (!boundariesFromGeoJson.features[i].properties) { 
					boundariesFromGeoJson.features[i].properties = {};
				}

				//we will use this id to identify boundary later when clicking on it
				boundariesFromGeoJson.features[i].properties.boundaryId = boundaryId; 
				boundariesFromGeoJsonLayer.addGeoJson(boundariesFromGeoJson.features[i], {idPropertyName: 'boundaryId'});
				new_boundary.feature = boundariesFromGeoJsonLayer.getFeatureById(boundaryId);
				myBoundaries[boundaryName] = new_boundary;

				addToBlacklist({
					blackListObject: stateBlacklist,
					condition: globalResults.states[boundaryName] ? globalResults.states[boundaryName].winner === "null" : false,
					key: boundaryName
				});

				overrideGeoStyle({boundaryName: boundaryName, style: {strokeWeight: 2, strokeColor: '#fff', fillOpacity: 0.8}});
			}
		}
	}

	// calcAndDisplayResults({results: globalResults, scope: scope});
}

function initializeDataLayer(){
	boundariesFromGeoJsonLayer.addListener('click', boundaryClick);
}

function boundTheMap({boundaryId, scope} = {}) { //we can listen for a boundary click and identify boundary based on e.feature.getProperty('boundaryId'); we set when adding boundary to boundariesFromGeoJson layer
	try {
		/*This means we've found a state
		so now update state color
		and append 'State' to name
		because Google isn't smart enough 
		in certain situations e.g. new york will
		show NYC, not NY, the state*/
		if (myBoundaries[boundaryId]) {
			// Used to reset states to 0.8 opacity
			sElEvtEmitter.emit('overrideGeoStyle', {boundaryName: boundaryId, style: {strokeWeight: 4, strokeColor: '#fff', fillOpacity: 0.8}})
			boundaryId = `${boundaryId} State`
		}

		$(window).off('resize load');
		$(window).on('resize load', () => {
			geocoderInit(boundaryId);
		});
		geocoderInit(boundaryId);
	}
	catch (error) {
		sElEvtEmitter.emit('generalError', error);
	}
}


/////////////
// Helpers //
/////////////
function addToBlacklist({condition, blackListObject, key}={}) {
	if (condition) {
		blackListObject[key] = true;
	}
}

function resetGeoStyle() {
	for (let boundaryName in myBoundaries) {
	    if (myBoundaries.hasOwnProperty(boundaryName)) {
	    	boundariesFromGeoJsonLayer.overrideStyle(myBoundaries[boundaryName].feature, {strokeWeight: 2, strokeColor:'#fff',fillOpacity:0.8})
	    }
	}
}

function overrideGeoStyle({boundaryName, style}={}) {
	if (boundaryName in stateDict) {

		sElEvtEmitter.emit('resetGeoStyle');
		
		let boundaryWinner = globalResults.states[boundaryName] ? globalResults.states[boundaryName].winner : '';

		boundariesFromGeoJsonLayer.overrideStyle(myBoundaries[boundaryName].feature, {
			strokeWeight: style.strokeWeight,
			strokeColor: style.strokeColor,
			fillColor: colorKey[boundaryWinner] || '#ddd',
			fillOpacity: style.fillOpacity
		});
	}
}

function boundaryClick(e) {
	let boundaryName = e.feature.f.NAME;

	if (!(boundaryName in stateBlacklist)) {
		boundTheMap({boundaryId: boundaryName, scope: boundaryName});
		calcAndDisplayResults({results: globalResults, scope: boundaryName});
		sElEvtEmitter.emit('updateBannerText', boundaryName);
		sElEvtEmitter.emit('resetBannerCTA');
	}
}

function geocoderInit(boundaryName) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}, united states`}, deferred.resolve);
	deferred.then(fitBounds);
	return deferred.promise();
}

function fitBounds(results) {
	getStateNameFromGeoResults(results)
	.then(data => {
        sElEvtEmitter.emit('updateStateMeta', data.stateNameShort);
		sElEvtEmitter.emit('updateBannerText', {bannerText: data.stateNameLong, winner: globalResults.states[data.stateNameShort].winner});
		calcAndDisplayResults({results: globalResults, scope: data.stateNameShort});
	})
	.fail(error => { sElEvtEmitter.emit('silentError', error) });

	map.fitBounds(results[0].geometry.viewport);
}


function updateStateMeta(stateName) {
	stateMetaEl.attr('content', stateName);
}

sElEvtEmitter.on('updateStateMeta', updateStateMeta);
sElEvtEmitter.on('overrideGeoStyle', overrideGeoStyle);
sElEvtEmitter.on('resetGeoStyle', resetGeoStyle);

module.exports = {
	init,
	boundTheMap,
	geocoderInit
}
