// let geocoderInit = require('../lib/geocoderInit').geocoderInit;
let map = require('../lib/map');
let stateDict = require('../lib/stateDict');
let calcAndDisplayResults = require('../lib/calcAndDisplayResults');
let $ = require('jquery');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let colorKey = require('../lib/CONSTANTS').colorKey;
let returnCurrentMapZoomLevel = require('../lib/mapZoom').returnCurrentMapZoomLevel;
let stateMetaEl = require('../lib/CONSTANTS').stateMetaEl;
let cityMetaEl = require('../lib/CONSTANTS').cityMetaEl;
let generalErrorMsg = require('../lib/CONSTANTS').generalErrorMsg;
let getStateAndCityNameFromGeoResults = require('../lib/getStateAndCityNameFromGeoResults');
let myBoundaries = {};
let stateBlacklist = {};
// initialize boundariesFromGeoJson layer which contains the boundaries. It's possible to have multiple boundariesFromGeoJson layers on one map
let boundariesFromGeoJsonLayer = new google.maps.Data({map: map});
let infoWindow = null;
let globalResults = null;
let mapClickDisabled = false;


function init({bounds, scope, results, boundaryId}={}) {
	setResults(results);
	initializeDataLayer();
	loadBoundariesFromGeoJson({boundariesFromGeoJson: bounds, scope: scope});
	boundTheMap({boundaryId: boundaryId});
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

	calcAndDisplayResults({results: globalResults, scope: scope});
}

function initializeDataLayer(){
	boundariesFromGeoJsonLayer.addListener('click', boundaryClick);
}

function disableStateClickListener() {
	mapClickDisabled = true;
}

function enableStateClickListener() {
	mapClickDisabled = false;
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
			// Used to reset states to 0.8 opacity
			sElEvtEmitter.emit('overrideGeoStyle', {boundaryName: boundaryId, style: {strokeWeight: 4, strokeColor: '#fff', fillOpacity: 0.8}})
			boundaryId = `${boundaryId} State`
		}

		/*$(window).off('resize');
		$(window).on('resize', () => {
			geocoderInit(boundaryId);
		});*/
		geocoderInit({boundaryName: boundaryId});
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

	if (!(boundaryName in stateBlacklist) && !mapClickDisabled) {
		boundTheMap({boundaryId: boundaryName});
		calcAndDisplayResults({results: globalResults, scope: boundaryName});
		sElEvtEmitter.emit('updateBannerText', boundaryName);
		sElEvtEmitter.emit('resetBannerCTA');
	}
}

function geocoderInit({boundaryName, override=false}={}) {
	let deferred = $.Deferred();
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': `${boundaryName}, united states`}, deferred.resolve);
	deferred.then(results => {
		fitBounds({results: results, override: override});
	});
	return deferred.promise();
}

function fitBounds({results, override}) {
	getStateAndCityNameFromGeoResults(results)
	.then(data => {

		if (!(data.stateNameShort in stateBlacklist)) {
			calcAndDisplayResults({results: globalResults, scope: data.stateNameShort});
			
			sElEvtEmitter.emit('updateBannerText', {bannerText: data.stateNameLong, winner: globalResults.states[data.stateNameShort].winner});

			if (override) {
				overrideGeoStyle({boundaryName: data.stateNameShort, style: {strokeWeight: 4, strokeColor: '#fff', fillOpacity: 0.3}});
			}
		}
		else {
			sElEvtEmitter.emit('generalError', generalErrorMsg);
		}

	})
	.fail(error => { sElEvtEmitter.emit('silentError', error) });

	map.fitBounds(results[0].geometry.viewport);
}


function updateStateMeta(stateName) {
	stateMetaEl.attr('content', stateName);
}

function updateCityMeta(cityName) {
	cityMetaEl.attr('content', cityName);
}

sElEvtEmitter.on('updateStateMeta', updateStateMeta);
sElEvtEmitter.on('updateCityMeta', updateCityMeta);
sElEvtEmitter.on('overrideGeoStyle', overrideGeoStyle);
sElEvtEmitter.on('resetGeoStyle', resetGeoStyle);
sElEvtEmitter.on('geocoderInit', geocoderInit);
sElEvtEmitter.on('disableStateClickListener', disableStateClickListener);
sElEvtEmitter.on('enableStateClickListener', enableStateClickListener);

module.exports = {
	init,
	boundTheMap,
	geocoderInit
}
