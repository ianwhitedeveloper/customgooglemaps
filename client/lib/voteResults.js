let isIE11 = require('./CONSTANTS').isIE11;
let $ = require('jquery');
let map = require('./map');
let sElEvtEmitter = require('./globals').sElEvtEmitter;
let getStateAndCityNameFromGeoResults = require('../lib/getStateAndCityNameFromGeoResults');
let geocoderInit = require('./addMapBoundaries').geocoderInit;
let calcAndDisplayResults = require('./calcAndDisplayResults');
let API_URL = require('./CONSTANTS').API_URL;
let generalErrorMsg = require('./CONSTANTS').generalErrorMsg;
let searchBoxInput = $('input[name="cityzip"]');
let STATE_ZOOM_LVL = require('./CONSTANTS').STATE_ZOOM_LVL;
let global = {
	markers: [],
	areaResults: {}
};

let cupBlueImg 		= (isIE11) ? 'imgs/cup-blue.png' : 'imgs/cup-blue.svg';
let cupRedImg 		= (isIE11) ? 'imgs/cup-red.png' : 'imgs/cup-red.svg';
let cupPurpleImg 	= (isIE11) ? 'imgs/cup-purp.png' : 'imgs/cup-purp.svg';
let cupActiveImg 	= (isIE11) ? 'imgs/cup-active.png' : 'imgs/cup-active.svg';

let customCupMarkers = {
	blue: {
		url: cupBlueImg,
		// This marker is 32 pixels wide by 49 pixels tall.
		size: new google.maps.Size(32, 49),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 0,49.
		anchor: new google.maps.Point(0, 49)
	},
	red: {
		url: cupRedImg,
		size: new google.maps.Size(32, 49),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0, 49)
	},
	purple: {
		url: cupPurpleImg,
		size: new google.maps.Size(32, 49),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0, 49)
	},
	activeIcon: {
		url: cupActiveImg,
		size: new google.maps.Size(32, 49),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0, 49)
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

	geocoderInit({boundaryName: searchBoxInputVal})
	.done(getStateAndCityNameFromGeoResults);
}

function queryElectionAPI({lat, lng}={}) {
	if (map.getZoom() > STATE_ZOOM_LVL) {
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
		let cityName = resultsArray[0].city.toLowerCase();
		let marker;
		// Reset results
		global.areaResults = {};

		sElEvtEmitter.emit('updateCityMeta', cityName);
		sElEvtEmitter.emit('updateBannerText', {bannerText: cityName});

	    // Loop through our array of markers & place each one on the map  
	    resultsArray.forEach(result => {
	        let position = new google.maps.LatLng(result.lat, result.lon);

	     	addMarker(position, result);
			updateAreaResults(result, cityName);
	    });
	    calculateWinner(cityName);
	    calcAndDisplayResults({results: global.areaResults[cityName]});
	 	showMarkers();
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

function calculateWinner(cityName) {
	let votes = global.areaResults[cityName].votes;

	Object
	.keys(votes)
	.reduce((a, b) => { 
		return votes[a] > votes[b] 
			? global.areaResults[cityName].winner = a 
			: global.areaResults[cityName].winner = b;
	});
}

function updateAreaResults(result, cityName) {
	if (!global.areaResults[cityName]) {
	    global.areaResults[cityName] = {
	        total_votes: result.total_votes,
	        votes: result.votes
	    };
	} else {
	    global.areaResults[cityName].total_votes     += result.total_votes;
	    global.areaResults[cityName].votes.red       += result.votes.red;
	    global.areaResults[cityName].votes.blue      += result.votes.blue;
	    global.areaResults[cityName].votes.purple    += result.votes.purple;
	}
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < global.markers.length; i++) {
		global.markers[i].marker.setMap(map);

		var zInd = google.maps.Marker.MAX_ZINDEX;

		google.maps.event.addListener(global.markers[i].marker, "click", function (e) {
		    zInd++;
		    this.setZIndex(zInd);
		});
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