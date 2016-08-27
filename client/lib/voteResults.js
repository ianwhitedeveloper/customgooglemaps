let $ = require('jquery');
let map = require('./map');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let geocoderInit = require('./geocoderInit');
let calcAndDisplayResults = require('./calcAndDisplayResults');
let API_URL = require('./CONSTANTS').API_URL;
let searchBoxInput = $('input[name="cityzip"]');
let cache = {
	markers: []
};

let customCupMarkers = {
	blue: {
		url: 'imgs/cup-blue.svg',
		// This marker is 32 pixels wide by 32 pixels tall.
		size: new google.maps.Size(32, 56),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 0,32.
		anchor: new google.maps.Point(0, 56)
	},
	red: {
		url: 'imgs/cup-red.svg',
		size: new google.maps.Size(32, 56),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0, 56)
	},
	purple: {
		url: 'imgs/cup-purp.svg',
		size: new google.maps.Size(32, 56),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0, 56)
	},
	activeIcon: {
		url: 'imgs/cup-active.svg',
		size: new google.maps.Size(32, 56),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0, 56)
	}
}


$('body').on('click', '#findAStore', findAStoreClick);

function findAStoreClick(e) {
	let searchBoxInputVal = searchBoxInput.val();

	geocoderInit(searchBoxInputVal)
	.done(getData);
}

function getData(resultsArray) {
	let result = resultsArray[0];
	let lat = result.geometry.location.lat();
	let lng = result.geometry.location.lng();
	deleteMarkers();
	$.get(`${API_URL}?lat=${lat}&lon=${lng}`)
		.done(plotMarkers);
}

function plotMarkers(resultsArray) {
	try {
		let bounds = new google.maps.LatLngBounds();
		let marker;
		sElEvtEmitter.emit('updateBannerText', {bannerText: resultsArray[0].city});
	    // Loop through our array of markers & place each one on the map  
	    for(let i = 0; i < resultsArray.length; i++ ) {
			let currentResult = resultsArray[i];
	        let position = new google.maps.LatLng(currentResult.lat, currentResult.lon);
	     	addMarker(position, currentResult);
	    }
	 	showMarkers();
	 } catch (e) {
	 	sElEvtEmitter.emit('generalError', e);
	 }
}

/////////////////////////////////////////////////////
// Helpers                                         //
// Adds a marker to the map and push to the array. //
/////////////////////////////////////////////////////
function addMarker(position, results) {
	let winner = customCupMarkers[results.winner];
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		icon: winner
	});

	google.maps.event.addListener(marker, "click", function (e) {
		// debugger;
	    for (var i=0; i<cache.markers.length; i++) {
			let currentMarker = cache.markers[i];
			currentMarker.marker.setIcon(currentMarker.winner);
	    }
	    this.setIcon(customCupMarkers.activeIcon);
	    calcAndDisplayResults({results: results});

	});
	cache.markers.push({marker: marker, winner: winner});
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < cache.markers.length; i++) {
		cache.markers[i].marker.setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
	setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	cache.markers = [];
}

sElEvtEmitter.on('clearMarkers', clearMarkers);
sElEvtEmitter.on('showMarkers', showMarkers);


// $.when($.get('https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=TX')).then(drawToDOM);
/*let callbacks = {
	enableSeachBox: function enableSeachBox(res) {
		$('.search_box input').prop('disabled', false);
	}
}

module.exports = function loadVoteResults({state='TX', callback=callbacks.enableSeachBox} = {}) {
    if(!cache[state]) {
        cache[state] = $.get(`https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=${state}`).promise();
    } 
    cache[state].done(callback);
}

if(!cache[result.formatted_address]) {
	    cache[result.formatted_address] = $.get(`https://api-test.7-eleven.com/v3/election/stores/?lat=${lat}&lon=${lng}`).promise();
	} 
	cache[result.formatted_address].done((r) => {
		let c = cache;
			debugger;
		});

*/