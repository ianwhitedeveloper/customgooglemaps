let jQuery = require('jquery');
let $ = require('jquery');
let map = require('../lib/map');
let defaultLatitudeLongitude = require('../lib/defaultLatitudeLongitude');
let CustomZoomControl = require('../lib/CustomZoomControl');
let mapOptions = require('../lib/mapOptions');
let voteResults = require('../lib/voteResults');
let setResults = require('../lib/AddMapBoundaries').setResults;
let init = require('../lib/AddMapBoundaries').init;

$(document).ready(function(){
	let stateDropdown = require('../lib/stateDropdown');
	    //set your google maps parameters
		//you can use any,location as center on map startup
		//google map custom marker icon - .png fallback for IE11
	let	isInternetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1,
		zoomControlDiv = document.createElement('div'),
		zoomControl,
		hash = (location.href.split("#")[1] || null);
	

	$.when(
		$.get('/external/boundariesFromGeoJson.json'), 
		$.get('/external/dummyStateResults.json')
	)
	.then((usBounds, results) => {
		if (hash) { hash = hash.toUpperCase(); }
		init({
			bounds: usBounds[0],
			results: results[0],
			scope: hash || 'national',
			boundaryId: hash || 'united states'
		});
	});

	///////////////////////////////////////////////////
	//insert the zoom div on the top left of the map //
	///////////////////////////////////////////////////
	zoomControl = new CustomZoomControl(zoomControlDiv, map);
	map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomControlDiv);
});

  