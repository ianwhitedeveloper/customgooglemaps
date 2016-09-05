let jQuery = require('jquery');
let $ = require('jquery');
let jQueryTextFill = require('./jquery.textfill.min.js');
let map = require('../lib/map');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let customZoomControl = require('../lib/customZoomControl');
let mapOptions = require('../lib/mapOptions');
let voteResults = require('../lib/voteResults');
let errorHandler = require('../lib/errorHandler');
let mapZoom = require('../lib/mapZoom');
let mapCenterChange = require('../lib/mapCenterChange');
let stateDict = require('../lib/stateDict');
let shareResults = require('../lib/shareResults');
let setResults = require('../lib/addMapBoundaries').setResults;
let init = require('../lib/addMapBoundaries').init;
let sElEvtEmitter = require('../lib/globals').sElEvtEmitter;
var doc = document.documentElement;
let isIE = require('../lib/CONSTANTS').isIE;
let getQueryString = require('../lib/getQueryString');
doc.setAttribute('data-useragent', isIE ? navigator.userAgent : 'evergreen');

$(document).ready(function(){
    //set your google maps parameters
	//you can use any,location as center on map startup
	//google map custom marker icon - .png fallback for IE11
	let zoomControlDiv = document.createElement('div'),
		zoomControl,
		hash = (location.href.split("#")[1] || null),
		city = getQueryString('city');

	// Force text to fit in banner regardless of length
	$('.banner').textfill({maxFontPixels: 21, widthOnly: true});

	$.when(
		$.get('external/boundariesFromGeoJson.json'), 
		$.get('external/dummyStateResults.json')
	)
	.then((usBounds, results) => {
		init({
			bounds: usBounds[0],
			results: results[0],
			scope: 'national',
			boundaryId: 'united states'
		});
		if (hash) { hash = hash.toUpperCase(); }
		if (hash && !city) {
			sElEvtEmitter.emit('geocoderInit', {boundaryName: `${stateDict[hash]} state`});
		}
		if (city && hash) {
			city = decodeURIComponent(city);
			sElEvtEmitter.emit('geocoderInit', {boundaryName: `${city}, ${stateDict[hash]}`, override: true});
		}
	})
	.fail(error => {
		sElEvtEmitter.emit('fatalError', error);
	});

	///////////////////////////////////////////////////
	//insert the zoom div on the top left of the map //
	///////////////////////////////////////////////////
	zoomControl = new customZoomControl(zoomControlDiv, map);
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);
});

  