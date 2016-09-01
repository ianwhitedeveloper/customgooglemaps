let $ = require('jquery');
let map = require('./map');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let getStateAndCityNameFromGeoResults = require('../lib/getStateAndCityNameFromGeoResults');
let geocoderInit = require('./AddMapBoundaries').geocoderInit;
let calcAndDisplayResults = require('./calcAndDisplayResults');
let API_URL = require('./CONSTANTS').API_URL;
let generalErrorMsg = require('./CONSTANTS').generalErrorMsg;
let searchBoxInput = $('input[name="cityzip"]');
let global = {
	markers: [],
	areaResults: {
			total_votes: 0,
			votes: {
				red: 0,
				blue: 0,
				purple: 0
			},
			scope: null
		}
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

document.addEventListener("keydown", function(event) {
	// keyCode 13 === Enter
	if (event.keyCode === 13) {
		sElEvtEmitter.emit('findAStoreClick');
	}
})

function findAStoreClick(e) {
	let searchBoxInputVal = searchBoxInput.val();
	sElEvtEmitter.emit('resetBannerCTA');

	geocoderInit({boundaryName: searchBoxInputVal}).done(getData);
}

function getData(results) {
	let result = results[0];
	let lat = result.geometry.location.lat();
	let lng = result.geometry.location.lng();
	getStateAndCityNameFromGeoResults(results)
}

function queryElectionAPI({lat, lng}={}) {
	console.log(map.getZoom());
	if (map.getZoom() >= 8) {
		deleteMarkers();
		$.get(`${API_URL}?lat=${lat}&lon=${lng}`)
		.done(plotMarkers)
		.fail(() => {
			sElEvtEmitter.emit('generalError', 'API error - please try again later');
		});
	}
}

function plotMarkers(resultsArray) {
	try {
		let bounds = new google.maps.LatLngBounds();
		let marker;

		sElEvtEmitter.emit('updateBannerText', {bannerText: resultsArray[0].city});
     	global.areaResults.scope = resultsArray[0].city;
     	
	    // Loop through our array of markers & place each one on the map  
	    for(let i = 0; i < resultsArray.length; i++ ) {
			let currentResult = resultsArray[i];
	        let position = new google.maps.LatLng(currentResult.lat, currentResult.lon);
	     	addMarker(position, currentResult);
			updateAreaResults(currentResult);
	    }

	    calcAndDisplayResults({results: global.areaResults});
	 	showMarkers();
	 	map.setZoom(10);
	 } catch (e) {
	 	sElEvtEmitter.emit('generalError', generalErrorMsg);
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

	resetAreaResults();

	google.maps.event.addListener(marker, "click", function (e) {
	    for (var i=0; i<global.markers.length; i++) {
			let currentMarker = global.markers[i];
			currentMarker.marker.setIcon(currentMarker.winner);
	    }
	    this.setIcon(customCupMarkers.activeIcon);
	    calcAndDisplayResults({results: results});
	    sElEvtEmitter.emit('storeMarkerSelected', results.address);
	});

	global.markers.push({marker: marker, winner: winner});
}

function updateAreaResults(currentResult) {
	global.areaResults.total_votes 	+= currentResult.total_votes;
	global.areaResults.votes.red 	+= currentResult.votes.red;
	global.areaResults.votes.blue 	+= currentResult.votes.blue;
	global.areaResults.votes.purple += currentResult.votes.purple;
}

function resetAreaResults() {
	global.areaResults.total_votes 	= 0;
	global.areaResults.votes.red 	= 0;
	global.areaResults.votes.blue 	= 0;
	global.areaResults.votes.purple = 0;
	global.areaResults.votes.scope 	= null;
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < global.markers.length; i++) {
		global.markers[i].marker.setMap(map);
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
	global.markers = [];
}

sElEvtEmitter.on('clearMarkers', clearMarkers);
sElEvtEmitter.on('showMarkers', showMarkers);
sElEvtEmitter.on('queryElectionAPI', queryElectionAPI);
sElEvtEmitter.on('findAStoreClick', findAStoreClick);


// $.when($.get('https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=TX')).then(drawToDOM);
/*let callbacks = {
	enableSeachBox: function enableSeachBox(areaResults) {
		$('.search_box input').prop('disabled', false);
	}
}

module.exports = function loadVoteResults({state='TX', callback=callbacks.enableSeachBox} = {}) {
    if(!global[state]) {
        global[state] = $.get(`https://api-test.7-eleven.com/v3/election/votes?sort_by=city&date=07/11/2016&state=${state}`).promise();
    } 
    global[state].done(callback);
}

if(!global[result.formatted_address]) {
	    global[result.formatted_address] = $.get(`https://api-test.7-eleven.com/v3/election/stores/?lat=${lat}&lon=${lng}`).promise();
	} 
	global[result.formatted_address].done((r) => {
		let c = global;
			debugger;
		});

*/