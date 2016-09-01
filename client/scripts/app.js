let jQuery = require('jquery');
let $ = require('jquery');
let jQueryTextFill = require('./jquery.textfill.min.js');
let map = require('../lib/map');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let CustomZoomControl = require('../lib/CustomZoomControl');
let mapOptions = require('../lib/mapOptions');
let voteResults = require('../lib/voteResults');
let errorHandler = require('../lib/errorHandler');
let mapZoom = require('../lib/mapZoom');
let mapCenterChange = require('../lib/mapCenterChange');
let shareResults = require('../lib/shareResults');
let setResults = require('../lib/AddMapBoundaries').setResults;
let init = require('../lib/AddMapBoundaries').init;
let sElEvtEmitter = require('../lib/globals').sElEvtEmitter;
var doc = document.documentElement;
let isIE = navigator.userAgent.match('MSIE');
doc.setAttribute('data-useragent', isIE ? navigator.userAgent : 'evergreen');
$(document).ready(function(){
    //set your google maps parameters
	//you can use any,location as center on map startup
	//google map custom marker icon - .png fallback for IE11
	let	isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
		zoomControlDiv = document.createElement('div'),
		zoomControl,
		hash = (location.href.split("#")[1] || null),
		city = getQueryString('city');

	// Force text to fit in banner regardless of length
	$('.banner').textfill({maxFontPixels: 21, widthOnly: true});

	$.when(
		$.get('/external/boundariesFromGeoJson.json'), 
		$.get('/external/dummyStateResults.json')
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
			sElEvtEmitter.emit('geocoderInit', {boundaryName: hash});
		}
		if (city && hash) {
			city = decodeURIComponent(city);
			sElEvtEmitter.emit('geocoderInit', {boundaryName: `${city}, ${hash}`, override: true});
		}
	});

	///////////////////////////////////////////////////
	//insert the zoom div on the top left of the map //
	///////////////////////////////////////////////////
	zoomControl = new CustomZoomControl(zoomControlDiv, map);
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);


	/**
	 * Get the value of a querystring
	 * @param  {String} field The field to get the value of
	 * @param  {String} url   The URL to get the value from (optional)
	 * @return {String}       The field value
	 */
	function getQueryString( field, url ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
	};
});

  